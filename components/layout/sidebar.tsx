"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
} from 'lucide-react'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed

  const NAV_ITEMS = [
    { icon: Home, label: t.home, href: '/' },
    { icon: Sparkles, label: t.yourVibe, href: '/your-vibe' },
    { icon: Library, label: t.library, href: '/library' },
    { icon: BarChart2, label: t.charts, href: '/charts' },
  ]

  const LIBRARY_ITEMS = [
    { icon: Heart, label: t.likedSongs, href: '/library/liked', count: '243' },
    { icon: Clock, label: t.recentlyPlayed, href: '/library/recent', count: null },
  ]

  const PLAYLISTS = [
    { label: 'Deep Focus', href: '/playlist/deep-focus' },
    { label: 'Late Night Drive', href: '/playlist/late-night-drive' },
    { label: 'Morning Energy', href: '/playlist/morning-energy' },
    { label: 'Chill Vibes', href: '/playlist/chill-vibes' },
    { label: 'Workout Beats', href: '/playlist/workout-beats' },
  ]

  function toggle() {
    const next = !collapsed
    setInternalCollapsed(next)
    onToggle?.(next)
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    if (href === '/library') return pathname === '/library'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="fixed left-0 top-16 bottom-20 flex flex-col overflow-hidden z-40"
      style={{
        width: collapsed ? '64px' : '220px',
        backgroundColor: '#1F162E',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.2s ease',
      }}
      aria-label="Navigation sidebar"
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end p-3">
        <button
          onClick={toggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-vw hover:bg-white/5"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            style={{
              color: 'rgba(255,255,255,0.45)',
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>
      </div>

      {/* Main navigation */}
      <nav aria-label="Main navigation" className="px-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg mb-0.5 h-10 transition-vw"
              style={{
                paddingLeft: active ? 'calc(0.75rem - 3px)' : '0.75rem',
                paddingRight: '0.75rem',
                backgroundColor: active ? 'rgba(155,77,224,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #9B4DE0' : '3px solid transparent',
                color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden" style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}>
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <>
          {/* Divider */}
          <div className="mx-3 my-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Library section */}
          <nav aria-label="Library" className="px-2">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {t.library}
              </span>
            </div>
            {LIBRARY_ITEMS.map(({ icon: Icon, label, href, count }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg mb-0.5 h-10 transition-vw"
                  style={{
                    paddingLeft: active ? 'calc(0.75rem - 3px)' : '0.75rem',
                    paddingRight: '0.75rem',
                    backgroundColor: active ? 'rgba(155,77,224,0.08)' : 'transparent',
                    borderLeft: active ? '3px solid #9B4DE0' : '3px solid transparent',
                    color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="text-sm font-medium flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {label}
                  </span>
                  {count && (
                    <span 
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" 
                      style={{ 
                        backgroundColor: label === t.likedSongs ? 'rgba(155,77,224,0.2)' : 'rgba(255,255,255,0.1)', 
                        color: label === t.likedSongs ? '#9B4DE0' : 'rgba(255,255,255,0.5)',
                        border: label === t.likedSongs ? '1px solid rgba(155,77,224,0.3)' : '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mx-3 my-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Playlists */}
          <div className="px-2 flex-1 overflow-y-auto">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {t.playlists}
              </span>
              <button
                className="w-5 h-5 rounded-md flex items-center justify-center transition-vw hover:bg-white/10"
                aria-label="Create new playlist"
              >
                <Plus size={13} style={{ color: 'rgba(255,255,255,0.45)' }} />
              </button>
            </div>
            {PLAYLISTS.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg mb-0.5 h-9 transition-vw"
                  style={{
                    paddingLeft: active ? 'calc(0.75rem - 3px)' : '0.75rem',
                    paddingRight: '0.75rem',
                    backgroundColor: active ? 'rgba(155,77,224,0.08)' : 'transparent',
                    borderLeft: active ? '3px solid #9B4DE0' : '3px solid transparent',
                  }}
                >
                  <Music2 size={14} className="shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                  <span
                    className="text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)' }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </aside>
  )
}
