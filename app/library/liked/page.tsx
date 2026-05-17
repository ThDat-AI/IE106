import AppShell from '@/components/layout/app-shell'
import LikedSongsPage from '@/components/pages/liked-songs-page'
import { Suspense } from 'react'

export const metadata = { title: 'Liked Songs — VibeWave' }

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Loading liked songs...</div>}>
        <LikedSongsPage />
      </Suspense>
    </AppShell>
  )
}
