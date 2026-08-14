export interface IntroScreenProps {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="screen screen-intro">
      <div className="eyebrow">✦ AI 페르소나 카드</div>
      <h1 className="display">
        7개 질문으로
        <br />
        나의 원소 카드를 만나요
      </h1>
      <div className="card-preview">
        <span>예시 카드</span>
      </div>
      <div className="tags">
        <span className="tag">1분 완성</span>
        <span className="tag">로그인 없이 시작</span>
        <span className="tag">공유하면 리롤 무료</span>
      </div>
      <div className="spacer" />
      <button type="button" className="btn" onClick={onStart}>
        지금 카드 만들어봐요
      </button>
      <div className="liveline">오늘 12,384명이 자신의 카드를 만들었어요</div>
    </div>
  )
}
