"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus } from 'lucide-react'
import { Track } from '@/lib/player-store'
import { useToast } from '@/hooks/use-toast'

interface PlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  track: Track | Track[]
  toastContext?: string
}

export default function PlaylistModal({ isOpen, onClose, track, toastContext = "bài hát" }: PlaylistModalProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      const stored = localStorage.getItem('vw_saved_playlists')
      let loadedPlaylists = []
      if (stored) {
        try {
          loadedPlaylists = JSON.parse(stored)
        } catch (err) {}
      }
      setPlaylists(loadedPlaylists)
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const tracksToAdd = Array.isArray(track) ? track : [track]

  const handleAddToPlaylist = (playlistId: string, playlistTitle: string) => {
    const stored = localStorage.getItem('vw_saved_playlists')
    let allPlaylists = []
    if (stored) {
      try {
        allPlaylists = JSON.parse(stored)
      } catch (e) {}
    }

    let tracksAddedCount = 0
    let alreadyExistsCount = 0

    const updated = allPlaylists.map((p: any) => {
      if (p.id === playlistId) {
        const tracks = p.tracks || []
        const tracksToAppend = tracksToAdd.filter(t => !tracks.some((existing: any) => existing.id === t.id))
        
        tracksAddedCount = tracksToAppend.length
        alreadyExistsCount = tracksToAdd.length - tracksAddedCount

        const updatedTracks = [...tracks, ...tracksToAppend]
        const durationMin = Math.floor(updatedTracks.reduce((acc: number, t: any) => acc + t.duration, 0) / 60)
        return {
          ...p,
          subtitle: `${updatedTracks.length} bài hát · ${durationMin} phút`,
          tracks: updatedTracks
        }
      }
      return p
    })

    if (tracksAddedCount === 0) {
      toast({
        title: "Đã có trong danh sách",
        description: `Tất cả bài hát đã có sẵn trong danh sách phát "${playlistTitle}"!`,
      })
      onClose()
      return
    }

    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))
    window.dispatchEvent(new Event('vw_playlists_updated'))
    
    const desc = alreadyExistsCount > 0 
      ? `Đã thêm ${tracksAddedCount} bài hát mới vào "${playlistTitle}" (trùng ${alreadyExistsCount})!`
      : `Đã thêm ${tracksToAdd.length} bài hát vào danh sách phát "${playlistTitle}"!`

    toast({
      title: "Đã thêm vào Playlist",
      description: desc,
    })
    onClose()
  }

  const handleCreatePlaylistAndAdd = () => {
    if (!newPlaylistTitle.trim()) return

    const stored = localStorage.getItem('vw_saved_playlists') || '[]'
    let allPlaylists = []
    try {
      allPlaylists = JSON.parse(stored)
    } catch (e) {}

    const totalDuration = tracksToAdd.reduce((acc, t) => acc + t.duration, 0)
    const newId = 'custom_' + Date.now()
    const newPlaylist = {
      id: newId,
      title: newPlaylistTitle.trim(),
      subtitle: `${tracksToAdd.length} bài hát · ${Math.floor(totalDuration / 60)} phút`,
      image: undefined,
      href: `/playlist/${newId}`,
      type: 'playlist',
      isCustom: true,
      description: newPlaylistDesc.trim() || 'Danh sách phát cá nhân của bạn.',
      tracks: tracksToAdd
    }

    const updated = [newPlaylist, ...allPlaylists]
    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))
    window.dispatchEvent(new Event('vw_playlists_updated'))
    toast({
      title: "Đã tạo Playlist",
      description: `Đã tạo danh sách phát "${newPlaylistTitle.trim()}" và thêm ${tracksToAdd.length} bài hát!`,
    })
    
    setNewPlaylistTitle('')
    setNewPlaylistDesc('')
    setIsCreatingNew(false)
    onClose()
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#070509]/80 backdrop-blur-md transition-opacity duration-300 cursor-default"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-[#130E1B]/95 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-[10000] transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, rgba(30,22,43,0.95) 0%, rgba(16,12,23,0.98) 100%)',
          boxShadow: '0 24px 64px -16px rgba(155,77,224,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
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
            <p className="text-xs text-white/75 mt-1 max-w-[280px]">
              {isCreatingNew ? (
                <>Tạo một danh sách phát của riêng bạn để thêm âm nhạc.</>
              ) : (
                <>Chọn một danh sách phát để lưu trữ phần âm nhạc này.</>
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
                onClose()
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
                className="flex-1 py-3 px-4 rounded-2xl bg-white/10 border border-white/20 text-white/85 hover:text-white hover:bg-white/15 hover:border-white/30 text-xs font-bold transition-all duration-200 cursor-pointer text-center"
              >
                Hủy bỏ
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCreatePlaylistAndAdd()
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
    </div>,
    document.body
  )
}
