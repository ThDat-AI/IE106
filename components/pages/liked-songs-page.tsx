"use client"

import { useState, useEffect } from 'react'
import { Search, Clock, Heart, Shuffle, Play, MoreHorizontal, Music2 } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { type Track, getLikedTracks, toggleLikeTrack, usePlayerStore, isTrackLiked } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  PageHero,
  AccentBar,
  GlassPanel,
  AmbientOrbs,
} from '@/components/ui/vibewave'
import { cn } from '@/lib/utils'

export default function LikedSongsPage({ 
  initialTracks = [] 
  }: { 
    initialTracks?: Track[] 
  }) {
  const { t, language } = useTranslation()
  const { setTrack, setQueue, isShuffle } = usePlayerStore()
  const [searchQ, setSearchQ] = useState('')
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [isShuffled, setIsShuffled] = useState(false)

  useEffect(() => {
    // Initial load from localStorage
    setTracks(getLikedTracks())

    const handleLikesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ trackId: string; isLiked: boolean }>
      if (customEvent.detail) {
        const { trackId, isLiked } = customEvent.detail
        if (isLiked) {
          // Add the newly liked song to the list
          const currentLiked = getLikedTracks()
          const found = currentLiked.find(t => t.id === trackId)
          if (found) {
            setTracks(prev => {
              if (prev.some(t => t.id === trackId)) return prev
              return [found, ...prev]
            })
          }
        }
        // If isLiked is false, we DO NOT remove it immediately to prevent jarring UI shifts
        // (as per the user's request). The TrackRow itself will handle visual heart toggle.
      }
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
          gradientClass="!text-white"
          titleColor="#ffffff"
          subtitleColor="rgba(255, 255, 255, 0.85)"
          action={
            /* Controls row */
            <div className="flex items-center gap-3">
              {/* Shuffle button */}
              <button
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm shrink-0",
                  isShuffle 
                    ? "text-[#9B4DE0] bg-[#9B4DE0]/10 border border-[#9B4DE0]/30 shadow-[0_0_12px_rgba(155,77,224,0.15)] scale-[0.98]" 
                    : "text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                )}
                onClick={() => {
                  const activeFiltered = filtered.filter(t => isTrackLiked(t.id))
                  if (activeFiltered.length > 0) {
                    if (isShuffle) {
                      usePlayerStore.setState({ isShuffle: false })
                    } else {
                      usePlayerStore.setState({ isShuffle: true })
                      const shuffled = [...activeFiltered].sort(() => Math.random() - 0.5)
                      setQueue(shuffled)
                      setTrack(shuffled[0])
                    }
                  }
                }}
                aria-label="Shuffle liked songs"
              >
                <Shuffle size={18} />
                {isShuffle && (
                  <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9B4DE0] shadow-[0_0_8px_rgba(155,77,224,0.6)] animate-in scale-in duration-300" />
                )}
              </button>

              {/* Play all button */}
              <button
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)' }}
                onClick={() => {
                  const activeFiltered = filtered.filter(t => isTrackLiked(t.id))
                  if (activeFiltered.length > 0) {
                    setQueue(activeFiltered)
                    setTrack(activeFiltered[0])
                  }
                }}
                aria-label="Play all liked songs"
              >
                <Play size={20} fill="white" className="text-white" />
                <span>{language === 'vi' ? 'Phát tất cả' : 'Play All'}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
              width: 420,
              maxWidth: '100%',
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

        <GlassPanel variant="dark" className="vw-playlist-table">
          {/* Table header */}
          <div
            className="flex items-center gap-4 px-3 pb-2 pt-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-6 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'var(--vw-text-muted)' }}>#</span>
            </div>
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <div className="w-10 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.titleLabel}</span>
            </div>
            <div className="hidden md:block w-40 shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.albumLabel}</span>
            </div>
            <div className="w-20 flex justify-end shrink-0 pr-4">
              <Clock size={14} style={{ color: 'var(--vw-text-muted)' }} />
            </div>
          </div>

          {/* Track rows */}
          <div className="py-2">
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
                <TrackRow key={track.id} index={index + 1} track={track} showAlbum variant="rose" />
              ))
            )}
          </div>
        </GlassPanel>
      </section>
    </div>
  )
}
