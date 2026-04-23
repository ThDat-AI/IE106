"use client"

import { useState } from 'react'
import { Plus, Grid3X3, List, Search } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import { useTranslation } from '@/lib/i18n-store'
import Link from 'next/link'

type Tab = 'playlists' | 'albums' | 'liked'
type View = 'grid' | 'list'

interface LibraryItem {
  id: string
  title: string
  subtitle: string
  image?: string
  href: string
  type: string
}

export default function LibraryPage({ initialAlbums = [] }: { initialAlbums?: LibraryItem[] }) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('albums')
  const [view, setView] = useState<View>('grid')
  const [searchQ, setSearchQ] = useState('')

  const PLAYLISTS = [
    { id: 'p1', title: 'Deep Focus', subtitle: `42 ${t.songsLabel} · 2h 48m`, href: '/playlist/deep-focus' },
    { id: 'p2', title: 'Late Night Drive', subtitle: `28 ${t.songsLabel} · 1h 52m`, href: '/playlist/late-night-drive' },
    { id: 'p3', title: 'Morning Energy', subtitle: `35 ${t.songsLabel} · 2h 10m`, href: '/playlist/morning-energy' },
    { id: 'p4', title: 'Chill Vibes', subtitle: `61 ${t.songsLabel} · 4h 2m`, href: '/playlist/chill-vibes' },
    { id: 'p5', title: 'Workout Beats', subtitle: `55 ${t.songsLabel} · 3h 20m`, href: '/playlist/workout-beats' },
    { id: 'p6', title: 'Sunday Mornings', subtitle: `19 ${t.songsLabel} · 1h 14m`, href: '/playlist/sunday-mornings' },
    { id: 'p7', title: 'Study Session', subtitle: `47 ${t.songsLabel} · 3h 05m`, href: '/playlist/study-session' },
    { id: 'p8', title: 'Road Trip', subtitle: `38 ${t.songsLabel} · 2h 31m`, href: '/playlist/road-trip' },
  ]


  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: 'albums', label: t.albums, count: initialAlbums.length },
    { id: 'playlists', label: t.playlists, count: 8 },
    { id: 'liked', label: t.likedSongs, count: 243 },
  ]

  const items = activeTab === 'playlists' ? PLAYLISTS : activeTab === 'albums' ? initialAlbums : []

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase())
  )

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="font-display font-bold leading-display"
            style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
          >
            {t.history}
          </h1>
          <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            {t.historySub}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
          style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
        >
          <Plus size={15} />
          {t.newPlaylist}
        </button>
      </div>

      {/* Tabs + controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-vw"
              style={{
                backgroundColor: activeTab === tab.id ? '#2A1F3D' : 'transparent',
                color: activeTab === tab.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              }}
            >
              {tab.label}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-md font-semibold"
                style={{ backgroundColor: activeTab === tab.id ? 'rgba(155,77,224,0.2)' : 'rgba(255,255,255,0.07)', color: activeTab === tab.id ? '#9B4DE0' : 'rgba(255,255,255,0.35)' }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search filter */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={t.filter}
              className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none transition-vw"
              style={{
                backgroundColor: '#1F162E',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                width: 160,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#9B4DE0')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
            {([['grid', Grid3X3], ['list', List]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-vw"
                style={{ backgroundColor: view === v ? '#2A1F3D' : 'transparent', color: view === v ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
                aria-label={`${v} view`}
                aria-pressed={view === v}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liked Songs special view */}
      {activeTab === 'liked' && (
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 50% 80% at 0% 50%, rgba(155,77,224,0.4), transparent 70%)', pointerEvents: 'none' }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-6">
            <div
              className="w-28 h-28 rounded-2xl shrink-0 flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #3d1f5c 100%)' }}
            >
              ♥
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.playlist}</p>
              <h2 className="font-display font-bold mb-2" style={{ fontSize: 36, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>{t.likedSongs}</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>243 {t.songsLabel} · {t.aboutLabel} 16 {t.hoursLabel}</p>
              <div className="flex items-center gap-3 mt-4">
                <Link
                  href="/library/liked"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-85"
                  style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
                >
                  {t.viewAll}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid / List view */}
      {activeTab !== 'liked' && (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-4 gap-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((item) => (
                <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} image={(item as any).image} href={item.href} type={activeTab === 'playlists' ? 'playlist' : activeTab === 'albums' ? 'album' : 'artist'} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-16 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <p className="text-sm">{t.noResults} &ldquo;{searchQ}&rdquo;</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
              {filtered.map((item, i) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3 transition-vw hover:bg-white/[0.03]"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  {(item as any).image ? (
                    <img src={(item as any).image} alt={item.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-lg"
                      style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.6)', borderRadius: activeTab === 'artists' ? '50%' : '12px' }}
                    >
                      {item.title.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.95)' }}>{item.title}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.subtitle}</p>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <p className="text-sm">{t.noResults} &ldquo;{searchQ}&rdquo;</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
