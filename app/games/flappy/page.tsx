'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './flappy.module.css'

const W = 380
const H = 520
const BIRD_X = 90
const BIRD_R = 14
const GRAVITY = 0.10
const FLAP_FORCE = -2.8
const PIPE_W = 52
const PIPE_GAP = 148
const PIPE_SPEED = 2.3

type Pipe = { x: number; gapY: number; passed: boolean }
type Status = 'idle' | 'playing' | 'dead'

interface GameState {
  birdY: number
  birdVy: number
  pipes: Pipe[]
  score: number
  status: Status
  animId: number
}

function randGapY(): number {
  const min = PIPE_GAP / 2 + 70
  const max = H - 60 - PIPE_GAP / 2 - 70
  return min + Math.random() * (max - min)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  if (h <= 0) return
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawPipe(ctx: CanvasRenderingContext2D, x: number, topH: number, botY: number) {
  const botH = H - 60 - botY
  if (botH <= 0 && topH <= 0) return

  ctx.fillStyle = '#1d4ed8'
  if (topH > 0) {
    roundRect(ctx, x, 0, PIPE_W, topH - 10, 8)
    ctx.fill()
    ctx.fillRect(x - 5, topH - 18, PIPE_W + 10, 18)
  }
  if (botH > 0) {
    ctx.fillRect(x - 5, botY, PIPE_W + 10, 18)
    roundRect(ctx, x, botY + 18, PIPE_W, botH, 8)
    ctx.fill()
  }

  ctx.fillStyle = 'rgba(255,255,255,0.16)'
  if (topH > 0) ctx.fillRect(x + 7, 0, 8, topH - 10)
  if (botH > 0) ctx.fillRect(x + 7, botY + 18, 8, botH)
}

function drawBird(ctx: CanvasRenderingContext2D, y: number, vy: number) {
  const angle = Math.min(Math.max(vy * 0.06, -0.45), 0.9)
  ctx.save()
  ctx.translate(BIRD_X, y)
  ctx.rotate(angle)

  ctx.fillStyle = '#2563eb'
  ctx.beginPath()
  ctx.ellipse(0, 0, BIRD_R, BIRD_R - 2, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#93c5fd'
  ctx.beginPath()
  ctx.ellipse(-3, 4, 8, 5, -0.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(5, -5, 4.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(6.5, -5, 2.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f59e0b'
  ctx.beginPath()
  ctx.moveTo(BIRD_R, -1)
  ctx.lineTo(BIRD_R + 8, -2)
  ctx.lineTo(BIRD_R + 8, 3)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

export default function FlappyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<GameState>({
    birdY: H / 2,
    birdVy: 0,
    pipes: [],
    score: 0,
    status: 'idle',
    animId: 0,
  })
  const [uiScore, setUiScore] = useState(0)
  const [best, setBest] = useState(0)
  const bestRef = useRef(0)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('flappy-best') ?? '0', 10)
    bestRef.current = stored
    setBest(stored)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const g = gameRef.current

    function reset() {
      g.birdY = H / 2
      g.birdVy = 0
      g.pipes = []
      g.score = 0
      g.status = 'playing'
      setUiScore(0)
    }

    function handleAction() {
      if (g.status === 'idle' || g.status === 'dead') {
        reset()
      } else {
        g.birdVy = FLAP_FORCE
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        handleAction()
      }
    }
    function onTouchStart(e: TouchEvent) { e.preventDefault(); handleAction() }
    function onClick() { handleAction() }

    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('keydown', onKey)

    function loop() {
      if (g.status === 'playing') {
        g.birdVy += GRAVITY
        g.birdY += g.birdVy

        if (g.pipes.length === 0 || g.pipes[g.pipes.length - 1].x < W - 210) {
          g.pipes.push({ x: W + PIPE_W, gapY: randGapY(), passed: false })
        }

        g.pipes.forEach((p) => { p.x -= PIPE_SPEED })
        g.pipes = g.pipes.filter((p) => p.x > -PIPE_W - 10)

        g.pipes.forEach((p) => {
          if (!p.passed && p.x + PIPE_W < BIRD_X - BIRD_R) {
            p.passed = true
            g.score++
            setUiScore(g.score)
          }
        })

        const dead =
          g.birdY + BIRD_R > H - 60 ||
          g.birdY - BIRD_R < 0 ||
          g.pipes.some(
            (p) =>
              BIRD_X + BIRD_R - 3 > p.x &&
              BIRD_X - BIRD_R + 3 < p.x + PIPE_W &&
              (g.birdY - BIRD_R + 3 < p.gapY - PIPE_GAP / 2 ||
                g.birdY + BIRD_R - 3 > p.gapY + PIPE_GAP / 2),
          )

        if (dead) {
          g.status = 'dead'
          if (g.score > bestRef.current) {
            bestRef.current = g.score
            setBest(g.score)
            localStorage.setItem('flappy-best', String(g.score))
          }
        }
      }

      const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
      bgGrad.addColorStop(0, '#bfdbfe')
      bgGrad.addColorStop(1, '#eff6ff')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      ctx.fillStyle = '#475569'
      ctx.fillRect(0, H - 60, W, 60)
      ctx.fillStyle = '#4ade80'
      ctx.fillRect(0, H - 60, W, 14)
      ctx.fillStyle = '#86efac'
      ctx.fillRect(0, H - 60, W, 5)

      g.pipes.forEach((p) => drawPipe(ctx, p.x, p.gapY - PIPE_GAP / 2, p.gapY + PIPE_GAP / 2))
      drawBird(ctx, g.birdY, g.birdVy)

      if (g.status === 'playing') {
        ctx.fillStyle = 'rgba(15,23,42,0.65)'
        ctx.font = 'bold 28px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(String(g.score), W / 2, 46)
      }

      if (g.status !== 'playing') {
        ctx.fillStyle = 'rgba(240,245,255,0.84)'
        ctx.fillRect(0, 0, W, H)

        ctx.textAlign = 'center'
        ctx.fillStyle = '#0f172a'

        if (g.status === 'idle') {
          ctx.font = 'bold 32px Inter, sans-serif'
          ctx.fillText('🐦 Flappy Bird', W / 2, H / 2 - 50)
          ctx.font = '15px Inter, sans-serif'
          ctx.fillStyle = '#475569'
          ctx.fillText('tap · click · space to flap', W / 2, H / 2 - 16)
        } else {
          ctx.font = 'bold 32px Inter, sans-serif'
          ctx.fillText('Game Over', W / 2, H / 2 - 70)
          ctx.font = '17px Inter, sans-serif'
          ctx.fillStyle = '#475569'
          ctx.fillText(`Score: ${g.score}`, W / 2, H / 2 - 36)
          ctx.fillText(`Best: ${bestRef.current}`, W / 2, H / 2 - 10)
        }

        ctx.fillStyle = '#2563eb'
        const bx = W / 2 - 64
        const by = H / 2 + 20
        roundRect(ctx, bx, by, 128, 44, 10)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 15px Inter, sans-serif'
        ctx.fillText(g.status === 'dead' ? 'Play Again' : 'Start', W / 2, by + 27)
      }

      g.animId = requestAnimationFrame(loop)
    }

    g.animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(g.animId)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/#games" className={styles.back}>← portfolio</Link>
        <div className={styles.scores}>
          <span>Score <strong>{uiScore}</strong></span>
          <span>Best <strong>{best}</strong></span>
        </div>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className={styles.canvas} />
    </div>
  )
}
