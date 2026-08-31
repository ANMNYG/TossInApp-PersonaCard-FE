import { PERSONAS } from '../data/personas'
import { personaIcon } from '../lib/interpretation'
import { josa } from '../lib/korean'
import type { ChemistryVisitResult } from '../types'

export interface ChemistryResultProps {
  result: ChemistryVisitResult
}

/**
 * 상대(공유자)를 부르는 이름이에요. 백엔드가 sharerNickname을 내려주면 "민*님",
 * 아직 안 내려주면 "OO 타입의 친구"로 자연스럽게 대체해요.
 */
function fullSharerLabel(result: ChemistryVisitResult): string {
  if (result.sharerNickname) return `${result.sharerNickname}님`
  return `${PERSONAS[result.sharerType].title} 타입의 친구`
}

/** 아이콘 밑이나 짧은 문장에 쓰는 축약형이에요. */
function shortSharerLabel(result: ChemistryVisitResult): string {
  return result.sharerNickname ? `${result.sharerNickname}님` : '친구'
}

/** 친구 링크로 들어와 카드를 완성한 뒤, 결과 화면에 추가로 보여주는 궁합 섹션이에요. */
export function ChemistryResult({ result }: ChemistryResultProps) {
  const sharer = PERSONAS[result.sharerType]
  const visitor = PERSONAS[result.visitorType]
  const { score, description } = result.compatibility

  const fullLabel = fullSharerLabel(result)
  const shortLabel = shortSharerLabel(result)

  return (
    <div className="chemistry-box">
      <div className="chemistry-title">✦ 케미 결과</div>

      <p className="chemistry-headline">
        {josa(fullLabel, '과', '와')} 나의 케미는 <strong>{score}점</strong>이에요!
      </p>
      <p className="chemistry-sharer-card">
        {shortLabel}의 카드: <strong>{sharer.title}</strong>
      </p>

      <div className="chemistry-pair">
        <div className="chemistry-avatar" style={{ background: `${sharer.colors[0]}22` }}>
          <span className="chemistry-avatar-icon" aria-hidden="true">
            {personaIcon(sharer)}
          </span>
          <span className="chemistry-avatar-label">{shortLabel}</span>
          <span className="chemistry-avatar-sub">{sharer.title}</span>
        </div>
        <div className="chemistry-score">
          {score}
          <span className="chemistry-score-unit">점</span>
        </div>
        <div className="chemistry-avatar" style={{ background: `${visitor.colors[0]}22` }}>
          <span className="chemistry-avatar-icon" aria-hidden="true">
            {personaIcon(visitor)}
          </span>
          <span className="chemistry-avatar-label">나</span>
          <span className="chemistry-avatar-sub">{visitor.title}</span>
        </div>
      </div>
      <p className="chemistry-desc">{description}</p>
    </div>
  )
}
