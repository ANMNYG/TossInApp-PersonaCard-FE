import type { ElementScores, ElementType, PersonaTypeKey } from '../types'

const ELEMENT_ORDER: ElementType[] = ['fire', 'water', 'earth', 'air']

/** 1등과 2등의 점수 차이가 이 값 이상이면 "순수형"으로, 미만이면 "혼합형"으로 분류해요. */
const PURE_TYPE_GAP_THRESHOLD = 3

export function computeScores(answers: ElementType[]): ElementScores {
  const scores: ElementScores = { fire: 0, water: 0, earth: 0, air: 0 }
  for (const element of answers) {
    scores[element] += 1
  }
  return scores
}

export interface ElementRanking {
  primary: ElementType
  secondary: ElementType
  /** 주원소와 보조원소의 점수 차이 */
  gap: number
}

/**
 * 4개 원소를 점수 순으로 정렬해서 1등(주원소)·2등(보조원소)을 반환해요.
 * 동점일 때는 ELEMENT_ORDER(fire > water > earth > air) 순서로 결정돼요(정렬이 stable해서 동작해요).
 */
export function rankElements(scores: ElementScores): ElementRanking {
  const [primary, secondary] = [...ELEMENT_ORDER].sort((a, b) => scores[b] - scores[a])
  return { primary, secondary, gap: scores[primary] - scores[secondary] }
}

export function getTopElement(scores: ElementScores): ElementType {
  return rankElements(scores).primary
}

/** 순수형이면 gap이 크다는 뜻이라 secondary가 없어요. */
export function isPureType(scores: ElementScores): boolean {
  return rankElements(scores).gap >= PURE_TYPE_GAP_THRESHOLD
}

/** 16가지 타입 중 하나를 가리키는 키를 반환해요 (예: "fire" 또는 "fire-water"). */
export function getPersonaTypeKey(scores: ElementScores): PersonaTypeKey {
  const { primary, secondary, gap } = rankElements(scores)
  if (gap >= PURE_TYPE_GAP_THRESHOLD) return primary
  return `${primary}-${secondary}` as PersonaTypeKey
}

/** 같은 답변 조합이면 같은 카드 비주얼이 나오도록 만드는 결정론적 시드예요. */
export function computeSeed(scores: ElementScores): number {
  return ELEMENT_ORDER.reduce(
    (seed, element, index) => seed + scores[element] * (index + 3) * 17,
    0,
  )
}
