import { useMemo, useState } from 'react'
import './App.css'
import { Dialog } from './components/Dialog'
import { IntroScreen } from './components/IntroScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { QuestionScreen } from './components/QuestionScreen'
import { ResultScreen } from './components/ResultScreen'
import { ShareScreen } from './components/ShareScreen'
import { PERSONAS } from './data/personas'
import { QUESTIONS } from './data/questions'
import { computeScores, computeSeed, getTopElement } from './lib/scoring'
import type { DialogState, ElementType } from './types'

type Screen = 'intro' | 'question' | 'loading' | 'result' | 'share'

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<ElementType[]>([])
  const [highQuality, setHighQuality] = useState(false)
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const scores = useMemo(() => computeScores(answers), [answers])
  const persona = useMemo(() => PERSONAS[getTopElement(scores)], [scores])
  const seed = useMemo(() => computeSeed(scores), [scores])

  const startQuiz = () => {
    setAnswers([])
    setQuestionIndex(0)
    setHighQuality(false)
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
          onExit={() => setScreen('intro')}
        />
      )}

      {screen === 'loading' && <LoadingScreen onComplete={() => setScreen('result')} />}

      {screen === 'result' && (
        <ResultScreen
          persona={persona}
          seed={seed}
          highQuality={highQuality}
          onSave={() => setDialog({ kind: 'payment' })}
          onRetake={startQuiz}
          onGoShare={() => setScreen('share')}
        />
      )}

      {screen === 'share' && (
        <ShareScreen
          onShare={(channelPhrase) => setDialog({ kind: 'share', channelPhrase })}
          onSubscribe={() => setDialog({ kind: 'subscription' })}
          onGoHome={() => setScreen('intro')}
        />
      )}

      {dialog?.kind === 'payment' && (
        <Dialog
          eyebrow="결제 시뮬레이션"
          title="고화질 카드를 저장해요"
          description="500원을 결제하면 워터마크 없는 고화질 카드를 저장할 수 있어요. 지금은 흐름만 확인하는 프로토타입이에요."
          onClose={() => setDialog(null)}
          primaryLabel="500원 결제하고 저장해요"
          onPrimary={() => {
            setHighQuality(true)
            setDialog(null)
          }}
        />
      )}

      {dialog?.kind === 'subscription' && (
        <Dialog
          eyebrow="구독 시뮬레이션"
          title="매주 새 테마 카드를 받아요"
          description="구독하면 매주 새로운 테마로 카드를 받을 수 있어요. 지금은 흐름만 확인하는 프로토타입이에요."
          onClose={() => setDialog(null)}
          primaryLabel="구독 시작하고 진행해요"
          onPrimary={() => setDialog(null)}
        />
      )}

      {dialog?.kind === 'share' && (
        <Dialog
          eyebrow="공유 시뮬레이션"
          title={`곧 ${dialog.channelPhrase} 공유할 수 있어요`}
          description="앱인토스 공유 SDK가 연결되면 이 화면에서 바로 공유할 수 있어요."
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}

export default App
