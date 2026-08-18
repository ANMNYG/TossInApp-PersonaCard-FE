export type ElementType = 'fire' | 'water' | 'earth' | 'air'

export type ElementScores = Record<ElementType, number>

export interface QuestionOption {
  label: string
  element: ElementType
}

export interface Question {
  text: string
  options: QuestionOption[]
}

export interface Persona {
  element: ElementType
  title: string
  tagEn: string
  colors: [string, string]
  description: string
}

export type DialogState = { kind: 'share-error' }
