export interface StatusLineProps {
  /**
   * 실제 카운트 시스템이 준비되면 이 prop으로 오늘 만든 카드 수를 넘겨주세요.
   * 넘기지 않으면(지금처럼) 숫자를 지어내지 않고 정직한 안내 문구를 보여줘요.
   */
  count?: number
}

/** 인트로 화면 하단의 한 줄 안내예요. count가 없으면 가짜 숫자 대신 정직한 문구를 보여줘요. */
export function StatusLine({ count }: StatusLineProps) {
  const text =
    typeof count === 'number'
      ? `오늘 ${count.toLocaleString()}명이 자신의 카드를 만들었어요`
      : '답변만 하면 1분 안에 나만의 카드가 완성돼요'

  return <div className="liveline">{text}</div>
}
