"use client"

import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist: string
  artistId?: string
  album: string
  albumArt: string
  duration: number // seconds
  url: string
  lyrics?: string
  playedAt?: string
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number // 0-100
  volume: number // 0-100
  isMuted: boolean
  isFullPlayer: boolean
  queue: Track[]
  isQueueOpen: boolean
  isLiked: boolean
  isShuffle: boolean
  isRepeat: boolean
  setTrack: (track: Track) => void
  togglePlay: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleFullPlayer: () => void
  toggleLike: () => void
  nextTrack: () => void
  prevTrack: () => void
  setQueue: (queue: Track[]) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleQueue: () => void
  setIsQueueOpen: (isOpen: boolean) => void
}

export const SAMPLE_TRACKS: Track[] = [
  {
    id: 'st1',
    title: 'Chúng Ta Của Tương Lai',
    artist: 'Sơn Tùng M-TP',
    album: 'Chúng Ta Của Tương Lai - Single',
    albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/6e/8b/6e/6e8b6e3f-6f9e-6f8b-6e3f-6f9e6f8b6e3f/cover.jpg/600x600bb.jpg',
    duration: 250,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'dv1',
    title: 'Nấu Ăn Cho Em',
    artist: 'Đen Vâu',
    album: 'Nấu Ăn Cho Em - Single',
    albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/0e/8b/6e/0e8b6e3f-6f9e-6f8b-6e3f-6f9e6f8b6e3f/cover.jpg/600x600bb.jpg',
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'htl1',
    title: 'See Tình',
    artist: 'Hoàng Thùy Linh',
    album: 'LINK',
    albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/1e/8b/6e/1e8b6e3f-6f9e-6f8b-6e3f-6f9e6f8b6e3f/cover.jpg/600x600bb.jpg',
    duration: 185,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'v1',
    title: 'Lạ Lùng',
    artist: 'Vũ.',
    album: 'Lạ Lùng - Single',
    albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/2e/8b/6e/2e8b6e3f-6f9e-6f8b-6e3f-6f9e6f8b6e3f/cover.jpg/600x600bb.jpg',
    duration: 260,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
]

export function getLikedTracks(): Track[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('vw_liked_tracks')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function toggleLikeTrack(track: Track): boolean {
  if (typeof window === 'undefined') return false
  try {
    const liked = getLikedTracks()
    const index = liked.findIndex(t => t.id === track.id)
    let isLikedNow = false
    if (index > -1) {
      liked.splice(index, 1)
    } else {
      liked.push(track)
      isLikedNow = true
    }
    localStorage.setItem('vw_liked_tracks', JSON.stringify(liked))
    // Trigger global event for components to sync instantly
    window.dispatchEvent(new CustomEvent('vw_likes_updated', { detail: { trackId: track.id, isLiked: isLikedNow } }))
    return isLikedNow
  } catch (e) {
    return false
  }
}

export function isTrackLiked(trackId: string): boolean {
  if (typeof window === 'undefined') return false
  const liked = getLikedTracks()
  return liked.some(t => t.id === trackId)
}

export interface AlbumItem {
  id: string
  title: string
  subtitle: string
  image?: string
  href: string
  type: string
}

export function getSavedAlbums(): AlbumItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('vw_saved_albums')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function isAlbumSaved(albumId: string): boolean {
  if (typeof window === 'undefined') return false
  const albums = getSavedAlbums()
  return albums.some(a => String(a.id) === String(albumId))
}

export function toggleSaveAlbum(album: { id: string; title: string; subtitle: string; image?: string; href?: string }): boolean {
  if (typeof window === 'undefined') return false
  try {
    const albums = getSavedAlbums()
    const albumIdStr = String(album.id)
    const index = albums.findIndex(a => String(a.id) === albumIdStr)
    let isSavedNow = false
    
    if (index > -1) {
      albums.splice(index, 1)
    } else {
      albums.push({
        id: albumIdStr,
        title: album.title,
        subtitle: album.subtitle,
        image: album.image,
        href: album.href || `/album/${albumIdStr}`,
        type: 'album'
      })
      isSavedNow = true
    }
    
    localStorage.setItem('vw_saved_albums', JSON.stringify(albums))
    // Trigger global event for components to sync instantly
    window.dispatchEvent(new Event('vw_albums_updated'))
    return isSavedNow
  } catch (e) {
    return false
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  const initialTrack = SAMPLE_TRACKS[0]
  const initialLiked = initialTrack ? isTrackLiked(initialTrack.id) : false

  return {
    currentTrack: initialTrack,
    isPlaying: false,
    progress: 32,
    volume: 75,
    isMuted: false,
    isFullPlayer: false,
    queue: SAMPLE_TRACKS,
    isQueueOpen: false,
    isLiked: initialLiked,
    isShuffle: false,
    isRepeat: false,

    setTrack: (track) => set({
      currentTrack: track,
      isPlaying: true,
      progress: 0,
      isLiked: isTrackLiked(track.id)
    }),
    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
    setProgress: (progress) => set({ progress }),
    setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
    toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
    toggleFullPlayer: () => set((s) => ({ isFullPlayer: !s.isFullPlayer })),
    toggleLike: () => {
      const { currentTrack } = get()
      if (!currentTrack) return
      const isLikedNow = toggleLikeTrack(currentTrack)
      set({ isLiked: isLikedNow })
    },
    setQueue: (queue) => set({ queue }),
    toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),
    toggleRepeat: () => set((s) => ({ isRepeat: !s.isRepeat })),
    toggleQueue: () => set((s) => ({ isQueueOpen: !s.isQueueOpen })),
    setIsQueueOpen: (isQueueOpen) => set({ isQueueOpen }),

    nextTrack: () => {
      const { queue, currentTrack, isShuffle } = get()
      if (!currentTrack || queue.length === 0) return
      let next: Track
      if (isShuffle) {
        const remaining = queue.filter(t => t.id !== currentTrack.id)
        if (remaining.length > 0) {
          next = remaining[Math.floor(Math.random() * remaining.length)]
        } else {
          next = currentTrack
        }
      } else {
        const idx = queue.findIndex((t) => t.id === currentTrack.id)
        next = queue[(idx + 1) % queue.length]
      }
      set({ currentTrack: next, isPlaying: true, progress: 0, isLiked: isTrackLiked(next.id) })
    },

    prevTrack: () => {
      const { queue, currentTrack, isShuffle } = get()
      if (!currentTrack || queue.length === 0) return
      let prev: Track
      if (isShuffle) {
        const remaining = queue.filter(t => t.id !== currentTrack.id)
        if (remaining.length > 0) {
          prev = remaining[Math.floor(Math.random() * remaining.length)]
        } else {
          prev = currentTrack
        }
      } else {
        const idx = queue.findIndex((t) => t.id === currentTrack.id)
        prev = queue[(idx - 1 + queue.length) % queue.length]
      }
      set({ currentTrack: prev, isPlaying: true, progress: 0, isLiked: isTrackLiked(prev.id) })
    },
  }
})
