"use client"

import { Play, Shuffle, MoreHorizontal, Clock, Plus, ChevronLeft, Music2, Info, Edit3, Trash2, X, Search, Loader2, Check, RotateCw, Camera, Sparkles, SkipForward, ListPlus } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { SAMPLE_TRACKS, usePlayerStore, type Track } from '@/lib/player-store'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { searchMusic } from '@/lib/music-api'
import {
  AmbientOrbs,
  GlassPanel,
  SectionHeader,
  AccentBar,
  AiBadge
} from '@/components/ui/vibewave'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { cn } from '@/lib/utils'

function slugToTitle(slug: string) {
  try {
    const decoded = decodeURIComponent(slug)
    return decoded.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  } catch (e) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
}

export default function PlaylistDetailPage({ slug }: { slug: string }) {
  const router = useRouter()
  const { setTrack, setQueue, isShuffle } = usePlayerStore()

  // Custom states
  const [playlist, setPlaylist] = useState<any>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Recommended / Suggested Tracks state
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([])
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false)
  const [editImage, setEditImage] = useState('')

  const SUGGESTION_KEYWORDS = [
    'Đen Vâu', 'Vũ.', 'Sơn Tùng M-TP', 'tlinh', 'Wren Evans', 
    'MCK', 'Grey D', 'Obito', 'Pop', 'Indie', 'Chill', 'Lofi'
  ]

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setEditImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const loadSuggestedTracks = async () => {
    setIsRefreshingSuggestions(true)
    try {
      const randomKeyword = SUGGESTION_KEYWORDS[Math.floor(Math.random() * SUGGESTION_KEYWORDS.length)]
      const results = await searchMusic(randomKeyword, 30, 'VN')
      const filtered = results.filter(track => !tracks.some(t => t.id === track.id))
      setSuggestedTracks(filtered.slice(0, 20))
    } catch (err) {
      console.error('Failed to load recommended tracks:', err)
    } finally {
      setIsRefreshingSuggestions(false)
    }
  }

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Search & Add Tracks State
  const [isAddSongsOpen, setIsAddSongsOpen] = useState(false)
  const [searchSongsQ, setSearchSongsQ] = useState('')
  const [searchSongsResults, setSearchSongsResults] = useState<Track[]>([])
  const [isSearchingSongs, setIsSearchingSongs] = useState(false)

  // Related Playlists from custom user playlists
  const [relatedPlaylists, setRelatedPlaylists] = useState<any[]>([])

  // Load Playlist details from localStorage
  useEffect(() => {
    const storedPlaylistsStr = localStorage.getItem('vw_saved_playlists')
    let allPlaylists: any[] = []
    if (storedPlaylistsStr) {
      try {
        const parsed = JSON.parse(storedPlaylistsStr)
        // Clean out default mockup playlists
        allPlaylists = parsed.filter((p: any) => !/^p\d+$/.test(p.id))
      } catch (e) { }
    }

    // Default static playlists (Empty mockup playlists)
    const staticDefaults: any[] = []

    // Find in all saved playlists
    let found = allPlaylists.find((p: any) => p.id === slug || p.href.endsWith(`/${slug}`))

    // Load related custom playlists
    const otherPlaylists = allPlaylists
      .filter((p: any) => p.id !== slug && !p.href.endsWith(`/${slug}`))
      .slice(0, 4)
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle || `${p.tracks?.length || 0} bài hát`,
        href: p.href,
      }))
    setRelatedPlaylists(otherPlaylists)

    if (found) {
      // Ensure tracks key exists
      if (!found.tracks) {
        found.tracks = []
      }

      const isCustom = found.id.startsWith('custom_')
      setPlaylist({
        ...found,
        isCustom
      })
      setTracks(found.tracks)
    } else {
      // Create fallback empty playlist
      setPlaylist({
        id: slug,
        title: slugToTitle(slug),
        description: 'Danh sách phát cá nhân của bạn.',
        href: `/playlist/${slug}`,
        type: 'playlist',
        isCustom: slug.startsWith('custom_'),
        tracks: []
      })
      setTracks([])
    }
  }, [slug])

  // Search tracks debounced
  useEffect(() => {
    if (!searchSongsQ.trim()) {
      setSearchSongsResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingSongs(true)
      try {
        const results = await searchMusic(searchSongsQ, 10)
        setSearchSongsResults(results)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearchingSongs(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [searchSongsQ])

  // Load recommended songs on playlist load
  useEffect(() => {
    if (playlist) {
      loadSuggestedTracks()
    }
  }, [slug, playlist?.id])

  // Save changes to edit Title / Desc / Image
  const handleSaveEdit = () => {
    if (!editTitle.trim()) return

    const storedPlaylistsStr = localStorage.getItem('vw_saved_playlists')
    let allPlaylists = []
    if (storedPlaylistsStr) {
      try {
        allPlaylists = JSON.parse(storedPlaylistsStr)
      } catch (e) { }
    }

    const exists = allPlaylists.some((p: any) => p.id === playlist.id)
    let updatedPlaylists;

    if (exists) {
      updatedPlaylists = allPlaylists.map((p: any) => {
        if (p.id === playlist.id) {
          return {
            ...p,
            title: editTitle.trim(),
            description: editDesc.trim(),
            image: editImage.trim() || undefined,
          }
        }
        return p
      })
    } else {
      const newPlaylist = {
        id: playlist.id,
        title: editTitle.trim(),
        description: editDesc.trim(),
        image: editImage.trim() || undefined,
        href: playlist.href || `/playlist/${playlist.id}`,
        type: 'playlist',
        tracks: tracks,
        subtitle: playlist.subtitle || `${tracks.length} bài hát`,
      }
      updatedPlaylists = [newPlaylist, ...allPlaylists]
    }

    localStorage.setItem('vw_saved_playlists', JSON.stringify(updatedPlaylists))
    setPlaylist((prev: any) => ({
      ...prev,
      title: editTitle.trim(),
      description: editDesc.trim(),
      image: editImage.trim() || undefined,
    }))

    // Notify application
    window.dispatchEvent(new Event('vw_playlists_updated'))

    setIsEditModalOpen(false)
    setToastMessage({ text: 'Đã cập nhật danh sách phát!', type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Delete Playlist
  const handleDeletePlaylist = () => {
    const storedPlaylistsStr = localStorage.getItem('vw_saved_playlists')
    let allPlaylists = []
    if (storedPlaylistsStr) {
      try {
        allPlaylists = JSON.parse(storedPlaylistsStr)
      } catch (e) { }
    }

    const updatedPlaylists = allPlaylists.filter((p: any) => p.id !== playlist.id)
    localStorage.setItem('vw_saved_playlists', JSON.stringify(updatedPlaylists))

    // Notify application
    window.dispatchEvent(new Event('vw_playlists_updated'))

    setToastMessage({ text: `Đã xóa danh sách phát "${playlist.title}"`, type: 'success' })
    setTimeout(() => {
      setToastMessage(null)
      router.push('/library?tab=playlists')
    }, 1000)
  }

  // Add song to playlist
  const handleAddSong = (track: Track) => {
    if (tracks.some(t => t.id === track.id)) {
      setToastMessage({ text: 'Bài hát đã có trong danh sách phát!', type: 'info' })
      setTimeout(() => setToastMessage(null), 3000)
      return
    }

    const updatedTracks = [...tracks, track]

    // Update in localStorage
    const storedPlaylistsStr = localStorage.getItem('vw_saved_playlists')
    let allPlaylists = []
    if (storedPlaylistsStr) {
      try {
        allPlaylists = JSON.parse(storedPlaylistsStr)
      } catch (e) { }
    }

    // Find and update or add the playlist
    let found = false
    let updatedPlaylists = allPlaylists.map((p: any) => {
      if (p.id === playlist.id) {
        found = true
        return {
          ...p,
          subtitle: `${updatedTracks.length} bài hát · ${Math.floor(updatedTracks.reduce((acc, t) => acc + t.duration, 0) / 60)} phút`,
          tracks: updatedTracks
        }
      }
      return p
    })

    if (!found) {
      // If it's a default playlist that wasn't in localStorage yet, we save it now!
      const newPlaylist = {
        id: playlist.id,
        title: playlist.title,
        subtitle: `${updatedTracks.length} bài hát · ${Math.floor(updatedTracks.reduce((acc, t) => acc + t.duration, 0) / 60)} phút`,
        description: playlist.description,
        href: playlist.href,
        type: 'playlist',
        tracks: updatedTracks
      }
      updatedPlaylists = [newPlaylist, ...allPlaylists]
    }

    localStorage.setItem('vw_saved_playlists', JSON.stringify(updatedPlaylists))
    setTracks(updatedTracks)

    // Update subtitle local state
    setPlaylist((prev: any) => ({
      ...prev,
      subtitle: `${updatedTracks.length} bài hát · ${Math.floor(updatedTracks.reduce((acc, t) => acc + t.duration, 0) / 60)} phút`
    }))

    // Notify application
    window.dispatchEvent(new Event('vw_playlists_updated'))

    setToastMessage({ text: `Đã thêm "${track.title}" vào danh sách phát!`, type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Remove song from playlist
  const handleRemoveSong = (trackId: string) => {
    const updatedTracks = tracks.filter(t => t.id !== trackId)

    // Update in localStorage
    const storedPlaylistsStr = localStorage.getItem('vw_saved_playlists')
    let allPlaylists = []
    if (storedPlaylistsStr) {
      try {
        allPlaylists = JSON.parse(storedPlaylistsStr)
      } catch (e) { }
    }

    const updatedPlaylists = allPlaylists.map((p: any) => {
      if (p.id === playlist.id) {
        return {
          ...p,
          subtitle: `${updatedTracks.length} bài hát · ${Math.floor(updatedTracks.reduce((acc, t) => acc + t.duration, 0) / 60)} phút`,
          tracks: updatedTracks
        }
      }
      return p
    })

    localStorage.setItem('vw_saved_playlists', JSON.stringify(updatedPlaylists))
    setTracks(updatedTracks)

    // Update subtitle local state
    setPlaylist((prev: any) => ({
      ...prev,
      subtitle: `${updatedTracks.length} bài hát · ${Math.floor(updatedTracks.reduce((acc, t) => acc + t.duration, 0) / 60)} phút`
    }))

    // Notify application
    window.dispatchEvent(new Event('vw_playlists_updated'))

    setToastMessage({ text: 'Đã xóa bài hát khỏi danh sách phát!', type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)
  }

  if (!playlist) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 size={32} className="text-purple-500 animate-spin" />
      </div>
    )
  }

  const durationMin = Math.floor(tracks.reduce((acc, t) => acc + t.duration, 0) / 60)

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
      <div className="flex items-center justify-between mb-10 relative z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-vw group cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="flex items-center gap-3">
          {playlist.isCustom && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-vw cursor-pointer"
              title="Xóa danh sách phát"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative mb-16 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
          {/* Playlist Cover */}
          <div className="relative group overflow-hidden rounded-[2rem] shrink-0">
            <div
              className="absolute -inset-4 bg-purple-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
            />
            <div
              className="w-64 h-64 md:w-72 md:h-72 rounded-[2rem] shrink-0 flex items-center justify-center text-8xl font-display font-bold shadow-2xl relative z-10 border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden"
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

              {/* Play or edit button overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 rounded-[2rem] z-20">
                {tracks.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setQueue(tracks)
                      setTrack(tracks[0])
                    }}
                    className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300 hover:scale-105 hover:bg-purple-400 cursor-pointer text-white"
                    title="Phát playlist"
                  >
                    <Play size={20} fill="white" className="ml-0.5 text-white" />
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditTitle(playlist.title)
                    setEditDesc(playlist.description || '')
                    setEditImage(playlist.image || '')
                    setIsEditModalOpen(true)
                  }}
                  className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md hover:bg-white/30 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Camera size={14} />
                  <span>Sửa hình ảnh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <AiBadge label={playlist.isCustom ? "Custom Playlist" : "Personalized Playlist"} withIcon />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Curated for you</span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1] flex items-center justify-center md:justify-start gap-4"
                style={{ textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
              >
                <span>{playlist.title}</span>
                {playlist.isCustom && (
                  <button
                    onClick={() => {
                      setEditTitle(playlist.title)
                      setEditDesc(playlist.description || '')
                      setIsEditModalOpen(true)
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/55 hover:text-purple-400 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer shrink-0"
                    title="Chỉnh sửa danh sách phát"
                  >
                    <Edit3 size={18} />
                  </button>
                )}
              </h1>
              <p className="text-white/50 text-sm max-w-xl font-light leading-relaxed">
                {playlist.description || 'Danh sách phát cá nhân của bạn.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-white/40 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] border border-purple-500/30 text-purple-400 font-bold">VW</div>
                  <span>VibeWave</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{tracks.length} bài hát</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Khoảng {durationMin} phút</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              {tracks.length > 0 ? (
                <>
                  <button
                    onClick={() => {
                      setQueue(tracks)
                      setTrack(tracks[0])
                    }}
                    className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)' }}
                  >
                    <Play size={20} fill="white" className="text-white" />
                    <span>Phát tất cả</span>
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
                </>
              ) : (
                <button
                  onClick={() => setIsAddSongsOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all cursor-pointer shadow-lg shadow-purple-500/20"
                >
                  <Plus size={18} />
                  <span>Thêm bài hát đầu tiên</span>
                </button>
              )}

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
                          // Play next logic (add all to queue after current index)
                          const currentQueue = usePlayerStore.getState().queue
                          const currentTrack = usePlayerStore.getState().currentTrack
                          const currentIndex = currentQueue.findIndex(t => t.id === currentTrack?.id)
                          if (currentIndex !== -1) {
                            const newQueue = [...currentQueue]
                            newQueue.splice(currentIndex + 1, 0, ...tracks)
                            usePlayerStore.getState().setQueue(newQueue)
                          } else {
                            usePlayerStore.getState().setQueue([...tracks])
                          }
                          setToastMessage({ text: 'Đã thêm danh sách phát vào hàng chờ phát tiếp theo!', type: 'success' })
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
                          const currentQueue = usePlayerStore.getState().queue
                          usePlayerStore.getState().setQueue([...currentQueue, ...tracks])
                          setToastMessage({ text: 'Đã thêm danh sách phát vào hàng chờ!', type: 'success' })
                          setTimeout(() => setToastMessage(null), 3000)
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                    >
                      <ListPlus size={13} className="text-purple-400" />
                      <span>Thêm vào hàng chờ</span>
                    </DropdownMenuItem>

                    {/* Divider */}
                    {playlist.isCustom && <div className="h-px bg-white/5 my-1 mx-2" />}

                    {/* 3. Chỉnh sửa (Nếu là Custom) */}
                    {playlist.isCustom && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditTitle(playlist.title)
                          setEditDesc(playlist.description || '')
                          setEditImage(playlist.image || '')
                          setIsEditModalOpen(true)
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
                      >
                        <Edit3 size={13} className="text-purple-400" />
                        <span>Chỉnh sửa thông tin</span>
                      </DropdownMenuItem>
                    )}

                    {/* 4. Xóa danh sách phát (Nếu là Custom) */}
                    {playlist.isCustom && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDeleteModalOpen(true)
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                      >
                        <Trash2 size={13} className="text-red-400/80" />
                        <span>Xóa danh sách phát</span>
                      </DropdownMenuItem>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full space-y-12 relative z-10">
        {/* Track List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AccentBar color="purple" />
              <h2 className="text-2xl font-display font-bold text-white/90">Bài hát trong danh sách</h2>
            </div>
            <button
              onClick={() => setIsAddSongsOpen(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Thêm bài hát
            </button>
          </div>

          {tracks.length > 0 ? (
            <GlassPanel variant="dark" className="vw-playlist-table border-white/5">
              <div className="grid grid-cols-[3rem_1fr_10rem_5rem] gap-4 items-center px-6 py-4 border-b border-white/5 opacity-40">
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">#</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Tiêu đề</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Album</span>
                <span className="flex justify-end">
                  <Clock size={14} />
                </span>
              </div>
              <div className="p-2 space-y-1">
                {tracks.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    index={i + 1}
                    track={track}
                    showAlbum
                    onRemove={() => handleRemoveSong(track.id)}
                    removeLabel="Xóa khỏi danh sách phát"
                  />
                ))}
              </div>
            </GlassPanel>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden group/empty transition-all duration-500 hover:border-purple-500/20 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),0_0_30px_rgba(155,77,224,0.03)]">
              {/* Backing Ambient Purple Light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
              
              {/* Floating Glowing Icon Bubble */}
              <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] backdrop-blur-md flex items-center justify-center mb-4 text-purple-400 border border-white/10 shadow-lg shadow-purple-500/5 group-hover/empty:scale-110 group-hover/empty:border-purple-500/30 group-hover/empty:shadow-purple-500/10 group-hover/empty:text-purple-300 transition-all duration-500">
                <Music2 size={24} className="animate-pulse" />
              </div>
              
              <h3 className="relative z-10 text-base font-semibold text-white tracking-tight">
                Danh sách phát này trống
              </h3>
              
              <p className="relative z-10 text-xs text-white/50 mt-2 max-w-xs leading-relaxed">
                Hãy thêm một vài bài hát tuyệt vời để bắt đầu tận hưởng âm nhạc.
              </p>
              
              <button
                onClick={() => setIsAddSongsOpen(true)}
                className="relative z-10 mt-6 px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-400 hover:to-indigo-400 hover:shadow-[0_0_20px_rgba(155,77,224,0.4)] active:scale-95 transition-all duration-300 cursor-pointer shadow-lg shadow-purple-500/10"
              >
                Tìm và Thêm bài hát
              </button>
            </div>
          )}
        </div>

        {/* Suggested Tracks Section with Reload Button */}
        <section className="mt-16 pt-10 border-t border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Gợi ý hàng đầu</span>
              </div>
              <h2 className="text-2xl font-display font-semibold text-white tracking-tight">Bài hát đề xuất</h2>
              <p className="text-sm text-white/40">
                Những bài hát được đề xuất dựa trên sở thích âm nhạc và danh sách phát của bạn.
              </p>
            </div>
          </div>

          {isRefreshingSuggestions && suggestedTracks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 size={32} className="text-purple-500 animate-spin mb-3" />
              <p className="text-sm text-white/50">Đang tìm kiếm bài hát tốt nhất cho bạn...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedTracks.map((track) => {
                  const isAdded = tracks.some(t => t.id === track.id)
                  return (
                    <div 
                      key={track.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:bg-white/[0.12] hover:border-purple-500/35 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_20px_rgba(155,77,224,0.08)] transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail with Play Overlay */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-200">
                          {track.albumArt ? (
                            <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                          ) : (
                            <Music2 size={16} className="text-white/40" />
                          )}
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setTrack(track)}
                              className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center hover:scale-110 active:scale-95 cursor-pointer text-white shadow-md"
                            >
                              <Play size={12} fill="white" className="ml-0.5 text-white" />
                            </button>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors tracking-tight">
                            {track.title}
                          </h4>
                          <p className="text-xs text-white/60 truncate mt-0.5">
                            {track.artist}
                          </p>
                        </div>
                      </div>

                      {/* Add / Added Button */}
                      <div className="flex items-center gap-3 shrink-0">
                        {isAdded ? (
                          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddSong(track)}
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-purple-600 hover:border-purple-400 hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm"
                            title="Thêm vào playlist"
                          >
                            <Plus size={14} className="stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Centered Refresh Button at the bottom */}
              {suggestedTracks.length > 0 && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => loadSuggestedTracks()}
                    disabled={isRefreshingSuggestions}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/5 active:scale-95"
                  >
                    <RotateCw size={12} className={isRefreshingSuggestions ? 'animate-spin' : ''} />
                    <span>Làm mới gợi ý</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Edit Playlist Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#070509]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div
            className="relative w-full max-w-md bg-[#130E1B]/95 border border-white/10 rounded-[32px] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-10 transition-all duration-300"
            style={{
              background: 'linear-gradient(180deg, rgba(30,22,43,0.95) 0%, rgba(16,12,23,0.98) 100%)',
              boxShadow: '0 24px 64px -16px rgba(155,77,224,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            {/* Decorative ambient glowing orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/20 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-[60px] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
                  <Edit3 className="text-purple-400" size={22} />
                  <span>Sửa danh sách phát</span>
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Cập nhật tiêu đề, mô tả và hình ảnh cho danh sách phát của bạn.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs Box */}
            <div className="space-y-4 relative z-10">
              {/* Cover Image Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Hình đại diện playlist</label>
                <div className="flex gap-4 items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                  {/* Preview Thumbnail */}
                  <div 
                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-white/10 shadow-lg relative bg-cover bg-center"
                    style={{
                      background: editImage ? `url(${editImage})` : 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!editImage && <Music2 size={24} className="text-white/40" />}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById('cover-file-input')?.click()}
                        className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera size={13} />
                        <span>Tải ảnh lên</span>
                      </button>
                      {editImage && (
                        <button
                          type="button"
                          onClick={() => setEditImage('')}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 size={13} />
                          <span>Xóa ảnh</span>
                        </button>
                      )}
                    </div>
                    <input
                      id="cover-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <p className="text-[10px] text-white/30 leading-normal">
                      Chọn một tệp hình ảnh vuông để có kết quả hiển thị tốt nhất.
                    </p>
                  </div>
                </div>

                {/* Paste URL Optional Input */}
                <div className="space-y-1">
                  <input
                    type="text"
                    value={editImage.startsWith('data:') ? '' : editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="Hoặc dán URL hình ảnh..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 focus:border-purple-500/50 text-white text-xs outline-none transition-all duration-300 placeholder-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Tên playlist</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nhập tên danh sách phát..."
                  maxLength={50}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] placeholder-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Mô tả</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Thêm mô tả cho danh sách phát..."
                  rows={3}
                  maxLength={150}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] placeholder-white/20 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer text-center"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim()}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-95 shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)',
                  }}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Songs Modal */}
      {isAddSongsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#070509]/85 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsAddSongsOpen(false)}
          />

          <div
            className="relative w-full max-w-xl bg-[#130E1B]/95 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-10 transition-all duration-300 flex flex-col max-h-[85vh]"
            style={{
              background: 'linear-gradient(180deg, rgba(30,22,43,0.95) 0%, rgba(16,12,23,0.98) 100%)',
              boxShadow: '0 24px 64px -16px rgba(155,77,224,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            {/* Decorative ambient glowing orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/20 blur-[60px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-[60px] pointer-events-none animate-pulse" />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 relative z-10 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
                  <Music2 className="text-purple-400" size={22} />
                  <span>Thêm bài hát mới</span>
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Tìm kiếm hàng triệu bài hát để thêm vào danh sách phát của bạn.
                </p>
              </div>
              <button
                onClick={() => setIsAddSongsOpen(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative mb-6 z-10 flex-shrink-0">
              <div className="absolute inset-0 bg-purple-500/5 rounded-2xl blur-md opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchSongsQ}
                  onChange={(e) => setSearchSongsQ(e.target.value)}
                  placeholder="Nhập tên bài hát, nghệ sĩ hoặc từ khóa..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] placeholder-white/30"
                />
                {searchSongsQ && (
                  <button
                    onClick={() => setSearchSongsQ('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="relative z-10 overflow-y-auto pr-1 space-y-3 flex-1 scrollbar-hide">
              {isSearchingSongs ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 size={32} className="text-purple-500 animate-spin mb-3" />
                  <p className="text-sm text-white/50">Đang tìm kiếm bài hát...</p>
                </div>
              ) : searchSongsResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-2 px-1">
                    KẾT QUẢ TÌM THẤY ({searchSongsResults.length})
                  </div>
                  {searchSongsResults.map((track) => {
                    const alreadyAdded = tracks.some(t => t.id === track.id)
                    return (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-200 flex items-center justify-center">
                            {track.albumArt ? (
                              <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-900/20 text-purple-400">
                                <Music2 size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-display font-semibold text-white/95 truncate" title={track.title}>
                              {track.title}
                            </h4>
                            <p className="text-xs text-white/40 truncate mt-0.5">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        {alreadyAdded ? (
                          <span className="text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                            <Check size={12} /> Đã có
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddSong(track)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#120E18] hover:bg-purple-500 hover:text-white shadow-md transition-all duration-200 cursor-pointer shrink-0"
                          >
                            Thêm
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : searchSongsQ ? (
                <div className="py-12 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                  <Search size={24} className="text-white/20 mb-2" />
                  <h5 className="text-sm font-display font-bold text-white/80">Không tìm thấy bài hát</h5>
                  <p className="text-xs text-white/40 max-w-xs mt-1">
                    Không có kết quả nào phù hợp với &ldquo;{searchSongsQ}&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                    <Search size={20} className="text-purple-400" />
                  </div>
                  <h5 className="text-sm font-display font-bold text-white/80">Nhập từ khóa tìm kiếm</h5>
                  <p className="text-xs text-white/40 max-w-xs mt-1 px-4">
                    Nhập tên bài hát hoặc nghệ sĩ để bắt đầu chọn lọc những tác phẩm âm nhạc cho riêng mình.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Playlist Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        itemName={playlist.title}
        itemType="playlist"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePlaylist}
      />
    </div>
  )
}
