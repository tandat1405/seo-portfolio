# Portfolio Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the demo-2-editorial.html portfolio design into a production-ready Next.js app with full SEO.

**Architecture:** Single-page Next.js 14 App Router site using one `page.tsx` that renders all sections in order. All content lives in a `data/portfolio.ts` constants file so copy can be updated without touching components. CSS Modules per component for scoped styles, global CSS for design tokens and base styles.

**Tech Stack:** Next.js 14 (App Router), TypeScript, CSS Modules, next/image, next/font (Inter + Playfair Display)

**Spec:** `demos/demo-2-editorial.html`

## Global Constraints

- Next.js 14+ with App Router (`app/` directory)
- TypeScript strict mode
- No UI library — plain CSS Modules only, matching the demo exactly
- No unit tests
- CSS custom properties match demo: `--accent: #2563eb`, `--bg: #f0f5ff`, `--text: #0f172a`, `--r: 18px`
- Photo file: `public/photo.jpg` (copy from `demos/photo.jpg`)
- Contact form opens `mailto:` link — no backend
- Scroll animations via `IntersectionObserver` in a single `hooks/useScrollReveal.ts`
- Skill bar animations via `IntersectionObserver` in `hooks/useSkillBars.ts`
- Active nav highlight via `IntersectionObserver` in `hooks/useActiveSection.ts`
- All section IDs: `hero`, `about`, `skills`, `experience`, `projects`, `certifications`, `contact`

---

## File Structure

```
app/
  layout.tsx          — html/body, metadata (SEO), fonts, global CSS import
  page.tsx            — renders all section components in order
  globals.css         — design tokens, body dot-grid bg, base resets, .fu animation, responsive breakpoints

components/
  Nav.tsx             — fixed nav, logo, desktop links, Hire Me CTA, hamburger + mobile drawer
  Nav.module.css
  Hero.tsx            — hero section: headline, sub, desc, CTA buttons, metrics panel
  Hero.module.css
  About.tsx           — about section: left col (background card + photo strip), right col (what I bring)
  About.module.css
  Skills.tsx          — skills section: bar charts left, tech cloud right
  Skills.module.css
  Experience.tsx      — experience section: editorial two-col rows
  Experience.module.css
  Projects.tsx        — projects section: 2-col card grid
  Projects.module.css
  Certifications.tsx  — certifications section: list rows
  Certifications.module.css
  Contact.tsx         — contact section: socials left, mailto form right
  Contact.module.css
  Footer.tsx          — simple footer bar
  Footer.module.css

hooks/
  useScrollReveal.ts  — attaches IntersectionObserver to add 'vis' class on scroll
  useSkillBars.ts     — animates skill bar widths when skills section enters viewport
  useActiveSection.ts — tracks which section is visible, returns active section id

data/
  portfolio.ts        — all content: personal info, metrics, skills, experience, projects, certs
```

---

