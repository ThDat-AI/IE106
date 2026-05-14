"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect, useRef } from 'react'
import { Search, Play, Music2, Disc3, Mic2, ListMusic, Sparkles, TrendingUp, X } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { searchMusic } from '@/lib/music-api'
import {
  AmbientOrbs,
  GlassPanel,
  AccentBar,
  GlassMusicCard,
} from '@/components/ui/vibewave'

/* ── Genre grid data ── */
const GENRES = [
  { label: 'Pop',        icon: <Music2   size={20} />, color: '#9B4DE0', glow: 'rgba(155,77,224,0.4)'  },
  { label: 'Hip-Hop',   icon: <Mic2     size={20} />, color: '#3ABEF9', glow: 'rgba(58,190,249,0.4)' },
  { label: 'R&B',       icon: <Disc3    size={20} />, color: '#F73859', glow: 'rgba(247,56,89,0.4)'  },
  { label: 'Electronic',icon: <Sparkles size={20} />, color: '#05D69E', glow: 'rgba(5,214,158,0.4)' },
  { label: 'Rock',      icon: <TrendingUp size={20} />, color: '#FACC15', glow: 'rgba(250,204,21,0.4)' },
  { label: 'Jazz',      icon: <Music2   size={20} />, color: '#9B4DE0', glow: 'rgba(155,77,224,0.4)'  },
  { label: 'Classical', icon: <ListMusic size={20} />, color: '#3ABEF9', glow: 'rgba(58,190,249,0.4)' },
  { label: 'Lo-Fi',     icon: <Disc3    size={20} />, color: '#F73859', glow: 'rgba(247,56,89,0.4)'  },
  { label: 'Indie',     icon: <Sparkles size={20} />, color: '#05D69E', glow: 'rgba(5,214,158,0.4)' },
  { label: 'Metal',     icon: <TrendingUp size={20} />, color: '#FACC15', glow: 'rgba(250,204,21,0.4)' },
]

/* ── Filter tabs ── */
const FILTER_TABS = [
  { id: 'all',     label: 'Tất cả'   },
  { id: 'tracks',  label: 'Bài hát'  },
  { id: 'artists', label: 'Nghệ sĩ'  },
  { id: 'albums',  label: 'Album'    },
]

