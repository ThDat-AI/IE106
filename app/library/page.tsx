import AppShell from '@/components/layout/app-shell'
import LibraryPage from '@/components/pages/library-page'
import { searchAlbums } from '@/lib/music-api'
import { Suspense } from 'react'

export const metadata = { title: 'Library — VibeWave' }

export default async function Page() {
  const artists = [
    'Đen Vâu', 'Sơn Tùng M-TP', 'Hoàng Thùy Linh', 'Vũ.', 'Phùng Khánh Linh', 
    'GREY D', 'tlinh', 'HIEUTHUHAI', 'Mỹ Tâm', 'MONO', 'Văn Mai Hương', 'Thịnh Suy'
  ]
  
  // Shuffle artists and take a good amount
  const shuffled = artists.sort(() => 0.5 - Math.random())
  const selectedArtists = shuffled.slice(0, 10)
  
  const albumsPromises = selectedArtists.map(artist => searchAlbums(artist, 1))
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
      <Suspense fallback={<div className="p-8 text-white/50">Đang tải thư viện...</div>}>
        <LibraryPage initialAlbums={albums} />
      </Suspense>
    </AppShell>
  )
}
