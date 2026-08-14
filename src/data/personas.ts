import type { ElementType, Persona } from '../types'

export const PERSONAS: Record<ElementType, Persona> = {
  fire: {
    element: 'fire',
    title: '불꽃 탐험가',
    tagEn: 'FIRE TYPE',
    colors: ['#e2572c', '#f2a13c'],
    description:
      '도전을 두려워하지 않고 새로운 자극을 찾아 나서는 타입이에요. 뜨거운 에너지로 주변 분위기를 이끌고, 멈춰있는 것보다 움직이는 쪽을 택해요.',
  },
  water: {
    element: 'water',
    title: '잔잔한 몽상가',
    tagEn: 'WATER TYPE',
    colors: ['#2c8ce2', '#5fd0c9'],
    description:
      '깊이 느끼고 조용히 관찰하는 타입이에요. 겉으로 잔잔해 보여도 내면엔 섬세한 파도가 흐르고, 진짜 이해받는 관계를 소중히 여겨요.',
  },
  earth: {
    element: 'earth',
    title: '단단한 수호자',
    tagEn: 'EARTH TYPE',
    colors: ['#5a9153', '#a9c86e'],
    description:
      '흔들리지 않는 뿌리 같은 사람이에요. 루틴과 안정감 속에서 힘을 얻고, 곁에 있는 사람들에게 믿음직한 존재가 되어줘요.',
  },
  air: {
    element: 'air',
    title: '자유로운 방랑자',
    tagEn: 'AIR TYPE',
    colors: ['#8b6fd9', '#b79ce8'],
    description:
      '어디에도 얽매이지 않고 가볍게 떠다니는 타입이에요. 예측불가한 매력으로 주변을 환기시키고, 자유가 곧 에너지원이에요.',
  },
}
