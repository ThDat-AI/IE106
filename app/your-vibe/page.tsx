import AppShell from '@/components/layout/app-shell'
import YourVibePage from '@/components/pages/your-vibe-page'

export const metadata = { title: 'Your Vibe — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <YourVibePage />
    </AppShell>
  )
}
