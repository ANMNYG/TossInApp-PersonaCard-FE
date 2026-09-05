import { PERSONAS } from '../data/personas'
import { TYPE_COMPATIBILITY } from '../lib/interpretation'
import type { Persona } from '../types'

export interface CompatibilityInsightsProps {
  persona: Persona
}

/** "이런 사람과는" 궁합 섹션이에요. 재미 요소로 가볍게 보는 정적 콘텐츠예요. */
export function CompatibilityInsights({ persona }: CompatibilityInsightsProps) {
  const compatibility = TYPE_COMPATIBILITY[persona.key]

  return (
    <div
      className="interpretation-box compat-box"
      style={{
        background: `${persona.colors[0]}1a`,
        borderColor: `${persona.colors[0]}40`,
      }}
    >
      <div className="interpretation-body">
        <div className="interpretation-title">이런 사람과는</div>
        <div className="compat-group">
          <span className="compat-group-title">✦ 잘 맞아요</span>
          {compatibility.good.map((match) => (
            <p className="compat-item" key={match.key}>
              <span className="compat-item-name">{PERSONAS[match.key].title}</span>
              {match.reason}
            </p>
          ))}
        </div>
        <div className="compat-group">
          <span className="compat-group-title compat-group-title-bad">✦ 안 맞을 수도 있어요</span>
          {compatibility.bad.map((match) => (
            <p className="compat-item" key={match.key}>
              <span className="compat-item-name">{PERSONAS[match.key].title}</span>
              {match.reason}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
