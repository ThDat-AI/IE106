"use client"

import { useState } from 'react'
import { Search, History, Play, Shuffle, Music2, Clock } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import { usePlayerStore } from '@/lib/player-store'
import {
  PageHero,
  AccentBar,
  GlassPanel,
  AmbientOrbs,
} from '@/components/ui/vibewave'
import { cn } from '@/lib/utils'

// Time grouping helpers
function getTimeGroup(playedAtStr?: string, index?: number): string {
  if (!playedAtStr) {
    const idx = index ?? 0;
    if (idx < 3) return 'Hôm nay'
    if (idx < 6) return 'Hôm qua'
    if (idx < 11) return '7 ngày qua'
    return 'Trước đó'
  }

  const playedAt = new Date(playedAtStr);
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const playedDate = new Date(playedAt.getFullYear(), playedAt.getMonth(), playedAt.getDate());
  
  if (playedDate.getTime() === today.getTime()) {
    return 'Hôm nay';
  } else if (playedDate.getTime() === yesterday.getTime()) {
    return 'Hôm qua';
  }
  
  const diffTime = today.getTime() - playedDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 2 && diffDays <= 8) {
    return '7 ngày qua';
  }
  
  return 'Trước đó';
}

const GROUP_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'Hôm nay':     { text: '#3ABEF9', bg: 'rgba(58,190,249,0.08)', border: 'rgba(58,190,249,0.2)' },
  'Hôm qua':     { text: '#05D69E', bg: 'rgba(5,214,158,0.08)',  border: 'rgba(5,214,158,0.2)' },
  '7 ngày qua':  { text: '#FF708A', bg: 'rgba(255,112,138,0.08)',  border: 'rgba(255,112,138,0.25)'  },
  'Trước đó':    { text: '#FACC15', bg: 'rgba(250,204,21,0.08)',  border: 'rgba(250,204,21,0.2)'  },
  'Kết quả tìm kiếm': { text: '#FF8A08', bg: 'rgba(255,138,8,0.08)', border: 'rgba(255,138,8,0.2)' },
}

const GROUP_LABELS: Record<string, { vi: string; en: string }> = {
  'Hôm nay':     { vi: 'Hôm nay', en: 'Today' },
  'Hôm qua':     { vi: 'Hôm qua', en: 'Yesterday' },
  '7 ngày qua':  { vi: '7 ngày qua', en: 'Last 7 Days' },
  'Trước đó':    { vi: 'Trước đó', en: 'Before That' },
  'Kết quả tìm kiếm': { vi: 'Kết quả tìm kiếm', en: 'Search Results' },
}

