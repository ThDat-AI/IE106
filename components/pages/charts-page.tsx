"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Trophy, Flame, Sparkles, Radio, Globe, Music2, ChevronRight, Play } from 'lucide-react'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { getTopSongsByRegion, searchMusic } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import {
  PageHero,
  AccentBar,
  GlassPanel,
  AmbientOrbs,
  RANK_COLORS,
  RankBadge,
  PodiumCard,
} from '@/components/ui/vibewave'

type Region = 'global' | 'usuk' | 'kpop' | 'vn'

const REGION_ICONS: Record<Region, React.ReactNode> = {
  global: <Globe size={14} />,
  usuk: <Radio size={14} />,
  kpop: <Music2 size={14} />,
  vn: <Sparkles size={14} />,
}

function TrendIcon({ change }: { change: 'up' | 'down' | 'same' }) {
  if (change === 'up') return <TrendingUp size={12} style={{ color: '#4ade80' }} />
  if (change === 'down') return <TrendingDown size={12} style={{ color: '#f87171' }} />
  return <Minus size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <>
      {Array(cols).fill(0).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-3.5 animate-pulse"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="w-8 h-5 rounded bg-white/10 shrink-0" />
          <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/3 rounded bg-white/10" />
            <div className="h-2.5 w-1/3 rounded bg-white/[0.06]" />
          </div>
          <div className="w-14 h-3 rounded bg-white/[0.06] hidden md:block" />
        </div>
      ))}
    </>
  )
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
    { id: 'usuk', label: t.usuk },
    { id: 'kpop', label: t.kpop },
    { id: 'vn', label: t.vietnam },
  ]

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const top = await getTopSongsByRegion(region, 20)
        setTopTracks(top)
        const viralTerm = region === 'vn' ? 'TikTok Việt' : region === 'kpop' ? 'K-Pop Viral' : region === 'usuk' ? 'Viral Hits US UK' : 'Viral Hits'
        const viralCountry = region === 'vn' ? 'VN' : region === 'kpop' ? 'KR' : 'US'
        const [viral, releases] = await Promise.all([
          searchMusic(viralTerm, 5, viralCountry),
          searchMusic(region === 'vn' ? 'Mới phát hành' : 'New Music', 6, region === 'vn' ? 'VN' : 'US'),
        ])
        setViralTracks(viral)
        setNewReleases(releases)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [region])

  return (
    <div className="space-y-14 relative">

      {/* Shared ambient orbs */}
      <AmbientOrbs position="fixed" />

      {/* ── Hero Header ── */}
      <section className="relative">
        <PageHero
          eyebrowIcon={<Trophy size={13} />}
          eyebrowLabel={t.charts}
          title="Bảng Xếp Hạng"
          subtitle={t.chartsSub}
          gradientClass="from-white via-purple-100 to-purple-400"
          action={
            /* Region selector */
            <div
              className="flex items-center gap-1 p-1.5 rounded-2xl backdrop-blur-xl shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {REGIONS.map((r) => {
                const active = region === r.id
                return (
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
                    style={{
                      background: active ? 'linear-gradient(135deg, rgba(155,77,224,0.25) 0%, rgba(155,77,224,0.08) 100%)' : 'transparent',
                      color: active ? '#E9D5FF' : 'rgba(255,255,255,0.45)',
                      border: active ? '1px solid rgba(155,77,224,0.4)' : '1px solid transparent',
                      boxShadow: active ? '0 0 14px rgba(155,77,224,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
                    }}
                    aria-pressed={active}
                  >
                    {REGION_ICONS[r.id]}
                    {r.label}
                  </button>
                )
              })}
            </div>
          }
        />
      </section>

      {/* ── Main grid: Top 20 (left 2/3) + Sidebar (right 1/3) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── Top 20 Table ─── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Section label */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #3d1f5c 100%)', boxShadow: '0 0 16px rgba(155,77,224,0.4)' }}
            >
              <Trophy size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold" style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
                {t.topSongs} — {REGIONS.find(r => r.id === region)?.label}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.updatedDate}</p>
            </div>
          </div>

          {/* Table */}
          <GlassPanel variant="dark">
            {/* Table header */}
            <div
              className="grid gap-3 px-5 py-3"
              style={{ gridTemplateColumns: '3.5rem 0.75rem 1fr 6rem 4.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>#</span>
              <span />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>{t.titleLabel}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.2)' }}>{t.albumLabel}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.2)' }}>{t.trendLabel}</span>
            </div>

            {loading ? (
              <SkeletonRow cols={10} />
            ) : topTracks.map((item, index) => {
              const rc = RANK_COLORS[index] ?? null
              const trend = index % 3 === 0 ? 'up' : index % 5 === 0 ? 'down' : 'same'

              return (
                <div
                  key={item.id}
                  className="grid gap-3 px-5 py-3.5 transition-all duration-200 cursor-pointer group/row"
                  style={{
                    gridTemplateColumns: '3.5rem 0.75rem 1fr 6rem 4.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    backgroundColor: hoveredRow === item.id ? 'rgba(155,77,224,0.07)' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setTrack(item)}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    {hoveredRow === item.id ? (
                      <button
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{ background: 'linear-gradient(135deg, #9B4DE0, #6B21A8)', boxShadow: '0 0 16px rgba(155,77,224,0.5)' }}
                        aria-label={`Play ${item.title}`}
                      >
                        <Play size={13} fill="white" className="text-white ml-0.5" />
                      </button>
                    ) : (
                      <RankBadge index={index} size="md" />
                    )}
                  </div>

                  {/* Trend arrow */}
                  <div className="flex items-center">
                    <TrendIcon change={trend} />
                  </div>

                  {/* Cover + title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={item.albumArt} alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover transition-transform duration-300 group-hover/row:scale-105"
                        style={{ boxShadow: rc ? `0 0 16px ${rc.glow}` : '0 4px 12px rgba(0,0,0,0.4)', border: rc ? `1.5px solid ${rc.border}` : '1px solid rgba(255,255,255,0.08)' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate transition-colors group-hover/row:text-white" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {item.title}
                      </p>
                      <p className="text-xs truncate mt-0.5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {item.artist}
                      </p>
                    </div>
                  </div>

                  {/* Album */}
                  <p className="text-xs text-right truncate self-center" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.album}</p>

                  {/* Trend text */}
                  <p
                    className="text-xs text-right self-center font-semibold"
                    style={{ color: trend === 'up' ? '#4ade80' : trend === 'down' ? '#f87171' : 'rgba(255,255,255,0.2)' }}
                  >
                    {trend === 'up' ? '↑ 1' : trend === 'down' ? '↓ 2' : '—'}
                  </p>
                </div>
              )
            })}
          </GlassPanel>
        </div>

        {/* ─── Sidebar: Viral + New Releases ─── */}
        <div className="flex flex-col gap-6">

          {/* Viral Hits */}
          <GlassPanel variant="dark">
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F73859 0%, #7f1d1d 100%)', boxShadow: '0 0 12px rgba(247,56,89,0.4)' }}>
                <Flame size={14} className="text-white" />
              </div>
              <h2 className="font-display font-semibold" style={{ fontSize: 16, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.2px' }}>
                {t.viralHits}
              </h2>
            </div>

            {loading ? (
              <SkeletonRow cols={5} />
            ) : viralTracks.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-5 py-3.5 transition-all duration-200 cursor-pointer group/viral hover:bg-white/[0.03]"
                style={{ borderBottom: i < viralTracks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onClick={() => setTrack(item)}
              >
                <RankBadge index={i} size="sm" />
                <TrendIcon change={i % 2 === 0 ? 'up' : 'same'} />
                <img src={item.albumArt} alt={item.title}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 transition-transform duration-300 group-hover/viral:scale-105"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.title}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.artist}</p>
                </div>
                <ChevronRight size={14} className="shrink-0 opacity-0 group-hover/viral:opacity-100 transition-opacity duration-200" style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
            ))}
          </GlassPanel>

          {/* New Releases */}
          <GlassPanel variant="dark">
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #05D69E 0%, #064e3b 100%)', boxShadow: '0 0 12px rgba(5,214,158,0.4)' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <h2 className="font-display font-semibold" style={{ fontSize: 16, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.2px' }}>
                {t.newReleasesTitle}
              </h2>
            </div>

            <div className="p-4 space-y-2">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/[0.04] animate-pulse" />
                ))
              ) : newReleases.map((track, i) => (
                <div
                  key={track.id}
                  className="group/new flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  }}
                  onClick={() => setTrack(track)}
                >
                  <img src={track.albumArt} alt={track.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 transition-transform duration-300 group-hover/new:scale-105"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{track.title}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{track.artist}</p>
                  </div>
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide shrink-0"
                    style={{ backgroundColor: 'rgba(5,214,158,0.15)', color: '#05D69E', border: '1px solid rgba(5,214,158,0.25)' }}
                  >
                    New
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ── Podium: Top 3 highlight cards ── */}
      <section>
        <h2 className="font-display font-bold flex items-center gap-3 mb-6" style={{ fontSize: 26, color: '#ffffff', letterSpacing: '-0.4px' }}>
          <AccentBar height={7} color="yellow" />
          Top 3 hôm nay
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading
            ? Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-white/[0.04] animate-pulse" />
            ))
            : topTracks.slice(0, 3).map((track, i) => (
              <PodiumCard key={track.id} track={track} index={i} />
            ))}
        </div>
      </section>

    </div>
  )
}
