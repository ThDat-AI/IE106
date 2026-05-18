/**
 * vibewave.tsx — Shared UI primitives for VibeWave pages
 *
 * Exported components:
 *  - SectionHeader        — section h2 + "See all" link
 *  - PageHero             — eyebrow badge + h1 + subtitle
 *  - AccentBar            — colored vertical bar accent for h2 headings
 *  - AmbientOrbs          — fixed/absolute decorative background blobs
 *  - GlassPanel           — glassmorphism surface card
 *  - AiBadge              — "AI Powered" pill badge
 *  - RankBadge            — ranked number badge with RANK_COLORS palette
 *  - RANK_COLORS          — shared colour tokens for rank 1–4
 *  - FilterPills          — horizontal scrollable genre filter buttons
 *  - PodiumCard           — Top-3 style podium card (reused by Home & Charts)
 *  - GlassMusicCard       — Glassmorphism music card (Made For You section)
 */

"use client"

import React from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Play, Heart, MoreHorizontal, SkipForward, ListPlus, Plus, User, Ban } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack } from '@/lib/player-store'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

/* ─────────────────────────────────────────────
   RANK COLORS — shared across Home & Charts
───────────────────────────────────────────── */
export const RANK_COLORS = [
  { text: '#3ABEF9', glow: 'rgba(58,190,249,0.5)',  border: 'rgba(58,190,249,0.5)',  bg: 'rgba(58,190,249,0.12)' },
  { text: '#05D69E', glow: 'rgba(5,214,158,0.4)',   border: 'rgba(5,214,158,0.4)',   bg: 'rgba(5,214,158,0.1)'  },
  { text: '#F73859', glow: 'rgba(247,56,89,0.4)',   border: 'rgba(247,56,89,0.4)',   bg: 'rgba(247,56,89,0.1)'  },
  { text: '#FACC15', glow: 'rgba(250,204,21,0.4)',  border: 'rgba(250,204,21,0.4)',  bg: 'rgba(250,204,21,0.1)' },
] as const

/* ─────────────────────────────────────────────
   SECTION HEADER  — h2 + optional "see all" link
───────────────────────────────────────────── */
interface SectionHeaderProps {
  title: string
  href?: string
  /** Replace the auto-translated "See all" label with a custom label */
  seeAllLabel?: string
  rightAction?: React.ReactNode
}

