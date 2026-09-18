'use client'
import { useRef } from 'react'
import { certifications } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Certifications.module.css'

export default function Certifications() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  return (
    <section id="certifications" className={styles.section} ref={ref}>
      <div className="secNum">05</div>
      <div className="label">Certifications</div>
      <h2>Credentials</h2>
      <div className={styles.list}>
        {certifications.map((c) => (
          <div key={c.name} className={`${styles.row} fu`}>
            <div className={styles.badge}>{c.icon}</div>
            <div className={styles.info}>
              <div className={styles.name}>{c.name}</div>
              <div className={styles.issuer}>{c.issuer}</div>
            </div>
            <div className={styles.year}>{c.year}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
