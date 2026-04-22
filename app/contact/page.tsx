import AppShell from '@/components/layout/app-shell'
import ContactPage from '@/components/pages/contact-page'

export const metadata = {
  title: 'Contact Us — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <ContactPage />
    </AppShell>
  )
}
