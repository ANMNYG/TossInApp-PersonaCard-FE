import type { ElementType, Persona, PersonaTypeKey } from '../types'

/** 각 원소의 기본 색상이에요. 혼합형은 주원소색 + 보조원소색을 그대로 이어붙여서 그라데이션을 만들어요. */
const ELEMENT_COLOR: Record<ElementType, string> = {
  fire: '#e2572c',
  water: '#2c8ce2',
  earth: '#5a9153',
  air: '#8b6fd9',
}

export const PERSONAS: Record<PersonaTypeKey, Persona> = {
  // 순수형
  fire: {
    key: 'fire',
    primary: 'fire',
    secondary: null,
    title: '불꽃 탐험가',
    tagEn: 'FIRE TYPE',
    colors: ['#e2572c', '#f2a13c'],
    description:
      '도전을 두려워하지 않고 새로운 자극을 찾아 나서는 타입이에요. 뜨거운 에너지로 주변 분위기를 이끌고, 멈춰있는 것보다 움직이는 쪽을 택해요.',
  },
  water: {
    key: 'water',
    primary: 'water',
    secondary: null,
    title: '잔잔한 몽상가',
    tagEn: 'WATER TYPE',
    colors: ['#2c8ce2', '#5fd0c9'],
    description:
      '깊이 느끼고 조용히 관찰하는 타입이에요. 겉으로 잔잔해 보여도 내면엔 섬세한 파도가 흐르고, 진짜 이해받는 관계를 소중히 여겨요.',
  },
  earth: {
    key: 'earth',
    primary: 'earth',
    secondary: null,
    title: '단단한 수호자',
    tagEn: 'EARTH TYPE',
    colors: ['#5a9153', '#a9c86e'],
    description:
      '흔들리지 않는 뿌리 같은 사람이에요. 루틴과 안정감 속에서 힘을 얻고, 곁에 있는 사람들에게 믿음직한 존재가 되어줘요.',
  },
  air: {
    key: 'air',
    primary: 'air',
    secondary: null,
    title: '자유로운 방랑자',
    tagEn: 'AIR TYPE',
    colors: ['#8b6fd9', '#b79ce8'],
    description:
      '어디에도 얽매이지 않고 가볍게 떠다니는 타입이에요. 예측불가한 매력으로 주변을 환기시키고, 자유가 곧 에너지원이에요.',
  },

  // 혼합형 - fire 주원소
  'fire-water': {
    key: 'fire-water',
    primary: 'fire',
    secondary: 'water',
    title: '뜨거운 파도',
    tagEn: 'FIRE × WATER TYPE',
    colors: [ELEMENT_COLOR.fire, ELEMENT_COLOR.water],
    description:
      '열정 넘치게 뛰어들면서도 그 안에 섬세한 감정을 품고 있는 타입이에요. 뜨겁게 시작한 일도 상대의 마음까지 살피며 끝까지 데려가요.',
  },
  'fire-earth': {
    key: 'fire-earth',
    primary: 'fire',
    secondary: 'earth',
    title: '불타는 개척자',
    tagEn: 'FIRE × EARTH TYPE',
    colors: [ELEMENT_COLOR.fire, ELEMENT_COLOR.earth],
    description:
      '새로운 길을 겁없이 열어가면서도 그 위에 단단하게 뿌리를 내리는 타입이에요. 순간의 열정을 꾸준한 실행으로 바꿔낼 줄 알아요.',
  },
  'fire-air': {
    key: 'fire-air',
    primary: 'fire',
    secondary: 'air',
    title: '질주하는 불꽃',
    tagEn: 'FIRE × AIR TYPE',
    colors: [ELEMENT_COLOR.fire, ELEMENT_COLOR.air],
    description:
      '생각나면 바로 움직이는 추진력에 어디에도 얽매이지 않는 자유로움까지 더해진 타입이에요. 멈추지 않고 계속 새로운 판을 벌여요.',
  },

  // 혼합형 - water 주원소
  'water-fire': {
    key: 'water-fire',
    primary: 'water',
    secondary: 'fire',
    title: '잔잔한 불씨',
    tagEn: 'WATER × FIRE TYPE',
    colors: [ELEMENT_COLOR.water, ELEMENT_COLOR.fire],
    description:
      '평소엔 조용히 흐르지만 마음속엔 꺼지지 않는 열정이 자리한 타입이에요. 좋아하는 일 앞에서는 은근하지만 확실한 온도로 타올라요.',
  },
  'water-earth': {
    key: 'water-earth',
    primary: 'water',
    secondary: 'earth',
    title: '고요한 뿌리',
    tagEn: 'WATER × EARTH TYPE',
    colors: [ELEMENT_COLOR.water, ELEMENT_COLOR.earth],
    description:
      '깊이 느끼는 감성 위에 흔들리지 않는 안정감을 함께 지닌 타입이에요. 조용히 곁을 지키면서도 진심으로 신뢰를 주는 사람이에요.',
  },
  'water-air': {
    key: 'water-air',
    primary: 'water',
    secondary: 'air',
    title: '유영하는 몽상가',
    tagEn: 'WATER × AIR TYPE',
    colors: [ELEMENT_COLOR.water, ELEMENT_COLOR.air],
    description:
      '섬세한 감정을 품은 채로 어디든 자유롭게 흘러가는 타입이에요. 정해진 틀보다는 마음이 이끄는 방향을 따라가요.',
  },

  // 혼합형 - earth 주원소
  'earth-fire': {
    key: 'earth-fire',
    primary: 'earth',
    secondary: 'fire',
    title: '단단한 불씨',
    tagEn: 'EARTH × FIRE TYPE',
    colors: [ELEMENT_COLOR.earth, ELEMENT_COLOR.fire],
    description:
      '평소엔 든든하게 자리를 지키다가도 결정적인 순간엔 뜨거운 추진력을 보여주는 타입이에요. 안정감 속에 감춰둔 열정이 진짜 무기예요.',
  },
  'earth-water': {
    key: 'earth-water',
    primary: 'earth',
    secondary: 'water',
    title: '비옥한 대지',
    tagEn: 'EARTH × WATER TYPE',
    colors: [ELEMENT_COLOR.earth, ELEMENT_COLOR.water],
    description:
      '안정적인 루틴 위에 섬세한 공감 능력을 더한 타입이에요. 곁에 있는 사람을 깊이 이해하면서도 흔들림 없이 지켜줘요.',
  },
  'earth-air': {
    key: 'earth-air',
    primary: 'earth',
    secondary: 'air',
    title: '흔들리지 않는 산',
    tagEn: 'EARTH × AIR TYPE',
    colors: [ELEMENT_COLOR.earth, ELEMENT_COLOR.air],
    description:
      '단단한 중심을 지키면서도 필요할 땐 가볍게 방향을 바꿀 줄 아는 타입이에요. 안정감과 유연함을 동시에 갖춘 균형 잡힌 사람이에요.',
  },

  // 혼합형 - air 주원소
  'air-fire': {
    key: 'air-fire',
    primary: 'air',
    secondary: 'fire',
    title: '뜨거운 바람',
    tagEn: 'AIR × FIRE TYPE',
    colors: [ELEMENT_COLOR.air, ELEMENT_COLOR.fire],
    description:
      '자유롭게 떠다니다가도 꽂히는 일 앞에서는 순식간에 뜨거워지는 타입이에요. 예측불가한 매력에 강렬한 에너지까지 더해져요.',
  },
  'air-water': {
    key: 'air-water',
    primary: 'air',
    secondary: 'water',
    title: '자유로운 물결',
    tagEn: 'AIR × WATER TYPE',
    colors: [ELEMENT_COLOR.air, ELEMENT_COLOR.water],
    description:
      '가볍게 흘러가면서도 그 안에 섬세한 감정을 담고 있는 타입이에요. 자유롭게 움직이지만 마음만은 깊이 느끼는 편이에요.',
  },
  'air-earth': {
    key: 'air-earth',
    primary: 'air',
    secondary: 'earth',
    title: '정착한 방랑자',
    tagEn: 'AIR × EARTH TYPE',
    colors: [ELEMENT_COLOR.air, ELEMENT_COLOR.earth],
    description:
      '자유로운 영혼이지만 마음 둘 곳을 찾으면 의외로 단단하게 자리잡는 타입이에요. 방랑과 안정, 두 가지 매력을 모두 가진 사람이에요.',
  },
}