### Task 1: Scaffold Next.js project and install dependencies

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx` (shell only)

- [ ] **Step 1: Scaffold the project**

Run inside `/Users/dat.tannguyen/personal/porfolio-ver3/`:
```bash
npx create-next-app@latest . --typescript --app --no-src-dir --no-tailwind --import-alias "@/*" --eslint
```
Answer prompts: Yes to TypeScript, Yes to ESLint, Yes to App Router, No to Tailwind, No to src/ directory.

- [ ] **Step 2: Copy photo**
```bash
cp demos/photo.jpg public/photo.jpg
```

- [ ] **Step 3: Replace `app/globals.css` with design tokens and base styles**

```css
/* app/globals.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: #2563eb;
  --accent-light: #93c5fd;
  --text: #0f172a;
  --text-2: #475569;
  --text-3: #94a3b8;
  --bg: #f0f5ff;
  --bg-2: #e8effc;
  --border: rgba(226,232,240,0.8);
  --glass: rgba(255,255,255,0.72);
  --r: 18px;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  background-image: radial-gradient(circle, rgba(37,99,235,0.22) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

body > * { position: relative; z-index: 1; }

.glass {
  background: var(--glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.fu {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity .6s ease, transform .6s ease;
}
.fu.vis { opacity: 1; transform: translateY(0); }
.fu:nth-child(2) { transition-delay: .1s; }
.fu:nth-child(3) { transition-delay: .2s; }
.fu:nth-child(4) { transition-delay: .3s; }

section {
  padding: 100px 60px 80px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.secNum {
  font-size: 100px;
  font-weight: 900;
  color: #f1f5f9;
  line-height: 0.8;
  margin-bottom: -16px;
  user-select: none;
}

.label {
  font-size: 12px; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--accent); margin-bottom: 10px;
}

h2 {
  font-size: clamp(26px,4vw,42px);
  font-weight: 800; letter-spacing: -1px;
  margin-bottom: 48px; line-height: 1.15;
}

@media (max-width: 960px) {
  section { padding: 88px 24px 60px; }
  .secNum { font-size: 72px; }
}

@media (max-width: 600px) {
  section { padding: 80px 16px 52px; }
}
```

- [ ] **Step 4: Write shell `app/page.tsx`**

```tsx
// app/page.tsx
export default function Home() {
  return <main>Portfolio coming soon</main>
}
```

- [ ] **Step 5: Write `app/layout.tsx` with SEO metadata and fonts**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dat Nguyen — Mobile & Frontend Developer',
  description: 'Mobile and Frontend Developer specializing in React Native, Expo, React.js and Next.js. Based in Ho Chi Minh City, Vietnam. Available for remote work worldwide.',
  keywords: ['React Native', 'Expo', 'Next.js', 'React', 'TypeScript', 'Mobile Developer', 'Frontend Developer', 'Vietnam'],
  authors: [{ name: 'Dat Nguyen' }],
  creator: 'Dat Nguyen',
  openGraph: {
    type: 'website',
    title: 'Dat Nguyen — Mobile & Frontend Developer',
    description: 'Building pixel-perfect mobile apps with React Native and fast web experiences with Next.js.',
    siteName: 'Dat Nguyen Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dat Nguyen — Mobile & Frontend Developer',
    description: 'Building pixel-perfect mobile apps with React Native and fast web experiences with Next.js.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Update globals.css to use font variables**

Add to `:root` in globals.css:
```css
  font-family: var(--font-inter), sans-serif;
```

And add `.secNum` font-family:
```css
.secNum { font-family: var(--font-playfair), serif; }
```

- [ ] **Step 7: Verify dev server starts**
```bash
npm run dev
```
Open `http://localhost:3000` — should show "Portfolio coming soon" with no errors.

- [ ] **Step 8: Commit**
```bash
git add -A && git commit -m "feat: scaffold Next.js portfolio with fonts, SEO metadata, global CSS"
```

---

### Task 2: Content data file

**Files:**
- Create: `data/portfolio.ts`

**Produces:** Exported constants used by every section component.

- [ ] **Step 1: Create `data/portfolio.ts`**

```ts
// data/portfolio.ts

export const personal = {
  name: 'Dat Nguyen',
  title: 'Mobile & Frontend Developer',
  tagline: 'Mobile & <em>Frontend</em> Developer.',
  sub: 'React Native · Expo · React.js · Next.js',
  desc: 'I build fast, beautiful mobile apps and web experiences. Detail-oriented developer based in Vietnam, available for remote work worldwide.',
  location: 'Ho Chi Minh City, Vietnam',
  email: 'dat@datnguyen.dev',
  linkedin: 'https://linkedin.com/in/datnguyen',
  github: 'https://github.com/datnguyen',
  availableForWork: true,
}

export const metrics = [
  { icon: '📱', bg: '#eff6ff', label: 'Mobile Apps Shipped', value: '12+' },
  { icon: '🌐', bg: '#f0fdf4', label: 'Web Projects', value: '20+' },
  { icon: '⭐', bg: '#fefce8', label: 'Client Satisfaction', value: '100%' },
  { icon: '🏆', bg: '#fdf4ff', label: 'Years of Experience', value: '5+' },
]

export const whatIBring = [
  'Cross-platform React Native development',
  'Next.js apps with great Core Web Vitals',
  'TypeScript-first, maintainable codebases',
  'Pixel-perfect UI from Figma designs',
  'App Store & Google Play deployments',
  'Strong communication & remote experience',
]

export type Skill = { name: string; pct: number }

export const skillsMobile: Skill[] = [
  { name: 'React Native', pct: 95 },
  { name: 'Expo', pct: 92 },
  { name: 'iOS / Android', pct: 80 },
]

export const skillsWeb: Skill[] = [
  { name: 'React.js', pct: 95 },
  { name: 'Next.js', pct: 90 },
  { name: 'TypeScript', pct: 88 },
]

export const techTools = [
  'Tailwind CSS', 'Figma', 'Node.js', 'REST APIs', 'GraphQL',
  'Git', 'GitHub Actions', 'Expo EAS', 'Firebase', 'Supabase',
  'Vercel', 'Redux', 'Zustand', 'React Query',
]

export type Experience = {
  date: string
  company: string
  role: string
  desc: string
  tags: string[]
}

export const experience: Experience[] = [
  {
    date: '2022 — Present',
    company: 'TechCorp Vietnam',
    role: 'Senior Frontend Developer',
    desc: 'Led the development of a cross-platform React Native app serving 100k+ users. Built complex screens, integrated native APIs, and shipped releases via Expo EAS. Owned the Next.js marketing site achieving a 98 Lighthouse performance score.',
    tags: ['React Native', 'Next.js', 'TypeScript', 'Expo EAS'],
  },
  {
    date: '2020 — 2022',
    company: 'StartupXYZ',
    role: 'Mobile Developer',
    desc: 'Developed and maintained React Native apps for iOS and Android. Implemented complex UI animations, push notifications, and deep linking. Reduced app crash rate by 40% through stability improvements and error tracking.',
    tags: ['React Native', 'Expo', 'Firebase'],
  },
  {
    date: '2019 — 2020',
    company: 'Digital Agency',
    role: 'Frontend Developer',
    desc: 'Built responsive React web applications for clients across e-commerce and fintech. Delivered pixel-perfect implementations from Figma designs and integrated REST APIs.',
    tags: ['React.js', 'CSS', 'REST APIs'],
  },
]

export type Project = {
  emoji: string
  name: string
  desc: string
  tags: string[]
  url?: string
}

export const projects: Project[] = [
  {
    emoji: '📱',
    name: 'FitTrack Mobile',
    desc: 'A fitness tracking app built with React Native & Expo. Features workout logging, progress charts, and social features with 10k+ downloads on both stores.',
    tags: ['React Native', 'Expo', 'TypeScript'],
  },
  {
    emoji: '🛒',
    name: 'ShopNext',
    desc: 'Full-featured e-commerce platform built with Next.js App Router. Optimized for SEO and Core Web Vitals with SSR and edge caching.',
    tags: ['Next.js', 'Tailwind', 'Stripe'],
  },
  {
    emoji: '🎨',
    name: 'Design System',
    desc: 'A shared component library used across mobile and web. Consistent design tokens, dark mode, accessibility built-in, and Storybook docs.',
    tags: ['React', 'Storybook', 'Rollup'],
  },
  {
    emoji: '💬',
    name: 'ChatFlow',
    desc: 'Real-time messaging app in React Native. E2E encrypted messages, group chats, voice notes, and media sharing with a Firebase backend.',
    tags: ['React Native', 'Firebase', 'Socket.io'],
  },
]

export type Certification = {
  icon: string
  name: string
  issuer: string
  year: string
}

export const certifications: Certification[] = [
  { icon: '📜', name: 'Meta React Native Specialist', issuer: 'Meta · via Coursera', year: '2023' },
  { icon: '⚡', name: 'Next.js & React — The Complete Guide', issuer: 'Udemy', year: '2022' },
  { icon: '☁️', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
]
```

- [ ] **Step 2: Commit**
```bash
git add data/portfolio.ts && git commit -m "feat: add portfolio content data file"
```

---

### Task 3: Scroll reveal and skill bar hooks

**Files:**
- Create: `hooks/useScrollReveal.ts`
- Create: `hooks/useSkillBars.ts`
- Create: `hooks/useActiveSection.ts`

**Produces:**
- `useScrollReveal(ref)` — attaches observer to all `.fu` descendants of ref, adds `.vis` on entry
- `useSkillBars(ref)` — observes ref, sets `style.width` on all `[data-w]` descendants
- `useActiveSection(ids)` — returns `activeId: string` of the currently visible section

- [ ] **Step 1: Create `hooks/useScrollReveal.ts`**

```ts
// hooks/useScrollReveal.ts
'use client'
import { useEffect, RefObject } from 'react'

export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const els = container.querySelectorAll<HTMLElement>('.fu')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('vis') }),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref])
}
```

- [ ] **Step 2: Create `hooks/useSkillBars.ts`**

```ts
// hooks/useSkillBars.ts
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
```

- [ ] **Step 3: Create `hooks/useActiveSection.ts`**

```ts
// hooks/useActiveSection.ts
'use client'
import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id) })
      },
      { threshold: 0.35 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])

  return activeId
}
```

- [ ] **Step 4: Commit**
```bash
git add hooks/ && git commit -m "feat: add scroll reveal, skill bar, and active section hooks"
```

---

### Task 4: Nav component

**Files:**
- Create: `components/Nav.tsx`
- Create: `components/Nav.module.css`

**Consumes:** `personal.name` from `data/portfolio.ts`, `useActiveSection` from `hooks/useActiveSection.ts`

- [ ] **Step 1: Create `components/Nav.module.css`**

```css
/* components/Nav.module.css */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  height: 68px;
  background: rgba(240,245,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.logo {
  font-size: 18px; font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--text);
  text-decoration: none;
}
.logo span { color: var(--accent); }

