"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Log error for monitoring
    console.error('Captured Error Boundary:', error)
  }, [error])

  const handleRetry = () => {
    setIsRetrying(true)
    // Small timeout to give feedback on retry click
    setTimeout(() => {
      reset()
      setIsRetrying(false)
    }, 800)
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden select-none"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Background Noise Layer */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none z-0" />

      {/* Atmospheric Ambient Glow Blobs */}
      <div className="absolute top-1/4 right-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-red-600/10 to-purple-600/10 blur-[130px] animate-blob pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 blur-[130px] animate-blob animation-delay-4000 pointer-events-none z-0" />

      {/* Main Glassmorphic Card */}
      <div 
        className="w-full max-w-lg rounded-[16px] backdrop-blur-xl border border-white/[0.08] relative z-10 flex flex-col items-center p-8 md:p-12 shadow-2xl transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, rgba(35, 20, 46, 0.65) 0%, rgba(23, 15, 35, 0.8) 100%)',
          boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-8 select-none">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#9B4DE0' }}
          >
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '0.5px'
            }}
          >
            VibeWave
          </span>
        </div>

        {/* Tangled Cassette Tape Illustration */}
        <div className="relative mb-8 select-none">
          {/* Subtle glow underneath */}
          <div className="absolute inset-4 rounded-[12px] bg-red-500/20 blur-xl pointer-events-none" />

          {/* Cassette SVG */}
          <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
            {/* Outer shell */}
            <rect x="10" y="10" width="160" height="90" rx="10" fill="#1A1127" stroke="#9B4DE0" strokeWidth="3" />
            <rect x="15" y="15" width="150" height="80" rx="6" fill="#120E18" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" />

            {/* Inner Spool Window */}
            <rect x="50" y="38" width="80" height="34" rx="4" fill="#1F162E" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

            {/* Left Spool Wheel */}
            <circle cx="70" cy="55" r="14" fill="#3A2D52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="70" cy="55" r="6" fill="#120E18" />
            {/* Teeth */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line 
                key={deg}
                x1={70 + 6 * Math.cos((deg * Math.PI) / 180)} 
                y1={55 + 6 * Math.sin((deg * Math.PI) / 180)}
                x2={70 + 11 * Math.cos((deg * Math.PI) / 180)} 
                y2={55 + 11 * Math.sin((deg * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="1.5"
              />
            ))}

            {/* Right Spool Wheel */}
            <circle cx="110" cy="55" r="14" fill="#3A2D52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="110" cy="55" r="6" fill="#120E18" />
            {/* Teeth */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line 
                key={deg}
                x1={110 + 6 * Math.cos((deg * Math.PI) / 180)} 
                y1={55 + 6 * Math.sin((deg * Math.PI) / 180)}
                x2={110 + 11 * Math.cos((deg * Math.PI) / 180)} 
                y2={55 + 11 * Math.sin((deg * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="1.5"
              />
            ))}

            {/* Spilled Cassette Ribbon (Glowing bezier curve tangled out of the tape) */}
            <path 
              d="M70 69 C 60 90, 50 105, 75 105 C 105 105, 95 90, 100 78 C 105 68, 120 95, 110 69" 
              stroke="#FF2E93" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 4px #FF2E93)' }}
            />
            <path 
              d="M70 69 C 60 90, 50 105, 75 105 C 105 105, 95 90, 100 78" 
              stroke="#ffffff" 
              strokeWidth="0.8" 
              strokeLinecap="round"
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* Typography */}
        <h1
          className="font-display font-bold text-center mb-3 text-2xl md:text-3xl tracking-tight leading-[1.1]"
          style={{
            fontFamily: 'var(--font-display), Montserrat, sans-serif',
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-0.5px'
          }}
        >
          Giai điệu bị ngắt quãng
        </h1>
        <p
          className="text-center max-w-sm mb-8 text-[14px]"
          style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}
        >
          Đã xảy ra sự cố không mong muốn khi tải bản nhạc này. Vui lòng thử tải lại hoặc quay về trang chủ. Gu âm nhạc của bạn vẫn an toàn!
        </p>

        {/* Action Buttons (Binary system radius: 8px) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-6">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[8px] text-sm font-semibold transition-all duration-150 bg-[#9B4DE0] hover:opacity-85 active:scale-95 text-white/95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            style={{
              boxShadow: '0 4px 16px rgba(155, 77, 224, 0.3)'
            }}
          >
            <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Đang kết nối...' : 'Thử phát lại'}
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[8px] text-sm font-semibold transition-all duration-150 hover:bg-white/[0.04] active:scale-97 border text-white/70"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <Home size={16} />
            Về Trang Chủ
          </Link>
        </div>
      </div>

      {/* CSS Animation Keyframes Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-25px, 25px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 14s infinite ease-in-out;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  )
}
