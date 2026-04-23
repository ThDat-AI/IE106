"use client"

import { useState, useEffect } from 'react'
import { Plus, Grid3X3, List, Search, Clock } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Tab = 'playlists' | 'albums' | 'liked' | 'recent'
type View = 'grid' | 'list'

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
  initialLikedSongs = [],
  initialRecentlyPlayedSongs = []
}: { 
  initialAlbums?: LibraryItem[], 
  initialLikedSongs?: Track[],
  initialRecentlyPlayedSongs?: Track[]
}) {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('albums')
  
  useEffect(() => {
    const tabParam = searchParams.get('tab') as Tab | null
    if (tabParam && ['albums', 'playlists', 'liked', 'recent'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

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
    { id: 'liked', label: t.likedSongs, count: initialLikedSongs.length > 0 ? initialLikedSongs.length : 243 },
    { id: 'recent', label: t.recentlyPlayed, count: initialRecentlyPlayedSongs.length > 0 ? initialRecentlyPlayedSongs.length : 50 },
  ]

  const items = activeTab === 'playlists' ? PLAYLISTS 
    : activeTab === 'albums' ? initialAlbums 
    : activeTab === 'recent' ? initialRecentlyPlayedSongs.map(t => ({
      id: t.id,
      title: t.title,
      subtitle: t.artist,
      image: t.albumArt,
      href: `/track/${t.id}`,
      type: 'track',
      originalTrack: t
    }))
    : initialLikedSongs.map(t => ({
    id: t.id,
    title: t.title,
    subtitle: t.artist,
    image: t.albumArt,
    href: `/track/${t.id}`,
    type: 'track',
    originalTrack: t
  }))

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) || i.subtitle.toLowerCase().includes(searchQ.toLowerCase())
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
        {(activeTab !== 'liked' && activeTab !== 'recent') && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
            style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
          >
            <Plus size={15} />
            {activeTab === 'albums' ? t.newAlbum : t.newPlaylist}
          </button>
        )}
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
                width: 280,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#9B4DE0')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
        </div>
      </div>

      {/* Items view */}
      {(activeTab !== 'liked' && activeTab !== 'recent') ? (
        <div className="grid grid-cols-4 gap-4 lg:grid-cols-5 xl:grid-cols-6 mt-6">
          {filtered.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} image={(item as any).image} href={item.href} type={(item as any).type || (activeTab === 'playlists' ? 'playlist' : activeTab === 'albums' ? 'album' : 'artist')} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <p className="text-sm">{t.noResults} &ldquo;{searchQ}&rdquo;</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center gap-4 px-3 py-2 text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <div className="w-6 text-center">#</div>
            <div className="w-10 shrink-0"></div>
            <div className="flex-1 min-w-0">{t.titleLabel || 'TITLE'}</div>
            <div className="hidden md:block w-40 shrink-0">{t.albumLabel || 'ALBUM'}</div>
            <div className="flex items-center justify-end gap-3 shrink-0" style={{ width: '84px' }}>
              <Clock size={14} className="mr-6" />
            </div>
          </div>
          <div className="flex flex-col">
            {filtered.map((item, i) => (
              <TrackRow key={item.id} index={i + 1} track={(item as any).originalTrack} />
            ))}
            {filtered.length === 0 && (
              <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <p className="text-sm">{t.noResults} &ldquo;{searchQ}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
