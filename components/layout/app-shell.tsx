"use client"

import { useState } from 'react'
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
    <div className="min-h-screen bg-vw-bg">
      <Header />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      <main
        className="pt-16 pb-20 min-h-screen"
        style={{
          marginLeft: sidebarCollapsed ? '64px' : '220px',
          transition: 'margin-left 0.2s ease',
        }}
      >
        <div className="max-w-[1220px] mx-auto px-8 py-8">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      <BottomPlayer />
    </div>
  )
}
