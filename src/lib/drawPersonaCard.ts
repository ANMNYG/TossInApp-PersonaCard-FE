import type { ElementType, Persona } from '../types'

const GOLD = '#c9a227'
const GOLD_LIGHT = '#e9d38a'

/**
 * 페르소나 카드를 캔버스에 그려요. ResultCard(실제 결과)와 IntroScreen(예시 미리보기)에서 함께 써요.
 * seed가 같으면 배경 별자리 위치도 항상 같게 나와요(결정론적 렌더링).
 */
export function drawPersonaCard(canvas: HTMLCanvasElement, persona: Persona, seed: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  drawBackground(ctx, w, h, persona, seed)
  drawStarField(ctx, w, h, seed)
  drawEmblem(ctx, persona, w, h)
  drawFrame(ctx, w, h)
  drawTypography(ctx, persona, w, h)
}

/** 카드 뒷면(플립 애니메이션 초기 상태)이에요. 원소와 무관한 공통 만다라 디자인이에요. */
export function drawCardBack(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  const bgGrad = ctx.createLinearGradient(0, 0, w, h)
  bgGrad.addColorStop(0, '#171130')
  bgGrad.addColorStop(1, '#0a0815')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  drawStarField(ctx, w, h, 42)

  ctx.save()
  ctx.translate(w / 2, h / 2)

  for (const r of [92, 72, 52]) {
    ctx.save()
    ctx.strokeStyle = withAlpha(GOLD_LIGHT, '55')
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  drawGlowingStroke(
    ctx,
    () => {
      const rayCount = 8
      ctx.beginPath()
      for (let i = 0; i < rayCount; i++) {
        const angle = (Math.PI * 2 * i) / rayCount
        ctx.moveTo(Math.cos(angle) * 30, Math.sin(angle) * 30)
        ctx.lineTo(Math.cos(angle) * 92, Math.sin(angle) * 92)
      }
    },
    GOLD_LIGHT,
  )

  ctx.save()
  ctx.fillStyle = GOLD_LIGHT
  ctx.shadowColor = GOLD
  ctx.shadowBlur = 22
  pathSparkleStar(ctx, 26)
  ctx.fill()
  ctx.restore()

  ctx.restore()

  drawFrame(ctx, w, h)
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
  bgGrad.addColorStop(0, '#171130')
  bgGrad.addColorStop(1, '#0a0815')
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
    grad.addColorStop(0, withAlpha(color, '40'))
    grad.addColorStop(0.6, withAlpha(color, '1a'))
    grad.addColorStop(1, withAlpha(color, '00'))
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function pathSparkleStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.lineTo(r * 0.22, -r * 0.22)
  ctx.lineTo(r, 0)
  ctx.lineTo(r * 0.22, r * 0.22)
  ctx.lineTo(0, r)
  ctx.lineTo(-r * 0.22, r * 0.22)
  ctx.lineTo(-r, 0)
  ctx.lineTo(-r * 0.22, -r * 0.22)
  ctx.closePath()
}

/** 밤하늘 같은 질감을 주는 은은한 별/점 패턴이에요. 별자리처럼 몇 개는 얇은 선으로 이어줘요. */
function drawStarField(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const rand = (offset: number) => seededRandom(seed, offset + 500)
  ctx.save()

  const dotCount = 46
  for (let i = 0; i < dotCount; i++) {
    const x = rand(i * 2) * w
    const y = rand(i * 2 + 1) * h
    const r = 0.6 + rand(i * 2 + 900) * 1.1
    ctx.globalAlpha = 0.25 + rand(i * 2 + 1800) * 0.35
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const sparkleCount = 6
  const sparkles: Array<[number, number]> = []
  for (let i = 0; i < sparkleCount; i++) {
    const x = 40 + rand(i * 5 + 300) * (w - 80)
    const y = 40 + rand(i * 5 + 340) * (h - 80)
    sparkles.push([x, y])
    ctx.save()
    ctx.translate(x, y)
    ctx.globalAlpha = 0.5 + rand(i * 5 + 380) * 0.3
    ctx.fillStyle = GOLD_LIGHT
    ctx.shadowColor = GOLD_LIGHT
    ctx.shadowBlur = 6
    pathSparkleStar(ctx, 2.6 + rand(i * 5 + 420) * 2.2)
    ctx.fill()
    ctx.restore()
  }

  ctx.globalAlpha = 0.14
  ctx.strokeStyle = GOLD_LIGHT
  ctx.lineWidth = 0.6
  ctx.beginPath()
  for (let i = 0; i < sparkles.length - 1; i++) {
    if (rand(i * 7 + 700) > 0.55) continue
    const [x1, y1] = sparkles[i]
    const [x2, y2] = sparkles[i + 1]
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
  }
  ctx.stroke()

  ctx.restore()
}

/** 배경 위에 중앙 심볼이 확실히 도드라지도록, 심볼 자리 뒤를 은은하게 어둡게 눌러줘요. */
function drawEmblemVignette(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save()
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 172)
  grad.addColorStop(0, 'rgba(6,5,14,0.6)')
  grad.addColorStop(0.7, 'rgba(6,5,14,0.28)')
  grad.addColorStop(1, 'rgba(6,5,14,0)')
  ctx.fillStyle = grad
  ctx.fillRect(cx - 200, cy - 200, 400, 400)
  ctx.restore()
}

/** 큰 반경으로 흐릿하게 번지는 halo 패스 + 얇고 선명한 core 패스, 두 겹으로 그려서 네온처럼 부각시켜요. */
function drawGlowingStroke(ctx: CanvasRenderingContext2D, buildPath: () => void, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 32
  ctx.lineWidth = 6
  ctx.globalAlpha = 0.4
  buildPath()
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 16
  ctx.lineWidth = 2.6
  ctx.globalAlpha = 1
  buildPath()
  ctx.stroke()
  ctx.restore()
}

/** 해/불꽃 문양: 중심 원 + 길고 짧은 광선이 교대로 뻗어나가요. */
function drawFireSymbol(ctx: CanvasRenderingContext2D, r: number, color: string) {
  drawGlowingStroke(
    ctx,
    () => {
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2)
    },
    color,
  )

  drawGlowingStroke(
    ctx,
    () => {
      const rayCount = 12
      ctx.beginPath()
      for (let i = 0; i < rayCount; i++) {
        const angle = (Math.PI * 2 * i) / rayCount
        const inner = r * 0.56
        const outer = i % 2 === 0 ? r : r * 0.76
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
        ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
      }
    },
    color,
  )
}

