"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect, useRef } from 'react'
import { Search, Play, Music2, Disc3, Mic2, ListMusic, Sparkles, TrendingUp, X, Loader2, Compass } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { searchMusic, searchAlbums, searchArtists } from '@/lib/music-api'
import MusicCard from '@/components/music/music-card'
import { useTranslation } from '@/lib/i18n-store'
import {
  AmbientOrbs,
  GlassPanel,
  AccentBar,
  GlassMusicCard,
  PageHero,
} from '@/components/ui/vibewave'

/* ── Genre grid data ── */
const GENRES = [
  { label: 'Pop',        icon: <Music2   size={22} />, color: '#9B4DE0', glow: 'rgba(155,77,224,0.4)', bg: 'from-purple-500/20' },
  { label: 'Hip-Hop',   icon: <Mic2     size={22} />, color: '#3ABEF9', glow: 'rgba(58,190,249,0.4)', bg: 'from-blue-500/20'   },
  { label: 'R&B',       icon: <Disc3    size={22} />, color: '#F73859', glow: 'rgba(247,56,89,0.4)',  bg: 'from-red-500/20'    },
  { label: 'Electronic',icon: <Sparkles size={22} />, color: '#05D69E', glow: 'rgba(5,214,158,0.4)', bg: 'from-emerald-500/20'},
  { label: 'Rock',      icon: <TrendingUp size={22} />, color: '#FACC15', glow: 'rgba(250,204,21,0.4)', bg: 'from-yellow-500/20' },
  { label: 'Jazz',      icon: <Music2   size={22} />, color: '#9B4DE0', glow: 'rgba(155,77,224,0.4)', bg: 'from-purple-500/20' },
  { label: 'Classical', icon: <ListMusic size={22} />, color: '#3ABEF9', glow: 'rgba(58,190,249,0.4)', bg: 'from-blue-500/20'   },
  { label: 'Lo-Fi',     icon: <Disc3    size={22} />, color: '#F73859', glow: 'rgba(247,56,89,0.4)',  bg: 'from-red-500/20'    },
  { label: 'Indie',     icon: <Sparkles size={22} />, color: '#05D69E', glow: 'rgba(5,214,158,0.4)', bg: 'from-emerald-500/20'},
  { label: 'Metal',     icon: <TrendingUp size={22} />, color: '#FACC15', glow: 'rgba(250,204,21,0.4)', bg: 'from-yellow-500/20' },
]

/* ── Filter tabs ── */
const FILTER_TABS = [
  { id: 'all',     labelKey: 'all'   },
  { id: 'tracks',  labelKey: 'songsLabel'  },
  { id: 'artists', labelKey: 'artists'  },
  { id: 'albums',  labelKey: 'albums'    },
]


