import AppShell from '@/components/layout/app-shell'
import FaqPage from '@/components/pages/faq-page'

export const metadata = {
  title: 'FAQ — VibeWave',
  description: 'Frequently asked questions about VibeWave.',
}

export default function Page() {
  return (
    <AppShell>
      <FaqPage />
    </AppShell>
  )
}
