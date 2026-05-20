"use client"

import { useEffect, useMemo, useState, useRef } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  X, Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Volume2, VolumeX, Mic2, Maximize2,
  Check, Music, Disc, Sparkles, Sliders, Info
} from 'lucide-react'
import { getMockLyrics, fetchLyrics } from '@/lib/music-api'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
    nextTrack, prevTrack, isShuffle, toggleShuffle,
    isRepeat, toggleRepeat, setVolume
  } = usePlayerStore()

  const [realLyrics, setRealLyrics] = useState<string | null>(null)
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false)
  const activeLyricRef = useRef<HTMLParagraphElement | null>(null)

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

  const artistSlug = currentTrack.artist.toLowerCase().replace(/\s+/g, '-')
  const artistUrl = `/artist/${encodeURIComponent(artistSlug)}${currentTrack.artistId ? `?id=${currentTrack.artistId}` : ''}`

  const elapsed = Math.round((progress / 100) * currentTrack.duration)
  const currentLyricIdx = hasTimestamps
    ? lyrics.findLastIndex((l) => l.time >= 0 && elapsed >= l.time)
    : -1

  // Auto scroll current lyric line to center of scroll container
  useEffect(() => {
    if (activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }, [currentLyricIdx])

  const handleSliderChange = (val: number) => {
    setProgress(val)
    window.dispatchEvent(new CustomEvent('vw_seek', { detail: val }))
  }

  const handleLyricClick = (time: number) => {
    if (time >= 0 && currentTrack) {
      const percent = (time / currentTrack.duration) * 100
      setProgress(percent)
      window.dispatchEvent(new CustomEvent('vw_seek', { detail: percent }))
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#070709] overflow-hidden animate-in fade-in zoom-in-95 duration-500"
      role="dialog"
      aria-modal="true"
      aria-label={t.openFullPlayer}
    >
      {/* Inline styles for custom premium effects & animations */}
      <style jsx global>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aurora1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-50px, 40px) scale(0.95); }
          66% { transform: translate(40px, -30px) scale(1.2); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.1); }
        }
        @keyframes visualizerBar {
          0%, 100% { height: 4px; }
          50% { height: 24px; }
        }
        .animate-spin-slow {
          animation: spinSlow 15s linear infinite;
        }
        .animate-aurora-1 {
          animation: aurora1 25s ease-in-out infinite;
        }
        .animate-aurora-2 {
          animation: aurora2 30s ease-in-out infinite;
        }
        .animate-aurora-3 {
          animation: aurora3 22s ease-in-out infinite;
        }
        .animate-visualizer-bar {
          animation: visualizerBar 1.2s ease-in-out infinite;
        }
        /* Custom premium scrollbar styling */
        .premium-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .premium-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
        }
        .premium-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Height-aware media queries to prevent clipping on short viewports */
        @media (max-height: 850px) {
          .sleeve-container {
            width: 280px !important;
            height: 280px !important;
          }
          .vinyl-record {
            width: 256px !important;
            height: 256px !important;
            top: 12px !important;
            left: 12px !important;
          }
          .vinyl-record-label {
            inset: 80px !important;
          }
        }
        @media (max-height: 720px) {
          .sleeve-container {
            width: 200px !important;
            height: 200px !important;
          }
          .vinyl-record {
            width: 184px !important;
            height: 184px !important;
            top: 8px !important;
            left: 8px !important;
          }
          .vinyl-record-label {
            inset: 58px !important;
          }
          .left-column-container {
            gap: 12px !important;
          }
          .left-column-container h2 {
            font-size: 1.5rem !important;
            line-height: 1.25 !important;
          }
          .left-column-container p {
            font-size: 0.875rem !important;
          }
        }
        @media (max-height: 600px) {
          .sleeve-container {
            width: 160px !important;
            height: 160px !important;
          }
          .vinyl-record {
            width: 148px !important;
            height: 148px !important;
            top: 6px !important;
            left: 6px !important;
          }
          .vinyl-record-label {
            inset: 46px !important;
          }
          .left-column-container {
            gap: 8px !important;
          }
          .left-column-container h2 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>

      {/* Ambient Aurora Stage Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#070709]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/15 rounded-full blur-[140px] animate-aurora-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-[#6366F1]/20 rounded-full blur-[140px] animate-aurora-2" />
        <div className="absolute top-[35%] right-[25%] w-[45%] h-[45%] bg-[#10B981]/10 rounded-full blur-[120px] animate-aurora-3" />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[90px]" />
      </div>

      {/* Top Header */}
      <header className="relative flex items-center justify-between p-6 sm:p-8 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
            <Disc size={18} className={cn("text-white/70", isPlaying && "animate-spin-slow")} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Playing From</p>
            <p className="text-xs text-white/80 font-medium tracking-wide">{currentTrack.album || 'Single Album'}</p>
          </div>
        </div>
        <button
          onClick={toggleFullPlayer}
          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 text-white/60 hover:text-white cursor-pointer shadow-lg bg-black/20 backdrop-blur-md"
          aria-label={t.closeFullPlayer}
        >
          <X size={20} />
        </button>
      </header>

      {/* Content */}
      <main className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6 sm:px-12 lg:px-20 z-10 overflow-hidden max-h-[calc(100vh-90px)] pb-8">
        
        {/* Left Panel: Sleeve cover & player control panel */}
        <div className="left-column-container flex flex-col items-center gap-6 lg:gap-8 w-full lg:w-[400px] shrink-0 h-full max-h-[640px] justify-center">
          
          {/* Vinyl & Cover Sleeve Container */}
          <div className="sleeve-container relative group flex items-center justify-center w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[350px] lg:h-[350px] xl:w-[360px] xl:h-[360px] select-none shrink-0">
            {/* Ambient Shadow/Glow behind the sleeve */}
            <div className="absolute inset-6 bg-[#8B5CF6]/30 blur-[60px] opacity-60 group-hover:opacity-85 transition-all duration-700 scale-95 group-hover:scale-105" />

            {/* Vinyl Record (slides out to the right) */}
            <div
              className={cn(
                "vinyl-record absolute top-3 left-3 w-[220px] h-[220px] sm:w-[276px] sm:h-[276px] lg:w-[324px] lg:h-[324px] xl:w-[334px] xl:h-[334px] rounded-full bg-[#111] border-4 border-[#222] shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out select-none",
                isPlaying ? "animate-spin-slow" : "",
                "group-hover:translate-x-[60px] sm:group-hover:translate-x-[75px] group-hover:rotate-12"
              )}
              style={{
                backgroundImage: 'radial-gradient(circle, #2c2c2c 8%, #111 12%, #222 20%, #111 28%, #222 36%, #111 44%, #222 52%, #111 60%, #222 68%, #111 76%, #222 84%, #111 92%)',
                animationPlayState: isPlaying ? 'running' : 'paused',
                zIndex: 1
              }}
            >
              {/* Record Center Label */}
              <div className="vinyl-record-label absolute inset-[68px] sm:inset-[86px] lg:inset-[102px] xl:inset-[105px] rounded-full border border-black/40 overflow-hidden bg-gradient-to-tr from-[#1E1B4B] to-[#4338CA] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                {currentTrack.albumArt ? (
                  <img src={currentTrack.albumArt} alt="" className="w-full h-full object-cover opacity-75" />
                ) : (
                  <div className="text-white/30 text-base font-bold">{currentTrack.title.charAt(0)}</div>
                )}
                {/* Spindle hole */}
                <div className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black border border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>
            </div>

            {/* Cover Sleeve */}
            <div
              className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-500 group-hover:scale-[1.015]"
              style={{
                background: 'linear-gradient(135deg, #1A1A24 0%, #0A0A0F 100%)',
                zIndex: 2
              }}
            >
              {currentTrack.albumArt ? (
                <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover select-none" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl font-bold bg-gradient-to-br from-[#8B5CF6]/20 to-[#6366F1]/20 text-white/20 font-display">
                  {currentTrack.title.charAt(0)}
                </div>
              )}
              {/* Glossy glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
            </div>
          </div>

          {/* Info + Like Panel */}
          <div className="w-full px-2 mt-2 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug break-words drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                  {currentTrack.title}
                </h2>
                <Link
                  href={artistUrl}
                  onClick={toggleFullPlayer}
                  className="flex items-center gap-2 mt-1 hover:text-white transition-colors duration-200 group/artist cursor-pointer"
                >
                  <p className="font-sans text-base sm:text-lg font-semibold text-white/60 group-hover/artist:text-white transition-colors tracking-wide truncate">
                    {currentTrack.artist}
                  </p>
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#10B981] text-black shrink-0" title="Verified Artist">
                    <Check size={10} className="text-black stroke-[4px]" />
                  </span>
                </Link>
              </div>
              <button
                onClick={toggleLike}
                className={cn(
                  "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/5 active:scale-90 cursor-pointer shrink-0 shadow-lg",
                  isLiked ? "text-[#EF4444]" : "text-white/40 hover:text-white/80"
                )}
                aria-label={isLiked ? t.unlike : t.like}
              >
                <Heart size={22} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                {isLiked && (
                  <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#EF4444] shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Progress Slider Section */}
          <div className="w-full space-y-2 shrink-0">
            <div className="relative h-4 w-full flex items-center group/progress cursor-pointer">
              {/* Back track */}
              <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/10 transition-all group-hover/progress:h-2" />
              {/* Filled track */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-all duration-150 group-hover/progress:h-2"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%)',
                  boxShadow: '0 0 15px rgba(139,92,246,0.4)'
                }}
              />
              {/* Thumb handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
              <input
                type="range" min="0" max="100" value={progress}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Playback progress"
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-white/35 tabular-nums tracking-wider uppercase px-0.5">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Playback Controls Panel */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-2 shrink-0">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 border border-white/0 hover:bg-white/5 cursor-pointer active:scale-95",
                isShuffle ? "text-[#8B5CF6] border-white/5 bg-[#8B5CF6]/5" : "text-white/40 hover:text-white/70"
              )}
              aria-label={t.shuffle}
              aria-pressed={isShuffle}
            >
              <Shuffle size={18} />
              {isShuffle && (
                <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_rgba(139,92,246,0.6)] animate-in scale-in duration-300" />
              )}
            </button>

            {/* Prev */}
            <button
              onClick={prevTrack}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-90 cursor-pointer border border-white/0 hover:border-white/5"
              aria-label={t.previous}
            >
              <SkipBack size={22} fill="currentColor" />
            </button>

            {/* Play/Pause Main Hero */}
            <button
              onClick={togglePlay}
              className={cn(
                "w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg",
                "bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] hover:from-[#9D76FC] hover:to-[#787BFE]",
                "text-white shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95",
                isPlaying && "animate-breathing"
              )}
              aria-label={isPlaying ? t.pause : t.play}
            >
              {isPlaying
                ? <Pause size={26} fill="currentColor" />
                : <Play size={26} fill="currentColor" className="ml-1" />
              }
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-90 cursor-pointer border border-white/0 hover:border-white/5"
              aria-label={t.next}
            >
              <SkipForward size={22} fill="currentColor" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 border border-white/0 hover:bg-white/5 cursor-pointer active:scale-95",
                isRepeat ? "text-[#8B5CF6] border-white/5 bg-[#8B5CF6]/5" : "text-white/40 hover:text-white/70"
              )}
              aria-label={t.repeat}
            >
              <Repeat size={18} />
              {isRepeat && (
                <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_rgba(139,92,246,0.6)] animate-in scale-in duration-300" />
              )}
            </button>
          </div>

          {/* Volume Control Row */}
          <div className="flex items-center gap-3 w-full px-4 mt-2 justify-center shrink-0">
            <button
              onClick={toggleMute}
              className="text-white/40 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              aria-label={isMuted ? t.unmute : t.mute}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="relative w-36 h-1 flex items-center cursor-pointer group/vol-slider">
              <div className="absolute left-0 right-0 h-1 rounded-full bg-white/10 group-hover/vol-slider:h-1.5 transition-all" />
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all group-hover/vol-slider:h-1.5"
                style={{
                  width: isMuted ? '0%' : `${volume}%`,
                  background: 'rgba(255, 255, 255, 0.8)',
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg opacity-0 group-hover/vol-slider:opacity-100 transition-opacity duration-200"
                style={{ left: `calc(${isMuted ? 0 : volume}% - 5px)` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label={t.volumeLabel}
              />
            </div>
          </div>

        </div>

        {/* Right Panel: Immersive Glassmorphic Lyrics View */}
        <div className="flex-1 w-full max-w-xl h-full flex flex-col z-10 overflow-hidden min-h-[280px] lg:min-h-[480px]">
          
          {/* Glass Pane container */}
          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-6 sm:p-8 flex flex-col h-full overflow-hidden shadow-2xl relative">
            
            {/* Header elements inside lyrics pane */}
            <div className="flex items-center justify-between mb-6 shrink-0 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                  <Mic2 size={16} className="text-[#8B5CF6]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  {isLoadingLyrics ? t.searchingLyrics : t.lyrics}
                </span>
              </div>
              {lyrics.length > 0 && hasTimestamps && (
                <span className="text-[9px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Interactive
                </span>
              )}
            </div>

            {/* Gradient overlays to fade out lyrics at top and bottom */}
            <div className="absolute top-[80px] left-6 right-6 h-12 bg-gradient-to-b from-[#070709] via-[#070709]/60 to-transparent pointer-events-none z-10 opacity-70" />
            <div className="absolute bottom-6 left-6 right-6 h-20 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent pointer-events-none z-10 opacity-80" />

            {/* Scrollable lyrics core viewport */}
            <div className="flex-1 overflow-y-auto premium-scroll relative px-2 pr-3 pb-36 scroll-smooth">
              <div className="space-y-6 py-12">
                {lyrics.length > 0 ? (
                  lyrics.map((line, i) => {
                    const isCurrentLine = hasTimestamps && currentLyricIdx === i
                    const isPastLine = hasTimestamps && currentLyricIdx > i
                    const isFutureLine = hasTimestamps && currentLyricIdx < i

                    return (
                      <p
                        key={i}
                        ref={isCurrentLine ? activeLyricRef : undefined}
                        onClick={() => handleLyricClick(line.time)}
                        className={cn(
                          "font-display text-xl sm:text-2xl lg:text-3xl font-extrabold transition-all duration-500 ease-out cursor-pointer py-1.5 px-3 rounded-xl flex items-center gap-3 group/line origin-left",
                          isCurrentLine
                            ? "text-white scale-[1.03] drop-shadow-[0_0_20px_rgba(139,92,246,0.6)] bg-white/5 border-l-4 border-[#8B5CF6] pl-3"
                            : isPastLine
                              ? "text-white/30 hover:text-white/50 hover:bg-white/[0.01]"
                              : "text-white/10 hover:text-white/40 hover:bg-white/[0.01]"
                        )}
                        style={{
                          letterSpacing: '-0.02em',
                          lineHeight: 1.3,
                        }}
                      >
                        {hasTimestamps && line.time >= 0 && (
                          <span className="opacity-0 group-hover/line:opacity-100 text-[10px] font-bold text-[#8B5CF6] border border-[#8B5CF6]/30 px-1.5 py-0.5 rounded bg-[#8B5CF6]/5 transition-opacity duration-200 uppercase tracking-widest tabular-nums shrink-0">
                            {formatTime(line.time)}
                          </span>
                        )}
                        <span className="flex-1">{line.text}</span>
                      </p>
                    )
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 font-display py-24 gap-4">
                    <Disc size={40} className="animate-spin-slow text-white/10" />
                    <span className="italic text-base">No lyrics available for this track</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Backdrop click to close overlay */}
      <div className="absolute inset-0 -z-10 cursor-default" onClick={toggleFullPlayer} aria-hidden="true" />
    </div>
  )
}
