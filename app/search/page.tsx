import AppShell from '@/components/layout/app-shell'
import SearchPage from '@/components/pages/search-page'
import { Suspense } from 'react'

export const metadata = { title: 'Search — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Đang tìm kiếm...</div>}>
        <SearchPage />
      </Suspense>
    </AppShell>
  )
}