const getGroupVariant = (group: string) => {
  switch (group) {
    case 'Hôm nay': return 'blue'
    case 'Hôm qua': return 'green'
    case '7 ngày qua': return 'red'
    case 'Trước đó': return 'yellow'
    default: return 'purple'
  }
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function RecentlyPlayedPage({ 
  initialTracks = [] 
  }: { 
    initialTracks?: Track[] 
  }) {
  const { t, language } = useTranslation()
  const { setTrack, setQueue, isShuffle } = usePlayerStore()
  const [searchQ, setSearchQ] = useState('')

  const filtered = initialTracks.filter(track =>
    track.title.toLowerCase().includes(searchQ.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQ.toLowerCase()) ||
    track.album?.toLowerCase().includes(searchQ.toLowerCase())
  )

  // Group tracks by time
  type GroupEntry = { group: string; tracks: Array<{ track: Track; originalIndex: number }> }
  const groups: GroupEntry[] = []

  if (searchQ) {
    const resultsGroup: GroupEntry = { group: 'Kết quả tìm kiếm', tracks: [] }
    filtered.forEach((track, i) => {
      resultsGroup.tracks.push({ track, originalIndex: i })
    })
    if (resultsGroup.tracks.length > 0) {
      groups.push(resultsGroup)
    }
  } else {
    const sections: Record<string, Array<{ track: Track; originalIndex: number }>> = {
      'Hôm nay': [],
      'Hôm qua': [],
      '7 ngày qua': [],
      'Trước đó': [],
    }

    filtered.forEach((track, i) => {
      const group = getTimeGroup(track.playedAt, i)
      if (sections[group]) {
        sections[group].push({ track, originalIndex: i })
      } else {
        sections['Trước đó'].push({ track, originalIndex: i })
      }
    })

    // Only add groups that have tracks in their designated order
    const groupOrder = ['Hôm nay', 'Hôm qua', '7 ngày qua', 'Trước đó']
    groupOrder.forEach(key => {
      if (sections[key].length > 0) {
        groups.push({ group: key, tracks: sections[key] })
      }
    })
  }

  return (
    <div className="space-y-10 relative">
      {/* Ambient background orbs */}
      <AmbientOrbs position="fixed" />

      {/* ── Hero Header ── */}
      <section className="relative">
        <PageHero
          eyebrowIcon={<History size={13} />}
          eyebrowLabel={t.recentlyPlayed}
          title={t.recentlyPlayed}
          subtitle={language === 'vi' ? `${initialTracks.length} bài hát bạn đã nghe` : `${initialTracks.length} songs you've listened to`}
          gradientClass="from-white to-white"
          titleColor="#FFFFFF"
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
                  if (filtered.length > 0) {
                    if (isShuffle) {
                      usePlayerStore.setState({ isShuffle: false })
                    } else {
                      usePlayerStore.setState({ isShuffle: true })
                      const shuffled = [...filtered].sort(() => Math.random() - 0.5)
                      setQueue(shuffled)
                      setTrack(shuffled[0])
                    }
                  }
                }}
                aria-label="Shuffle recently played"
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
                  if (filtered.length > 0) {
                    setQueue(filtered)
                    setTrack(filtered[0])
                  }
                }}
                aria-label="Play all recently played songs"
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
            id="recently-played-search"
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
              e.currentTarget.style.borderColor = 'rgba(58,190,249,0.5)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(58,190,249,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>
      </section>

      {/* ── Time-grouped Track Sections ── */}
      {filtered.length === 0 ? (
        <section>
          <GlassPanel variant="dark">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(58,190,249,0.1)', border: '1px solid rgba(58,190,249,0.2)' }}
              >
                <Music2 size={28} style={{ color: 'rgba(58,190,249,0.6)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {searchQ ? `${t.noResults} "${searchQ}"` : (language === 'vi' ? 'Chưa có bài hát nào trong lịch sử' : 'No tracks in your listening history')}
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {searchQ ? (language === 'vi' ? 'Thử từ khóa khác' : 'Try another keyword') : (language === 'vi' ? 'Bắt đầu nghe để xây dựng lịch sử của bạn' : 'Start listening to build your history')}
                </p>
              </div>
            </div>
          </GlassPanel>
        </section>
      ) : (
        <div className="space-y-16">
          {groups.map(({ group, tracks }) => {
            const gc = GROUP_COLORS[group] ?? GROUP_COLORS['Trước đó']
            const displayLabel = GROUP_LABELS[group] ? (language === 'vi' ? GROUP_LABELS[group].vi : GROUP_LABELS[group].en) : group
            return (
              <section key={group}>
                {/* Group heading */}
                <div className="flex items-center gap-3 mb-4">
                  <AccentBar height={6} color={
                    group === 'Hôm nay' ? 'blue' :
                    group === 'Hôm qua' ? 'green' :
                    group === '7 ngày qua' ? 'red' :
                    group === 'Trước đó' ? 'yellow' : 'indigo'
                  } />
                  <h2
                    className="font-display font-semibold"
                    style={{ fontSize: 18, color: gc.text, letterSpacing: '-0.3px' }}
                  >
                    {displayLabel}
                  </h2>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
                    style={{ backgroundColor: gc.bg, color: '#FFFFFF', border: `1px solid ${gc.border}` }}
                  >
                    {tracks.length} {language === 'vi' ? 'bài' : 'tracks'}
                  </span>
                </div>

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
                    {tracks.map(({ track, originalIndex }) => (
                      <TrackRow
                        key={track.id}
                        index={originalIndex + 1}
                        track={track}
                        showAlbum
                        variant={getGroupVariant(group) as any}
                      />
                    ))}
                  </div>
                </GlassPanel>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
