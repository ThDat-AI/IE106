import AppShell from '@/components/layout/app-shell'
import AboutPage from '@/components/pages/about-page'

export const metadata = {
  title: 'About Us — VibeWave',
  description: 'Learn about VibeWave — a music streaming platform built for background listening and AI-powered personalization.',
}

export default function Page() {
  return (
    <AppShell>
      <AboutPage />
    </AppShell>
  )
}
