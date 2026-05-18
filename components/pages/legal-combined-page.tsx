"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n-store'
import { GlassPanel, PageHero } from '@/components/ui/vibewave'

interface Section {
  id: string
  heading: string
  body: string
}

interface TabData {
  id: string
  title: string
  lastUpdated: string
  sections: Section[]
}

function LegalContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTabId = searchParams.get('tab') || 'terms'
  
  const legalData = t.legalData as any
  const tabs = Object.entries(legalData).map(([id, data]: [string, any]) => ({
    id,
    ...data
  }))

  const activeTabData = tabs.find(tab => tab.id === activeTabId) || tabs[0]
  const [activeSection, setActiveSection] = useState(activeTabData.sections[0]?.id ?? '')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sectionEls = activeTabData.sections.map((s) => document.getElementById(s.id))
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i]
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(activeTabData.sections[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeTabData])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleTabChange = (id: string) => {
    router.push(`/legal?tab=${id}`, { scroll: false })
    setActiveSection('') // Reset active section for the new tab
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page header */}
      <div className="mb-16">
        <PageHero
          centered
          title={t.legalTitle}
          subtitle={t.legalSub}
          gradientClass="from-white via-purple-200 to-[#9B4DE0]"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-12 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit mx-auto backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden flex items-center gap-2 cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border border-purple-500/50 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-transparent border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse shadow-[0_0_4px_#ffffff]" />
              )}
              <span className="relative z-10">{tab.title}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Sticky table of contents */}
        <aside className="lg:col-span-1 sticky top-24 order-2 lg:order-1">
          <GlassPanel className="p-6">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {t.contentsLabel}
            </p>
            <div className="space-y-1">
              {activeTabData.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group flex items-center gap-3"
                  style={{
                    backgroundColor: activeSection === s.id ? 'rgba(155,77,224,0.1)' : 'transparent',
                    color: activeSection === s.id ? '#9B4DE0' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: activeSection === s.id ? '#9B4DE0' : 'rgba(255,255,255,0.1)',
                      transform: activeSection === s.id ? 'scale(1)' : 'scale(0.5)'
                    }}
                  />
                  {s.heading}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                {t.lastUpdatedLabel}: {activeTabData.lastUpdated}
              </p>
            </div>
          </GlassPanel>
        </aside>

        {/* Legal content */}
        <div ref={contentRef} className="lg:col-span-3 space-y-12 order-1 lg:order-2">
          <GlassPanel className="p-8 lg:p-12">
            <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {activeTabData.title}
            </h2>
            
            <div className="space-y-12">
              {activeTabData.sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-32"
                >
                  <h3
                    className="font-display font-bold mb-5"
                    style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
                  >
                    {s.heading}
                  </h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                    {s.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Footer note */}
            <div
              className="mt-16 pt-10"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }} className="max-w-md">
                  This document is provided for informational purposes. For official legal inquiries, please reach out to our legal department.
                </p>
                <a 
                  href={`mailto:${activeTabId === 'privacy' ? 'privacy' : activeTabId === 'copyright' ? 'dmca' : 'legal'}@vibewave.fm`}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-sm font-medium text-white/70 w-fit"
                >
                  Contact Legal Team
                </a>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}

export default function LegalCombinedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/20">Loading Legal Center...</div>}>
      <LegalContent />
    </Suspense>
  )
}
