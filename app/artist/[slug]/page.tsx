import AppShell from '@/components/layout/app-shell'
import ArtistPage from '@/components/pages/artist-page'
import { searchMusic, searchAlbums, searchArtistImage, getArtistTracksById, getArtistAlbumsById } from '@/lib/music-api'

export default async function Page({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ id?: string }>
}) {
  const { slug } = await params
  const { id } = await searchParams
  
  let decodedSlug = slug
  try {
    decodedSlug = decodeURIComponent(slug)
  } catch (e) {
    console.error('Failed to decode slug:', e)
  }
  const name = decodedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  // Fetch initial data on server side
  // If we have an ID, use the more accurate lookup functions
  let tracks = []
  let albums = []
  let artistImage = ''

  if (id) {
    [tracks, albums, artistImage] = await Promise.all([
      getArtistTracksById(id, 10),
      getArtistAlbumsById(id, 8),
      searchArtistImage(name)
    ])
  } else {
    [tracks, albums, artistImage] = await Promise.all([
      searchMusic(name, 10),
      searchAlbums(name, 8),
      searchArtistImage(name)
    ])
  }

  return (
    <AppShell>
      <ArtistPage 
        slug={slug} 
        id={id}
        initialTracks={tracks} 
        initialAlbums={albums}
        initialImage={artistImage}
      />
    </AppShell>
  )
}
