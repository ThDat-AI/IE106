"use client"

import { Play, Shuffle, Heart, MoreHorizontal, Clock, ExternalLink } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import { SAMPLE_TRACKS, usePlayerStore } from '@/lib/player-store'
import Link from 'next/link'

const ALBUM_TRACKS = [
  ...SAMPLE_TRACKS,
  { id: '6', title: 'Escape from LA', artist: 'The Weeknd', album: 'After Hours', duration: 383 },
  { id: '7', title: 'Heartless', artist: 'The Weeknd', album: 'After Hours', duration: 215 },
  { id: '8', title: 'Faith', artist: 'The Weeknd', album: 'After Hours', duration: 401 },
]

const MORE_FROM_ARTIST = [
  { id: 'm1', title: 'Starboy', subtitle: '2016 · The Weeknd', href: '/album/starboy' },
  { id: 'm2', title: 'Beauty Behind the Madness', subtitle: '2015 · The Weeknd', href: '/album/beauty' },
  { id: 'm3', title: 'My Dear Melancholy', subtitle: '2018 · The Weeknd', href: '/album/mdm' },
  { id: 'm4', title: 'Dawn FM', subtitle: '2022 · The Weeknd', href: '/album/dawn-fm' },
]

function slugToTitle(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function AlbumDetailPage({ slug }: { slug: string }) {
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
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Album</p>
          <h1
            className="font-display font-bold leading-display mb-3"
            style={{ fontSize: 52, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1px', lineHeight: 0.96 }}
          >
            {title}
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <Link href="/artist/the-weeknd" className="text-sm font-medium transition-vw hover:opacity-80" style={{ color: 'rgba(255,255,255,0.85)' }}>
              The Weeknd
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>2020</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{ALBUM_TRACKS.length} songs</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrack(ALBUM_TRACKS[0])}
              className="flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
              style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
            >
              <Play size={16} fill="white" />
              Play
            </button>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Shuffle size={15} />
              Shuffle
            </button>
            <button className="p-3 rounded-lg transition-vw hover:bg-white/5" aria-label="Like album" style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Heart size={16} />
            </button>
            <button className="p-3 rounded-lg transition-vw hover:bg-white/5" aria-label="More options" style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="grid grid-cols-[2rem_1fr_5rem] gap-4 items-center px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Title</span>
          <span className="flex justify-end">
            <Clock size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </span>
        </div>
        <div className="py-2">
          {ALBUM_TRACKS.map((track, i) => (
            <TrackRow key={track.id} index={i + 1} track={track} showAlbum={false} />
          ))}
        </div>
      </div>

      {/* Artist card */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center font-display font-bold text-2xl"
          style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.1)' }}
        >
          T
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Artist</p>
          <Link href="/artist/the-weeknd" className="font-display font-semibold text-lg transition-vw hover:opacity-80" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.2px' }}>
            The Weeknd
          </Link>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>38.2M monthly listeners</p>
        </div>
        <Link
          href="/artist/the-weeknd"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          View Artist <ExternalLink size={13} />
        </Link>
      </div>

      {/* More from artist */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          More from The Weeknd
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {MORE_FROM_ARTIST.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="album" />
          ))}
        </div>
      </section>

    </div>
  )
}
