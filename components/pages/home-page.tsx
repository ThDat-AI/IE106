"use client"

import { Play, ChevronRight } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, SAMPLE_TRACKS } from '@/lib/player-store'
import Link from 'next/link'

const CONTINUE_LISTENING = [
  { id: 'cl1', title: 'Deep Focus', subtitle: 'VibeWave Playlist', type: 'playlist' as const, href: '/playlist/deep-focus' },
  { id: 'cl2', title: 'After Hours', subtitle: 'The Weeknd', type: 'album' as const, href: '/album/after-hours' },
  { id: 'cl3', title: 'Future Nostalgia', subtitle: 'Dua Lipa', type: 'album' as const, href: '/album/future-nostalgia' },
  { id: 'cl4', title: 'Late Night Drive', subtitle: 'Your Playlist', type: 'playlist' as const, href: '/playlist/late-night-drive' },
  { id: 'cl5', title: 'Justice', subtitle: 'Justin Bieber', type: 'album' as const, href: '/album/justice' },
  { id: 'cl6', title: 'SOUR', subtitle: 'Olivia Rodrigo', type: 'album' as const, href: '/album/sour' },
]

const MADE_FOR_YOU = [
  { id: 'mfy1', title: 'Your Daily Mix 1', subtitle: 'The Weeknd, Drake, Nav', type: 'playlist' as const, href: '/playlist/daily-mix-1' },
  { id: 'mfy2', title: 'Chill Vibes', subtitle: 'VibeWave AI Mix', type: 'playlist' as const, href: '/playlist/chill-vibes' },
  { id: 'mfy3', title: 'Focus Flow', subtitle: 'Based on Deep Focus', type: 'playlist' as const, href: '/playlist/focus-flow' },
  { id: 'mfy4', title: 'Late Night Feels', subtitle: 'VibeWave AI Mix', type: 'playlist' as const, href: '/playlist/late-night-feels' },
  { id: 'mfy5', title: 'Morning Energy', subtitle: 'Your Morning Routine', type: 'playlist' as const, href: '/playlist/morning-energy' },
]

const QUICK_PICKS = SAMPLE_TRACKS

const TRENDING = [
  { id: 'tr1', title: 'As It Was', subtitle: 'Harry Styles', type: 'track' as const, href: '/track/as-it-was' },
  { id: 'tr2', title: 'Anti-Hero', subtitle: 'Taylor Swift', type: 'track' as const, href: '/track/anti-hero' },
  { id: 'tr3', title: 'Flowers', subtitle: 'Miley Cyrus', type: 'track' as const, href: '/track/flowers' },
  { id: 'tr4', title: 'Kill Bill', subtitle: 'SZA', type: 'track' as const, href: '/track/kill-bill' },
]

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2
        className="font-display font-semibold"
        style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium transition-vw hover:opacity-80"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          See all <ChevronRight size={14} />
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const { setTrack } = usePlayerStore()

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="space-y-16">

      {/* Hero greeting */}
      <section>
        <h1
          className="font-display font-bold leading-display mb-2"
          style={{
            fontSize: 56,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-1.2px',
            lineHeight: 0.96,
          }}
        >
          {greeting}
        </h1>
        <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
          Pick up where you left off, or discover something new.
        </p>
      </section>

      {/* Continue Listening — highest priority */}
      <section aria-labelledby="continue-listening-heading">
        <SectionHeader title="Continue Listening" href="/library" />
        <div className="grid grid-cols-6 gap-4">
          {CONTINUE_LISTENING.map((item) => (
            <MusicCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              type={item.type}
              href={item.href}
            />
          ))}
        </div>
      </section>

      {/* Made For You — AI section */}
      <section aria-labelledby="made-for-you-heading">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{ backgroundColor: 'rgba(155,77,224,0.15)', color: '#9B4DE0' }}
              >
                AI Powered
              </span>
            </div>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
            >
              Made For You
            </h2>
          </div>
          <Link
            href="/your-vibe"
            className="flex items-center gap-1 text-sm font-medium transition-vw hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Your Vibe <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {MADE_FOR_YOU.map((item) => (
            <MusicCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              type={item.type}
              href={item.href}
            />
          ))}
        </div>
      </section>

      {/* Quick Picks — track list */}
      <section aria-labelledby="quick-picks-heading">
        <SectionHeader title="Quick Picks" />
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#1F162E',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header row */}
          <div
            className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_10rem_auto] items-center gap-4 px-3 pb-2 pt-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Title</span>
            <span className="hidden md:block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Album</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Duration</span>
          </div>
          <div className="py-2">
            {QUICK_PICKS.map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
            ))}
          </div>
        </div>
      </section>

      {/* Trending — lowest visual emphasis */}
      <section aria-labelledby="trending-heading">
        <SectionHeader title="Trending Now" href="/charts" />
        <div className="grid grid-cols-4 gap-4">
          {TRENDING.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-vw hover:bg-white/[0.03] cursor-pointer group"
              style={{
                backgroundColor: '#1F162E',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="font-display font-bold text-2xl w-8 text-right shrink-0"
                style={{
                  color: i === 0 ? '#9B4DE0' : 'rgba(255,255,255,0.2)',
                  letterSpacing: '-0.5px',
                }}
              >
                {i + 1}
              </span>
              <div
                className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-bold"
                style={{
                  background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {item.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.title}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.subtitle}</p>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-vw"
                style={{ backgroundColor: '#9B4DE0' }}
                aria-label={`Play ${item.title}`}
              >
                <Play size={13} fill="white" className="text-white ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
