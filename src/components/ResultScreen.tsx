import { useRef, useState } from 'react'
import type { Persona } from '../types'
// 광고 붙이기 전까지 임시 비활성화. 다시 켤 때는 아래 import와 <AdSlot />을 되살리세요.
// import { AdSlot } from './AdSlot'
import { ResultCard, type ResultCardHandle } from './ResultCard'

// Share.sendMessage는 Promise<void>만 반환하고 성공/취소 여부를 알려주지 않아요(fire-and-forget).
// 그래서 공유 호출이 끝난 뒤에도 시트를 실제로 만졌다 나올 만큼 최소한의 시간차를 둬요.
const SHARE_SHEET_MIN_DELAY_MS = 1500

export interface ResultScreenProps {
  persona: Persona
  seed: number
  onShare: () => Promise<void>
  onRetake: () => void
  onGoShare: () => void
}

export function ResultScreen({ persona, seed, onShare, onRetake, onGoShare }: ResultScreenProps) {
  const cardRef = useRef<ResultCardHandle>(null)
  const [locked, setLocked] = useState(true)
  const [sharePending, setSharePending] = useState(false)

  const handleSave = () => {
    const dataUrl = cardRef.current?.getDataUrl()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${persona.title}-persona-card.png`
    link.click()
  }

  const handleShareAndUnlock = async () => {
    setSharePending(true)
    await onShare()
    await new Promise((resolve) => setTimeout(resolve, SHARE_SHEET_MIN_DELAY_MS))
    setSharePending(false)
    setLocked(false)
  }

  return (
    <div className="screen screen-result">
      <ResultCard ref={cardRef} persona={persona} seed={seed} locked={locked} />

      {locked ? (
        <>
          <div className="persona-info-locked" aria-hidden="true">
            <div className="skeleton-line skeleton-eyebrow" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-desc" />
            <div className="skeleton-line skeleton-desc skeleton-desc-short" />
          </div>
          <button
            type="button"
            className="btn share-unlock-cta"
            onClick={handleShareAndUnlock}
            disabled={sharePending}
          >
            {sharePending ? '공유 시트를 확인하고 있어요' : '공유하고 카드 확인하기'}
          </button>
          <button type="button" className="skip-link" onClick={() => setLocked(false)}>
            공유 없이 그냥 볼게요
          </button>
        </>
      ) : (
        <>
          <div className="eyebrow">{persona.tagEn}</div>
          <div className="persona-title">{persona.title}</div>
          <p className="persona-desc">{persona.description}</p>
          <button type="button" className="btn" onClick={handleSave}>
            고화질로 저장해요
          </button>
          <div className="btn-row">
            <button type="button" className="btn-outline" onClick={onRetake}>
              다시 만들어요
            </button>
            <button type="button" className="btn-outline" onClick={onGoShare}>
              공유하러 가요
            </button>
          </div>
        </>
      )}

      {/* <AdSlot screen="result" /> */}
    </div>
  )
}
