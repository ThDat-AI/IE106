import AppShell from '@/components/layout/app-shell'
import ChartsPage from '@/components/pages/charts-page'

export const metadata = { title: 'Charts — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <ChartsPage />
    </AppShell>
  )
}
