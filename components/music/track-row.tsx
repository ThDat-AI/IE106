"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Heart, MoreHorizontal, SkipForward, ListPlus, Plus, User, Ban, X, Check, Share2 } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack, toggleBlockTrack, isTrackBlocked } from '@/lib/player-store'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import PlaylistModal from './playlist-modal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface TrackRowProps {
  index: number
  track: Track
  showAlbum?: boolean
  onRemove?: () => void
  removeLabel?: string
  hideGoToArtist?: boolean
  variant?: 'purple' | 'rose' | 'blue' | 'green' | 'red' | 'yellow'
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TrackRow({ index, track, showAlbum = true, onRemove, removeLabel, hideGoToArtist, variant = 'purple' }: TrackRowProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay, playNext, addToQueue } = usePlayerStore()

  // Custom states for Add to Playlist Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check initial blocked status
    setIsHidden(isTrackBlocked(track.id))

    // Listen to block updates
    const handleBlockedUpdated = (e: Event) => {
      const customEvent = e as CustomEvent
      const detail = customEvent.detail
      if (!detail) return
      
      if (detail.type === 'track' && detail.id === track.id) {
        setIsHidden(detail.isBlocked)
      }
    }

    window.addEventListener('vw_blocked_updated', handleBlockedUpdated)
    return () => window.removeEventListener('vw_blocked_updated', handleBlockedUpdated)
  }, [track.id])



  const getThemeDetails = (v: string) => {
    switch (v) {
      case 'rose':
        return { color: '#F43F5E', bg: 'rgba(244,63,94,0.06)' }
      case 'blue':
        return { color: '#3ABEF9', bg: 'rgba(58,190,249,0.06)' }
      case 'green':
        return { color: '#05D69E', bg: 'rgba(5,214,158,0.06)' }
      case 'red':
        return { color: '#F73859', bg: 'rgba(247,56,89,0.06)' }
      case 'yellow':
        return { color: '#FACC15', bg: 'rgba(250,204,21,0.06)' }
      case 'purple':
      default:
        return { color: '#9B4DE0', bg: 'rgba(155,77,224,0.06)' }
    }
  }

  const theme = getThemeDetails(variant)
  const themeColor = theme.color
  const activeBg = theme.bg

  function toggleMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  function handleGoToArtist() {
    const slug = track.artist.toLowerCase().replace(/\s+/g, '-')
    window.location.href = `/artist/${encodeURIComponent(slug)}${track.artistId ? `?id=${track.artistId}` : ''}`
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/search?q=${encodeURIComponent(track.title)}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Đã sao chép",
          description: "Đã sao chép liên kết bài hát vào khay nhớ tạm!",
        })
      } else {
        toast({
          title: "Chia sẻ thành công",
          description: "Chia sẻ liên kết thành công!",
        })
      }
    }
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
    <>
      <div
        onClick={handlePlay}
        role="button"
        className={cn(
          "flex items-center gap-4 px-3 py-2.5 rounded-lg group transition-vw hover:bg-white/10 cursor-pointer",
          isActive ? "bg-[var(--vw-active-bg)]" : ""
        )}
        style={{
          '--vw-active-bg': activeBg,
        } as React.CSSProperties}
      >
        {/* Index / play */}
        <div className="w-6 flex items-center justify-center shrink-0 relative">
          {/* Play button shown on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePlay()
            }}
            aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            className="hidden group-hover:flex items-center justify-center"
          >
            {isCurrentlyPlaying
              ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2" width="3" height="12" rx="1" fill={themeColor}/>
                  <rect x="10" y="2" width="3" height="12" rx="1" fill={themeColor}/>
                </svg>
              : <Play size={14} fill={themeColor} style={{ color: themeColor, marginLeft: 1 }} />
            }
          </button>

          {/* Index or Now Playing bars shown when NOT hovered */}
          <div className="block group-hover:hidden">
            {isCurrentlyPlaying ? (
              <div className="flex items-end gap-0.5" aria-label="Now playing">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{
                      backgroundColor: themeColor,
                      height: `${4 + i * 2}px`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <span
                className="text-sm tabular-nums"
                style={{ color: isActive ? themeColor : 'var(--vw-text-muted)' }}
              >
                {index}
              </span>
            )}
          </div>
        </div>
  
        {/* Track art */}
        <div
          className="w-10 h-10 rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-base font-bold"
          style={{
            background: track.albumArt ? 'none' : `linear-gradient(135deg, ${themeColor} 0%, #2A1F3D 100%)`,
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
            className="text-sm font-semibold truncate"
            style={{ 
              color: isActive ? themeColor : 'var(--vw-text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.3px'
            }}
          >
            {track.title}
          </p>
          <p
            className="text-xs truncate mt-0.5"
            style={{ color: 'var(--vw-text-secondary)' }}
          >
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
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 w-8 h-8 transition-vw cursor-pointer hover:bg-white/5 rounded-full opacity-0 group-hover:opacity-100",
              isLiked ? "opacity-100" : ""
            )}
            style={{
              color: isLiked ? '#EF4444' : 'var(--vw-text-muted)',
            }}
          >
            <Heart size={14} fill={isLiked ? '#EF4444' : 'none'} />
            {isLiked && (
              <span className="w-1 h-1 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
            )}
          </button>
  
          <span className="text-xs tabular-nums" style={{ color: 'var(--vw-text-muted)' }}>
            {formatTime(track.duration)}
          </span>
  
          {onRemove && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onRemove()
              }}
              aria-label={removeLabel || "Xóa khỏi danh sách phát"}
              title={removeLabel || "Xóa khỏi danh sách phát"}
              className="transition-all duration-200 text-white/40 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          )}
  
          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                aria-label="More options"
                className={cn(
                  "transition-vw cursor-pointer hover:text-white opacity-0 group-hover:opacity-100",
                  isMenuOpen ? "opacity-100" : ""
                )}
                style={{ color: 'var(--vw-text-muted)' }}
              >
                <MoreHorizontal size={15} />
              </button>
            </DropdownMenuTrigger>
  
            <DropdownMenuContent
              align="start"
              alignOffset={12}
              side="right"
              sideOffset={10}
              className="w-60 rounded-2xl overflow-hidden border-0 p-0 z-50"
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
                    playNext(track)
                    toast({
                      title: "Đã xếp phát tiếp theo",
                      description: `"${track.title}" sẽ được phát tiếp theo.`,
                    })
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
                    addToQueue(track)
                    toast({
                      title: "Đã thêm vào hàng chờ",
                      description: `Đã thêm "${track.title}" vào hàng chờ phát.`,
                    })
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                >
                  <ListPlus size={13} className="text-purple-400" />
                  <span>Thêm vào hàng chờ</span>
                </DropdownMenuItem>
  

  
                {/* Divider */}
                <div className="h-px bg-white/5 my-1 mx-2" />
  
                {/* 4. Đi đến Nghệ sĩ */}
                {!hideGoToArtist && (
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
                )}

                {/* 4.5 Chia sẻ liên kết */}
                <DropdownMenuItem
                  onClick={handleShare}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                >
                  <Share2 size={13} className="text-blue-400" />
                  <span>Chia sẻ liên kết</span>
                </DropdownMenuItem>
  
                {/* 5. Không phát bài này nữa */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBlockTrack(track)
                    toast({
                      title: "Đã chặn bài hát",
                      description: `Đã thêm "${track.title}" vào danh sách chặn.`,
                      action: (
                        <ToastAction altText="Hoàn tác" onClick={() => toggleBlockTrack(track)}>
                          Hoàn tác
                        </ToastAction>
                      )
                    })
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                >
                  <Ban size={13} className="text-red-400/80" />
                  <span>Chặn bài hát này</span>
                </DropdownMenuItem>
  
                {/* 6. Xóa khỏi danh sách phát (Nếu có onRemove) */}
                {onRemove && (
                  <>
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400/80"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      <span>{removeLabel || "Xóa khỏi danh sách phát"}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Playlist Modal */}
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={track}
      />
    </>
  )
}
