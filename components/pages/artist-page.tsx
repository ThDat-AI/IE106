"use client"

import { Play, Heart, UserPlus, MoreHorizontal, CheckCircle2, Users, Music, ChevronDown, ChevronUp, Shuffle, Share2, Ban, Trash2, Plus } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, type Track, isArtistFollowed, toggleFollowArtist } from '@/lib/player-store'
import { useState, useEffect } from 'react'
import { searchMusic, searchAlbums, searchArtistImage, getArtistTracksById, getArtistAlbumsById } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import { AmbientOrbs, GlassPanel, SectionHeader, PageHero } from '@/components/ui/vibewave'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

function slugToName(slug: string) {
  if (!slug) return ''
  try {
    const decoded = decodeURIComponent(slug)
    return decoded.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  } catch (e) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
}

export default function ArtistPage({ 
  slug,
  id,
  initialTracks = [],
  initialAlbums = [],
  initialImage = ''
}: { 
  slug: string,
  id?: string,
  initialTracks?: Track[],
  initialAlbums?: any[],
  initialImage?: string
}) {
  const name = slugToName(slug)
  const { t } = useTranslation()
  const { setTrack, isShuffle } = usePlayerStore()
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [albums, setAlbums] = useState<any[]>(initialAlbums)
  const [artistImage, setArtistImage] = useState<string>(initialImage)
  const [relatedArtists, setRelatedArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(initialTracks.length === 0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [visibleTracks, setVisibleTracks] = useState(5)
  const [isHeroMenuOpen, setIsHeroMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  function triggerToast(msg: string) {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  function handleShufflePlay() {
    if (tracks.length === 0) return
    if (isShuffle) {
      usePlayerStore.setState({ isShuffle: false })
    } else {
      usePlayerStore.setState({ isShuffle: true })
      const shuffled = [...tracks].sort(() => Math.random() - 0.5)
      setTrack(shuffled[0])
      usePlayerStore.getState().setQueue(shuffled)
      triggerToast(`Đang phát ngẫu nhiên các bài hát của ${name}`)
    }
  }

  function handleShare() {
    setIsHeroMenuOpen(false)
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      triggerToast('Đã sao chép liên kết nghệ sĩ vào khay nhớ tạm!')
    } else {
      triggerToast('Chia sẻ liên kết nghệ sĩ thành công!')
    }
  }

  useEffect(() => {
    setIsFollowing(isArtistFollowed(name))

    const handleFollowingUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ artistName: string; isFollowing: boolean }>
      if (customEvent.detail && customEvent.detail.artistName === name) {
        setIsFollowing(customEvent.detail.isFollowing)
      }
    }

    window.addEventListener('vw_following_updated', handleFollowingUpdated)
    return () => window.removeEventListener('vw_following_updated', handleFollowingUpdated)
  }, [name])

  useEffect(() => {
    async function loadArtistData() {
      if (tracks.length === 0) {
        setIsLoading(true)
        let tData, aData, imgData
        
        if (id) {
          [tData, aData, imgData] = await Promise.all([
            getArtistTracksById(id, 10),
            getArtistAlbumsById(id, 8),
            searchArtistImage(name)
          ])
        } else {
          [tData, aData, imgData] = await Promise.all([
            searchMusic(name, 10),
            searchAlbums(name, 8),
            searchArtistImage(name)
          ])
        }
        
        setTracks(tData)
        setAlbums(aData)
        setArtistImage(imgData)
        setIsLoading(false)
      }

      // Fetch related artists (just search for a related genre or similar artists)
      const related = await searchMusic('V-Pop', 5)
      setRelatedArtists(related.map(t => ({
        id: t.id,
        title: t.artist,
        subtitle: t.genre || 'Nghệ sĩ',
        href: `/artist/${t.artist.toLowerCase().replace(/\s+/g, '-')}${t.artistId ? `?id=${t.artistId}` : ''}`,
        image: t.albumArt
      })).filter(a => a.title !== name))
    }
    loadArtistData()
  }, [name, initialTracks, id])

  return (
    <div className="relative min-h-screen pb-20">
      <AmbientOrbs position="absolute" />
      
      {/* Hero Section */}
      <div className="relative pt-6 mb-10 overflow-hidden rounded-3xl group">
        {/* Background Layer */}
        <div className="absolute inset-0 -z-10">
          {artistImage && (
            <div className="absolute inset-0">
               <img src={artistImage} alt={name} className="w-full h-full object-cover blur-2xl opacity-20 scale-110 transition-transform duration-700 group-hover:scale-105" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#16111E]/80 to-[#16111E]" />
        </div>

        {/* Content Layer */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 p-8 md:p-12">
          {/* Artist Avatar */}
          <div className="relative shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative z-10">
              {artistImage ? (
                <img src={artistImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display font-bold text-6xl bg-gradient-to-br from-vw-purple to-vw-elevated text-white/80">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            {/* Pulsing ring around avatar */}
            <div className="absolute inset-0 rounded-full bg-vw-purple/20 blur-xl animate-pulse -z-0" />
          </div>

          {/* Artist Meta */}
          <div className="flex-1 text-center md:text-left pb-4">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] backdrop-blur-md" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  <CheckCircle2 size={14} className="text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]">{t.verifiedArtist || 'Verified Artist'}</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">2.4M {t.followers || 'Followers'}</span>
               </div>
            </div>

            <h1 
              className="font-display font-bold text-3xl md:text-5xl lg:text-6xl mb-6 tracking-tight text-white drop-shadow-md leading-[1.1]"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#ffffff' }}
            >
              {name}
            </h1>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => tracks.length > 0 && setTrack(tracks[0])}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-vw-purple text-white font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer"
              >
                <Play size={20} fill="currentColor" />
                {t.playAll || 'Play All'}
              </button>
              
              <button
                onClick={handleShufflePlay}
                className={cn(
                  "relative flex items-center justify-center w-[52px] h-[52px] rounded-full border-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm shrink-0",
                  isShuffle
                    ? "border-[#9B4DE0]/40 text-[#9B4DE0] bg-[#9B4DE0]/10 shadow-[0_0_12px_rgba(155,77,224,0.15)] scale-[0.98]"
                    : "border-white/20 text-white hover:bg-white/5 hover:scale-[1.02]"
                )}
                aria-label="Phát ngẫu nhiên"
              >
                <Shuffle size={18} />
                {isShuffle && (
                  <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9B4DE0] shadow-[0_0_8px_rgba(155,77,224,0.6)] animate-in scale-in duration-300" />
                )}
              </button>

              <button
                onClick={() => {
                  const newState = toggleFollowArtist(name)
                  setIsFollowing(newState)
                  triggerToast(newState ? `Đã theo dõi nghệ sĩ ${name}!` : `Đã bỏ theo dõi nghệ sĩ ${name}`)
                }}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm border-2 transition-all duration-300 cursor-pointer",
                  isFollowing 
                    ? "bg-white/10 border-white/20 text-white/80" 
                    : "bg-transparent border-white/20 text-white hover:bg-white/5"
                )}
              >
                <UserPlus size={18} />
                {isFollowing ? (t.following || 'Following') : (t.follow || 'Follow')}
              </button>

              <DropdownMenu onOpenChange={setIsHeroMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center justify-center w-[52px] h-[52px] rounded-full border-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm shrink-0",
                      isHeroMenuOpen 
                        ? "border-[#9B4DE0]/40 text-[#9B4DE0] bg-[#9B4DE0]/10 shadow-[0_0_12px_rgba(155,77,224,0.15)]" 
                        : "border-white/20 text-white hover:bg-white/5"
                    )}
                    aria-label="Tùy chọn thêm"
                  >
                    <MoreHorizontal size={18} />
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
                      onClick={() => {
                        const newState = toggleFollowArtist(name)
                        setIsFollowing(newState)
                        triggerToast(newState ? `Đã theo dõi nghệ sĩ ${name}!` : `Đã bỏ theo dõi nghệ sĩ ${name}`)
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
                      <span>Chia sẻ liên kết nghệ sĩ</span>
                    </DropdownMenuItem>

                    {/* Divider */}
                    <div className="h-px bg-white/5 my-1 mx-2" />

                    {/* 3. Không hiện nghệ sĩ này nữa */}
                    <DropdownMenuItem
                      onClick={() => {
                        triggerToast(`Đã thêm nghệ sĩ ${name} vào danh sách ẩn. Quay lại trang chủ...`)
                        setTimeout(() => {
                          window.location.href = '/'
                        }, 1500)
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 transition-all duration-200 cursor-pointer hover:bg-red-500/10 active:scale-98 focus:bg-red-500/10 focus:text-red-400 outline-none"
                    >
                      <Ban size={13} className="text-red-400/80" />
                      <span>Chặn nghệ sĩ này</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16 px-4 md:px-8">
        {/* Popular Tracks Section */}
        <section>
          <SectionHeader title={t.popular || 'Popular'} />
          <GlassPanel className="p-2 border-white/5">
            <div className="divide-y divide-white/5">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse bg-white/5 rounded-lg mb-1" />
                ))
              ) : tracks.length > 0 ? (
                tracks.slice(0, visibleTracks).map((track, i) => (
                  <TrackRow key={track.id} index={i + 1} track={track} showAlbum hideGoToArtist />
                ))
              ) : (
                <div className="p-12 text-center text-white/30 italic">
                  {t.noResults || 'No tracks found.'}
                </div>
              )}
            </div>
          </GlassPanel>

          {/* Show more/less button */}
          {!isLoading && tracks.length > 5 && (
            <div className="flex justify-center mt-8">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 8px 32px rgba(10,7,18,0.5), 0 0 15px rgba(155,77,224,0.3); }
                  50% { box-shadow: 0 8px 32px rgba(10,7,18,0.5), 0 0 25px rgba(155,77,224,0.6); }
                }
                .glow-button:hover {
                  animation: pulse-glow 2s infinite;
                  border-color: rgba(155,77,224,0.7) !important;
                }
              `}} />
              <button
                onClick={() => setVisibleTracks(prev => prev === 5 ? tracks.length : 5)}
                className="group glow-button flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-500 backdrop-blur-xl active:scale-95 cursor-pointer relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(155,77,224,0.18) 0%, rgba(22,17,30,0.8) 100%)',
                  border: '1px solid rgba(155,77,224,0.35)',
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(10, 7, 18, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Subtle hover background highlight effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                />
                
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                  {visibleTracks === 5 ? 'Xem thêm' : 'Thu gọn'}
                </span>
                
                {visibleTracks === 5 ? (
                  <ChevronDown 
                    size={16} 
                    className="relative z-10 text-purple-300 transition-transform duration-500 group-hover:translate-y-0.5 ease-out" 
                  />
                ) : (
                  <ChevronUp 
                    size={16} 
                    className="relative z-10 text-purple-300 transition-transform duration-500 group-hover:-translate-y-0.5 ease-out" 
                  />
                )}
              </button>
            </div>
          )}
        </section>

        {/* Discography Section */}
        <section>
          <SectionHeader title={t.discography || 'Discography'} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {isLoading ? (
               Array(6).fill(0).map((_, i) => (
                 <div key={i} className="aspect-square w-full animate-pulse bg-white/5 rounded-2xl" />
               ))
            ) : albums.length > 0 ? (
              albums.map((item) => (
                <MusicCard 
                  key={item.id} 
                  id={item.id} 
                  title={item.title} 
                  subtitle={`${new Date(item.release_date).getFullYear()}`} 
                  image={item.albumArt} 
                  href={`/album/${item.id}`} 
                  type="album" 
                  className="card-hover"
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                {t.noAlbum || 'No albums yet.'}
              </div>
            )}
          </div>
        </section>

        {/* Fans Also Like */}
        {relatedArtists.length > 0 && (
          <section>
            <SectionHeader title={t.fansAlsoLike || 'Fans Also Like'} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {relatedArtists.map((item) => (
                <MusicCard 
                  key={item.id} 
                  id={item.id} 
                  title={item.title} 
                  subtitle={item.subtitle} 
                  image={item.image} 
                  href={item.href} 
                  type="artist" 
                  className="card-hover"
                />
              ))}
            </div>
          </section>
        )}

        {/* About Artist Section */}
        <section>
          <SectionHeader title={t.aboutArtist || `Giới thiệu về ${name}`} />
          <GlassPanel className="p-6 md:p-8 border-white/5 relative overflow-hidden">
            {/* Ambient background blob behind the about section */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-vw-purple/10 blur-3xl pointer-events-none -z-10" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Bio Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Đang hoạt động sôi nổi</span>
                </div>
                
                <h3 className="font-display font-bold text-2xl text-white">Câu chuyện âm nhạc</h3>
                <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
                  {name === 'Sơn Tùng M-TP' ? (
                    "Nguyễn Thanh Tùng, được biết đến chuyên nghiệp với nghệ danh Sơn Tùng M-TP, là một nam ca sĩ kiêm nhạc sĩ và diễn viên người Việt Nam. Được mệnh danh là 'Hoàng tử V-Pop', anh nổi tiếng với những ca khúc tự sáng tác đạt hàng trăm triệu lượt xem trên YouTube như Lạc Trôi, Chạy Ngay Đi, Hãy Trao Cho Anh, và Chúng Ta Của Tương Lai."
                  ) : name === 'Đen Vâu' || name === 'Đen' ? (
                    "Nguyễn Đức Cường, được biết đến với nghệ danh Đen Vâu hay đơn giản là Đen, là một nam nhạc sĩ kiêm rapper người Việt Nam. Đen Vâu là một trong số ít nghệ sĩ nhạc rap gặt hái được nhiều thành công tại thị trường nhạc Việt với các ca khúc mộc mạc, triết lý sống đời thường như Lối Nhỏ, Hai Triệu Năm, Trốn Tìm, và Nấu Ăn Cho Em."
                  ) : name === 'Hoàng Thùy Linh' ? (
                    "Hoàng Thùy Linh là một nữ ca sĩ kiêm diễn viên người Việt Nam. Cô nổi tiếng với dòng nhạc Pop điện tử mang âm hưởng văn hóa dân gian Việt Nam vô cùng đặc trưng. Các album 'Hoàng' (2019) và 'LINK' (2022) đạt thành công vang dội với các siêu phẩm quốc tế như See Tình, Gieo Quẻ, và Để Mị Nói Cho Mà Nghe."
                  ) : name === 'Da LAB' || name === 'Da Lab' ? (
                    "Da LAB là một ban nhạc rap/hip-hop nổi tiếng của Việt Nam, được thành lập từ năm 2007. Khởi nguồn từ dòng nhạc indie, nhóm đã ghi dấu ấn sâu đậm trong lòng khán giả yêu nhạc qua những bản hit quốc dân mang giai điệu mộc mạc, gần gũi nhưng cực kỳ cuốn hút như Một Nhà, Thanh Xuân, Gác Lại Âu Lo, và Thức Giấc."
                  ) : (
                    `${name} là một trong những nghệ sĩ tài năng và được yêu mến hàng đầu tại VibeWave. Với phong cách âm nhạc độc đáo, cá tính nghệ thuật ấn tượng và lượng người hâm mộ vô cùng đông đảo, nghệ sĩ liên tục mang đến những bản hit đứng đầu các bảng xếp hạng và khơi gợi nguồn cảm hứng bất tận cho người yêu âm nhạc Việt Nam.`
                  )}
                </p>
                
                {/* Visual quote or motto */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 italic text-sm text-purple-200/80">
                  "Âm nhạc không chỉ là giai điệu, âm nhạc là nhịp đập của tâm hồn, là nơi kết nối những trái tim đồng điệu."
                </div>
              </div>
              
              {/* Right Stats Column */}
              <div className="flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-6">
                <div>
                  <h4 className="text-xs font-display font-bold text-white/40 uppercase tracking-widest mb-4">Chỉ số trên VibeWave</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-white/50 block">Người nghe hàng tháng</span>
                      <strong className="text-2xl font-bold text-white font-display">3.5M lượt nghe</strong>
                    </div>
                    <div>
                      <span className="text-xs text-white/50 block">Người theo dõi</span>
                      <strong className="text-2xl font-bold text-white font-display">2.4M người theo dõi</strong>
                    </div>
                    <div>
                      <span className="text-xs text-white/50 block">Xếp hạng thế giới</span>
                      <strong className="text-2xl font-bold text-purple-400 font-display">Top #12 Việt Nam</strong>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Thể loại</span>
                    <span className="text-white/80 font-medium">V-Pop, Hip-Hop, Pop-Ballad</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Hoạt động từ</span>
                    <span className="text-white/80 font-medium">2007 - Hiện tại</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Quốc gia</span>
                    <span className="text-white/80 font-medium">Việt Nam 🇻🇳</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-24 right-6 z-50 overflow-hidden rounded-2xl animate-in fade-in slide-in-from-bottom-5 duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(155,77,224,0.95) 0%, rgba(26,20,36,0.97) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(155, 77, 224, 0.4)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 15px rgba(155,77,224,0.2)',
            }}
          >
            <div className="px-5 py-3.5 text-xs font-semibold text-white">
              {toastMessage}
            </div>
            <div className="h-0.5 w-full bg-purple-500/20 overflow-hidden">
              <div
                className="h-full w-full bg-white/50 origin-left"
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
      </div>
    </div>
  )
}
