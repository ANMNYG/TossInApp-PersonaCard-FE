import { graniteEvent, Screen, Share } from '@apps-in-toss/web-framework'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Dialog } from './components/Dialog'
import { IntroScreen } from './components/IntroScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { QuestionScreen } from './components/QuestionScreen'
import { ResultScreen } from './components/ResultScreen'
import { ShareScreen } from './components/ShareScreen'
import { PERSONAS } from './data/personas'
import { QUESTIONS } from './data/questions'
import { computeScores, computeSeed, getPersonaTypeKey } from './lib/scoring'
import type { DialogState, ElementType } from './types'

type AppScreen = 'intro' | 'question' | 'loading' | 'result' | 'share'

// apps-in-toss.config.ts의 appName과 같은 값이에요.
const SHARE_PATH = 'intoss://ai-persona-card'

function App() {
  const [screen, setScreen] = useState<AppScreen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<ElementType[]>([])
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const scores = useMemo(() => computeScores(answers), [answers])
  const persona = useMemo(() => PERSONAS[getPersonaTypeKey(scores)], [scores])
  const seed = useMemo(() => computeSeed(scores), [scores])

  const startQuiz = () => {
    setAnswers([])
    setQuestionIndex(0)
    setScreen('question')
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
      const link = await Share.createLink({ path: SHARE_PATH })
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
        setScreen('intro')
      },
      onError: (error) => {
        console.error('뒤로가기 이벤트를 처리하지 못했어요', error)
      },
    })

    return unsubscribe
  }, [screen, dialog])

  return (
    <div className="app">
      {screen === 'intro' && <IntroScreen onStart={startQuiz} />}

      {screen === 'question' && (
        <QuestionScreen
          question={QUESTIONS[questionIndex]}
          questionIndex={questionIndex}
          totalQuestions={QUESTIONS.length}
          selectedElement={answers[questionIndex] ?? null}
          onSelect={selectAnswer}
        />
      )}

      {screen === 'loading' && <LoadingScreen onComplete={() => setScreen('result')} />}

      {screen === 'result' && (
        <ResultScreen
          persona={persona}
          seed={seed}
          onShare={handleShare}
          onRetake={startQuiz}
          onGoShare={() => setScreen('share')}
        />
      )}

      {screen === 'share' && (
        <ShareScreen isSharing={isSharing} onShare={handleShare} onGoHome={() => setScreen('intro')} />
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
