import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VibeWave — Music that works with you',
  description: 'Dark minimalist music streaming platform with AI-powered personalization.',
}

export const viewport = {
  themeColor: '#170F23',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} bg-vw-bg`}>
      <body className="font-sans antialiased bg-vw-bg text-primary-text">
        {children}
      </body>
    </html>
  )
}
