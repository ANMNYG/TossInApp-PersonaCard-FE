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

/** 순수형 4개("fire") + 혼합형 12개("fire-water" = 주원소-보조원소) = 16타입 */
export type PersonaTypeKey =
  | 'fire'
  | 'water'
  | 'earth'
  | 'air'
  | 'fire-water'
  | 'fire-earth'
  | 'fire-air'
  | 'water-fire'
  | 'water-earth'
  | 'water-air'
  | 'earth-fire'
  | 'earth-water'
  | 'earth-air'
  | 'air-fire'
  | 'air-water'
  | 'air-earth'

export interface Persona {
  key: PersonaTypeKey
  primary: ElementType
  /** 순수형이면 보조 원소가 없어요. */
  secondary: ElementType | null
  title: string
  tagEn: string
  /** [주원소 색상, 보조원소 색상] 그라데이션용 */
  colors: [string, string]
  description: string
}

export type DialogState = { kind: 'share-error' }
