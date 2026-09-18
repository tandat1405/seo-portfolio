export const personal = {
  name: 'Nguyen Tan Dat',
  title: 'Senior React Native Engineer',
  tagline: 'Senior React Native <em>Engineer.</em>',
  sub: 'React Native · Expo · TypeScript · React.js',
  desc: 'Senior React Native Engineer with 8+ years building production-grade apps across healthcare, real estate, sports and telecom. Pioneering AI-assisted development workflows to ship better software faster.',
  location: 'Ho Chi Minh City, Vietnam',
  email: 'tandat1405@gmail.com',
  linkedin: 'https://www.linkedin.com/in/tandat1405/',
  availableForWork: true,
}

export const metrics = [
  { icon: '📱', bg: '#eff6ff', label: 'Live Apps & Webs Shipped', value: '9+' },
  { icon: '🌍', bg: '#f0fdf4', label: 'Countries Worked With', value: '5+' },
  { icon: '🏆', bg: '#fefce8', label: 'Years of Experience', value: '8+' },
  { icon: '👥', bg: '#fdf4ff', label: 'Teams Led', value: '3+' },
]

export const whatIBring = [
  'React Native & Expo cross-platform development',
  'Clean Architecture & Monorepo (Turborepo)',
  'Performance optimization & memory profiling',
  'App Store & Google Play deployments',
  'AI-assisted development workflows',
  'Team leadership & technical mentoring',
]

export type Skill = { name: string; pct: number }

export const skillsMobile: Skill[] = [
  { name: 'React Native', pct: 95 },
  { name: 'Expo / EAS', pct: 92 },
  { name: 'iOS / Android', pct: 85 },
]

export const skillsWeb: Skill[] = [
  { name: 'TypeScript', pct: 93 },
  { name: 'React.js', pct: 90 },
  { name: 'Next.js', pct: 85 },
]

export const techTools = [
  'Turborepo', 'Clean Architecture', 'Redux Toolkit', 'Zustand',
  'React Query', 'Firebase', 'AWS / Cognito', 'GraphQL',
  'GitHub Actions', 'Bitrise', 'Jest', 'Appium',
  'Playwright', 'Datadog', 'SonarCloud', 'NativeWind',
  'ElectronJs', 'Android Java',
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
    date: 'June 2024 — Present',
    company: 'KMS Technology, Inc',
    role: 'Senior React Native Engineer',
    desc: 'Rebuilt legacy native iOS, Android & Vue apps into a unified React Native + Expo solution serving P&G, Pfizer, Sanofi and other healthcare organizations. Architected Clean Architecture monorepo with Turborepo, improved frame rate from 1–15 to ~60 fps, and reduced RAM from 1.3 GB to ~500 MB. Presented sprint demos to US stakeholders and leveraged AI agents in daily workflows.',
    tags: ['React Native', 'Expo', 'Turborepo', 'Clean Architecture', 'AWS'],
  },
  {
    date: 'June 2023 — June 2024',
    company: 'GCT Solution',
    role: 'Senior React Native Engineer',
    desc: 'Designed and shipped new features across mobile apps for clients in England, Singapore and Australia. Led a mobile team of 4, conducted hiring interviews for foreign customer projects, and published apps to App Store and Google Play.',
    tags: ['React Native', 'TypeScript', 'App Store', 'Play Store'],
  },
  {
    date: 'July 2022 — June 2023',
    company: 'Reti Proptech',
    role: 'Middle React Native Engineer',
    desc: 'Developed a real estate app from scratch in a start-up environment that raised $3M in funding from VicPartner and CyberAgent. Built offline-first architecture, animated UI, and collaborated directly with Product Owner and Sales to ship features.',
    tags: ['React Native', 'GraphQL', 'Apollo Client', 'Redux'],
  },
  {
    date: 'Sep 2018 — June 2022',
    company: 'TMA Solutions',
    role: 'Mobile Engineer',
    desc: 'Built and maintained enterprise telecom calling services for Mitel — serving US, Indian and Japanese clients. Led an outsourcing team of 4, worked across Android Java, JavaScript and TypeScript, and shipped apps used by thousands of enterprise users.',
    tags: ['Android Java', 'React Native', 'WebRTC', 'TypeScript'],
  },
]

