const SHARE_OPTIONS = [
  { icon: '💬', shortLabel: '카톡', channelPhrase: '카카오톡으로' },
  { icon: '📸', shortLabel: '인스타', channelPhrase: '인스타그램으로' },
  { icon: '🔗', shortLabel: '링크복사', channelPhrase: '링크로' },
]

export interface ShareScreenProps {
  onShare: (channelPhrase: string) => void
  onSubscribe: () => void
  onGoHome: () => void
}

export function ShareScreen({ onShare, onSubscribe, onGoHome }: ShareScreenProps) {
  return (
    <div className="screen screen-share">
      <div className="eyebrow">공유하고 리롤 받아요</div>
      <h1 className="display display-sm">
        친구에게 공유하면
        <br />
        스타일을 무료로 바꿀 수 있어요
      </h1>
      <div className="share-grid">
        {SHARE_OPTIONS.map((opt) => (
          <button
            key={opt.channelPhrase}
            type="button"
            className="share-opt"
            onClick={() => onShare(opt.channelPhrase)}
          >
            <span className="share-icon">{opt.icon}</span>
            {opt.shortLabel}
          </button>
        ))}
      </div>

      <div className="sub-card">
        <div className="eyebrow">구독</div>
        <div className="sub-price">
          매주 새 테마 카드 <span>월 4,900원</span>
        </div>
        <button type="button" className="btn-outline sub-cta" onClick={onSubscribe}>
          구독 시작하고 매주 새 카드 받아요
        </button>
      </div>

      <div className="spacer" />
      <button type="button" className="btn-ghost" onClick={onGoHome}>
        처음 화면으로 돌아가요
      </button>
    </div>
  )
}
