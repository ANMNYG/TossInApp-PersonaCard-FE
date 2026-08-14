import type { Question } from '../types'

export const QUESTIONS: Question[] = [
  {
    text: '오늘 나의 에너지는?',
    options: [
      { label: '활활 타올라요', element: 'fire' },
      { label: '잔잔하게 흘러요', element: 'water' },
      { label: '단단하게 뿌리내려요', element: 'earth' },
      { label: '가볍게 떠다녀요', element: 'air' },
    ],
  },
  {
    text: '쉬는 날 나는?',
    options: [
      { label: '새로운 곳을 탐험해요', element: 'fire' },
      { label: '좋아하는 영화를 정주행해요', element: 'water' },
      { label: '집을 정리하고 계획을 세워요', element: 'earth' },
      { label: '훌쩍 즉흥 여행을 떠나요', element: 'air' },
    ],
  },
  {
    text: '친구들 사이에서 나는?',
    options: [
      { label: '분위기를 띄우는 사람이에요', element: 'fire' },
      { label: '조용히 들어주는 사람이에요', element: 'water' },
      { label: '믿고 의지할 수 있는 사람이에요', element: 'earth' },
      { label: '예측불가한 자유인이에요', element: 'air' },
    ],
  },
  {
    text: '스트레스 받을 때 나는?',
    options: [
      { label: '확 풀어버려요', element: 'fire' },
      { label: '혼자 조용히 삭혀요', element: 'water' },
      { label: '루틴으로 다잡아요', element: 'earth' },
      { label: '딴 생각으로 잠시 도피해요', element: 'air' },
    ],
  },
  {
    text: '좋아하는 색감은?',
    options: [
      { label: '강렬한 레드·오렌지예요', element: 'fire' },
      { label: '깊은 블루·틸이에요', element: 'water' },
      { label: '자연스러운 그린·브라운이에요', element: 'earth' },
      { label: '파스텔 라벤더·화이트예요', element: 'air' },
    ],
  },
  {
    text: '내가 추구하는 관계는?',
    options: [
      { label: '열정적으로 부딪히는 사이예요', element: 'fire' },
      { label: '깊이 이해하는 사이예요', element: 'water' },
      { label: '오래도록 안정적인 사이예요', element: 'earth' },
      { label: '서로의 자유를 존중하는 사이예요', element: 'air' },
    ],
  },
  {
    text: '지금 나에게 필요한 한마디는?',
    options: [
      { label: '"더 뜨겁게"', element: 'fire' },
      { label: '"괜찮아, 천천히"', element: 'water' },
      { label: '"지금 이대로도 충분해"', element: 'earth' },
      { label: '"훌쩍 떠나도 돼"', element: 'air' },
    ],
  },
]
