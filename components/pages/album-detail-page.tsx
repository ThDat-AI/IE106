"use client"

import { Play, Shuffle, MoreHorizontal, Clock, ExternalLink, ChevronLeft, Calendar, Music2, SkipForward, ListPlus, Plus, Trash2, Check, Info, Share2 } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PlaylistModal from '@/components/music/playlist-modal'
import { getAlbumInfo, getAlbumTracks, searchAlbums } from '@/lib/music-api'
import {
  AmbientOrbs,
  GlassPanel,
  SectionHeader,
  AccentBar,
  AiBadge
} from '@/components/ui/vibewave'
import { useRouter } from 'next/navigation'

export default function AlbumDetailPage({
  slug,
  initialAlbumInfo,
  initialTracks
}: {
  slug: string,
  initialAlbumInfo?: any,
  initialTracks?: Track[]
}) {
  const router = useRouter()
  const { setTrack, setQueue, currentTrack, isPlaying, togglePlay, isShuffle } = usePlayerStore()
  const [tracks, setTracks] = useState<Track[]>(initialTracks || [])
  const [albumInfo, setAlbumInfo] = useState<any>(initialAlbumInfo || null)
  const [moreFromArtist, setMoreFromArtist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(!initialAlbumInfo && !initialTracks)
  const [isLiked, setIsLiked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null)

  useEffect(() => {
    if (albumInfo) {
      const stored = localStorage.getItem('vw_saved_albums')
      if (stored) {
        try {
          const list = JSON.parse(stored)
          const exists = list.some((a: any) => String(a.id) === String(albumInfo.id))
          setIsLiked(exists)
        } catch (e) {}
      }
    }
  }, [albumInfo])

  const toggleSaveAlbum = () => {
    if (!albumInfo) return
    const stored = localStorage.getItem('vw_saved_albums')
    let list = []
    if (stored) {
      try {
        list = JSON.parse(stored)
      } catch (e) {}
    }
    const exists = list.some((a: any) => String(a.id) === String(albumInfo.id))
    let newList = []
    if (exists) {
      newList = list.filter((a: any) => String(a.id) !== String(albumInfo.id))
      setToastMessage({ text: `Đã xóa album "${albumInfo.title}" khỏi thư viện`, type: 'success' })
    } else {
      const albumArt = albumInfo.image || albumInfo.albumArt || ''
      const artistName = albumInfo.artist || ''
      const albumData = {
        id: albumInfo.id,
        title: albumInfo.title,
        subtitle: artistName || albumInfo.subtitle || '',
        image: albumArt,
        href: `/album/${albumInfo.id}`
      }
      newList = [albumData, ...list]
      setToastMessage({ text: `Đã thêm album "${albumInfo.title}" vào thư viện!`, type: 'success' })
    }
    localStorage.setItem('vw_saved_albums', JSON.stringify(newList))
    setIsLiked(!exists)
    setTimeout(() => setToastMessage(null), 3000)
    window.dispatchEvent(new Event('vw_albums_updated'))
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof window !== 'undefined' && albumInfo) {
      const shareUrl = `${window.location.origin}/album/${albumInfo.id}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
        setToastMessage({ text: 'Đã sao chép liên kết album vào khay nhớ tạm!', type: 'success' })
      } else {
        setToastMessage({ text: 'Chia sẻ liên kết thành công!', type: 'success' })
      }
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  useEffect(() => {
    async function loadAlbumData() {
      // Only fetch if initial data is missing
      if (!albumInfo || tracks.length === 0) {
        setIsLoading(true)
        const isId = /^\d+$/.test(slug)
        let info = null
        let albumTracks: Track[] = []

        if (isId) {
          info = await getAlbumInfo(slug)
          if (info) albumTracks = await getAlbumTracks(slug)
        } else {
          let decodedSlug = slug
          try {
            decodedSlug = decodeURIComponent(slug)
          } catch (e) {
            console.error('Failed to decode slug:', e)
          }
          const title = decodedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          const searchResults = await searchAlbums(title, 1)
          if (searchResults.length > 0) {
            info = searchResults[0]
            albumTracks = await getAlbumTracks(info.id)
          }
        }
        setAlbumInfo(info)
        setTracks(albumTracks)
        setIsLoading(false)
      }

      // Always fetch more from artist if we have an artist name
      const currentArtist = albumInfo?.artist || (initialAlbumInfo?.artist)
      if (currentArtist) {
        const more = await searchAlbums(currentArtist, 5)
        const currentId = albumInfo?.id || initialAlbumInfo?.id || slug
        setMoreFromArtist(more.filter(a => String(a.id) !== String(currentId)).slice(0, 4))
      }
    }
    loadAlbumData()
  }, [slug, initialAlbumInfo, initialTracks])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-white/40 tracking-wider uppercase">Đang đồng bộ âm nhạc...</p>
      </div>
    )
  }

  if (!albumInfo && tracks.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
          <Music2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white/90">Không tìm thấy album</h2>
          <p className="text-white/50 max-w-xs">Giai điệu này có vẻ đã lạc trôi. Hãy thử tìm kiếm một album khác.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 transition-vw text-sm font-semibold"
        >
          <ChevronLeft size={18} /> Quay lại
        </button>
      </div>
    )
  }

  const title = albumInfo?.title || "Album"
  const artist = albumInfo?.artist || "Nghệ sĩ"
  const year = albumInfo?.release_date ? new Date(albumInfo.release_date).getFullYear() : ""
  const albumArt = albumInfo?.albumArt || tracks[0]?.albumArt

  return (
    <div className="relative pb-24">
      <AmbientOrbs position="absolute" />

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#16121E]/95 border ${toastMessage.type === 'success' ? 'border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.15)]' : 'border-purple-500/30 shadow-[0_10px_30px_rgba(155,77,224,0.15)]'} backdrop-blur-xl`}>
            {toastMessage.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Check size={14} className="text-emerald-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Info size={14} className="text-purple-400" />
              </div>
            )}
            <span className="text-sm font-medium text-white/90">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-vw group"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
          {/* Album Cover */}
          <div className="relative group">
            <div
              className="absolute -inset-4 bg-purple-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
              style={{ backgroundColor: 'rgba(155,77,224,0.15)' }}
            />
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border border-white/10">
              {albumArt ? (
                <img src={albumArt} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-900 text-7xl font-display font-bold text-white/30">
                  {title.charAt(0)}
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => {
                    if (tracks.length > 0) {
                      setQueue(tracks)
                      setTrack(tracks[0])
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform cursor-pointer"
                >
                  <Play size={24} fill="white" className="ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Album Details */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-white/60">
                <Link
                  href={`/artist/${encodeURIComponent(artist.toLowerCase().replace(/\s+/g, '-'))}${albumInfo?.artistId ? `?id=${albumInfo.artistId}` : ''}`}
                  className="flex items-center gap-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden border border-purple-500/30">
                    {albumArt ? <img src={albumArt} className="w-full h-full object-cover opacity-60" /> : artist.charAt(0)}
                  </div>
                  {artist}
                </Link>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar size={14} className="text-white/40" />
                  {year}
                </div>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Music2 size={14} className="text-white/40" />
                  {tracks.length} bài hát
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => {
                  if (tracks.length > 0) {
                    setQueue(tracks)
                    setTrack(tracks[0])
                  }
                }}
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)' }}
              >
                <Play size={20} fill="white" />
                <span>Phát ngay</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                onClick={() => {
                  if (tracks.length > 0) {
                    if (isShuffle) {
                      usePlayerStore.setState({ isShuffle: false })
                    } else {
                      usePlayerStore.setState({ isShuffle: true })
                      const shuffled = [...tracks].sort(() => Math.random() - 0.5)
                      setQueue(shuffled)
                      setTrack(shuffled[0])
                    }
                  }
                }}
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-vw cursor-pointer shadow-sm shrink-0",
                  isShuffle
                    ? "text-[#9B4DE0] bg-[#9B4DE0]/10 border border-[#9B4DE0]/30 shadow-[0_0_12px_rgba(155,77,224,0.15)] scale-[0.98]"
                    : "text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                )}
                aria-label="Trộn bài"
              >
                <Shuffle size={18} />
                {isShuffle && (
                  <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9B4DE0] shadow-[0_0_8px_rgba(155,77,224,0.6)] animate-in scale-in duration-300" />
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-vw cursor-pointer outline-none">
                    <MoreHorizontal size={20} />
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
                        if (tracks.length > 0) {
                          usePlayerStore.getState().playNext(tracks)
                          setToastMessage({ text: 'Đã thêm album vào hàng chờ phát tiếp theo!', type: 'success' })
                          setTimeout(() => setToastMessage(null), 3000)
                        }
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
                        if (tracks.length > 0) {
                          usePlayerStore.getState().addToQueue(tracks)
                          setToastMessage({ text: 'Đã thêm album vào hàng chờ phát!', type: 'success' })
                          setTimeout(() => setToastMessage(null), 3000)
                        }
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
                        if (tracks.length > 0) {
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

                    {/* 3.5 Chia sẻ liên kết */}
                    <DropdownMenuItem
                      onClick={handleShare}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <Share2 size={13} className="text-blue-400" />
                      <span>Chia sẻ liên kết</span>
                    </DropdownMenuItem>

                    {/* Divider */}
                    <div className="h-px bg-white/5 my-1 mx-2" />

                    {/* 4. Lưu / Xóa Thư viện */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSaveAlbum()
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
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
        {/* Track List */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AccentBar color="purple" />
            <h2 className="text-2xl font-display font-bold text-white/90">Danh sách bài hát</h2>
          </div>

          <GlassPanel variant="dark" className="vw-playlist-table border-white/5">
             <div className="flex items-center gap-4 px-5 py-3 border-b border-white/5 opacity-80">
               <div className="w-6 flex items-center justify-center shrink-0">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-center">#</span>
               </div>
               <div className="flex-1 flex items-center gap-4 min-w-0">
                 <div className="w-10 shrink-0" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Tiêu đề</span>
               </div>
               <div className="w-20 flex justify-end shrink-0 pr-4">
                 <Clock size={14} />
               </div>
             </div>
            <div className="p-2 space-y-1">
              {tracks.map((track, i) => (
                <TrackRow
                  key={track.id}
                  index={i + 1}
                  track={track}
                  showAlbum={false}
                  playlistTracks={tracks}
                />
              ))}
            </div>
          </GlassPanel>

        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Artist Card */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AccentBar color="blue" />
              <h2 className="text-xl font-display font-bold text-white/90">Nghệ sĩ</h2>
            </div>

            <GlassPanel className="p-6 text-center space-y-4 group">
              <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-colors">
                {albumArt ? (
                  <img src={albumArt} alt={artist} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-3xl font-display font-bold">
                    {artist.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{artist}</h3>
                <p className="text-sm text-white/70">{albumInfo?.genre || 'V-Pop Artist'}</p>
              </div>
              <Link
                href={`/artist/${encodeURIComponent(artist.toLowerCase().replace(/\s+/g, '-'))}${albumInfo?.artistId ? `?id=${albumInfo.artistId}` : ''}`}
                className="block w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-vw"
              >
                Xem hồ sơ
              </Link>
            </GlassPanel>
          </div>

          {/* More from Artist */}
          {moreFromArtist.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <AccentBar color="pink" />
                <h2 className="text-xl font-display font-bold text-white/90">Gợi ý khác</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {moreFromArtist.map((item) => (
                  <Link
                    key={item.id}
                    href={`/album/${item.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-vw group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5 vw-album-art">
                      <img src={item.albumArt} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold truncate group-hover:text-purple-400 transition-colors"
                        style={{
                          color: 'var(--vw-text-primary)',
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '-0.3px',
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--vw-text-secondary)' }}
                      >
                        {new Date(item.release_date).getFullYear()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Playlist Modal */}
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={tracks}
        toastContext="album"
      />
    </div>
  )
}
