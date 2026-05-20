"use client"

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n-store'
import {
  Home,
  Sparkles,
  Library,
  BarChart2,
  ChevronLeft,
  Plus,
  Music2,
  Heart,
  Clock,
  Play,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Portal } from '@/components/ui/portal'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed

  const [playlists, setPlaylists] = useState<{ label: string; href: string }[]>([])
  const [likedCount, setLikedCount] = useState(0)

  // Custom states for Create Playlist Modal
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return

    const newId = 'custom_' + Date.now()
    const newPlaylist = {
      id: newId,
      title: newPlaylistTitle.trim(),
      subtitle: `0 ${t.songsLabel || 'bài hát'} · 0m`,
      image: undefined,
      href: `/playlist/${newId}`,
      type: 'playlist',
      description: newPlaylistDesc.trim() || 'Danh sách phát cá nhân của bạn.',
      tracks: []
    }

    let currentPlaylists = []
    const stored = localStorage.getItem('vw_saved_playlists')
    if (stored) {
      try {
        currentPlaylists = JSON.parse(stored)
      } catch (e) {}
    }

    const updated = [newPlaylist, ...currentPlaylists]
    localStorage.setItem('vw_saved_playlists', JSON.stringify(updated))

    // Notify other parts of the app
    window.dispatchEvent(new Event('vw_playlists_updated'))

    // Reset and close
    setNewPlaylistTitle('')
    setNewPlaylistDesc('')
    setIsAddPlaylistOpen(false)

    // Redirect to the newly created playlist page
    router.push(`/playlist/${newId}`)
  }

  useEffect(() => {
    function loadPlaylists() {
      const stored = localStorage.getItem('vw_saved_playlists')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Filter out default mockup playlists
          const customPlaylists = parsed.filter((p: any) => !/^p\d+$/.test(p.id))
          setPlaylists(customPlaylists.map((p: any) => ({ label: p.title, href: p.href })))
          return
        } catch (e) {}
      }
      setPlaylists([])
    }

    function loadLikedCount() {
      const stored = localStorage.getItem('vw_liked_tracks')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setLikedCount(parsed.length)
          return
        } catch (e) {}
      }
      setLikedCount(0)
    }

    loadPlaylists()
    loadLikedCount()

    window.addEventListener('vw_playlists_updated', loadPlaylists)
    window.addEventListener('vw_likes_updated', loadLikedCount)
    return () => {
      window.removeEventListener('vw_playlists_updated', loadPlaylists)
      window.removeEventListener('vw_likes_updated', loadLikedCount)
    }
  }, [])

  const NAV_ITEMS = [
    { icon: Home, label: t.home, href: '/' },
    { icon: Sparkles, label: t.yourVibe, href: '/your-vibe' },
    { icon: Library, label: t.library, href: '/library' },
    { icon: BarChart2, label: t.charts, href: '/charts' },
  ]

  const LIBRARY_ITEMS = [
    { icon: Heart, label: t.likedSongs, href: '/library/liked', count: String(likedCount) },
    { icon: Clock, label: t.recentlyPlayed, href: '/library/recent', count: null },
  ]

  function toggle() {
    const next = !collapsed
    setInternalCollapsed(next)
    onToggle?.(next)
  }

  function isActive(href: string) {
    const [path, query] = href.split('?')
    if (path === '/') return pathname === '/'

    const pathMatches = pathname === path || (path !== '/library' && pathname.startsWith(path))
    if (!query) return pathMatches

    const params = new URLSearchParams(query)
    return pathMatches && Array.from(params.entries()).every(([key, value]) =>
      searchParams.get(key) === value
    )
  }

  return (
    <>
      <aside
        suppressHydrationWarning={true}
        className={cn(
          "fixed left-0 top-0 bottom-0 pt-16 flex flex-col z-40 transition-all duration-300 ease-in-out",
          "bg-white/[0.01] backdrop-blur-3xl border-r border-white/5"
        )}
        style={{
          width: collapsed ? '72px' : '240px',
        }}
        aria-label="Navigation sidebar"
      >
      {/* Collapse toggle - Redesigned for premium feel */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-vw hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10 group"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={18}
            className={cn(
              "text-white/80 transition-transform duration-300 group-hover:text-vw-purple",
              collapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
      </div>

      {/* Main navigation */}
      <nav aria-label="Main navigation" className="px-3 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl h-12 transition-vw px-3 border border-transparent",
                active
                  ? "bg-vw-purple/35 text-white border-vw-purple/30 shadow-lg shadow-purple-500/20"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active Indicator Line */}
              {active && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-vw-purple rounded-r-full shadow-[0_0_15px_rgba(155,77,224,0.8)]" />
              )}

              <Icon
                size={20}
                className={cn(
                  "shrink-0 transition-transform duration-300",
                  active ? "text-vw-purple scale-110" : "group-hover:scale-110 group-hover:text-vw-purple/80"
                )}
              />

              {!collapsed && (
                <span className={cn(
                  "text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300",
                  active ? "translate-x-0.5 text-white drop-shadow-[0_0_8px_rgba(155,77,224,0.3)]" : "group-hover:translate-x-0.5"
                )}>
                  {label}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#1F162E] border border-white/10 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar px-3 pb-4">
          {/* Library section */}
          <nav aria-label="Library" className="mb-8">
            <div className="px-3 pb-3 flex items-center justify-between">
              <span className="text-[11px] font-display uppercase tracking-[0.2em] text-white/85 font-semibold">
                {t.library}
              </span>
            </div>
            <div className="space-y-1">
              {LIBRARY_ITEMS.map(({ icon: Icon, label, href, count }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl h-11 transition-vw px-3 border border-transparent",
                      active
                        ? "bg-vw-purple/35 text-white border-vw-purple/30 shadow-sm shadow-purple-500/20"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Active Indicator Line */}
                    {active && (
                      <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-vw-purple rounded-r-full shadow-[0_0_15px_rgba(155,77,224,0.8)]" />
                    )}

                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0 transition-all duration-300",
                        active ? "text-vw-purple scale-110" : "group-hover:scale-110 group-hover:text-vw-purple/70"
                      )}
                    />
                    <span className={cn(
                      "text-sm font-medium flex-1 whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300",
                      active ? "translate-x-0.5 text-white drop-shadow-[0_0_8px_rgba(155,77,224,0.3)]" : "group-hover:translate-x-0.5"
                    )}>
                      {label}
                    </span>
                    {count && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold transition-all",
                          label === t.likedSongs
                            ? "bg-vw-purple/30 text-white border border-vw-purple/40 group-hover:bg-vw-purple/40"
                            : "bg-white/10 text-white/80 border border-white/10 group-hover:bg-white/20"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Playlists */}
          <div className="space-y-1">
            <div className="px-3 pb-3 flex items-center justify-between">
              <span className="text-[11px] font-display uppercase tracking-[0.2em] text-white/85 font-semibold">
                {t.playlists}
              </span>
              <button
                onClick={() => setIsAddPlaylistOpen(true)}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-vw hover:bg-vw-purple/30 hover:text-white text-white/80 border border-white/10 hover:border-vw-purple/30 cursor-pointer"
                aria-label="Create new playlist"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-0.5">
              {playlists.map(({ label, href }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl h-10 transition-vw px-3 relative border border-transparent",
                      active
                        ? "bg-vw-purple/35 text-white border-vw-purple/25"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {/* Active Indicator Line */}
                    {active && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-vw-purple rounded-r-full shadow-[0_0_15px_rgba(155,77,224,0.8)]" />
                    )}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                      <Play
                        size={13}
                        className="absolute opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 text-purple-400 transition-all duration-200"
                        fill="currentColor"
                      />
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-200 group-hover:opacity-0 group-hover:scale-0",
                        active ? "bg-vw-purple shadow-[0_0_8px_rgba(155,77,224,0.6)]" : "bg-white/20"
                      )} />
                    </div>
                    <span
                      className={cn(
                        "text-sm whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300",
                        active ? "translate-x-1 text-white drop-shadow-[0_0_8px_rgba(155,77,224,0.3)]" : "group-hover:translate-x-1"
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed view additional spacer or mini-actions */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center pt-8 space-y-4 px-3">
          <div className="w-10 h-px bg-white/5" />
          <button
            onClick={() => setIsAddPlaylistOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 hover:bg-vw-purple/20 hover:text-white transition-vw cursor-pointer"
            aria-label="Create new playlist"
          >
            <Plus size={20} />
          </button>
        </div>
      )}
    </aside>

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
  </>
  )
}
