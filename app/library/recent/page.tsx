import AppShell from '@/components/layout/app-shell'
import RecentlyPlayedPage from '@/components/pages/recently-played-page'
import { searchTracks } from '@/lib/music-api'
import { Suspense } from 'react'

export const metadata = { title: 'Recently Played — VibeWave' }

export default async function Page() {
  const recentQueries = ['Đen Vâu', 'Sơn Tùng M-TP', 'Hoàng Dũng', 'Da LAB', 'Wren Evans']
  const tracksPromises = recentQueries.map(artist => searchTracks(artist, 3))
  const tracksResults = await Promise.all(tracksPromises)
  
  const recentTracks = tracksResults.flat().map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    albumArt: track.albumArt,
    duration: track.duration,
    url: track.url || '',
    type: 'track'
  }))

  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Loading history...</div>}>
        <RecentlyPlayedPage initialTracks={recentTracks as any} />
      </Suspense>
    </AppShell>
  )
}