.links { display: flex; gap: 2px; }

.link {
  color: var(--text-2);
  text-decoration: none;
  font-size: 13.5px; font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all .18s;
}
.link:hover, .active {
  color: var(--text);
  background: var(--bg-2);
}

.cta {
  background: var(--text);
  color: white;
  text-decoration: none;
  padding: 9px 20px;
  font-size: 13px; font-weight: 600;
  border-radius: 50px;
  transition: all .2s;
}
.cta:hover { background: var(--accent); transform: translateY(-1px); }

.menuBtn {
  display: none;
  background: none; border: none; cursor: pointer;
  font-size: 22px; color: var(--text-2);
  padding: 6px; border-radius: 8px;
  transition: background .2s;
  line-height: 1;
}
.menuBtn:hover { background: var(--bg-2); color: var(--accent); }

.drawer {
  display: none;
  position: fixed;
  top: 68px; left: 0; right: 0;
  z-index: 199;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 12px 20px 20px;
  flex-direction: column; gap: 4px;
}
.drawerOpen { display: flex; }
.drawerLink {
  color: var(--text-2);
  text-decoration: none;
  font-size: 15px; font-weight: 500;
  padding: 13px 16px;
  border-radius: 10px;
  transition: all .18s;
}
.drawerLink:hover, .drawerLinkActive {
  color: var(--accent);
  background: #eff6ff;
}

