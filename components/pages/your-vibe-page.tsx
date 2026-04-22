"use client"

import { Sparkles, RefreshCw, Play, ChevronRight, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { SAMPLE_TRACKS, type Track } from '@/lib/player-store'
import { searchMusic, searchArtistImage } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import Link from 'next/link'

export default function YourVibePage() {
  const { t } = useTranslation()
  const [mixes, setMixes] = useState<Track[]>([])
  const [discovered, setDiscovered] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const MOODS = [
    { label: 'Focus', color: '#9B4DE0', active: true },
    { label: 'Energize', color: '#6b3ab5', active: false },
    { label: 'Relax', color: '#4a2a7a', active: false },
    { label: 'Sleep', color: '#3d1f5c', active: false },
    { label: 'Party', color: '#7a3dc8', active: false },
  ]

  const INITIAL_ARTISTS = [
    { id: 'ta1', title: 'Sơn Tùng M-TP', subtitle: `47 ${t.playsThisMonth}`, href: '/artist/son-tung-mtp', image: '' },
    { id: 'ta2', title: 'Hoàng Thùy Linh', subtitle: `38 ${t.playsThisMonth}`, href: '/artist/hoang-thuy-linh', image: '' },
    { id: 'ta3', title: 'Đen Vâu', subtitle: `31 ${t.playsThisMonth}`, href: '/artist/den', image: '' },
    { id: 'ta4', title: 'GREY D', subtitle: `28 ${t.playsThisMonth}`, href: '/artist/grey-d', image: '' },
  ]

  const [topArtists, setTopArtists] = useState(INITIAL_ARTISTS)

  async function fetchData() {
    setIsLoading(true)
    try {
      const [mixData, discoveredData, ...artistImages] = await Promise.all([
        searchMusic('V-Pop Hits', 5),
        searchMusic('Nhạc trẻ mới nhất', 4),
        ...INITIAL_ARTISTS.map(a => searchArtistImage(a.title))
      ])
      
      setMixes(mixData)
      setDiscovered(discoveredData)
      setTopArtists(INITIAL_ARTISTS.map((a, i) => ({
        ...a,
        image: artistImages[i]
      })))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
                {t.aiPowered}
              </span>
            </div>
            <h1
              className="font-display font-bold leading-display mb-4"
              style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
            >
              {t.yourVibe}
            </h1>
            <p className="text-base max-w-lg" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              {t.yourVibeSub}
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-vw hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: 'rgba(155,77,224,0.12)', color: '#9B4DE0', border: '1px solid rgba(155,77,224,0.25)' }}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {t.refresh}
          </button>
        </div>

        {/* Mood selector */}
        <div className="flex items-center gap-3 mt-8">
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.mood}:</span>
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
            <div className="shrink-0">
              {mixes[0] ? (
                <img 
                  src={mixes[0].albumArt} 
                  alt="Daily Mix" 
                  className="w-32 h-32 rounded-2xl object-cover shadow-2xl shadow-purple-500/20"
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-display font-bold"
                  style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)' }}
                >
                  D
                </div>
              )}
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9B4DE0' }}>
                {t.topPickToday}
              </span>
              <h2 className="font-display font-bold mt-1 mb-2" style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
                V-Pop Daily Mix
              </h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {mixes[0]?.artist || '...'} &amp; các nghệ sĩ V-Pop hàng đầu · {isLoading ? '...' : '25'} bài hát
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
                  style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
                >
                  <Play size={15} fill="white" />
                  {t.listenNow}
                </button>
                <Link
                  href="/playlist/daily-mix-1"
                  className="flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {t.viewPlaylist} <ChevronRight size={14} />
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
            {t.collectionsForYou}
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))
          ) : (
            mixes.map((track) => (
              <MusicCard 
                key={track.id} 
                id={track.id} 
                title={track.title} 
                subtitle={track.artist} 
                track={track}
                type="track" 
              />
            ))
          )}
        </div>
      </section>

      {/* Recently Discovered + Top Artists row */}
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            {t.recentlyDiscovered}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
              ))
            ) : (
              discovered.map((track) => (
                <MusicCard 
                  key={track.id} 
                  id={track.id} 
                  title={track.title} 
                  subtitle={track.artist} 
                  track={track}
                  type="track" 
                />
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            {t.topArtists}
          </h2>
          <div className="space-y-3">
            {topArtists.map((artist, i) => (
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
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.1)' }}
                >
                  {artist.image ? (
                    <img src={artist.image} alt={artist.title} className="w-full h-full object-cover" />
                  ) : (
                    artist.title.charAt(0)
                  )}
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
          {t.monthlyStats}
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t.hoursListened, value: '48h', sub: `+12% ${t.thanLastMonth}` },
            { label: t.tracksPlayed, value: '312', sub: `${t.fromDifferentArtists.replace('artists', '62 nghệ sĩ')}` },
            { label: t.favoriteTracks, value: '243', sub: `${t.addedThisMonth.replace('month', '18 bài mới tháng này')}` },
            { label: t.playlistsCreated, value: '7', sub: `2 ${t.newlyCreated}` },
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
