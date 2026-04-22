"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { SAMPLE_TRACKS } from '@/lib/player-store'

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

  return (
    <div className="space-y-12">
      {/* Top result + songs side by side */}
      <div className="grid grid-cols-5 gap-6">
        {/* Top result */}
        <div className="col-span-2">
          <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            Top Result
          </h2>
          <div
            className="p-6 rounded-2xl transition-vw hover:bg-white/[0.02] cursor-pointer group relative"
            style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center font-display font-bold text-3xl"
              style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)' }}
            >
              {query.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-display font-bold mb-1" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
              {query}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Song · The Weeknd</p>
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-vw absolute bottom-6 right-6"
              style={{ backgroundColor: '#9B4DE0', boxShadow: '0 4px 16px rgba(155,77,224,0.4)' }}
              aria-label={`Play ${query}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white" style={{ marginLeft: 2 }}>
                <path d="M3 2.5l10 5.5-10 5.5V2.5z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Songs */}
        <div className="col-span-3">
          <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            Songs
          </h2>
          <div className="space-y-1">
            {SAMPLE_TRACKS.slice(0, 4).map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum={false} />
            ))}
          </div>
        </div>
      </div>

      {/* Artists */}
      <div>
        <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          Artists
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {TOP_RESULTS.filter(r => r.type === 'artist').concat(TOP_RESULTS.slice(0, 3)).slice(0, 4).map((r) => (
            <MusicCard key={r.id} id={r.id} title={r.title} subtitle={r.subtitle} href={r.href} type={r.type} />
          ))}
        </div>
      </div>

      {/* Albums & Playlists */}
      <div>
        <h2 className="font-display font-semibold mb-4" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          Albums &amp; Playlists
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {TOP_RESULTS.map((r) => (
            <MusicCard key={r.id + '-2'} id={r.id + '2'} title={r.title} subtitle={r.subtitle} href={r.href} type={r.type} />
          ))}
        </div>
      </div>
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
