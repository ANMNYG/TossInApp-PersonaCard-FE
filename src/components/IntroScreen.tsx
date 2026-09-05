import { useEffect, useRef, useState } from 'react'
import { drawBrandSignature } from '../lib/drawPersonaCard'
import { fetchVisitorCount } from '../lib/statsApi'
import { ChemistryBanner } from './ChemistryBanner'
import { StatusLine } from './StatusLine'

export interface IntroScreenProps {
  onStart: () => void
  /** 친구의 케미 공유 링크(?ref=)로 들어왔을 때 안내 배너를 보여줘요. */
  hasReferral?: boolean
}

export function IntroScreen({ onStart, hasReferral = false }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visitorCount, setVisitorCount] = useState<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBrandSignature(canvas)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchVisitorCount()
      .then((count) => {
        if (!cancelled) setVisitorCount(count)
      })
      .catch((error: unknown) => {
        // API가 아직 없거나 실패하면 숫자 없는 문구로 자연스럽게 폴백해요.
        console.error('방문자 수를 가져오지 못했어요', error)
      })
    return () => {
      cancelled = true
    }
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
      <StatusLine count={visitorCount} />
    </div>
  )
}
