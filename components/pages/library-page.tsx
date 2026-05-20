"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, Clock, X, Loader2, Music, Check, Trash2, RotateCw, TrendingUp } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import { type Track } from '@/lib/player-store'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n-store'
import { useSearchParams, useRouter } from 'next/navigation'
import { searchAlbums } from '@/lib/music-api'
import { useToast } from '@/components/ui/use-toast'
import {
  PageHero,
  AmbientOrbs,
  MusicShelf,
} from '@/components/ui/vibewave'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { Portal } from '@/components/ui/portal'

type Tab = 'playlists' | 'albums' | 'liked' | 'recent'

interface LibraryItem {
  id: string
  title: string
  subtitle: string
  image?: string
  href: string
  type: string
  tracks?: Track[]
}

export default function LibraryPage({
  initialAlbums = [],
}: {
  initialAlbums?: LibraryItem[],
}) {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
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
    const loadAlbums = () => {
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
    }

    loadAlbums()

    window.addEventListener('vw_albums_updated', loadAlbums)
    return () => window.removeEventListener('vw_albums_updated', loadAlbums)
  }, [initialAlbums])

  // Suggested Albums State
  const [suggestedAlbums, setSuggestedAlbums] = useState<LibraryItem[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const handleRefreshSuggestions = async (force = false) => {
    if (activeTab !== 'albums' && !force) return
    if (suggestedAlbums.length > 0 && !force) return

    setIsLoadingSuggestions(true)
    try {
      // Query dynamic albums with standard Vietnamese pop/indie/rap and international keywords
      const terms = ['Hoang Thuy Linh', 'Den Vau', 'Vu.', 'Son Tung M-TP', 'Wren Evans', 'MCK', 'tlinh', 'Grey D', 'Obito', 'Lo-fi', 'Indie', 'Chill']
      const randomTerm = terms[Math.floor(Math.random() * terms.length)]
      const results = await searchAlbums(randomTerm, 12)
      
      // Beautiful real fallback albums with high quality artwork
      const fallbackAlbums = [
        {
          id: '1720847926',
          title: 'Loi Choi (The Album)',
          subtitle: 'Wren Evans',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/bf/25/a4/bf25a407-7a54-61c0-eb88-06ad048e89f8/cover.jpg/600x600bb.jpg',
          href: '/album/1720847926',
          type: 'album'
        },
        {
          id: '1676906206',
          title: '99%',
          subtitle: 'MCK',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5b/7e/15/5b7e15d8-c923-d6c1-a534-7221d6fb8fa8/197187978250.jpg/600x600bb.jpg',
          href: '/album/1676906206',
          type: 'album'
        },
        {
          id: '1644781489',
          title: 'Một Vạn Năm',
          subtitle: 'Vũ.',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/4a/1b/ec/4a1becf6-281b-5e6a-72ef-7ff53f5df314/196871358988.jpg/600x600bb.jpg',
          href: '/album/1644781489',
          type: 'album'
        },
        {
          id: '1483863489',
          title: 'Hoàng',
          subtitle: 'Hoàng Thùy Linh',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/42/fa/b9/42fab960-9dc6-bdf8-6c84-a15d789bd072/cover.jpg/600x600bb.jpg',
          href: '/album/1483863489',
          type: 'album'
        },
        {
          id: '1504780229',
          title: 'After Hours',
          subtitle: 'The Weeknd',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3d/bf/db/3dbfdb86-444c-35d2-f673-c15c2ec4df37/20UMGIM15525.rgb.jpg/600x600bb.jpg',
          href: '/album/1504780229',
          type: 'album'
        },
        {
          id: '1480000000',
          title: 'Fine Line',
          subtitle: 'Harry Styles',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/e5/26/1b/e5261bf3-8686-ad99-b1be-e81a0b38a48b/886448107937.jpg/600x600bb.jpg',
          href: '/album/1480000000',
          type: 'album'
        },
        {
          id: '1589333333',
          title: 'Đánh Đổi',
          subtitle: 'Obito',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/91/ab/b8/91abb847-2cb6-a664-07d0-14e30fcb21db/859777977469_cover.jpg/600x600bb.jpg',
          href: '/album/1589333333',
          type: 'album'
        },
        {
          id: '1690000000',
          title: 'Ái',
          subtitle: 'tlinh',
          image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a5/d2/88/a5d288b8-2a28-6622-4822-7935de98c9f5/197188732684.jpg/600x600bb.jpg',
          href: '/album/1690000000',
          type: 'album'
        }
      ]

      if (results && results.length >= 4) {
        const formattedResults = results.map(r => ({
          id: String(r.id),
          title: r.title,
          subtitle: r.artist,
          image: r.albumArt,
          href: `/album/${r.id}`,
          type: 'album'
        }))
        const combined = [...formattedResults, ...fallbackAlbums]
        const unique = combined.filter((album, index, self) =>
          self.findIndex(a => a.id === album.id) === index
        )
        setSuggestedAlbums(unique.slice(0, 10))
      } else {
        setSuggestedAlbums(fallbackAlbums)
      }
    } catch (err) {
      console.error('Failed to load suggestions:', err)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  useEffect(() => {
    handleRefreshSuggestions()
  }, [activeTab])

  const DEFAULT_PLAYLISTS: LibraryItem[] = []

  // Hydration-safe State for Playlists
  const [playlists, setPlaylists] = useState<LibraryItem[]>([])

  useEffect(() => {
    const loadPlaylists = () => {
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
    }

    loadPlaylists()

    window.addEventListener('vw_playlists_updated', loadPlaylists)
    return () => window.removeEventListener('vw_playlists_updated', loadPlaylists)
  }, [t.songsLabel])

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

    // Navigate to the newly created playlist
    router.push(`/playlist/${newId}`)
  }

  const handleAddAlbum = (album: any) => {
    const newItem: LibraryItem = {
      id: album.id,
      title: album.title,
      subtitle: album.artist || album.subtitle,
      image: album.albumArt || album.image,
      href: album.href || `/album/${album.id}`,
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
          gradientClass="!text-white"
          subtitleColor="rgba(255, 255, 255, 0.75)"
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#9B4DE0] to-[#7C3AED] transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#aa62ee] to-[#8b44e3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus size={18} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
              <span className="relative z-10 tracking-wide">{activeTab === 'albums' ? t.newAlbum : t.newPlaylist}</span>
            </button>
          }
        />
      </div>

      {/* Tabs + controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-[#120E18]/60 backdrop-blur-xl border border-white/5 shadow-xl relative z-10">
        <div className="flex items-center gap-2 w-full sm:w-auto p-1.5 rounded-xl bg-white/[0.02]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        <div className="relative w-full sm:w-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors duration-300 z-10"
          />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t.filter || "Tìm kiếm trong thư viện..."}
            className="w-full sm:w-[320px] pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-white/[0.03] border border-white/10 text-white placeholder-slate-400 hover:bg-white/[0.05] hover:border-white/20 focus:bg-white/[0.07] focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] relative z-10"
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
              playlistTracks={item.tracks}
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
              isLibraryPage={true}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden group/empty transition-all duration-500 hover:border-purple-500/20 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),0_0_30px_rgba(155,77,224,0.03)] mt-6">
            {/* Backing Ambient Purple Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
            
            {/* Floating Glowing Icon Bubble */}
            <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] backdrop-blur-md flex items-center justify-center mb-4 text-purple-400 border border-white/10 shadow-lg shadow-purple-500/5 group-hover/empty:scale-110 group-hover/empty:border-purple-500/30 group-hover/empty:shadow-purple-500/10 group-hover/empty:text-purple-300 transition-all duration-500">
              <Search size={24} className="animate-pulse" />
            </div>
            
            <h3 className="relative z-10 text-base font-semibold text-white tracking-tight">
              Không tìm thấy kết quả
            </h3>
            
            <p className="relative z-10 text-xs text-white/50 mt-2 max-w-md leading-relaxed">
              Không có kết quả nào cho &ldquo;<span className="text-purple-300 font-semibold">{searchQ}</span>&rdquo;. Hãy thử tìm kiếm với từ khóa khác hoặc thêm nội dung mới.
            </p>
          </div>
        )}
      </div>

      {/* Suggested Albums Section */}
      {activeTab === 'albums' && (
        <div className="mt-16 pt-10 border-t border-white/5 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl bg-purple-500/10 text-white border border-purple-500/20">
                  Gợi ý hàng đầu
                </span>
              </div>
              <h2 
                className="font-display font-semibold text-2xl text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Album gợi ý cho bạn
              </h2>
              <p className="text-sm text-white/70 mt-1">
                Khám phá các album đang được yêu thích và đề xuất dựa trên sở thích âm nhạc của bạn.
              </p>
            </div>

            {/* Refresh Pill Button on the far right */}
            <button
              onClick={() => handleRefreshSuggestions(true)}
              disabled={isLoadingSuggestions}
              className="group flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/20 text-white/80 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(155,77,224,0.05)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer shadow-md"
            >
              <RotateCw
                size={14}
                className={cn(
                  "transition-transform duration-700",
                  isLoadingSuggestions ? "animate-spin text-purple-400" : "group-hover:rotate-180"
                )}
              />
              <span>Làm mới</span>
            </button>
          </div>

          {isLoadingSuggestions && suggestedAlbums.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 size={32} className="text-purple-500 animate-spin mb-3" />
              <p className="text-sm text-white/50">Đang tìm kiếm gợi ý tốt nhất cho bạn...</p>
            </div>
          ) : (
            <MusicShelf>
              {suggestedAlbums.map((album) => (
                <MusicCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={album.subtitle}
                  image={album.image}
                  href={album.href}
                  type="album"
                  onHideSuggestion={(id) => {
                    setSuggestedAlbums((prev) => prev.filter((a) => a.id !== id))
                    toast({
                      title: "Đã ẩn gợi ý",
                      description: `Chúng tôi sẽ không gợi ý album "${album.title}" nữa.`,
                    })
                  }}
                />
              ))}
            </MusicShelf>
          )}
        </div>
      )}

      {/* Add Album Modal */}
      {isAddAlbumOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              
              {/* Popular Search Suggestions */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-white/45 flex items-center gap-1 font-medium select-none">
                  <TrendingUp size={12} className="text-purple-400 animate-pulse" />
                  Xu hướng:
                </span>
                {['Sơn Tùng M-TP', 'Vũ.', 'Đen Vâu', 'tlinh', 'Wren Evans'].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setModalSearchQ(kw)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-white/60 hover:text-purple-300 transition-all duration-200 cursor-pointer active:scale-95 text-[11px] font-medium"
                  >
                    {kw}
                  </button>
                ))}
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
                            <h4 className="text-sm font-display font-semibold text-white/95 truncate" title={album.title}>
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
                  <h5 className="text-sm font-display font-bold text-white/80">Không tìm thấy album</h5>
                  <p className="text-xs text-white/40 max-w-xs mt-1">
                    Chúng tôi không tìm thấy kết quả nào phù hợp với &ldquo;{modalSearchQ}&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-3xl bg-[#1A1423]/20 border border-white/5 p-6 shadow-inner">
                  {/* Decorative glowing background light */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/[0.03] rounded-full blur-[50px] pointer-events-none" />
                  
                  {/* Premium animated multi-layer icon */}
                  <div className="relative w-20 h-20 flex items-center justify-center mb-5">
                    {/* Pulsing ring 1 */}
                    <div className="absolute inset-0 rounded-3xl bg-purple-500/5 border border-purple-500/10 animate-ping [animation-duration:3s]" />
                    {/* Pulsing ring 2 */}
                    <div className="absolute inset-2 rounded-2.5xl bg-purple-500/10 border border-purple-500/20 animate-pulse" />
                    
                    {/* The Icon Container */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_8px_32px_rgba(155,77,224,0.15)] backdrop-blur-md transition-transform duration-500">
                      <Search size={22} className="text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                      {/* Floating music note icon overlay */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/35 flex items-center justify-center text-[10px] text-indigo-300 animate-bounce">
                        ♬
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="relative z-10 text-sm font-display font-bold text-white/90 tracking-wide">
                    Nhập từ khóa tìm kiếm
                  </h5>
                  <p className="relative z-10 text-xs text-white/50 max-w-xs mt-1.5 px-4 leading-relaxed">
                    Nhập tên album hoặc nghệ sĩ để bắt đầu tìm kiếm những tác phẩm âm nhạc đỉnh cao.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* Create Playlist Modal */}
      {isAddPlaylistOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        </Portal>
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

