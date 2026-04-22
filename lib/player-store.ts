"use client"

import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumArt: string
  duration: number // seconds
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
}

export const SAMPLE_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    albumArt: '/album-art/blinding-lights.jpg',
    duration: 200,
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    albumArt: '/album-art/levitating.jpg',
    duration: 203,
  },
  {
    id: '3',
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar',
    album: 'Justice',
    albumArt: '/album-art/peaches.jpg',
    duration: 198,
  },
  {
    id: '4',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3',
    albumArt: '/album-art/stay.jpg',
    duration: 141,
  },
  {
    id: '5',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    albumArt: '/album-art/good4u.jpg',
    duration: 178,
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
