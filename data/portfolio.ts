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