export function SectionHeader({ title, href, seeAllLabel, rightAction }: SectionHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between mb-6">
      <h2
        className="font-display font-semibold"
        style={{ fontSize: 28, color: 'var(--vw-text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
      >
        {title}
      </h2>
      <div className="flex items-center gap-3">
        {rightAction}
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-medium transition-vw hover:opacity-80"
            style={{ color: 'var(--vw-text-muted)' }}
          >
            {seeAllLabel ?? t.seeAll} <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ACCENT BAR  — colored left-border bar for h2
───────────────────────────────────────────── */
type AccentColor = 'purple' | 'pink' | 'blue' | 'indigo' | 'yellow' | 'green' | 'red'

const ACCENT_GRADIENTS: Record<AccentColor, string> = {
  purple: 'from-purple-400 to-purple-600',
  pink:   'from-pink-400   to-pink-600',
  blue:   'from-blue-400   to-blue-600',
  indigo: 'from-indigo-400 to-indigo-600',
  yellow: 'from-yellow-400 to-yellow-600',
  green:  'from-green-400  to-green-600',
  red:    'from-red-400    to-red-600',
}
const ACCENT_SHADOWS: Record<AccentColor, string> = {
  purple: '0_0_10px_rgba(155,77,224,0.6)',
  pink:   '0_0_10px_rgba(236,72,153,0.6)',
  blue:   '0_0_10px_rgba(96,165,250,0.6)',
  indigo: '0_0_10px_rgba(99,102,241,0.6)',
  yellow: '0_0_12px_rgba(250,204,21,0.6)',
  green:  '0_0_10px_rgba(74,222,128,0.6)',
  red:    '0_0_10px_rgba(248,113,113,0.6)',
}

interface AccentBarProps {
  /** Height of the bar in Tailwind h-* units. Default 8 (2rem) */
  height?: 6 | 7 | 8
  color?: AccentColor
}

export function AccentBar({ height = 8, color = 'purple' }: AccentBarProps) {
  const h = height === 6 ? 'h-6' : height === 7 ? 'h-7' : 'h-8'
  return (
    <span
      className={`w-1.5 ${h} rounded-full bg-gradient-to-b ${ACCENT_GRADIENTS[color]} inline-block shadow-[${ACCENT_SHADOWS[color]}]`}
    />
  )
}

/* ─────────────────────────────────────────────
   PAGE HERO  — eyebrow badge + h1 + subtitle
───────────────────────────────────────────── */
interface PageHeroProps {
  /** Small eyebrow badge icon (Lucide React node) */
  eyebrowIcon?: React.ReactNode
  eyebrowLabel?: string
  title: string
  subtitle?: string
  /** h1 gradient class. Default: white → purple */
  gradientClass?: string
  /** Custom right-side action element */
  action?: React.ReactNode
  /** Whether to center all content. Default: false */
  centered?: boolean
}

export function PageHero({
  eyebrowIcon,
  eyebrowLabel,
  title,
  subtitle,
  gradientClass = 'from-white via-purple-100 to-purple-400',
  action,
  centered = false,
}: PageHeroProps) {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'md:flex-row md:items-end justify-between'} gap-6`}>
      <div className={`space-y-4 ${centered ? 'flex flex-col items-center' : ''}`}>
        {/* Eyebrow badge */}
        {(eyebrowIcon || eyebrowLabel) && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md"
            style={{ backgroundColor: 'rgba(155,77,224,0.12)', border: '1px solid rgba(155,77,224,0.25)' }}
          >
            {eyebrowIcon && <span style={{ color: '#9B4DE0' }}>{eyebrowIcon}</span>}
            {eyebrowLabel && (
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#C4B5FD' }}>
                {eyebrowLabel}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1
          className={`font-display font-bold text-transparent bg-clip-text bg-gradient-to-br ${gradientClass}`}
          style={{ fontSize: 'clamp(44px, 5vw, 64px)', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className={`text-base font-light leading-relaxed ${centered ? 'max-w-2xl' : 'max-w-lg'}`} style={{ color: 'rgba(255,255,255,0.55)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   AI BADGE  — "✨ AI Powered" pill
───────────────────────────────────────────── */
interface AiBadgeProps {
  label?: string
  withIcon?: boolean
}
export function AiBadge({ label = 'AI Powered', withIcon = false }: AiBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md"
        style={{ backgroundColor: 'rgba(155,77,224,0.15)', color: '#9B4DE0' }}
      >
        {withIcon && '✨ '}{label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   GLASS PANEL  — shared glassmorphism card
───────────────────────────────────────────── */
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Whether to apply the full dark glass gradient or the simpler surface */
  variant?: 'dark' | 'surface'
  className?: string
}

export function GlassPanel({ children, variant = 'dark', className = '', style, ...props }: GlassPanelProps) {
  const base =
    variant === 'dark'
      ? {
          background: 'linear-gradient(180deg, rgba(35,27,47,0.85) 0%, rgba(22,17,30,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 20px 60px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }
      : {
          backgroundColor: 'var(--vw-surface)',
          border: '1px solid rgba(255,255,255,0.06)',
        }

  return (
    <div className={`rounded-3xl overflow-hidden ${className}`} style={{ ...base, ...style }} {...props}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   RANK BADGE  — rank number with RANK_COLORS
───────────────────────────────────────────── */
interface RankBadgeProps {
  /** 0-indexed rank (0 = #1) */
  index: number
  /** Size variant */
  size?: 'lg' | 'md' | 'sm'
  /** Outline-text mode (used in Home trending section) */
  outline?: boolean
}

export function RankBadge({ index, size = 'md', outline = false }: RankBadgeProps) {
  const rc = RANK_COLORS[index] ?? null

  const fontSize =
    size === 'lg' ? (index === 0 ? 28 : index === 1 ? 24 : index === 2 ? 22 : index === 3 ? 20 : 18) :
    size === 'md' ? (index < 4 ? 22 : 16) :
    14

  if (outline) {
    // Outline/stroke style used in the Home trending strip
    const color = index < 4 ? 'var(--vw-bg)' : 'rgba(255,255,255,0.12)'
    const shadow =
      index === 0 ? `-1px -1px 0 #3ABEF9,1px -1px 0 #3ABEF9,-1px 1px 0 #3ABEF9,1px 1px 0 #3ABEF9` :
      index === 1 ? `-1px -1px 0 #05D69E,1px -1px 0 #05D69E,-1px 1px 0 #05D69E,1px 1px 0 #05D69E` :
      index === 2 ? `-1px -1px 0 #F73859,1px -1px 0 #F73859,-1px 1px 0 #F73859,1px 1px 0 #F73859` :
      index === 3 ? `-1px -1px 0 #FACC15,1px -1px 0 #FACC15,-1px 1px 0 #FACC15,1px 1px 0 #FACC15` :
      'none'
    return (
      <span
        className="font-sans font-bold text-5xl w-12 text-right shrink-0"
        style={{ color, textShadow: shadow, letterSpacing: '0' }}
      >
        {index + 1}
      </span>
    )
  }

  return (
    <span
      className="font-display font-bold"
      style={{
        fontSize,
        color:       rc ? rc.text : 'rgba(255,255,255,0.25)',
        textShadow:  rc ? `0 0 18px ${rc.glow}` : 'none',
        letterSpacing: '-0.5px',
      }}
    >
      {index + 1}
    </span>
  )
}

/* ─────────────────────────────────────────────
   AMBIENT ORBS  — background decorative blobs
───────────────────────────────────────────── */
interface AmbientOrbsProps {
  /** 'fixed' uses fixed positioning (charts page); 'absolute' uses absolute (library page) */
  position?: 'fixed' | 'absolute'
  variant?: 'default' | 'library'
}

export function AmbientOrbs({ position = 'fixed', variant = 'default' }: AmbientOrbsProps) {
  if (variant === 'library') {
    return (
      <>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
      </>
    )
  }

  const cls = position === 'fixed' ? 'pointer-events-none fixed inset-0 overflow-hidden -z-10' : 'pointer-events-none absolute inset-0 overflow-hidden -z-10'

  return (
    <div className={cls} aria-hidden>
      <div
        className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
        style={{ background: 'radial-gradient(circle, #9B4DE0 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
        style={{ background: 'radial-gradient(circle, #3ABEF9 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[10%] left-[30%] w-[500px] h-[300px] rounded-full blur-[100px] opacity-10"
        style={{ background: 'radial-gradient(circle, #F73859 0%, transparent 70%)' }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   FILTER PILLS  — genre / mood category strip
───────────────────────────────────────────── */
interface FilterPillsProps {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
  label?: string
}

export function FilterPills({ categories, active, onSelect, label }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {label && (
        <span className="text-sm shrink-0" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {label}:
        </span>
      )}
      {categories.map((cat) => {
        const isActive = cat === active
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer 
              transition-all duration-300 flex items-center gap-2
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border border-purple-500/50 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/[0.12] hover:border-white/25 hover:text-white'
              }
            `}
          >
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            )}
            {cat}
          </button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PODIUM CARD  — Top-N ranked card (Home & Charts)
───────────────────────────────────────────── */
interface PodiumCardProps {
  track: Track
  index: number
  onPlay?: (track: Track) => void
}

export function PodiumCard({ track, index, onPlay }: PodiumCardProps) {
  const rc = RANK_COLORS[index] ?? RANK_COLORS[RANK_COLORS.length - 1]
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()
  const [isHovered, setIsHovered] = React.useState(false)
  const [isLiked, setIsLiked] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    if (!track) return

    setIsLiked(isTrackLiked(track.id))

    const handleLikesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ trackId: string; isLiked: boolean }>
      if (customEvent.detail && customEvent.detail.trackId === track.id) {
        setIsLiked(customEvent.detail.isLiked)
      }
    }

    window.addEventListener('vw_likes_updated', handleLikesUpdated)
    return () => window.removeEventListener('vw_likes_updated', handleLikesUpdated)
  }, [track])

  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying
  const shouldScroll = track.title.length > 16

  function handleClick() {
    if (onPlay) onPlay(track)
    else setTrack(track)
  }

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (currentTrack?.id === track.id) {
      togglePlay()
    } else {
      if (onPlay) onPlay(track)
      else setTrack(track)
    }
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (track) {
      const newLikedState = toggleLikeTrack(track)
      setIsLiked(newLikedState)

      // Sync player store if this track is currently loaded
      const playerStore = usePlayerStore.getState()
      if (playerStore.currentTrack?.id === track.id) {
        usePlayerStore.setState({ isLiked: newLikedState })
      }
    } else {
      setIsLiked(!isLiked)
    }
  }

  function toggleMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  function handleGoToArtist() {
    if (track.artist) {
      const slug = track.artist.toLowerCase().replace(/\s+/g, '-')
      window.location.href = `/artist/${encodeURIComponent(slug)}${track.artistId ? `?id=${track.artistId}` : ''}`
    }
  }

  return (
    <div
      className="vw-trending-card group/pod p-4 relative"
      style={{
        background: `linear-gradient(145deg, ${rc.bg} 0%, rgba(22,17,30,0.9) 100%)`,
        border: `1px solid ${rc.border}`,
        boxShadow: isHovered 
          ? `0 24px 50px -12px ${rc.glow}, inset 0 1px 0 rgba(255,255,255,0.1)` 
          : `0 16px 40px -16px ${rc.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-20 pointer-events-none transition-opacity duration-500 group-hover/pod:opacity-40"
        style={{ background: `radial-gradient(circle, ${rc.text} 0%, transparent 70%)`, filter: 'blur(40px)', transform: 'translate(20%, -20%)' }}
        aria-hidden
      />

      {/* Large Image Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg border border-white/10">
        <img
          src={track.albumArt}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/pod:scale-105"
        />
        
        {/* Hover overlay with control buttons */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3.5 transition-opacity duration-200 z-10"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: isHovered || isMenuOpen ? 1 : 0,
          }}
        >
          {/* 1. Heart (Like) button on the LEFT */}
          <button
            onClick={handleLike}
            className="relative w-9 h-9 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'rgba(23,15,35,0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: isLiked ? '#EF4444' : 'rgba(255,255,255,0.75)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            aria-label={isLiked ? `Unlike ${track.title}` : `Like ${track.title}`}
            aria-pressed={isLiked}
          >
            <Heart size={14} fill={isLiked ? '#EF4444' : 'none'} />
            {isLiked && (
              <span className="w-1 h-1 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
            )}
          </button>

          {/* 2. Play button in the MIDDLE */}
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ 
              backgroundColor: rc.text, 
              boxShadow: `0 0 20px ${rc.glow}` 
            }}
            aria-label={isCurrentlyPlaying ? `Tạm dừng ${track.title}` : `Phát ${track.title}`}
          >
            {isCurrentlyPlaying ? (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="black">
                <rect x="3" y="2" width="3" height="12" rx="1"/>
                <rect x="10" y="2" width="3" height="12" rx="1"/>
              </svg>
            ) : (
              <Play size={18} fill="#000" className="ml-0.5 text-black" />
            )}
          </button>

          {/* 3. Three dots button on the RIGHT */}
          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(23,15,35,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.75)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                aria-label="More options"
              >
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-56 rounded-2xl overflow-hidden border-0 p-0 z-50"
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
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Now playing dynamic indicator on image corner */}
        {isCurrentlyPlaying && (
          <div 
            className="absolute bottom-3 right-3 flex items-end gap-0.5 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10" 
            aria-label="Đang phát"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-white"
                style={{
                  backgroundColor: rc.text,
                  height: `${6 + i * 3}px`,
                  animation: `pulse ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Track Metadata Section */}
      <div className="relative flex items-start gap-3">
        {/* Left Side big number */}
        <div 
          className="font-display font-black shrink-0 text-3xl"
          style={{ 
            color: rc.text, 
            textShadow: `0 0 20px ${rc.glow}`, 
            letterSpacing: '-1.5px',
            lineHeight: 1
          }}
        >
          {index + 1}
        </div>

        {/* Right side song details */}
        <div className="flex-1 min-w-0">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes marquee-scroll {
              0%, 15% { transform: translateX(0); }
              85%, 100% { transform: translateX(-50%); }
            }
          `}} />
          {shouldScroll && isHovered ? (
            <div className="w-full overflow-hidden whitespace-nowrap">
              <span
                className="text-sm font-semibold inline-block text-white"
                style={{
                  animation: 'marquee-scroll 6s linear infinite alternate',
                }}
              >
                {track.title}
              </span>
            </div>
          ) : (
            <p className="text-sm font-semibold truncate text-white">
              {track.title}
            </p>
          )}
          <p className="text-xs truncate text-white/50 mt-0.5">{track.artist}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   GLASS MUSIC CARD  — Glassmorphism track card
───────────────────────────────────────────── */
interface GlassMusicCardProps {
  track: Track
  /** Optional rank index (0-based) to tint the card with RANK_COLORS */
  rankIndex?: number
}

export function GlassMusicCard({ track, rankIndex }: GlassMusicCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isLiked, setIsLiked] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  React.useEffect(() => {
    if (!track) return

    setIsLiked(isTrackLiked(track.id))

    const handleLikesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ trackId: string; isLiked: boolean }>
      if (customEvent.detail && customEvent.detail.trackId === track.id) {
        setIsLiked(customEvent.detail.isLiked)
      }
    }

    window.addEventListener('vw_likes_updated', handleLikesUpdated)
    return () => window.removeEventListener('vw_likes_updated', handleLikesUpdated)
  }, [track])

  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying
  const shouldScroll = track.title.length > 18

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (currentTrack?.id === track.id) togglePlay()
    else setTrack(track)
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (track) {
      const newLikedState = toggleLikeTrack(track)
      setIsLiked(newLikedState)

      // Sync player store if this track is currently loaded
      const playerStore = usePlayerStore.getState()
      if (playerStore.currentTrack?.id === track.id) {
        usePlayerStore.setState({ isLiked: newLikedState })
      }
    } else {
      setIsLiked(!isLiked)
    }
  }

  function toggleMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  function handleGoToArtist() {
    if (track.artist) {
      const slug = track.artist.toLowerCase().replace(/\s+/g, '-')
      window.location.href = `/artist/${encodeURIComponent(slug)}${track.artistId ? `?id=${track.artistId}` : ''}`
    }
  }

  if (isHidden) return null

  const accentColor = '#9B4DE0'
  const accentGlow  = 'rgba(155,77,224,0.4)'
  const accentBorder = 'rgba(155,77,224,0.3)'

  return (
    <div
      className="vw-song-card group/glass relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow blob on hover */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'translate(40%, -40%)',
          opacity: isHovered ? 0.2 : 0,
        }}
        aria-hidden
      />

      {/* Album art square */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '1/1' }}
      >
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/glass:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-display font-bold"
            style={{ background: `linear-gradient(135deg, ${accentColor}33 0%, rgba(22,17,30,0.9) 100%)` }}
          >
            <span style={{ color: accentColor }}>{track.title.charAt(0).toUpperCase()}</span>
          </div>
        )}

        {/* Hover overlay with control buttons */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3.5 transition-opacity duration-200 z-10"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: isHovered || isMenuOpen ? 1 : 0,
          }}
        >
          {/* 1. Heart (Like) button on the LEFT */}
          <button
            onClick={handleLike}
            className="relative w-9 h-9 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'rgba(23,15,35,0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: isLiked ? '#EF4444' : 'rgba(255,255,255,0.75)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            aria-label={isLiked ? `Unlike ${track.title}` : `Like ${track.title}`}
            aria-pressed={isLiked}
          >
            <Heart size={14} fill={isLiked ? '#EF4444' : 'none'} />
            {isLiked && (
              <span className="w-1 h-1 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
            )}
          </button>

          {/* 2. Play button in the MIDDLE */}
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ 
              backgroundColor: accentColor, 
              boxShadow: `0 4px 20px ${accentGlow}` 
            }}
            aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            {isCurrentlyPlaying
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="3" y="2" width="3" height="12" rx="1"/><rect x="10" y="2" width="3" height="12" rx="1"/></svg>
              : <Play size={16} fill="white" className="text-white ml-0.5" />
            }
          </button>

          {/* 3. Three dots button on the RIGHT */}
          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(23,15,35,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.75)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                aria-label="More options"
              >
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-56 rounded-2xl overflow-hidden border-0 p-0 z-50"
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

                {/* 5. Không phát bài này nữa */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsHidden(true)
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                >
                  <Ban size={13} className="text-red-400/80" />
                  <span>Không phát bài này nữa</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Now-playing bars */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5" aria-label="Now playing">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  height: `${6 + i * 3}px`,
                  animation: `pulse ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee-scroll {
            0%, 15% { transform: translateX(0); }
            85%, 100% { transform: translateX(-50%); }
          }
        `}} />
        {shouldScroll && isHovered ? (
          <div className="w-full overflow-hidden whitespace-nowrap mb-1">
            <span
              className="text-sm font-semibold leading-tight inline-block"
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
                animation: 'marquee-scroll 6s linear infinite alternate',
              }}
            >
              {track.title}
            </span>
          </div>
        ) : (
          <p
            className="text-sm font-semibold leading-tight truncate mb-1"
            style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}
          >
            {track.title}
          </p>
        )}
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {track.artist}
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MUSIC SHELF  — Horizontal scrollable section
───────────────────────────────────────────── */
interface MusicShelfProps {
  children: React.ReactNode
  className?: string
}

