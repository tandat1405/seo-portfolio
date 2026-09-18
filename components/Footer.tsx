import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} Dat Nguyen</span>
      <span>Built with Next.js &amp; CSS Modules</span>
    </footer>
  )
}
