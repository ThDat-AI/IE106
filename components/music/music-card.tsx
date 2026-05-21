"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Heart, Trash2, MoreHorizontal, SkipForward, ListPlus, Plus, User, Ban, Share2 } from 'lucide-react'
import { usePlayerStore, type Track, isTrackLiked, toggleLikeTrack, isAlbumSaved, toggleSaveAlbum, isArtistFollowed, toggleFollowArtist, toggleBlockTrack, toggleBlockAlbum, toggleBlockArtist, isTrackBlocked, isAlbumBlocked, isArtistBlocked } from '@/lib/player-store'
import { cn } from '@/lib/utils'
import { CardHoverOverlay } from './card-hover-overlay'
import { searchMusic } from '@/lib/music-api'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import PlaylistModal from './playlist-modal'
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
  playlistTracks?: Track[]
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
  playlistTracks,
  variant = 'default',
  onDelete,
  deleteLabel,
  isLibraryPage = false,
  onHideSuggestion,
}: MusicCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [localTracks, setLocalTracks] = useState<Track[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTracks, setModalTracks] = useState<Track | Track[]>([])
  const { setTrack, currentTrack, isPlaying, togglePlay, playNext, addToQueue } = usePlayerStore()
  const { toast } = useToast()

  useEffect(() => {
    // Check initial blocked status
    let blocked = false
    if (type === 'track') blocked = isTrackBlocked(id)
    else if (type === 'album') blocked = isAlbumBlocked(id)
    else if (type === 'artist') blocked = isArtistBlocked(title)
    setIsHidden(blocked)

    // Listen to block updates
    const handleBlockedUpdated = (e: Event) => {
      const customEvent = e as CustomEvent
      const detail = customEvent.detail
      if (!detail) return
      
      if (type === 'track' && detail.type === 'track' && detail.id === id) {
        setIsHidden(detail.isBlocked)
      } else if (type === 'album' && detail.type === 'album' && detail.id === id) {
        setIsHidden(detail.isBlocked)
      } else if (type === 'artist' && detail.type === 'artist' && detail.name.toLowerCase() === title.toLowerCase()) {
        setIsHidden(detail.isBlocked)
      }
    }

    window.addEventListener('vw_blocked_updated', handleBlockedUpdated)
    return () => window.removeEventListener('vw_blocked_updated', handleBlockedUpdated)
  }, [id, title, type])

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    let shareUrl = ''
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin
      if (href) {
        shareUrl = `${baseUrl}${href}`
      } else if (type === 'album') {
        shareUrl = `${baseUrl}/album/${id}`
      } else if (type === 'playlist') {
        shareUrl = `${baseUrl}/playlist/${id}`
      } else if (type === 'artist') {
        shareUrl = `${baseUrl}/artist/${id}`
      } else {
        shareUrl = `${baseUrl}/search?q=${encodeURIComponent(title)}`
      }
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Đã sao chép",
          description: "Đã sao chép liên kết vào khay nhớ tạm!",
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
    if (type === 'artist') {
      setIsFollowing(isArtistFollowed(title))

      const handleFollowingUpdated = (e: Event) => {
        const customEvent = e as CustomEvent<{ artistName: string; isFollowing: boolean }>
        if (customEvent.detail && customEvent.detail.artistName === title) {
          setIsFollowing(customEvent.detail.isFollowing)
        }
      }

      window.addEventListener('vw_following_updated', handleFollowingUpdated)
      return () => window.removeEventListener('vw_following_updated', handleFollowingUpdated)
    }
  }, [title, type])

  useEffect(() => {
    if (type === 'playlist' && !image && !playlistTracks) {
      const loadPlaylistTracks = () => {
        const stored = localStorage.getItem('vw_saved_playlists')
        if (stored) {
          try {
            const playlists = JSON.parse(stored)
            const found = playlists.find((p: any) => p.id === id)
            if (found && found.tracks) {
              setLocalTracks(found.tracks)
            } else {
              setLocalTracks([])
            }
          } catch (e) {
            setLocalTracks([])
          }
        }
      }
      loadPlaylistTracks()
      window.addEventListener('vw_playlists_updated', loadPlaylistTracks)
      return () => window.removeEventListener('vw_playlists_updated', loadPlaylistTracks)
    }
  }, [id, type, image, playlistTracks])

  const renderCover = (isCompact: boolean) => {
    if (displayImage) {
      return <img src={displayImage} alt={title} className="w-full h-full object-cover" />
    }

    if (type === 'playlist') {
      const validArts = (playlistTracks || localTracks)
        ?.map(t => t.albumArt)
        .filter((art): art is string => !!art) || []

      if (validArts.length >= 4) {
        return (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            <img src={validArts[0]} alt="" className="w-full h-full object-cover" />
            <img src={validArts[1]} alt="" className="w-full h-full object-cover" />
            <img src={validArts[2]} alt="" className="w-full h-full object-cover" />
            <img src={validArts[3]} alt="" className="w-full h-full object-cover" />
          </div>
        )
      } else if (validArts.length > 0) {
        return (
          <img
            src={validArts[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        )
      }
    }

    return (
      <div 
        className="w-full h-full flex items-center justify-center font-bold"
        style={{ 
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, 
          color: 'rgba(255,255,255,0.3)',
          fontSize: isCompact ? '1.25rem' : '2.25rem'
        }}
      >
        {title.charAt(0).toUpperCase()}
      </div>
    )
  }

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

  const isCurrentlyPlaying = type === 'artist'
    ? currentTrack?.artist === title && isPlaying
    : currentTrack?.id === id && isPlaying
  const shouldScroll = title.length > 18

  async function handlePlay(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (track) {
      if (currentTrack?.id === id) {
        togglePlay()
      } else {
        setTrack(track)
      }
    } else if (type === 'artist') {
      if (currentTrack?.artist === title) {
        togglePlay()
      } else {
        try {
          const tracks = await searchMusic(title, 10)
          if (tracks && tracks.length > 0) {
            const store = usePlayerStore.getState()
            store.setTrack(tracks[0])
            store.setQueue(tracks)
          }
        } catch (err) {
          console.error('Failed to play artist:', err)
        }
      }
    } else if (type === 'album' || type === 'playlist') {
      try {
        const tracks = playlistTracks && playlistTracks.length > 0
          ? playlistTracks
          : await searchMusic(title, 10)

        if (tracks && tracks.length > 0) {
          const store = usePlayerStore.getState()
          store.setTrack(tracks[0])
          store.setQueue(tracks)
        }
      } catch (err) {
        console.error(`Failed to play ${type}:`, err)
      }
    }
  }

  function handleFollow(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const newFollowingState = toggleFollowArtist(title)
    setIsFollowing(newFollowingState)
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

  const getTracks = async (): Promise<Track[]> => {
    if (type === 'track') {
      if (track) return [track]
      return [{
        id,
        title,
        artist: subtitle,
        album: title,
        albumArt: image || '',
        duration: 200,
        url: ''
      }]
    }
    if (playlistTracks && playlistTracks.length > 0) {
      return playlistTracks
    }
    if (localTracks && localTracks.length > 0) {
      return localTracks
    }
    try {
      return await searchMusic(title, 15)
    } catch (e) {
      return []
    }
  }

  if (isHidden) return null

  const displayImage = track?.albumArt || image

  if (type === 'artist') {
    const cleanedClassName = className ? className.replace(/\bcard-hover\b/g, '') : ''
    const artistCard = (
      <div
        className={cn('relative flex flex-col items-center text-center cursor-pointer group w-full transition-transform duration-200 hover:scale-[1.04]', cleanedClassName)}
      >
        {/* Circular Image Container */}
        <div 
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
          className="relative w-full aspect-square rounded-full overflow-hidden mb-3 border border-white/10 shadow-lg transition-shadow duration-200 group-hover:shadow-[0_12px_30px_rgba(155,77,224,0.25)] cursor-pointer"
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
          
          {/* Hover Overlay with follow and dropdown controls */}
          <CardHoverOverlay
            isLiked={isFollowing}
            onLike={handleFollow}
            isCurrentlyPlaying={isCurrentlyPlaying}
            onPlay={handlePlay}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            className="group-hover:opacity-100"
            likeTitle={isFollowing ? `Bỏ theo dõi ${title}` : `Theo dõi ${title}`}
            menuContent={
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
                  {/* 1. Theo dõi / Bỏ theo dõi */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFollow(e)
                    }}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-98 outline-none",
                      isFollowing
                        ? "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                        : "text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                    )}
                  >
                    {isFollowing ? (
                      <>
                        <Trash2 size={13} className="text-red-400/80" />
                        <span>Bỏ theo dõi</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} className="text-purple-400" />
                        <span>Theo dõi</span>
                      </>
                    )}
                  </DropdownMenuItem>

                  {/* Divider */}
                  <div className="h-px bg-white/5 my-1 mx-2" />

                  {/* 1.5 Chia sẻ liên kết */}
                  <DropdownMenuItem
                    onClick={handleShare}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                  >
                    <Share2 size={13} className="text-blue-400" />
                    <span>Chia sẻ liên kết</span>
                  </DropdownMenuItem>

                  {/* Divider */}
                  <div className="h-px bg-white/5 my-1 mx-2" />

                  {/* 2. Không hiện nghệ sĩ này nữa */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      const artistObj = { name: title, image: displayImage }
                      toggleBlockArtist(artistObj)
                      toast({
                        title: "Đã chặn nghệ sĩ",
                        description: `Đã thêm nghệ sĩ "${title}" vào danh sách chặn.`,
                        action: (
                          <ToastAction altText="Hoàn tác" onClick={() => toggleBlockArtist(artistObj)}>
                            Hoàn tác
                          </ToastAction>
                        )
                      })
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                  >
                    <Ban size={13} className="text-red-400/80" />
                    <span>Chặn nghệ sĩ này</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            }
          />
        </div>
        
        {/* Centered Artist Info */}
        <div
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
          className="px-2 w-full cursor-pointer"
        >
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
      <div
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
        className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5 relative cursor-pointer"
      >
        {renderCover(true)}
        {/* Compact play overlay */}
        <div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={14} fill="white" className="text-white" />
        </div>
      </div>
      <div
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
        className="min-w-0 flex-1 cursor-pointer"
      >
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
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
        className={cn(
          "relative w-full flex items-center justify-center text-4xl font-display font-bold overflow-hidden cursor-pointer",
          type === 'track' 
            ? 'vw-song-art' 
            : type === 'playlist' 
              ? 'vw-playlist-art' 
              : 'vw-album-art'
        )}
        style={{
          aspectRatio: '1/1',
        }}
      >
        {renderCover(false)}

        {/* Hover overlay with control buttons */}
        <CardHoverOverlay
          isLiked={isLiked}
          onLike={handleLike}
          isCurrentlyPlaying={isCurrentlyPlaying}
          onPlay={handlePlay}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          className="group-hover:opacity-100"
          likeTitle={isLibraryPage && (type === 'album' || type === 'playlist') ? (type === 'album' ? "Xóa album" : "Xóa danh sách phát") : (isLiked ? `Unlike ${title}` : `Like ${title}`)}
          onDelete={onDelete && type !== 'album' && type !== 'playlist' ? (e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(id)
          } : undefined}
          deleteLabel={deleteLabel}
          menuContent={
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
                {type === 'album' ? (
                  <>
                    {/* 1. Phát tiếp theo */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          playNext(tracks)
                          toast({
                            title: "Đã xếp phát tiếp theo",
                            description: `Đã xếp phát tiếp theo các bài hát trong album "${title}".`,
                          })
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <SkipForward size={13} className="text-purple-400" />
                      <span>Phát tiếp theo</span>
                    </DropdownMenuItem>

                    {/* 2. Thêm vào hàng chờ */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          addToQueue(tracks)
                          toast({
                            title: "Đã thêm vào hàng chờ",
                            description: `Đã thêm các bài hát trong album "${title}" vào hàng chờ phát.`,
                          })
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <ListPlus size={13} className="text-purple-400" />
                      <span>Thêm vào hàng chờ</span>
                    </DropdownMenuItem>

                    {/* 3. Thêm vào Playlist */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          setModalTracks(tracks)
                          setIsModalOpen(true)
                        }
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

                    {/* 6. Chặn album này */}
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        const albumObj = { id, title, artist: subtitle, albumArt: displayImage }
                        toggleBlockAlbum(albumObj)
                        toast({
                          title: "Đã chặn album",
                          description: `Đã thêm album "${title}" vào danh sách chặn.`,
                          action: (
                            <ToastAction altText="Hoàn tác" onClick={() => toggleBlockAlbum(albumObj)}>
                              Hoàn tác
                            </ToastAction>
                          )
                        })
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                    >
                      <Ban size={13} className="text-red-400/80" />
                      <span>Chặn album này</span>
                    </DropdownMenuItem>


                  </>
                ) : type === 'playlist' ? (
                  <>
                    {/* 1. Phát tiếp theo */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          playNext(tracks)
                          toast({
                            title: "Đã xếp phát tiếp theo",
                            description: `Đã xếp phát tiếp theo các bài hát trong danh sách phát "${title}".`,
                          })
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <SkipForward size={13} className="text-purple-400" />
                      <span>Phát tiếp theo</span>
                    </DropdownMenuItem>

                    {/* 2. Thêm vào hàng chờ */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          addToQueue(tracks)
                          toast({
                            title: "Đã thêm vào hàng chờ",
                            description: `Đã thêm các bài hát trong danh sách phát "${title}" vào hàng chờ phát.`,
                          })
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <ListPlus size={13} className="text-purple-400" />
                      <span>Thêm vào hàng chờ</span>
                    </DropdownMenuItem>

                    {/* 2.2 Thêm vào Playlist */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          setModalTracks(tracks)
                          setIsModalOpen(true)
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <Plus size={13} className="text-purple-400" />
                      <span>Thêm vào Playlist</span>
                    </DropdownMenuItem>

                    {/* 2.5 Chia sẻ liên kết */}
                    <DropdownMenuItem
                      onClick={handleShare}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <Share2 size={13} className="text-blue-400" />
                      <span>Chia sẻ liên kết</span>
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
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          playNext(tracks[0])
                          toast({
                            title: "Đã xếp phát tiếp theo",
                            description: `Bài hát "${title}" sẽ được phát tiếp theo.`,
                          })
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <SkipForward size={13} className="text-purple-400" />
                      <span>Phát tiếp theo</span>
                    </DropdownMenuItem>

                    {/* 2. Thêm vào hàng chờ */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          addToQueue(tracks[0])
                          toast({
                            title: "Đã thêm vào hàng chờ",
                            description: `Đã thêm bài hát "${title}" vào hàng chờ phát.`,
                          })
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <ListPlus size={13} className="text-purple-400" />
                      <span>Thêm vào hàng chờ</span>
                    </DropdownMenuItem>

                    {/* 3. Thêm vào Playlist */}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation()
                        const tracks = await getTracks()
                        if (tracks.length > 0) {
                          setModalTracks(tracks[0])
                          setIsModalOpen(true)
                        }
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

                    {/* 5. Không phát bài này nữa */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        const targetTrack = track || { id, title, artist: subtitle, albumArt: displayImage, duration: 0, url: '' }
                        toggleBlockTrack(targetTrack)
                        toast({
                          title: "Đã chặn bài hát",
                          description: `Đã thêm "${title}" vào danh sách chặn.`,
                          action: (
                            <ToastAction altText="Hoàn tác" onClick={() => toggleBlockTrack(targetTrack)}>
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
                  </>
                )}
              </div>
            </DropdownMenuContent>
          }
        />

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
      <div
        onClick={handlePlay}
        role="button"
        tabIndex={0}
        aria-label={isCurrentlyPlaying ? `Pause ${title}` : `Play ${title}`}
        className="p-3 cursor-pointer"
      >
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

  return (
    <>
      {href ? <Link href={href}>{card}</Link> : card}
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={modalTracks}
        toastContext={type === 'track' ? 'bài hát' : type === 'album' ? 'album' : 'danh sách phát'}
      />
    </>
  )
}
