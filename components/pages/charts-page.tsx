"use client"

import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Play } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { SAMPLE_TRACKS } from '@/lib/player-store'

type Region = 'global' | 'us' | 'uk' | 'vn'

const REGIONS: { id: Region; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'us', label: 'United States' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'vn', label: 'Vietnam' },
]

const TOP_50 = [
  { rank: 1, prev: 2, title: 'As It Was', artist: 'Harry Wilde', streams: '18.4M', change: 'up' },
  { rank: 2, prev: 1, title: 'Anti-Hero', artist: 'Taylor Swift', streams: '17.1M', change: 'down' },
  { rank: 3, prev: 3, title: 'Flowers', artist: 'Miley Cyrus', streams: '16.8M', change: 'same' },
  { rank: 4, prev: 6, title: 'Kill Bill', artist: 'SZA', streams: '15.2M', change: 'up' },
  { rank: 5, prev: 4, title: 'Blinding Lights', artist: 'The Weeknd', streams: '14.9M', change: 'down' },
  { rank: 6, prev: 7, title: 'Levitating', artist: 'Dua Lipa', streams: '14.1M', change: 'up' },
  { rank: 7, prev: 5, title: 'Stay', artist: 'The Kid LAROI', streams: '13.7M', change: 'down' },
  { rank: 8, prev: 9, title: 'Peaches', artist: 'Justin Bieber', streams: '12.9M', change: 'up' },
  { rank: 9, prev: 11, title: 'Good 4 U', artist: 'Olivia Rodrigo', streams: '12.3M', change: 'up' },
  { rank: 10, prev: 8, title: 'Watermelon Sugar', artist: 'Harry Styles', streams: '11.8M', change: 'down' },
]

const VIRAL_50 = [
  { rank: 1, prev: 5, title: 'Midnight Rain', artist: 'Taylor Swift', streams: '8.4M', change: 'up' },
  { rank: 2, prev: 1, title: 'Creepin\'', artist: 'Metro Boomin', streams: '7.9M', change: 'down' },
  { rank: 3, prev: 2, title: 'Lift Me Up', artist: 'Rihanna', streams: '7.2M', change: 'down' },
  { rank: 4, prev: 6, title: 'Sun to Me', artist: 'Zach Bryan', streams: '6.8M', change: 'up' },
  { rank: 5, prev: 4, title: 'Just Wanna Rock', artist: 'Lil Uzi Vert', streams: '6.1M', change: 'same' },
]

function TrendIcon({ change }: { change: string }) {
  if (change === 'up') return <TrendingUp size={13} style={{ color: '#4ade80' }} />
  if (change === 'down') return <TrendingDown size={13} style={{ color: '#f87171' }} />
  return <Minus size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
}

export default function ChartsPage() {
  const [region, setRegion] = useState<Region>('global')
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <div className="space-y-16">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="font-display font-bold leading-display"
            style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
          >
            Charts
          </h1>
          <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            The most-streamed songs right now. Updated daily.
          </p>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-vw"
              style={{
                backgroundColor: region === r.id ? '#2A1F3D' : 'transparent',
                color: region === r.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                border: region === r.id ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-8">

        {/* Top 50 */}
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #3d1f5c 100%)' }}
            >
              <span className="text-white font-bold text-sm">50</span>
            </div>
            <div>
              <h2 className="font-display font-semibold" style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
                Top 50 — {REGIONS.find(r => r.id === region)?.label}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Updated April 22, 2026</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Table header */}
            <div
              className="grid grid-cols-[3rem_1rem_1fr_7rem_5rem] gap-3 items-center px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#</span>
              <span />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Title</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>Streams</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>Trend</span>
            </div>

            {TOP_50.map((item) => (
              <div
                key={item.rank}
                className="grid grid-cols-[3rem_1rem_1fr_7rem_5rem] gap-3 items-center px-4 py-3 transition-vw cursor-pointer"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  backgroundColor: hoveredRow === item.rank ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredRow(item.rank)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  {hoveredRow === item.rank ? (
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-vw"
                      style={{ backgroundColor: '#9B4DE0' }}
                      aria-label={`Play ${item.title}`}
                    >
                      <Play size={12} fill="white" className="text-white ml-0.5" />
                    </button>
                  ) : (
                    <span
                      className="font-display font-bold text-xl"
                      style={{ color: item.rank <= 3 ? '#9B4DE0' : 'rgba(255,255,255,0.3)', letterSpacing: '-0.3px' }}
                    >
                      {item.rank}
                    </span>
                  )}
                </div>

                {/* Trend icon */}
                <TrendIcon change={item.change} />

                {/* Title + artist */}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.title}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.artist}</p>
                </div>

                {/* Streams */}
                <p className="text-sm text-right tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.streams}</p>

                {/* Prev rank */}
                <p className="text-xs text-right" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {item.change === 'same' ? '—' : `${item.change === 'up' ? '↑' : '↓'} ${Math.abs(item.rank - item.prev)}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Viral 50 + New releases */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display font-semibold mb-4" style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
              Viral 50
            </h2>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
              {VIRAL_50.map((item, i) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 px-4 py-3 transition-vw hover:bg-white/[0.03] cursor-pointer"
                  style={{ borderBottom: i < VIRAL_50.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <span className="font-display font-bold w-5 text-center" style={{ color: item.rank <= 2 ? '#9B4DE0' : 'rgba(255,255,255,0.25)', fontSize: 16 }}>
                    {item.rank}
                  </span>
                  <TrendIcon change={item.change} />
                  <div
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {item.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.title}</p>
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Releases */}
          <div>
            <h2 className="font-display font-semibold mb-4" style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
              New Releases
            </h2>
            <div className="space-y-3">
              {SAMPLE_TRACKS.slice(0, 4).map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-vw hover:bg-white/[0.03] cursor-pointer"
                  style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-bold"
                    style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {track.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{track.title}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{track.artist}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide" style={{ backgroundColor: 'rgba(155,77,224,0.15)', color: '#9B4DE0' }}>
                    New
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
