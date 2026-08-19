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

function hexToRgb(hex: string) {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  }
}

function toHexByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, '0')
}

/** 두 색을 스크린 블렌드로 섞어서, 원본보다 밝고 화사한 "만남의 색"을 만들어요. */
function screenBlendColors(hexA: string, hexB: string) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const screen = (ca: number, cb: number) => 255 - ((255 - ca) * (255 - cb)) / 255
  return `#${toHexByte(screen(a.r, b.r))}${toHexByte(screen(a.g, b.g))}${toHexByte(screen(a.b, b.b))}`
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

/** 배경 위에 중앙 도형이 확실히 도드라지도록, 도형 자리 뒤를 은은하게 어둡게 눌러줘요. */
function drawEmblemVignette(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save()
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 168)
  grad.addColorStop(0, 'rgba(6,5,14,0.6)')
  grad.addColorStop(0.7, 'rgba(6,5,14,0.28)')
  grad.addColorStop(1, 'rgba(6,5,14,0)')
  ctx.fillStyle = grad
  ctx.fillRect(cx - 200, cy - 200, 400, 400)
  ctx.restore()
}

/** 큰 반경으로 흐릿하게 번지는 halo 패스 + 얇고 선명한 core 패스, 두 겹으로 그려서 네온처럼 부각시켜요. */
function drawGlowingStroke(
  ctx: CanvasRenderingContext2D,
  buildPath: () => void,
  color: string,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 38
  ctx.lineWidth = 7
  ctx.globalAlpha = 0.45
  buildPath()
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 18
  ctx.lineWidth = 3.5
  ctx.globalAlpha = 1
  buildPath()
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = '#ffffff'
  ctx.shadowBlur = 0
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  buildPath()
  ctx.stroke()
  ctx.restore()
}

const EMBLEM_DIAMOND_RADIUS = 84
const EMBLEM_HEX_RADIUS = 50
const EMBLEM_HEX_OFFSET = { x: 14, y: 18 }
const EMBLEM_HEX_ROTATION = Math.PI / 6

/**
 * 순수형은 채워진 다이아몬드 하나를, 혼합형은 다이아몬드(주원소)와 육각형(보조원소)이
 * 겹치는 형태로 그려요. 혼합형은 두 도형이 실제로 겹치는 자리를 계산해서 주+보조 원소색을
 * 섞은 밝은 색으로 채워, "두 원소가 만나는 지점"이 도드라지게 해요.
 */
function drawEmblem(ctx: CanvasRenderingContext2D, persona: Persona, w: number, h: number) {
  const cx = w / 2
  const cy = h * 0.4
  const isPure = persona.secondary === null

  drawEmblemVignette(ctx, cx, cy)

  ctx.save()
  ctx.translate(cx, cy)

  if (isPure) {
    const r = EMBLEM_DIAMOND_RADIUS

    ctx.save()
    const fill = ctx.createRadialGradient(0, -r * 0.15, 0, 0, 0, r)
    fill.addColorStop(0, withAlpha(persona.colors[1], '77'))
    fill.addColorStop(0.55, withAlpha(persona.colors[0], '33'))
    fill.addColorStop(1, withAlpha(persona.colors[0], '00'))
    ctx.fillStyle = fill
    pathDiamond(ctx, r)
    ctx.fill()
    ctx.restore()

    drawGlowingStroke(ctx, () => pathDiamond(ctx, r), persona.colors[0])

    ctx.save()
    ctx.rotate(Math.PI / 4)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    pathDiamond(ctx, r * 0.48)
    ctx.stroke()
    ctx.restore()
  } else {
    const rDiamond = EMBLEM_DIAMOND_RADIUS
    const rHex = EMBLEM_HEX_RADIUS
    const meetColor = screenBlendColors(persona.colors[0], persona.colors[1])

    // 다이아몬드와 육각형이 겹치는 부분만 클립으로 잘라내서 "만남의 색"으로 채워요.
    ctx.save()
    pathDiamond(ctx, rDiamond)
    ctx.clip()
    ctx.save()
    ctx.translate(EMBLEM_HEX_OFFSET.x, EMBLEM_HEX_OFFSET.y)
    ctx.shadowColor = meetColor
    ctx.shadowBlur = 34
    ctx.fillStyle = withAlpha(meetColor, 'aa')
    pathHexagon(ctx, rHex, EMBLEM_HEX_ROTATION)
    ctx.fill()
    ctx.restore()
    ctx.restore()

    drawGlowingStroke(ctx, () => pathDiamond(ctx, rDiamond), persona.colors[0])

    ctx.save()
    ctx.translate(EMBLEM_HEX_OFFSET.x, EMBLEM_HEX_OFFSET.y)
    drawGlowingStroke(ctx, () => pathHexagon(ctx, rHex, EMBLEM_HEX_ROTATION), persona.colors[1])
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
