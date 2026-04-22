import AppShell from '@/components/layout/app-shell'
import ProfileSettingsPage from '@/components/pages/profile-settings-page'

export const metadata = {
  title: 'Profile & Settings — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <ProfileSettingsPage />
    </AppShell>
  )
}
