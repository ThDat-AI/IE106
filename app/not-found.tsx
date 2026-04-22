import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Waveform illustration */}
      <div className="mb-10" aria-hidden="true">
        <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
          {[10, 30, 50, 70, 90, 110, 130, 150, 170].map((cx, i) => {
            const heights = [14, 34, 22, 48, 18, 42, 28, 16, 36]
            const h = heights[i]
            return (
              <rect
                key={cx}
                x={cx - 4}
                y={(60 - h) / 2}
                width={8}
                height={h}
                rx={4}
                fill="rgba(155,77,224,0.25)"
              />
            )
          })}
        </svg>
      </div>

      {/* 404 number */}
      <div
        className="font-display font-bold mb-3"
        style={{
          fontSize: 96,
          color: 'rgba(155,77,224,0.25)',
          lineHeight: 0.96,
          letterSpacing: '-3px',
          fontFamily: 'var(--font-display)',
        }}
        aria-hidden="true"
      >
        404
      </div>

      <h1
        className="font-display font-bold text-center mb-3"
        style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px', lineHeight: 1.1 }}
      >
        This page is off the playlist
      </h1>
      <p
        className="text-center max-w-sm mb-10"
        style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
      >
        We couldn&apos;t find what you were looking for. It may have moved or no longer exists.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-85 active:scale-95"
          style={{ backgroundColor: '#9B4DE0', color: 'rgba(255,255,255,0.95)' }}
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-80"
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          Search Music
        </Link>
      </div>
    </div>
  )
}
