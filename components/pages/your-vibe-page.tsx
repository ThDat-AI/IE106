"use client"

import { RefreshCw, Play, ChevronRight, Loader2, RotateCw, Heart, MoreHorizontal, Trash2, Plus, Ban, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import MusicCard from '@/components/music/music-card'
import { SAMPLE_TRACKS, type Track, isArtistFollowed, toggleFollowArtist } from '@/lib/player-store'
import { searchMusic, searchArtistImage } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  PageHero,
  AccentBar,
  AiBadge,
  FilterPills,
  RANK_COLORS,
  MusicShelf,
} from '@/components/ui/vibewave'

const GENRE_CATEGORIES = ['Tất cả', 'Pop', 'Hip-hop', 'EDM', 'Tập trung', 'Thư giãn']

const ARTIST_POOL = [
  { name: 'Sơn Tùng M-TP', href: '/artist/son-tung-mtp' },
  { name: 'Hoàng Thùy Linh', href: '/artist/hoang-thuy-linh' },
  { name: 'Đen Vâu', href: '/artist/den' },
  { name: 'GREY D', href: '/artist/grey-d' },
  { name: 'MONO', href: '/artist/mono' },
  { name: 'tlinh', href: '/artist/tlinh' },
  { name: 'HIEUTHUHAI', href: '/artist/hieuthuhai' },
  { name: 'Mỹ Tâm', href: '/artist/my-tam' },
  { name: 'Vũ.', href: '/artist/vu' },
  { name: 'AMEE', href: '/artist/amee' },
  { name: 'MCK', href: '/artist/mck' },
  { name: 'Wren Evans', href: '/artist/wren-evans' },
  { name: 'Min', href: '/artist/min' },
  { name: 'Bích Phương', href: '/artist/bich-phuong' },
  { name: 'JustaTee', href: '/artist/justatee' },
  { name: 'Soobin Hoàng Sơn', href: '/artist/soobin' },
  { name: 'Karik', href: '/artist/karik' },
  { name: 'Phan Mạnh Quỳnh', href: '/artist/phan-manh-quynh' },
  { name: 'Phương Ly', href: '/artist/phuong-ly' },
  { name: 'Đức Phúc', href: '/artist/duc-phuc' },
  { name: 'Erik', href: '/artist/erik' },
]

function getGenreKeywords(genre: string) {
  switch (genre) {
    case 'Pop':
      return {
        mixes: ['V-Pop Pop', 'V-Pop Hits', 'V-Pop Hot', 'Pop Việt mới'],
        discovered: ['Nhạc Pop Việt', 'V-Pop Ballad', 'Pop trẻ']
      }
    case 'Hip-hop':
      return {
        mixes: ['Rap Việt Hot', 'Hip hop Việt', 'Rap Việt mới', 'Underground Việt'],
        discovered: ['Rap Việt', 'Hip-hop Việt', 'Trap Việt']
      }
    case 'EDM':
      return {
        mixes: ['EDM Việt', 'Vinahouse Hot', 'Remix Việt', 'Electro Việt'],
        discovered: ['Vinahouse mới', 'EDM hot', 'Remix hot']
      }
    case 'Tập trung':
      return {
        mixes: ['Nhạc Không Lời Tập Trung', 'Piano Thư Giãn', 'Lofi Study', 'Deep Focus'],
        discovered: ['Lofi Work', 'Guitar Không Lời', 'Ambient Việt']
      }
    case 'Thư giãn':
      return {
        mixes: ['Lofi Chill Việt', 'Acoustic Việt Chill', 'Nhạc Chill Lofi', 'Indie Việt Chill'],
        discovered: ['Acoustic Việt', 'Indie Việt mới', 'Chill Lofi']
      }
    case 'Tất cả':
    default:
      return {
        mixes: ['V-Pop Hits', 'V-Pop Hot', 'Nhạc trẻ HOT', 'Nhạc Chill V-Pop', 'Vietnamese Pop', 'Indie Việt', 'Rap Việt Hot'],
        discovered: ['Nhạc trẻ mới nhất', 'Nhạc trẻ hot nhất', 'V-Pop mới phát hành', 'Indie Việt mới', 'Rap Việt mới nhất', 'Nhạc Lofi Việt', 'Acoustic Việt']
      }
  }
}

