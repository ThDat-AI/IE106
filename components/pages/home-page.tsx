"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import ContinueListeningSection from '@/components/music/continue-listening-section'
import { usePlayerStore, SAMPLE_TRACKS, type Track } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import { useState, useEffect, useRef } from 'react'
import { searchMusic, searchAlbums } from '@/lib/music-api'
import { useToast } from '@/components/ui/use-toast'
import { isUserLoggedIn } from '@/lib/auth'
import { ChevronDown, ChevronUp, ChevronRight, RotateCw, Clock } from 'lucide-react'
import {
  SectionHeader,
  AiBadge,
  FilterPills,
  GlassMusicCard,
  PodiumCard,
  MusicShelf,
} from '@/components/ui/vibewave'

const GENRE_LABELS = ['Tất cả', 'Pop', 'Hip-hop', 'EDM', 'Tập trung', 'Thư giãn']

const GENRE_SEARCH_TERMS: Record<string, string[]> = {
  'Tất cả': ['V-Pop Hits 2024', 'Nhạc Trẻ Hot 2024', 'Sơn Tùng M-TP', 'Đen Vâu', 'Hoàng Thùy Linh', 'Vũ.', 'Indie Việt', 'V-Pop Hot'],
  'Pop': ['V-Pop', 'Pop Việt', 'US-UK Pop', 'Mỹ Tâm', 'Amee', 'Sơn Tùng M-TP', 'Tlinh', 'GREY D'],
  'Hip-hop': ['Rap Việt', 'Hip-hop Việt', 'Low G', 'tlinh', 'MCK', 'Đen Vâu', 'Obito', '16 Typh'],
  'EDM': ['EDM Việt', 'Vinahouse', 'Electronic', 'K-391', 'Alan Walker', 'Hoaprox', 'EDM Hot'],
  'Tập trung': ['Lofi Chill', 'Lofi Việt', 'Acoustic Guitar', 'Instrumental Pop', 'Rain Lofi', 'Piano Thư Giãn'],
  'Thư giãn': ['Chill nhẹ nhàng', 'Nhạc Trịnh Lofi', 'Thư giãn đầu óc', 'Nhạc không lời nhẹ nhàng', 'Acoustic Việt']
}

