"use client"

import { Play, ChevronRight } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, SAMPLE_TRACKS, type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { searchMusic } from '@/lib/music-api'

function SectionHeader({ title, href }: { title: string; href?: string }) {
  const { t } = useTranslation()
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
          {t.seeAll} <ChevronRight size={14} />
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const { setTrack } = usePlayerStore()
  const [trending, setTrending] = useState<Track[]>([])
  const [quickPicks, setQuickPicks] = useState<Track[]>(SAMPLE_TRACKS)
  const [continueListening, setContinueListening] = useState<any[]>([])
  const [madeForYou, setMadeForYou] = useState<any[]>([])

  useEffect(() => {
    // Fetch real music on mount
    async function loadMusic() {
      // Trending: Sơn Tùng M-TP & J97
      const trendingData = await searchMusic('Sơn Tùng M-TP', 4)
      if (trendingData.length > 0) setTrending(trendingData)

      // Quick Picks: A mix of requested top Vietnamese artists
      const picksData = await searchMusic('V-Pop Hits 2024', 10)
      if (picksData.length > 0) setQuickPicks(picksData)

      // Continue Listening: Focus on specific requested artists
      const artists = ['Đen Vâu', 'Hoàng Thùy Linh', 'Lyly', 'Phùng Khánh Linh', 'Vũ.', 'Jack - J97']
      const randomArtist = artists[Math.floor(Math.random() * artists.length)]
      const continueData = await searchMusic(randomArtist, 6)
      setContinueListening(continueData.map(t => ({
        id: t.id,
        title: t.title,
        subtitle: t.artist,
        type: 'track',
        track: t
      })))

      // Made For You: Indie Việt (Vũ., Phùng Khánh Linh)
      const madeData = await searchMusic('Indie Việt', 5)
      setMadeForYou(madeData.map(t => ({
        id: t.id,
        title: t.title,
        subtitle: t.artist,
        type: 'track',
        track: t
      })))
    }
    loadMusic()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return t.goodMorning
    if (h < 18) return t.goodAfternoon
    return t.goodEvening
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
          {t.heroSub}
        </p>
      </section>

      {/* Continue Listening — highest priority */}
      <section aria-labelledby="continue-listening-heading">
        <SectionHeader title={t.continueListening} href="/library/recent" />
        <div className="grid grid-cols-6 gap-4">
          {continueListening.map((item) => (
            <MusicCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              type={item.type}
              track={item.track}
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
                {t.aiPowered}
              </span>
            </div>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
            >
              {t.madeForYou}
            </h2>
          </div>
          <Link
            href="/your-vibe"
            className="flex items-center gap-1 text-sm font-medium transition-vw hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {t.yourVibe} <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {madeForYou.map((item) => (
            <MusicCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              type={item.type}
              track={item.track}
            />
          ))}
        </div>
      </section>

      {/* Quick Picks — track list */}
      <section aria-labelledby="quick-picks-heading">
        <SectionHeader title={t.quickPicks} />
        
        {/* Filter Labels */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['Tất cả', 'Pop', 'Hip-hop', 'EDM', 'Tập trung', 'Thư giãn'].map((label) => (
            <button
              key={label}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-vw hover:opacity-80 whitespace-nowrap"
              style={{
                backgroundColor: label === 'Tất cả' ? 'rgba(155,77,224,0.15)' : 'rgba(255,255,255,0.05)',
                border: label === 'Tất cả' ? '1px solid rgba(155,77,224,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: label === 'Tất cả' ? '#9B4DE0' : 'rgba(255,255,255,0.6)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
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
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{t.titleLabel}</span>
            <span className="hidden md:block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{t.albumLabel}</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{t.durationLabel}</span>
          </div>
          <div className="py-2">
            {quickPicks.map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
            ))}
          </div>
        </div>
      </section>

      {/* Trending — lowest visual emphasis */}
      <section aria-labelledby="trending-heading">
        <SectionHeader title={t.trendingNow} href="/charts" />
        <div className="grid grid-cols-4 gap-4">
          {trending.map((item, i) => (
            <div
              key={item.id}
              onClick={() => setTrack(item)}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-vw hover:bg-white/[0.03] cursor-pointer group"
              style={{
                backgroundColor: '#1F162E',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="font-sans font-bold text-5xl w-12 text-right shrink-0"
                style={{
                  color: i <= 3 ? '#170F23' : 'rgba(255,255,255,0.05)',
                  textShadow: i === 0 
                    ? '-1px -1px 0 #3ABEF9, 1px -1px 0 #3ABEF9, -1px 1px 0 #3ABEF9, 1px 1px 0 #3ABEF9'
                    : i === 1
                    ? '-1px -1px 0 #05D69E, 1px -1px 0 #05D69E, -1px 1px 0 #05D69E, 1px 1px 0 #05D69E'
                    : i === 2
                    ? '-1px -1px 0 #F73859, 1px -1px 0 #F73859, -1px 1px 0 #F73859, 1px 1px 0 #F73859'
                    : i === 3
                    ? '-1px -1px 0 #FACC15, 1px -1px 0 #FACC15, -1px 1px 0 #FACC15, 1px 1px 0 #FACC15'
                    : 'none',
                  letterSpacing: '0',
                }}
              >
                {i + 1}
              </span>
              <img
                src={item.albumArt}
                alt={item.title}
                className="w-10 h-10 rounded-lg shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.title}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.artist}</p>
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
