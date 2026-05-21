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
  genre?: string
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
  isRepeat: 'none' | 'all' | 'one'
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
  playNext: (trackOrTracks: Track | Track[]) => void
  addToQueue: (trackOrTracks: Track | Track[]) => void
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

export function getFollowedArtists(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('vw_followed_artists')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function isArtistFollowed(artistName: string): boolean {
  if (typeof window === 'undefined') return false
  const followed = getFollowedArtists()
  return followed.includes(artistName)
}

export function toggleFollowArtist(artistName: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const followed = getFollowedArtists()
    const index = followed.indexOf(artistName)
    let isFollowingNow = false
    if (index > -1) {
      followed.splice(index, 1)
    } else {
      followed.push(artistName)
      isFollowingNow = true
    }
    localStorage.setItem('vw_followed_artists', JSON.stringify(followed))
    // Trigger global event for components to sync instantly
    window.dispatchEvent(new CustomEvent('vw_following_updated', { 
      detail: { artistName, isFollowing: isFollowingNow } 
    }))
    return isFollowingNow
  } catch (e) {
    return false
  }
}

export interface BlockedItem {
  id: string
  title: string
  subtitle: string
  image?: string
  type: 'track' | 'album' | 'artist'
  blockedAt: string
}

export function getBlockedTracks(): BlockedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('vw_blocked_tracks')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function getBlockedAlbums(): BlockedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('vw_blocked_albums')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function getBlockedArtists(): BlockedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('vw_blocked_artists')
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function isTrackBlocked(trackId: string): boolean {
  if (typeof window === 'undefined') return false
  return getBlockedTracks().some(t => t.id === trackId)
}

export function isAlbumBlocked(albumId: string): boolean {
  if (typeof window === 'undefined') return false
  return getBlockedAlbums().some(a => a.id === albumId)
}

export function isArtistBlocked(artistName: string): boolean {
  if (typeof window === 'undefined') return false
  return getBlockedArtists().some(a => a.title.toLowerCase() === artistName.toLowerCase())
}

export function isSongBlocked(track: Track): boolean {
  if (!track) return false
  const blockedTracks = getBlockedTracks()
  const blockedArtists = getBlockedArtists()
  const blockedAlbums = getBlockedAlbums()
  
  const isTrackBlocked = blockedTracks.some(t => t.id === track.id)
  const isArtistBlocked = blockedArtists.some(a => a.title.toLowerCase() === track.artist.toLowerCase())
  const isAlbumBlocked = blockedAlbums.some(al => al.title.toLowerCase() === track.album.toLowerCase())
  
  return isTrackBlocked || isArtistBlocked || isAlbumBlocked
}

export function toggleBlockTrack(track: { id: string; title: string; artist: string; albumArt?: string }): boolean {
  if (typeof window === 'undefined') return false
  try {
    const blocked = getBlockedTracks()
    const index = blocked.findIndex(t => t.id === track.id)
    let isBlockedNow = false
    if (index > -1) {
      blocked.splice(index, 1)
    } else {
      blocked.push({
        id: track.id,
        title: track.title,
        subtitle: track.artist,
        image: track.albumArt,
        type: 'track',
        blockedAt: new Date().toISOString()
      })
      isBlockedNow = true
    }
    localStorage.setItem('vw_blocked_tracks', JSON.stringify(blocked))
    window.dispatchEvent(new CustomEvent('vw_blocked_updated', { detail: { type: 'track', id: track.id, isBlocked: isBlockedNow } }))
    return isBlockedNow
  } catch (e) {
    return false
  }
}

export function toggleBlockAlbum(album: { id: string; title: string; artist: string; albumArt?: string }): boolean {
  if (typeof window === 'undefined') return false
  try {
    const blocked = getBlockedAlbums()
    const index = blocked.findIndex(a => a.id === album.id)
    let isBlockedNow = false
    if (index > -1) {
      blocked.splice(index, 1)
    } else {
      blocked.push({
        id: album.id,
        title: album.title,
        subtitle: album.artist,
        image: album.albumArt,
        type: 'album',
        blockedAt: new Date().toISOString()
      })
      isBlockedNow = true
    }
    localStorage.setItem('vw_blocked_albums', JSON.stringify(blocked))
    window.dispatchEvent(new CustomEvent('vw_blocked_updated', { detail: { type: 'album', id: album.id, isBlocked: isBlockedNow } }))
    return isBlockedNow
  } catch (e) {
    return false
  }
}