export function MusicShelf({ children, className = '' }: MusicShelfProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = React.useState(false)
  const [showRight, setShowRight] = React.useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 10)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      // Initial check
      checkScroll()
      // Re-check on window resize
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    const scrollAmount = clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const maskStyle: React.CSSProperties = {
    maskImage: `linear-gradient(to right, 
      ${showLeft ? 'transparent' : 'white'} 0%, 
      white ${showLeft ? '48px' : '0px'}, 
      white ${showRight ? 'calc(100% - 80px)' : '100%'}, 
      ${showRight ? 'transparent' : 'white'} 100%)`,
    WebkitMaskImage: `linear-gradient(to right, 
      ${showLeft ? 'transparent' : 'white'} 0%, 
      white ${showLeft ? '48px' : '0px'}, 
      white ${showRight ? 'calc(100% - 80px)' : '100%'}, 
      ${showRight ? 'transparent' : 'white'} 100%)`
  }

  return (
    <div className={`relative group/shelf ${className}`}>
      {/* Navigation Arrows */}
      <button
        onClick={() => scroll('left')}
        className={`absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-110 active:scale-95 ${showLeft ? 'opacity-0 group-hover/shelf:opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} className="text-white/80" />
      </button>

      <button
        onClick={() => scroll('right')}
        className={`absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-110 active:scale-95 ${showRight ? 'opacity-0 group-hover/shelf:opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-label="Scroll right"
      >
        <ChevronRight size={24} className="text-white/80" />
      </button>

      {/* Scroll Container with Premium Masking */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-8 pt-2 px-1 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          ...maskStyle
        }}
      >
        {React.Children.map(children, (child) => (
          <div className="shrink-0 w-[180px] md:w-[200px] snap-start">
            {child}
          </div>
        ))}
        {/* Extra spacer for the right gradient visual cue */}
        <div className="shrink-0 w-12" aria-hidden />
      </div>
    </div>
  )
}