export type Project = {
  emoji: string
  name: string
  desc: string
  tags: string[]
  iosUrl?: string
  androidUrl?: string
}

export const projects: Project[] = [
  {
    emoji: '🏥',
    name: 'Clinical Application',
    desc: '100+ white-label healthcare apps deployed to production for P&G, Pfizer & Sanofi. Rebuilt from native iOS/Android/Vue into a unified Expo codebase. Achieved ~60 fps from 1–15 fps and reduced RAM from 1.3 GB to ~500 MB.',
    tags: ['React Native', 'Expo', 'Turborepo', 'AWS', 'Realm DB'],
    iosUrl: 'https://drive.google.com/file/d/1pf4s9doZrBVthMfohYgs4qGa4dZScw6R/view?usp=sharing',
    androidUrl: 'https://drive.google.com/file/d/1pf4s9doZrBVthMfohYgs4qGa4dZScw6R/view?usp=sharing',
  },
  {
    emoji: '🔐',
    name: 'Universal Portal SSO',
    desc: 'Edge-native Clinical Portal SPA serving as an SSO gateway across healthcare tenants. Built 100% with AI-assisted coding (Claude Code) on React 19, Cloudflare Workers, and AWS Cognito.',
    tags: ['React 19', 'TypeScript', 'Cloudflare', 'AWS Cognito', 'Vite'],
  },
  {
    emoji: '🎾',
    name: 'Viettennis',
    desc: 'App for Vietnamese tennis players — tournament registration, player rankings, and match tracking. Published on App Store & Play Store with CI/CD via Xcode Cloud.',
    tags: ['React Native', 'TypeScript', 'Redux Toolkit', 'Firebase'],
    iosUrl: 'https://apps.apple.com/vn/app/viettennis/id6478106025',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.viettennis',
  },
  {
    emoji: '📞',
    name: 'Mitel One',
    desc: 'Enterprise communication app for calling, messaging and video. Led a React Native team of 4, integrated Amazon Chime video calling, and built automation tests with Appium.',
    tags: ['React Native', 'Amazon Chime', 'Realm', 'Appium'],
    iosUrl: 'https://apps.apple.com/vn/app/mitel-one/id1558922285',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.mitel.one.android',
  },
  {
    emoji: '🏠',
    name: 'Seland',
    desc: 'Real estate app connecting sellers with buyers across Vietnam. Led the mobile team, implemented in-app purchases with VNPAY, and published to both App Store and Play Store.',
    tags: ['React Native', 'TypeScript', 'Redux Toolkit', 'Firebase'],
    iosUrl: 'https://apps.apple.com/vn/app/seland-vn/id6461381041',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.seland',
  },
  {
    emoji: '🏡',
    name: 'Retizy',
    desc: 'PropTech platform helping the app raise $3M in funding from VicPartner & CyberAgent. Built offline-first with GraphQL, animated UI, and published to App Store & Play Store.',
    tags: ['React Native', 'GraphQL', 'Apollo', 'Redux'],
    iosUrl: 'https://apps.apple.com/vn/app/retizy/id1593808769',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.reti.agent.app',
  },
]

export type Certification = {
  icon: string
  name: string
  issuer: string
  year: string
  url?: string
}

export const certifications: Certification[] = [
  {
    icon: '🤖',
    name: 'Claude Certified Architect — Foundations',
    issuer: 'Anthropic',
    year: '2026',
    url: 'https://www.credly.com/badges/f8439b35-8f01-4e7e-9109-d4fdc02705bc/public_url',
  },
  {
    icon: '⚡',
    name: 'Claude Code in Action',
    issuer: 'Anthropic',
    year: '2026',
    url: 'https://verify.skilljar.com/c/xv59q3v7nqy9',
  },
  {
    icon: '🔧',
    name: 'Building with the Claude API',
    issuer: 'Anthropic',
    year: '2026',
    url: 'https://verify.skilljar.com/c/whkpgwqq35sn',
  },
  {
    icon: '🏥',
    name: 'HIPAA Awareness for Business Associates',
    issuer: 'HIPAATraining.com',
    year: '2024',
  },
  {
    icon: '🌐',
    name: 'English Proficiency Certificate: CEFR B2',
    issuer: 'Duolingo',
    year: '2025',
    url: 'https://certs.duolingo.com/y2d8i5buf6l5gm5u',
  },
]
