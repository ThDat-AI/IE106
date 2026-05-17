import AppShell from '@/components/layout/app-shell'
import AboutContactPage from '@/components/pages/about-contact-page'
import { Suspense } from 'react'

export const metadata = {
  title: 'About Us & Contact — VibeWave',
  description: 'Learn about VibeWave and get in touch with our team.',
}

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Đang tải...</div>}>
        <AboutContactPage />
      </Suspense>
    </AppShell>
  )
}
