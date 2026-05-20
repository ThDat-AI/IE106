"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Heart, Trash2, MoreHorizontal, SkipForward, ListPlus, Plus, User, Ban } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack, isAlbumSaved, toggleSaveAlbum } from '@/lib/player-store'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

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
  isLibraryPage?: boolean
  onHideSuggestion?: (id: string) => void
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
  isLibraryPage = false,
  onHideSuggestion,
}: MusicCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  useEffect(() => {
    if (type === 'album') {
      setIsLiked(isAlbumSaved(id))

      const handleAlbumsUpdated = () => {
        setIsLiked(isAlbumSaved(id))
      }

      window.addEventListener('vw_albums_updated', handleAlbumsUpdated)
      return () => window.removeEventListener('vw_albums_updated', handleAlbumsUpdated)
    } else if (type === 'playlist') {
      setIsLiked(true)
    } else if (track) {
      setIsLiked(isTrackLiked(track.id))

      const handleLikesUpdated = (e: Event) => {
        const customEvent = e as CustomEvent<{ trackId: string; isLiked: boolean }>
        if (customEvent.detail && customEvent.detail.trackId === track.id) {
          setIsLiked(customEvent.detail.isLiked)
        }
      }

      window.addEventListener('vw_likes_updated', handleLikesUpdated)
      return () => window.removeEventListener('vw_likes_updated', handleLikesUpdated)
    }
  }, [track, id, type])

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
    if (type === 'album') {
      if (isLibraryPage && onDelete) {
        onDelete(id)
      } else {
        const newSavedState = toggleSaveAlbum({
          id,
          title,
          subtitle,
          image: displayImage,
          href: href || `/album/${id}`
        })
        setIsLiked(newSavedState)
      }
    } else if (type === 'playlist') {
      if (onDelete) {
        onDelete(id)
      }
    } else if (track) {
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
    const artistName = track?.artist || subtitle
    if (artistName) {
      const slug = artistName.toLowerCase().replace(/\s+/g, '-')
      window.location.href = `/artist/${encodeURIComponent(slug)}${track?.artistId ? `?id=${track.artistId}` : ''}`
    }
  }

  if (isHidden) return null

  const displayImage = track?.albumArt || image

  if (type === 'artist') {
    const artistCard = (
      <div
        className={cn('relative flex flex-col items-center text-center cursor-pointer group w-full transition-transform duration-200 hover:scale-[1.04]', className)}
      >
        {/* Circular Image Container */}
        <div 
          className="relative w-full aspect-square rounded-full overflow-hidden mb-3 border border-white/10 shadow-lg transition-shadow duration-200 group-hover:shadow-[0_12px_30px_rgba(155,77,224,0.25)]"
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
            className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100"
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
          <p className="text-xs text-white/70 font-medium truncate mt-0.5">
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
        <p className="text-xs text-white/70 font-medium truncate">{subtitle}</p>
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
      className={cn(
        'group relative', 
        type === 'track' 
          ? 'vw-song-card' 
          : type === 'playlist' 
            ? 'vw-playlist-card' 
            : 'vw-album-card', 
        className
      )}
    >
      {/* Art square */}
      <div
        className={cn(
          "relative w-full flex items-center justify-center text-4xl font-display font-bold overflow-hidden",
          type === 'track' 
            ? 'vw-song-art' 
            : type === 'playlist' 
              ? 'vw-playlist-art' 
              : 'vw-album-art'
        )}
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

        {/* Hover overlay with control buttons */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-3.5 transition-opacity duration-200 z-10 bg-black/50 opacity-0 group-hover:opacity-100",
            isMenuOpen ? "opacity-100" : ""
          )}
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
            title={isLibraryPage && (type === 'album' || type === 'playlist') ? (type === 'album' ? "Xóa album" : "Xóa danh sách phát") : (isLiked ? `Unlike ${title}` : `Like ${title}`)}
            aria-label={isLiked ? `Unlike ${title}` : `Like ${title}`}
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

          {/* 3. Three dots / Delete button on the RIGHT */}
          {onDelete && type !== 'album' && type !== 'playlist' ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete(id)
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-red-500 hover:text-white cursor-pointer"
              style={{
                backgroundColor: 'rgba(23,15,35,0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.75)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              title={deleteLabel || "Xóa"}
              aria-label={deleteLabel || "Xóa"}
            >
              <Trash2 size={14} />
            </button>
          ) : (
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
                  {type === 'album' ? (
                    <>
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

                      {/* 5. Xóa khỏi thư viện / Thêm vào thư viện */}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isLibraryPage && onDelete) {
                            onDelete(id)
                          } else {
                            toggleSaveAlbum({
                              id,
                              title,
                              subtitle,
                              image: displayImage,
                              href: href || `/album/${id}`
                            })
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-98 outline-none",
                          isLiked
                            ? "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                            : "text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                        )}
                      >
                        {isLiked ? (
                          <>
                            <Trash2 size={13} className="text-red-400/80" />
                            <span>Xóa khỏi Thư viện</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} className="text-purple-400" />
                            <span>Thêm vào Thư viện</span>
                          </>
                        )}
                      </DropdownMenuItem>

                      {/* 6. Không gợi ý album này nữa */}
                      {onHideSuggestion && (
                        <>
                          <div className="h-px bg-white/5 my-1 mx-2" />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onHideSuggestion(id)
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                          >
                            <Ban size={13} className="text-red-400/80" />
                            <span>Không gợi ý album này nữa</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  ) : type === 'playlist' ? (
                    <>
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

                      {/* Divider */}
                      <div className="h-px bg-white/5 my-1 mx-2" />

                      {/* 3. Xóa danh sách phát */}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onDelete) {
                            onDelete(id)
                          }
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                      >
                        <Trash2 size={13} className="text-red-400/80" />
                        <span>Xóa danh sách phát</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

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
        {shouldScroll ? (
          <div className="w-full overflow-hidden whitespace-nowrap mb-1 relative">
            <span
              className="text-sm font-semibold leading-tight inline-block max-w-full truncate group-hover:hidden"
              style={{
                color: 'var(--vw-text-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
              }}
            >
              {title}
            </span>
            <span
              className="text-sm font-semibold leading-tight hidden group-hover:inline-block animate-[marquee-scroll_6s_linear_infinite_alternate]"
              style={{
                color: 'var(--vw-text-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
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
