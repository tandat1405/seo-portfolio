'use client'
import { useEffect, RefObject } from 'react'

export function useSkillBars(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll<HTMLElement>('[data-w]').forEach((bar) => {
              setTimeout(() => { bar.style.width = `${bar.dataset.w}%` }, 200)
            })
          }
        })
      },
      { threshold: 0.2 }
    )
    io.observe(container)
    return () => io.disconnect()
  }, [ref])
}
