'use client'
import { useRef } from 'react'
import { skillsMobile, skillsWeb, techTools } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useSkillBars } from '@/hooks/useSkillBars'
import styles from './Skills.module.css'

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)
  useSkillBars(ref)

  return (
    <section id="skills" className={styles.section} ref={ref}>
      <div className="secNum">02</div>
      <div className="label">Skills</div>
      <h2>What I know</h2>
      <div className={styles.split}>
        <div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Mobile Development</div>
            {skillsMobile.map((s) => (
              <div key={s.name} className={`${styles.skItem} fu`}>
                <div className={styles.skName}>{s.name}</div>
                <div className={styles.skBar}>
                  <div className={styles.skFill} data-w={s.pct} />
                </div>
                <div className={styles.skPct}>{s.pct}%</div>
              </div>
            ))}
          </div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Frontend Web</div>
            {skillsWeb.map((s) => (
              <div key={s.name} className={`${styles.skItem} fu`}>
                <div className={styles.skName}>{s.name}</div>
                <div className={styles.skBar}>
                  <div className={styles.skFill} data-w={s.pct} />
                </div>
                <div className={styles.skPct}>{s.pct}%</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Technologies &amp; Tools</div>
            <div className={styles.cloud}>
              {techTools.map((t) => (
                <span key={t} className={styles.chip}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
