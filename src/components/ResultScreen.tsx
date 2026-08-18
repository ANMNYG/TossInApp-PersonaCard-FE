import { useRef } from 'react'
import type { Persona } from '../types'
// 광고 붙이기 전까지 임시 비활성화. 다시 켤 때는 아래 import와 <AdSlot />을 되살리세요.
// import { AdSlot } from './AdSlot'
import { ResultCard, type ResultCardHandle } from './ResultCard'

export interface ResultScreenProps {
  persona: Persona
  seed: number
  onRetake: () => void
  onGoShare: () => void
}

export function ResultScreen({ persona, seed, onRetake, onGoShare }: ResultScreenProps) {
  const cardRef = useRef<ResultCardHandle>(null)

  const handleSave = () => {
    const dataUrl = cardRef.current?.getDataUrl()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${persona.title}-persona-card.png`
    link.click()
  }

  return (
    <div className="screen screen-result">
      <ResultCard ref={cardRef} persona={persona} seed={seed} />
      <div className="eyebrow">{persona.tagEn}</div>
      <div className="persona-title">{persona.title}</div>
      <p className="persona-desc">{persona.description}</p>
      <button type="button" className="btn" onClick={handleSave}>
        고화질로 저장해요
      </button>
      <div className="btn-row">
        <button type="button" className="btn-outline" onClick={onRetake}>
          다시 만들어요
        </button>
        <button type="button" className="btn-outline" onClick={onGoShare}>
          공유하러 가요
        </button>
      </div>
      {/* <AdSlot screen="result" /> */}
    </div>
  )
}
