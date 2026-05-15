import AppShell from '@/components/layout/app-shell'
import LegalCombinedPage from '@/components/pages/legal-combined-page'

export const metadata = {
  title: 'Legal — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <LegalCombinedPage />
    </AppShell>
  )
}
