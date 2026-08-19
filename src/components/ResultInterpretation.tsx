import { useMemo } from 'react'
import { buildInterpretation, elementIcon } from '../lib/interpretation'
import type { ElementType, Persona } from '../types'

export interface ResultInterpretationProps {
  persona: Persona
  answers: ElementType[]
}

/** "왜 이 타입이 나왔는지"부터 강점·어울리는 상황·반대 타입까지 짧게 보여주는 박스예요. */
export function ResultInterpretation({ persona, answers }: ResultInterpretationProps) {
  const detail = useMemo(() => buildInterpretation(persona, answers), [persona, answers])
  const icon = persona.secondary
    ? `${elementIcon(persona.primary)}${elementIcon(persona.secondary)}`
    : elementIcon(persona.primary)

  return (
    <div
      className="interpretation-box"
      style={{
        background: `${persona.colors[0]}1a`,
        borderColor: `${persona.colors[0]}40`,
      }}
    >
      <span className="interpretation-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="interpretation-body">
        <div className="interpretation-title">왜 이 타입일까요?</div>
        <p className="interpretation-text">{detail.basis}</p>
        <p className="interpretation-row">
          <span className="interpretation-label">강점</span>
          {detail.strength}
        </p>
        <p className="interpretation-row">
          <span className="interpretation-label">어울림</span>
          {detail.suited}
        </p>
        <p className="interpretation-row">
          <span className="interpretation-label">반대 타입</span>
          {detail.opposite}
        </p>
      </div>
    </div>
  )
}
