import { useRef, useState } from 'react'
import type { ChemistryVisitState, ElementType, Persona } from '../types'
// 광고 붙이기 전까지 임시 비활성화. 다시 켤 때는 아래 import와 <AdSlot />을 되살리세요.
// import { AdSlot } from './AdSlot'
import { ChemistryResult } from './ChemistryResult'
import { NicknamePrompt } from './NicknamePrompt'
import { ResultCard, type ResultCardHandle } from './ResultCard'
import { ResultInterpretation } from './ResultInterpretation'

// Share.sendMessage는 Promise<void>만 반환하고 성공/취소 여부를 알려주지 않아요(fire-and-forget).
// 그래서 공유 호출이 끝난 뒤에도 시트를 실제로 만졌다 나올 만큼 최소한의 시간차를 둬요.
const SHARE_SHEET_MIN_DELAY_MS = 1500

export interface ResultScreenProps {
  persona: Persona
  seed: number
  answers: ElementType[]
  onShare: () => Promise<void>
  onRetake: () => void
  onGoShare: () => void
  /** 친구의 케미 링크(?ref=)로 들어온 방문자인지 여부예요. */
  isVisitor: boolean
  /** 친구 링크로 들어와 카드를 완성했을 때의 케미 조회 상태예요. idle이면 아무것도 보여주지 않아요. */
  chemistry: ChemistryVisitState
  /** true면 케미 조회 전에 방문자 닉네임 입력/건너뛰기를 먼저 물어봐요. */
  needsNickname: boolean
  onSubmitNickname: (nickname: string) => void
  onSkipNickname: () => void
  /** true면 코드 발급 전에 공유자 본인 닉네임 입력/건너뛰기를 물어봐요. */
  needsSharerNickname: boolean
  onSubmitSharerNickname: (nickname: string) => void
  onSkipSharerNickname: () => void
}

export function ResultScreen({
  persona,
  seed,
  answers,
  onShare,
  onRetake,
  onGoShare,
  isVisitor,
  chemistry,
  needsNickname,
  onSubmitNickname,
  onSkipNickname,
  needsSharerNickname,
  onSubmitSharerNickname,
  onSkipSharerNickname,
}: ResultScreenProps) {
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

      {/* 방문자 케미 흐름: 내 카드 잠금 여부와 무관하게 먼저 노출해요.
          (잠금은 공유자의 카드 공개용이라, 방문자에게는 케미 결과가 우선이에요.) */}
      {isVisitor && needsNickname && (
        <NicknamePrompt onSubmit={onSubmitNickname} onSkip={onSkipNickname} />
      )}
      {isVisitor && !needsNickname && chemistry.status === 'loading' && (
        <div className="chemistry-box-loading">케미 결과를 확인하고 있어요...</div>
      )}
      {isVisitor && !needsNickname && chemistry.status === 'success' && (
        <ChemistryResult result={chemistry.data} />
      )}
      {isVisitor && !needsNickname && chemistry.status === 'error' && (
        <div className="chemistry-box-loading">
          케미 결과를 확인하지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {/* 공유자 닉네임: 코드 발급(공유) 전에 잠금 여부와 무관하게 물어봐요. */}
      {!isVisitor && needsSharerNickname && (
        <NicknamePrompt
          onSubmit={onSubmitSharerNickname}
          onSkip={onSkipSharerNickname}
          guide="친구가 케미 결과에서 나를 알아볼 수 있게 닉네임을 남겨보세요 (선택)"
        />
      )}

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
          <ResultInterpretation persona={persona} answers={answers} />

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
