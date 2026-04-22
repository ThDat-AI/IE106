"use client"

import { Play, Shuffle, Heart, MoreHorizontal, Clock, Plus } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import { SAMPLE_TRACKS } from '@/lib/player-store'
import { usePlayerStore } from '@/lib/player-store'

const PLAYLIST_TRACKS = SAMPLE_TRACKS.slice(0, 8)

const RELATED = [
  { id: 'r1', title: 'Chill Vibes', subtitle: '61 songs · VibeWave', href: '/playlist/chill-vibes' },
  { id: 'r2', title: 'Late Night Drive', subtitle: '28 songs · Your playlist', href: '/playlist/late-night-drive' },
  { id: 'r3', title: 'Morning Energy', subtitle: '35 songs · VibeWave', href: '/playlist/morning-energy' },
  { id: 'r4', title: 'Study Session', subtitle: '47 songs', href: '/playlist/study-session' },
]

function slugToTitle(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function PlaylistDetailPage({ slug }: { slug: string }) {
  const title = slugToTitle(slug)
  const { setTrack } = usePlayerStore()

  return (
    <div className="space-y-12">

      {/* Hero */}
      <div className="flex items-end gap-8">
        <div
          className="w-52 h-52 rounded-2xl shrink-0 flex items-center justify-center text-6xl font-display font-bold"
          style={{
            background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
            color: 'rgba(255,255,255,0.7)',
            boxShadow: '0 24px 64px rgba(155,77,224,0.2)',
          }}
        >
          {title.charAt(0)}
        </div>

        <div className="flex-1 pb-2">
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Playlist</p>
          <h1
            className="font-display font-bold leading-display mb-4"
            style={{ fontSize: 52, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1px', lineHeight: 0.96 }}
          >
            {title}
          </h1>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Curated by <span style={{ color: 'rgba(255,255,255,0.8)' }}>VibeWave</span>
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {PLAYLIST_TRACKS.length} songs &middot; About 50 minutes
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrack(PLAYLIST_TRACKS[0])}
              className="flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
              style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
            >
              <Play size={16} fill="white" />
              Play All
            </button>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Shuffle size={15} />
              Shuffle
            </button>
            <button
              className="p-3 rounded-lg transition-vw hover:bg-white/5"
              aria-label="Like playlist"
              style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Heart size={16} />
            </button>
            <button
              className="p-3 rounded-lg transition-vw hover:bg-white/5"
              aria-label="More options"
              style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div
          className="grid grid-cols-[2rem_1fr_10rem_5rem] gap-4 items-center px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Title</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Album</span>
          <span className="flex justify-end">
            <Clock size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </span>
        </div>
        <div className="py-2">
          {PLAYLIST_TRACKS.map((track, i) => (
            <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
          ))}
        </div>
        <button
          className="flex items-center gap-2 mx-4 my-3 text-sm font-medium transition-vw hover:opacity-80"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <Plus size={15} />
          Add songs
        </button>
      </div>

      {/* Related playlists */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          You Might Also Like
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {RELATED.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="playlist" />
          ))}
        </div>
      </section>

    </div>
  )
}
