import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { drawCardBack, drawPersonaCard } from '../lib/drawPersonaCard'
import type { Persona } from '../types'

export interface ResultCardProps {
  persona: Persona
  seed: number
  locked?: boolean
}

export interface ResultCardHandle {
  getDataUrl: () => string | null
}

/** 뒷면을 보여준 뒤 flip 애니메이션을 시작하기까지 주는 지연 시간이에요. */
const FLIP_START_DELAY_MS = 450
/** App.css의 .flip-card transition 시간과 맞춰야 해요. */
const FLIP_DURATION_MS = 700

/**
 * 결과 카드 비주얼 컴포넌트예요. 타로카드 뒷면이 먼저 보였다가 3D flip으로
 * 원소 조합(주원소+보조원소)에 맞는 심볼이 그려진 앞면이 공개돼요.
 */
export const ResultCard = forwardRef<ResultCardHandle, ResultCardProps>(function ResultCard(
  { persona, seed, locked = false },
  ref,
) {
  const frontCanvasRef = useRef<HTMLCanvasElement>(null)
  const backCanvasRef = useRef<HTMLCanvasElement>(null)
  const [flipped, setFlipped] = useState(false)
  // flip 회전이 실제로 끝난 뒤에 워터마크/잠금 오버레이가 뜨도록 별도로 관리해요.
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const front = frontCanvasRef.current
    const back = backCanvasRef.current
    if (!front || !back) return

    setFlipped(false)
    setRevealed(false)
    drawPersonaCard(front, persona, seed)
    drawCardBack(back)

    const flipTimer = setTimeout(() => setFlipped(true), FLIP_START_DELAY_MS)
    const revealTimer = setTimeout(
      () => setRevealed(true),
      FLIP_START_DELAY_MS + FLIP_DURATION_MS,
    )
    return () => {
      clearTimeout(flipTimer)
      clearTimeout(revealTimer)
    }
  }, [persona, seed])

  useImperativeHandle(ref, () => ({
    getDataUrl: () => frontCanvasRef.current?.toDataURL('image/png') ?? null,
  }))

  const frontCanvasClassName = locked ? 'result-canvas result-canvas-locked' : 'result-canvas'

  return (
    <div className="result-card-wrap">
      <div className="flip-scene">
        <div className={flipped ? 'flip-card flipped' : 'flip-card'}>
          <div className="flip-face flip-face-back">
            <canvas ref={backCanvasRef} width={480} height={640} className="result-canvas" />
          </div>
          <div className="flip-face flip-face-front">
            <canvas ref={frontCanvasRef} width={480} height={640} className={frontCanvasClassName} />
          </div>
        </div>
      </div>

      {revealed &&
        (locked ? (
          <div className="lock-overlay">
            <span className="lock-icon" aria-hidden="true">
              🔒
            </span>
            <span className="lock-text">공유하면 카드가 열려요</span>
          </div>
        ) : (
          <div className="watermark">PERSONA CARD</div>
        ))}
    </div>
  )
})
