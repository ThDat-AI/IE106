import AppShell from '@/components/layout/app-shell'
import AlbumDetailPage from '@/components/pages/album-detail-page'
import { getAlbumInfo, getAlbumTracks, searchAlbums } from '@/lib/music-api'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch data on server side to avoid CORS/Client network issues
  const isId = /^\d+$/.test(slug)
  let albumInfo = null
  let tracks = []
  
  try {
    if (isId) {
      albumInfo = await getAlbumInfo(slug)
      if (albumInfo) tracks = await getAlbumTracks(slug)
    } else {
      const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      const searchResults = await searchAlbums(title, 1)
      if (searchResults.length > 0) {
        albumInfo = searchResults[0]
        tracks = await getAlbumTracks(albumInfo.id)
      }
    }
  } catch (error) {
    console.error('Server-side fetch error:', error)
  }

  return (
    <AppShell>
      <AlbumDetailPage slug={slug} initialAlbumInfo={albumInfo} initialTracks={tracks} />
    </AppShell>
  )
}
