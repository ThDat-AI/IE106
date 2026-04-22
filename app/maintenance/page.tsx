export const metadata = {
  title: 'Under Maintenance — VibeWave',
}

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Animated waveform */}
      <div className="mb-10" aria-hidden="true">
        <svg width="200" height="64" viewBox="0 0 200 64" fill="none">
          <style>{`
            @keyframes wave-pulse {
              0%, 100% { opacity: 0.2; transform: scaleY(1); }
              50% { opacity: 0.5; transform: scaleY(1.3); }
            }
            .bar { transform-origin: center; }
            .bar:nth-child(1) { animation: wave-pulse 1.4s ease-in-out 0s infinite; }
            .bar:nth-child(2) { animation: wave-pulse 1.4s ease-in-out 0.1s infinite; }
            .bar:nth-child(3) { animation: wave-pulse 1.4s ease-in-out 0.2s infinite; }
            .bar:nth-child(4) { animation: wave-pulse 1.4s ease-in-out 0.3s infinite; }
            .bar:nth-child(5) { animation: wave-pulse 1.4s ease-in-out 0.4s infinite; }
            .bar:nth-child(6) { animation: wave-pulse 1.4s ease-in-out 0.5s infinite; }
            .bar:nth-child(7) { animation: wave-pulse 1.4s ease-in-out 0.6s infinite; }
            .bar:nth-child(8) { animation: wave-pulse 1.4s ease-in-out 0.7s infinite; }
            .bar:nth-child(9) { animation: wave-pulse 1.4s ease-in-out 0.8s infinite; }
            .bar:nth-child(10) { animation: wave-pulse 1.4s ease-in-out 0.9s infinite; }
          `}</style>
          {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((cx, i) => {
            const heights = [20, 40, 28, 52, 24, 44, 32, 18, 38, 26]
            const h = heights[i]
            return (
              <rect
                key={cx}
                className="bar"
                x={cx - 5}
                y={(64 - h) / 2}
                width={10}
                height={h}
                rx={5}
                fill="#9B4DE0"
              />
            )
          })}
        </svg>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#9B4DE0' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 18,
            color: 'rgba(255,255,255,0.95)',
          }}
        >
          VibeWave
        </span>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 40,
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.8px',
          lineHeight: 1.05,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        We&apos;re tuning up
      </h1>
      <p
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 400,
          marginBottom: 40,
        }}
      >
        VibeWave is undergoing scheduled maintenance to improve your listening experience.
        We&apos;ll be back shortly.
      </p>

      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl"
        style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: '#9B4DE0' }}
          aria-hidden="true"
        />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          Estimated downtime: less than 30 minutes
        </span>
      </div>
    </div>
  )
}
