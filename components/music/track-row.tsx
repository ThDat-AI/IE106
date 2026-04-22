"use client"

import { useState } from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import { usePlayerStore, type Track } from '@/lib/player-store'

interface TrackRowProps {
  index: number
  track: Track
  showAlbum?: boolean
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TrackRow({ index, track, showAlbum = true }: TrackRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  const isActive = currentTrack?.id === track.id
  const isCurrentlyPlaying = isActive && isPlaying

  function handlePlay() {
    if (isActive) {
      togglePlay()
    } else {
      setTrack(track)
    }
  }

  return (
    <div
      className="flex items-center gap-4 px-3 py-2.5 rounded-lg group transition-vw"
      style={{
        backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : isActive ? 'rgba(155,77,224,0.06)' : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index / play */}
      <div className="w-6 flex items-center justify-center shrink-0">
        {isHovered ? (
          <button
            onClick={handlePlay}
            aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            {isCurrentlyPlaying
              ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2" width="3" height="12" rx="1" fill="#9B4DE0"/>
                  <rect x="10" y="2" width="3" height="12" rx="1" fill="#9B4DE0"/>
                </svg>
              : <Play size={14} fill="#9B4DE0" style={{ color: '#9B4DE0', marginLeft: 1 }} />
            }
          </button>
        ) : isCurrentlyPlaying ? (
          <div className="flex items-end gap-0.5" aria-label="Now playing">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  backgroundColor: '#9B4DE0',
                  height: `${4 + i * 2}px`,
                }}
              />
            ))}
          </div>
        ) : (
          <span
            className="text-sm tabular-nums"
            style={{ color: isActive ? '#9B4DE0' : 'rgba(255,255,255,0.35)' }}
          >
            {index}
          </span>
        )}
      </div>

      {/* Track art */}
      <div
        className="w-10 h-10 rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-base font-bold"
        style={{
          background: track.albumArt ? 'none' : `linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)`,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {track.albumArt ? (
          <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          track.title.charAt(0)
        )}
      </div>

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: isActive ? '#9B4DE0' : 'rgba(255,255,255,0.95)' }}
        >
          {track.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {track.artist}
        </p>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="hidden md:block w-40 shrink-0">
          <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {track.album}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setIsLiked(!isLiked)}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          aria-pressed={isLiked}
          className="transition-vw"
          style={{
            color: isLiked ? '#9B4DE0' : 'rgba(255,255,255,0.35)',
            opacity: isHovered || isLiked ? 1 : 0,
          }}
        >
          <Heart size={15} fill={isLiked ? '#9B4DE0' : 'none'} />
        </button>

        <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {formatTime(track.duration)}
        </span>

        <button
          aria-label="More options"
          className="transition-vw"
          style={{ color: 'rgba(255,255,255,0.35)', opacity: isHovered ? 1 : 0 }}
        >
          <MoreHorizontal size={15} />
        </button>
      </div>
    </div>
  )
}
