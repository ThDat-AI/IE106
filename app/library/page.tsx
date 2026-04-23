import AppShell from '@/components/layout/app-shell'
import LibraryPage from '@/components/pages/library-page'

export const metadata = { title: 'History — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <LibraryPage />
    </AppShell>
  )
}
