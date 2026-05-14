"use client"

import { useState } from 'react'
import { Search, Clock, History, Play, Shuffle, MoreHorizontal, Music2, CalendarDays } from 'lucide-react'
import { type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import { usePlayerStore } from '@/lib/player-store'
import {
  PageHero,
  AccentBar,
  GlassPanel,
  AmbientOrbs,
} from '@/components/ui/vibewave'

// Time grouping helpers
function getTimeGroup(index: number): string {
  if (index < 3) return 'Vừa nghe'
  if (index < 8) return 'Hôm nay'
  if (index < 15) return 'Tuần này'
  return 'Trước đó'
}

const GROUP_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'Vừa nghe': { text: '#3ABEF9', bg: 'rgba(58,190,249,0.08)', border: 'rgba(58,190,249,0.2)' },
  'Hôm nay':  { text: '#05D69E', bg: 'rgba(5,214,158,0.08)',  border: 'rgba(5,214,158,0.2)' },
  'Tuần này': { text: '#9B4DE0', bg: 'rgba(155,77,224,0.08)', border: 'rgba(155,77,224,0.2)' },
  'Trước đó': { text: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
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
  const { t } = useTranslation()
  const { setTrack } = usePlayerStore()
  const [searchQ, setSearchQ] = useState('')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const filtered = initialTracks.filter(track =>
    track.title.toLowerCase().includes(searchQ.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQ.toLowerCase()) ||
    track.album?.toLowerCase().includes(searchQ.toLowerCase())
  )

  // Group tracks by time
  type GroupEntry = { group: string; tracks: Array<{ track: Track; originalIndex: number }> }
  const groups: GroupEntry[] = []
  let currentGroup = ''

  filtered.forEach((track, i) => {
    const group = searchQ ? 'Kết quả' : getTimeGroup(i)
    if (group !== currentGroup) {
      currentGroup = group
      groups.push({ group, tracks: [] })
    }
    groups[groups.length - 1].tracks.push({ track, originalIndex: i })
  })

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
          subtitle={t.historySub}
          gradientClass="from-white via-cyan-100 to-sky-400"
          action={
            /* Controls row */
            <div className="flex items-center gap-3">
              {/* Play recent button */}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(58,190,249,0.2) 0%, rgba(58,190,249,0.06) 100%)',
                  border: '1px solid rgba(58,190,249,0.35)',
                  color: '#3ABEF9',
                  boxShadow: '0 0 16px rgba(58,190,249,0.15)',
                }}
                onClick={() => { if (filtered[0]) setTrack(filtered[0]) }}
                aria-label="Play most recent track"
              >
                <Play size={14} fill="#3ABEF9" style={{ color: '#3ABEF9' }} className="ml-0.5" />
                Nghe Lại
              </button>

              {/* Shuffle button */}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #3ABEF9 0%, #0284C7 100%)',
                  color: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 0 20px rgba(58,190,249,0.4)',
                }}
                onClick={() => {
                  const random = filtered[Math.floor(Math.random() * filtered.length)]
                  if (random) setTrack(random)
                }}
                aria-label="Shuffle recently played"
              >
                <Shuffle size={14} />
                Shuffle
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
              width: 300,
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

        {/* Track count badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            backgroundColor: 'rgba(58,190,249,0.08)',
            border: '1px solid rgba(58,190,249,0.2)',
          }}
        >
          <CalendarDays size={13} style={{ color: '#3ABEF9' }} />
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {filtered.length}
            {searchQ ? ` / ${initialTracks.length}` : ''} bài gần đây
          </span>
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
                  {searchQ ? `${t.noResults} "${searchQ}"` : 'Chưa có bài hát nào trong lịch sử'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {searchQ ? 'Thử từ khóa khác' : 'Bắt đầu nghe để xây dựng lịch sử của bạn'}
                </p>
              </div>
            </div>
          </GlassPanel>
        </section>
      ) : (
        groups.map(({ group, tracks }) => {
          const gc = GROUP_COLORS[group] ?? GROUP_COLORS['Trước đó']
          return (
            <section key={group}>
              {/* Group heading */}
              <div className="flex items-center gap-3 mb-4">
                <AccentBar height={6} color={
                  group === 'Vừa nghe' ? 'blue' :
                  group === 'Hôm nay' ? 'green' :
                  group === 'Tuần này' ? 'purple' : 'indigo'
                } />
                <h2
                  className="font-display font-semibold"
                  style={{ fontSize: 18, color: gc.text, letterSpacing: '-0.3px' }}
                >
                  {group}
                </h2>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
                  style={{ backgroundColor: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}
                >
                  {tracks.length} bài
                </span>
              </div>

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
                {tracks.map(({ track, originalIndex }, rowIdx) => (
                  <div
                    key={track.id}
                    className="grid gap-3 px-5 py-3.5 transition-all duration-200 cursor-pointer group/row"
                    style={{
                      gridTemplateColumns: '3rem 1fr 8rem 5rem',
                      borderBottom: rowIdx < tracks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      backgroundColor: hoveredRow === track.id
                        ? `${gc.bg}`
                        : 'transparent',
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
                            background: `linear-gradient(135deg, ${gc.text} 0%, rgba(0,0,0,0.4) 200%)`,
                            boxShadow: `0 0 14px ${gc.border}`,
                            backgroundColor: gc.text,
                          }}
                          aria-label={`Play ${track.title}`}
                        >
                          <Play size={12} fill="white" className="text-white ml-0.5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          {/* History position indicator */}
                          <span
                            className="text-sm font-bold tabular-nums"
                            style={{
                              color: originalIndex === 0 ? gc.text : 'rgba(255,255,255,0.25)',
                              textShadow: originalIndex === 0 ? `0 0 10px ${gc.border}` : 'none',
                            }}
                          >
                            {originalIndex + 1}
                          </span>
                        </div>
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
                            style={{
                              boxShadow: hoveredRow === track.id
                                ? `0 4px 16px ${gc.border}`
                                : '0 4px 12px rgba(0,0,0,0.4)',
                              border: hoveredRow === track.id
                                ? `1.5px solid ${gc.border}`
                                : '1px solid rgba(255,255,255,0.08)',
                              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                            style={{ background: `linear-gradient(135deg, ${gc.bg} 0%, #16111E 100%)`, color: gc.text }}
                          >
                            {track.title.charAt(0)}
                          </div>
                        )}
                        {/* Recent indicator for first track */}
                        {originalIndex === 0 && (
                          <div
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: gc.text,
                              boxShadow: `0 0 8px ${gc.border}`,
                            }}
                          />
                        )}
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
                ))}
              </GlassPanel>
            </section>
          )
        })
      )}
    </div>
  )
}
