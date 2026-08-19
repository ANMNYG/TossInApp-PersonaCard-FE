import { QUESTIONS } from '../data/questions'
import type { ElementType, Persona, PersonaTypeKey } from '../types'

const ELEMENT_NOUN: Record<ElementType, string> = {
  fire: '불',
  water: '물',
  earth: '땅',
  air: '바람',
}

const ELEMENT_ICON: Record<ElementType, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🪨',
  air: '🍃',
}

export function elementIcon(element: ElementType): string {
  return ELEMENT_ICON[element]
}

/** 질문마다 뭘 물어보는지 짧게 요약한 이름이에요. QUESTIONS와 같은 순서예요. */
const QUESTION_THEMES = [
  '에너지 표현',
  '휴식 방식',
  '관계 속 역할',
  '스트레스 대처',
  '끌리는 색감',
  '추구하는 관계',
  '필요한 한마디',
] as const

const PURE_ESSENCE: Record<ElementType, string> = {
  fire: '불 하나로 가득 채워진, 흔들림 없는 뜨거움이에요.',
  water: '물 하나로 가득 채워진, 고요하지만 깊은 마음이에요.',
  earth: '땅 하나로 가득 채워진, 든든하고 흔들리지 않는 중심이에요.',
  air: '바람 하나로 가득 채워진, 어디에도 얽매이지 않는 자유예요.',
}

const MIXED_ESSENCE: Partial<Record<PersonaTypeKey, string>> = {
  'fire-water': '뜨거움과 섬세함이 만난, 열정 안에 감정을 품은 조합이에요.',
  'fire-earth': '뜨거움과 단단함이 만난, 추진력 위에 뿌리를 내린 조합이에요.',
  'fire-air': '뜨거움과 자유로움이 만난, 멈추지 않는 질주 같은 조합이에요.',
  'water-fire': '고요함과 뜨거움이 만난, 잔잔한 겉모습 속 열정을 품은 조합이에요.',
  'water-earth': '고요함과 단단함이 만난, 깊이 느끼면서도 흔들리지 않는 조합이에요.',
  'water-air': '고요함과 자유로움이 만난, 감정을 품은 채 흘러가는 조합이에요.',
  'earth-fire': '단단함과 뜨거움이 만난, 안정감 속에 열정을 감춘 조합이에요.',
  'earth-water': '단단함과 섬세함이 만난, 흔들림 없이 깊이 공감하는 조합이에요.',
  'earth-air': '단단함과 자유로움이 만난, 중심은 지키되 유연하게 움직이는 조합이에요.',
  'air-fire': '자유로움과 뜨거움이 만난, 가볍다가도 순식간에 타오르는 조합이에요.',
  'air-water': '자유로움과 섬세함이 만난, 가볍게 흐르며 깊이 느끼는 조합이에요.',
  'air-earth': '자유로움과 단단함이 만난, 방랑하다가도 단단히 자리잡는 조합이에요.',
}

const MAX_LISTED_QUESTIONS = 3

function describeIndices(indices: number[]): string {
  const shown = indices.slice(0, MAX_LISTED_QUESTIONS)
  const label = shown.map((i) => `${QUESTION_THEMES[i]}(${i + 1}번)`).join(', ')
  const rest = indices.length - shown.length
  return rest > 0 ? `${label} 외 ${rest}개` : label
}

function indicesFor(answers: ElementType[], element: ElementType): number[] {
  return answers.reduce<number[]>((acc, answer, index) => {
    if (answer === element) acc.push(index)
    return acc
  }, [])
}

/**
 * 사용자가 실제로 어떤 질문에서 주원소/보조원소를 선택했는지를 근거로 삼아
 * "왜 이 타입이 나왔는지"를 설명하는 문구를 만들어요. 같은 타입이어도 답변에 따라
 * 어떤 질문 번호가 언급되는지가 달라져서 개인화된 느낌을 줘요.
 */
export function buildInterpretation(persona: Persona, answers: ElementType[]): string {
  const primaryIndices = indicesFor(answers, persona.primary)

  if (!persona.secondary) {
    const essence = PURE_ESSENCE[persona.primary]
    if (primaryIndices.length === 0) return essence
    return `${describeIndices(primaryIndices)} 질문에서 모두 ${ELEMENT_NOUN[persona.primary]}의 답을 선택하셨어요. ${essence}`
  }

  const secondaryIndices = indicesFor(answers, persona.secondary)
  const essence = MIXED_ESSENCE[persona.key] ?? ''

  if (primaryIndices.length === 0 || secondaryIndices.length === 0) {
    return essence
  }

  return `${describeIndices(primaryIndices)} 질문에서는 ${ELEMENT_NOUN[persona.primary]}의 답을, ${describeIndices(secondaryIndices)} 질문에서는 ${ELEMENT_NOUN[persona.secondary]}의 답을 선택하셨어요. ${essence}`
}

if (import.meta.env.DEV && QUESTION_THEMES.length !== QUESTIONS.length) {
  console.error('QUESTION_THEMES와 QUESTIONS의 개수가 달라요. 질문이 추가/삭제되면 같이 맞춰주세요.')
}
