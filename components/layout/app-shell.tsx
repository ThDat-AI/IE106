"use client"

import { useState, Suspense } from 'react'
import Header from './header'
import Sidebar from './sidebar'
import BottomPlayer from './bottom-player'
import Footer from './footer'

interface AppShellProps {
  children: React.ReactNode
  showFooter?: boolean
}

export default function AppShell({ children, showFooter = true }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-vw-bg relative overflow-hidden">
      {/* Immersive Deep Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-vw-purple opacity-[0.25] blur-[100px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#00FFFF] opacity-[0.15] blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#FF00FF] opacity-[0.15] blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        <Header />
        <Suspense fallback={null}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        </Suspense>

        <main
          className="pt-16 pb-20 min-h-screen"
          style={{
            marginLeft: sidebarCollapsed ? '72px' : '240px',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div className="max-w-[1220px] mx-auto px-8 py-8">
            {children}
          </div>
          {showFooter && <Footer />}
        </main>

        <BottomPlayer sidebarCollapsed={sidebarCollapsed} />
      </div>
    </div>
  )
}
