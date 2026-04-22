"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Play, Heart } from 'lucide-react'
import { usePlayerStore, type Track } from '@/lib/player-store'
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
}

const GRADIENT_PAIRS = [
  ['#9B4DE0', '#2A1F3D'],
  ['#4a2a7a', '#170F23'],
  ['#6b3ab5', '#1F162E'],
  ['#3d1f5c', '#2A1F3D'],
  ['#7a3dc8', '#170F23'],
  ['#5c2e9e', '#1F162E'],
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
}: MusicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  const gradientIdx = Math.abs(title.charCodeAt(0) + title.charCodeAt(title.length - 1)) % GRADIENT_PAIRS.length
  const [c1, c2] = GRADIENT_PAIRS[gradientIdx]

  const isCurrentlyPlaying = currentTrack?.id === id && isPlaying

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
    setIsLiked(!isLiked)
  }

  const displayImage = track?.albumArt || image

  const card = (
    <div
      className={cn('relative rounded-2xl overflow-hidden cursor-pointer group', className)}
      style={{
        backgroundColor: '#1F162E',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 20px rgba(155,77,224,0.15)' : 'none',
        borderColor: isHovered ? 'rgba(155,77,224,0.3)' : 'rgba(255,255,255,0.06)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Art square */}
      <div
        className="relative aspect-square w-full flex items-center justify-center text-4xl font-display font-bold overflow-hidden"
        style={{
          background: displayImage ? 'none' : `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>
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

        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-vw"
          style={{
            backgroundColor: 'rgba(23,15,35,0.7)',
            opacity: isHovered ? 1 : 0,
            color: isLiked ? '#9B4DE0' : 'rgba(255,255,255,0.65)',
          }}
          aria-label={isLiked ? `Unlike ${title}` : `Like ${title}`}
          aria-pressed={isLiked}
        >
          <Heart size={14} fill={isLiked ? '#9B4DE0' : 'none'} />
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
        <p
          className="text-sm font-semibold leading-tight line-clamp-2"
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.3px',
          }}
        >
          {title}
        </p>
        <p
          className="text-xs mt-1 truncate"
          style={{ color: 'rgba(255,255,255,0.55)' }}
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