export default function HomePage({
  initialTrending = [],
  initialQuickPicks = [],
  initialTopAlbums = []
}: {
  initialTrending?: Track[],
  initialQuickPicks?: Track[],
  initialTopAlbums?: any[]
}) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [trending, setTrending] = useState<Track[]>(initialTrending)
  const [quickPicks, setQuickPicks] = useState<Track[]>(initialQuickPicks.length > 0 ? initialQuickPicks : SAMPLE_TRACKS)
  const [allTabPicks, setAllTabPicks] = useState<Track[]>(initialQuickPicks.length > 0 ? initialQuickPicks : [])
  const [topAlbums, setTopAlbums] = useState<any[]>(initialTopAlbums)
  const [activeGenre, setActiveGenre] = useState('Tất cả')
  const [visibleCount, setVisibleCount] = useState(5)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.replace('/login')
      return
    }
    setAuthChecked(true)
  }, [router])

  const handleRefreshQuickPicks = async (genre: string) => {
    setIsRefreshing(true)
    try {
      const terms = GENRE_SEARCH_TERMS[genre] || GENRE_SEARCH_TERMS['Tất cả']
      const randomTerm = terms[Math.floor(Math.random() * terms.length)]
      const picksData = await searchMusic(randomTerm, 25, 'VN')
      if (picksData.length > 0) {
        setQuickPicks(picksData)
        setVisibleCount(5) // Reset expanded list when new music is loaded
        if (genre === 'Tất cả') {
          setAllTabPicks(picksData)
        }
      }
    } catch (error) {
      console.error('Error refreshing quick picks:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    handleRefreshQuickPicks(activeGenre)
  }, [activeGenre])

  useEffect(() => {
    if (!authChecked) return

    async function loadMusic() {
      if (trending.length === 0) {
        const trendingData = await searchMusic('Sơn Tùng M-TP', 4)
        if (trendingData.length > 0) setTrending(trendingData)
      }

      if (initialQuickPicks.length === 0) {
        const terms = GENRE_SEARCH_TERMS['Tất cả']
        const randomTerm = terms[Math.floor(Math.random() * terms.length)]
        const picksData = await searchMusic(randomTerm, 25, 'VN')
        if (picksData.length > 0) {
          setQuickPicks(picksData)
          setAllTabPicks(picksData)
        }
      }

      if (topAlbums.length === 0) {
        const albumSearchTerms = ['Hoàng Thùy Linh', 'Đen Vâu', 'Vũ.', 'Mỹ Tâm', 'Sơn Tùng M-TP', 'Bích Phương']
        const selectedTerms = albumSearchTerms.sort(() => Math.random() - 0.5).slice(0, 6)
        const albumsByArtist = await Promise.all(selectedTerms.map((term) => searchAlbums(term, 1, 'VN')))
        const albumsData = albumsByArtist.flat().filter(Boolean)
        setTopAlbums(albumsData)
      }
    }
    loadMusic()
  }, [])

  const currentAllTabPicks = activeGenre === 'Tất cả' ? quickPicks : allTabPicks

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return t.goodMorning
    if (h < 18) return t.goodAfternoon
    return t.goodEvening
  })()

  if (!authChecked) return null

  return (
    <div className="space-y-16">

      {/* Hero greeting */}
      <section>
        <h1
          className="font-display font-bold leading-display mb-2"
          style={{
            fontSize: 56,
            color: 'var(--vw-text-primary)',
            letterSpacing: '-1.2px',
            lineHeight: 0.96,
          }}
        >
          {greeting}
        </h1>
        <p className="mt-4 text-base" style={{ color: 'var(--vw-text-secondary)', lineHeight: 1.5 }}>
          {t.heroSub}
        </p>
      </section>

      {/* Continue Listening — highest priority */}
      <ContinueListeningSection />

      {/* Top Albums Section */}
      <section aria-labelledby="top-albums-heading">
        <SectionHeader title={t.albums} href="/library?tab=albums" />
        <MusicShelf>
          {topAlbums.map((album) => (
            <MusicCard
              key={album.id}
              id={album.id}
              title={album.title}
              subtitle={album.artist}
              image={album.albumArt}
              href={`/album/${album.id}`}
              type="album"
              onHideSuggestion={(id) => {
                setTopAlbums((prev) => prev.filter((a) => a.id !== id))
                toast({
                  title: "Đã ẩn gợi ý",
                  description: `Chúng tôi sẽ không gợi ý album "${album.title}" nữa.`,
                })
              }}
            />
          ))}
        </MusicShelf>
      </section>

      {/* Made For You — AI section with glassmorphism cards */}
      <section aria-labelledby="made-for-you-heading">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="mb-1">
              <AiBadge label={t.aiPowered} withIcon />
            </div>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 28, color: 'var(--vw-text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
            >
              {t.madeForYou}
            </h2>
          </div>
          <Link
            href="/your-vibe"
            className="group/seeall flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md hover:border-purple-500/60 hover:text-purple-100"
            style={{
              background: 'linear-gradient(135deg, rgba(155,77,224,0.15) 0%, rgba(255,255,255,0.03) 100%)',
              borderColor: 'rgba(155,77,224,0.3)',
              color: '#d8b4fe',
              boxShadow: '0 4px 12px rgba(10, 7, 18, 0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <span>{t.seeAll}</span>
            <ChevronRight size={12} className="transition-transform duration-300 group-hover/seeall:translate-x-0.5" />
          </Link>
        </div>
        <MusicShelf>
          {currentAllTabPicks.slice(0, 6).map((track, i) => (
            <GlassMusicCard
              key={track.id}
              track={track}
              rankIndex={i}
            />
          ))}
        </MusicShelf>
      </section>

      {/* Quick Picks — track list */}
      <section aria-labelledby="quick-picks-heading">
        <SectionHeader
          title="Giai điệu theo tâm trạng"
          rightAction={
            <button
              onClick={() => handleRefreshQuickPicks(activeGenre)}
              disabled={isRefreshing}
              className={`group/btn flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md ${
                isRefreshing
                  ? 'border-purple-500/30 text-purple-300/80 bg-purple-500/10'
                  : 'border-white/10 hover:border-purple-500/30 text-white/80 hover:text-purple-300 bg-white/5 hover:bg-purple-500/10'
              }`}
              style={{
                boxShadow: isRefreshing ? '0 0 15px rgba(155,77,224,0.2)' : 'none',
              }}
              title="Làm mới bài hát"
            >
              <RotateCw
                size={14}
                className={`transition-transform duration-500 ${
                  isRefreshing ? 'animate-spin text-purple-400' : 'group-hover/btn:rotate-180 text-white/80 group-hover/btn:text-purple-400'
                }`}
              />
              <span>{isRefreshing ? 'Đang làm mới...' : 'Làm mới'}</span>
            </button>
          }
        />

        {/* Filter Labels */}
        <div className="mb-6">
          <FilterPills
            categories={GENRE_LABELS}
            active={activeGenre}
            onSelect={setActiveGenre}
          />
        </div>

        <div className="vw-playlist-table">
          {/* Header row */}
          <div
            className="flex items-center gap-4 px-3 pb-2 pt-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-6 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'var(--vw-text-muted)' }}>#</span>
            </div>
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <div className="w-10 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.titleLabel}</span>
            </div>
            <div className="hidden md:block w-40 shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--vw-text-muted)' }}>{t.albumLabel}</span>
            </div>
            <div className="w-20 flex justify-end shrink-0 pr-4">
              <Clock size={14} style={{ color: 'var(--vw-text-muted)' }} />
            </div>
          </div>
          <div className="py-2">
            {quickPicks.slice(0, visibleCount).map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum playlistTracks={quickPicks} />
            ))}
          </div>
        </div>

        {/* Expand / Collapse buttons */}
        {(visibleCount > 5 || (visibleCount < 25 && quickPicks.length > visibleCount)) && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 8px 32px rgba(10,7,18,0.5), 0 0 15px rgba(155,77,224,0.3); }
                50% { box-shadow: 0 8px 32px rgba(10,7,18,0.5), 0 0 25px rgba(155,77,224,0.6); }
              }
              .glow-button:hover {
                animation: pulse-glow 2s infinite;
                border-color: rgba(155,77,224,0.7) !important;
              }
              .glow-button-secondary:hover {
                animation: pulse-glow 2s infinite;
                border-color: rgba(255,255,255,0.4) !important;
              }
            `}} />
            
            {visibleCount > 5 && (
              <button
                onClick={() => setVisibleCount(5)}
                className="group glow-button-secondary flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-500 backdrop-blur-xl active:scale-95 cursor-pointer relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(22,17,30,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)',
                  boxShadow: '0 8px 32px rgba(10, 7, 18, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                />
                <ChevronUp 
                  size={16} 
                  className="relative z-10 text-white/60 transition-transform duration-500 group-hover:-translate-y-0.5 ease-out" 
                />
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5">
                  Thu gọn
                </span>
              </button>
            )}

            {visibleCount < 25 && quickPicks.length > visibleCount && (
              <button
                onClick={() => setVisibleCount(prev => Math.min(prev + 5, 25))}
                className="group glow-button flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-500 backdrop-blur-xl active:scale-95 cursor-pointer relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(155,77,224,0.18) 0%, rgba(22,17,30,0.8) 100%)',
                  border: '1px solid rgba(155,77,224,0.35)',
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(10, 7, 18, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                />
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                  Xem thêm
                </span>
                <ChevronDown 
                  size={16} 
                  className="relative z-10 text-purple-300 transition-transform duration-500 group-hover:translate-y-0.5 ease-out" 
                />
              </button>
            )}
          </div>
        )}
      </section>

      {/* Trending — Podium-style cards matching Charts Top 3 */}
      <section aria-labelledby="trending-heading">
        <SectionHeader title={t.trendingNow} href="/charts" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trending.map((item, i) => (
            <PodiumCard key={item.id} track={item} index={i} />
          ))}
        </div>
      </section>

    </div>
  )
}
