"use client"

import { useEffect, useMemo, useState } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  X, Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Volume2, VolumeX, Mic2
} from 'lucide-react'
import { getMockLyrics, fetchLyrics } from '@/lib/music-api'

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function parseLyrics(lyricStr: string) {
  const lines = lyricStr.split('\n')
  return lines.map(line => {
    const match = line.match(/\[(\d+):(\d+(\.\d+)?)\]\s*(.*)/)
    if (match) {
      const mins = parseInt(match[1])
      const secs = parseFloat(match[2])
      return { time: mins * 60 + secs, text: match[4] }
    }
    const cleanText = line.trim()
    if (cleanText) {
      return { time: -1, text: cleanText }
    }
    return null
  }).filter((l): l is { time: number; text: string } => l !== null)
}

export default function FullPlayer() {
  const { t } = useTranslation()
  const {
    currentTrack, isPlaying, progress, volume, isMuted, isLiked,
    togglePlay, setProgress, toggleMute, toggleFullPlayer, toggleLike,
    nextTrack, prevTrack,
  } = usePlayerStore()

  const [realLyrics, setRealLyrics] = useState<string | null>(null)
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false)

  useEffect(() => {
    if (currentTrack) {
      setIsLoadingLyrics(true)
      setRealLyrics(null)
      fetchLyrics(currentTrack.artist, currentTrack.title).then(l => {
        setRealLyrics(l)
        setIsLoadingLyrics(false)
      }).catch(() => {
        setIsLoadingLyrics(false)
      })
    }
  }, [currentTrack])

  const lyrics = useMemo(() => {
    if (!currentTrack) return []
    const rawLyrics = realLyrics || getMockLyrics(currentTrack.title, currentTrack.artist)
    return parseLyrics(rawLyrics)
  }, [currentTrack, realLyrics])

  const hasTimestamps = useMemo(() => lyrics.some(l => l.time >= 0), [lyrics])

  // Esc key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') toggleFullPlayer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleFullPlayer])

  if (!currentTrack) return null

  const elapsed = Math.round((progress / 100) * currentTrack.duration)
  const currentLyricIdx = hasTimestamps
    ? lyrics.findLastIndex((l) => l.time >= 0 && elapsed >= l.time)
    : -1

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ backgroundColor: '#170F23' }}
      role="dialog"
      aria-modal="true"
      aria-label={t.openFullPlayer}
    >
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(155,77,224,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Close */}
      <div className="relative flex justify-end p-6">
        <button
          onClick={toggleFullPlayer}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-vw hover:bg-white/10"
          aria-label={t.closeFullPlayer}
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex items-start justify-center gap-20 px-16 overflow-hidden">
        {/* Album art + controls */}
        <div className="flex flex-col items-center gap-8 pt-4 w-80 shrink-0">
          {/* Album art */}
          <div
            className="w-64 h-64 rounded-2xl flex items-center justify-center text-6xl font-bold overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
              boxShadow: '0 24px 64px rgba(155,77,224,0.25)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {currentTrack.albumArt ? (
              <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              currentTrack.title.charAt(0)
            )}
          </div>

          {/* Track info */}
          <div className="text-center">
            <h2
              className="font-display text-2xl font-semibold"
              style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
            >
              {currentTrack.title}
            </h2>
            <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {currentTrack.artist}
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {currentTrack.album}
            </p>
          </div>

          {/* Like */}
          <button
            onClick={toggleLike}
            aria-label={isLiked ? t.unlike : t.like}
            aria-pressed={isLiked}
            className="transition-vw"
            style={{ color: isLiked ? '#9B4DE0' : 'rgba(255,255,255,0.45)' }}
          >
            <Heart size={22} fill={isLiked ? '#9B4DE0' : 'none'} />
          </button>

          {/* Progress */}
          <div className="w-full flex items-center gap-3">
            <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {formatTime(elapsed)}
            </span>
            <div className="relative flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${progress}%`, background: 'linear-gradient(to right, #9B4DE0, #b96ff0)' }}
              />
              <input
                type="range" min="0" max="100" value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                aria-label="Playback progress"
              />
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {formatTime(currentTrack.duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button className="transition-vw hover:opacity-80" aria-label={t.shuffle} style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Shuffle size={18} />
            </button>
            <button onClick={prevTrack} className="transition-vw hover:opacity-80" aria-label={t.previous} style={{ color: 'rgba(255,255,255,0.75)' }}>
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-vw hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#9B4DE0', boxShadow: '0 0 24px rgba(155,77,224,0.35)' }}
              aria-label={isPlaying ? t.pause : t.play}
            >
              {isPlaying
                ? <Pause size={22} className="text-white" fill="white" />
                : <Play size={22} className="text-white" fill="white" style={{ marginLeft: 2 }} />
              }
            </button>
            <button onClick={nextTrack} className="transition-vw hover:opacity-80" aria-label={t.next} style={{ color: 'rgba(255,255,255,0.75)' }}>
              <SkipForward size={24} />
            </button>
            <button className="transition-vw hover:opacity-80" aria-label={t.repeat} style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Repeat size={18} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-full">
            <button onClick={toggleMute} aria-label={isMuted ? t.unmute : t.mute} style={{ color: 'rgba(255,255,255,0.45)' }}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="relative flex-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${volume}%`, background: 'linear-gradient(to right, #9B4DE0, #b96ff0)' }}
              />
            </div>
          </div>
        </div>

        {/* Lyrics panel */}
        <div className="flex-1 max-w-md pt-4 overflow-hidden h-full flex flex-col">
          <div className="flex items-center gap-2 mb-8 shrink-0">
            <Mic2 size={16} style={{ color: '#9B4DE0' }} />
            <span className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {isLoadingLyrics ? t.searchingLyrics : t.lyrics}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            <div className="space-y-5">
              {lyrics.map((line, i) => {
                const isCurrentLine = hasTimestamps && currentLyricIdx === i
                return (
                  <p
                    key={i}
                    className="font-display text-xl font-semibold transition-all duration-300"
                    style={{
                      color: isCurrentLine || (!hasTimestamps && !realLyrics) || (realLyrics && !hasTimestamps)
                        ? 'rgba(255,255,255,0.95)'
                        : 'rgba(255,255,255,0.25)',
                      letterSpacing: '-0.3px',
                      lineHeight: 1.3,
                      transform: isCurrentLine ? 'scale(1.03)' : 'scale(1)',
                      transformOrigin: 'left center',
                    }}
                  >
                    {line.text}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop click */}
      <div className="absolute inset-0 -z-10" onClick={toggleFullPlayer} aria-hidden="true" />
    </div>
  )
}
