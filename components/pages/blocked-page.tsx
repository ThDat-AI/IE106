"use client"

import { useState, useEffect, useRef } from 'react'
import { Plus, Search, X, Loader2, Music, Ban, Check, Trash2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n-store'
import { searchTracks, searchAlbums, searchArtists } from '@/lib/music-api'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import {
  getBlockedTracks,
  getBlockedAlbums,
  getBlockedArtists,
  toggleBlockTrack,
  toggleBlockAlbum,
  toggleBlockArtist,
  isTrackBlocked,
  isAlbumBlocked,
  isArtistBlocked,
  type BlockedItem,
  type Track
} from '@/lib/player-store'
import { PageHero, AmbientOrbs } from '@/components/ui/vibewave'
import { Portal } from '@/components/ui/portal'

type Tab = 'songs' | 'albums' | 'artists'

export default function BlockedPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('songs')
  
  // Local list states for blocked items
  const [blockedSongs, setBlockedSongs] = useState<BlockedItem[]>([])
  const [blockedAlbums, setBlockedAlbums] = useState<BlockedItem[]>([])
  const [blockedArtists, setBlockedArtists] = useState<BlockedItem[]>([])

  // Search/Filter state for items displayed in the list
  const [filterQuery, setFilterQuery] = useState('')

  // Add Item Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [modalSearchQ, setModalSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Toast notification state
  const { toast } = useToast()

  // Load blocked items from localStorage on mount and register custom event
  const reloadBlockedData = () => {
    setBlockedSongs(getBlockedTracks())
    setBlockedAlbums(getBlockedAlbums())
    setBlockedArtists(getBlockedArtists())
  }

  useEffect(() => {
    reloadBlockedData()
    window.addEventListener('vw_blocked_updated', reloadBlockedData)
    return () => window.removeEventListener('vw_blocked_updated', reloadBlockedData)
  }, [])

  // Trigger search in modal when query changes
  useEffect(() => {
    if (!modalSearchQ.trim()) {
      setSearchResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true)
      try {
        let results: any[] = []
        if (activeTab === 'songs') {
          results = await searchTracks(modalSearchQ, 15)
        } else if (activeTab === 'albums') {
          results = await searchAlbums(modalSearchQ, 15)
        } else if (activeTab === 'artists') {
          results = await searchArtists(modalSearchQ, 10)
        }
        setSearchResults(results)
      } catch (err) {
        console.error('Failed to search for block items:', err)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 450)

    return () => clearTimeout(delayDebounce)
  }, [modalSearchQ, activeTab])

  // Reset modal when closing
  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setModalSearchQ('')
    setSearchResults([])
  }

  // Block item operations
  const handleBlockSongInModal = (trackItem: any) => {
    const songObj = {
      id: String(trackItem.id),
      title: trackItem.title,
      artist: trackItem.artist,
      albumArt: trackItem.albumArt || trackItem.artworkUrl100
    }
    toggleBlockTrack(songObj)
    toast({
      title: "Đã chặn bài hát",
      description: `Đã chặn bài hát "${trackItem.title}"!`,
      action: (
        <ToastAction altText="Hoàn tác" onClick={() => toggleBlockTrack(songObj)}>
          Hoàn tác
        </ToastAction>
      )
    })
  }

  const handleBlockAlbumInModal = (albumItem: any) => {
    const albumObj = {
      id: String(albumItem.id),
      title: albumItem.title,
      artist: albumItem.artist,
      albumArt: albumItem.albumArt
    }
    toggleBlockAlbum(albumObj)
    toast({
      title: "Đã chặn album",
      description: `Đã chặn album "${albumItem.title}"!`,
      action: (
        <ToastAction altText="Hoàn tác" onClick={() => toggleBlockAlbum(albumObj)}>
          Hoàn tác
        </ToastAction>
      )
    })
  }

  const handleBlockArtistInModal = (artistItem: any) => {
    const artistObj = {
      id: String(artistItem.id),
      name: artistItem.name,
      genre: artistItem.genre,
      image: artistItem.image
    }
    toggleBlockArtist(artistObj)
    toast({
      title: "Đã chặn nghệ sĩ",
      description: `Đã chặn nghệ sĩ "${artistItem.name}"!`,
      action: (
        <ToastAction altText="Hoàn tác" onClick={() => toggleBlockArtist(artistObj)}>
          Hoàn tác
        </ToastAction>
      )
    })
  }

  const handleUnblockItem = (item: BlockedItem) => {
    if (item.type === 'track') {
      const songObj = { id: item.id, title: item.title, artist: item.subtitle, albumArt: item.image }
      toggleBlockTrack(songObj)
      toast({
        title: "Đã bỏ chặn bài hát",
        description: `Đã bỏ chặn bài hát "${item.title}"!`,
        action: (
          <ToastAction altText="Hoàn tác" onClick={() => toggleBlockTrack(songObj)}>
            Hoàn tác
          </ToastAction>
        )
      })
    } else if (item.type === 'album') {
      const albumObj = { id: item.id, title: item.title, artist: item.subtitle, albumArt: item.image }
      toggleBlockAlbum(albumObj)
      toast({
        title: "Đã bỏ chặn album",
        description: `Đã bỏ chặn album "${item.title}"!`,
        action: (
          <ToastAction altText="Hoàn tác" onClick={() => toggleBlockAlbum(albumObj)}>
            Hoàn tác
          </ToastAction>
        )
      })
    } else if (item.type === 'artist') {
      const artistObj = { name: item.title, image: item.image }
      toggleBlockArtist(artistObj)
      toast({
        title: "Đã bỏ chặn nghệ sĩ",
        description: `Đã bỏ chặn nghệ sĩ "${item.title}"!`,
        action: (
          <ToastAction altText="Hoàn tác" onClick={() => toggleBlockArtist(artistObj)}>
            Hoàn tác
          </ToastAction>
        )
      })
    }
  }

  // Active items for active tab
  const getActiveTabItems = () => {
    if (activeTab === 'songs') return blockedSongs
    if (activeTab === 'albums') return blockedAlbums
    return blockedArtists
  }

  const activeItems = getActiveTabItems()
  const filteredItems = activeItems.filter(
    item =>
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const tabsConfig = [
    { id: 'songs', label: t.songs || 'Bài hát', count: blockedSongs.length },
    { id: 'albums', label: t.albums || 'Album', count: blockedAlbums.length },
    { id: 'artists', label: t.artists || 'Nghệ sĩ', count: blockedArtists.length }
  ]

  return (
    <div className="min-h-screen pb-32 text-white relative">
      <AmbientOrbs />

      <PageHero
        title={t.blockList || 'Danh sách chặn'}
        subtitle={t.blockListDesc || 'Quản lý danh sách các bài hát, album và nghệ sĩ đã bị chặn.'}
        gradientClass="!text-white"
        subtitleColor="rgba(255, 255, 255, 0.75)"
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group relative flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(155,77,224,0.2)] hover:shadow-[0_0_30px_rgba(155,77,224,0.4)] cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#9B4DE0] to-[#7C3AED] transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#aa62ee] to-[#8b44e3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Plus size={18} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
            <span className="relative z-10 tracking-wide">
              {activeTab === 'songs' 
                ? (t.searchToBlockSong || 'Chặn thêm bài hát') 
                : activeTab === 'albums' 
                  ? (t.searchToBlockAlbum || 'Chặn thêm album') 
                  : (t.searchToBlockArtist || 'Chặn thêm nghệ sĩ')}
            </span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        {/* Actions & Search Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-[#120E18]/60 backdrop-blur-xl border border-white/5 shadow-xl relative z-10">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto p-1.5 rounded-xl bg-white/[0.02] overflow-x-auto scrollbar-hide">
            {tabsConfig.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as Tab)
                    setFilterQuery('')
                  }}
                  className={`
                    relative flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold 
                    transition-all duration-300 flex-1 sm:flex-none overflow-hidden cursor-pointer group
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border border-purple-500/40 text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-[#191322] border border-white/10 text-slate-200 hover:bg-[#251d33] hover:border-white/20 hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse shadow-[0_0_4px_#ffffff]" />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  <span
                    className={`
                      relative z-10 text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-all duration-300
                      ${isActive 
                        ? 'bg-white text-purple-950 shadow-[0_2px_4px_rgba(0,0,0,0.15)]' 
                        : 'bg-[#2d223c] text-slate-200 group-hover:bg-[#382b4a] group-hover:text-white'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search filter in current page */}
          <div className="relative w-full sm:w-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors duration-300 z-10"
            />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder={t.searchToBlockPlaceholder || 'Tìm kiếm để chặn...'}
              className="w-full sm:w-[320px] pl-11 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-white/[0.03] border border-white/10 text-white placeholder-slate-400 hover:bg-white/[0.05] hover:border-white/20 focus:bg-white/[0.07] focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] relative z-10"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* List render */}
        <div className="mt-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative flex flex-col p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(155,77,224,0.1)] hover:translate-y-[-2px] overflow-hidden",
                    item.type === 'artist' && "items-center text-center"
                  )}
                >
                  {/* Glowing background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Artwork / Avatar */}
                  <div
                    className={cn(
                      "relative aspect-square overflow-hidden mb-4 border border-white/10 shadow-lg shrink-0",
                      item.type === 'artist' ? "rounded-full w-36 h-36" : "rounded-2xl w-full"
                    )}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#251A36] text-purple-400">
                        <Music size={item.type === 'artist' ? 36 : 28} />
                      </div>
                    )}
                    {/* Hover state icon overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Ban className="text-red-500 scale-75 group-hover:scale-100 transition-transform duration-300" size={32} />
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="w-full min-w-0 mb-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold truncate text-white group-hover:text-purple-400 transition-colors" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/50 truncate mt-1">
                        {item.subtitle}
                      </p>
                    </div>
                    {item.blockedAt && (
                      <span className="text-[10px] text-white/30 block mt-2 font-medium">
                        Đã chặn: {new Date(item.blockedAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>

                  {/* Unblock button */}
                  <button
                    onClick={() => handleUnblockItem(item)}
                    className="w-full py-2.5 rounded-2xl text-xs font-bold border border-white/10 text-white/70 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 active:scale-[0.97] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 relative z-10"
                  >
                    <Trash2 size={13} />
                    <span>{t.unblock || 'Bỏ chặn'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Beautiful Glassmorphic Empty State */
            <div className="py-24 text-center flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group/empty transition-all duration-500">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

              <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-5 text-slate-400 border border-white/5 shadow-lg group-hover/empty:scale-105 group-hover/empty:border-purple-500/20 group-hover/empty:text-purple-400 transition-all duration-300">
                <Ban size={28} className="text-slate-400 group-hover/empty:text-purple-400 transition-colors duration-300" />
              </div>

              <h3 className="relative z-10 text-base font-bold text-white tracking-tight">
                {filterQuery
                  ? 'Không tìm thấy kết quả phù hợp'
                  : activeTab === 'songs'
                    ? t.noBlockedSongs || 'Chưa chặn bài hát nào'
                    : activeTab === 'albums'
                      ? t.noBlockedAlbums || 'Chưa chặn album nào'
                      : t.noBlockedArtists || 'Chưa chặn nghệ sĩ nào'}
              </h3>

              <p className="relative z-10 text-xs text-white/40 mt-2 max-w-md leading-relaxed">
                {filterQuery
                  ? `Không có kết quả khớp với "${filterQuery}". Hãy nhập từ khóa khác.`
                  : t.emptyBlockListDesc || 'Các nội dung bị chặn sẽ không được phát trong hàng chờ và không xuất hiện trong gợi ý.'}
              </p>

              {!filterQuery && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10 text-white transition-all duration-300 cursor-pointer active:scale-95"
                >
                  Chặn ngay mục đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Item to Block Portal Modal */}
      {isAddModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark background blur backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
              onClick={handleCloseModal}
            />

            {/* Premium glass modal card */}
            <div
              className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-white/10 p-6 flex flex-col gap-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] animate-in zoom-in-95 duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(22, 16, 31, 0.96) 0%, rgba(13, 9, 19, 0.98) 100%)',
              }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 relative z-10">
                <div>
                  <h3 className="text-base font-display font-semibold text-white">
                    {activeTab === 'songs'
                      ? t.searchToBlockSong || 'Tìm bài hát để chặn'
                      : activeTab === 'albums'
                        ? t.searchToBlockAlbum || 'Tìm album để chặn'
                        : t.searchToBlockArtist || 'Tìm nghệ sĩ để chặn'}
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Nhập tên từ khóa tìm kiếm trên hệ thống để chặn
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search search input */}
              <div className="relative z-10">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors"
                />
                <input
                  type="text"
                  autoFocus
                  value={modalSearchQ}
                  onChange={e => setModalSearchQ(e.target.value)}
                  placeholder={
                    activeTab === 'songs'
                      ? 'Nhập tên bài hát hoặc ca sĩ...'
                      : activeTab === 'albums'
                        ? 'Nhập tên album...'
                        : 'Nhập tên nghệ sĩ...'
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs outline-none transition-all duration-300 bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:bg-white/[0.06] focus:border-purple-500/50"
                />
              </div>

              {/* Trend suggestion tags */}
              {!modalSearchQ && (
                <div className="relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/35 flex items-center gap-1 mb-2">
                    <TrendingUp size={11} className="text-purple-400" />
                    <span>Gợi ý xu hướng tìm kiếm:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Chúng Ta Của Tương Lai', 'Sơn Tùng M-TP', 'Đen Vâu', 'See Tình', 'Lạ Lùng'].map(kw => (
                      <button
                        key={kw}
                        onClick={() => setModalSearchQ(kw)}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-white/60 hover:text-purple-300 transition-all duration-200 cursor-pointer active:scale-95 text-[10px] font-semibold"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results Box */}
              <div className="relative z-10 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {isSearching ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Loader2 size={32} className="text-purple-500 animate-spin mb-3" />
                    <p className="text-xs text-white/50">Đang tìm kiếm thông tin...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2 px-1">
                      KẾT QUẢ TÌM THẤY ({searchResults.length})
                    </div>
                    {searchResults.map(item => {
                      // Check if already blocked
                      let isBlocked = false
                      if (activeTab === 'songs') {
                        isBlocked = isTrackBlocked(item.id)
                      } else if (activeTab === 'albums') {
                        isBlocked = isAlbumBlocked(item.id)
                      } else if (activeTab === 'artists') {
                        isBlocked = isArtistBlocked(item.name)
                      }

                      const coverImage = activeTab === 'songs' ? item.albumArt || item.artworkUrl100 : activeTab === 'albums' ? item.albumArt : item.image
                      const primaryTitle = activeTab === 'artists' ? item.name : item.title
                      const secondaryTitle = activeTab === 'artists' ? item.genre || 'Nghệ sĩ' : item.artist

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                "relative w-11 h-11 overflow-hidden bg-white/5 border border-white/10 shrink-0",
                                activeTab === 'artists' ? "rounded-full" : "rounded-xl"
                              )}
                            >
                              {coverImage ? (
                                <img src={coverImage} alt={primaryTitle} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-900/10 text-purple-400">
                                  <Music size={16} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-white truncate" title={primaryTitle}>
                                {primaryTitle}
                              </h4>
                              <p className="text-[11px] text-white/40 truncate mt-0.5">
                                {secondaryTitle}
                              </p>
                            </div>
                          </div>

                          {isBlocked ? (
                            <span className="text-[10px] text-red-400 font-bold px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-1 select-none">
                              <Check size={11} /> Đã chặn
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (activeTab === 'songs') handleBlockSongInModal(item)
                                else if (activeTab === 'albums') handleBlockAlbumInModal(item)
                                else if (activeTab === 'artists') handleBlockArtistInModal(item)
                              }}
                              className="px-4 py-2 rounded-xl text-[10px] font-bold bg-white text-[#120E18] hover:bg-red-500 hover:text-white shadow-md transition-all duration-200 cursor-pointer active:scale-95"
                            >
                              {t.block || 'Chặn'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : modalSearchQ ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                    <Search size={22} className="text-white/20 mb-2" />
                    <h5 className="text-xs font-bold text-white/80">Không tìm thấy nội dung phù hợp</h5>
                    <p className="text-[10px] text-white/40 max-w-xs mt-1">
                      Hãy thay đổi từ khóa tìm kiếm khác.
                    </p>
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl bg-[#1A1423]/10 border border-white/5 p-6">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/[0.02] rounded-full blur-[40px] pointer-events-none" />
                    <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                      <div className="absolute inset-0 rounded-2xl bg-purple-500/5 border border-purple-500/10 animate-ping [animation-duration:3.5s]" />
                      <div className="absolute inset-2 rounded-xl bg-purple-500/10 border border-purple-500/15" />
                      <Search size={18} className="text-purple-400 relative z-10" />
                    </div>
                    <h5 className="text-xs font-bold text-white/85">Bắt đầu tìm kiếm</h5>
                    <p className="text-[10px] text-white/45 max-w-xs mt-1">
                      Nhập từ khóa bất kỳ ở thanh tìm kiếm để tra cứu thông tin nhạc trên iTunes Store.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}


    </div>
  )
}
