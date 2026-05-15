import AppShell from '@/components/layout/app-shell'
import AboutContactPage from '@/components/pages/about-contact-page'

export const metadata = {
  title: 'About Us & Contact — VibeWave',
  description: 'Learn about VibeWave and get in touch with our team.',
}

export default function Page() {
  return (
    <AppShell>
      <AboutContactPage />
    </AppShell>
  )
}
