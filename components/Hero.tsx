import { personal, metrics } from '@/data/portfolio'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.section}>
      <div className={styles.inner}>
        <div>
          <div className={styles.tag}>
            <span className={styles.dot} />
            Available for work
          </div>
          <div className={styles.greeting}>{personal.greeting}</div>
          <h1
            className={styles.h1}
            dangerouslySetInnerHTML={{ __html: personal.tagline }}
          />
          <p className={styles.sub}>{personal.sub}</p>
          <p className={styles.desc}>{personal.desc}</p>
          <div className={styles.btnRow}>
            <a href="#projects" className={styles.btnDark}>See Projects →</a>
            <a href="#contact" className={styles.btnOutline}>Get In Touch</a>
          </div>
        </div>
        <div>
          <div className={`${styles.panel} glass`}>
            {metrics.map((m) => (
              <div key={m.label} className={styles.metric}>
                <div className={styles.metricLeft}>
                  <div className={styles.metricIcon} style={{ background: m.bg }}>{m.icon}</div>
                  <div className={styles.metricKey}>{m.label}</div>
                </div>
                <div className={styles.metricVal}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
