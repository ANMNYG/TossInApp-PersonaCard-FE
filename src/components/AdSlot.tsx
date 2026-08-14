type AdEligibleScreen = 'result' | 'share'

export interface AdSlotProps {
  /**
   * 광고를 노출해도 되는 화면만 받는 타입이에요. 인트로·로딩·다이얼로그처럼
   * 일시적으로 보이는 화면은 이 타입에 없어서 실수로 광고를 붙이면 타입 에러가 나요.
   */
  screen: AdEligibleScreen
}

/**
 * 인앱 광고가 들어갈 자리예요. 실제 광고 SDK가 정해지면 이 컴포넌트 내부만 채우면 돼요.
 */
export function AdSlot(_props: AdSlotProps) {
  return null
}
