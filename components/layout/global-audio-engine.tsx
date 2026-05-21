"use client"

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/lib/player-store'

export default function GlobalAudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setProgress,
    nextTrack,
  } = usePlayerStore()

  // Sync isPlaying & source
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Handle autoplay policy restriction
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrack])

  // Sync volume & mute
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  // Handle custom seek event
  useEffect(() => {
    function onSeek(e: Event) {
      const customEvent = e as CustomEvent
      if (customEvent.detail !== undefined && audioRef.current && audioRef.current.duration) {
        const val = customEvent.detail
        const time = (val / 100) * audioRef.current.duration
        audioRef.current.currentTime = time
      }
    }
    window.addEventListener('vw_seek', onSeek)
    return () => window.removeEventListener('vw_seek', onSeek)
  }, [])

  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentTrack || !audioRef.current.duration) return
    const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
    if (!isNaN(currentProgress)) {
      setProgress(currentProgress)
    }
  }

  if (!currentTrack) return null

  return (
    <audio
      ref={audioRef}
      src={currentTrack.url}
      onTimeUpdate={handleTimeUpdate}
      onEnded={nextTrack}
    />
  )
}
