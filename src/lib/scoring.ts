import type { ElementScores, ElementType } from '../types'

const ELEMENT_ORDER: ElementType[] = ['fire', 'water', 'earth', 'air']

export function computeScores(answers: ElementType[]): ElementScores {
  const scores: ElementScores = { fire: 0, water: 0, earth: 0, air: 0 }
  for (const element of answers) {
    scores[element] += 1
  }
  return scores
}

export function getTopElement(scores: ElementScores): ElementType {
  return ELEMENT_ORDER.reduce((top, element) =>
    scores[element] > scores[top] ? element : top,
  )
}

/** 같은 답변 조합이면 같은 카드 비주얼이 나오도록 만드는 결정론적 시드예요. */
export function computeSeed(scores: ElementScores): number {
  return ELEMENT_ORDER.reduce(
    (seed, element, index) => seed + scores[element] * (index + 3) * 17,
    0,
  )
}