/* ── Search bar component ── */
function SearchBar({ query, onQueryChange }: { query: string; onQueryChange: (q: string) => void }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    onQueryChange(v)
    if (v) {
      router.replace(`/search?q=${encodeURIComponent(v)}`, { scroll: false })
    } else {
      router.replace('/search', { scroll: false })
    }
  }

  function clearSearch() {
    onQueryChange('')
    router.replace('/search', { scroll: false })
    inputRef.current?.focus()
  }

  return (
    <div className="relative group/sb">
      {/* Glow ring on focus */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-focus-within/sb:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(155,77,224,0.4) 0%, rgba(58,190,249,0.3) 100%)', filter: 'blur(6px)' }}
        aria-hidden
      />
      <div
        className="relative flex items-center gap-3 rounded-2xl px-5 py-4"
        style={{
          background: 'linear-gradient(180deg, rgba(35,27,47,0.9) 0%, rgba(22,17,30,0.95) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'border-color 0.2s ease',
        }}
      >
        <Search size={20} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="search"
          id="search-input"
          placeholder="Tìm bài hát, nghệ sĩ, album…"
          value={query}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          className="flex-1 bg-transparent outline-none text-base font-medium placeholder:font-normal"
          style={{
            color: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--font-body)',
            caretColor: '#9B4DE0',
          } as React.CSSProperties}
        />
        {query && (
          <button
            onClick={clearSearch}
            aria-label="Xóa tìm kiếm"
            className="cursor-pointer transition-colors duration-150 hover:text-white"
            style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Genre browse grid ── */
function GenreGrid() {
  return (
    <div className="space-y-6">
      <h2
        className="font-display font-bold flex items-center gap-3"
        style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.4px' }}
      >
        <AccentBar height={7} color="purple" />
        Khám phá theo thể loại
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {GENRES.map((genre) => (
          <button
            key={genre.label}
            id={`genre-${genre.label.toLowerCase().replace(/[^a-z]/g, '-')}`}
            className="group/genre relative h-[88px] rounded-2xl overflow-hidden flex flex-col items-start justify-between p-4 cursor-pointer transition-all duration-250"
            style={{
              background: `linear-gradient(145deg, ${genre.color}22 0%, rgba(22,17,30,0.9) 100%)`,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${genre.color}30`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.border = `1px solid ${genre.color}60`
              el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 24px ${genre.glow}`
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.border = `1px solid ${genre.color}30`
              el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`
              el.style.transform = 'translateY(0)'
            }}
          >
            {/* Glow blob */}
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none opacity-30"
              style={{
                background: `radial-gradient(circle, ${genre.color} 0%, transparent 70%)`,
                filter: 'blur(16px)',
                transform: 'translate(30%, -30%)',
              }}
              aria-hidden
            />
            <span style={{ color: genre.color, position: 'relative' }}>{genre.icon}</span>
            <span
              className="font-display font-semibold text-sm relative"
              style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.2px' }}
            >
              {genre.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Search results component ── */
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const { setTrack } = usePlayerStore()

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    async function doSearch() {
      setIsLoading(true)
      try {
        const data = await searchMusic(query, 20)
        setResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    const timer = setTimeout(doSearch, 300)
    return () => clearTimeout(timer)
  }, [query])

  /* Loading skeletons */
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Top result skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="md:col-span-2 h-52 rounded-3xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="md:col-span-3 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
    )
  }

  /* No results */
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(155,77,224,0.1)', border: '1px solid rgba(155,77,224,0.2)' }}
        >
          <Search size={32} style={{ color: 'rgba(155,77,224,0.6)' }} />
        </div>
        <p className="text-xl font-semibold font-display mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
          Không tìm thấy kết quả cho &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả.
        </p>
      </div>
    )
  }

  const topResult = results[0]
  const songResults = results.slice(1, 5)
  const moreResults = results.slice(5)

  return (
    <div className="space-y-12">

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setActiveFilter(tab.id)}
              className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-200"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(155,77,224,0.25) 0%, rgba(155,77,224,0.08) 100%)'
                  : 'rgba(255,255,255,0.04)',
                color: isActive ? '#E9D5FF' : 'rgba(255,255,255,0.5)',
                border: isActive ? '1px solid rgba(155,77,224,0.4)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? '0 0 14px rgba(155,77,224,0.2)' : 'none',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Top result + Songs ── */}
      {topResult && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

          {/* Top result card */}
          <div className="md:col-span-2">
            <h2
              className="font-display font-bold mb-4 flex items-center gap-2.5"
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
            >
              <AccentBar height={6} color="purple" />
              Kết quả hàng đầu
            </h2>
            <div
              onClick={() => setTrack(topResult)}
              id="top-result-card"
              className="group/top relative p-5 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, rgba(155,77,224,0.14) 0%, rgba(22,17,30,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(155,77,224,0.25)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(155,77,224,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                el.style.border = '1px solid rgba(155,77,224,0.45)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                el.style.border = '1px solid rgba(155,77,224,0.25)'
              }}
            >
              {/* Background glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-20 group-hover/top:opacity-35 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle, #9B4DE0 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  transform: 'translate(20%, -20%)',
                }}
                aria-hidden
              />

              <div className="relative">
                {/* Album art */}
                <div className="mb-5 relative inline-block">
                  <img
                    src={topResult.albumArt}
                    alt={topResult.title}
                    className="w-28 h-28 rounded-2xl object-cover transition-transform duration-300 group-hover/top:scale-105"
                    style={{ boxShadow: '0 8px 32px rgba(155,77,224,0.3), 0 0 0 2px rgba(155,77,224,0.2)' }}
                  />
                </div>

                <h3
                  className="font-display font-bold mb-1 leading-tight"
                  style={{ fontSize: 24, color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.5px' }}
                >
                  {topResult.title}
                </h3>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Bài hát&nbsp;·&nbsp;{topResult.artist}
                </p>

                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #9B4DE0 0%, #6B21A8 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(155,77,224,0.45)',
                  }}
                  aria-label={`Play ${topResult.title}`}
                  onClick={(e) => { e.stopPropagation(); setTrack(topResult) }}
                >
                  <Play size={15} fill="white" className="ml-0.5" />
                  Phát nhạc
                </button>
              </div>
            </div>
          </div>

          {/* Songs column */}
          <div className="md:col-span-3">
            <h2
              className="font-display font-bold mb-4 flex items-center gap-2.5"
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
            >
              <AccentBar height={6} color="blue" />
              Bài hát
            </h2>
            <GlassPanel variant="dark" className="px-2 py-2">
              <div className="space-y-0.5">
                {songResults.map((track, i) => (
                  <TrackRow key={track.id} index={i + 1} track={track} showAlbum={false} />
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* ── More results grid ── */}
      {moreResults.length > 0 && (
        <div>
          <h2
            className="font-display font-bold mb-6 flex items-center gap-3"
            style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.4px' }}
          >
            <AccentBar height={7} color="pink" />
            Thêm kết quả
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {moreResults.map((r, i) => (
              <GlassMusicCard key={r.id} track={r} rankIndex={i % 4} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Trending searches (no query) ── */
const TRENDING_QUERIES = ['Sơn Tùng M-TP', 'Blinding Lights', 'NewJeans', 'Jack', 'Billie Eilish', 'BTS', 'HIEUTHUHAI', 'Taylor Swift']

function TrendingSearches({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="space-y-4">
      <h2
        className="font-display font-bold flex items-center gap-3"
        style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.4px' }}
      >
        <AccentBar height={7} color="green" />
        Tìm kiếm thịnh hành
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {TRENDING_QUERIES.map((q, i) => (
          <button
            key={q}
            id={`trending-${i}`}
            onClick={() => onSelect(q)}
            className="group/tq flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(155,77,224,0.12)'
              el.style.border = '1px solid rgba(155,77,224,0.35)'
              el.style.color = '#E9D5FF'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.04)'
              el.style.border = '1px solid rgba(255,255,255,0.08)'
              el.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            <TrendingUp size={13} style={{ color: '#9B4DE0', flexShrink: 0 }} />
            <span className="text-sm font-medium">{q}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Inner (uses useSearchParams) ── */
function SearchInner() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const router = useRouter()

  function handleTrendingSelect(q: string) {
    setQuery(q)
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
  }

  const hasQuery = query.length > 0

  return (
    <div className="relative space-y-10">
      <AmbientOrbs position="fixed" />

      {/* ── Hero section ── */}
      <section className="space-y-6">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md"
          style={{ backgroundColor: 'rgba(155,77,224,0.12)', border: '1px solid rgba(155,77,224,0.25)' }}
        >
          <Search size={12} style={{ color: '#9B4DE0' }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#C4B5FD' }}>
            Tìm kiếm
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-100 to-purple-400"
          style={{ fontSize: 'clamp(40px, 5vw, 60px)', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          {hasQuery ? `Kết quả cho "${query}"` : 'Khám phá âm nhạc'}
        </h1>

        {/* Search bar */}
        <SearchBar query={query} onQueryChange={setQuery} />
      </section>

      {/* ── Content ── */}
      {hasQuery ? (
        <SearchResults query={query} />
      ) : (
        <div className="space-y-12">
          <TrendingSearches onSelect={handleTrendingSelect} />
          <GenreGrid />
        </div>
      )}
    </div>
  )
}

/* ── Page export ── */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-8 w-48 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-14 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  )
}
