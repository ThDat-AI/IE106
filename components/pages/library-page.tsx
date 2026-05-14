"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, Clock } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import { type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import { useSearchParams } from 'next/navigation'
import {
  PageHero,
  AmbientOrbs,
} from '@/components/ui/vibewave'

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
  ]

  const items = activeTab === 'playlists' ? PLAYLISTS : initialAlbums

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) || i.subtitle.toLowerCase().includes(searchQ.toLowerCase())
  )

  return (
    <div className="space-y-10 relative">
      {/* Shared ambient orbs — library variant */}
      <AmbientOrbs position="absolute" variant="library" />

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
              className="group relative flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(155,77,224,0.2)] hover:shadow-[0_0_30px_rgba(155,77,224,0.4)]"
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
    </div>
  )
}
