import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://datdev.vercel.app'),
  alternates: { canonical: '/' },
  icons: { icon: '/logo.png' },
  verification: { google: 'kdxgXVuG7fpgHW3VKxHpGqYs1j9JXFmJmwjYEYjvLjo' },
  title: 'Nguyen Tan Dat — Senior React Native Engineer',
  description: '8 years of shipping apps people use every day — from healthcare platforms to real estate tools to tennis trackers. React Native at heart, full-stack when needed, and always experimenting with AI to build smarter and faster.',
  keywords: ['React Native', 'Expo', 'TypeScript', 'React.js', 'Next.js', 'Mobile Developer', 'Senior Engineer', 'Vietnam', 'Healthcare', 'Turborepo'],
  authors: [{ name: 'Nguyen Tan Dat' }],
  creator: 'Nguyen Tan Dat',
  openGraph: {
    type: 'website',
    title: 'Nguyen Tan Dat — Senior React Native Engineer',
    description: 'Building production-grade React Native apps across healthcare, real estate, sports and telecom for US, UK, Japanese and Australian clients.',
    siteName: 'Nguyen Tan Dat Portfolio',
    images: [{ url: '/photo.jpg', width: 1200, height: 630, alt: 'Nguyen Tan Dat' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nguyen Tan Dat — Senior React Native Engineer',
    description: 'Building production-grade React Native apps across healthcare, real estate, sports and telecom.',
    images: ['/photo.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
