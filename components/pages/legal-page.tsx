"use client"

import { useState, useEffect, useRef } from 'react'

interface Section {
  id: string
  heading: string
  body: string
}

interface LegalPageProps {
  title: string
  lastUpdated: string
  sections: Section[]
}

export default function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sectionEls = sections.map((s) => document.getElementById(s.id))
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i]
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-12">
        <h1
          className="font-display font-bold leading-display mb-4"
          style={{ fontSize: 48, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.8px', lineHeight: 1 }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-12">

        {/* Sticky table of contents */}
        <aside className="col-span-1">
          <nav className="sticky top-24">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              Contents
            </p>
            <div className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150"
                  style={{
                    backgroundColor: activeSection === s.id ? 'rgba(155,77,224,0.1)' : 'transparent',
                    color: activeSection === s.id ? '#9B4DE0' : 'rgba(255,255,255,0.4)',
                    borderLeft: activeSection === s.id ? '2px solid #9B4DE0' : '2px solid transparent',
                    paddingLeft: activeSection === s.id ? 'calc(0.75rem - 2px)' : '0.75rem',
                  }}
                >
                  {s.heading}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Legal content */}
        <div ref={contentRef} className="col-span-3 space-y-10">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 40 } : undefined}
            >
              <h2
                className="font-display font-semibold mb-4"
                style={{ fontSize: 20, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
              >
                {s.heading}
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
                {s.body}
              </p>
            </section>
          ))}

          {/* Footer note */}
          <div
            className="mt-8 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
              This document is provided for informational purposes. For legal questions, contact{' '}
              <a href="mailto:legal@vibewave.fm" className="hover:opacity-80 transition-all duration-150" style={{ color: 'rgba(255,255,255,0.45)' }}>
                legal@vibewave.fm
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
