"use client"

import { Play, Heart, UserPlus, MoreHorizontal } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { SAMPLE_TRACKS, usePlayerStore } from '@/lib/player-store'

const ARTIST_ALBUMS = [
  { id: 'aa1', title: 'After Hours', subtitle: '2020 · 14 songs', href: '/album/after-hours' },
  { id: 'aa2', title: 'Starboy', subtitle: '2016 · 18 songs', href: '/album/starboy' },
  { id: 'aa3', title: 'Beauty Behind the Madness', subtitle: '2015 · 14 songs', href: '/album/beauty' },
  { id: 'aa4', title: 'Dawn FM', subtitle: '2022 · 16 songs', href: '/album/dawn-fm' },
]

const RELATED_ARTISTS = [
  { id: 'ra1', title: 'Drake', subtitle: 'Artist', href: '/artist/drake' },
  { id: 'ra2', title: 'Nav', subtitle: 'Artist', href: '/artist/nav' },
  { id: 'ra3', title: 'Travis Scott', subtitle: 'Artist', href: '/artist/travis-scott' },
  { id: 'ra4', title: 'Post Malone', subtitle: 'Artist', href: '/artist/post-malone' },
]

function slugToName(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function ArtistPage({ slug }: { slug: string }) {
  const name = slugToName(slug)
  const { setTrack } = usePlayerStore()

  return (
    <div className="space-y-12">

      {/* Hero banner */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 280 }}
      >
        {/* Atmospheric background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #2A1F3D 0%, #170F23 60%, rgba(155,77,224,0.2) 100%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 30% 50%, rgba(155,77,224,0.35), transparent 70%)', pointerEvents: 'none' }}
          aria-hidden="true"
        />

        <div className="relative flex items-end h-full p-8 gap-6">
          <div
            className="w-28 h-28 rounded-full shrink-0 flex items-center justify-center font-display font-bold text-4xl"
            style={{
              background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
              color: 'rgba(255,255,255,0.75)',
              border: '3px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Verified Artist</p>
            <h1
              className="font-display font-bold leading-display mb-2"
              style={{ fontSize: 52, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
            >
              {name}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              38.2M monthly listeners
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTrack(SAMPLE_TRACKS[0])}
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
          <UserPlus size={15} />
          Follow
        </button>
        <button className="p-3 rounded-lg transition-vw hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Popular tracks */}
      <section>
        <h2 className="font-display font-semibold mb-5" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          Popular
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="py-2">
            {SAMPLE_TRACKS.map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
            ))}
          </div>
        </div>
      </section>

      {/* Discography */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          Discography
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {ARTIST_ALBUMS.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="album" />
          ))}
        </div>
      </section>

      {/* Related artists */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
          Fans Also Like
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {RELATED_ARTISTS.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="artist" />
          ))}
        </div>
      </section>

    </div>
  )
}
