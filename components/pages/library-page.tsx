"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, Clock, X, Loader2, Music, Check, Trash2 } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import { type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import { useSearchParams } from 'next/navigation'
import { searchAlbums } from '@/lib/music-api'
import {
  PageHero,
  AmbientOrbs,
} from '@/components/ui/vibewave'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'

type Tab = 'playlists' | 'albums' | 'liked' | 'recent'

interface LibraryItem {
  id: string
  title: string
  subtitle: string
  image?: string
  href: string
  type: string
}

export default function LibraryPage({
  initialAlbums = [],
}: {
  initialAlbums?: LibraryItem[],
}) {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('albums')

  useEffect(() => {
    const tabParam = searchParams.get('tab') as Tab | null
    if (tabParam && ['albums', 'playlists'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const [searchQ, setSearchQ] = useState('')

  // Custom states for Add Album Modal
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false)
  const [modalSearchQ, setModalSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Custom states for Create Playlist Modal
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')

  // Confirm Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    itemId: string
    itemName: string
    itemType: 'album' | 'playlist'
  }>({
    isOpen: false,
    itemId: '',
    itemName: '',
    itemType: 'playlist',
  })

  // Hydration-safe State for Albums
  const [albums, setAlbums] = useState<LibraryItem[]>([])

  useEffect(() => {
    const storedAlbums = localStorage.getItem('vw_saved_albums')
    if (storedAlbums) {
      try {
        const parsed = JSON.parse(storedAlbums)
        // Merge initialAlbums and parsed, filter duplicates by id
        const allAlbums = [...parsed, ...initialAlbums]
        const uniqueAlbums = allAlbums.filter((album, index, self) =>
          self.findIndex(a => a.id === album.id) === index
        )
        setAlbums(uniqueAlbums)
      } catch (e) {
        setAlbums(initialAlbums)
      }
    } else {
      setAlbums(initialAlbums)
    }
  }, [initialAlbums])

  const DEFAULT_PLAYLISTS: LibraryItem[] = []

  // Hydration-safe State for Playlists
  const [playlists, setPlaylists] = useState<LibraryItem[]>([])

  useEffect(() => {
    const storedPlaylists = localStorage.getItem('vw_saved_playlists')
    if (storedPlaylists) {
      try {
        const parsed = JSON.parse(storedPlaylists) as LibraryItem[]
        // Clean out any default mockup playlists (id matches p1-p8)
        const customPlaylists = parsed.filter(p => !/^p\d+$/.test(p.id))
        setPlaylists(customPlaylists)
        if (parsed.length !== customPlaylists.length) {
          localStorage.setItem('vw_saved_playlists', JSON.stringify(customPlaylists))
        }
      } catch (e) {
        setPlaylists([])
      }
    } else {
      setPlaylists([])
      localStorage.setItem('vw_saved_playlists', JSON.stringify([]))
    }
  }, [t.songsLabel])

  // Sync custom event listeners or state updates
  useEffect(() => {
    if (albums.length > 0) {
      window.dispatchEvent(new Event('vw_albums_updated'))
    }
  }, [albums])

  useEffect(() => {
    if (playlists.length > 0) {
      window.dispatchEvent(new Event('vw_playlists_updated'))
    }
  }, [playlists])

  // Debounced search for album search in Modal
  useEffect(() => {
    if (!modalSearchQ.trim()) {
      setSearchResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await searchAlbums(modalSearchQ, 12)
        setSearchResults(results)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 400) // 400ms debounce

    return () => clearTimeout(delayDebounceFn)
  }, [modalSearchQ])

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return

    const newId = 'custom_' + Date.now()
    const newPlaylist = {
      id: newId,
      title: newPlaylistTitle.trim(),
      subtitle: `0 ${t.songsLabel} · 0m`,
      image: undefined,
      href: `/playlist/${newId}`,
      type: 'playlist',
      description: newPlaylistDesc.trim() || 'Danh sách phát cá nhân của bạn.',
      tracks: []
    }

    const updated = [newPlaylist, ...playlists]
    setPlaylists(updated)
    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))

    // Notify other parts of the app
    window.dispatchEvent(new Event('vw_playlists_updated'))

    setToastMessage({ text: `Đã tạo danh sách phát "${newPlaylistTitle}" thành công!`, type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)

    // Reset and close
    setNewPlaylistTitle('')
    setNewPlaylistDesc('')
    setIsAddPlaylistOpen(false)
  }

  const handleAddAlbum = (album: any) => {
    const newItem: LibraryItem = {
      id: album.id,
      title: album.title,
      subtitle: album.artist,
      image: album.albumArt,
      href: `/album/${album.id}`,
      type: 'album'
    }

    if (albums.some(a => a.id === album.id)) return

    const updated = [newItem, ...albums]
    setAlbums(updated)

    // Save only customized/added ones in localStorage
    const customAlbums = updated.filter(a => !initialAlbums.some(init => init.id === a.id))
    localStorage.setItem('vw_saved_albums', JSON.stringify(customAlbums))

    // Notify other parts of the app
    window.dispatchEvent(new Event('vw_albums_updated'))

    setToastMessage({ text: `Đã thêm album "${album.title}" vào thư viện!`, type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRemoveAlbum = (id: string) => {
    const albumToRemove = albums.find(a => a.id === id)
    if (!albumToRemove) return

    const updated = albums.filter(a => a.id !== id)
    setAlbums(updated)

    // Save customized list in localStorage
    const customAlbums = updated.filter(a => !initialAlbums.some(init => init.id === a.id))
    localStorage.setItem('vw_saved_albums', JSON.stringify(customAlbums))

    // Notify other parts of the app
    window.dispatchEvent(new Event('vw_albums_updated'))

    setToastMessage({ text: `Đã xóa album "${albumToRemove.title}" khỏi thư viện!`, type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRemovePlaylist = (id: string) => {
    const playlistToRemove = playlists.find(p => p.id === id)
    if (!playlistToRemove) return

    const updated = playlists.filter(p => p.id !== id)
    setPlaylists(updated)
    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))

    // Notify other parts of the app
    window.dispatchEvent(new Event('vw_playlists_updated'))

    setToastMessage({ text: `Đã xóa danh sách phát "${playlistToRemove.title}" khỏi thư viện!`, type: 'success' })
    setTimeout(() => setToastMessage(null), 3000)
  }

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: 'albums', label: t.albums, count: albums.length },
    { id: 'playlists', label: t.playlists, count: playlists.length },
  ]

  const items = activeTab === 'playlists' ? playlists : albums

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) || i.subtitle.toLowerCase().includes(searchQ.toLowerCase())
  )

  return (
    <div className="space-y-10 relative">
      {/* Shared ambient orbs — library variant */}
      <AmbientOrbs position="absolute" variant="library" />

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#16121E]/95 border ${toastMessage.type === 'success' ? 'border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.15)]' : 'border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.15)]'} backdrop-blur-xl`}>
            {toastMessage.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Check size={14} className="text-emerald-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <X size={14} className="text-red-400" />
              </div>
            )}
            <span className="text-sm font-medium text-white/90">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-10">
        <PageHero
          eyebrowIcon={<Clock size={13} />}
          eyebrowLabel="Bộ Sưu Tập"
          title="Thư viện"
          subtitle="Lưu trữ và quản lý những giai điệu yêu thích, playlist cá nhân và album mà bạn không thể sống thiếu."
          gradientClass="from-white via-white/90 to-white/60"
          action={
            <button
              onClick={() => {
                if (activeTab === 'albums') {
                  setIsAddAlbumOpen(true)
                } else {
                  setIsAddPlaylistOpen(true)
                }
              }}
              className="group relative flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(155,77,224,0.2)] hover:shadow-[0_0_30px_rgba(155,77,224,0.4)] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus size={18} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
              <span className="relative z-10 tracking-wide">{activeTab === 'albums' ? t.newAlbum : t.newPlaylist}</span>
            </button>
          }
        />
      </div>

      {/* Tabs + controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-[#120E18]/60 backdrop-blur-xl border border-white/5 shadow-xl relative z-10">
        <div className="flex items-center gap-2 w-full sm:w-auto p-1.5 rounded-xl bg-white/[0.02]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-1 sm:flex-none overflow-hidden group"
              style={{
                color: activeTab === tab.id ? '#ffffff' : 'rgba(255,255,255,0.4)',
              }}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg shadow-[inset_0_0_12px_rgba(155,77,224,0.2)]" />
              )}
              <span className="relative z-10 group-hover:text-white/90 transition-colors">{tab.label}</span>
              <span
                className="relative z-10 text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-all duration-300"
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(155,77,224,0.3)' : 'rgba(255,255,255,0.05)',
                  color: activeTab === tab.id ? '#E9D5FF' : 'rgba(255,255,255,0.3)'
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors duration-300 z-10"
          />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t.filter || "Tìm kiếm trong thư viện..."}
            className="w-full sm:w-[320px] pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-white/[0.03] border border-white/[0.05] text-white/90 placeholder-white/30 hover:bg-white/[0.05] focus:bg-white/[0.06] focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] relative z-10"
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-6">
          {filtered.map((item) => (
            <MusicCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={(item as any).image}
              href={item.href}
              type={(item as any).type || (activeTab === 'playlists' ? 'playlist' : activeTab === 'albums' ? 'album' : 'artist')}
              onDelete={(id) => {
                const targetItem = filtered.find((i) => i.id === id)
                if (targetItem) {
                  setDeleteModal({
                    isOpen: true,
                    itemId: id,
                    itemName: targetItem.title,
                    itemType: activeTab === 'playlists' ? 'playlist' : 'album',
                  })
                }
              }}
              deleteLabel={activeTab === 'playlists' ? "Xóa danh sách phát" : "Xóa album"}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-sm mt-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <Search size={24} className="text-white/30" />
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-sm text-white/40 max-w-md">
              Không có kết quả nào cho &ldquo;<span className="text-white/70">{searchQ}</span>&rdquo;. Hãy thử tìm kiếm với từ khóa khác.
            </p>
          </div>
        )}
      </div>

      {/* Add Album Modal */}
      {isAddAlbumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#070509]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsAddAlbumOpen(false)}
          />

          <div
            className="relative w-full max-w-xl bg-[#130E1B]/95 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-10 transition-all duration-300"
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
                <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                  <span className="text-purple-400">✨</span> Thêm Album mới
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Tìm kiếm album từ thư viện để thêm vào bộ sưu tập cá nhân.
                </p>
              </div>
              <button
                onClick={() => setIsAddAlbumOpen(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative mb-6 z-10">
              <div className="absolute inset-0 bg-purple-500/5 rounded-2xl blur-md opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={modalSearchQ}
                  onChange={(e) => setModalSearchQ(e.target.value)}
                  placeholder="Nhập tên album hoặc tên nghệ sĩ..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] placeholder-white/30"
                />
                {modalSearchQ && (
                  <button
                    onClick={() => setModalSearchQ('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="relative z-10 max-h-[320px] overflow-y-auto pr-1 space-y-3 scrollbar-hide">
              {isSearching ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 size={32} className="text-purple-500 animate-spin mb-3" />
                  <p className="text-sm text-white/50">Đang tìm kiếm trên hệ thống...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-2 px-1">
                    KẾT QUẢ TÌM THẤY ({searchResults.length})
                  </div>
                  {searchResults.map((album) => {
                    const alreadyAdded = albums.some(a => a.id === album.id)
                    return (
                      <div
                        key={album.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-200">
                            {album.albumArt ? (
                              <img src={album.albumArt} alt={album.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-900/20 text-purple-400">
                                <Music size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white/95 truncate" title={album.title}>
                              {album.title}
                            </h4>
                            <p className="text-xs text-white/40 truncate mt-0.5">
                              {album.artist}
                            </p>
                          </div>
                        </div>

                        {alreadyAdded ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                              <Check size={12} /> Đã thêm
                            </span>
                            <button
                              onClick={() => handleRemoveAlbum(album.id)}
                              className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                              title="Xóa khỏi thư viện"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddAlbum(album)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#120E18] hover:bg-purple-500 hover:text-white shadow-md transition-all duration-200 cursor-pointer"
                          >
                            Thêm
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : modalSearchQ ? (
                <div className="py-12 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                  <Search size={24} className="text-white/20 mb-2" />
                  <h5 className="text-sm font-bold text-white/80">Không tìm thấy album</h5>
                  <p className="text-xs text-white/40 max-w-xs mt-1">
                    Chúng tôi không tìm thấy kết quả nào phù hợp với &ldquo;{modalSearchQ}&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                    <Search size={20} className="text-purple-400" />
                  </div>
                  <h5 className="text-sm font-bold text-white/80">Nhập từ khóa tìm kiếm</h5>
                  <p className="text-xs text-white/40 max-w-xs mt-1 px-4">
                    Nhập tên album hoặc nghệ sĩ để bắt đầu tìm kiếm những tác phẩm âm nhạc đỉnh cao.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {isAddPlaylistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#070509]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsAddPlaylistOpen(false)}
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
                <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                  <span className="text-purple-400">✨</span> Tạo Playlist mới
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Tạo một danh sách phát của riêng bạn để lưu trữ những giai điệu yêu thích.
                </p>
              </div>
              <button
                onClick={() => setIsAddPlaylistOpen(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs Box */}
            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Tên playlist</label>
                <input
                  type="text"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="Nhập tên danh sách phát..."
                  maxLength={50}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] placeholder-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Mô tả (Không bắt buộc)</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="Thêm mô tả cho danh sách phát này..."
                  rows={3}
                  maxLength={150}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-purple-500/50 text-white text-sm outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] placeholder-white/20 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddPlaylistOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer text-center"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistTitle.trim()}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-95 shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)',
                  }}
                >
                  Tạo Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deletion Alert Dialog */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (deleteModal.itemType === 'playlist') {
            handleRemovePlaylist(deleteModal.itemId)
          } else {
            handleRemoveAlbum(deleteModal.itemId)
          }
        }}
      />

    </div>
  )
}

