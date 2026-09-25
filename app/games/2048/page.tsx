'use client'
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import styles from './2048.module.css'

const PADDING = 10
const GAP = 10
const ANIM_MS = 120

type Status = 'playing' | 'won' | 'lost'

type Tile = {
  id: number
  value: number
  row: number
  col: number
  isMerging: boolean
  pendingValue: number | null | undefined
  isNew: boolean
}

type Dir = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN'

let tileCounter = 0
function mkTile(value: number, row: number, col: number): Tile {
  return { id: tileCounter++, value, row, col, isMerging: false, pendingValue: null, isNew: true }
}

function emptyPositions(tiles: Tile[]): [number, number][] {
  const occ = new Set(tiles.filter((t) => !t.isMerging).map((t) => `${t.row},${t.col}`))
  const res: [number, number][] = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (!occ.has(`${r},${c}`)) res.push([r, c])
  return res
}

function spawn(tiles: Tile[]): Tile | null {
  const empty = emptyPositions(tiles)
  if (!empty.length) return null
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  return mkTile(Math.random() < 0.9 ? 2 : 4, r, c)
}

function initTiles(): Tile[] {
  const all: [number, number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) all.push([r, c])
  const pick = all.sort(() => Math.random() - 0.5).slice(0, 2)
  return pick.map(([r, c]) => mkTile(2, r, c))
}

function processMove(tiles: Tile[], dir: Dir): { tiles: Tile[]; score: number; moved: boolean } {
  const w = tiles.map((t): Tile => ({ ...t, isMerging: false, pendingValue: null, isNew: false }))
  let score = 0
  let moved = false
  const isH = dir === 'LEFT' || dir === 'RIGHT'
  const fwd = dir === 'LEFT' || dir === 'UP'

  for (let i = 0; i < 4; i++) {
    const line = w
      .filter((t) => (isH ? t.row : t.col) === i)
      .sort((a, b) => {
        const pa = isH ? a.col : a.row
        const pb = isH ? b.col : b.row
        return fwd ? pa - pb : pb - pa
      })

    let target = fwd ? 0 : 3
    const step = fwd ? 1 : -1
    let lastMergedTarget: number | null = null

    for (const tile of line) {
      const prevTarget = target - step
      const prevTile = w.find((t) => {
        const pos = isH ? t.col : t.row
        const lane = isH ? t.row : t.col
        return pos === prevTarget && lane === i && !t.isMerging && t.id !== tile.id
      })

      const origPos = isH ? tile.col : tile.row

      if (prevTile && lastMergedTarget !== prevTarget && prevTile.value === tile.value) {
        if (isH) tile.col = prevTarget
        else tile.row = prevTarget
        tile.isMerging = true
        prevTile.pendingValue = tile.value * 2
        score += tile.value * 2
        lastMergedTarget = prevTarget
        if (origPos !== prevTarget) moved = true
      } else {
        if (isH) tile.col = target
        else tile.row = target
        const newPos = isH ? tile.col : tile.row
        if (origPos !== newPos) moved = true
        target += step
      }
    }
  }

  return { tiles: w, score, moved }
}

function canMove(tiles: Tile[]): boolean {
  const active = tiles.filter((t) => !t.isMerging)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const t = active.find((x) => x.row === r && x.col === c)
      if (!t) return true
      const right = active.find((x) => x.row === r && x.col === c + 1)
      if (right && right.value === t.value) return true
      const down = active.find((x) => x.row === r + 1 && x.col === c)
      if (down && down.value === t.value) return true
    }
  }
  return false
}

const KEY_MAP: Record<string, Dir> = {
  ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
  ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
  ArrowUp: 'UP', w: 'UP', W: 'UP',
  ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
}

const TILE_COLORS: Record<number, { bg: string; color: string }> = {
  2: { bg: '#eee4da', color: '#776e65' },
  4: { bg: '#ede0c8', color: '#776e65' },
  8: { bg: '#f2b179', color: '#f9f6f2' },
  16: { bg: '#f59563', color: '#f9f6f2' },
  32: { bg: '#f67c5f', color: '#f9f6f2' },
  64: { bg: '#f65e3b', color: '#f9f6f2' },
  128: { bg: '#edcf72', color: '#f9f6f2' },
  256: { bg: '#edcc61', color: '#f9f6f2' },
  512: { bg: '#edc850', color: '#f9f6f2' },
  1024: { bg: '#edc53f', color: '#f9f6f2' },
  2048: { bg: '#edc22e', color: '#f9f6f2' },
}

