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
