"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { SAMPLE_TRACKS, usePlayerStore, type Track } from '@/lib/player-store'
import { searchMusic } from '@/lib/music-api'

const GENRES = [
  { label: 'Pop', color: '#9B4DE0' },
  { label: 'Hip-Hop', color: '#6b3ab5' },
  { label: 'R&B', color: '#4a2a7a' },
  { label: 'Electronic', color: '#3d1f5c' },
  { label: 'Rock', color: '#5c2e9e' },
  { label: 'Jazz', color: '#7a3dc8' },
  { label: 'Classical', color: '#6b3ab5' },
  { label: 'Lo-Fi', color: '#4a2a7a' },
  { label: 'Indie', color: '#9B4DE0' },
  { label: 'Metal', color: '#3d1f5c' },
]

const TOP_RESULTS = [
  { id: 'sr1', title: 'Blinding Lights', subtitle: 'The Weeknd · Song', href: '/track/blinding-lights', type: 'track' as const },
  { id: 'sr2', title: 'After Hours', subtitle: 'The Weeknd · Album', href: '/album/after-hours', type: 'album' as const },
  { id: 'sr3', title: 'The Weeknd', subtitle: 'Artist', href: '/artist/the-weeknd', type: 'artist' as const },
  { id: 'sr4', title: 'Weekend Vibes', subtitle: 'Playlist · VibeWave', href: '/playlist/weekend-vibes', type: 'playlist' as const },
]

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { setTrack } = usePlayerStore()

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    async function doSearch() {
      setIsLoading(true)
      try {
        const data = await searchMusic(query, 20)
        setResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(doSearch, 300)
    return () => clearTimeout(timer)
  }, [query])

  const hasQuery = query.length > 0

  if (!hasQuery) {
    return (
      <div className="space-y-10">
        <div>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            Browse Genres
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {GENRES.map((genre) => (
              <button
                key={genre.label}
                className="relative h-24 rounded-2xl overflow-hidden flex items-end p-4 transition-vw hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${genre.color} 0%, rgba(23,15,35,0.8) 100%)`,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span className="font-display font-semibold text-base" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.2px' }}>
                  {genre.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl animate-pulse" style={{ backgroundColor: '#1F162E' }} />
        ))}
      </div>
    )
  }

  const topResult = results[0]
  const otherSongs = results.slice(1, 5)

  return (
    <div className="space-y-12">
      {topResult ? (
        <>
          <div className="grid grid-cols-5 gap-6">
            {/* Top result */}
            <div className="col-span-2">
              <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
                Top Result
              </h2>
              <div
                onClick={() => setTrack(topResult)}
                className="p-6 rounded-2xl transition-vw hover:bg-white/[0.02] cursor-pointer group relative"
                style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img
                  src={topResult.albumArt}
                  alt={topResult.title}
                  className="w-24 h-24 rounded-2xl mb-4 object-cover shadow-2xl"
                />
                <h3 className="font-display font-bold mb-1" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
                  {topResult.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Song · {topResult.artist}</p>
                <button
                  className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-vw absolute bottom-6 right-6"
                  style={{ backgroundColor: '#9B4DE0', boxShadow: '0 4px 16px rgba(155,77,224,0.4)' }}
                  aria-label={`Play ${topResult.title}`}
                >
                  <Play size={18} fill="white" className="text-white ml-0.5" />
                </button>
              </div>
            </div>

            {/* Songs */}
            <div className="col-span-3">
              <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
                Songs
              </h2>
              <div className="space-y-1">
                {otherSongs.map((track, i) => (
                  <TrackRow key={track.id} index={i + 1} track={track} showAlbum={false} />
                ))}
              </div>
            </div>
          </div>

          {/* Grid of other results */}
          <div>
            <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
              More Results
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {results.slice(5).map((r) => (
                <MusicCard key={r.id} id={r.id} title={r.title} subtitle={r.artist} track={r} type="track" />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.95)' }}>No results found for "{query}"</p>
          <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Try searching for something else.</p>
        </div>
      )}
    </div>
  )
}

function SearchInner() {
  const params = useSearchParams()
  const query = params.get('q') ?? ''

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="font-display font-bold leading-display"
          style={{ fontSize: 48, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
        >
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Showing best matches for your search.
          </p>
        )}
      </div>
      <SearchResults query={query} />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: '#1F162E' }} />
        ))}
      </div>
    }>
      <SearchInner />
    </Suspense>
  )
}
