"use client"

import { Play, Shuffle, Heart, MoreHorizontal, Clock, ExternalLink, ChevronLeft, Calendar, Music2, Share2 } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import { usePlayerStore, type Track } from '@/lib/player-store'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAlbumInfo, getAlbumTracks, searchAlbums } from '@/lib/music-api'
import { 
  AmbientOrbs, 
  GlassPanel, 
  SectionHeader, 
  AccentBar, 
  AiBadge 
} from '@/components/ui/vibewave'
import { useRouter } from 'next/navigation'

export default function AlbumDetailPage({ 
  slug, 
  initialAlbumInfo, 
  initialTracks 
}: { 
  slug: string,
  initialAlbumInfo?: any,
  initialTracks?: Track[]
}) {
  const router = useRouter()
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()
  const [tracks, setTracks] = useState<Track[]>(initialTracks || [])
  const [albumInfo, setAlbumInfo] = useState<any>(initialAlbumInfo || null)
  const [moreFromArtist, setMoreFromArtist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(!initialAlbumInfo && !initialTracks)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    async function loadAlbumData() {
      // Only fetch if initial data is missing
      if (!albumInfo || tracks.length === 0) {
        setIsLoading(true)
        const isId = /^\d+$/.test(slug)
        let info = null
        let albumTracks: Track[] = []
        
        if (isId) {
          info = await getAlbumInfo(slug)
          if (info) albumTracks = await getAlbumTracks(slug)
        } else {
          const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          const searchResults = await searchAlbums(title, 1)
          if (searchResults.length > 0) {
            info = searchResults[0]
            albumTracks = await getAlbumTracks(info.id)
          }
        }
        setAlbumInfo(info)
        setTracks(albumTracks)
        setIsLoading(false)
      }

      // Always fetch more from artist if we have an artist name
      const currentArtist = albumInfo?.artist || (initialAlbumInfo?.artist)
      if (currentArtist) {
        const more = await searchAlbums(currentArtist, 5)
        const currentId = albumInfo?.id || initialAlbumInfo?.id || slug
        setMoreFromArtist(more.filter(a => String(a.id) !== String(currentId)).slice(0, 4))
      }
    }
    loadAlbumData()
  }, [slug, initialAlbumInfo, initialTracks])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-white/40 tracking-wider uppercase">Đang đồng bộ âm nhạc...</p>
      </div>
    )
  }

  if (!albumInfo && tracks.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
          <Music2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white/90">Không tìm thấy album</h2>
          <p className="text-white/50 max-w-xs">Giai điệu này có vẻ đã lạc trôi. Hãy thử tìm kiếm một album khác.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 transition-vw text-sm font-semibold"
        >
          <ChevronLeft size={18} /> Quay lại
        </button>
      </div>
    )
  }

  const title = albumInfo?.title || "Album"
  const artist = albumInfo?.artist || "Nghệ sĩ"
  const year = albumInfo?.release_date ? new Date(albumInfo.release_date).getFullYear() : ""
  const albumArt = albumInfo?.albumArt || tracks[0]?.albumArt

  return (
    <div className="relative pb-24">
      <AmbientOrbs position="absolute" />
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-vw group"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-vw text-white/70 hover:text-white">
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-vw ${isLiked ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-white/70 hover:text-white'}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
          {/* Album Cover */}
          <div className="relative group">
            <div 
              className="absolute -inset-4 bg-purple-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" 
              style={{ backgroundColor: 'rgba(155,77,224,0.15)' }}
            />
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border border-white/10">
              {albumArt ? (
                <img src={albumArt} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-900 text-7xl font-display font-bold text-white/30">
                  {title.charAt(0)}
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  onClick={() => tracks.length > 0 && setTrack(tracks[0])}
                  className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                >
                  <Play size={24} fill="white" className="ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Album Details */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <AiBadge label="Premium Album" withIcon />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Release</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-white/60">
                <Link 
                  href={`/artist/${encodeURIComponent(artist.toLowerCase().replace(/\s+/g, '-'))}${albumInfo?.artistId ? `?id=${albumInfo.artistId}` : ''}`}
                  className="flex items-center gap-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden border border-purple-500/30">
                    {albumArt ? <img src={albumArt} className="w-full h-full object-cover opacity-60" /> : artist.charAt(0)}
                  </div>
                  {artist}
                </Link>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar size={14} className="text-white/40" />
                  {year}
                </div>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Music2 size={14} className="text-white/40" />
                  {tracks.length} bài hát
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => tracks.length > 0 && setTrack(tracks[0])}
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
                style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)' }}
              >
                <Play size={20} fill="white" />
                <span>Phát ngay</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              
              <button
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-vw"
              >
                <Shuffle size={18} />
                <span>Trộn bài</span>
              </button>

              <button className="hidden md:flex p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-vw">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
        {/* Track List */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AccentBar color="purple" />
            <h2 className="text-2xl font-display font-bold text-white/90">Danh sách bài hát</h2>
          </div>

          <GlassPanel variant="dark" className="border-white/5">
            <div className="grid grid-cols-[3rem_1fr_4rem] md:grid-cols-[3rem_1fr_5rem] gap-4 items-center px-6 py-3 border-b border-white/5 opacity-40">
              <span className="text-[10px] font-bold uppercase tracking-widest text-center">#</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Tiêu đề</span>
              <span className="flex justify-end">
                <Clock size={14} />
              </span>
            </div>
            <div className="p-2 space-y-1">
              {tracks.map((track, i) => (
                <TrackRow 
                  key={track.id} 
                  index={i + 1} 
                  track={track} 
                  showAlbum={false} 
                />
              ))}
            </div>
          </GlassPanel>
          
          <p className="text-[11px] text-white/20 px-4">
            &copy; {year} {artist}. Cung cấp bởi iTunes Music.
          </p>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Artist Card */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AccentBar color="blue" />
              <h2 className="text-xl font-display font-bold text-white/90">Nghệ sĩ</h2>
            </div>
            
            <GlassPanel className="p-6 text-center space-y-4 group">
              <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-colors">
                {albumArt ? (
                  <img src={albumArt} alt={artist} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-3xl font-display font-bold">
                    {artist.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{artist}</h3>
                <p className="text-sm text-white/40">{albumInfo?.genre || 'V-Pop Artist'}</p>
              </div>
              <Link
                href={`/artist/${encodeURIComponent(artist.toLowerCase().replace(/\s+/g, '-'))}${albumInfo?.artistId ? `?id=${albumInfo.artistId}` : ''}`}
                className="block w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-vw"
              >
                Xem hồ sơ
              </Link>
            </GlassPanel>
          </div>

          {/* More from Artist */}
          {moreFromArtist.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <AccentBar color="pink" />
                <h2 className="text-xl font-display font-bold text-white/90">Gợi ý khác</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {moreFromArtist.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/album/${item.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-vw group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5">
                      <img src={item.albumArt} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white/90 truncate group-hover:text-purple-400 transition-colors">{item.title}</p>
                      <p className="text-xs text-white/40">{new Date(item.release_date).getFullYear()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
