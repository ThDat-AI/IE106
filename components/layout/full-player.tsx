"use client"

import { useEffect } from 'react'
import { usePlayerStore } from '@/lib/player-store'
import {
  X, Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Volume2, VolumeX, Mic2
} from 'lucide-react'

const LYRICS = [
  { time: 0, text: '' },
  { time: 10, text: 'I said, ooh, I\'m blinded by the lights' },
  { time: 14, text: 'No, I can\'t sleep until I feel your touch' },
  { time: 18, text: 'I said, ooh, I\'m drowning in the night' },
  { time: 22, text: 'Oh, when I\'m like this, you\'re the one I trust' },
  { time: 28, text: '' },
  { time: 32, text: 'Hey, hey, hey' },
  { time: 40, text: 'I\'m running out of time' },
  { time: 44, text: '\'Cause I can see the sun light up the sky' },
  { time: 48, text: 'So I hit the road in overdrive, baby, oh' },
  { time: 55, text: '' },
  { time: 60, text: 'The city\'s cold and empty' },
  { time: 64, text: 'No one\'s around to judge me' },
  { time: 68, text: 'I can\'t see clearly when you\'re gone' },
]

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function FullPlayer() {
  const {
    currentTrack, isPlaying, progress, volume, isMuted, isLiked,
    togglePlay, setProgress, toggleMute, toggleFullPlayer, toggleLike,
    nextTrack, prevTrack,
  } = usePlayerStore()

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
  const currentLyricIdx = LYRICS.findLastIndex((l) => elapsed >= l.time)

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ backgroundColor: '#170F23' }}
      role="dialog"
      aria-modal="true"
      aria-label="Full player"
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
          aria-label="Close full player"
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
            className="w-64 h-64 rounded-2xl flex items-center justify-center text-6xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #9B4DE0 0%, #2A1F3D 100%)',
              boxShadow: '0 24px 64px rgba(155,77,224,0.25)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {currentTrack.title.charAt(0)}
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
            aria-label={isLiked ? 'Unlike' : 'Like'}
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
            <button className="transition-vw hover:opacity-80" aria-label="Shuffle" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Shuffle size={18} />
            </button>
            <button onClick={prevTrack} className="transition-vw hover:opacity-80" aria-label="Previous" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-vw hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#9B4DE0', boxShadow: '0 0 24px rgba(155,77,224,0.35)' }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={22} className="text-white" fill="white" />
                : <Play size={22} className="text-white" fill="white" style={{ marginLeft: 2 }} />
              }
            </button>
            <button onClick={nextTrack} className="transition-vw hover:opacity-80" aria-label="Next" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <SkipForward size={24} />
            </button>
            <button className="transition-vw hover:opacity-80" aria-label="Repeat" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Repeat size={18} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-full">
            <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} style={{ color: 'rgba(255,255,255,0.45)' }}>
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
        <div className="flex-1 max-w-md pt-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-8">
            <Mic2 size={16} style={{ color: '#9B4DE0' }} />
            <span className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Lyrics
            </span>
          </div>

          <div className="space-y-5">
            {LYRICS.filter(l => l.text).map((line, i) => {
              const isCurrentLine = LYRICS.findLastIndex(l => elapsed >= l.time) === LYRICS.indexOf(line)
              return (
                <p
                  key={i}
                  className="font-display text-xl font-semibold transition-all duration-300"
                  style={{
                    color: isCurrentLine ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.25)',
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

      {/* Backdrop click */}
      <div className="absolute inset-0 -z-10" onClick={toggleFullPlayer} aria-hidden="true" />
    </div>
  )
}
