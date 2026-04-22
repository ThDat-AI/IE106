"use client"

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for monitoring
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Waveform illustration — broken */}
      <div className="mb-10" aria-hidden="true">
        <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
          {[10, 30, 50, 70, 90, 110, 130, 150, 170].map((cx, i) => {
            const heights = [10, 14, 8, 18, 6, 12, 9, 16, 7]
            const h = heights[i]
            return (
              <rect
                key={cx}
                x={cx - 4}
                y={(60 - h) / 2}
                width={8}
                height={h}
                rx={4}
                fill="rgba(155,77,224,0.18)"
              />
            )
          })}
        </svg>
      </div>

      <h1
        className="font-display font-bold text-center mb-3"
        style={{
          fontSize: 32,
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
          fontFamily: 'var(--font-display)',
        }}
      >
        Something skipped a beat
      </h1>
      <p
        className="text-center max-w-sm mb-10"
        style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
      >
        An unexpected error occurred. Don&apos;t worry — your music taste is still intact.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-85 active:scale-95"
          style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
        >
          Retry
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-80"
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
