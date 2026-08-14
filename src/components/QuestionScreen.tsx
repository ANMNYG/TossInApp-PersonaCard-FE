import type { ElementType, Question } from '../types'

export interface QuestionScreenProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  selectedElement: ElementType | null
  onSelect: (element: ElementType) => void
}

export function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selectedElement,
  onSelect,
}: QuestionScreenProps) {
  const progress = (questionIndex / totalQuestions) * 100

  return (
    <div className="screen screen-question">
      <div className="qtop">
        <span>
          질문 {questionIndex + 1} / {totalQuestions}
        </span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="qtext">{question.text}</div>
      <div className="options">
        {question.options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            className={`opt${selectedElement === opt.element ? ' picked' : ''}`}
            onClick={() => onSelect(opt.element)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
