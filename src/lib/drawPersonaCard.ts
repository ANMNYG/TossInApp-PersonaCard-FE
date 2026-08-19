import type { Persona } from '../types'

/**
 * 페르소나 카드를 캔버스에 그려요. ResultCard(실제 결과)와 IntroScreen(예시 미리보기)에서 함께 써요.
 * seed가 같으면 배경 블롭 위치도 항상 같게 나와요(결정론적 렌더링).
 */
export function drawPersonaCard(canvas: HTMLCanvasElement, persona: Persona, seed: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  drawBackground(ctx, w, h, persona, seed)
  drawEmblem(ctx, persona, w, h)
  drawFrame(ctx, w, h)
  drawTypography(ctx, persona, w, h)
}

function seededRandom(seed: number, offset: number) {
  const x = Math.sin(seed + offset) * 10000
  return x - Math.floor(x)
}

function withAlpha(hex: string, alphaHex: string) {
  return `${hex}${alphaHex}`
}

/** 주원소색 + 보조원소색을 번갈아 쓰는 은은한 radial blur 블롭 배경이에요. */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  persona: Persona,
  seed: number,
) {
  const bgGrad = ctx.createLinearGradient(0, 0, w, h)
  bgGrad.addColorStop(0, '#161329')
  bgGrad.addColorStop(1, '#0c0a18')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  const rand = (offset: number) => seededRandom(seed, offset)
  const blobCount = 8

  for (let i = 0; i < blobCount; i++) {
    const color = persona.colors[i % 2]
    const r = 70 + rand(i) * 140
    const x = rand(i * 3 + 1) * w
    const y = rand(i * 3 + 2) * h
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, withAlpha(color, '4d'))
    grad.addColorStop(0.6, withAlpha(color, '1f'))
    grad.addColorStop(1, withAlpha(color, '00'))
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function pathDiamond(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.lineTo(r, 0)
  ctx.lineTo(0, r)
  ctx.lineTo(-r, 0)
  ctx.closePath()
}

function pathHexagon(ctx: CanvasRenderingContext2D, r: number, rotation: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = rotation + (Math.PI / 3) * i
    const px = Math.cos(a) * r
    const py = Math.sin(a) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

/**
 * 순수형은 다이아몬드 하나만, 혼합형은 다이아몬드(주원소) 안에 육각형(보조원소)이
 * 살짝 겹치는 형태로 그려서 두 원소가 조합된 느낌을 살려요.
 */
function drawEmblem(ctx: CanvasRenderingContext2D, persona: Persona, w: number, h: number) {
  const cx = w / 2
  const cy = h * 0.4
  const isPure = persona.secondary === null

  ctx.save()
  ctx.translate(cx, cy)

  if (isPure) {
    ctx.save()
    ctx.shadowColor = persona.colors[1]
    ctx.shadowBlur = 30
    ctx.strokeStyle = persona.colors[0]
    ctx.lineWidth = 2.5
    ctx.globalAlpha = 0.95
    pathDiamond(ctx, 80)
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = persona.colors[1]
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.35
    pathDiamond(ctx, 56)
    ctx.stroke()
    ctx.restore()
  } else {
    ctx.save()
    ctx.shadowColor = persona.colors[0]
    ctx.shadowBlur = 26
    ctx.strokeStyle = persona.colors[0]
    ctx.lineWidth = 2.5
    ctx.globalAlpha = 0.9
    pathDiamond(ctx, 80)
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.translate(12, 16)
    ctx.shadowColor = persona.colors[1]
    ctx.shadowBlur = 22
    ctx.strokeStyle = persona.colors[1]
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.85
    pathHexagon(ctx, 46, Math.PI / 6)
    ctx.stroke()
    ctx.restore()
  }

  ctx.restore()
}

function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(16, 16, w - 32, h - 32)

  const tick = 16
  const inset = 16
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 1.5
  const corners: Array<[number, number, number, number]> = [
    [inset, inset, 1, 1],
    [w - inset, inset, -1, 1],
    [inset, h - inset, 1, -1],
    [w - inset, h - inset, -1, -1],
  ]
  for (const [x, y, dx, dy] of corners) {
    ctx.beginPath()
    ctx.moveTo(x + tick * dx, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + tick * dy)
    ctx.stroke()
  }
  ctx.restore()
}

function drawTypography(ctx: CanvasRenderingContext2D, persona: Persona, w: number, h: number) {
  ctx.save()
  ctx.textAlign = 'center'

  ctx.font = '11px monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(persona.tagEn, w / 2, h - 98)

  ctx.strokeStyle = persona.colors[0]
  ctx.globalAlpha = 0.65
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(w / 2 - 18, h - 86)
  ctx.lineTo(w / 2 + 18, h - 86)
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.font = "600 32px 'Fraunces', serif"
  ctx.fillStyle = 'rgba(255,255,255,0.96)'
  ctx.shadowColor = persona.colors[0]
  ctx.shadowBlur = 14
  ctx.fillText(persona.title, w / 2, h - 50)
  ctx.shadowBlur = 0

  ctx.font = '10px monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText('PERSONA CARD', w / 2, h - 26)
  ctx.restore()
}
