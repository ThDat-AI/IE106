"use client"

import { Play, Shuffle, Heart, MoreHorizontal, Clock, Plus, ChevronLeft, Share2, Music2, Info } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import { SAMPLE_TRACKS } from '@/lib/player-store'
import { usePlayerStore } from '@/lib/player-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  AmbientOrbs, 
  GlassPanel, 
  SectionHeader, 
  AccentBar, 
  AiBadge 
} from '@/components/ui/vibewave'

const PLAYLIST_TRACKS = SAMPLE_TRACKS.slice(0, 8)

const RELATED = [
  { id: 'r1', title: 'Chill Vibes', subtitle: '61 songs · VibeWave', href: '/playlist/chill-vibes' },
  { id: 'r2', title: 'Late Night Drive', subtitle: '28 songs · Your playlist', href: '/playlist/late-night-drive' },
  { id: 'r3', title: 'Morning Energy', subtitle: '35 songs · VibeWave', href: '/playlist/morning-energy' },
  { id: 'r4', title: 'Study Session', subtitle: '47 songs', href: '/playlist/study-session' },
]

function slugToTitle(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function PlaylistDetailPage({ slug }: { slug: string }) {
  const router = useRouter()
  const title = slugToTitle(slug)
  const { setTrack } = usePlayerStore()
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="relative pb-24">
      <AmbientOrbs position="absolute" />

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-10">
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
        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
          {/* Playlist Cover */}
          <div className="relative group">
            <div 
              className="absolute -inset-4 bg-purple-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" 
            />
            <div
              className="w-64 h-64 md:w-72 md:h-72 rounded-[2rem] shrink-0 flex items-center justify-center text-8xl font-display font-bold shadow-2xl relative z-10 border border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
              style={{
                background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {title.charAt(0)}
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem]">
                 <button 
                  onClick={() => setTrack(PLAYLIST_TRACKS[0])}
                  className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                >
                  <Play size={24} fill="white" className="ml-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <AiBadge label="Personalized Playlist" withIcon />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Curated for you</span>
              </div>
              <h1 
                className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1]"
                style={{ textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
              >
                {title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-white/50 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] border border-purple-500/30 text-purple-400 font-bold">VW</div>
                  <span>VibeWave</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{PLAYLIST_TRACKS.length} bài hát</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Khoảng 50 phút</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => setTrack(PLAYLIST_TRACKS[0])}
                className="group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
                style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7C3AED 100%)' }}
              >
                <Play size={20} fill="white" />
                <span>Phát tất cả</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
        {/* Track List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AccentBar color="purple" />
              <h2 className="text-2xl font-display font-bold text-white/90">Bài hát trong danh sách</h2>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors">
              <Plus size={14} /> Thêm bài hát
            </button>
          </div>

          <GlassPanel variant="dark" className="border-white/5">
            <div className="grid grid-cols-[3rem_1fr_10rem_5rem] gap-4 items-center px-6 py-4 border-b border-white/5 opacity-40">
              <span className="text-[10px] font-bold uppercase tracking-widest text-center">#</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Tiêu đề</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Album</span>
              <span className="flex justify-end">
                <Clock size={14} />
              </span>
            </div>
            <div className="p-2 space-y-1">
              {PLAYLIST_TRACKS.map((track, i) => (
                <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* About Playlist */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AccentBar color="blue" height={6} />
              <h2 className="text-xl font-display font-bold text-white/90">Thông tin</h2>
            </div>
            <GlassPanel className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Info size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white/90">Về danh sách này</p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Được tạo ra dựa trên sở thích âm nhạc của bạn. Cập nhật hàng ngày với những giai điệu mới nhất.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/40 font-medium">Người tạo</span>
                <span className="text-xs text-white/80 font-bold">VibeWave AI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-medium">Lượt nghe</span>
                <span className="text-xs text-white/80 font-bold">12,405</span>
              </div>
            </GlassPanel>
          </div>

          {/* Related Playlists */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AccentBar color="pink" height={6} />
              <h2 className="text-xl font-display font-bold text-white/90">Gợi ý khác</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {RELATED.map((item) => (
                <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} href={item.href} type="playlist" variant="compact" />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Suggested for you (Bottom) */}
      <section className="mt-20">
        <SectionHeader title="Dành cho bạn" href="/search" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
           {SAMPLE_TRACKS.slice(10, 16).map((track) => (
             <MusicCard 
               key={track.id} 
               id={track.id} 
               title={track.title} 
               subtitle={track.artist} 
               image={track.albumArt}
               type="track"
             />
           ))}
        </div>
      </section>
    </div>
  )
}

