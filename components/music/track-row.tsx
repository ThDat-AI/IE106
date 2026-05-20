"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Heart, MoreHorizontal, SkipForward, ListPlus, Plus, User, Ban, X, Check, Share2 } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack } from '@/lib/player-store'
import { cn } from '@/lib/utils'
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
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  // Custom states for Add to Playlist Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')
  const [toast, setToast] = useState<{ text: string, type: 'success' | 'info' } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function triggerToast(text: string, type: 'success' | 'info') {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddToPlaylist = (playlistId: string, playlistTitle: string) => {
    const stored = localStorage.getItem('vw_saved_playlists')
    let allPlaylists = []
    if (stored) {
      try {
        allPlaylists = JSON.parse(stored)
      } catch (e) {}
    }

    let trackAlreadyExists = false
    const updated = allPlaylists.map((p: any) => {
      if (p.id === playlistId) {
        const tracks = p.tracks || []
        if (tracks.some((t: any) => t.id === track.id)) {
          trackAlreadyExists = true
          return p
        }
        const updatedTracks = [...tracks, track]
        const durationMin = Math.floor(updatedTracks.reduce((acc: number, t: any) => acc + t.duration, 0) / 60)
        return {
          ...p,
          subtitle: `${updatedTracks.length} bài hát · ${durationMin} phút`,
          tracks: updatedTracks
        }
      }
      return p
    })

    if (trackAlreadyExists) {
      triggerToast(`Bài hát "${track.title}" đã có trong danh sách phát!`, 'info')
      return
    }

    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))
    window.dispatchEvent(new Event('vw_playlists_updated'))
    triggerToast(`Đã thêm "${track.title}" vào danh sách phát "${playlistTitle}"!`, 'success')
    setIsModalOpen(false)
  }

  const handleCreatePlaylistAndAdd = (title: string, desc: string) => {
    if (!title.trim()) return

    const stored = localStorage.getItem('vw_saved_playlists') || '[]'
    let allPlaylists = []
    try {
      allPlaylists = JSON.parse(stored)
    } catch (e) {}

    const newId = 'custom_' + Date.now()
    const newPlaylist = {
      id: newId,
      title: title.trim(),
      subtitle: `1 bài hát · ${Math.floor(track.duration / 60)} phút`,
      image: undefined,
      href: `/playlist/${newId}`,
      type: 'playlist',
      description: desc.trim() || 'Danh sách phát cá nhân của bạn.',
      tracks: [track]
    }

    const updated = [newPlaylist, ...allPlaylists]
    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))
    window.dispatchEvent(new Event('vw_playlists_updated'))
    triggerToast(`Đã tạo danh sách phát "${title}" và thêm bài hát!`, 'success')
    
    // Reset inputs
    setNewPlaylistTitle('')
    setNewPlaylistDesc('')
    setIsCreatingNew(false)
    setIsModalOpen(false)
  }

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
        triggerToast('Đã sao chép liên kết bài hát vào khay nhớ tạm!', 'success')
      } else {
        triggerToast('Chia sẻ liên kết thành công!', 'success')
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
        className={cn(
          "flex items-center gap-4 px-3 py-2.5 rounded-lg group transition-vw hover:bg-white/10",
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
            onClick={handlePlay}
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
                    const stored = localStorage.getItem('vw_saved_playlists')
                    let loadedPlaylists = []
                    if (stored) {
                      try {
                        loadedPlaylists = JSON.parse(stored)
                      } catch (err) {}
                    }
                    setPlaylists(loadedPlaylists)
                    setIsModalOpen(true)
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                >
                  <Plus size={13} className="text-purple-400" />
                  <span>Thêm vào Playlist</span>
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
                    setIsHidden(true)
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                >
                  <Ban size={13} className="text-red-400/80" />
                  <span>Không phát bài này nữa</span>
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
  
      {/* Playlist Modal & Toast Portals */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <>
          {/* Playlist Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-[#070509]/80 backdrop-blur-md transition-opacity duration-300 cursor-default"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsModalOpen(false)
                }}
              />
      
              {/* Modal Container */}
              <div
                className="relative w-full max-w-md bg-[#130E1B]/95 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-[10000] transition-all duration-300"
                style={{
                  background: 'linear-gradient(180deg, rgba(30,22,43,0.95) 0%, rgba(16,12,23,0.98) 100%)',
                  boxShadow: '0 24px 64px -16px rgba(155,77,224,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                {/* Ambient Background Lights */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/25 blur-[65px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/25 blur-[65px] pointer-events-none" />
      
                {/* Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div>
                    <h2 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                      {isCreatingNew ? (
                        <>Tạo danh sách phát mới</>
                      ) : (
                        <>Thêm vào Danh sách phát</>
                      )}
                    </h2>
                    <p className="text-xs text-white/50 mt-1 max-w-[280px]">
                      {isCreatingNew ? (
                        <>Tạo một danh sách phát của riêng bạn để thêm bài hát này.</>
                      ) : (
                        <>Chọn một danh sách phát để lưu trữ bài hát này.</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (isCreatingNew) {
                        setIsCreatingNew(false)
                      } else {
                        setIsModalOpen(false)
                      }
                    }}
                    className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
      
                {/* Content Area */}
                {!isCreatingNew ? (
                  <div className="relative z-10 space-y-4">
                    {/* Playlists List container */}
                    <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-white/10 text-left">
                      {playlists.length > 0 ? (
                        playlists.map((playlist: any) => (
                          <button
                            key={playlist.id}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToPlaylist(playlist.id, playlist.title)
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/10 hover:shadow-md transition-all duration-200 text-left group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Cover Thumbnail */}
                              <div
                                className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold border border-white/10 overflow-hidden"
                                style={{
                                  background: playlist.image ? 'none' : 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
                                  color: 'rgba(255,255,255,0.7)',
                                }}
                              >
                                {playlist.image ? (
                                  <img src={playlist.image} alt={playlist.title} className="w-full h-full object-cover" />
                                ) : (
                                  playlist.title.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-white/90 truncate group-hover:text-purple-300 transition-colors">
                                  {playlist.title}
                                </h4>
                                <p className="text-[10px] text-white/40 truncate mt-0.5">
                                  {playlist.tracks?.length || 0} bài hát
                                </p>
                              </div>
                            </div>
                            
                            <div className="w-8 h-8 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 flex items-center justify-center border border-white/10 text-white/60 hover:text-white transition-all">
                              <Plus size={14} />
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                          <p className="text-xs text-white/40">Bạn chưa có danh sách phát nào.</p>
                        </div>
                      )}
                    </div>
      
                    {/* Bottom Action: Create Playlist */}
                    <div className="pt-4 border-t border-white/5">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsCreatingNew(true)
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9B4DE0]/20 to-[#7C3AED]/20 hover:from-[#9B4DE0]/30 hover:to-[#7C3AED]/30 border border-[#9B4DE0]/30 text-white text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm"
                      >
                        <Plus size={15} />
                        <span>Tạo danh sách phát mới</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Create Playlist Sub-view */
                  <div className="relative z-10 space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tên playlist</label>
                      <input
                        type="text"
                        value={newPlaylistTitle}
                        onChange={(e) => setNewPlaylistTitle(e.target.value)}
                        placeholder="Nhập tên danh sách phát..."
                        maxLength={50}
                        className="w-full px-4 py-3 rounded-2xl bg-[#16121E] border border-white/10 focus:border-purple-500/50 text-white text-xs outline-none transition-all duration-300 focus:bg-white/[0.05]"
                      />
                    </div>
      
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Mô tả (Không bắt buộc)</label>
                      <textarea
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        placeholder="Thêm mô tả cho danh sách phát này..."
                        rows={2}
                        maxLength={150}
                        className="w-full px-4 py-3 rounded-2xl bg-[#16121E] border border-white/10 focus:border-purple-500/50 text-white text-xs outline-none transition-all duration-300 focus:bg-white/[0.05] resize-none"
                      />
                    </div>
      
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsCreatingNew(false)
                        }}
                        className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-bold transition-all duration-200 cursor-pointer text-center"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCreatePlaylistAndAdd(newPlaylistTitle, newPlaylistDesc)
                        }}
                        disabled={!newPlaylistTitle.trim()}
                        className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9B4DE0] to-[#7C3AED] hover:from-[#aa62ee] hover:to-[#8b44e3] disabled:from-white/5 disabled:to-white/5 disabled:border-white/10 disabled:text-white/20 text-white text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer text-center"
                      >
                        Tạo và Thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      
          {/* Toast notification */}
          {toast && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10001] transition-all duration-300 animate-in fade-in slide-in-from-top-5">
              <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#16121E]/95 border ${toast.type === 'success' ? 'border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.15)]' : 'border-purple-500/30 shadow-[0_10px_30px_rgba(155,77,224,0.15)]'} backdrop-blur-xl`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                  {toast.type === 'success' ? <Check size={14} /> : <Ban size={14} />}
                </div>
                <span className="text-sm font-medium text-white/90">{toast.text}</span>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  )
}
