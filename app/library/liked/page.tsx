import AppShell from '@/components/layout/app-shell'
import LikedSongsPage from '@/components/pages/liked-songs-page'
import { searchTracks } from '@/lib/music-api'
import { Suspense } from 'react'

export const metadata = { title: 'Liked Songs — VibeWave' }

export default async function Page() {
  const likedSongsQueries = ['Sơn Tùng M-TP', 'Đen Vâu', 'Vũ.', 'Ngọt', 'Hoàng Thùy Linh', 'Chillies', 'MCK', 'tlinh']
  const tracksPromises = likedSongsQueries.map(artist => searchTracks(artist, 2))
  const tracksResults = await Promise.all(tracksPromises)
  
  const likedTracks = tracksResults.flat().map(track => ({
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
      <Suspense fallback={<div className="p-8 text-white/50">Loading liked songs...</div>}>
        <LikedSongsPage initialTracks={likedTracks as any} />
      </Suspense>
    </AppShell>
  )
}
