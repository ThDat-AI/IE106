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
import { ChevronRight, Play, Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'
import { usePlayerStore, type Track } from '@/lib/player-store'

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
}

export function SectionHeader({ title, href, seeAllLabel }: SectionHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between mb-6">
      <h2
        className="font-display font-semibold"
        style={{ fontSize: 28, color: 'var(--vw-text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
      >
        {title}
      </h2>
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
            className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md whitespace-nowrap"
            style={{
              background: isActive
                ? 'linear-gradient(135deg, rgba(155,77,224,0.2) 0%, rgba(155,77,224,0.05) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: isActive ? '1px solid rgba(155,77,224,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: isActive ? '#E9D5FF' : 'rgba(255,255,255,0.7)',
              boxShadow: isActive ? '0 0 15px rgba(155,77,224,0.3)' : 'none',
            }}
          >
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
  const { setTrack } = usePlayerStore()

  function handleClick() {
    if (onPlay) onPlay(track)
    else setTrack(track)
  }

  return (
    <div
      className="group/pod relative p-5 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: `linear-gradient(145deg, ${rc.bg} 0%, rgba(22,17,30,0.9) 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${rc.border}`,
        boxShadow: `0 16px 40px -16px ${rc.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
      onClick={handleClick}
    >
      {/* Glow blob */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none transition-opacity duration-500 group-hover/pod:opacity-40"
        style={{ background: `radial-gradient(circle, ${rc.text} 0%, transparent 70%)`, filter: 'blur(30px)', transform: 'translate(30%, -30%)' }}
        aria-hidden
      />

      <div className="relative flex items-center gap-4">
        <img
          src={track.albumArt}
          alt={track.title}
          className="w-16 h-16 rounded-2xl object-cover shrink-0 transition-transform duration-300 group-hover/pod:scale-105"
          style={{ boxShadow: `0 0 20px ${rc.glow}`, border: `2px solid ${rc.border}` }}
        />
        <div className="flex-1 min-w-0">
          <span
            className="font-display font-bold block"
            style={{ fontSize: 36, color: rc.text, textShadow: `0 0 24px ${rc.glow}`, letterSpacing: '-1px', lineHeight: 1 }}
          >
            #{index + 1}
          </span>
          <p className="text-sm font-semibold truncate mt-1" style={{ color: '#ffffff' }}>{track.title}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{track.artist}</p>
        </div>
      </div>

      <button
        className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/pod:opacity-100 transition-all duration-300 scale-90 group-hover/pod:scale-100"
        style={{ background: rc.text, boxShadow: `0 0 16px ${rc.glow}` }}
        aria-label={`Play ${track.title}`}
        onClick={(e) => { e.stopPropagation(); handleClick() }}
      >
        <Play size={13} fill="#000" className="ml-0.5" style={{ color: '#000' }} />
      </button>
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
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()
  const rc = rankIndex !== undefined ? RANK_COLORS[rankIndex % RANK_COLORS.length] : null

  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (currentTrack?.id === track.id) togglePlay()
    else setTrack(track)
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const accentColor = rc?.text ?? '#9B4DE0'
  const accentGlow  = rc?.glow  ?? 'rgba(155,77,224,0.4)'
  const accentBorder = rc?.border ?? 'rgba(155,77,224,0.3)'

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group/glass"
      style={{
        background: isHovered
          ? `linear-gradient(145deg, ${rc?.bg ?? 'rgba(155,77,224,0.12)'} 0%, rgba(22,17,30,0.85) 100%)`
          : 'linear-gradient(145deg, rgba(35,27,47,0.7) 0%, rgba(22,17,30,0.75) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isHovered ? `1px solid ${accentBorder}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHovered
          ? `0 16px 40px -8px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
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

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', opacity: isHovered ? 1 : 0 }}
        >
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accentColor, boxShadow: `0 4px 20px ${accentGlow}`, transition: 'transform 0.15s ease' }}
            aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            {isCurrentlyPlaying
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="3" y="2" width="3" height="12" rx="1"/><rect x="10" y="2" width="3" height="12" rx="1"/></svg>
              : <Play size={16} fill="white" className="text-white ml-0.5" />
            }
          </button>
        </div>

        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity duration-200"
          style={{
            backgroundColor: 'rgba(10,7,18,0.75)',
            backdropFilter: 'blur(8px)',
            opacity: isHovered ? 1 : 0,
            color: isLiked ? accentColor : 'rgba(255,255,255,0.6)',
          }}
          aria-label={isLiked ? `Unlike ${track.title}` : `Like ${track.title}`}
          aria-pressed={isLiked}
        >
          <Heart size={14} fill={isLiked ? accentColor : 'none'} />
        </button>

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
        <p
          className="text-sm font-semibold leading-tight line-clamp-2 mb-1"
          style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}
        >
          {track.title}
        </p>
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {track.artist}
        </p>
      </div>
    </div>
  )
}
