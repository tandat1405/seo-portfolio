'use client'
import { useRef } from 'react'
import { experience } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Experience.module.css'

export default function Experience() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  return (
    <section id="experience" className={styles.section} ref={ref}>
      <div className="secNum">03</div>
      <div className="label">Experience</div>
      <h2>Where I&apos;ve worked</h2>
      <div className={styles.list}>
        {experience.map((e) => (
          <div key={e.company} className={`${styles.row} fu`}>
            <div>
              <div className={styles.date}>{e.date}</div>
              <div className={styles.company}>{e.company}</div>
            </div>
            <div>
              <div className={styles.role}>{e.role}</div>
              <div className={styles.desc}>{e.desc}</div>
              <div className={styles.tags}>
                {e.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
