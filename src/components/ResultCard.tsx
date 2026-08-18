import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Persona } from '../types'

export interface ResultCardProps {
  persona: Persona
  seed: number
}

export interface ResultCardHandle {
  getDataUrl: () => string | null
}

/**
 * 결과 카드 비주얼 컴포넌트예요.
 * 지금은 캔버스로 카드 이미지를 즉석에서 그려서 보여주지만, props 구조(persona, seed)는
 * 그대로 유지한 채 내부 구현만 AI 이미지 생성 API 호출 결과로 교체할 수 있도록 분리해뒀어요.
 */
export const ResultCard = forwardRef<ResultCardHandle, ResultCardProps>(function ResultCard(
  { persona, seed },
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

  return (
    <div className="result-card-wrap">
      <canvas ref={canvasRef} width={480} height={640} className="result-canvas" />
      <div className="watermark">PERSONA CARD</div>
    </div>
  )
})

function drawPersonaCard(canvas: HTMLCanvasElement, persona: Persona, seed: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  const bgGrad = ctx.createLinearGradient(0, 0, w, h)
  bgGrad.addColorStop(0, '#161329')
  bgGrad.addColorStop(1, '#0c0a18')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  const rand = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  for (let i = 0; i < 7; i++) {
    const r = 30 + rand(i) * 90
    const x = rand(i * 3 + 1) * w
    const y = rand(i * 3 + 2) * h
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, `${persona.colors[i % 2]}cc`)
    grad.addColorStop(1, `${persona.colors[i % 2]}00`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.save()
  ctx.translate(w / 2, h * 0.42)
  ctx.strokeStyle = persona.colors[1]
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    const px = Math.cos(a) * 70
    const py = Math.sin(a) * 70
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.lineWidth = 2
  ctx.strokeRect(14, 14, w - 28, h - 28)

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = "600 30px 'Fraunces', serif"
  ctx.textAlign = 'center'
  ctx.fillText(persona.title, w / 2, h - 70)

  ctx.font = '12px monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(`${persona.tagEn} · PERSONA CARD`, w / 2, h - 42)
}
