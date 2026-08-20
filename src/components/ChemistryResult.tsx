import { PERSONAS } from '../data/personas'
import { personaIcon } from '../lib/interpretation'
import type { ChemistryVisitResult } from '../types'

export interface ChemistryResultProps {
  result: ChemistryVisitResult
}

/** 친구 링크로 들어와 카드를 완성한 뒤, 결과 화면에 추가로 보여주는 궁합 섹션이에요. */
export function ChemistryResult({ result }: ChemistryResultProps) {
  const sharer = PERSONAS[result.sharerType]
  const visitor = PERSONAS[result.visitorType]

  return (
    <div className="chemistry-box">
      <div className="chemistry-title">✦ 케미 결과</div>
      <div className="chemistry-pair">
        <div className="chemistry-avatar" style={{ background: `${sharer.colors[0]}22` }}>
          <span className="chemistry-avatar-icon" aria-hidden="true">
            {personaIcon(sharer)}
          </span>
          <span className="chemistry-avatar-label">{sharer.title}</span>
        </div>
        <div className="chemistry-score">
          {result.compatibility.score}
          <span className="chemistry-score-unit">점</span>
        </div>
        <div className="chemistry-avatar" style={{ background: `${visitor.colors[0]}22` }}>
          <span className="chemistry-avatar-icon" aria-hidden="true">
            {personaIcon(visitor)}
          </span>
          <span className="chemistry-avatar-label">{visitor.title}</span>
        </div>
      </div>
      <p className="chemistry-desc">{result.compatibility.description}</p>
    </div>
  )
}
