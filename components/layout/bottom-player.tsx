"use client"

import { usePlayerStore } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Shuffle, Repeat, ListMusic, Maximize2, Mic2
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import FullPlayer from './full-player'
import { cn } from '@/lib/utils'

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface BottomPlayerProps {
  sidebarCollapsed?: boolean
}

export default function BottomPlayer({ sidebarCollapsed = false }: BottomPlayerProps) {
  const { t } = useTranslation()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const {
    currentTrack, isPlaying, progress, volume, isMuted, isLiked,
    togglePlay, setProgress, setVolume, toggleMute, toggleFullPlayer, toggleLike,
    nextTrack, prevTrack, isFullPlayer, isShuffle, toggleShuffle,
    isRepeat, toggleRepeat,
  } = usePlayerStore()

  // Sync audio element with state
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Handle autoplay policy restriction if needed
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrack])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentTrack) return
    const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
    if (!isNaN(currentProgress)) {
      setProgress(currentProgress)
    }
  }

  const handleSeek = (val: number) => {
    if (!audioRef.current || !currentTrack) return
    const time = (val / 100) * audioRef.current.duration
    audioRef.current.currentTime = time
    setProgress(val)
  }

  if (!currentTrack) return null

  const elapsed = Math.round((progress / 100) * (audioRef.current?.duration || currentTrack.duration))

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        autoPlay={isPlaying}
      />
      {isFullPlayer && <FullPlayer />}

      <div
        suppressHydrationWarning={true}
        className="fixed bottom-0 right-0 z-50 px-4 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all"
        style={{
          left: sidebarCollapsed ? '72px' : '240px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "relative mx-auto max-w-7xl h-24 flex items-center px-6 rounded-2xl transition-all duration-500 overflow-hidden",
            "bg-white/[0.03] backdrop-blur-2xl border border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_48px_rgba(155,77,224,0.15)]",
            isHovered && "border-white/20"
          )}
          role="region"
          aria-label="Music player"
        >
          {/* Aurora Effect Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[200%] bg-vw-purple/30 blur-[100px] animate-pulse rounded-full" />
            <div className="absolute bottom-[-50%] right-[-10%] w-[30%] h-[200%] bg-blue-500/20 blur-[100px] animate-pulse rounded-full" style={{ animationDelay: '1s' }} />
          </div>

          {/* Track info */}
          <div className="flex items-center gap-4 w-1/4 min-w-[240px] z-10">
            <button
              onClick={toggleFullPlayer}
              className="relative group shrink-0"
              aria-label={t.openFullPlayer}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(155,77,224,0.3)] bg-[#1F162E]">
                {currentTrack.albumArt ? (
                  <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xl font-bold"
                    style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #1F162E 100%)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {currentTrack.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                <Maximize2 size={16} className="text-white" />
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-[15px] text-white/95 truncate leading-tight tracking-wide">
                {currentTrack.title}
              </h3>
              <p className="font-sans font-medium text-[13px] text-white/50 truncate mt-0.5 tracking-tight">
                {currentTrack.artist}
              </p>
            </div>

            <button
              onClick={toggleLike}
              aria-label={isLiked ? t.unlikeSong : t.likeSong}
              aria-pressed={isLiked}
              className={cn(
                "relative flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:bg-white/5 active:scale-90",
                isLiked ? "text-[#EF4444]" : "text-white/40 hover:text-white/70"
              )}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
              {isLiked && (
                <span className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-in scale-in duration-300" />
              )}
            </button>
          </div>

          {/* Center controls + progress */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 z-10">
            {/* Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={toggleShuffle}
                className={cn(
                  "relative flex items-center justify-center p-2 rounded-full transition-all duration-300 active:scale-90",
                  isShuffle ? "text-[#9B4DE0]" : "text-white/40 hover:text-white/90"
                )}
                aria-label={t.shuffle}
                aria-pressed={isShuffle}
              >
                <Shuffle size={18} strokeWidth={2} />
                {isShuffle && (
                  <span className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9B4DE0] shadow-[0_0_8px_rgba(155,77,224,0.6)] animate-in scale-in duration-300" />
                )}
              </button>

              <button
                onClick={prevTrack}
                className="text-white/70 hover:text-white transition-colors duration-300 active:scale-90"
                aria-label={t.previous}
              >
                <SkipBack size={24} fill="currentColor" strokeWidth={0} />
              </button>

              <button
                onClick={togglePlay}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-white text-[#121212] hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]",
                  isPlaying && "animate-breathing"
                )}
                aria-label={isPlaying ? t.pause : t.play}
              >
                {isPlaying
                  ? <Pause size={20} fill="currentColor" />
                  : <Play size={20} fill="currentColor" className="ml-1" />
                }
              </button>

              <button
                onClick={nextTrack}
                className="text-white/70 hover:text-white transition-colors duration-300 active:scale-90"
                aria-label={t.next}
              >
                <SkipForward size={24} fill="currentColor" strokeWidth={0} />
              </button>

              <button
                onClick={toggleRepeat}
                className={cn(
                  "relative flex items-center justify-center p-2 rounded-full transition-all duration-300 active:scale-90",
                  isRepeat ? "text-[#9B4DE0]" : "text-white/40 hover:text-white/90"
                )}
                aria-label={t.repeat}
              >
                <Repeat size={18} strokeWidth={2} />
                {isRepeat && (
                  <span className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9B4DE0] shadow-[0_0_8px_rgba(155,77,224,0.6)] animate-in scale-in duration-300" />
                )}
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 w-full max-w-xl group/progress">
              <span className="text-[11px] font-medium text-white/30 tabular-nums w-10 text-right">
                {formatTime(elapsed)}
              </span>

              <div className="relative flex-1 h-1.5 flex items-center cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #9B4DE0 0%, #6366F1 100%)',
                    boxShadow: '0 0 10px rgba(155,77,224,0.3)'
                  }}
                />

                {/* Progress Knob */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Playback progress"
                />
              </div>

              <span className="text-[11px] font-medium text-white/30 tabular-nums w-10">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Right: volume + utilities */}
          <div className="flex items-center gap-4 w-1/4 justify-end min-w-[200px] z-10">
            <button
              onClick={toggleFullPlayer}
              className="p-2 text-white/40 hover:text-white/90 transition-all hover:bg-white/5 rounded-full"
              aria-label={t.lyrics}
            >
              <Mic2 size={18} />
            </button>

            <button
              className="p-2 text-white/40 hover:text-white/90 transition-all hover:bg-white/5 rounded-full"
              aria-label={t.queue}
            >
              <ListMusic size={18} />
            </button>

            <div className="flex items-center gap-2 group/volume ml-2">
              <button
                onClick={toggleMute}
                className="p-2 text-white/60 hover:text-white transition-all rounded-full"
                aria-label={isMuted ? t.unmute : t.mute}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <div className="relative w-24 h-1 flex items-center cursor-pointer overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
                  style={{
                    width: isMuted ? '0%' : `${volume}%`,
                    background: 'rgba(255, 255, 255, 0.8)',
                  }}
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
        </div>
      </div>
    </>
  )
}
