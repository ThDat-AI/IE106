import AppShell from '@/components/layout/app-shell'
import LibraryPage from '@/components/pages/library-page'
import { searchSpotifyAlbums, searchSpotifyTracks } from '@/lib/spotify'
import { Suspense } from 'react'

export const metadata = { title: 'Library — VibeWave' }

export default async function Page() {
  const artists = ['Đen Vâu', 'Sơn Tùng M-TP', 'J97', 'Phùng Khánh Linh', 'Văn Mai Hương']
  
  const albumsPromises = artists.map(artist => searchSpotifyAlbums(artist, 1))
  const albumsResults = await Promise.all(albumsPromises)
  
  const albums = albumsResults.flat().map(album => ({
    id: album.id,
    title: album.title,
    subtitle: album.artist,
    image: album.albumArt,
    href: `/album/${album.id}`,
    type: 'album'
  }))

  const likedSongsQueries = ['Sơn Tùng M-TP', 'Đen Vâu', 'Vũ.', 'Ngọt', 'Hoàng Thùy Linh', 'Chillies', 'MCK', 'tlinh']
  const tracksPromises = likedSongsQueries.map(artist => searchSpotifyTracks(artist, 2))
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

  const recentlyPlayedTracks = [...likedTracks].reverse().slice(0, 15)

  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Loading library...</div>}>
        <LibraryPage initialAlbums={albums} initialLikedSongs={likedTracks} initialRecentlyPlayedSongs={recentlyPlayedTracks} />
      </Suspense>
    </AppShell>
  )
}
