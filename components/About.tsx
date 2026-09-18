'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { personal, whatIBring } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './About.module.css'

export default function About() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  return (
    <section id="about" className={styles.section} ref={ref}>
      <div className="secNum">01</div>
      <div className="label">About</div>
      <h2>Who I am</h2>
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={`${styles.card} fu`}>
            <div className={styles.cardHead}>
              <div className={styles.cardIcon}>👋</div>
              <div className={styles.cardTitle}>Background</div>
            </div>
            <p className={styles.cardP}>
              I&apos;m a Mobile and Frontend Developer with 5+ years of experience, specializing in React Native and Next.js. I care deeply about building experiences that are fast, accessible, and visually polished.
            </p>
            <br />
            <p className={styles.cardP}>
              I work with startups and companies to ship mobile and web products from design to production — bridging the gap between great design and great engineering.
            </p>
          </div>
          <div className={`${styles.photoStrip} fu`}>
            <Image
              src="/photo.jpg"
              alt={personal.name}
              width={600}
              height={400}
              className={styles.photo}
            />
            <div className={styles.overlay} />
            <div className={styles.photoLabel}>
              <div>
                <div className={styles.aplContext}>Developer · Speaker</div>
                <div className={styles.aplName}>{personal.name}</div>
                <div className={styles.aplRole}>{personal.location}</div>
              </div>
              <div className={styles.aplRight}>
                <div className={styles.aplTag}>Open to work →</div>
                <div className={styles.aplDot}>Available remotely</div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.card} fu`}>
          <div className={styles.cardHead}>
            <div className={styles.cardIcon}>✅</div>
            <div className={styles.cardTitle}>What I bring</div>
          </div>
          <div className={styles.listItems}>
            {whatIBring.map((item) => (
              <div key={item} className={styles.li}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