const ARTIST_SLUGS: Record<string, string> = {
  'sơn tùng m-tp': 'son-tung-mtp',
  'hoàng thùy linh': 'hoang-thuy-linh',
  'đen vâu': 'den',
  'đen': 'den',
  'grey d': 'grey-d',
  'mono': 'mono',
  'tlinh': 'tlinh',
  'hieuthuhai': 'hieuthuhai',
  'mỹ tâm': 'my-tam',
  'vũ.': 'vu',
  'amee': 'amee',
  'mck': 'mck',
  'wren evans': 'wren-evans',
  'min': 'min',
  'bích phương': 'bich-phuong',
  'justatee': 'justatee',
  'soobin hoàng sơn': 'soobin',
  'soobin': 'soobin',
  'karik': 'karik',
  'phan mạnh quỳnh': 'phan-manh-quynh',
  'phương ly': 'phuong-ly',
  'đức phúc': 'duc-phuc',
  'erik': 'erik',
}

function getArtistHref(name: string, artistId?: string) {
  const key = name.toLowerCase().trim()
  if (ARTIST_SLUGS[key]) {
    return `/artist/${ARTIST_SLUGS[key]}${artistId ? `?id=${artistId}` : ''}`
  }
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `/artist/${slug}${artistId ? `?id=${artistId}` : ''}`
}

