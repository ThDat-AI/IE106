"use client"

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
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
  Disc,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed

  const [playlists, setPlaylists] = useState<{ label: string; href: string }[]>([])
  const [albumsCount, setAlbumsCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)

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

    function loadAlbumsCount() {
      const stored = localStorage.getItem('vw_saved_albums')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setAlbumsCount(parsed.length)
          return
        } catch (e) {}
      }
      setAlbumsCount(0)
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
    loadAlbumsCount()
    loadLikedCount()

    window.addEventListener('vw_playlists_updated', loadPlaylists)
    window.addEventListener('vw_albums_updated', loadAlbumsCount)
    window.addEventListener('vw_likes_updated', loadLikedCount)
    return () => {
      window.removeEventListener('vw_playlists_updated', loadPlaylists)
      window.removeEventListener('vw_albums_updated', loadAlbumsCount)
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
    { icon: Disc, label: t.albums, href: '/library?tab=albums', count: String(albumsCount) },
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
    <aside
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
              "text-white/60 transition-transform duration-300 group-hover:text-vw-purple",
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
                "group relative flex items-center gap-3 rounded-xl h-12 transition-vw px-3",
                active
                  ? "bg-vw-purple/20 text-white shadow-lg shadow-purple-500/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
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
              <span className="text-[11px] font-righteous uppercase tracking-[0.2em] text-white/50">
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
                      "group flex items-center gap-3 rounded-xl h-11 transition-vw px-3",
                      active
                        ? "bg-vw-purple/20 text-white shadow-sm shadow-purple-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0 transition-all",
                        active ? "text-vw-purple" : "group-hover:text-vw-purple/70"
                      )}
                    />
                    <span className="text-sm font-medium flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {label}
                    </span>
                    {count && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold transition-all",
                          label === t.likedSongs
                            ? "bg-vw-purple/30 text-white border border-vw-purple/40 group-hover:bg-vw-purple/40"
                            : "bg-white/10 text-white/60 border border-white/10 group-hover:bg-white/20"
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
              <span className="text-[11px] font-righteous uppercase tracking-[0.2em] text-white/50">
                {t.playlists}
              </span>
              <button
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-vw hover:bg-vw-purple/30 hover:text-white text-white/50 border border-white/5 hover:border-vw-purple/30"
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
                      "group flex items-center gap-3 rounded-xl h-10 transition-vw px-3",
                      active
                        ? "bg-vw-purple/20 text-white"
                        : "text-white/55 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      active ? "bg-vw-purple shadow-[0_0_8px_rgba(155,77,224,0.6)]" : "bg-white/10 group-hover:bg-white/30"
                    )} />
                    <span
                      className="text-sm whitespace-nowrap overflow-hidden text-ellipsis transition-transform group-hover:translate-x-0.5"
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
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:bg-vw-purple/20 hover:text-vw-purple transition-vw">
            <Plus size={20} />
          </button>
        </div>
      )}
    </aside>
  )
}
