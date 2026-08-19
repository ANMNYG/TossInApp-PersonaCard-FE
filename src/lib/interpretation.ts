import { PERSONAS } from '../data/personas'
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

/** 클래식 4원소론의 대극 쌍이에요. 반대 타입을 알려줄 때 써요. */
const ELEMENT_OPPOSITE: Record<ElementType, ElementType> = {
  fire: 'water',
  water: 'fire',
  earth: 'air',
  air: 'earth',
}

export function elementIcon(element: ElementType): string {
  return ELEMENT_ICON[element]
}

/**
 * 질문마다 자연스러운 문장으로 이어지는 도입부예요. QUESTIONS와 같은 순서고,
 * 뒤에 "'선택한 답변'를 고르셨어요" 형태로 붙어요 (예: "쉬는 날엔 '훌쩍 즉흥 여행을
 * 떠나요'를 고르셨어요").
 */
const LEAD_IN = [
  '평소 에너지는',
  '쉬는 날엔',
  '친구들 사이에서는',
  '스트레스 받을 땐',
  '좋아하는 색감은',
  '관계에서는',
  '지금 필요한 한마디로는',
] as const

/** 한 문장에 너무 많은 답변을 나열하지 않도록, 원소당 최대 이 개수만 인용해요. */
const MAX_QUOTED_ANSWERS = 2

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

interface TypeInsight {
  /** 이 타입의 강점 한 줄 */
  strength: string
  /** 이 타입이 어울리는 상황·관계 한 줄 */
  suited: string
}

const TYPE_INSIGHTS: Record<PersonaTypeKey, TypeInsight> = {
  fire: {
    strength: '망설임 없이 먼저 움직이는 추진력이 강점이에요.',
    suited: '새로운 걸 빠르게 시작해야 하는 자리, 팀에 활기가 필요할 때 잘 어울려요.',
  },
  water: {
    strength: '다른 사람의 감정을 세심하게 알아차리는 공감력이 강점이에요.',
    suited: '깊은 대화가 필요한 관계, 누군가의 이야기를 들어줘야 하는 자리에 잘 어울려요.',
  },
  earth: {
    strength: '한번 정한 걸 끝까지 밀고 나가는 꾸준함이 강점이에요.',
    suited: '장기 프로젝트, 오래 함께할 사람이 필요한 관계에 잘 어울려요.',
  },
  air: {
    strength: '틀에 갇히지 않고 새로운 시각으로 접근하는 유연함이 강점이에요.',
    suited: '변화가 잦은 환경, 자유롭게 의견을 나눌 수 있는 관계에 잘 어울려요.',
  },
  'fire-water': {
    strength: '열정으로 시작해서 상대의 마음까지 챙기는 균형감이 강점이에요.',
    suited: '팀을 이끌면서도 팀원 감정까지 살펴야 하는 자리에 잘 어울려요.',
  },
  'fire-earth': {
    strength: '순간의 추진력을 꾸준한 실행으로 이어가는 힘이 강점이에요.',
    suited: '새 프로젝트를 처음부터 끝까지 책임지고 완주해야 하는 자리에 잘 어울려요.',
  },
  'fire-air': {
    strength: '빠른 판단력과 유연한 전환 속도가 강점이에요.',
    suited: '동시에 여러 일을 처리해야 하는 자리, 변화가 잦은 프로젝트에 잘 어울려요.',
  },
  'water-fire': {
    strength: '평소엔 신중하지만 결정적일 땐 확실하게 밀어붙이는 힘이 강점이에요.',
    suited: '천천히 신뢰를 쌓다가 결정적 순간엔 확신을 주는 관계에 잘 어울려요.',
  },
  'water-earth': {
    strength: '깊은 공감력과 흔들리지 않는 신뢰감을 동시에 지닌 게 강점이에요.',
    suited: '오래도록 곁에서 마음을 나눌 수 있는 관계에 잘 어울려요.',
  },
  'water-air': {
    strength: '감정을 세심히 느끼면서도 상황에 유연하게 적응하는 힘이 강점이에요.',
    suited: '다양한 사람과 폭넓게 교류하면서도 깊이를 잃지 않는 관계에 잘 어울려요.',
  },
  'earth-fire': {
    strength: '평소의 안정감 속에 결정적인 추진력을 감춰둔 게 강점이에요.',
    suited: '꾸준함이 기본이지만 가끔 과감한 승부수가 필요한 자리에 잘 어울려요.',
  },
  'earth-water': {
    strength: '흔들림 없는 안정감과 섬세한 공감을 함께 갖춘 게 강점이에요.',
    suited: '누군가를 오래도록 든든하게 지지해줘야 하는 관계에 잘 어울려요.',
  },
  'earth-air': {
    strength: '중심은 지키면서도 상황에 맞게 유연하게 움직이는 균형감이 강점이에요.',
    suited: '안정성과 변화 대응력이 동시에 필요한 자리에 잘 어울려요.',
  },
  'air-fire': {
    strength: '자유롭게 탐색하다가도 확신이 서면 빠르게 몰입하는 힘이 강점이에요.',
    suited: '다양한 시도 끝에 하나에 강렬하게 집중해야 하는 프로젝트에 잘 어울려요.',
  },
  'air-water': {
    strength: '가볍게 흘러가면서도 마음만은 깊이 헤아리는 균형감이 강점이에요.',
    suited: '자유로운 분위기 속에서도 서로를 세심하게 챙기는 관계에 잘 어울려요.',
  },
  'air-earth': {
    strength: '자유로움과 안정감을 상황에 맞게 오가는 유연함이 강점이에요.',
    suited: '변화를 즐기면서도 결국엔 안정적으로 마무리해야 하는 자리에 잘 어울려요.',
  },
}

