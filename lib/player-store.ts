"use client"

import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumArt: string
  duration: number // seconds
  url: string
  lyrics?: string
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number // 0-100
  volume: number // 0-100
  isMuted: boolean
  isFullPlayer: boolean
  queue: Track[]
  isLiked: boolean
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

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: SAMPLE_TRACKS[0],
  isPlaying: false,
  progress: 32,
  volume: 75,
  isMuted: false,
  isFullPlayer: false,
  queue: SAMPLE_TRACKS,
  isLiked: false,

  setTrack: (track) => set({ currentTrack: track, isPlaying: true, progress: 0 }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setProgress: (progress) => set({ progress }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleFullPlayer: () => set((s) => ({ isFullPlayer: !s.isFullPlayer })),
  toggleLike: () => set((s) => ({ isLiked: !s.isLiked })),
  setQueue: (queue) => set({ queue }),

  nextTrack: () => {
    const { queue, currentTrack } = get()
    if (!currentTrack) return
    const idx = queue.findIndex((t) => t.id === currentTrack.id)
    const next = queue[(idx + 1) % queue.length]
    set({ currentTrack: next, isPlaying: true, progress: 0 })
  },

  prevTrack: () => {
    const { queue, currentTrack } = get()
    if (!currentTrack) return
    const idx = queue.findIndex((t) => t.id === currentTrack.id)
    const prev = queue[(idx - 1 + queue.length) % queue.length]
    set({ currentTrack: prev, isPlaying: true, progress: 0 })
  },
}))
