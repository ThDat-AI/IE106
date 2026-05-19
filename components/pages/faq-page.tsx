"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronDown, Search, HelpCircle, MessageSquare, LifeBuoy, CreditCard, PlayCircle, Settings } from 'lucide-react'
import { PageHero, GlassPanel, AmbientOrbs, SectionHeader, AccentBar } from '@/components/ui/vibewave'
import { useTranslation } from '@/lib/i18n-store'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Account': <Settings size={20} />,
  'Playback': <PlayCircle size={20} />,
  'Technical': <LifeBuoy size={20} />,
  // Vietnamese mappings
  'Tài khoản': <Settings size={20} />,
  'Phát nhạc': <PlayCircle size={20} />,
  'Kỹ thuật': <LifeBuoy size={20} />,
}

export default function FaqPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(t.faqData[0].name)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return null

    const results: Array<{ cat: string; q: string; a: string; index: number }> = []
    t.faqData.forEach((cat: any) => {
      cat.questions.forEach((item: any, i: number) => {
        if (
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ cat: cat.name, q: item.q, a: item.a, index: i })
        }
      })
    })
    return results
  }, [searchQuery, t.faqData])

  const currentCategory = t.faqData.find((c: any) => c.name === activeCategory) || t.faqData[0]

  return (
    <div className="relative pb-20">
      <AmbientOrbs position="absolute" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <div className="pt-12 mb-16">
          <div className="text-center space-y-4">
            <h1 
              className="font-bold text-white tracking-tight" 
              style={{ 
                fontFamily: 'var(--font-montserrat)', 
                fontSize: 'clamp(44px, 5vw, 64px)', 
                letterSpacing: '-0.03em', 
                lineHeight: 1.1
              }}
            >
              {t.faqHeroTitle}
            </h1>
            <p 
              className="text-base font-light leading-relaxed max-w-2xl mx-auto text-white/80" 
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {t.faqHeroSub}
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="mt-12 max-w-2xl mx-auto relative group">
            {/* Ambient Breathing Glow */}
            <div
              className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 rounded-[22px] blur-2xl animate-breathing opacity-40 group-focus-within:opacity-80 transition-opacity duration-700"
              aria-hidden
            />
            
            {/* Search Input Wrapper */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 group-hover:border-white/30 group-focus-within:border-purple-400/50 group-focus-within:bg-white/15 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
              
              <div className="relative flex items-center px-5">
                <Search className="text-white/40 group-focus-within:text-purple-400 transition-colors" size={22} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t.searchFaqPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-5 bg-transparent text-white text-lg placeholder-white/30 focus:outline-none transition-all"
                />
                
                {/* Keyboard Hint */}
                <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-white/30 group-focus-within:opacity-0 transition-opacity">
                  <span className="text-[12px]">/</span>
                </div>
              </div>
            </div>

            {/* Popular Topics / Suggestions */}
            {!searchQuery && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2 duration-700 delay-150">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider mr-1">{t.popularTopics}:</span>
                {Object.entries(t.topics).map(([key, label]: [string, any]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSearchQuery(label)
                      inputRef.current?.focus()
                    }}
                    className="px-4 py-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 rounded-full text-xs text-white/80 hover:text-purple-300 transition-all active:scale-95"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {searchQuery ? (
          /* Search Results */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <AccentBar color="green" />
              <h2 className="text-2xl font-display font-semibold text-white">
                {filteredQuestions?.length
                  ? t.searchResultsFound.replace('{count}', filteredQuestions.length.toString())
                  : t.noResultsFound}
              </h2>
            </div>

            {filteredQuestions?.length ? (
              <div className="space-y-4">
                {filteredQuestions.map((item, i) => (
                  <FaqItem
                    key={`search-${i}`}
                    item={item}
                    isOpen={!!openItems[`search-${i}`]}
                    onToggle={() => toggle(`search-${i}`)}
                  />
                ))}
              </div>
            ) : (
              <GlassPanel variant="dark" className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <Search size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{t.noResultsFound}</h3>
                    <p className="text-white/50 max-w-md">
                      {t.noResultsDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                  >
                    {t.clearSearch}
                  </button>
                </div>
              </GlassPanel>
            )}
          </div>
        ) : (
          /* Category Browsing */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-2">
                <SectionHeader title={t.categories} />
                <div className="space-y-1">
                  {t.faqData.map((cat: any) => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`
                        group w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden border cursor-pointer font-bold
                        ${activeCategory === cat.name 
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-[0_4px_20px_rgba(155,77,224,0.1)]' 
                          : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/[0.12] hover:border-white/25 hover:text-white'
                        }
                      `}
                    >
                      {activeCategory === cat.name && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
                      )}
                      <span className={`transition-colors ${activeCategory === cat.name ? 'text-purple-300' : 'text-white/60 group-hover:text-white'}`}>
                        {CATEGORY_ICONS[cat.name] || <HelpCircle size={20} />}
                      </span>
                      <span className={`transition-colors ${activeCategory === cat.name ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                        {cat.name}
                      </span>
                      {activeCategory === cat.name && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#C4B5FD]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Support Box */}
                <GlassPanel variant="surface" className="mt-8 p-6">
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{t.directSupport}</h4>
                      <p className="text-white/80 text-xs leading-relaxed">
                        {t.directSupportDesc}
                      </p>
                    </div>
                    <a
                      href="/about?tab=contact"
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl text-center shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
                    >
                      {t.contactUs}
                    </a>
                  </div>
                </GlassPanel>
              </div>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <AccentBar color="purple" />
                <h2 className="text-3xl font-display font-semibold text-white tracking-tight">
                  {currentCategory.name}
                </h2>
              </div>

              <div className="space-y-4">
                {currentCategory.questions.map((item: any, i: number) => {
                  const key = `${activeCategory}-${i}`
                  return (
                    <FaqItem
                      key={key}
                      item={item}
                      isOpen={!!openItems[key]}
                      onToggle={() => toggle(key)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


function FaqItem({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <GlassPanel
      variant={isOpen ? 'dark' : 'surface'}
      className={`transition-all duration-300 ${isOpen ? 'ring-1 ring-purple-500/30' : 'hover:border-white/20'}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-7 py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
          {item.q}
        </span>
        <div className={`shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-purple-400' : 'text-white/20 group-hover:text-white/40'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-7 pb-6">
            <div className="w-full h-px bg-white/5 mb-6" />
            <p className="text-neutral-200 leading-relaxed text-[15px]">
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}