function indicesFor(answers: ElementType[], element: ElementType): number[] {
  return answers.reduce<number[]>((acc, answer, index) => {
    if (answer === element) acc.push(index)
    return acc
  }, [])
}

/** 라벨을 인용부호로 감싸요. Q7 선택지처럼 이미 큰따옴표를 품고 있으면 그대로 둬요. */
function quoteAnswer(label: string): string {
  return label.startsWith('"') ? label : `'${label}'`
}

function labelAt(questionIndex: number, element: ElementType): string {
  const option = QUESTIONS[questionIndex].options.find((o) => o.element === element)
  return option ? option.label : ''
}

/**
 * 특정 원소를 고른 질문들을, 실제로 선택한 답변 문장을 그대로 인용하는 자연스러운
 * 한 문장으로 묶어요 (예: "쉬는 날엔 '훌쩍 즉흥 여행을 떠나요'를, 관계에서는
 * '서로의 자유를 존중하는 사이예요'를 고르셨어요").
 */
function buildElementClause(indices: number[], element: ElementType): string {
  const parts = indices
    .slice(0, MAX_QUOTED_ANSWERS)
    .map((i) => `${LEAD_IN[i]} ${quoteAnswer(labelAt(i, element))}를`)
  return `${parts.join(', ')} 고르셨어요.`
}

function buildBasis(persona: Persona, answers: ElementType[]): string {
  const primaryClause = buildElementClause(indicesFor(answers, persona.primary), persona.primary)

  if (!persona.secondary) {
    return `${primaryClause} ${PURE_ESSENCE[persona.primary]}`
  }

  const secondaryClause = buildElementClause(indicesFor(answers, persona.secondary), persona.secondary)
  const essence = MIXED_ESSENCE[persona.key] ?? ''

  return `${primaryClause} 반면 ${secondaryClause} ${essence}`
}

function buildOpposite(persona: Persona): string {
  const oppositeElement = ELEMENT_OPPOSITE[persona.primary]

  if (persona.secondary === oppositeElement) {
    return `이미 정반대 기운(${ELEMENT_NOUN[persona.primary]}·${ELEMENT_NOUN[persona.secondary]})을 함께 품고 있어서, 그 자체로 균형 잡힌 조합이에요.`
  }

  const oppositeTitle = PERSONAS[oppositeElement].title
  return `정반대 성향은 ${oppositeTitle} 쪽이에요. 결이 다른 만큼, 곁에 있으면 서로 채워줄 수 있는 관계예요.`
}

export interface InterpretationDetail {
  /** 실제 답변을 근거로 왜 이 타입이 나왔는지 설명해요. */
  basis: string
  /** 이 타입의 강점 한 줄 */
  strength: string
  /** 이 타입이 어울리는 상황·관계 한 줄 */
  suited: string
  /** 반대 성향의 타입을 짧게 언급해요. */
  opposite: string
}

/**
 * 사용자가 실제로 어떤 질문에서 주원소/보조원소를 선택했는지를 근거로 "왜 이 타입이
 * 나왔는지"부터 강점·어울리는 상황·반대 타입까지 짧게 묶어서 돌려줘요. basis는 답변에
 * 따라 언급되는 질문 번호가 달라져서 개인화된 느낌을 주고, 나머지는 타입별 고정 문구예요.
 */
export function buildInterpretation(persona: Persona, answers: ElementType[]): InterpretationDetail {
  const insight = TYPE_INSIGHTS[persona.key]
  return {
    basis: buildBasis(persona, answers),
    strength: insight.strength,
    suited: insight.suited,
    opposite: buildOpposite(persona),
  }
}

if (import.meta.env.DEV && LEAD_IN.length !== QUESTIONS.length) {
  console.error('LEAD_IN과 QUESTIONS의 개수가 달라요. 질문이 추가/삭제되면 같이 맞춰주세요.')
}
