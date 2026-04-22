"use client"

import { usePlayerStore } from '@/lib/player-store'
import { useTranslation } from '@/lib/i18n-store'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Shuffle, Repeat, ListMusic, Maximize2, Mic2
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import FullPlayer from './full-player'

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function BottomPlayer() {
  const { t } = useTranslation()
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    currentTrack, isPlaying, progress, volume, isMuted, isLiked,
    togglePlay, setProgress, setVolume, toggleMute, toggleFullPlayer, toggleLike,
    nextTrack, prevTrack, isFullPlayer,
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
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center px-6 h-20"
        style={{
          backgroundColor: '#1F162E',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
        role="region"
        aria-label="Music player"
      >
        {/* Track info */}
        <div className="flex items-center gap-3 w-64 shrink-0">
          <button
            onClick={toggleFullPlayer}
            className="relative w-12 h-12 rounded-lg overflow-hidden group transition-vw hover:scale-105 shrink-0"
            aria-label={t.openFullPlayer}
          >
            <div
              className="w-full h-full rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2A1F3D' }}
            >
              {currentTrack.albumArt ? (
                <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center text-lg font-bold"
                  style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)', color: 'rgba(255,255,255,0.7)' }}
                >
                  {currentTrack.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-vw flex items-center justify-center rounded-lg">
              <Maximize2 size={14} className="text-white" />
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-medium truncate"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              {currentTrack.title}
            </div>
            <div
              className="text-xs truncate mt-0.5"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {currentTrack.artist}
            </div>
          </div>

          <button
            onClick={toggleLike}
            aria-label={isLiked ? t.unlikeSong : t.likeSong}
            aria-pressed={isLiked}
            className="p-1.5 transition-vw"
            style={{
              color: isLiked ? '#9B4DE0' : 'rgba(255,255,255,0.45)',
              transform: 'scale(1)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart size={17} fill={isLiked ? '#9B4DE0' : 'none'} />
          </button>
        </div>

        {/* Center controls + progress */}
        <div className="flex-1 flex flex-col items-center gap-2 px-8">
          {/* Controls */}
          <div className="flex items-center gap-5">
            <button
              className="transition-vw hover:opacity-80"
              aria-label={t.shuffle}
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              <Shuffle size={16} />
            </button>

            <button
              onClick={prevTrack}
              className="transition-vw hover:opacity-80"
              aria-label={t.previous}
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-vw hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#9B4DE0' }}
              aria-label={isPlaying ? t.pause : t.play}
            >
              {isPlaying
                ? <Pause size={16} className="text-white" fill="white" />
                : <Play size={16} className="text-white" fill="white" style={{ marginLeft: 2 }} />
              }
            </button>

            <button
              onClick={nextTrack}
              className="transition-vw hover:opacity-80"
              aria-label={t.next}
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <SkipForward size={20} />
            </button>

            <button
              className="transition-vw hover:opacity-80"
              aria-label={t.repeat}
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 w-full max-w-sm">
            <span
              className="text-[11px] tabular-nums shrink-0"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              aria-label={`Elapsed time: ${formatTime(elapsed)}`}
            >
              {formatTime(elapsed)}
            </span>

            <div className="relative flex-1 h-1 group cursor-pointer">
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              />
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #9B4DE0, #b96ff0)',
                }}
                aria-hidden="true"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: '100%' }}
                aria-label="Playback progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-valuetext={`${formatTime(elapsed)} of ${formatTime(currentTrack.duration)}`}
              />
            </div>

            <span
              className="text-[11px] tabular-nums shrink-0"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              aria-label={`Total duration: ${formatTime(currentTrack.duration)}`}
            >
              {formatTime(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* Right: volume + queue */}
        <div className="flex items-center gap-3 w-48 justify-end shrink-0">
          <button
            onClick={toggleFullPlayer}
            className="transition-vw hover:opacity-80"
            aria-label={t.lyrics}
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <Mic2 size={16} />
          </button>

          <button
            className="transition-vw hover:opacity-80"
            aria-label={t.queue}
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <ListMusic size={16} />
          </button>

          <button
            onClick={toggleMute}
            className="transition-vw hover:opacity-80"
            aria-label={isMuted ? t.unmute : t.mute}
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="relative w-20 h-1 group cursor-pointer">
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            />
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: isMuted ? '0%' : `${volume}%`,
                background: 'linear-gradient(to right, #9B4DE0, #b96ff0)',
              }}
              aria-hidden="true"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: '100%' }}
              aria-label={t.volumeLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={isMuted ? 0 : volume}
            />
          </div>
        </div>
      </div>
    </>
  )
}