/* ── Genre browse grid ── */
function GenreGrid() {
  const { t } = useTranslation()
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <AccentBar height={7} color="purple" />
        <h2 className="font-display font-bold text-2xl tracking-tight text-white/95">
          {t.genre || "Khám phá theo thể loại"}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {GENRES.map((genre, idx) => (
          <button
            key={genre.label}
            className="group/genre relative h-[120px] rounded-3xl overflow-hidden flex flex-col items-start justify-end p-5 cursor-pointer transition-all duration-500 hover:-translate-y-1.5"
            style={{
              background: 'rgba(35, 27, 47, 0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Background Gradient & Pattern */}
            <div className={`absolute inset-0 bg-gradient-to-br ${genre.bg} to-transparent opacity-30 group-hover/genre:opacity-60 transition-opacity duration-500`} />
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/genre:opacity-30 transition-all duration-500 transform group-hover/genre:scale-125 group-hover/genre:rotate-12">
              {genre.icon}
            </div>

            <div className="relative z-10 flex flex-col gap-1">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-1 group-hover/genre:scale-110 transition-transform duration-500"
                style={{ backgroundColor: `${genre.color}22`, color: genre.color, border: `1px solid ${genre.color}33` }}
              >
                {genre.icon}
              </div>
              <span className="font-display font-bold text-base tracking-tight text-white/90">
                {genre.label}
              </span>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover/genre:opacity-100 transition-opacity duration-700 -translate-x-full group-hover/genre:translate-x-full transform skew-x-12" />
          </button>
        ))}
      </div>
    </section>
  )
}

/* ── Search results component ── */
function SearchResults({ query, onLoadingChange }: { query: string; onLoadingChange?: (loading: boolean) => void }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const { setTrack } = usePlayerStore()
  const { t } = useTranslation()

  useEffect(() => {
    if (!query) {
      setTracks([])
      setAlbums([])
      setArtists([])
      onLoadingChange?.(false)
      return
    }
    async function doSearch() {
      setIsLoading(true)
      onLoadingChange?.(true)
      try {
        const tracksData = await searchMusic(query, 30).catch((err) => {
          console.error('searchMusic error:', err);
          return [];
        })
        
        await new Promise((resolve) => setTimeout(resolve, 150));
        
        const albumsData = await searchAlbums(query, 24).catch((err) => {
          console.error('searchAlbums error:', err);
          return [];
        })
        
        await new Promise((resolve) => setTimeout(resolve, 150));
        
        const artistsData = await searchArtists(query, 12).catch((err) => {
          console.error('searchArtists error:', err);
          return [];
        })
        setTracks(tracksData)
        setAlbums(albumsData)
        setArtists(artistsData)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
        onLoadingChange?.(false)
      }
    }
    const timer = setTimeout(doSearch, 400)
    return () => clearTimeout(timer)
  }, [query, onLoadingChange])

  /* Loading skeletons */
  if (isLoading) {
    return (
      <div className="space-y-12 py-8">
        {/* Tab-specific loaders */}
        {activeFilter === 'all' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 h-64 rounded-3xl animate-pulse bg-white/5" />
              <div className="lg:col-span-2 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl animate-pulse bg-white/5" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl animate-pulse bg-white/5" style={{ animationDelay: `${i * 50}ms` }} />
              ))}
            </div>
          </>
        )}

        {activeFilter === 'tracks' && (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse bg-white/5" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        )}

        {activeFilter === 'albums' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl animate-pulse bg-white/5" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        )}

        {activeFilter === 'artists' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square rounded-full animate-pulse bg-white/5" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const hasNoResults = tracks.length === 0 && albums.length === 0 && artists.length === 0

  /* No results */
  if (!isLoading && query && hasNoResults) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden group/empty transition-all duration-500 hover:border-purple-500/20 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45),0_0_30px_rgba(155,77,224,0.03)] max-w-2xl mx-auto mt-6">
        {/* Backing Ambient Purple Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
        
        {/* Floating Glowing Icon Bubble */}
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] backdrop-blur-md flex items-center justify-center mb-4 text-purple-400 border border-white/10 shadow-lg shadow-purple-500/5 group-hover/empty:scale-110 group-hover/empty:border-purple-500/30 group-hover/empty:shadow-purple-500/10 group-hover/empty:text-purple-300 transition-all duration-500">
          <Search size={24} className="animate-pulse" />
        </div>
        
        <h3 className="relative z-10 text-base font-semibold text-white tracking-tight">
          {t.noResults || "Không tìm thấy kết quả"}
        </h3>
        
        <p className="relative z-10 text-xs text-white/80 mt-2 max-w-md leading-relaxed">
          Không có kết quả nào phù hợp với từ khóa &ldquo;<span className="text-purple-400 font-semibold">{query}</span>&rdquo;. {t.noResultsDesc || "Hãy thử điều chỉnh cụm từ tìm kiếm của bạn hoặc duyệt qua các danh mục khám phá khác."}
        </p>
      </div>
    )
  }

  const topResult = tracks[0]
  const songResults = tracks.slice(1, 6)

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer 
                transition-all duration-300 flex items-center gap-2
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border border-purple-500/50 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/[0.12] hover:border-white/25 hover:text-white'
                }
              `}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              )}
              {(t as any)[tab.labelKey] || tab.id}
            </button>
          )
        })}
      </div>

      {/* ── Tab Views ── */}
      {activeFilter === 'all' && (
        <div className="space-y-16">
          {/* Top result + Songs */}
          {topResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Top result card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-3">
                  <AccentBar height={6} color="purple" />
                  <h2 className="font-display font-bold text-xl text-white/90">Kết quả hàng đầu</h2>
                </div>

                <div
                  onClick={() => setTrack(topResult)}
                  className="group/top relative p-8 rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                  style={{
                    background: 'linear-gradient(145deg, rgba(35,27,47,0.6) 0%, rgba(22,17,30,0.85) 100%)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(155,77,224,0.2)',
                  }}
                >
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none group-hover/top:bg-purple-500/20 transition-all duration-700" />

                  <div className="relative space-y-6">
                    <div className="relative inline-block">
                      <img
                        src={topResult.albumArt}
                        alt={topResult.title}
                        className="w-40 h-40 rounded-3xl object-cover shadow-2xl transition-transform duration-700 group-hover/top:scale-110"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg group-hover/top:scale-110 transition-transform duration-500">
                        <Play size={20} fill="white" className="text-white ml-1" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-3xl tracking-tight text-white line-clamp-1">
                        {topResult.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] uppercase tracking-wider">Bài hát</span>
                        <span>•</span>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation()
                            if (topResult.artist) {
                              const slug = encodeURIComponent(topResult.artist.toLowerCase().replace(/\s+/g, '-'))
                              window.location.href = `/artist/${slug}${topResult.artistId ? `?id=${topResult.artistId}` : ''}`
                            }
                          }}
                          className="hover:text-purple-400 transition-colors"
                        >
                          {topResult.artist}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Songs column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AccentBar height={6} color="blue" />
                    <h2 className="font-display font-bold text-xl text-white/90">{t.topSongs || "Bài hát"}</h2>
                  </div>
                  {tracks.length > 5 && (
                    <button
                      onClick={() => setActiveFilter('tracks')}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                    >
                      Xem tất cả
                    </button>
                  )}
                </div>

                <GlassPanel variant="dark" className="p-3 border-white/5 bg-white/[0.02]">
                  <div className="space-y-1">
                    {songResults.map((track, i) => (
                      <TrackRow key={track.id} index={i + 1} track={track} showAlbum={false} playlistTracks={songResults} />
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </div>
          )}

          {/* Artists Section */}
          {artists.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AccentBar height={6} color="green" />
                  <h2 className="font-display font-bold text-xl text-white/90">Nghệ sĩ</h2>
                </div>
                {artists.length > 6 && (
                  <button
                    onClick={() => setActiveFilter('artists')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                  >
                    Xem tất cả
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {artists.slice(0, 6).map((artist) => {
                  const artistSlug = encodeURIComponent(artist.name.toLowerCase().replace(/\s+/g, '-'))
                  return (
                    <MusicCard
                      key={artist.id}
                      id={artist.id}
                      title={artist.name}
                      subtitle={artist.genre}
                      image={artist.image}
                      type="artist"
                      href={`/artist/${artistSlug}${artist.id ? `?id=${artist.id}` : ''}`}
                    />
                  )
                })}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {albums.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AccentBar height={6} color="pink" />
                  <h2 className="font-display font-bold text-xl text-white/90">Album</h2>
                </div>
                {albums.length > 6 && (
                  <button
                    onClick={() => setActiveFilter('albums')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                  >
                    Xem tất cả
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {albums.slice(0, 6).map((album) => (
                  <MusicCard
                    key={album.id}
                    id={album.id}
                    title={album.title}
                    subtitle={album.artist}
                    image={album.albumArt}
                    type="album"
                    href={`/album/${album.id}`}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Songs Tab ── */}
      {activeFilter === 'tracks' && tracks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AccentBar height={6} color="blue" />
            <h2 className="font-display font-bold text-xl text-white/90">Tất cả bài hát</h2>
          </div>
          <GlassPanel variant="dark" className="p-4 border-white/5 bg-white/[0.02]">
            <div className="space-y-1">
              {tracks.map((track, i) => (
                <TrackRow key={track.id} index={i + 1} track={track} showAlbum={true} playlistTracks={tracks} />
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* ── Artists Tab ── */}
      {activeFilter === 'artists' && artists.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AccentBar height={6} color="green" />
            <h2 className="font-display font-bold text-xl text-white/90">Tất cả nghệ sĩ</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {artists.map((artist) => {
              const artistSlug = encodeURIComponent(artist.name.toLowerCase().replace(/\s+/g, '-'))
              return (
                <MusicCard
                  key={artist.id}
                  id={artist.id}
                  title={artist.name}
                  subtitle={artist.genre}
                  image={artist.image}
                  type="artist"
                  href={`/artist/${artistSlug}${artist.id ? `?id=${artist.id}` : ''}`}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ── Albums Tab ── */}
      {activeFilter === 'albums' && albums.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AccentBar height={6} color="pink" />
            <h2 className="font-display font-bold text-xl text-white/90">Tất cả album</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {albums.map((album) => (
              <MusicCard
                key={album.id}
                id={album.id}
                title={album.title}
                subtitle={album.artist}
                image={album.albumArt}
                type="album"
                href={`/album/${album.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Trending searches (no query) ── */
const TRENDING_QUERIES = ['Sơn Tùng M-TP', 'MONO', 'NewJeans', 'HIEUTHUHAI', 'Billie Eilish', 'Taylor Swift', 'Phan Mạnh Quỳnh', 'tlinh']

function TrendingSearches({ onSelect }: { onSelect: (q: string) => void }) {
  const { t } = useTranslation()
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <AccentBar height={7} color="green" />
        <h2 className="font-display font-bold text-2xl tracking-tight text-white/95">
          {t.trendingNow || "Tìm kiếm thịnh hành"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {TRENDING_QUERIES.map((q, i) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="group/tq flex items-center gap-3 px-5 py-3 rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover/tq:bg-emerald-500 group-hover/tq:text-white transition-all duration-500">
              <TrendingUp size={16} />
            </div>
            <span className="text-sm font-bold text-white/60 group-hover/tq:text-white transition-colors">{q}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ── Inner (uses useSearchParams) ── */
function SearchInner() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  function handleTrendingSelect(q: string) {
    setQuery(q)
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
  }

  // Handle URL updates
  useEffect(() => {
    const q = params.get('q') ?? ''
    if (q !== query) setQuery(q)
  }, [params])

  const hasQuery = query.length > 0

  return (
    <div className="relative pb-24 space-y-12">
      <AmbientOrbs position="fixed" />

      {/* ── Hero section ── */}
      <section className="pt-6 pb-2">
        <PageHero
          eyebrowIcon={<Compass size={14} />}
          eyebrowLabel={t.search || "Tìm kiếm"}
          title={hasQuery ? `${t.resultsFor || "Kết quả cho"} "${query}"` : t.exploreMusic || "Khám phá âm nhạc"}
          subtitle={hasQuery ? undefined : t.searchSub || "Khám phá các bài hát, nghệ sĩ và album yêu thích của bạn thông qua thanh tìm kiếm ở phía trên."}
          gradientClass="from-white to-white"
          titleColor="#ffffff"
          subtitleColor="rgba(255, 255, 255, 0.85)"
        />
      </section>

      {/* ── Content ── */}
      <div className="relative min-h-[400px]">
        {hasQuery ? (
          <SearchResults query={query} onLoadingChange={setIsSearching} />
        ) : (
          <div className="space-y-20 animate-in fade-in duration-1000">
            <TrendingSearches onSelect={handleTrendingSelect} />
            <GenreGrid />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page export ── */
export default function SearchPage() {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <div className="space-y-10 animate-pulse py-12">
          <div className="space-y-4">
            <div className="h-6 w-32 rounded-full bg-white/10" />
            <div className="h-16 w-3/4 rounded-2xl bg-white/10" />
          </div>
          <div className="h-20 max-w-2xl rounded-2xl bg-white/10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 rounded-3xl bg-white/5" />
            ))}
          </div>
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  )
}
