import AppShell from '@/components/layout/app-shell'
import BlockedPage from '@/components/pages/blocked-page'

export const metadata = {
  title: 'Blocked List — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <BlockedPage />
    </AppShell>
  )
}
