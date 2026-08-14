export interface DialogProps {
  eyebrow: string
  title: string
  description: string
  onClose: () => void
  /** 생략하면 "닫기" 버튼만 있는 안내형 다이얼로그가 돼요. */
  primaryLabel?: string
  onPrimary?: () => void
}

/** 왼쪽 버튼은 항상 "닫기"예요. 강조 버튼은 오른쪽에만 배치해요. */
export function Dialog({
  eyebrow,
  title,
  description,
  onClose,
  primaryLabel,
  onPrimary,
}: DialogProps) {
  return (
    <div className="dialog-overlay" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="dialog-actions">
          <button type="button" className="btn-outline" onClick={onClose}>
            닫기
          </button>
          {primaryLabel && onPrimary && (
            <button type="button" className="btn" onClick={onPrimary}>
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