export default function YourVibePage() {
  const { t } = useTranslation()
  const [mixes, setMixes] = useState<Track[]>([])
  const [discovered, setDiscovered] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMixes, setIsLoadingMixes] = useState(false)
  const [isLoadingDiscovered, setIsLoadingDiscovered] = useState(false)
  const [isLoadingArtists, setIsLoadingArtists] = useState(true)
  const [activeGenre, setActiveGenre] = useState('Tất cả')

  const INITIAL_ARTISTS = [
    { id: 'ta1', title: 'Sơn Tùng M-TP', subtitle: `47 ${t.playsThisMonth}`, href: '/artist/son-tung-mtp', image: '' },
    { id: 'ta2', title: 'Hoàng Thùy Linh', subtitle: `38 ${t.playsThisMonth}`, href: '/artist/hoang-thuy-linh', image: '' },
    { id: 'ta3', title: 'Đen Vâu', subtitle: `31 ${t.playsThisMonth}`, href: '/artist/den', image: '' },
    { id: 'ta4', title: 'GREY D', subtitle: `28 ${t.playsThisMonth}`, href: '/artist/grey-d', image: '' },
    { id: 'ta5', title: 'MONO', subtitle: `25 ${t.playsThisMonth}`, href: '/artist/mono', image: '' },
    { id: 'ta6', title: 'tlinh', subtitle: `22 ${t.playsThisMonth}`, href: '/artist/tlinh', image: '' },
    { id: 'ta7', title: 'HIEUTHUHAI', subtitle: `19 ${t.playsThisMonth}`, href: '/artist/hieuthuhai', image: '' },
    { id: 'ta8', title: 'Mỹ Tâm', subtitle: `15 ${t.playsThisMonth}`, href: '/artist/my-tam', image: '' },
  ]

  const [topArtists, setTopArtists] = useState(INITIAL_ARTISTS)

  // Load music and top artists when genre changes
  useEffect(() => {
    async function fetchGenreMusicAndArtists() {
      setIsLoadingMixes(true)
      setIsLoadingDiscovered(true)
      setIsLoadingArtists(true)
      
      const pools = getGenreKeywords(activeGenre)
      const randomMixKeyword = pools.mixes[Math.floor(Math.random() * pools.mixes.length)]
      const randomDiscoverKeyword = pools.discovered[Math.floor(Math.random() * pools.discovered.length)]
      
      try {
        const [mixData, discoveredData] = await Promise.all([
          searchMusic(randomMixKeyword, 15),
          searchMusic(randomDiscoverKeyword, 8)
        ])
        setMixes(mixData.slice(0, 10))
        setDiscovered(discoveredData.slice(0, 4))

        // Extract top artists from search results
        const allTracks = [...mixData, ...discoveredData]
        const uniqueArtistsMap = new Map<string, { title: string; artistId?: string; image: string }>()

        for (const track of allTracks) {
          if (!track.artist) continue
          const artistKey = track.artist.toLowerCase().trim()
          if (!uniqueArtistsMap.has(artistKey)) {
            uniqueArtistsMap.set(artistKey, {
              title: track.artist,
              artistId: track.artistId,
              image: track.albumArt
            })
          }
          if (uniqueArtistsMap.size >= 8) break
        }

        // Fill remaining spots from ARTIST_POOL if we have fewer than 8 unique artists
        let poolIdx = 0
        while (uniqueArtistsMap.size < 8 && poolIdx < ARTIST_POOL.length) {
          const candidate = ARTIST_POOL[poolIdx]
          const artistKey = candidate.name.toLowerCase().trim()
          if (!uniqueArtistsMap.has(artistKey)) {
            uniqueArtistsMap.set(artistKey, {
              title: candidate.name,
              image: ''
            })
          }
          poolIdx++
        }

        const top8 = Array.from(uniqueArtistsMap.values())

        // Fetch high-quality artist images sequentially with a small delay to prevent API rate limiting
        const artistImages: string[] = []
        for (const artist of top8) {
          try {
            const img = await searchArtistImage(artist.title)
            artistImages.push(img)
            // 150ms delay between API queries
            await new Promise(resolve => setTimeout(resolve, 150))
          } catch (e) {
            console.error('Error fetching artist image:', e)
            artistImages.push('')
          }
        }

        // Generate play counts
        const plays = [
          Math.floor(Math.random() * 10) + 45,
          Math.floor(Math.random() * 5) + 35,
          Math.floor(Math.random() * 5) + 30,
          Math.floor(Math.random() * 5) + 25,
          Math.floor(Math.random() * 5) + 20,
          Math.floor(Math.random() * 4) + 16,
          Math.floor(Math.random() * 4) + 12,
          Math.floor(Math.random() * 3) + 8,
        ]

        const formattedArtists = top8.map((artist, idx) => ({
          id: artist.artistId || `ta-${idx}-${activeGenre.replace(/\s+/g, '-')}`,
          title: artist.title,
          subtitle: `${plays[idx]} ${t.playsThisMonth}`,
          href: getArtistHref(artist.title, artist.artistId),
          image: artistImages[idx] || artist.image || ''
        }))

        setTopArtists(formattedArtists)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoadingMixes(false)
        setIsLoadingDiscovered(false)
        setIsLoadingArtists(false)
        setIsLoading(false)
      }
    }
    
    fetchGenreMusicAndArtists()
  }, [activeGenre, t.playsThisMonth])

  async function handleRefreshMixes() {
    setIsLoadingMixes(true)
    try {
      const pools = getGenreKeywords(activeGenre)
      const randomKeyword = pools.mixes[Math.floor(Math.random() * pools.mixes.length)]
      const mixData = await searchMusic(randomKeyword, 10)
      setMixes(mixData)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingMixes(false)
    }
  }

  async function handleRefreshDiscovered() {
    setIsLoadingDiscovered(true)
    try {
      const pools = getGenreKeywords(activeGenre)
      const randomKeyword = pools.discovered[Math.floor(Math.random() * pools.discovered.length)]
      const discoveredData = await searchMusic(randomKeyword, 4)
      setDiscovered(discoveredData)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingDiscovered(false)
    }
  }

  return (
    <div className="space-y-16">

      {/* Hero */}
      <section>
        <PageHero
          eyebrowIcon="✨"
          eyebrowLabel={t.aiPowered}
          title={t.yourVibe}
          subtitle={t.yourVibeSub}
          titleColor="#ffffff"
          subtitleColor="rgba(255,255,255,0.9)"
        />

        {/* Mood selector */}
        <div className="mt-8">
          <FilterPills
            categories={GENRE_CATEGORIES}
            active={activeGenre}
            onSelect={setActiveGenre}
            label={t.genre}
          />
        </div>
      </section>

      {/* Featured AI Mix */}
      <section>
        <div
          className="rounded-3xl p-10 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_40px_rgba(155,77,224,0.2)]"
          style={{
            background: 'linear-gradient(145deg, rgba(31,22,46,0.9) 0%, rgba(18,14,24,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(155,77,224,0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: 'radial-gradient(circle at 20% 50%, rgba(155,77,224,0.6), transparent 50%), radial-gradient(circle at 80% 80%, rgba(67,56,202,0.4), transparent 50%)', pointerEvents: 'none', filter: 'blur(40px)' }}
            aria-hidden="true"
          />
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="relative flex items-center gap-8">
            <div className="shrink-0">
              {isLoading || isLoadingMixes ? (
                <div className="w-36 h-36 rounded-2xl bg-white/5 animate-pulse" />
              ) : mixes[0] ? (
                <img 
                  src={mixes[0].albumArt} 
                  alt="Daily Mix" 
                  className="w-36 h-36 rounded-2xl object-cover shadow-[0_10px_40px_rgba(155,77,224,0.4)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-display font-bold"
                  style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)' }}
                >
                  D
                </div>
              )}
            </div>
            <div className="flex-1">
              {isLoading || isLoadingMixes ? (
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
                  <div className="h-10 bg-white/10 rounded w-2/3 animate-pulse" />
                  <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
                </div>
              ) : (
                <>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 text-white" style={{ backgroundColor: 'rgba(155,77,224,0.2)', border: '1px solid rgba(155,77,224,0.3)' }}>
                    ✨ {t.topPickToday}
                  </span>
                  <h2 className="font-display font-bold mt-1 mb-3 text-white" style={{ fontSize: 40, letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(155,77,224,0.3)' }}>
                    {mixes[0]?.title || 'V-Pop Daily Mix'}
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {mixes[0]?.artist || '...'}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden relative before:absolute before:inset-0 before:bg-white/20 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300 before:ease-out"
                      style={{ 
                        background: 'linear-gradient(135deg, #9B4DE0 0%, #6B21A8 100%)', 
                        color: '#ffffff',
                        boxShadow: '0 10px 25px -5px rgba(155,77,224,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <Play size={16} fill="currentColor" className="relative z-10 drop-shadow-md" />
                      <span className="relative z-10">{t.listenNow}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Mixes grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold flex items-center gap-3" style={{ fontSize: 30, color: '#ffffff', letterSpacing: '-0.5px' }}>
            <AccentBar height={8} color="purple" />
            {t.collectionsForYou}
          </h2>

          {/* Refresh Pill Button on the far right */}
          <button
            onClick={handleRefreshMixes}
            disabled={isLoadingMixes || isLoading}
            className="group flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/20 text-white/80 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(155,77,224,0.05)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer shadow-md"
          >
            <RotateCw
              size={14}
              className={cn(
                "transition-transform duration-700",
                isLoadingMixes ? "animate-spin text-purple-400" : "group-hover:rotate-180"
              )}
            />
            <span>Làm mới</span>
          </button>
        </div>
        <MusicShelf>
          {isLoading || isLoadingMixes ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))
          ) : (
            mixes.map((track) => (
              <MusicCard 
                key={track.id} 
                id={track.id} 
                title={track.title} 
                subtitle={track.artist} 
                track={track}
                type="track" 
              />
            ))
          )}
        </MusicShelf>
      </section>

      {/* Recently Discovered + Top Artists row */}
      <div className="grid grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold flex items-center gap-3" style={{ fontSize: 24, color: '#ffffff', letterSpacing: '-0.3px' }}>
              <AccentBar height={6} color="pink" />
              {t.recentlyDiscovered}
            </h2>
            <button
              onClick={handleRefreshDiscovered}
              disabled={isLoadingDiscovered || isLoading}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/20 text-white/80 hover:text-pink-300 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer"
            >
              <RotateCw
                size={12}
                className={cn(
                  "transition-transform duration-700",
                  isLoadingDiscovered ? "animate-spin text-pink-400" : "group-hover:rotate-180"
                )}
              />
              <span>Làm mới</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {isLoading || isLoadingDiscovered ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
              ))
            ) : (
              discovered.map((track) => (
                <MusicCard 
                  key={track.id} 
                  id={track.id} 
                  title={track.title} 
                  subtitle={track.artist} 
                  track={track}
                  type="track" 
                />
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold flex items-center gap-3" style={{ fontSize: 24, color: '#ffffff', letterSpacing: '-0.3px' }}>
              <AccentBar height={6} color="blue" />
              {t.topArtists}
            </h2>
          </div>
          <div className="space-y-3">
            {isLoadingArtists ? (
              Array(8).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 animate-pulse h-[78px]"
                >
                  <div className="w-10 h-6 bg-white/10 rounded shrink-0" />
                  <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                </div>
              ))
            ) : (
              topArtists.map((artist, i) => (
                <YourVibeArtistRow key={artist.id} artist={artist} index={i} />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Listening stats */}
      <section>
        <h2 className="font-display font-bold flex items-center gap-3 mb-8" style={{ fontSize: 30, color: '#ffffff', letterSpacing: '-0.5px' }}>
          <AccentBar height={8} color="indigo" />
          {t.monthlyStats}
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t.hoursListened, value: '48h', sub: `+12% ${t.thanLastMonth}` },
            { label: t.tracksPlayed, value: '312', sub: `${t.fromDifferentArtists.replace('artists', '62 nghệ sĩ')}` },
            { label: t.favoriteTracks, value: '243', sub: `${t.addedThisMonth.replace('month', '18 bài mới tháng này')}` },
            { label: t.playlistsCreated, value: '7', sub: `2 ${t.newlyCreated}` },
          ].map((stat, i) => {
            const rc = RANK_COLORS[i]
            return (
              <div
                key={stat.label}
                className="p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', 
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-50 group-hover:opacity-100 transition-opacity" 
                  style={{ background: `linear-gradient(90deg, ${rc.text}, ${rc.bg.replace('0.1', '1').replace('0.12', '1')})` }}
                />
                <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>{stat.label}</p>
                <p className="font-display font-bold text-white" style={{ 
                  fontSize: 42, 
                  letterSpacing: '-1px', 
                  lineHeight: 1,
                }}>{stat.value}</p>
                <p className="text-sm mt-3 font-medium" style={{ color: 'rgba(255,255,255,0.88)' }}>{stat.sub}</p>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}

function YourVibeArtistRow({ artist, index }: { artist: any; index: number }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const isTop4 = index < 4
  const rc = RANK_COLORS[index]

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}${artist.href}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
        triggerToast('Đã sao chép liên kết nghệ sĩ vào khay nhớ tạm!')
      } else {
        triggerToast('Chia sẻ liên kết thành công!')
      }
    }
  }

  useEffect(() => {
    setIsFollowing(isArtistFollowed(artist.title))

    const handleFollowingUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ artistName: string; isFollowing: boolean }>
      if (customEvent.detail && customEvent.detail.artistName === artist.title) {
        setIsFollowing(customEvent.detail.isFollowing)
      }
    }

    window.addEventListener('vw_following_updated', handleFollowingUpdated)
    return () => window.removeEventListener('vw_following_updated', handleFollowingUpdated)
  }, [artist.title])

  if (isHidden) return null

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = toggleFollowArtist(artist.title)
    setIsFollowing(newState)
  }

  return (
    <Link
      href={artist.href}
      className="group flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
      style={{ 
        background: isTop4 
          ? 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)' 
          : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', 
        backdropFilter: 'blur(15px)',
        border: isTop4 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 8px 30px -5px rgba(0,0,0,0.3)'
      }}
    >
      {/* Hover Highlight */}
      <div className="absolute inset-0 bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Shimmer for Top 1 */}
      {index === 0 && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(58,190,249,0.15), transparent)', 
            transform: 'translateX(-100%) skewX(-15deg)', 
            animation: 'shimmer 2.5s infinite' 
          }} 
        />
      )}

      {/* Rank number */}
      <span 
        className="font-display font-bold w-10 text-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 z-10" 
        style={{ 
          color: rc ? rc.text : 'rgba(255,255,255,0.8)',
          fontSize: index === 0 ? '28px' : index === 1 ? '24px' : index === 2 ? '22px' : index === 3 ? '20px' : '18px',
          textShadow: rc ? `0 0 ${index === 0 ? 25 : 20}px ${rc.glow}` : 'none'
        }}
      >
        {index + 1}
      </span>
      
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold overflow-hidden z-10 relative"
        style={{ 
          background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', 
          color: 'rgba(255,255,255,0.7)', 
          border: rc ? `2px solid ${rc.border}` : '1px solid rgba(255,255,255,0.1)',
          boxShadow: rc ? `0 0 ${index === 0 ? 25 : 20}px ${rc.glow.replace('0.5', '0.4').replace('0.4', '0.3')}` : '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        {artist.image ? (
          <img src={artist.image} alt={artist.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          artist.title.charAt(0)
        )}
      </div>
      
      <div className="flex-1 min-w-0 z-10">
        <p
          className="text-base font-semibold truncate transition-colors group-hover:text-white"
          style={{
            color: 'var(--vw-text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.3px',
          }}
        >
          {artist.title}
        </p>
        <p
          className="text-xs truncate mt-0.5"
          style={{ color: 'var(--vw-text-secondary)' }}
        >
          {artist.subtitle}
        </p>
      </div>
      
      {/* Interactive Controls (Heart & 3-dots) */}
      <div className="relative flex items-center gap-2 shrink-0 z-20 h-8 min-w-[72px] justify-end">
        {/* Heart Follow Button */}
        <button
          onClick={handleFollow}
          className={cn(
            "w-8 h-8 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer text-white/60 hover:text-white bg-white/5",
            isFollowing 
              ? "text-red-500 bg-red-500/10 opacity-100" 
              : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
          )}
          title={isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
        >
          <Heart size={13} fill={isFollowing ? "currentColor" : "none"} />
          {isFollowing && (
            <span className="w-1 h-1 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
          )}
        </button>

        {/* 3-dots Options Button */}
        <DropdownMenu onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer text-white/60 hover:text-white bg-white/5",
                isMenuOpen 
                  ? "opacity-100 bg-white/10 text-white pointer-events-auto" 
                  : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
              )}
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            alignOffset={12}
            side="right"
            sideOffset={10}
            className="w-60 rounded-2xl overflow-hidden border-0 p-0 z-50"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 20, 36, 0.98) 0%, rgba(15, 10, 22, 0.99) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="py-2 px-2 flex flex-col gap-1 text-left">
              {/* 1. Theo dõi / Bỏ theo dõi */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleFollow(e)
                }}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-98 outline-none",
                  isFollowing
                    ? "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                    : "text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white"
                )}
              >
                {isFollowing ? (
                  <>
                    <Trash2 size={13} className="text-red-400/80" />
                    <span>Bỏ theo dõi</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} className="text-purple-400" />
                    <span>Theo dõi</span>
                  </>
                )}
              </DropdownMenuItem>

              {/* 2. Chia sẻ liên kết */}
              <DropdownMenuItem
                onClick={handleShare}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/5 active:scale-98 focus:bg-white/5 focus:text-white outline-none"
              >
                <Share2 size={13} className="text-blue-400" />
                <span>Chia sẻ liên kết</span>
              </DropdownMenuItem>

              {/* Divider */}
              <div className="h-px bg-white/5 my-1 mx-2" />

              {/* 3. Không hiện nghệ sĩ này nữa */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsHidden(true)
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
              >
                <Ban size={13} className="text-red-400/80" />
                <span>Chặn nghệ sĩ này</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chevron Icon (only visible when buttons are hidden/normal) */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 absolute right-0",
          isMenuOpen 
            ? "opacity-0 pointer-events-none" 
            : "group-hover:opacity-0 group-hover:pointer-events-none"
        )}>
          <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 overflow-hidden rounded-2xl bg-[#16121E]/95 border border-purple-500/30 shadow-[0_10px_30px_rgba(155,77,224,0.15)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 px-6 py-3.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border bg-purple-500/10 border-purple-500/20 text-purple-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-white/90">{toastMessage}</span>
          </div>
          <div className="h-0.5 w-full bg-purple-500/10 overflow-hidden">
            <div
              className="h-full w-full bg-gradient-to-r from-purple-500 to-violet-400 origin-left"
              style={{ animation: 'toast-progress 3s linear forwards' }}
            />
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes toast-progress {
              from { transform: scaleX(1); }
              to   { transform: scaleX(0); }
            }
          `}} />
        </div>
      )}
    </Link>
  )
}
