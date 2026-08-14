import { AdSlot } from './AdSlot'

export interface ShareScreenProps {
  isSharing: boolean
  onShare: () => void
  onSubscribe: () => void
  onGoHome: () => void
}

export function ShareScreen({ isSharing, onShare, onSubscribe, onGoHome }: ShareScreenProps) {
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

      <div className="sub-card">
        <div className="eyebrow">구독</div>
        <div className="sub-price">
          매주 새 테마 카드 <span>월 4,900원</span>
        </div>
        <button type="button" className="btn-outline sub-cta" onClick={onSubscribe}>
          구독 시작하고 매주 새 카드 받아요
        </button>
      </div>

      <AdSlot screen="share" />

      <div className="spacer" />
      <button type="button" className="btn-ghost" onClick={onGoHome}>
        처음 화면으로 돌아가요
      </button>
    </div>
  )
}
