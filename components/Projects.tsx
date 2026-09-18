'use client'
import { useRef } from 'react'
import { projects } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Projects.module.css'

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  return (
    <section id="projects" className={styles.section} ref={ref}>
      <div className="secNum">04</div>
      <div className="label">Projects</div>
      <h2>Things I&apos;ve built</h2>
      <div className={styles.grid}>
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.url ?? '#'}
            className={`${styles.card} fu`}
            target={p.url ? '_blank' : undefined}
            rel={p.url ? 'noopener noreferrer' : undefined}
          >
            <div className={styles.head}>
              <div className={styles.emoji}>{p.emoji}</div>
              <div className={styles.arrow}>↗</div>
            </div>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.about}>{p.desc}</div>
            <div className={styles.tags}>
              {p.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
