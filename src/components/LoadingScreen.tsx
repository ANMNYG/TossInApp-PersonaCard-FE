import { useEffect, useState } from 'react'

const LOADING_TEXTS = [
  '답변을 분석하고 있어요',
  '원소 기운을 계산하고 있어요',
  '나만의 색을 조합하고 있어요',
  '카드를 그리고 있어요',
]

export interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let percentNow = 0
    let doneTimeout: ReturnType<typeof setTimeout> | undefined

    const interval = setInterval(() => {
      percentNow = Math.min(100, percentNow + Math.floor(Math.random() * 18) + 8)
      setPercent(percentNow)
      if (percentNow >= 100) {
        clearInterval(interval)
        doneTimeout = setTimeout(onComplete, 260)
      }
    }, 260)

    return () => {
      clearInterval(interval)
      if (doneTimeout) clearTimeout(doneTimeout)
    }
  }, [onComplete])

  const text = LOADING_TEXTS[Math.min(Math.floor(percent / 26), LOADING_TEXTS.length - 1)]

  return (
    <div className="screen screen-loading">
      <div className="loading-wrap">
        <div className="ring" />
        <div className="loading-pct">{percent}%</div>
        <div className="loading-text">{text}</div>
      </div>
    </div>
  )
}
