"use client"

import { useState } from 'react'
import { Search, Clock } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'

export default function RecentlyPlayedPage({ 
  initialTracks = [] 
}: { 
  initialTracks?: Track[] 
}) {
  const { t } = useTranslation()
  const [searchQ, setSearchQ] = useState('')

  const filtered = initialTracks.filter(track =>
    track.title.toLowerCase().includes(searchQ.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQ.toLowerCase()) ||
    track.album?.toLowerCase().includes(searchQ.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="font-display font-bold leading-display"
            style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
          >
            {t.recentlyPlayed}
          </h1>
          <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            {t.historySub}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={t.filter}
              className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none transition-vw"
              style={{
                backgroundColor: '#1F162E',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                width: 280,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#9B4DE0')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
        </div>
      </div>

      {/* Tracks list */}
      <div className="flex flex-col gap-2 mt-6">
        <div className="flex items-center gap-4 px-3 py-2 text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <div className="w-6 text-center">#</div>
          <div className="w-10 shrink-0"></div>
          <div className="flex-1 min-w-0">{t.titleLabel || 'TITLE'}</div>
          <div className="hidden md:block w-40 shrink-0">{t.albumLabel || 'ALBUM'}</div>
          <div className="flex items-center justify-end gap-3 shrink-0" style={{ width: '84px' }}>
            <Clock size={14} className="mr-6" />
          </div>
        </div>
        <div className="flex flex-col">
          {filtered.map((track, i) => (
            <TrackRow key={track.id} index={i + 1} track={track} />
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <p className="text-sm">{t.noResults} &ldquo;{searchQ}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
