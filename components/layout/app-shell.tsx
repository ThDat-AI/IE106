"use client"

import { useState, useEffect, Suspense } from 'react'
import Header from './header'
import Sidebar from './sidebar'
import BottomPlayer from './bottom-player'
import Footer from './footer'
import QueuePanel from './queue-panel'
import { usePlayerStore, isTrackLiked, type Track } from '@/lib/player-store'
import { getTrackByTitle, searchAlbums } from '@/lib/music-api'

import { Toaster } from '@/components/ui/toaster'

interface AppShellProps {
  children: React.ReactNode
  showFooter?: boolean
}

export default function AppShell({ children, showFooter = true }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isQueueOpen } = usePlayerStore()

  useEffect(() => {
    const seedData = async () => {
      if (typeof window === 'undefined') return
      if (localStorage.getItem('vw_preseeded') === 'true') return

      // Define fallbacks for robustness if iTunes API fails or rate limits
      const fallbackTrack1: Track = {
        id: 'seeded_ctcht',
        title: 'Chúng ta của hiện tại',
        artist: 'Sơn Tùng M-TP',
        album: 'Chúng Ta Của Hiện Tại - Single',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/6e/8b/6e/6e8b6e3f-6f9e-6f8b-6e3f-6f9e6f8b6e3f/cover.jpg/600x600bb.jpg',
        duration: 301,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      }

      const fallbackTrack2: Track = {
        id: 'seeded_atbe',
        title: 'Âm thầm bên em',
        artist: 'Sơn Tùng M-TP',
        album: 'Âm Thầm Bên Em - Single',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/bf/25/a4/bf25a407-7a54-61c0-eb88-06ad048e89f8/cover.jpg/600x600bb.jpg',
        duration: 293,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      }

      const fallbackLiked1: Track = {
        id: 'seeded_dndt',
        title: 'Đưa nhau đi trốn',
        artist: 'Đen Vâu & Giang Nguyễn',
        album: 'Đưa Nhau Đi Trốn - Single',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/4a/1b/ec/4a1becf6-281b-5e6a-72ef-7ff53f5df314/196871358988.jpg/600x600bb.jpg',
        duration: 250,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      }

      const fallbackLiked2: Track = {
        id: 'seeded_dvn',
        title: 'Đi về nhà',
        artist: 'Đen Vâu & JustaTee',
        album: 'Đi Về Nhà - Single',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/42/fa/b9/42fab960-9dc6-bdf8-6c84-a15d789bd072/cover.jpg/600x600bb.jpg',
        duration: 200,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      }

      const fallbackAlbum = {
        id: '1720847926_fallback',
        title: 'Giữa một vạn người',
        artist: 'Phùng Khánh Linh',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/bf/25/a4/bf25a407-7a54-61c0-eb88-06ad048e89f8/cover.jpg/600x600bb.jpg',
        type: 'album'
      }

      try {
        // Fetch "Nhạc sếp" tracks: "Chúng ta của hiện tại", "Âm thầm bên em"
        const track1 = (await getTrackByTitle('Chúng ta của hiện tại Sơn Tùng M-TP', 'VN')) || fallbackTrack1
        const track2 = (await getTrackByTitle('Âm thầm bên em Sơn Tùng M-TP', 'VN')) || fallbackTrack2

        // Fetch liked tracks: "Đưa nhau đi trốn", "Đi về nhà"
        const liked1 = (await getTrackByTitle('Đưa nhau đi trốn Đen', 'VN')) || fallbackLiked1
        const liked2 = (await getTrackByTitle('Đi về nhà Đen', 'VN')) || fallbackLiked2

        // Fetch album: "Giữa một vạn người" by Phùng Khánh Linh
        const albumsFetched = await searchAlbums('Giữa một vạn người Phùng Khánh Linh', 5, 'VN')
        const albumTarget = albumsFetched[0] || (await searchAlbums('Giữa một vạn người', 5, 'VN'))[0] || fallbackAlbum

        // 1. Create Playlist "Nhạc sếp"
        const playlistTracks: Track[] = []
        if (track1) playlistTracks.push(track1)
        if (track2) playlistTracks.push(track2)

        if (playlistTracks.length > 0) {
          const playlistId = 'custom_nhac_sep'
          const durationMin = Math.floor(playlistTracks.reduce((acc, t) => acc + t.duration, 0) / 60)
          
          const newPlaylist = {
            id: playlistId,
            title: 'Nhạc sếp',
            subtitle: `${playlistTracks.length} bài hát · ${durationMin} phút`,
            description: 'Playlist nhạc Sơn Tùng M-TP do bạn tạo sẵn.',
            image: playlistTracks[0]?.albumArt,
            href: `/playlist/${playlistId}`,
            type: 'playlist',
            tracks: playlistTracks
          }

          const storedPlaylistsStr = localStorage.getItem('vw_saved_playlists')
          let allPlaylists = []
          if (storedPlaylistsStr) {
            try {
              allPlaylists = JSON.parse(storedPlaylistsStr)
            } catch (e) {}
          }
          // Only add if not already present
          if (!allPlaylists.some((p: any) => p.id === playlistId)) {
            allPlaylists = [newPlaylist, ...allPlaylists]
            localStorage.setItem('vw_saved_playlists', JSON.stringify(allPlaylists))
          }
        }

        // 2. Add liked songs
        const likedSongsToAdd: Track[] = []
        if (liked1) likedSongsToAdd.push(liked1)
        if (liked2) likedSongsToAdd.push(liked2)

        if (likedSongsToAdd.length > 0) {
          const storedLikedStr = localStorage.getItem('vw_liked_tracks')
          let allLiked = []
          if (storedLikedStr) {
            try {
              allLiked = JSON.parse(storedLikedStr)
            } catch (e) {}
          }

          let updatedLiked = [...allLiked]
          likedSongsToAdd.forEach(track => {
            if (!updatedLiked.some((t: any) => t.id === track.id)) {
              updatedLiked.push(track)
            }
          })

          localStorage.setItem('vw_liked_tracks', JSON.stringify(updatedLiked))
        }

        // 3. Save Album "Giữa một vạn người"
        if (albumTarget) {
          const albumItem = {
            id: String(albumTarget.id),
            title: albumTarget.title,
            subtitle: albumTarget.artist || albumTarget.subtitle,
            image: albumTarget.albumArt || albumTarget.image,
            href: `/album/${albumTarget.id}`,
            type: 'album'
          }

          const storedAlbumsStr = localStorage.getItem('vw_saved_albums')
          let allAlbums = []
          if (storedAlbumsStr) {
            try {
              allAlbums = JSON.parse(storedAlbumsStr)
            } catch (e) {}
          }

          if (!allAlbums.some((a: any) => String(a.id) === String(albumItem.id))) {
            allAlbums = [albumItem, ...allAlbums]
            localStorage.setItem('vw_saved_albums', JSON.stringify(allAlbums))
          }
        }

        // Mark as seeded
        localStorage.setItem('vw_preseeded', 'true')

        // Dispatch events to refresh components UI
        window.dispatchEvent(new Event('vw_playlists_updated'))
        window.dispatchEvent(new Event('vw_albums_updated'))
        window.dispatchEvent(new CustomEvent('vw_likes_updated', { detail: { trackId: '', isLiked: true } }))
      } catch (error) {
        console.error('Failed to seed default content:', error)
      }
    }

    seedData()
  }, [])

  useEffect(() => {
    // If we already have a loaded song from iTunes/user (anything other than the initial dummy mock track 'st1'), do not reload
    const currentActive = usePlayerStore.getState().currentTrack
    if (currentActive && currentActive.id !== 'st1') {
      return
    }

    let cancelled = false

    const loadDefaultTrack = async () => {
      const defaultTrack = await getTrackByTitle('Thêm bao nhiêu lâu', 'VN')
      if (cancelled || !defaultTrack) return

      // Double check in case the user played a track while fetching
      const latestActive = usePlayerStore.getState().currentTrack
      if (latestActive && latestActive.id !== 'st1') return

      // Update the store state silently to avoid autoplay on initial mount
      usePlayerStore.setState({
        currentTrack: defaultTrack,
        queue: [defaultTrack],
        isLiked: isTrackLiked(defaultTrack.id)
      })
    }

    loadDefaultTrack()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-vw-bg relative overflow-hidden">
      {/* Immersive Deep Background */}
      <div suppressHydrationWarning={true} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-vw-purple opacity-[0.25] blur-[100px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#00FFFF] opacity-[0.15] blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#FF00FF] opacity-[0.15] blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        <Header />
        <Suspense fallback={null}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        </Suspense>

        <main
          className="pt-16 pb-20 min-h-screen"
          style={{
            marginLeft: sidebarCollapsed ? '72px' : '240px',
            marginRight: isQueueOpen ? '380px' : '0px',
            transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
          }}
        >
          <div className="max-w-[1220px] mx-auto px-8 py-8">
            {children}
          </div>
          {showFooter && <Footer />}
        </main>

        <BottomPlayer sidebarCollapsed={sidebarCollapsed} />
        <QueuePanel />
        <Toaster />
      </div>
    </div>
  )
}
