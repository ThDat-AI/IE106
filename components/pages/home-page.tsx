"use client"

import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, SAMPLE_TRACKS, type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import { useState, useEffect } from 'react'
import { searchMusic, searchAlbums } from '@/lib/music-api'
import {
  SectionHeader,
  AiBadge,
  FilterPills,
  GlassMusicCard,
  PodiumCard,
} from '@/components/ui/vibewave'

const GENRE_LABELS = ['Tất cả', 'Pop', 'Hip-hop', 'EDM', 'Tập trung', 'Thư giãn']

export default function HomePage({
  initialTrending = [],
  initialQuickPicks = [],
  initialTopAlbums = []
}: {
  initialTrending?: Track[],
  initialQuickPicks?: Track[],
  initialTopAlbums?: any[]
}) {
  const { t } = useTranslation()
  const [trending, setTrending] = useState<Track[]>(initialTrending)
  const [quickPicks, setQuickPicks] = useState<Track[]>(initialQuickPicks.length > 0 ? initialQuickPicks : SAMPLE_TRACKS)
  const [continueListening, setContinueListening] = useState<any[]>([])
  const [madeForYou, setMadeForYou] = useState<any[]>([])
  const [topAlbums, setTopAlbums] = useState<any[]>(initialTopAlbums)
  const [activeGenre, setActiveGenre] = useState('Tất cả')

  useEffect(() => {
    async function loadMusic() {
      if (trending.length === 0) {
        const trendingData = await searchMusic('Sơn Tùng M-TP', 4)
        if (trendingData.length > 0) setTrending(trendingData)
      }

      if (initialQuickPicks.length === 0) {
        const picksData = await searchMusic('V-Pop Hits 2024', 10)
        if (picksData.length > 0) setQuickPicks(picksData)
      }

      if (topAlbums.length === 0) {
        const albumSearchTerms = ['Hoàng Thùy Linh', 'Đen Vâu', 'Vũ.', 'Mỹ Tâm', 'Sơn Tùng M-TP']
        const randomTerm = albumSearchTerms[Math.floor(Math.random() * albumSearchTerms.length)]
        const albumsData = await searchAlbums(randomTerm, 6)
        setTopAlbums(albumsData)
      }

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
            color: 'var(--vw-text-primary)',
            letterSpacing: '-1.2px',
            lineHeight: 0.96,
          }}
        >
          {greeting}
        </h1>
        <p className="mt-4 text-base" style={{ color: 'var(--vw-text-secondary)', lineHeight: 1.5 }}>
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

      {/* Top Albums Section */}
      <section aria-labelledby="top-albums-heading">
        <SectionHeader title={t.albums} href="/library?tab=albums" />
        <div className="grid grid-cols-6 gap-4">
          {topAlbums.map((album) => (
            <MusicCard
              key={album.id}
              id={album.id}
              title={album.title}
              subtitle={album.artist}
              image={album.albumArt}
              href={`/album/${album.id}`}
              type="album"
            />
          ))}
        </div>
      </section>

      {/* Made For You — AI section with glassmorphism cards */}
      <section aria-labelledby="made-for-you-heading">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="mb-1">
              <AiBadge label={t.aiPowered} />
            </div>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 28, color: 'var(--vw-text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
            >
              {t.madeForYou}
            </h2>
          </div>
          <a
            href="/your-vibe"
            className="flex items-center gap-1 text-sm font-medium transition-vw hover:opacity-80"
            style={{ color: 'var(--vw-text-muted)' }}
          >
            {t.yourVibe}
          </a>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {madeForYou.map((item, i) => (
            <GlassMusicCard
              key={item.id}
              track={item.track}
              rankIndex={i}
            />
          ))}
        </div>
      </section>

      {/* Quick Picks — track list */}
      <section aria-labelledby="quick-picks-heading">
        <SectionHeader title={t.yourVibe} href="/your-vibe" />

        {/* Filter Labels */}
        <div className="mb-6">
          <FilterPills
            categories={GENRE_LABELS}
            active={activeGenre}
            onSelect={setActiveGenre}
          />
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--vw-surface)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header row */}
          <div
            className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_10rem_auto] items-center gap-4 px-3 pb-2 pt-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'var(--vw-text-muted)' }}>#</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.titleLabel}</span>
            <span className="hidden md:block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.albumLabel}</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.durationLabel}</span>
          </div>
          <div className="py-2">
            {quickPicks.map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
            ))}
          </div>
        </div>
      </section>

      {/* Trending — Podium-style cards matching Charts Top 3 */}
      <section aria-labelledby="trending-heading">
        <SectionHeader title={t.trendingNow} href="/charts" />
        <div className="grid grid-cols-4 gap-4">
          {trending.map((item, i) => (
            <PodiumCard key={item.id} track={item} index={i} />
          ))}
        </div>
      </section>

    </div>
  )
}
