"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Trophy, Flame, Sparkles, Radio, Globe, Music2, ChevronRight, Play, Heart, MoreHorizontal, SkipForward, ListPlus, Plus, User, Share2 } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack } from '@/lib/player-store'
import { getTopSongsByRegion, searchMusic } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import {
  PageHero,
  AccentBar,
  GlassPanel,
  AmbientOrbs,
  RANK_COLORS,
  RankBadge,
} from '@/components/ui/vibewave'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

type Region = 'global' | 'usuk' | 'kpop' | 'vn'

const REGION_ICONS: Record<Region, React.ReactNode> = {
  global: <Globe size={14} />,
  usuk: <Radio size={14} />,
  kpop: <Music2 size={14} />,
  vn: <Sparkles size={14} />,
}

function TrendIcon({ change }: { change: 'up' | 'down' | 'same' }) {
  if (change === 'up') return <TrendingUp size={12} style={{ color: '#4ade80' }} />
  if (change === 'down') return <TrendingDown size={12} style={{ color: '#fca5a5' }} />
  return <Minus size={12} style={{ color: '#cbd5e1' }} />
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

interface ChartRowProps {
  item: Track
  index: number
  hoveredRow: string | null
  setHoveredRow: (id: string | null) => void
  onPlay: (track: Track) => void
}

function ChartRow({ item, index, hoveredRow, setHoveredRow, onPlay }: ChartRowProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { currentTrack } = usePlayerStore()
  const isActive = currentTrack?.id === item.id
  const rc = RANK_COLORS[index] ?? null
  const trend = index % 3 === 0 ? 'up' : index % 5 === 0 ? 'down' : 'same'

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof window !== 'undefined' && item) {
      const shareUrl = `${window.location.origin}/search?q=${encodeURIComponent(item.title)}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
        triggerToast('Đã sao chép liên kết vào khay nhớ tạm!')
      } else {
        triggerToast('Chia sẻ liên kết thành công!')
      }
    }
  }

  useEffect(() => {
    setIsLiked(isTrackLiked(item.id))

    const handleLikesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ trackId: string; isLiked: boolean }>
      if (customEvent.detail && customEvent.detail.trackId === item.id) {
        setIsLiked(customEvent.detail.isLiked)
      }
    }

    window.addEventListener('vw_likes_updated', handleLikesUpdated)
    return () => window.removeEventListener('vw_likes_updated', handleLikesUpdated)
  }, [item.id])

  function handleLikeClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const newLikedState = toggleLikeTrack(item)
    setIsLiked(newLikedState)

    const playerStore = usePlayerStore.getState()
    if (playerStore.currentTrack?.id === item.id) {
      usePlayerStore.setState({ isLiked: newLikedState })
    }
  }

  function handleGoToArtist() {
    if (item.artist) {
      const slug = item.artist.toLowerCase().replace(/\s+/g, '-')
      window.location.href = `/artist/${encodeURIComponent(slug)}${item.artistId ? `?id=${item.artistId}` : ''}`
    }
  }

  const isHovered = hoveredRow === item.id || isMenuOpen

  return (
    <div
      className="grid gap-3 px-5 py-3.5 transition-all duration-200 cursor-pointer group/row animate-in fade-in duration-300"
      style={{
        gridTemplateColumns: '3.5rem 0.75rem 1fr 6rem 4.5rem 5.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        backgroundColor: hoveredRow === item.id ? 'rgba(155,77,224,0.07)' : 'transparent',
      }}
      onMouseEnter={() => setHoveredRow(item.id)}
      onMouseLeave={() => setHoveredRow(null)}
      onClick={() => onPlay(item)}
    >
      {/* Rank */}
      <div className="flex items-center justify-center">
        {hoveredRow === item.id ? (
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #9B4DE0, #6B21A8)', boxShadow: '0 0 16px rgba(155,77,224,0.5)' }}
            aria-label={`Play ${item.title}`}
            onClick={(e) => {
              e.stopPropagation()
              onPlay(item)
            }}
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
          <p
            className="text-sm font-semibold truncate transition-colors group-hover/row:text-white"
            style={{
              color: isActive ? '#9B4DE0' : 'var(--vw-text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.3px',
            }}
          >
            {item.title}
          </p>
          <p
            className="text-xs truncate mt-0.5 transition-colors"
            style={{ color: 'var(--vw-text-secondary)' }}
          >
            {item.artist}
          </p>
        </div>
      </div>

      {/* Album */}
      <p className="text-xs text-right truncate self-center" style={{ color: '#cbd5e1' }}>{item.album}</p>

      {/* Trend text */}
      <p
        className="text-xs text-right self-center font-semibold"
        style={{ color: trend === 'up' ? '#4ade80' : trend === 'down' ? '#fca5a5' : '#cbd5e1' }}
      >
        {trend === 'up' ? '↑ 1' : trend === 'down' ? '↓ 2' : '—'}
      </p>

      {/* Actions (Heart & 3-dots) */}
      <div className="flex items-center justify-end gap-3 self-center relative z-10" onClick={(e) => e.stopPropagation()}>
        {/* Heart icon */}
        <button
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          aria-pressed={isLiked}
          className="relative flex flex-col items-center justify-center gap-0.5 w-8 h-8 transition-all duration-200 cursor-pointer hover:bg-white/5 rounded-full"
          style={{
            color: isLiked ? '#EF4444' : 'rgba(255,255,255,0.4)',
            opacity: isHovered || isLiked ? 1 : 0,
          }}
        >
          <Heart size={14} fill={isLiked ? '#EF4444' : 'none'} />
          {isLiked && (
            <span className="w-1 h-1 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
          )}
        </button>

        {/* 3-dots dropdown */}
        <DropdownMenu onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="More options"
              className="flex items-center justify-center p-1.5 transition-all duration-200 cursor-pointer text-white/40 hover:text-white rounded-full hover:bg-white/5"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-52 rounded-2xl overflow-hidden border-0 p-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 20, 36, 0.98) 0%, rgba(15, 10, 22, 0.99) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="py-2 px-2 flex flex-col gap-1 text-left">
              {/* 1. Phát tiếp theo */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
              >
                <SkipForward size={13} className="text-purple-400" />
                <span>Phát tiếp theo</span>
              </DropdownMenuItem>

              {/* 2. Thêm vào hàng chờ */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
              >
                <ListPlus size={13} className="text-purple-400" />
                <span>Thêm vào hàng chờ</span>
              </DropdownMenuItem>

              {/* 3. Thêm vào Playlist */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
              >
                <Plus size={13} className="text-purple-400" />
                <span>Thêm vào Playlist</span>
              </DropdownMenuItem>

              {/* Divider */}
              <div className="h-px bg-white/5 my-1 mx-2" />

              {/* 4. Đi đến Nghệ sĩ */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleGoToArtist()
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
              >
                <User size={13} className="text-purple-400" />
                <span>Đi đến Nghệ sĩ</span>
              </DropdownMenuItem>

              {/* 4.5 Chia sẻ liên kết */}
              <DropdownMenuItem
                onClick={handleShare}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
              >
                <Share2 size={13} className="text-blue-400" />
                <span>Chia sẻ liên kết</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#16121E]/95 border border-purple-500/30 shadow-[0_10px_30px_rgba(155,77,224,0.15)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full flex items-center justify-center border bg-purple-500/10 border-purple-500/20 text-purple-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-white/90">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default function ChartsPage() {
  const { t } = useTranslation()
  const [region, setRegion] = useState<Region>('global')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [topTracks, setTopTracks] = useState<Track[]>([])
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
        const top = await getTopSongsByRegion(region, 100)
        setTopTracks(top)
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
          titleColor="white"
          subtitleColor="#cbd5e1"
          gradientClass="from-white to-white"
          action={
            /* Region selector */
            <div
              className="flex items-center gap-1 p-1.5 rounded-2xl backdrop-blur-xl shrink-0 bg-[#120E18] border border-white/10 shadow-xl"
            >
              {REGIONS.map((r) => {
                const isActive = region === r.id
                return (
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`
                      flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 border border-purple-500/50 text-white shadow-lg shadow-purple-900/40' 
                        : 'bg-[#191322] border border-white/10 text-slate-200 hover:bg-[#251d33] hover:border-white/20 hover:text-white'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse shadow-[0_0_4px_#ffffff]" />
                    )}
                    {!isActive && REGION_ICONS[r.id]}
                    {r.label}
                  </button>
                )
              })}
            </div>
          }
        />
      </section>

      {/* ── Main content: Top Songs Table (Full Width) ── */}
      <section className="flex flex-col gap-4">
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
            <p className="text-xs mt-0.5" style={{ color: '#cbd5e1' }}>{t.updatedDate}</p>
          </div>
        </div>

        {/* Table */}
        <GlassPanel variant="dark" className="vw-playlist-table">
          {/* Table header */}
          <div
            className="grid gap-3 px-5 py-3"
            style={{ gridTemplateColumns: '3.5rem 0.75rem 1fr 6rem 4.5rem 5.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: '#cbd5e1' }}>#</span>
            <span />
            <div className="flex items-center gap-3">
              <div className="w-10 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#cbd5e1' }}>{t.titleLabel}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: '#cbd5e1' }}>{t.albumLabel}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: '#cbd5e1' }}>{t.trendLabel}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: '#cbd5e1' }}></span>
          </div>

          {loading ? (
            <SkeletonRow cols={10} />
          ) : topTracks.map((item, index) => (
            <ChartRow
              key={item.id}
              item={item}
              index={index}
              hoveredRow={hoveredRow}
              setHoveredRow={setHoveredRow}
              onPlay={setTrack}
            />
          ))}
        </GlassPanel>
      </section>

    </div>
  )
}