/** 초승달 + 잔물결: 두 원호를 이어붙여 만든 달 윤곽 아래로 물결선을 깔아요. */
function drawWaterSymbol(ctx: CanvasRenderingContext2D, r: number, color: string) {
  drawGlowingStroke(
    ctx,
    () => {
      const innerR = r * 0.92
      const dx = r * 0.62
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.78, Math.PI * 0.55, -Math.PI * 0.55, true)
      ctx.arc(dx * 0.65, 0, innerR * 0.72, -Math.PI * 0.42, Math.PI * 0.42, false)
      ctx.closePath()
    },
    color,
  )

  drawGlowingStroke(
    ctx,
    () => {
      ctx.beginPath()
      const waveY = [r * 0.62, r * 0.9]
      for (const y of waveY) {
        const width = r * 1.3
        const steps = 24
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const x = -width / 2 + t * width
          const wy = y + Math.sin(t * Math.PI * 3) * (r * 0.06)
          if (i === 0) ctx.moveTo(x, wy)
          else ctx.lineTo(x, wy)
        }
      }
    },
    color,
  )
}

/** 산맥 실루엣 + 별: 은은한 채움이 있는 봉우리 위로 작은 반짝이 별을 띄워요. */
function drawEarthSymbol(ctx: CanvasRenderingContext2D, r: number, color: string) {
  const buildRidge = () => {
    ctx.beginPath()
    ctx.moveTo(-r, r * 0.5)
    ctx.lineTo(-r * 0.5, -r * 0.15)
    ctx.lineTo(-r * 0.18, r * 0.18)
    ctx.lineTo(r * 0.12, -r * 0.55)
    ctx.lineTo(r * 0.46, -r * 0.05)
    ctx.lineTo(r, r * 0.5)
  }

  ctx.save()
  buildRidge()
  ctx.lineTo(r, r * 0.85)
  ctx.lineTo(-r, r * 0.85)
  ctx.closePath()
  const fill = ctx.createLinearGradient(0, -r * 0.55, 0, r * 0.85)
  fill.addColorStop(0, withAlpha(color, '55'))
  fill.addColorStop(1, withAlpha(color, '05'))
  ctx.fillStyle = fill
  ctx.fill()
  ctx.restore()

  drawGlowingStroke(ctx, buildRidge, color)

  ctx.save()
  ctx.translate(r * 0.12, -r * 0.85)
  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 14
  pathSparkleStar(ctx, r * 0.16)
  ctx.fill()
  ctx.restore()
}

