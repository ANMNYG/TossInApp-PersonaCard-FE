import type { Persona } from '../types'
import { ResultCard } from './ResultCard'

export interface ResultScreenProps {
  persona: Persona
  seed: number
  highQuality: boolean
  onSave: () => void
  onRetake: () => void
  onGoShare: () => void
}

export function ResultScreen({
  persona,
  seed,
  highQuality,
  onSave,
  onRetake,
  onGoShare,
}: ResultScreenProps) {
  return (
    <div className="screen screen-result">
      <ResultCard persona={persona} seed={seed} highQuality={highQuality} />
      <div className="eyebrow">{persona.tagEn}</div>
      <div className="persona-title">{persona.title}</div>
      <p className="persona-desc">{persona.description}</p>
      <button type="button" className="btn" onClick={onSave}>
        워터마크 없이 저장해요 · 500원
      </button>
      <div className="btn-row">
        <button type="button" className="btn-outline" onClick={onRetake}>
          다시 만들어요
        </button>
        <button type="button" className="btn-outline" onClick={onGoShare}>
          공유하러 가요
        </button>
      </div>
    </div>
  )
}
