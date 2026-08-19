import { useEffect, useRef } from 'react'
import { drawPersonaCard } from '../lib/drawPersonaCard'
import { PERSONAS } from '../data/personas'

export interface IntroScreenProps {
  onStart: () => void
}

// 인트로에서 보여줄 예시 카드예요. 혼합형(뜨거운 파도)을 골라서 16타입 조합 느낌을 미리 보여줘요.
const PREVIEW_PERSONA = PERSONAS['fire-water']
const PREVIEW_SEED = 1234

export function IntroScreen({ onStart }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPersonaCard(canvas, PREVIEW_PERSONA, PREVIEW_SEED)
  }, [])

  return (
    <div className="screen screen-intro">
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
      <div className="liveline">오늘 12,384명이 자신의 카드를 만들었어요</div>
    </div>
  )
}
