// 광고 붙이기 전까지 임시 비활성화. 다시 켤 때는 아래 import와 <AdSlot />을 되살리세요.
// import { AdSlot } from './AdSlot'

export interface ShareScreenProps {
  isSharing: boolean
  onShare: () => void
  /** localStorage에 저장된 케미 공유 코드가 있을 때만 "내 케미 모아보기" 버튼을 보여줘요. */
  hasSharerCode: boolean
  onGoMyChemistry: () => void
}

export function ShareScreen({
  isSharing,
  onShare,
  hasSharerCode,
  onGoMyChemistry,
}: ShareScreenProps) {
  return (
    <div className="screen screen-share">
      <div className="eyebrow">카드 공유</div>
      <h1 className="display display-sm">
        완성한 카드를
        <br />
        친구에게 공유해요
      </h1>
      <button
        type="button"
        className="btn share-cta"
        onClick={onShare}
        disabled={isSharing}
      >
        {isSharing ? '공유 시트를 여는 중이에요' : '친구에게 카드 공유하기'}
      </button>

      {hasSharerCode && (
        <button type="button" className="btn-outline" onClick={onGoMyChemistry}>
          내 케미 모아보기
        </button>
      )}

      {/* <AdSlot screen="share" /> */}
    </div>
  )
}
