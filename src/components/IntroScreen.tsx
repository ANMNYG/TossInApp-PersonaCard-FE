import { useEffect, useRef } from 'react'
import { drawBrandSignature } from '../lib/drawPersonaCard'
import { ChemistryBanner } from './ChemistryBanner'
import { StatusLine } from './StatusLine'

export interface IntroScreenProps {
  onStart: () => void
  /** 친구의 케미 공유 링크(?ref=)로 들어왔을 때 안내 배너를 보여줘요. */
  hasReferral?: boolean
}

export function IntroScreen({ onStart, hasReferral = false }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBrandSignature(canvas)
  }, [])

  return (
    <div className="screen screen-intro">
      {hasReferral && <ChemistryBanner />}
      <div className="eyebrow">✦ AI 페르소나 카드</div>
      <h1 className="display">
        7개 질문으로
        <br />
        나의 원소 카드를 만나요
      </h1>
      <div className="card-preview">
        <canvas ref={canvasRef} width={480} height={640} className="card-preview-canvas" />
      </div>
      <div className="tags">
        <span className="tag">1분 완성</span>
        <span className="tag">로그인 없이 시작</span>
        <span className="tag">완성 후 바로 공유</span>
      </div>
      <div className="spacer" />
      <button type="button" className="btn" onClick={onStart}>
        지금 카드 만들어봐요
      </button>
      <StatusLine />
    </div>
  )
}
