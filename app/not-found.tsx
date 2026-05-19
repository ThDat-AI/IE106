"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Ensure client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden select-none"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Background Noise Layer */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none z-0" />

      {/* Atmospheric Ambient Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-[130px] opacity-[0.15] animate-blob pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 blur-[130px] opacity-[0.15] animate-blob animation-delay-4000 pointer-events-none z-0" />

      {/* Main Glassmorphism Card */}
      <div 
        className="w-full max-w-lg rounded-[16px] backdrop-blur-xl border border-white/[0.08] relative z-10 flex flex-col items-center p-8 md:p-12 shadow-2xl transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, rgba(31, 22, 46, 0.6) 0%, rgba(23, 15, 35, 0.75) 100%)',
          boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Sleek Logo / Header */}
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

        {/* Static Broken Vinyl Illustration */}
        <div className="relative mb-10 select-none">
          {/* Vinyl Record Shadow */}
          <div className="absolute inset-4 rounded-full bg-black/60 blur-md translate-y-3 pointer-events-none" />

          {/* SVG Container for Shattered Record halves */}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="relative z-10">
            {/* Left shattered piece */}
            <g transform="translate(-8, 6) rotate(-3)" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.65))' }}>
              {/* Left half of the vinyl disc */}
              <path 
                d="M100 10 C48 10 10 48 10 100 C10 152 48 190 100 190 L92 165 L106 135 L90 100 L108 65 L94 35 Z" 
                fill="#120E18" 
                stroke="rgba(255,255,255,0.06)" 
                strokeWidth="2"
              />
              {/* Concentric Grooves */}
              <path d="M100 25 C58 25 25 58 25 100 C25 142 58 175 100 175" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
              <path d="M100 40 C67 40 40 67 40 100 C40 133 67 160 100 160" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" />
              <path d="M100 55 C75 55 55 75 55 100 C55 125 75 145 100 145" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
              <path d="M100 70 C83 70 70 83 70 100 C70 117 83 130 100 130" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" />
              
              {/* Center Label (Purple) */}
              <path 
                d="M100 72 C85 72 72 85 72 100 C72 115 85 128 100 128 L90 100 Z" 
                fill="#9B4DE0" 
              />
              {/* Spindle hole */}
              <path d="M100 92 C95 92 92 95 92 100 L90 100 Z" fill="#170F23" />
            </g>

            {/* Right shattered piece */}
            <g transform="translate(10, -6) rotate(4)" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.65))' }}>
              {/* Right half of the vinyl disc */}
              <path 
                d="M100 10 C152 10 190 48 190 100 C190 152 152 190 100 190 L92 165 L106 135 L90 100 L108 65 L94 35 Z" 
                fill="#120E18" 
                stroke="rgba(255,255,255,0.06)" 
                strokeWidth="2"
              />
              {/* Concentric Grooves */}
              <path d="M100 25 C142 25 175 58 175 100 C175 142 142 175 100 175" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
              <path d="M100 40 C133 40 160 67 160 100 C160 133 133 160 100 160" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" />
              <path d="M100 55 C125 55 145 75 145 100 C145 125 125 145 100 145" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
              <path d="M100 70 C117 70 130 83 130 100 C130 117 117 130 100 130" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none" />
              
              {/* Center Label (Purple) */}
              <path 
                d="M100 72 C115 72 128 85 128 100 C128 115 115 128 100 128 L90 100 Z" 
                fill="#9B4DE0" 
              />
              {/* Spindle hole */}
              <path d="M100 92 C105 92 108 95 108 100 L90 100 Z" fill="#170F23" />
            </g>

            {/* Glowing neon pink jagged fissure outline in between pieces */}
            <path 
              d="M 91 25 L 105 55 L 89 90 L 107 125 L 91 155" 
              stroke="#FF2E93" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              opacity="0.85"
              style={{ filter: 'drop-shadow(0 0 5px #FF2E93)' }}
            />
          </svg>
        </div>

        {/* 404 Number */}
        <div
          className="font-display font-bold select-none text-[84px] tracking-tighter leading-none mb-2 text-white/90"
          style={{
            fontFamily: 'var(--font-display), Montserrat, sans-serif',
            textShadow: '0 0 24px rgba(155, 77, 224, 0.6)'
          }}
        >
          404
        </div>

        {/* Main Error Messages */}
        <h1
          className="font-display font-bold text-center mb-3 text-2xl md:text-3xl tracking-tight leading-[1.1]"
          style={{
            fontFamily: 'var(--font-display), Montserrat, sans-serif',
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-0.5px'
          }}
        >
          Bản nhạc đã bị lạc nhịp
        </h1>
        <p
          className="text-center max-w-sm mb-10 text-[14px] md:text-[15px]"
          style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}
        >
          Giai điệu bạn đang tìm kiếm không nằm trong danh sách phát này. Đường dẫn có thể đã cũ hoặc bài hát đã bị ẩn.
        </p>

        {/* Functional CTAs (Binary system: 8px border radius) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[8px] text-sm font-semibold transition-all duration-150 bg-[#9B4DE0] hover:opacity-85 active:scale-95 text-white/95"
            style={{
              boxShadow: '0 4px 16px rgba(155, 77, 224, 0.3)'
            }}
          >
            <Home size={16} />
            Về Trang Chủ
          </Link>
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[8px] text-sm font-semibold transition-all duration-150 hover:bg-white/[0.04] active:scale-97 border text-white/70"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <Search size={16} />
            Tìm Kiếm Nhạc
          </Link>
        </div>

        {/* Subtle Back Link */}
        <button
          onClick={() => router.back()}
          className="mt-8 flex items-center gap-2 text-xs font-semibold text-white/65 hover:text-white/95 transition-colors duration-150 border-0 bg-transparent cursor-pointer"
        >
          <ArrowLeft size={12} />
          Quay lại trang trước
        </button>
      </div>

      {/* CSS Animation Keyframes Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 16s infinite ease-in-out;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  )
}