export function toggleBlockArtist(artist: { id?: string; name: string; genre?: string; image?: string }): boolean {
  if (typeof window === 'undefined') return false
  try {
    const blocked = getBlockedArtists()
    const index = blocked.findIndex(a => a.title.toLowerCase() === artist.name.toLowerCase())
    let isBlockedNow = false
    if (index > -1) {
      blocked.splice(index, 1)
    } else {
      blocked.push({
        id: artist.id || String(Date.now()),
        title: artist.name,
        subtitle: artist.genre || 'Nghệ sĩ',
        image: artist.image,
        type: 'artist',
        blockedAt: new Date().toISOString()
      })
      isBlockedNow = true
    }
    localStorage.setItem('vw_blocked_artists', JSON.stringify(blocked))
    window.dispatchEvent(new CustomEvent('vw_blocked_updated', { detail: { type: 'artist', name: artist.name, isBlocked: isBlockedNow } }))
    return isBlockedNow
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
    isRepeat: 'none',

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
    playNext: (trackOrTracks) => {
      const { queue, currentTrack } = get()
      const tracksToAdd = Array.isArray(trackOrTracks) ? trackOrTracks : [trackOrTracks]
      if (tracksToAdd.length === 0) return

      const trackIdsToAdd = new Set(tracksToAdd.map(t => t.id))
      const cleanedQueue = queue.filter(t => !trackIdsToAdd.has(t.id))

      if (!currentTrack) {
        set({
          queue: tracksToAdd,
          currentTrack: tracksToAdd[0],
          isPlaying: true,
          progress: 0,
          isLiked: isTrackLiked(tracksToAdd[0].id)
        })
        return
      }

      const currentIndex = cleanedQueue.findIndex(t => t.id === currentTrack.id)
      const newQueue = [...cleanedQueue]
      if (currentIndex !== -1) {
        newQueue.splice(currentIndex + 1, 0, ...tracksToAdd)
      } else {
        newQueue.unshift(...tracksToAdd)
      }
      set({ queue: newQueue })
    },
    addToQueue: (trackOrTracks) => {
      const { queue, currentTrack } = get()
      const tracksToAdd = Array.isArray(trackOrTracks) ? trackOrTracks : [trackOrTracks]
      if (tracksToAdd.length === 0) return

      const trackIdsToAdd = new Set(tracksToAdd.map(t => t.id))
      const cleanedQueue = queue.filter(t => !trackIdsToAdd.has(t.id))

      if (!currentTrack) {
        set({
          queue: tracksToAdd,
          currentTrack: tracksToAdd[0],
          isPlaying: true,
          progress: 0,
          isLiked: isTrackLiked(tracksToAdd[0].id)
        })
        return
      }

      set({ queue: [...cleanedQueue, ...tracksToAdd] })
    },
    toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),
    toggleRepeat: () => set((s) => ({
      isRepeat: s.isRepeat === 'none' ? 'all' : s.isRepeat === 'all' ? 'one' : 'none'
    })),
    toggleQueue: () => set((s) => ({ isQueueOpen: !s.isQueueOpen })),
    setIsQueueOpen: (isQueueOpen) => set({ isQueueOpen }),

    nextTrack: () => {
      const { queue, currentTrack, isShuffle } = get()
      if (!currentTrack || queue.length === 0) return

      const unblockedQueue = queue.filter(t => !isSongBlocked(t))
      if (unblockedQueue.length === 0) {
        set({ isPlaying: false })
        return
      }

      let next: Track
      if (isShuffle) {
        const remaining = unblockedQueue.filter(t => t.id !== currentTrack.id)
        if (remaining.length > 0) {
          next = remaining[Math.floor(Math.random() * remaining.length)]
        } else {
          next = unblockedQueue[0]
        }
      } else {
        const origIdx = queue.findIndex((t) => t.id === currentTrack.id)
        if (get().isRepeat === 'none' && origIdx === queue.length - 1) {
          set({ isPlaying: false, progress: 0 })
          return
        }
        let foundNext = false
        let nextIdx = origIdx
        for (let i = 1; i <= queue.length; i++) {
          const checkIdx = (origIdx + i) % queue.length
          if (!isSongBlocked(queue[checkIdx])) {
            nextIdx = checkIdx
            foundNext = true
            break
          }
        }
        next = queue[nextIdx]
        if (!foundNext) {
          set({ isPlaying: false })
          return
        }
      }
      set({ currentTrack: next, isPlaying: true, progress: 0, isLiked: isTrackLiked(next.id) })
    },

    prevTrack: () => {
      const { queue, currentTrack, isShuffle } = get()
      if (!currentTrack || queue.length === 0) return

      const unblockedQueue = queue.filter(t => !isSongBlocked(t))
      if (unblockedQueue.length === 0) {
        set({ isPlaying: false })
        return
      }

      let prev: Track
      if (isShuffle) {
        const remaining = unblockedQueue.filter(t => t.id !== currentTrack.id)
        if (remaining.length > 0) {
          prev = remaining[Math.floor(Math.random() * remaining.length)]
        } else {
          prev = unblockedQueue[0]
        }
      } else {
        const origIdx = queue.findIndex((t) => t.id === currentTrack.id)
        let foundPrev = false
        let prevIdx = origIdx
        for (let i = 1; i <= queue.length; i++) {
          const checkIdx = (origIdx - i + queue.length) % queue.length
          if (!isSongBlocked(queue[checkIdx])) {
            prevIdx = checkIdx
            foundPrev = true
            break
          }
        }
        prev = queue[prevIdx]
        if (!foundPrev) {
          set({ isPlaying: false })
          return
        }
      }
      set({ currentTrack: prev, isPlaying: true, progress: 0, isLiked: isTrackLiked(prev.id) })
    },
  }
})
