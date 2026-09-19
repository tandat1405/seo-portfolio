'use client'
import { useRef } from 'react'
import Image from 'next/image'
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
          <div key={p.name} className={`${styles.card} fu`}>
            <div className={styles.head}>
              <div className={styles.icon}>
                {p.image ? (
                  <Image src={p.image} alt={p.name} width={44} height={44} className={styles.iconImg} />
                ) : (
                  <span className={styles.emoji}>{p.emoji}</span>
                )}
              </div>
              <div className={styles.storeLinks}>
                {p.url && (
                  <a href={p.url.href} target="_blank" rel="noopener noreferrer" className={styles.storeLink}>
                    {p.url.label} ↗
                  </a>
                )}
                {p.iosUrl && (
                  <a href={p.iosUrl} target="_blank" rel="noopener noreferrer" className={styles.storeLink}>
                    iOS ↗
                  </a>
                )}
                {p.androidUrl && (
                  <a href={p.androidUrl} target="_blank" rel="noopener noreferrer" className={styles.storeLink}>
                    Android ↗
                  </a>
                )}
              </div>
            </div>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.about}>{p.desc}</div>
            <div className={styles.tags}>
              {p.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
