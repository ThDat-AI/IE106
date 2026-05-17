"use client"

import { useState, useEffect } from 'react'
import { Search, Clock, Heart, Shuffle, Play, MoreHorizontal, Music2 } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { type Track, getLikedTracks, toggleLikeTrack, usePlayerStore } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  PageHero,
  AccentBar,
  GlassPanel,
  AmbientOrbs,
} from '@/components/ui/vibewave'

export default function LikedSongsPage({ 
  initialTracks = [] 
}: { 
  initialTracks?: Track[] 
}) {
  const { t } = useTranslation()
  const { setTrack } = usePlayerStore()
  const [searchQ, setSearchQ] = useState('')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>(initialTracks)

  useEffect(() => {
    // Initial load from localStorage
    setTracks(getLikedTracks())

    const handleLikesUpdated = () => {
      setTracks(getLikedTracks())
    }

    window.addEventListener('vw_likes_updated', handleLikesUpdated)
    return () => window.removeEventListener('vw_likes_updated', handleLikesUpdated)
  }, [])

  const filtered = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQ.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQ.toLowerCase()) ||
    track.album?.toLowerCase().includes(searchQ.toLowerCase())
  )

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-10 relative">
      {/* Ambient background orbs */}
      <AmbientOrbs position="fixed" />

      {/* ── Hero Header ── */}
      <section className="relative">
        <PageHero
          eyebrowIcon={<Heart size={13} />}
          eyebrowLabel={t.likedSongs}
          title={t.likedSongs}
          subtitle={`${tracks.length} ${t.songsSaved}`}
          gradientClass="from-white via-pink-100 to-rose-400"
          action={
            /* Controls row */
            <div className="flex items-center gap-3">
              {/* Shuffle button */}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(244,63,94,0.06) 100%)',
                  border: '1px solid rgba(244,63,94,0.35)',
                  color: '#FB7185',
                  boxShadow: '0 0 16px rgba(244,63,94,0.15)',
                }}
                onClick={() => {
                  const random = filtered[Math.floor(Math.random() * filtered.length)]
                  if (random) setTrack(random)
                }}
                aria-label="Shuffle liked songs"
              >
                <Shuffle size={14} />
                Shuffle
              </button>

              {/* Play all button */}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #9B4DE0 0%, #6B21A8 100%)',
                  color: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 0 20px rgba(155,77,224,0.4)',
                }}
                onClick={() => { if (filtered[0]) setTrack(filtered[0]) }}
                aria-label="Play all liked songs"
              >
                <Play size={14} fill="white" className="ml-0.5" />
                Play All
              </button>
            </div>
          }
        />
      </section>

      {/* ── Search + Stats bar ── */}
      <section className="flex items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          />
          <input
            id="liked-songs-search"
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t.filter}
            className="pl-8 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: 'rgba(35,27,47,0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.85)',
              width: 300,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.5)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244,63,94,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Song count badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            backgroundColor: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.2)',
          }}
        >
          <Heart size={13} style={{ color: '#FB7185' }} />
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {filtered.length}
            {searchQ ? ` / ${tracks.length}` : ''} bài
          </span>
        </div>
      </section>

      {/* ── Tracks Table ── */}
      <section>
        <h2
          className="font-display font-bold flex items-center gap-3 mb-6"
          style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
        >
          <AccentBar height={6} color="pink" />
          {searchQ ? `Kết quả tìm kiếm` : 'Tất cả bài hát'}
        </h2>

        <GlassPanel variant="dark">
          {/* Table header */}
          <div
            className="grid gap-3 px-5 py-3"
            style={{
              gridTemplateColumns: '3rem 1fr 8rem 5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>#</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>{t.titleLabel}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block" style={{ color: 'rgba(255,255,255,0.2)' }}>{t.albumLabel}</span>
            <div className="flex items-center justify-end">
              <Clock size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>

          {/* Track rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}
              >
                <Music2 size={28} style={{ color: 'rgba(244,63,94,0.6)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {searchQ ? `${t.noResults} "${searchQ}"` : 'Chưa có bài hát nào được thích'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {searchQ ? 'Thử từ khóa khác' : 'Khám phá và thêm bài hát yêu thích của bạn'}
                </p>
              </div>
            </div>
          ) : (
            filtered.map((track, index) => (
              <div
                key={track.id}
                className="grid gap-3 px-5 py-3.5 transition-all duration-200 cursor-pointer group/row"
                style={{
                  gridTemplateColumns: '3rem 1fr 8rem 5rem',
                  borderBottom: index < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  backgroundColor: hoveredRow === track.id ? 'rgba(244,63,94,0.06)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredRow(track.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setTrack(track)}
              >
                {/* Rank / Play toggle */}
                <div className="flex items-center justify-center">
                  {hoveredRow === track.id ? (
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, #F43F5E, #9F1239)',
                        boxShadow: '0 0 14px rgba(244,63,94,0.5)',
                      }}
                      aria-label={`Play ${track.title}`}
                    >
                      <Play size={12} fill="white" className="text-white ml-0.5" />
                    </button>
                  ) : (
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Cover + title + artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {track.albumArt ? (
                      <img
                        src={track.albumArt}
                        alt={track.title}
                        className="w-10 h-10 rounded-xl object-cover transition-transform duration-300 group-hover/row:scale-105"
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, #F43F5E33 0%, #16111E 100%)', color: '#FB7185' }}
                      >
                        {track.title.charAt(0)}
                      </div>
                    )}
                    {/* Heart indicator on hover (Interactive) */}
                    <button
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10"
                      style={{
                        backgroundColor: '#F43F5E',
                        opacity: hoveredRow === track.id ? 1 : 0.8,
                        boxShadow: '0 0 8px rgba(244,63,94,0.6)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLikeTrack(track)
                      }}
                      title="Bỏ thích"
                    >
                      <Heart size={9} fill="white" className="text-white" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold truncate transition-colors group-hover/row:text-white"
                      style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs truncate mt-0.5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <p className="text-xs text-right truncate self-center hidden md:block" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {track.album}
                </p>

                {/* Duration + more */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    className="transition-opacity duration-200"
                    style={{ color: 'rgba(255,255,255,0.35)', opacity: hoveredRow === track.id ? 1 : 0 }}
                    aria-label="More options"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  <span className="text-xs tabular-nums shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {formatTime(track.duration)}
                  </span>
                </div>
              </div>
            ))
          )}
        </GlassPanel>
      </section>
    </div>
  )
}
