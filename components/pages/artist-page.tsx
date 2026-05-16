"use client"

import { Play, Heart, UserPlus, MoreHorizontal, CheckCircle2, Users, Music } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { useState, useEffect } from 'react'
import { searchMusic, searchAlbums, searchArtistImage, getArtistTracksById, getArtistAlbumsById } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import { AmbientOrbs, GlassPanel, SectionHeader, PageHero } from '@/components/ui/vibewave'
import { cn } from '@/lib/utils'

function slugToName(slug: string) {
  if (!slug) return ''
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
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
  const { setTrack } = usePlayerStore()
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [albums, setAlbums] = useState<any[]>(initialAlbums)
  const [artistImage, setArtistImage] = useState<string>(initialImage)
  const [relatedArtists, setRelatedArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(initialTracks.length === 0)
  const [isFollowing, setIsFollowing] = useState(false)

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
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t.verifiedArtist || 'Verified Artist'}</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">2.4M {t.followers || 'Followers'}</span>
               </div>
            </div>

            <h1 className="font-righteous text-5xl md:text-8xl lg:text-9xl mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-purple-400 drop-shadow-sm leading-[0.85]">
              {name}
            </h1>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => tracks.length > 0 && setTrack(tracks[0])}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-vw-purple text-white font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Play size={20} fill="currentColor" />
                {t.playAll || 'Play All'}
              </button>
              
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm border-2 transition-all duration-300",
                  isFollowing 
                    ? "bg-white/10 border-white/20 text-white/80" 
                    : "bg-transparent border-white/20 text-white hover:bg-white/5"
                )}
              >
                <UserPlus size={18} />
                {isFollowing ? (t.following || 'Following') : (t.follow || 'Follow')}
              </button>

              <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white">
                <MoreHorizontal size={20} />
              </button>
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
                tracks.map((track, i) => (
                  <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
                ))
              ) : (
                <div className="p-12 text-center text-white/30 italic">
                  {t.noResults || 'No tracks found.'}
                </div>
              )}
            </div>
          </GlassPanel>
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
      </div>
    </div>
  )
}
