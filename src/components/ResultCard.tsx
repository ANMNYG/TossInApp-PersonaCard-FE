import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { drawPersonaCard } from '../lib/drawPersonaCard'
import type { Persona } from '../types'

export interface ResultCardProps {
  persona: Persona
  seed: number
  locked?: boolean
}

export interface ResultCardHandle {
  getDataUrl: () => string | null
}

/**
 * 결과 카드 비주얼 컴포넌트예요. 캔버스에 원소 조합(주원소+보조원소)에 맞는
 * 도형·색상 그라데이션을 즉석에서 그려서 보여줘요.
 */
export const ResultCard = forwardRef<ResultCardHandle, ResultCardProps>(function ResultCard(
  { persona, seed, locked = false },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPersonaCard(canvas, persona, seed)
  }, [persona, seed])

  useImperativeHandle(ref, () => ({
    getDataUrl: () => canvasRef.current?.toDataURL('image/png') ?? null,
  }))

  const cardClassName = locked ? 'result-canvas result-canvas-locked' : 'result-canvas'

  return (
    <div className="result-card-wrap">
      <canvas ref={canvasRef} width={480} height={640} className={cardClassName} />

      {locked ? (
        <div className="lock-overlay">
          <span className="lock-icon" aria-hidden="true">
            🔒
          </span>
          <span className="lock-text">공유하면 카드가 열려요</span>
        </div>
      ) : (
        <div className="watermark">PERSONA CARD</div>
      )}
    </div>
  )
})
