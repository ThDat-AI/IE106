"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Play } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { getTopSongsByRegion, searchMusic } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'

type Region = 'global' | 'us' | 'uk' | 'vn'

function TrendIcon({ change }: { change: string }) {
  if (change === 'up') return <TrendingUp size={13} style={{ color: '#4ade80' }} />
  if (change === 'down') return <TrendingDown size={13} style={{ color: '#f87171' }} />
  return <Minus size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
}

export default function ChartsPage() {
  const { t } = useTranslation()
  const [region, setRegion] = useState<Region>('global')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [topTracks, setTopTracks] = useState<Track[]>([])
  const [viralTracks, setViralTracks] = useState<Track[]>([])
  const [newReleases, setNewReleases] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const { setTrack } = usePlayerStore()

  const REGIONS: { id: Region; label: string }[] = [
    { id: 'global', label: t.global },
    { id: 'us', label: t.us },
    { id: 'uk', label: t.uk },
    { id: 'vn', label: t.vietnam },
  ]

  useEffect(() => {
    async function loadCharts() {
      setLoading(true)
      try {
        const top = await getTopSongsByRegion(region, 20)
        setTopTracks(top)

        const viral = await searchMusic(region === 'vn' ? 'TikTok Việt' : 'Viral Hits', 5, region === 'vn' ? 'VN' : 'US')
        setViralTracks(viral)

        const releases = await searchMusic(region === 'vn' ? 'Mới phát hành' : 'New Music', 4, region === 'vn' ? 'VN' : 'US')
        setNewReleases(releases)
      } catch (error) {
        console.error('Failed to load charts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCharts()
  }, [region])

  return (
    <div className="space-y-16">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="font-display font-bold leading-display"
            style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
          >
            {t.charts}
          </h1>
          <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            {t.chartsSub}
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
                {t.topSongs} — {REGIONS.find(r => r.id === region)?.label}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.updatedDate}</p>
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
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{t.titleLabel}</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>{t.albumLabel}</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>{t.trendLabel}</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-white/30">{t.loadingCharts}</div>
            ) : topTracks.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-[3rem_1rem_1fr_7rem_5rem] gap-3 items-center px-4 py-3 transition-vw cursor-pointer"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  backgroundColor: hoveredRow === item.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setTrack(item)}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  {hoveredRow === item.id ? (
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
                      style={{ color: index < 3 ? '#9B4DE0' : 'rgba(255,255,255,0.3)', letterSpacing: '-0.3px' }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Trend icon */}
                <TrendIcon change={index % 3 === 0 ? 'up' : index % 5 === 0 ? 'down' : 'same'} />

                {/* Title + artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.albumArt} alt={item.title} className="w-8 h-8 rounded shrink-0 object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.title}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.artist}</p>
                  </div>
                </div>

                {/* Album */}
                <p className="text-xs text-right truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.album}</p>

                {/* Trend indicator */}
                <p className="text-xs text-right" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {index % 3 === 0 ? '↑ 1' : index % 5 === 0 ? '↓ 2' : '—'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Viral + New releases */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display font-semibold mb-4" style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
              {t.viralHits}
            </h2>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
              {loading ? (
                <div className="p-4 text-center text-white/30">{t.loadingCharts}</div>
              ) : viralTracks.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 transition-vw hover:bg-white/[0.03] cursor-pointer"
                  style={{ borderBottom: i < viralTracks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  onClick={() => setTrack(item)}
                >
                  <span className="font-display font-bold w-5 text-center" style={{ color: i < 2 ? '#9B4DE0' : 'rgba(255,255,255,0.25)', fontSize: 16 }}>
                    {i + 1}
                  </span>
                  <TrendIcon change={i % 2 === 0 ? 'up' : 'same'} />
                  <img src={item.albumArt} alt={item.title} className="w-9 h-9 rounded-lg shrink-0 object-cover" />
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
              {t.newReleasesTitle}
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="p-4 text-center text-white/30">{t.loadingCharts}</div>
              ) : newReleases.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-vw hover:bg-white/[0.03] cursor-pointer"
                  style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => setTrack(track)}
                >
                  <img src={track.albumArt} alt={track.title} className="w-10 h-10 rounded-lg shrink-0 object-cover" />
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