@media (max-width: 960px) {
  .nav { padding: 0 24px; }
  .links { display: none; }
  .cta { display: none; }
  .menuBtn { display: block; }
}
@media (max-width: 600px) {
  .nav { padding: 0 16px; }
}
```

- [ ] **Step 2: Create `components/Nav.tsx`**

```tsx
// components/Nav.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useActiveSection } from '@/hooks/useActiveSection'
import styles from './Nav.module.css'

const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certs', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact']

export default function Nav() {
  const [open, setOpen] = useState(false)
  const activeId = useActiveSection(SECTION_IDS)

  return (
    <>
      <nav className={styles.nav}>
        <a href="#hero" className={styles.logo}>Dat<span>.</span>dev</a>
        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.link} ${activeId === item.href.slice(1) ? styles.active : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a href="#contact" className={styles.cta}>Hire Me →</a>
        <button
          className={styles.menuBtn}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.drawerLink} ${activeId === item.href.slice(1) ? styles.drawerLinkActive : ''}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Add Nav to `app/page.tsx`**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'

export default function Home() {
  return (
    <>
      <Nav />
      <main>Portfolio coming soon</main>
    </>
  )
}
```

- [ ] **Step 4: Verify nav renders correctly at `http://localhost:3000`** — desktop shows all links, resize to mobile to confirm hamburger appears.

- [ ] **Step 5: Commit**
```bash
git add components/Nav.tsx components/Nav.module.css app/page.tsx && git commit -m "feat: add Nav component with mobile drawer and active section tracking"
```

---

### Task 5: Hero section

**Files:**
- Create: `components/Hero.tsx`
- Create: `components/Hero.module.css`

**Consumes:** `personal`, `metrics` from `data/portfolio.ts`

- [ ] **Step 1: Create `components/Hero.module.css`**

```css
/* components/Hero.module.css */
.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 68px;
  border-bottom: 1px solid var(--border);
}

.inner {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
  align-items: center;
}

.tag {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 15px; border-radius: 8px;
  font-size: 12.5px; font-weight: 600;
  background: #eff6ff; color: var(--accent);
  border: 1px solid #bfdbfe;
  margin-bottom: 20px;
}

.dot {
  width: 7px; height: 7px;
  background: #22c55e; border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
  50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
}

.h1 {
  font-size: clamp(38px,6.5vw,80px);
  font-weight: 900; letter-spacing: -3px;
  line-height: 1.02; margin-bottom: 22px;
}
.h1 em {
  font-style: normal;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2px var(--accent);
}

.sub { font-size: 16px; color: var(--text-2); margin-bottom: 14px; font-weight: 400; }

.desc {
  font-size: 15px; color: var(--text-3); line-height: 1.8;
  max-width: 500px; margin-bottom: 36px;
}

.btnRow { display: flex; gap: 12px; flex-wrap: wrap; }

.btnDark {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 13px 26px; border-radius: 8px;
  font-size: 14px; font-weight: 600;
  text-decoration: none;
  background: var(--text); color: white;
  transition: all .2s;
}
.btnDark:hover { background: var(--accent); transform: translateY(-2px); }

.btnOutline {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 13px 26px; border-radius: 8px;
  font-size: 14px; font-weight: 600;
  text-decoration: none;
  background: transparent; color: var(--text);
  border: 1.5px solid var(--border);
  transition: all .2s;
}
.btnOutline:hover { border-color: var(--text); transform: translateY(-2px); }

.panel {
  padding: 28px; border-radius: 20px;
  display: flex; flex-direction: column; gap: 14px;
  max-width: 360px;
}

.metric {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-radius: 12px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  transition: border-color .2s;
}
.metric:hover { border-color: var(--accent-light); }
.metricLeft { display: flex; align-items: center; gap: 12px; }
.metricIcon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.metricKey { font-size: 13px; color: var(--text-2); font-weight: 500; }
.metricVal { font-size: 18px; font-weight: 800; color: var(--text); }

@media (max-width: 960px) {
  .section { padding-top: 68px; min-height: auto; padding-bottom: 60px; }
  .inner { grid-template-columns: 1fr; gap: 36px; }
  .h1 { font-size: clamp(38px, 9vw, 68px); letter-spacing: -2.5px; }
  .panel { max-width: 100%; }
}
@media (max-width: 600px) {
  .h1 { font-size: clamp(32px, 11vw, 56px); letter-spacing: -2px; }
  .panel { padding: 20px; }
  .metric { padding: 12px 14px; }
}
```

- [ ] **Step 2: Create `components/Hero.tsx`**

```tsx
// components/Hero.tsx
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
```

- [ ] **Step 3: Add Hero to `app/page.tsx`**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Verify hero renders correctly.**

- [ ] **Step 5: Commit**
```bash
git add components/Hero.tsx components/Hero.module.css app/page.tsx && git commit -m "feat: add Hero section"
```

---

### Task 6: About section

**Files:**
- Create: `components/About.tsx`
- Create: `components/About.module.css`

**Consumes:** `personal`, `whatIBring` from `data/portfolio.ts`, `useScrollReveal` from `hooks/useScrollReveal.ts`

- [ ] **Step 1: Create `components/About.module.css`**

```css
/* components/About.module.css */
.section { border-bottom: 1px solid var(--border); }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}

.leftCol { display: flex; flex-direction: column; gap: 24px; }

.card {
  padding: 28px; border-radius: var(--r);
  border: 1px solid var(--border);
  background: #ffffff;
  transition: border-color .2s, transform .25s;
  height: 100%;
}
.card:hover { border-color: var(--accent-light); transform: translateY(-3px); }

.cardHead { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.cardIcon {
  width: 38px; height: 38px; border-radius: 10px;
  background: #eff6ff;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.cardTitle { font-size: 15px; font-weight: 700; }
.cardP { font-size: 14px; color: var(--text-2); line-height: 1.75; }

.listItems { display: flex; flex-direction: column; gap: 10px; }
.li {
  display: flex; align-items: center; gap: 10px;
  font-size: 14px; color: var(--text-2);
}
.li::before { content: '→'; color: var(--accent); font-weight: 700; font-size: 13px; }

.photoStrip { border-radius: 18px; overflow: hidden; position: relative; }
.photo { width: 100%; aspect-ratio: 3/2; height: auto; object-fit: cover; object-position: center 30%; display: block; transition: transform .7s ease; }
.photoStrip:hover .photo { transform: scale(1.04); }
.overlay {
  position: absolute; inset: 0;
  background:
    linear-gradient(to top, rgba(10,15,40,0.82) 0%, rgba(10,15,40,0.25) 45%, transparent 70%),
    linear-gradient(to right, rgba(10,15,40,0.35) 0%, transparent 40%);
}
.photoLabel {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 28px 28px 24px;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
}
.aplContext { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent-light); margin-bottom: 6px; }
.aplName { font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.5px; line-height: 1; }
.aplRole { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 5px; font-weight: 400; }
.aplRight { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
.aplTag {
  padding: 7px 16px; border-radius: 50px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.22);
  font-size: 12px; font-weight: 600; color: white; white-space: nowrap;
  transition: background .2s;
}
.photoStrip:hover .aplTag { background: rgba(255,255,255,0.2); }
.aplDot { display: flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; }
.aplDot::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Create `components/About.tsx`**

```tsx
// components/About.tsx
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
```

- [ ] **Step 3: Add About to `app/page.tsx`**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Verify About renders with photo and scroll animations.**

- [ ] **Step 5: Commit**
```bash
git add components/About.tsx components/About.module.css app/page.tsx && git commit -m "feat: add About section"
```

---

### Task 7: Skills section

**Files:**
- Create: `components/Skills.tsx`
- Create: `components/Skills.module.css`

**Consumes:** `skillsMobile`, `skillsWeb`, `techTools`, `Skill` from `data/portfolio.ts`, `useScrollReveal`, `useSkillBars`

- [ ] **Step 1: Create `components/Skills.module.css`**

```css
/* components/Skills.module.css */
.section { border-bottom: 1px solid var(--border); }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.group { margin-bottom: 32px; }
.groupTitle {
  font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 18px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.skItem { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.skName { font-size: 14px; font-weight: 500; width: 120px; flex-shrink: 0; }
.skBar { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.skFill {
  height: 100%; border-radius: 3px;
  background: var(--accent);
  width: 0;
  transition: width 1.2s cubic-bezier(.4,0,.2,1);
}
.skPct { font-size: 12px; color: var(--text-3); width: 36px; text-align: right; }
.cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  padding: 8px 16px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  background: var(--bg-2); color: var(--text-2);
  border: 1px solid var(--border);
  transition: all .2s;
}
.chip:hover { background: #eff6ff; color: var(--accent); border-color: #bfdbfe; }

@media (max-width: 960px) { .split { grid-template-columns: 1fr; gap: 0; } }
```

- [ ] **Step 2: Create `components/Skills.tsx`**

```tsx
// components/Skills.tsx
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
```

- [ ] **Step 3: Add Skills to `app/page.tsx`** — import and render `<Skills />` after `<About />`.

- [ ] **Step 4: Verify skill bars animate on scroll.**

- [ ] **Step 5: Commit**
```bash
git add components/Skills.tsx components/Skills.module.css app/page.tsx && git commit -m "feat: add Skills section"
```

---

### Task 8: Experience section

**Files:**
- Create: `components/Experience.tsx`
- Create: `components/Experience.module.css`

**Consumes:** `experience` from `data/portfolio.ts`, `useScrollReveal`

- [ ] **Step 1: Create `components/Experience.module.css`**

```css
/* components/Experience.module.css */
.section { border-bottom: 1px solid var(--border); }
.list { display: flex; flex-direction: column; }
.row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
}
.row:last-child { border-bottom: none; }
.row:hover .company { color: var(--accent); }
.date { font-size: 12px; color: var(--text-3); font-weight: 500; padding-top: 3px; }
.company { font-size: 13px; font-weight: 700; color: var(--text-2); margin-bottom: 4px; transition: color .2s; }
.role { font-size: 17px; font-weight: 700; margin-bottom: 10px; }
.desc { font-size: 14px; color: var(--text-2); line-height: 1.75; margin-bottom: 12px; }
.tags { display: flex; flex-wrap: wrap; gap: 7px; }
.tag { padding: 3px 10px; border-radius: 4px; font-size: 11.5px; font-weight: 500; background: #f1f5f9; color: var(--text-2); }

@media (max-width: 960px) {
  .row { grid-template-columns: 1fr; gap: 4px; }
  .date { font-size: 11px; }
}
```

- [ ] **Step 2: Create `components/Experience.tsx`**

```tsx
// components/Experience.tsx
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
```

- [ ] **Step 3: Add Experience to `app/page.tsx`** — import and render `<Experience />` after `<Skills />`.

- [ ] **Step 4: Commit**
```bash
git add components/Experience.tsx components/Experience.module.css app/page.tsx && git commit -m "feat: add Experience section"
```

---

### Task 9: Projects section

**Files:**
- Create: `components/Projects.tsx`
- Create: `components/Projects.module.css`

**Consumes:** `projects` from `data/portfolio.ts`, `useScrollReveal`

- [ ] **Step 1: Create `components/Projects.module.css`**

```css
/* components/Projects.module.css */
.section { border-bottom: 1px solid var(--border); }
.grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
.card {
  padding: 24px; border-radius: var(--r);
  border: 1px solid var(--border);
  background: #ffffff;
  cursor: pointer;
  transition: all .25s;
  position: relative; overflow: hidden;
}
.card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #eff6ff 0%, transparent 60%);
  opacity: 0; transition: opacity .3s;
}
.card:hover { border-color: var(--accent-light); transform: translateY(-5px); box-shadow: 0 20px 50px rgba(37,99,235,0.1); }
.card:hover::before { opacity: 1; }
.head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; position: relative; }
.emoji { font-size: 28px; }
.arrow { font-size: 20px; color: var(--text-3); transition: all .2s; }
.card:hover .arrow { color: var(--accent); transform: translate(3px,-3px); }
.name { font-size: 17px; font-weight: 700; margin-bottom: 8px; position: relative; }
.about { font-size: 13.5px; color: var(--text-2); line-height: 1.7; margin-bottom: 16px; position: relative; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; position: relative; }
.tag { padding: 3px 10px; border-radius: 4px; font-size: 11.5px; font-weight: 600; background: white; color: var(--accent); border: 1px solid #bfdbfe; }

@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Create `components/Projects.tsx`**

```tsx
// components/Projects.tsx
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
```

- [ ] **Step 3: Add Projects to `app/page.tsx`** — import and render `<Projects />` after `<Experience />`.

- [ ] **Step 4: Commit**
```bash
git add components/Projects.tsx components/Projects.module.css app/page.tsx && git commit -m "feat: add Projects section"
```

---

### Task 10: Certifications section

**Files:**
- Create: `components/Certifications.tsx`
- Create: `components/Certifications.module.css`

**Consumes:** `certifications` from `data/portfolio.ts`, `useScrollReveal`

- [ ] **Step 1: Create `components/Certifications.module.css`**

```css
/* components/Certifications.module.css */
.section { border-bottom: 1px solid var(--border); }
.list { display: flex; flex-direction: column; gap: 14px; }
.row {
  display: flex; align-items: center; gap: 20px;
  padding: 20px 24px; border-radius: var(--r);
  border: 1px solid var(--border);
  background: #ffffff;
  transition: all .22s;
}
.row:hover { border-color: var(--accent-light); transform: translateX(6px); }
.badge {
  width: 48px; height: 48px; border-radius: 12px;
  background: #eff6ff;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.info { flex: 1; min-width: 0; }
.name { font-size: 15px; font-weight: 700; margin-bottom: 3px; }
.issuer { font-size: 13px; color: var(--text-2); }
.year {
  font-size: 13px; font-weight: 700;
  color: var(--accent); background: #eff6ff;
  padding: 5px 13px; border-radius: 50px;
  white-space: nowrap; flex-shrink: 0;
}

@media (max-width: 600px) {
  .row { padding: 16px; gap: 14px; }
  .year { padding: 4px 10px; font-size: 12px; }
}
```

- [ ] **Step 2: Create `components/Certifications.tsx`**

```tsx
// components/Certifications.tsx
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
```

- [ ] **Step 3: Add Certifications to `app/page.tsx`** — import and render `<Certifications />` after `<Projects />`.

- [ ] **Step 4: Commit**
```bash
git add components/Certifications.tsx components/Certifications.module.css app/page.tsx && git commit -m "feat: add Certifications section"
```

---

### Task 11: Contact section and Footer

**Files:**
- Create: `components/Contact.tsx`
- Create: `components/Contact.module.css`
- Create: `components/Footer.tsx`
- Create: `components/Footer.module.css`

**Consumes:** `personal` from `data/portfolio.ts`, `useScrollReveal`

- [ ] **Step 1: Create `components/Contact.module.css`**

```css
/* components/Contact.module.css */
.section { padding-bottom: 100px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.heading { font-size: 22px; font-weight: 800; margin-bottom: 14px; }
.p { font-size: 14.5px; color: var(--text-2); line-height: 1.75; margin-bottom: 28px; }
.socials { display: flex; flex-direction: column; gap: 10px; }
.soc {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; border-radius: 10px;
  border: 1px solid var(--border);
  text-decoration: none; color: var(--text);
  font-size: 14px; font-weight: 500;
  transition: all .2s;
}
.soc:hover { border-color: var(--accent-light); color: var(--accent); transform: translateX(4px); }
.socIcon { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-2); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.form { display: flex; flex-direction: column; gap: 14px; }
.fg { display: flex; flex-direction: column; gap: 6px; }
.fg label { font-size: 12px; font-weight: 700; color: var(--text-2); letter-spacing: .5px; }
.input, .textarea {
  padding: 12px 16px; border-radius: 10px;
  background: var(--bg-2);
  border: 1.5px solid var(--border);
  font-size: 14px; color: var(--text);
  outline: none; font-family: inherit;
  transition: all .2s; width: 100%;
}
.input:focus, .textarea:focus {
  border-color: var(--accent);
  background: white;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
}
.textarea { min-height: 110px; resize: vertical; }
.submit {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 13px 26px; border-radius: 8px;
  font-size: 14px; font-weight: 600;
  background: var(--text); color: white;
  border: none; cursor: pointer; font-family: inherit;
  transition: all .2s; width: fit-content;
  text-decoration: none;
}
.submit:hover { background: var(--accent); transform: translateY(-2px); }

@media (max-width: 960px) { .split { grid-template-columns: 1fr; gap: 32px; } }
```

- [ ] **Step 2: Create `components/Contact.tsx`**

```tsx
// components/Contact.tsx
'use client'
import { useRef, FormEvent } from 'react'
import { personal } from '@/data/portfolio'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './Contact.module.css'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
    window.location.href = `mailto:${personal.email}?subject=Portfolio inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`
  }

  return (
    <section id="contact" className={styles.section} ref={ref}>
      <div className="secNum">06</div>
      <div className="label">Contact</div>
      <h2>Let&apos;s build something</h2>
      <div className={styles.split}>
        <div className="fu">
          <h3 className={styles.heading}>Open to new<br />opportunities.</h3>
          <p className={styles.p}>
            Whether you need a mobile app, a web platform, or a long-term development partner — I&apos;d love to hear from you. Currently available for freelance and full-time remote roles.
          </p>
          <div className={styles.socials}>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className={styles.soc}>
              <div className={styles.socIcon}>🔗</div> {personal.linkedin.replace('https://', '')}
            </a>
            <a href={personal.github} target="_blank" rel="noopener noreferrer" className={styles.soc}>
              <div className={styles.socIcon}>⌨️</div> {personal.github.replace('https://', '')}
            </a>
            <a href={`mailto:${personal.email}`} className={styles.soc}>
              <div className={styles.socIcon}>✉️</div> {personal.email}
            </a>
          </div>
        </div>
        <div className="fu">
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fg}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your name" className={styles.input} required />
            </div>
            <div className={styles.fg}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="your@email.com" className={styles.input} required />
            </div>
            <div className={styles.fg}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Tell me about your project..." className={styles.textarea} required />
            </div>
            <button type="submit" className={styles.submit}>Send Message →</button>
          </form>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/Footer.module.css`**

```css
/* components/Footer.module.css */
.footer {
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 60px;
  font-size: 13px; color: var(--text-3);
  flex-wrap: wrap; gap: 8px;
  position: relative; z-index: 1;
}
.footer a { color: var(--accent); text-decoration: none; }

@media (max-width: 960px) { .footer { padding: 20px 24px; } }
```

- [ ] **Step 4: Create `components/Footer.tsx`**

```tsx
// components/Footer.tsx
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} Dat Nguyen</span>
      <span>Built with Next.js &amp; CSS Modules</span>
    </footer>
  )
}
```

- [ ] **Step 5: Wire everything into `app/page.tsx`**

```tsx
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Verify full page renders correctly, all sections visible, contact form opens mailto.**

- [ ] **Step 7: Commit**
```bash
git add components/Contact.tsx components/Contact.module.css components/Footer.tsx components/Footer.module.css app/page.tsx && git commit -m "feat: add Contact, Footer sections — portfolio complete"
```

---

### Task 12: SEO finishing touches

**Files:**
- Modify: `app/layout.tsx`
- Create: `public/robots.txt`
- Create: `app/sitemap.ts`

- [ ] **Step 1: Add canonical and viewport to layout metadata**

In `app/layout.tsx`, update the `metadata` export:
```tsx
export const metadata: Metadata = {
  // ...existing fields...
  metadataBase: new URL('https://datnguyen.dev'),
  alternates: { canonical: '/' },
  viewport: { width: 'device-width', initialScale: 1 },
}
```

- [ ] **Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://datnguyen.dev/sitemap.xml
```

- [ ] **Step 3: Create `app/sitemap.ts`**

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://datnguyen.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

- [ ] **Step 4: Run production build to verify no errors**
```bash
npm run build
```
Expected: no TypeScript errors, no missing image warnings, build completes successfully.

- [ ] **Step 5: Commit**
```bash
git add app/layout.tsx public/robots.txt app/sitemap.ts && git commit -m "feat: add sitemap, robots.txt, canonical URL for SEO"
```
