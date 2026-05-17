import AppShell from '@/components/layout/app-shell'
import LibraryPage from '@/components/pages/library-page'
import { Suspense } from 'react'

export const metadata = { title: 'Library — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Đang tải thư viện...</div>}>
        <LibraryPage initialAlbums={[]} />
      </Suspense>
    </AppShell>
  )
}
