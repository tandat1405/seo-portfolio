'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './memory.module.css'

const EMOJIS = ['⚡', '🚀', '💎', '🌊', '🔥', '🎯', '🧠', '🎨']

type Card = {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCards(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
}

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>(createCards)
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [locked, setLocked] = useState(false)
  const [best, setBest] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('memory-best')
    if (stored) setBest(parseInt(stored, 10))
  }, [])

  const handleFlip = useCallback(
    (id: number) => {
      if (locked) return
      const card = cards.find((c) => c.id === id)
      if (!card || card.flipped || card.matched) return

      const newSelected = [...selected, id]
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)))
      setSelected(newSelected)

      if (newSelected.length < 2) return

      const [aId, bId] = newSelected
      const a = cards.find((c) => c.id === aId)!
      const b = cards.find((c) => c.id === bId)!
      const newMoves = moves + 1
      setMoves(newMoves)

      if (a.emoji === b.emoji) {
        const updated = cards.map((c) =>
          newSelected.includes(c.id) ? { ...c, flipped: true, matched: true } : c,
        )
        setCards(updated)
        setSelected([])

        if (updated.every((c) => c.matched)) {
          setWon(true)
          const stored = localStorage.getItem('memory-best')
          const currentBest = stored ? parseInt(stored, 10) : null
          if (currentBest === null || newMoves < currentBest) {
            setBest(newMoves)
            localStorage.setItem('memory-best', String(newMoves))
          }
        }
      } else {
        setLocked(true)
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (newSelected.includes(c.id) ? { ...c, flipped: false } : c)),
          )
          setSelected([])
          setLocked(false)
        }, 900)
      }
    },
    [cards, selected, locked, moves],
  )

  function restart() {
    setCards(createCards())
    setSelected([])
    setMoves(0)
    setWon(false)
    setLocked(false)
  }

  const matchedCount = cards.filter((c) => c.matched).length / 2

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/#games" className={styles.backLink}>← portfolio</Link>
        <div className={styles.scores}>
          <span>
            Pairs <strong>{matchedCount} / {EMOJIS.length}</strong>
          </span>
          <span>Moves <strong>{moves}</strong></span>
          {best !== null && <span>Best <strong>{best}</strong></span>}
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <button
            key={card.id}
            className={`${styles.card} ${card.flipped || card.matched ? styles.flipped : ''} ${card.matched ? styles.matched : ''}`}
            onClick={() => handleFlip(card.id)}
            aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
          >
            <div className={styles.inner}>
              <div className={styles.front}>?</div>
              <div className={styles.back}>{card.emoji}</div>
            </div>
          </button>
        ))}
      </div>

      {won && (
        <div className={styles.wonBanner}>
          <span>🎉 All pairs found in <strong>{moves} moves</strong>!</span>
          <button onClick={restart} className={styles.playAgain}>Play Again</button>
        </div>
      )}
    </div>
  )
}
