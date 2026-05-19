import { Radio } from 'lucide-react'

export const metadata = {
  title: 'Đang Cân Chỉnh Âm Thanh — VibeWave',
}

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden select-none"
      style={{ backgroundColor: '#170F23' }}
    >
      {/* Background Noise Layer */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none z-0" />

      {/* Atmospheric Ambient Glow Blobs */}
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-700/10 to-indigo-700/10 blur-[140px] animate-blob pointer-events-none z-0" />
      <div className="absolute bottom-1/3 left-1/4 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-700/10 to-purple-700/10 blur-[140px] animate-blob animation-delay-4000 pointer-events-none z-0" />

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-10 select-none z-10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
          style={{ backgroundColor: '#9B4DE0' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.8px'
          }}
        >
          VibeWave
        </span>
      </div>

      {/* Primary Card */}
      <div 
        className="w-full max-w-xl rounded-[16px] backdrop-blur-xl border border-white/[0.08] relative z-10 flex flex-col items-center p-8 md:p-12 shadow-2xl transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, rgba(31, 22, 46, 0.5) 0%, rgba(23, 15, 35, 0.7) 100%)',
          boxShadow: '0 32px 80px -20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Beautiful Loop-Animated CSS Equalizer (Using pure CSS for zero bundle cost) */}
        <div className="h-28 flex items-end justify-center gap-[6px] mb-10 w-full max-w-sm px-4 border-b border-white/[0.05] pb-4 relative">
          {/* Subtle Ambient Gridlines */}
          <div className="absolute inset-x-0 bottom-4 h-24 border-t border-dashed border-white/[0.02] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-4 h-16 border-t border-dashed border-white/[0.02] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-4 h-8 border-t border-dashed border-white/[0.02] pointer-events-none" />

          {[
            { h: 36, speed: '1.2s' },
            { h: 68, speed: '1.4s' },
            { h: 52, speed: '1.1s' },
            { h: 88, speed: '1.6s' },
            { h: 44, speed: '1.3s' },
            { h: 76, speed: '1.5s' },
            { h: 58, speed: '1.2s' },
            { h: 32, speed: '1.4s' },
            { h: 64, speed: '1.1s' },
            { h: 48, speed: '1.3s' },
          ].map((bar, i) => (
            <div 
              key={i}
              className="w-2.5 rounded-t-full transition-all duration-300 ease-out"
              style={{
                height: bar.h,
                backgroundColor: '#9B4DE0',
                boxShadow: '0 0 16px rgba(155, 77, 224, 0.4)',
                background: 'linear-gradient(to top, #9B4DE0 0%, #d89ffc 100%)',
                animation: `equalizer-pulse ${bar.speed} ease-in-out infinite alternate`,
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}

          {/* Equalizer Mode Tag */}
          <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-[4px] bg-[#9B4DE0]/10 border border-[#9B4DE0]/20 flex items-center gap-1">
            <Radio size={10} className="text-[#9B4DE0] animate-pulse" />
            <span className="text-[9px] font-bold text-[#9B4DE0] uppercase tracking-wider font-mono">
              Live Sound Check
            </span>
          </div>
        </div>

        {/* Informative Typography */}
        <h1
          className="font-display font-bold text-center mb-4 text-3xl md:text-4xl tracking-tight leading-[1.05]"
          style={{
            fontFamily: 'var(--font-display), Montserrat, sans-serif',
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-0.8px'
          }}
        >
          Đang cân chỉnh âm thanh
        </h1>
        <p
          className="text-center max-w-sm mb-10 text-[14px] md:text-[15px]"
          style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}
        >
          Hệ thống VibeWave đang được bảo trì định kỳ nhằm nâng cấp chất lượng truyền tải tần số cao và tối ưu hóa thư viện nhạc AI. Mọi bản nhạc sẽ sớm được tiếp tục vang lên.
        </p>

        {/* Pulse Status indicator */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-[8px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#9B4DE0', boxShadow: '0 0 8px #9B4DE0' }}
            aria-hidden="true"
          />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
            Thời gian hoàn tất dự kiến: Ít hơn 10 phút nữa
          </span>
        </div>
      </div>

      {/* CSS Styling & Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes equalizer-pulse {
          0% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.4);
          }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  )
}
