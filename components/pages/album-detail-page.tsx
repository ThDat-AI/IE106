"use client"

import { Play, Shuffle, Heart, MoreHorizontal, Clock, ExternalLink } from 'lucide-react'
import TrackRow from '@/components/music/track-row'
import MusicCard from '@/components/music/music-card'
import { usePlayerStore, type Track } from '@/lib/player-store'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAlbumInfo, getAlbumTracks, searchAlbums } from '@/lib/music-api'

export default function AlbumDetailPage({ 
  slug, 
  initialAlbumInfo, 
  initialTracks 
}: { 
  slug: string,
  initialAlbumInfo?: any,
  initialTracks?: Track[]
}) {
  const { setTrack } = usePlayerStore()
  const [tracks, setTracks] = useState<Track[]>(initialTracks || [])
  const [albumInfo, setAlbumInfo] = useState<any>(initialAlbumInfo || null)
  const [moreFromArtist, setMoreFromArtist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(!initialAlbumInfo && !initialTracks)

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
        const more = await searchAlbums(currentArtist, 4)
        const currentId = albumInfo?.id || initialAlbumInfo?.id || slug
        setMoreFromArtist(more.filter(a => a.id !== currentId))
      }
    }
    loadAlbumData()
  }, [slug, initialAlbumInfo, initialTracks])

  if (isLoading) {
    return <div className="p-8 text-white/50">Đang tải thông tin album...</div>
  }

  if (!albumInfo && tracks.length === 0) {
    return <div className="p-8 text-white/50">Không tìm thấy album này.</div>
  }

  const title = albumInfo?.title || "Album"
  const artist = albumInfo?.artist || "Nghệ sĩ"
  const year = albumInfo?.release_date ? new Date(albumInfo.release_date).getFullYear() : ""

  return (
    <div className="space-y-12">

      {/* Hero */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
        <div
          className="w-52 h-52 rounded-2xl shrink-0 overflow-hidden"
          style={{
            boxShadow: '0 24px 64px rgba(155,77,224,0.2)',
          }}
        >
          {albumInfo?.albumArt || tracks[0]?.albumArt ? (
            <img src={albumInfo?.albumArt || tracks[0]?.albumArt} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-display font-bold text-6xl"
              style={{
                background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {title.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 pb-2 text-center md:text-left">
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Album</p>
          <h1
            className="font-display font-bold leading-display mb-3"
            style={{ fontSize: 42, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1px', lineHeight: 1 }}
          >
            {title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <Link 
              href={`/artist/${encodeURIComponent(artist.toLowerCase().replace(/\s+/g, '-'))}${albumInfo?.artistId ? `?id=${albumInfo.artistId}` : ''}`}
              className="text-sm font-medium transition-vw hover:opacity-80" 
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {artist}
            </Link>
            {year && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{year}</span>
              </>
            )}
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{tracks.length} bài hát</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => tracks.length > 0 && setTrack(tracks[0])}
              className="flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold transition-vw hover:opacity-85 active:scale-95"
              style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
            >
              <Play size={16} fill="white" />
              Phát ngay
            </button>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Shuffle size={15} />
              Trộn bài
            </button>
            <button className="p-3 rounded-lg transition-vw hover:bg-white/5" aria-label="Like album" style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Heart size={16} />
            </button>
            <button className="p-3 rounded-lg transition-vw hover:bg-white/5" aria-label="More options" style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="grid grid-cols-[2rem_1fr_5rem] gap-4 items-center px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>#</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Tiêu đề</span>
          <span className="flex justify-end">
            <Clock size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </span>
        </div>
        <div className="py-2">
          {tracks.map((track, i) => (
            <TrackRow key={track.id} index={i + 1} track={track} showAlbum={false} />
          ))}
        </div>
      </div>

      {/* Artist card */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center font-display font-bold text-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.1)' }}
        >
          {albumInfo?.albumArt ? (
             <img src={albumInfo.albumArt} alt={artist} className="w-full h-full object-cover" />
          ) : artist.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Nghệ sĩ</p>
          <div className="font-display font-semibold text-lg" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.2px' }}>
            {artist}
          </div>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{albumInfo?.genre || 'V-Pop'}</p>
        </div>
        <Link
          href={`/artist/${encodeURIComponent(artist.toLowerCase().replace(/\s+/g, '-'))}${albumInfo?.artistId ? `?id=${albumInfo.artistId}` : ''}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-vw hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Xem nghệ sĩ <ExternalLink size={13} />
        </Link>
      </div>

      {/* More from artist */}
      {moreFromArtist.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            Thêm từ {artist}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moreFromArtist.map((item) => (
              <MusicCard key={item.id} id={item.id} title={item.title} subtitle={item.artist} image={item.albumArt} href={`/album/${item.id}`} type="album" />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
