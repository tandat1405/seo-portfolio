'use client'
import { useRef } from 'react'
import { skillsMobile, skillsWeb, skillsBackend, techTools, type Skill } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Skills.module.css'

function levelLabel(pct: number) {
  if (pct >= 90) return 'Expert'
  if (pct >= 80) return 'Advanced'
  return 'Proficient'
}

function SkillPills({ skills }: { skills: Skill[] }) {
  return (
    <div className={styles.cloud}>
      {skills.map((s) => (
        <div key={s.name} className={`${styles.skillPill} fu`}>
          <span className={styles.skillPillName}>{s.name}</span>
          <span className={styles.skillPillLevel}>{levelLabel(s.pct)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  return (
    <section id="skills" className={styles.section} ref={ref}>
      <div className="secNum">02</div>
      <div className="label">Skills</div>
      <h2>My expertise</h2>
      <div className={styles.split}>
        <div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Mobile Development</div>
            <SkillPills skills={skillsMobile} />
          </div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Frontend Web</div>
            <SkillPills skills={skillsWeb} />
          </div>
          <div className={styles.group}>
            <div className={styles.groupTitle}>Backend</div>
            <SkillPills skills={skillsBackend} />
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
