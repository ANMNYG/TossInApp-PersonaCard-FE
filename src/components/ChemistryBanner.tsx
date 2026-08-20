/** 친구의 케미 공유 링크로 들어왔을 때 인트로 화면에 보여주는 안내 배너예요. */
export function ChemistryBanner() {
  return (
    <div className="chemistry-banner" role="note">
      <span className="chemistry-banner-icon" aria-hidden="true">
        💌
      </span>
      친구가 당신과의 케미를 궁금해해요!
    </div>
  )
}