/** 나선형 소용돌이 + 깃털 라인: 바람이 휘감아 도는 궤적을 표현해요. */
function drawAirSymbol(ctx: CanvasRenderingContext2D, r: number, color: string) {
  drawGlowingStroke(
    ctx,
    () => {
      const steps = 90
      const turns = 1.9
      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const angle = t * Math.PI * 2 * turns
        const rad = t * r * 0.82
        const x = Math.cos(angle) * rad
        const y = Math.sin(angle) * rad
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
    },
    color,
  )

  drawGlowingStroke(
    ctx,
    () => {
      ctx.beginPath()
      const wisps: Array<[number, number, number, number, number, number]> = [
        [r * 0.15, -r * 0.9, r * 0.55, -r * 1.08, r * 0.85, -r * 0.78],
        [-r * 0.35, -r * 0.68, -r * 0.7, -r * 0.9, -r * 0.95, -r * 0.55],
      ]
      for (const [cx1, cy1, cx2, cy2, ex, ey] of wisps) {
        ctx.moveTo(0, -r * 0.82)
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey)
      }
    },
    color,
  )
}

function drawElementSymbol(
  ctx: CanvasRenderingContext2D,
  element: ElementType,
  r: number,
  color: string,
) {
  if (element === 'fire') drawFireSymbol(ctx, r, color)
  else if (element === 'water') drawWaterSymbol(ctx, r, color)
  else if (element === 'earth') drawEarthSymbol(ctx, r, color)
  else drawAirSymbol(ctx, r, color)
}

/**
 * 순수형은 원소 심볼 하나를 크게, 혼합형은 주원소 심볼을 위에 · 보조원소 심볼을 아래에
 * 배치하고 그 사이에 두 색을 섞은 "만남의 별"을 반짝이게 그려요.
 */
function drawEmblem(ctx: CanvasRenderingContext2D, persona: Persona, w: number, h: number) {
  const cx = w / 2
  const cy = h * 0.4
  drawEmblemVignette(ctx, cx, cy)

  ctx.save()
  ctx.translate(cx, cy)

  if (!persona.secondary) {
    drawElementSymbol(ctx, persona.primary, 78, persona.colors[0])
  } else {
    ctx.save()
    ctx.translate(0, -54)
    drawElementSymbol(ctx, persona.primary, 50, persona.colors[0])
    ctx.restore()

    ctx.save()
    ctx.translate(0, 58)
    drawElementSymbol(ctx, persona.secondary, 50, persona.colors[1])
    ctx.restore()

    const meetColor = screenBlendColors(persona.colors[0], persona.colors[1])
    ctx.save()
    ctx.fillStyle = meetColor
    ctx.shadowColor = meetColor
    ctx.shadowBlur = 18
    pathSparkleStar(ctx, 7)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}

/** 이중 라인 프레임 + 네 모서리 반짝이 별로 카드 테두리를 장식해요. */
function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save()
  ctx.strokeStyle = withAlpha(GOLD, '55')
  ctx.lineWidth = 1
  ctx.strokeRect(14, 14, w - 28, h - 28)

  ctx.strokeStyle = withAlpha(GOLD_LIGHT, 'aa')
  ctx.shadowColor = GOLD
  ctx.shadowBlur = 4
  ctx.lineWidth = 2
  ctx.strokeRect(22, 22, w - 44, h - 44)
  ctx.restore()

  const inset = 22
  const corners: Array<[number, number]> = [
    [inset, inset],
    [w - inset, inset],
    [inset, h - inset],
    [w - inset, h - inset],
  ]
  for (const [x, y] of corners) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = GOLD_LIGHT
    ctx.shadowColor = GOLD
    ctx.shadowBlur = 8
    pathSparkleStar(ctx, 7)
    ctx.fill()
    ctx.restore()
  }
}

function drawTypography(ctx: CanvasRenderingContext2D, persona: Persona, w: number, h: number) {
  ctx.save()
  ctx.textAlign = 'center'

  ctx.font = '11px monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(persona.tagEn, w / 2, h - 98)

  ctx.strokeStyle = GOLD_LIGHT
  ctx.globalAlpha = 0.7
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
