import { graniteEvent, Screen, Share } from '@apps-in-toss/web-framework'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Dialog } from './components/Dialog'
import { IntroScreen } from './components/IntroScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { MyChemistryScreen } from './components/MyChemistryScreen'
import { QuestionScreen } from './components/QuestionScreen'
import { ResultScreen } from './components/ResultScreen'
import { ShareScreen } from './components/ShareScreen'
import { PERSONAS } from './data/personas'
import { QUESTIONS } from './data/questions'
import { generateChemistryCode, visitChemistry } from './lib/chemistryApi'
import {
  getReferralCodeFromUrl,
  getStoredCard,
  getStoredSharerCode,
  getStoredSharerNickname,
  storeCard,
  storeSharerCode,
  storeSharerNickname,
} from './lib/chemistryStorage'
import { computeResult } from './lib/scoring'
import type { ChemistryVisitState, DialogState, ElementType } from './types'

type AppScreen = 'intro' | 'question' | 'loading' | 'result' | 'share' | 'my-chemistry'

// apps-in-toss.config.ts의 appName과 같은 값이에요.
const SHARE_PATH = 'intoss://ai-persona-card'

function App() {
  // 저장된 카드가 있으면 인트로/질문을 건너뛰고 바로 결과 화면으로 들어가요.
  const [savedCard] = useState(() => getStoredCard())
  const [screen, setScreen] = useState<AppScreen>(savedCard ? 'result' : 'intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<ElementType[]>(savedCard?.answers ?? [])
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  // "내 케미 모아보기"를 결과 화면/공유 화면 중 어디서 열었는지 기억해서, 뒤로가기를 그 화면으로 보내요.
  const [myChemistryOrigin, setMyChemistryOrigin] = useState<'result' | 'share'>('share')

  // 케미(궁합) 기능: 친구 링크로 들어왔는지, 내 공유 코드가 있는지, 방문 조회 상태예요.
  const [referralCode] = useState<string | null>(() => getReferralCodeFromUrl())
  const [sharerCode, setSharerCode] = useState<string | null>(() => getStoredSharerCode())
  const [chemistry, setChemistry] = useState<ChemistryVisitState>({ status: 'idle' })
  // 닉네임 입력/건너뛰기를 아직 선택하지 않았으면 null이에요. 케미 조회는 이 선택 이후에 시작해요.
  const [visitorNickname, setVisitorNickname] = useState<string | null>(null)
  const [nicknameDecided, setNicknameDecided] = useState(false)

  // 공유자(나) 본인 닉네임: 이전에 남긴 값이 있으면 그대로 쓰고, 없으면 결과 화면에서 한 번 물어봐요.
  const [sharerNickname, setSharerNickname] = useState<string | null>(() => getStoredSharerNickname())
  const [sharerNicknameDecided, setSharerNicknameDecided] = useState(
    () => getStoredSharerNickname() !== null,
  )

  const result = useMemo(() => computeResult(answers), [answers])
  const persona = useMemo(() => PERSONAS[result.personaKey], [result.personaKey])

  const startQuiz = () => {
    setAnswers([])
    setQuestionIndex(0)
    setChemistry({ status: 'idle' })
    setVisitorNickname(null)
    setNicknameDecided(false)
    setScreen('question')
  }

  // 친구 링크로 들어온 상태에서 카드를 완성하고(결과 화면 도달) 닉네임을 선택하면 케미 조회를 한 번 호출해요.
  useEffect(() => {
    if (screen !== 'result') return
    if (!referralCode) return
    if (!nicknameDecided) return
    if (chemistry.status !== 'idle') return

    setChemistry({ status: 'loading' })
    visitChemistry(referralCode, persona.key, visitorNickname)
      .then((data) => setChemistry({ status: 'success', data }))
      .catch((error: unknown) => {
        console.error('케미 결과를 확인하지 못했어요', error)
        setChemistry({ status: 'error' })
      })
  }, [screen, referralCode, persona.key, chemistry.status, nicknameDecided, visitorNickname])

  const handleNicknameSubmit = (nickname: string) => {
    setVisitorNickname(nickname)
    setNicknameDecided(true)
  }

  const handleNicknameSkip = () => {
    setVisitorNickname(null)
    setNicknameDecided(true)
  }

  const handleSharerNicknameSubmit = (nickname: string) => {
    setSharerNickname(nickname)
    storeSharerNickname(nickname)
    setSharerNicknameDecided(true)
  }

  const handleSharerNicknameSkip = () => {
    setSharerNicknameDecided(true)
  }

  // 질문을 다 풀고 로딩이 끝나면 결과를 저장해요. 다시 만들면 이 시점에 이전 저장 값을 덮어써요.
  const finishQuiz = () => {
    storeCard({ personaKey: result.personaKey, answers: result.answers, completedAt: new Date().toISOString() })
    setScreen('result')
  }

  const selectAnswer = (element: ElementType) => {
    const nextAnswers = [...answers, element]
    setAnswers(nextAnswers)
    setTimeout(() => {
      if (questionIndex + 1 < QUESTIONS.length) {
        setQuestionIndex((index) => index + 1)
      } else {
        setScreen('loading')
      }
    }, 260)
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      let code = sharerCode
      if (!code) {
        try {
          const generated = await generateChemistryCode(persona.key, sharerNickname)
          code = generated.sharerCode
          storeSharerCode(code)
          setSharerCode(code)
        } catch (error) {
          // 케미 코드 발급이 실패해도 카드 공유 자체는 그대로 진행해요.
          console.error('케미 공유 코드를 발급받지 못했어요', error)
        }
      }

      const path = code ? `${SHARE_PATH}?ref=${code}` : SHARE_PATH
      const link = await Share.createLink({ path })
      await Share.sendMessage({
        message: `AI 페르소나 카드에서 내 원소 타입을 확인해봐요! ${link}`,
      })
    } catch (error) {
      console.error('공유 시트를 여는 중 오류가 발생했어요', error)
      setDialog({ kind: 'share-error' })
    } finally {
      setIsSharing(false)
    }
  }

  // 하드웨어 뒤로가기를 화면별로 제어해요. 인트로에서는 미니앱을 종료하고,
  // 다이얼로그가 열려 있으면 다이얼로그부터 닫아요.
  useEffect(() => {
    const unsubscribe = graniteEvent.addEventListener('backEvent', {
      onEvent: () => {
        if (dialog) {
          setDialog(null)
          return
        }
        if (screen === 'intro') {
          void Screen.close()
          return
        }
        if (screen === 'loading') {
          return
        }
        if (screen === 'share') {
          setScreen('result')
          return
        }
        if (screen === 'my-chemistry') {
          setScreen(myChemistryOrigin)
          return
        }
        setScreen('intro')
      },
      onError: (error) => {
        console.error('뒤로가기 이벤트를 처리하지 못했어요', error)
      },
    })

    return unsubscribe
  }, [screen, dialog, myChemistryOrigin])

  return (
    <div className="app">
      {screen === 'intro' && <IntroScreen onStart={startQuiz} hasReferral={!!referralCode} />}

      {screen === 'question' && (
        <QuestionScreen
          question={QUESTIONS[questionIndex]}
          questionIndex={questionIndex}
          totalQuestions={QUESTIONS.length}
          selectedElement={answers[questionIndex] ?? null}
          onSelect={selectAnswer}
        />
      )}

      {screen === 'loading' && <LoadingScreen onComplete={finishQuiz} />}

      {screen === 'result' && (
        <ResultScreen
          persona={persona}
          seed={result.seed}
          answers={result.answers}
          onShare={handleShare}
          onRetake={startQuiz}
          onGoShare={() => setScreen('share')}
          isVisitor={!!referralCode}
          chemistry={chemistry}
          needsNickname={!!referralCode && !nicknameDecided}
          onSubmitNickname={handleNicknameSubmit}
          onSkipNickname={handleNicknameSkip}
          needsSharerNickname={!referralCode && !sharerCode && !sharerNicknameDecided}
          onSubmitSharerNickname={handleSharerNicknameSubmit}
          onSkipSharerNickname={handleSharerNicknameSkip}
          hasSharerCode={!!sharerCode}
          onGoMyChemistry={() => {
            setMyChemistryOrigin('result')
            setScreen('my-chemistry')
          }}
        />
      )}

      {screen === 'share' && (
        <ShareScreen
          isSharing={isSharing}
          onShare={handleShare}
          onGoHome={() => setScreen('intro')}
          hasSharerCode={!!sharerCode}
          onGoMyChemistry={() => {
            setMyChemistryOrigin('share')
            setScreen('my-chemistry')
          }}
        />
      )}

      {screen === 'my-chemistry' && sharerCode && (
        <MyChemistryScreen sharerCode={sharerCode} onBack={() => setScreen(myChemistryOrigin)} />
      )}

      {dialog?.kind === 'share-error' && (
        <Dialog
          eyebrow="공유 안내"
          title="곧 다시 공유할 수 있어요"
          description="일시적인 문제로 공유 시트를 열지 못했어요. 잠시 후 다시 시도하면 공유할 수 있어요."
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}

export default App
