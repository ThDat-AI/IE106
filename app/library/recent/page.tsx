import AppShell from '@/components/layout/app-shell'
import RecentlyPlayedPage from '@/components/pages/recently-played-page'
import { searchTracks } from '@/lib/music-api'
import { Suspense } from 'react'

export const metadata = { title: 'Recently Played — VibeWave' }

export default async function Page() {
  const recentQueries = ['Đen Vâu', 'Sơn Tùng M-TP', 'Hoàng Dũng', 'Da LAB', 'Wren Evans']
  const tracksPromises = recentQueries.map(artist => searchTracks(artist, 3))
  const tracksResults = await Promise.all(tracksPromises)
  
  const recentTracks = tracksResults.flat().map((track, index) => {
    // Generate simulated playedAt dates based on index
    let playedAt: string;
    const now = new Date();
    if (index < 3) {
      // Hôm nay: current day, slightly different hours
      const d = new Date(now.getTime() - index * 2 * 60 * 60 * 1000);
      playedAt = d.toISOString();
    } else if (index < 6) {
      // Hôm qua: yesterday, e.g. 25-30 hours ago
      const d = new Date(now.getTime() - 24 * 60 * 60 * 1000 - (index - 3) * 3 * 60 * 60 * 1000);
      playedAt = d.toISOString();
    } else if (index < 11) {
      // 7 ngày qua: e.g. 2, 3, 4, 5, 6 days ago (excluding today and yesterday)
      const daysAgo = 2 + (index - 6);
      const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      playedAt = d.toISOString();
    } else {
      // Trước đó: 9+ days ago (excluding 7 days ago, yesterday, today)
      const daysAgo = 9 + (index - 11) * 3;
      const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      playedAt = d.toISOString();
    }

    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      albumArt: track.albumArt,
      duration: track.duration,
      url: track.url || '',
      type: 'track',
      playedAt
    }
  })

  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Loading history...</div>}>
        <RecentlyPlayedPage initialTracks={recentTracks as any} />
      </Suspense>
    </AppShell>
  )
}
