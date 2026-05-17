"use client"

import { useState, useEffect } from 'react'
import { Play, Heart, MoreHorizontal, SkipForward, ListPlus, Plus, User, Ban } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack } from '@/lib/player-store'

interface TrackRowProps {
  index: number
  track: Track
  showAlbum?: boolean
  onRemove?: () => void
  removeLabel?: string
  hideGoToArtist?: boolean
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TrackRow({ index, track, showAlbum = true, onRemove, removeLabel, hideGoToArtist }: TrackRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  function toggleMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  function handleGoToArtist() {
    const slug = track.artist.toLowerCase().replace(/\s+/g, '-')
    window.location.href = `/artist/${encodeURIComponent(slug)}${track.artistId ? `?id=${track.artistId}` : ''}`
  }

  useEffect(() => {
    setIsLiked(isTrackLiked(track.id))

    const handleLikesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ trackId: string; isLiked: boolean }>
      if (customEvent.detail && customEvent.detail.trackId === track.id) {
        setIsLiked(customEvent.detail.isLiked)
      }
    }

    window.addEventListener('vw_likes_updated', handleLikesUpdated)
    return () => window.removeEventListener('vw_likes_updated', handleLikesUpdated)
  }, [track.id])

  const isActive = currentTrack?.id === track.id
  const isCurrentlyPlaying = isActive && isPlaying

  function handlePlay() {
    if (isActive) {
      togglePlay()
    } else {
      setTrack(track)
    }
  }

  function handleLikeClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const newLikedState = toggleLikeTrack(track)
    setIsLiked(newLikedState)

    // Sync player if currently active
    const playerStore = usePlayerStore.getState()
    if (playerStore.currentTrack?.id === track.id) {
      usePlayerStore.setState({ isLiked: newLikedState })
    }
  }

  if (isHidden) return null

  return (
    <div
      className="flex items-center gap-4 px-3 py-2.5 rounded-lg group transition-vw"
      style={{
        backgroundColor: isHovered ? 'rgba(255,255,255,0.1)' : isActive ? 'rgba(155,77,224,0.06)' : 'transparent',
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
            style={{ color: isActive ? '#9B4DE0' : 'var(--vw-text-muted)' }}
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
          color: 'var(--vw-text-secondary)',
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
          style={{ color: isActive ? '#9B4DE0' : 'var(--vw-text-primary)' }}
        >
          {track.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--vw-text-muted)' }}>
          {track.artist}
        </p>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="hidden md:block w-40 shrink-0">
          <p className="text-sm truncate" style={{ color: 'var(--vw-text-muted)' }}>
            {track.album}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0 relative">
        <button
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          aria-pressed={isLiked}
          className="transition-vw cursor-pointer"
          style={{
            color: isLiked ? '#EF4444' : 'var(--vw-text-muted)',
            opacity: isHovered || isLiked ? 1 : 0,
          }}
        >
          <Heart size={15} fill={isLiked ? '#EF4444' : 'none'} />
        </button>

        <span className="text-xs tabular-nums" style={{ color: 'var(--vw-text-muted)' }}>
          {formatTime(track.duration)}
        </span>

        {onRemove ? (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove()
            }}
            aria-label={removeLabel || "Xóa khỏi danh sách phát"}
            title={removeLabel || "Xóa khỏi danh sách phát"}
            className="transition-all duration-200 text-white/40 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        ) : (
          <button
            onClick={toggleMenu}
            aria-label="More options"
            className="transition-vw cursor-pointer hover:text-white"
            style={{ color: 'var(--vw-text-muted)', opacity: isHovered || isMenuOpen ? 1 : 0 }}
          >
            <MoreHorizontal size={15} />
          </button>
        )}

        {isMenuOpen && (
          <>
            {/* Backdrop to close the menu when clicking outside */}
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsMenuOpen(false)
              }}
            />
            
            {/* Glassmorphic Dropdown Menu */}
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 20, 36, 0.95) 0%, rgba(15, 10, 22, 0.97) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1.5 px-1.5 flex flex-col gap-1">
                {/* 1. Phát tiếp theo */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98"
                >
                  <SkipForward size={13} className="text-purple-400" />
                  <span>Phát tiếp theo</span>
                </button>

                {/* 2. Thêm vào hàng chờ */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98"
                >
                  <ListPlus size={13} className="text-purple-400" />
                  <span>Thêm vào hàng chờ</span>
                </button>

                {/* 3. Thêm vào Playlist */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98"
                >
                  <Plus size={13} className="text-purple-400" />
                  <span>Thêm vào Playlist</span>
                </button>

                {/* Divider */}
                <div className="h-px bg-white/5 my-1 mx-2" />

                {/* 4. Đi đến Nghệ sĩ */}
                {!hideGoToArtist && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleGoToArtist()
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98"
                  >
                    <User size={13} className="text-purple-400" />
                    <span>Đi đến Nghệ sĩ</span>
                  </button>
                )}

                {/* 5. Không phát bài này nữa */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsHidden(true)
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98"
                >
                  <Ban size={13} className="text-red-400/80" />
                  <span>Không phát bài này nữa</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
