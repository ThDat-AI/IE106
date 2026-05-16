import type { Metadata } from 'next'
import { Poppins, Montserrat, Righteous } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-righteous',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VibeWave — Music that works with you',
  description: 'Dark minimalist music streaming platform with AI-powered personalization.',
}

export const viewport = {
  themeColor: '#231E32',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} ${righteous.variable} bg-vw-bg`}>
      <body className="font-sans antialiased bg-vw-bg text-primary-text">
        {children}
      </body>
    </html>
  )
}
