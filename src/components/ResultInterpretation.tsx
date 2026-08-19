import { useMemo } from 'react'
import { buildInterpretation, elementIcon } from '../lib/interpretation'
import type { ElementType, Persona } from '../types'

export interface ResultInterpretationProps {
  persona: Persona
  answers: ElementType[]
}

/** "왜 이 타입이 나왔는지"를 실제 답변 근거와 함께 짧게 설명하는 박스예요. */
export function ResultInterpretation({ persona, answers }: ResultInterpretationProps) {
  const text = useMemo(() => buildInterpretation(persona, answers), [persona, answers])
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
      <div>
        <div className="interpretation-title">왜 이 타입일까요?</div>
        <p className="interpretation-text">{text}</p>
      </div>
    </div>
  )
}
