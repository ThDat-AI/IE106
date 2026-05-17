import AppShell from '@/components/layout/app-shell'
import LegalCombinedPage from '@/components/pages/legal-combined-page'
import { Suspense } from 'react'

export const metadata = {
  title: 'Legal — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Đang tải điều khoản...</div>}>
        <LegalCombinedPage />
      </Suspense>
    </AppShell>
  )
}
