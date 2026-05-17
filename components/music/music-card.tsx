"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Heart, Trash2 } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack } from '@/lib/player-store'
import { cn } from '@/lib/utils'

interface MusicCardProps {
  id: string
  title: string
  subtitle: string
  type?: 'track' | 'album' | 'playlist' | 'artist'
  href?: string
  colorAccent?: string
  className?: string
  track?: Track
  image?: string
  variant?: 'default' | 'compact'
  onDelete?: (id: string) => void
  deleteLabel?: string
}

const GRADIENT_PAIRS = [
  ['#9B4DE0', '#2A1F3D'],
  ['#4a2a7a', 'var(--vw-bg)'],
  ['#6b3ab5', 'var(--vw-surface)'],
  ['#3d1f5c', '#2A1F3D'],
  ['#7a3dc8', 'var(--vw-bg)'],
  ['#5c2e9e', 'var(--vw-surface)'],
]

export default function MusicCard({
  id,
  title,
  subtitle,
  type = 'track',
  href,
  colorAccent,
  className,
  track,
  image,
  variant = 'default',
  onDelete,
  deleteLabel,
}: MusicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  useEffect(() => {
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

  const gradientIdx = Math.abs(title.charCodeAt(0) + title.charCodeAt(title.length - 1)) % GRADIENT_PAIRS.length
  const [c1, c2] = GRADIENT_PAIRS[gradientIdx]

  const isCurrentlyPlaying = currentTrack?.id === id && isPlaying
  const shouldScroll = title.length > 18

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (track) {
      if (currentTrack?.id === id) {
        togglePlay()
      } else {
        setTrack(track)
      }
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

  const displayImage = track?.albumArt || image

  if (type === 'artist') {
    const artistCard = (
      <div
        className={cn('relative flex flex-col items-center text-center cursor-pointer group w-full', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: 'transform 0.2s ease',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
        }}
      >
        {/* Circular Image Container */}
        <div 
          className="relative w-full aspect-square rounded-full overflow-hidden mb-3 border border-white/10 shadow-lg"
          style={{
            boxShadow: isHovered ? '0 12px 30px rgba(155,77,224,0.25)' : '0 8px 24px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-white/80"
              style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
            >
              {title.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Hover Play Button Overlay */}
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <button
              onClick={handlePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: '#9B4DE0',
                boxShadow: '0 4px 16px rgba(155,77,224,0.4)',
              }}
              aria-label={`Play ${title}`}
            >
              {isCurrentlyPlaying ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <rect x="3" y="2" width="3" height="12" rx="1"/>
                  <rect x="10" y="2" width="3" height="12" rx="1"/>
                </svg>
              ) : (
                <Play size={16} fill="white" className="text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
        
        {/* Centered Artist Info */}
        <div className="px-2 w-full">
          <p className="text-sm font-semibold truncate text-white group-hover:text-purple-400 transition-colors">
            {title}
          </p>
          <p className="text-xs text-white/40 truncate mt-0.5">
            {subtitle || 'Nghệ sĩ'}
          </p>
        </div>
      </div>
    )

    if (href) {
      return <Link href={href} className="w-full block">{artistCard}</Link>
    }
    return artistCard
  }

  const card = variant === 'compact' ? (
    <div
      className={cn('flex items-center gap-3 p-2 rounded-xl transition-vw group hover:bg-white/5', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5 relative">
        {displayImage ? (
          <img src={displayImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-xl font-bold"
            style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, color: 'rgba(255,255,255,0.3)' }}
          >
            {title.charAt(0)}
          </div>
        )}
        {/* Compact play overlay */}
        <div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={14} fill="white" className="text-white" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white/90 truncate group-hover:text-purple-400 transition-colors">{title}</p>
        <p className="text-xs text-white/40 truncate">{subtitle}</p>
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(id)
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 text-white/40 cursor-pointer shrink-0"
          title={deleteLabel || "Xóa"}
          aria-label={deleteLabel || "Xóa"}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  ) : (
    <div
      className={cn('relative rounded-2xl overflow-hidden cursor-pointer group', className)}
      style={{
        backgroundColor: 'var(--vw-surface)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 20px rgba(155,77,224,0.15)' : '0 8px 30px rgba(0,0,0,0.6)',
        borderColor: isHovered ? 'rgba(155,77,224,0.3)' : 'var(--vw-border)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Art square */}
      <div
        className="relative w-full flex items-center justify-center text-4xl font-display font-bold overflow-hidden"
        style={{
          background: displayImage ? 'none' : `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
          aspectRatio: '1/1',
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span style={{ color: 'var(--vw-text-secondary)' }}>
            {title.charAt(0).toUpperCase()}
          </span>
        )}

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
          style={{
            backgroundColor: 'rgba(0,0,0,0.45)',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-vw hover:scale-110 active:scale-95"
            style={{
              backgroundColor: '#9B4DE0',
              boxShadow: '0 4px 16px rgba(155,77,224,0.4)',
            }}
            aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
          >
            {isCurrentlyPlaying
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="3" y="2" width="3" height="12" rx="1"/><rect x="10" y="2" width="3" height="12" rx="1"/></svg>
              : <Play size={16} fill="white" className="text-white ml-0.5" />
            }
          </button>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(id)
            }}
            className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-red-500 hover:text-white cursor-pointer z-10"
            style={{
              backgroundColor: 'rgba(23,15,35,0.7)',
              opacity: isHovered ? 1 : 0,
              color: 'rgba(255,255,255,0.6)',
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            }}
            title={deleteLabel || "Xóa"}
            aria-label={deleteLabel || "Xóa"}
          >
            <Trash2 size={14} />
          </button>
        )}

        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-vw cursor-pointer"
          style={{
            backgroundColor: 'rgba(23,15,35,0.7)',
            opacity: isHovered ? 1 : 0,
            color: isLiked ? '#F43F5E' : 'var(--vw-text-secondary)',
          }}
          aria-label={isLiked ? `Unlike ${title}` : `Like ${title}`}
          aria-pressed={isLiked}
        >
          <Heart size={14} fill={isLiked ? '#F43F5E' : 'none'} />
        </button>

        {/* Now playing indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5" aria-label="Now playing">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  backgroundColor: '#9B4DE0',
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
                color: 'var(--vw-text-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
                animation: 'marquee-scroll 6s linear infinite alternate',
              }}
            >
              {title}
            </span>
          </div>
        ) : (
          <p
            className="text-sm font-semibold leading-tight truncate mb-1"
            style={{
              color: 'var(--vw-text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.3px',
            }}
          >
            {title}
          </p>
        )}
        <p
          className="text-xs truncate"
          style={{ color: 'var(--vw-text-secondary)' }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{card}</Link>
  }

  return card
}
