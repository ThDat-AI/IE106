import AppShell from '@/components/layout/app-shell'
import LibraryPage from '@/components/pages/library-page'
import { searchAlbums, searchTracks } from '@/lib/music-api'
import { Suspense } from 'react'

export const metadata = { title: 'Library — VibeWave' }

export default async function Page() {
  const artists = ['Đen Vâu', 'Sơn Tùng M-TP', 'J97', 'Phùng Khánh Linh', 'Văn Mai Hương']
  
  const albumsPromises = artists.map(artist => searchAlbums(artist, 1))
  const albumsResults = await Promise.all(albumsPromises)
  
  const albums = albumsResults.flat().map(album => ({
    id: album.id,
    title: album.title,
    subtitle: album.artist,
    image: album.albumArt,
    href: `/album/${album.id}`,
    type: 'album'
  }))

  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-white/50">Loading library...</div>}>
        <LibraryPage initialAlbums={albums} />
      </Suspense>
    </AppShell>
  )
}
