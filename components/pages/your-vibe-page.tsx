"use client"

import { Sparkles, RefreshCw, Play, ChevronRight } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { SAMPLE_TRACKS } from '@/lib/player-store'
import Link from 'next/link'

const MOODS = [
  { label: 'Focus', color: '#9B4DE0', active: true },
  { label: 'Energize', color: '#6b3ab5', active: false },
  { label: 'Relax', color: '#4a2a7a', active: false },
  { label: 'Sleep', color: '#3d1f5c', active: false },
  { label: 'Party', color: '#7a3dc8', active: false },
]

const AI_MIXES = [
  { id: 'am1', title: 'Your Daily Mix 1', subtitle: 'The Weeknd · Drake · Nav', href: '/playlist/daily-mix-1' },
  { id: 'am2', title: 'Focus Flow', subtitle: 'Hans Zimmer · Ludovico · Max Richter', href: '/playlist/focus-flow' },
  { id: 'am3', title: 'Late Night Feels', subtitle: 'Frank Ocean · SZA · Daniel Caesar', href: '/playlist/late-night-feels' },
  { id: 'am4', title: 'Workout Boost', subtitle: 'Eminem · Kanye · Jay-Z', href: '/playlist/workout-boost' },
  { id: 'am5', title: 'Sunday Morning', subtitle: 'John Mayer · Jack Johnson · Ben Harper', href: '/playlist/sunday-morning' },
]

const RECENTLY_DISCOVERED = [
  { id: 'rd1', title: 'Midnight Rain', subtitle: 'Taylor Swift', href: '/track/midnight-rain' },
  { id: 'rd2', title: 'Creepin\'', subtitle: 'Metro Boomin & The Weeknd', href: '/track/creepin' },
  { id: 'rd3', title: 'Lift Me Up', subtitle: 'Rihanna', href: '/track/lift-me-up' },
  { id: 'rd4', title: 'Sun to Me', subtitle: 'Zach Bryan', href: '/track/sun-to-me' },
]

const TOP_ARTISTS = [
  { id: 'ta1', title: 'The Weeknd', subtitle: '47 plays this month', href: '/artist/the-weeknd' },
  { id: 'ta2', title: 'Dua Lipa', subtitle: '38 plays this month', href: '/artist/dua-lipa' },
  { id: 'ta3', title: 'Drake', subtitle: '31 plays this month', href: '/artist/drake' },
  { id: 'ta4', title: 'Olivia Rodrigo', subtitle: '28 plays this month', href: '/artist/olivia-rodrigo' },
]

export default function YourVibePage() {
  return (
    <div className="space-y-16">

      {/* Hero */}
      <section>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} style={{ color: '#9B4DE0' }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{ backgroundColor: 'rgba(155,77,224,0.15)', color: '#9B4DE0' }}
              >
                AI Powered
              </span>
            </div>
            <h1
              className="font-display font-bold leading-display mb-4"
              style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
            >
              Your Vibe
            </h1>
            <p className="text-base max-w-lg" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              Personalized music experiences crafted by AI — based on your listening habits, time of day, and mood.
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
            style={{ backgroundColor: 'rgba(155,77,224,0.12)', color: '#9B4DE0', border: '1px solid rgba(155,77,224,0.25)' }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Mood selector */}
        <div className="flex items-center gap-3 mt-8">
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Mood:</span>
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
              style={{
                backgroundColor: mood.active ? 'rgba(155,77,224,0.15)' : 'rgba(255,255,255,0.05)',
                border: mood.active ? '1px solid rgba(155,77,224,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: mood.active ? '#9B4DE0' : 'rgba(255,255,255,0.6)',
              }}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured AI Mix */}
      <section>
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            backgroundColor: '#1F162E',
            border: '1px solid rgba(155,77,224,0.2)',
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(155,77,224,0.4), transparent 70%)', pointerEvents: 'none' }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-8">
            <div
              className="w-32 h-32 rounded-2xl shrink-0 flex items-center justify-center text-4xl font-display font-bold"
              style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)' }}
            >
              D
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9B4DE0' }}>
                Your Top Pick Today
              </span>
              <h2 className="font-display font-bold mt-1 mb-2" style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
                Daily Mix 1
              </h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                The Weeknd, Drake, Nav, 21 Savage &amp; more · 25 songs
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
                  style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
                >
                  <Play size={15} fill="white" />
                  Play Now
                </button>
                <Link
                  href="/playlist/daily-mix-1"
                  className="flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  View Playlist <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Mixes grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold" style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
            Your AI Mixes
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {AI_MIXES.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="playlist" />
          ))}
        </div>
      </section>

      {/* Recently Discovered + Top Artists row */}
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            Recently Discovered
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {RECENTLY_DISCOVERED.map((item) => (
              <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="track" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            Your Top Artists
          </h2>
          <div className="space-y-3">
            {TOP_ARTISTS.map((artist, i) => (
              <Link
                key={artist.id}
                href={artist.href}
                className="flex items-center gap-4 p-3 rounded-xl transition-vw hover:bg-white/[0.03]"
                style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="font-display font-bold text-xl w-6 text-center shrink-0" style={{ color: i === 0 ? '#9B4DE0' : 'rgba(255,255,255,0.25)' }}>
                  {i + 1}
                </span>
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.1)' }}
                >
                  {artist.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{artist.title}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{artist.subtitle}</p>
                </div>
                <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Listening stats */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
          This Month
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Hours Listened', value: '48h', sub: '+12% vs last month' },
            { label: 'Songs Played', value: '312', sub: '62 unique artists' },
            { label: 'Liked Songs', value: '243', sub: '18 added this month' },
            { label: 'Playlists', value: '7', sub: '2 created recently' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl"
              style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
              <p className="font-display font-bold" style={{ fontSize: 36, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.8px', lineHeight: 1 }}>{stat.value}</p>
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
