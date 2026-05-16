"use client"

import { useEffect, useMemo, useState } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  X, Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Volume2, VolumeX, Mic2, Maximize2
} from 'lucide-react'
import { getMockLyrics, fetchLyrics } from '@/lib/music-api'
import { cn } from '@/lib/utils'

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
      className="fixed inset-0 z-[100] flex flex-col bg-[#0A0A0B] overflow-hidden animate-in fade-in zoom-in-95 duration-500"
      role="dialog"
      aria-modal="true"
      aria-label={t.openFullPlayer}
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 blur-[120px] transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at 20% 30%, #9B4DE0 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, #6366F1 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-0 bg-[#0A0A0B]/60 backdrop-blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Maximize2 size={18} className="text-white/70" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Playing From</p>
            <p className="text-xs text-white/80 font-medium">{currentTrack.album || 'Unknown Album'}</p>
          </div>
        </div>
        <button
          onClick={toggleFullPlayer}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110 active:scale-95 text-white/60 hover:text-white"
          aria-label={t.closeFullPlayer}
        >
          <X size={24} />
        </button>
      </header>

      {/* Content */}
      <main className="relative flex-1 flex items-center justify-center gap-24 px-20 z-10 overflow-hidden">
        {/* Left: Album Art + Basic Controls */}
        <div className="flex flex-col items-center gap-10 w-[400px] shrink-0 animate-in slide-in-from-left-8 duration-700 delay-100">
          {/* Album Art Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-vw-purple/30 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div
              className="relative w-[360px] h-[360px] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #1F162E 0%, #0A0A0B 100%)',
              }}
            >
              {currentTrack.albumArt ? (
                <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-white/10">
                  {currentTrack.title.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info + Like */}
          <div className="w-full flex items-center justify-between px-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-4xl font-bold text-white tracking-tight leading-tight truncate">
                {currentTrack.title}
              </h2>
              <p className="font-sans text-xl font-medium text-white/50 mt-2 tracking-wide truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={toggleLike}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/5 active:scale-90",
                isLiked ? "text-red-500" : "text-white/30 hover:text-white/60"
              )}
              aria-label={isLiked ? t.unlike : t.like}
            >
              <Heart size={28} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
            </button>
          </div>

          {/* Progress Section */}
          <div className="w-full space-y-4">
            <div className="relative h-2 w-full flex items-center group/progress cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-white/10" />
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #9B4DE0 0%, #6366F1 100%)',
                  boxShadow: '0 0 20px rgba(155,77,224,0.4)'
                }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
              <input
                type="range" min="0" max="100" value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Playback progress"
              />
            </div>
            <div className="flex justify-between text-[13px] font-medium text-white/30 tabular-nums">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-10">
            <button className="text-white/30 hover:text-white/80 transition-colors" aria-label={t.shuffle}>
              <Shuffle size={20} />
            </button>
            <button onClick={prevTrack} className="text-white/80 hover:text-white transition-all hover:scale-110 active:scale-90" aria-label={t.previous}>
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-white text-[#0A0A0B] hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]",
                isPlaying && "animate-breathing"
              )}
              aria-label={isPlaying ? t.pause : t.play}
            >
              {isPlaying
                ? <Pause size={32} fill="currentColor" />
                : <Play size={32} fill="currentColor" className="ml-1" />
              }
            </button>
            <button onClick={nextTrack} className="text-white/80 hover:text-white transition-all hover:scale-110 active:scale-90" aria-label={t.next}>
              <SkipForward size={32} fill="currentColor" />
            </button>
            <button className="text-white/30 hover:text-white/80 transition-colors" aria-label={t.repeat}>
              <Repeat size={20} />
            </button>
          </div>
        </div>

        {/* Right: Lyrics Panel */}
        <div className="flex-1 max-w-2xl h-full flex flex-col pt-10 animate-in slide-in-from-right-8 duration-700 delay-200">
          <div className="flex items-center gap-3 mb-10 shrink-0">
            <div className="w-8 h-8 rounded-full bg-vw-purple/20 flex items-center justify-center">
              <Mic2 size={16} className="text-vw-purple" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              {isLoadingLyrics ? t.searchingLyrics : t.lyrics}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-64">
            <div className="space-y-8">
              {lyrics.length > 0 ? (
                lyrics.map((line, i) => {
                  const isCurrentLine = hasTimestamps && currentLyricIdx === i
                  const isPastLine = hasTimestamps && currentLyricIdx > i
                  return (
                    <p
                      key={i}
                      className={cn(
                        "font-display text-4xl font-bold transition-all duration-500 cursor-default",
                        isCurrentLine 
                          ? "text-white scale-105 origin-left drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                          : isPastLine 
                            ? "text-white/30" 
                            : "text-white/10 hover:text-white/30"
                      )}
                      style={{
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                      }}
                    >
                      {line.text}
                    </p>
                  )
                })
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 font-display text-2xl italic">
                  No lyrics available for this track
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Additional Info */}
      <footer className="relative h-24 flex items-center justify-between px-16 z-10 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group/vol cursor-pointer">
            <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="relative w-32 h-1.5 flex items-center">
              <div className="absolute inset-0 rounded-full bg-white/10" />
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-white/80"
                style={{ width: isMuted ? '0%' : `${volume}%` }}
              />
              <input
                type="range" min="0" max="100" value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <p className="text-[11px] text-white/20 uppercase tracking-widest font-medium">
             Audio Quality: Lossless 24-bit / 48kHz
           </p>
        </div>
      </footer>

      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={toggleFullPlayer} aria-hidden="true" />
    </div>
  )
}
