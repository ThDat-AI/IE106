"use client"

import { Sparkles, RefreshCw, Play, ChevronRight, Loader2, RotateCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import MusicCard from '@/components/music/music-card'
import { SAMPLE_TRACKS, type Track } from '@/lib/player-store'
import { searchMusic, searchArtistImage } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  PageHero,
  AccentBar,
  AiBadge,
  FilterPills,
  RANK_COLORS,
  MusicShelf,
} from '@/components/ui/vibewave'

const GENRE_CATEGORIES = ['Tất cả', 'Pop', 'Hip-hop', 'EDM', 'Tập trung', 'Thư giãn']

export default function YourVibePage() {
  const { t } = useTranslation()
  const [mixes, setMixes] = useState<Track[]>([])
  const [discovered, setDiscovered] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMixes, setIsLoadingMixes] = useState(false)
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

  async function fetchData() {
    setIsLoading(true)
    try {
      const [mixData, discoveredData, ...artistImages] = await Promise.all([
        searchMusic('V-Pop Hits', 10),
        searchMusic('Nhạc trẻ mới nhất', 4),
        ...INITIAL_ARTISTS.map(a => searchArtistImage(a.title))
      ])
      
      setMixes(mixData)
      setDiscovered(discoveredData)
      setTopArtists(INITIAL_ARTISTS.map((a, i) => ({
        ...a,
        image: artistImages[i]
      })))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRefreshMixes() {
    setIsLoadingMixes(true)
    try {
      const keywords = ['V-Pop Hits', 'V-Pop Hot', 'Nhạc trẻ HOT', 'Nhạc Chill V-Pop', 'Vietnamese Pop', 'Indie Việt', 'Rap Việt Hot']
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
      const mixData = await searchMusic(randomKeyword, 10)
      setMixes(mixData)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingMixes(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-16">

      {/* Hero */}
      <section>
        <PageHero
          eyebrowIcon={<Sparkles size={13} />}
          eyebrowLabel={t.aiPowered}
          title={t.yourVibe}
          subtitle={t.yourVibeSub}
          gradientClass="from-white to-white"
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
              {mixes[0] ? (
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
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2" style={{ backgroundColor: 'rgba(155,77,224,0.2)', color: '#D8B4FE', border: '1px solid rgba(155,77,224,0.3)' }}>
                ✨ {t.topPickToday}
              </span>
              <h2 className="font-display font-bold mt-1 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200" style={{ fontSize: 40, letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(155,77,224,0.3)' }}>
                V-Pop Daily Mix
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {mixes[0]?.artist || '...'} &amp; các nghệ sĩ V-Pop hàng đầu · {isLoading ? '...' : '25'} bài hát
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="group/btn flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden relative"
                  style={{ 
                    background: 'linear-gradient(135deg, #9B4DE0 0%, #6B21A8 100%)', 
                    color: '#ffffff',
                    boxShadow: '0 10px 25px -5px rgba(155,77,224,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  <Play size={16} fill="currentColor" className="relative z-10 drop-shadow-md" />
                  <span className="relative z-10">{t.listenNow}</span>
                </button>
                <Link
                  href="/playlist/daily-mix-1"
                  className="group/link flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/20 backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {t.viewPlaylist} <ChevronRight size={16} className="opacity-70 group-hover/link:opacity-100 transition-opacity" />
                </Link>
              </div>
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
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-white/70 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(155,77,224,0.05)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer shadow-md"
          >
            <RotateCw
              size={12}
              className={cn(
                "transition-transform duration-700",
                isLoadingMixes ? "animate-spin text-purple-400" : "group-hover:rotate-180"
              )}
            />
            <span>Làm mới</span>
          </button>
        </div>
        <MusicShelf>
          {isLoading ? (
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
          <h2 className="font-display font-bold flex items-center gap-3 mb-6" style={{ fontSize: 24, color: '#ffffff', letterSpacing: '-0.3px' }}>
            <AccentBar height={6} color="pink" />
            {t.recentlyDiscovered}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
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
          <h2 className="font-display font-bold flex items-center gap-3 mb-6" style={{ fontSize: 24, color: '#ffffff', letterSpacing: '-0.3px' }}>
            <AccentBar height={6} color="blue" />
            {t.topArtists}
          </h2>
          <div className="space-y-3">
            {topArtists.map((artist, i) => {
              const isTop4 = i < 4
              const rc = RANK_COLORS[i]
              return (
                <Link
                  key={artist.id}
                  href={artist.href}
                  className="group/artist flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
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
                  <div className="absolute inset-0 bg-white/[0.06] opacity-0 group-hover/artist:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Shimmer for Top 1 */}
                  {i === 0 && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/artist:opacity-100 transition-opacity duration-500 pointer-events-none" 
                      style={{ 
                        background: 'linear-gradient(90deg, transparent, rgba(58,190,249,0.15), transparent)', 
                        transform: 'translateX(-100%) skewX(-15deg)', 
                        animation: 'shimmer 2.5s infinite' 
                      }} 
                    />
                  )}

                  {/* Rank number */}
                  <span 
                    className="font-display font-bold w-10 text-center shrink-0 transition-all duration-300 group-hover/artist:scale-110 group-hover/artist:-rotate-3 z-10" 
                    style={{ 
                      color: rc ? rc.text : 'rgba(255,255,255,0.8)',
                      fontSize: i === 0 ? '28px' : i === 1 ? '24px' : i === 2 ? '22px' : i === 3 ? '20px' : '18px',
                      textShadow: rc ? `0 0 ${i === 0 ? 25 : 20}px ${rc.glow}` : 'none'
                    }}
                  >
                    {i + 1}
                  </span>
                  
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold overflow-hidden z-10 relative"
                    style={{ 
                      background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', 
                      color: 'rgba(255,255,255,0.7)', 
                      border: rc ? `2px solid ${rc.border}` : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: rc ? `0 0 ${i === 0 ? 25 : 20}px ${rc.glow.replace('0.5', '0.4').replace('0.4', '0.3')}` : '0 4px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    {artist.image ? (
                      <img src={artist.image} alt={artist.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/artist:scale-110" />
                    ) : (
                      artist.title.charAt(0)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 z-10">
                    <p className="text-base font-semibold truncate transition-colors group-hover/artist:text-white" style={{ color: isTop4 ? '#ffffff' : 'rgba(255,255,255,0.85)' }}>{artist.title}</p>
                    <p className="text-xs truncate mt-0.5 uppercase tracking-wide font-medium" style={{ color: 'rgba(155,77,224,0.9)' }}>{artist.subtitle}</p>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover/artist:bg-white/10 z-10">
                    <ChevronRight size={18} className="transition-transform duration-300 group-hover/artist:translate-x-0.5 group-hover/artist:text-white" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                </Link>
              );
            })}
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
                <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
                <p className="font-display font-bold bg-clip-text text-transparent" style={{ 
                  fontSize: 42, 
                  letterSpacing: '-1px', 
                  lineHeight: 1,
                  backgroundImage: i === 0 ? 'linear-gradient(135deg, #ffffff 0%, #BAE6FD 100%)' : 
                                   i === 1 ? 'linear-gradient(135deg, #ffffff 0%, #A7F3D0 100%)' : 
                                   i === 2 ? 'linear-gradient(135deg, #ffffff 0%, #FECDD3 100%)' : 
                                   'linear-gradient(135deg, #ffffff 0%, #FEF08A 100%)'
                }}>{stat.value}</p>
                <p className="text-sm mt-3 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.sub}</p>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
