"use client"

import { Play, Heart, UserPlus, MoreHorizontal } from 'lucide-react'
import MusicCard from '@/components/music/music-card'
import TrackRow from '@/components/music/track-row'
import { usePlayerStore, type Track } from '@/lib/player-store'
import { useState, useEffect } from 'react'
import { searchMusic, searchAlbums, searchArtistImage, getArtistTracksById, getArtistAlbumsById } from '@/lib/music-api'

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
  const { setTrack } = usePlayerStore()
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [albums, setAlbums] = useState<any[]>(initialAlbums)
  const [artistImage, setArtistImage] = useState<string>(initialImage)
  const [relatedArtists, setRelatedArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(initialTracks.length === 0)

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
        subtitle: 'Nghệ sĩ',
        href: `/artist/${t.artist.toLowerCase().replace(/\s+/g, '-')}${t.artistId ? `?id=${t.artistId}` : ''}`,
        image: t.albumArt
      })).filter(a => a.title !== name))
    }
    loadArtistData()
  }, [name, initialTracks])

  return (
    <div className="space-y-12">

      {/* Hero banner */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 320 }}
      >
        {/* Atmospheric background image */}
        {artistImage && (
          <div className="absolute inset-0">
             <img src={artistImage} alt={name} className="w-full h-full object-cover blur-xl opacity-30 scale-110" />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #170F23 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 30% 50%, rgba(155,77,224,0.35), transparent 70%)', pointerEvents: 'none' }}
          aria-hidden="true"
        />

        <div className="relative flex items-end h-full p-8 gap-8">
          <div
            className="w-40 h-40 rounded-full shrink-0 overflow-hidden"
            style={{
              border: '4px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
            }}
          >
            {artistImage ? (
              <img src={artistImage} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-display font-bold text-5xl"
                style={{
                  background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">✓</span>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>Nghệ sĩ xác thực</p>
            </div>
            <h1
              className="font-display font-bold leading-display mb-3"
              style={{ fontSize: 64, color: 'rgba(255,255,255,0.95)', letterSpacing: '-2px', lineHeight: 0.9 }}
            >
              {name}
            </h1>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Hàng triệu người nghe hàng tháng
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => tracks.length > 0 && setTrack(tracks[0])}
          className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
          style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
        >
          <Play size={18} fill="white" />
          Phát ngay
        </button>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <UserPlus size={16} />
          Theo dõi
        </button>
        <button className="p-3 rounded-lg transition-vw hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Popular tracks */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
          Phổ biến
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="py-2">
            {tracks.map((track, i) => (
              <TrackRow key={track.id} index={i + 1} track={track} showAlbum />
            ))}
            {tracks.length === 0 && !isLoading && (
               <div className="p-8 text-center text-white/30">Không tìm thấy bài hát nào.</div>
            )}
          </div>
        </div>
      </section>

      {/* Discography */}
      <section>
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
          Danh sách Album
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {albums.map((item) => (
            <MusicCard key={item.id} id={item.id} title={item.title} subtitle={`${new Date(item.release_date).getFullYear()}`} image={item.albumArt} href={`/album/${item.id}`} type="album" />
          ))}
          {albums.length === 0 && !isLoading && (
            <div className="col-span-full py-8 text-white/30">Chưa có album nào được liệt kê.</div>
          )}
        </div>
      </section>

      {/* Related artists */}
      {relatedArtists.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}>
            Người hâm mộ cũng thích
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedArtists.map((item) => (
              <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} image={item.image} href={item.href} type="artist" />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
