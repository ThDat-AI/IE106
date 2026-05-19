import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
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
    <html lang="en" suppressHydrationWarning={true} className={`${poppins.variable} ${montserrat.variable} bg-vw-bg`}>
      <body suppressHydrationWarning={true} className="font-sans antialiased bg-vw-bg text-primary-text">
        {children}
      </body>
    </html>
  )
}
