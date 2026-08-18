import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Persona } from '../types'

export interface ResultCardProps {
  persona: Persona
  seed: number
  locked?: boolean
}

export interface ResultCardHandle {
  getDataUrl: () => string | null
}

interface GeneratedImage {
  mimeType: string
  base64: string
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

/**
 * 결과 카드 비주얼 컴포넌트예요.
 * 마운트되면 백엔드 AI 이미지 생성 API를 호출해서 카드 이미지를 받아와요.
 * 응답을 받기 전까지는 로딩 표시를, API 호출이 실패하면 기존 캔버스 렌더링을 폴백으로 보여줘요.
 */
export const ResultCard = forwardRef<ResultCardHandle, ResultCardProps>(function ResultCard(
  { persona, seed, locked = false },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<GeneratedImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPersonaCard(canvas, persona, seed)
  }, [persona, seed])

  useEffect(() => {
    const controller = new AbortController()
    setImage(null)
    setLoading(true)

    async function generateCardImage() {
      if (!BACKEND_URL) {
        console.error('VITE_BACKEND_URL이 설정되지 않아서 기본 카드로 대체해요')
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/generate-card`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            element: persona.element,
            personaTitle: persona.title,
            colorPrimary: persona.colors[0],
            colorSecondary: persona.colors[1],
          }),
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`카드 생성 API 응답 오류: ${response.status}`)
        }
        const data = await response.json()
        if (!data?.image?.base64 || !data?.image?.mimeType) {
          throw new Error('카드 생성 API 응답 형식이 올바르지 않아요')
        }
        setImage({ mimeType: data.image.mimeType, base64: data.image.base64 })
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('AI 카드 이미지 생성에 실패해서 기본 카드로 대체해요', error)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void generateCardImage()
    return () => controller.abort()
  }, [persona, seed])

  useImperativeHandle(ref, () => ({
    getDataUrl: () => {
      if (image) return `data:${image.mimeType};base64,${image.base64}`
      return canvasRef.current?.toDataURL('image/png') ?? null
    },
  }))

  const cardClassName = locked ? 'result-canvas result-canvas-locked' : 'result-canvas'

  return (
    <div className="result-card-wrap">
      <canvas
        ref={canvasRef}
        width={480}
        height={640}
        className={cardClassName}
        style={image ? { display: 'none' } : undefined}
      />
      {image && (
        <img
          src={`data:${image.mimeType};base64,${image.base64}`}
          alt={`${persona.title} 페르소나 카드`}
          className={cardClassName}
        />
      )}

      {loading && (
        <div className="card-loading-overlay" aria-hidden="true">
          <span className="card-spinner" />
        </div>
      )}

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