export default function Game2048Page() {
  const [tiles, setTiles] = useState<Tile[]>(initTiles)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<Status>('playing')
  const [best, setBest] = useState(0)
  const [animating, setAnimating] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const [boardSize, setBoardSize] = useState(340)
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      if (boardRef.current) setBoardSize(boardRef.current.offsetWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    setBest(parseInt(localStorage.getItem('2048-best') ?? '0', 10))
  }, [])

  useEffect(() => {
    if (score > best) {
      setBest(score)
      localStorage.setItem('2048-best', String(score))
    }
  }, [score, best])

  useEffect(() => {
    if (animating) return
    const active = tiles.filter((t) => !t.isMerging)
    if (active.some((t) => t.value === 2048)) setStatus('won')
    else if (!canMove(active)) setStatus('lost')
  }, [tiles, animating])

  const move = useCallback(
    (dir: Dir) => {
      if (animating || status !== 'playing') return
      const { tiles: moved, score: gained, moved: didMove } = processMove(tiles, dir)
      if (!didMove) return

      setTiles(moved)
      setScore((s) => s + gained)
      setAnimating(true)

      setTimeout(() => {
        setTiles((current) => {
          const finalized = current
            .filter((t) => !t.isMerging)
            .map((t) =>
              t.pendingValue
                ? { ...t, value: t.pendingValue, pendingValue: null, isNew: true }
                : { ...t, isNew: false },
            )
          const newTile = spawn(finalized)
          return newTile ? [...finalized, newTile] : finalized
        })
        setAnimating(false)
      }, ANIM_MS)
    },
    [animating, status, tiles],
  )

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key]
      if (dir) { e.preventDefault(); move(dir) }
    },
    [move],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchRef.current.x
      const dy = t.clientY - touchRef.current.y
      touchRef.current = null
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
      const dir: Dir =
        Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'RIGHT' : 'LEFT') : dy > 0 ? 'DOWN' : 'UP'
      move(dir)
    },
    [move],
  )

  function restart() {
    setTiles(initTiles())
    setScore(0)
    setStatus('playing')
    setAnimating(false)
  }

  const tileSize = (boardSize - 2 * PADDING - 3 * GAP) / 4
  const step = tileSize + GAP

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/#games" className={styles.back}>← portfolio</Link>
        <div className={styles.scores}>
          <div className={styles.scoreBox}>
            <span className={styles.scoreLabel}>SCORE</span>
            <span className={styles.scoreVal}>{score}</span>
          </div>
          <div className={styles.scoreBox}>
            <span className={styles.scoreLabel}>BEST</span>
            <span className={styles.scoreVal}>{best}</span>
          </div>
        </div>
      </div>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>2048</h1>
        <button className={styles.newGame} onClick={restart}>New Game</button>
      </div>

      <div
        ref={boardRef}
        className={styles.board}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`bg${i}`}
            className={styles.cellBg}
            style={{
              width: tileSize,
              height: tileSize,
              transform: `translate(${PADDING + (i % 4) * step}px, ${PADDING + Math.floor(i / 4) * step}px)`,
            }}
          />
        ))}

        {tiles.map((tile) => {
          const colors = TILE_COLORS[tile.value] ?? { bg: '#3c3a32', color: '#f9f6f2' }
          const digits = String(tile.value).length
          const fontSize = digits >= 4 ? 18 : digits === 3 ? 22 : 28
          return (
            <div
              key={tile.id}
              className={styles.tile}
              style={{
                width: tileSize,
                height: tileSize,
                transform: `translate(${PADDING + tile.col * step}px, ${PADDING + tile.row * step}px)`,
                zIndex: tile.isMerging ? 1 : 2,
              }}
            >
              <div
                className={`${styles.tileInner} ${tile.isNew && !tile.isMerging ? styles.tileNew : ''}`}
                style={{ background: colors.bg, color: colors.color, fontSize }}
              >
                {tile.value}
              </div>
            </div>
          )
        })}

        {status !== 'playing' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>
              {status === 'won' ? '🎉 You Win!' : 'Game Over'}
            </div>
            <div className={styles.overlayScore}>Score: {score}</div>
            <button className={styles.startBtn} onClick={restart}>Play Again</button>
          </div>
        )}
      </div>

      <div className={styles.hint}>WASD / arrows · swipe on mobile</div>
    </div>
  )
}
