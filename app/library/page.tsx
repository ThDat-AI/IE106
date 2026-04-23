import AppShell from '@/components/layout/app-shell'
import LibraryPage from '@/components/pages/library-page'
import { searchSpotifyAlbums } from '@/lib/spotify'

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

  return (
    <AppShell>
      <LibraryPage initialAlbums={albums} />
    </AppShell>
  )
}
