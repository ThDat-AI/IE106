import AppShell from '@/components/layout/app-shell'
import SearchPage from '@/components/pages/search-page'

export const metadata = { title: 'Search — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <SearchPage />
    </AppShell>
  )
}
