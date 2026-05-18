"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Users, MessageSquare, Send, CheckCircle2, ChevronRight, MapPin, Phone, ExternalLink } from 'lucide-react'
import { PageHero, AmbientOrbs, GlassPanel, AccentBar } from '@/components/ui/vibewave'
import { useTranslation, translations } from '@/lib/i18n-store'

const TEAM = [
  { name: 'Lê Thành Thắng Đạt', role: 'Project Lead & AI Engineer', initials: 'TD', color: '#9B4DE0' },
  { name: 'Phạm Trường An', role: 'Lead Developer', initials: 'PA', color: '#3ABEF9' },
  { name: 'Lê Đình Duy', role: 'UI/UX Designer', initials: 'DD', color: '#F73859' },
  { name: 'Nguyễn Hoàng Hải', role: 'Backend Architect', initials: 'HH', color: '#FACC15' },
  { name: 'Nguyễn Tiến Thành', role: 'Frontend Specialist', initials: 'TT', color: '#05D69E' },
]

type Tab = 'about' | 'contact'

export default function AboutContactPage() {
  const { t, language } = useTranslation()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('about')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const VALUES = [
    {
      title: t.musicFirst,
      body: t.musicFirstDesc,
      icon: <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
    },
    {
      title: t.purposefulDesign,
      body: t.purposefulDesignDesc,
      icon: <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
    },
    {
      title: t.intelligentNotIntrusive,
      body: t.intelligentDesc,
      icon: <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-500/10 text-pink-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg></div>
    },
  ]

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab
    if (tab === 'about' || tab === 'contact') {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
    }, 1500)
  }

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      <AmbientOrbs position="absolute" />

      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <PageHero
            title={activeTab === 'about' ? t.aboutUs : t.contactUs}
            subtitle={
              activeTab === 'about' 
                ? t.aboutSub
                : t.contactSub
            }
            centered={true}
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex items-center gap-1.5">
            {(['about', 'contact'] as const).map(tab => {
              const isActive = activeTab === tab
              const Icon = tab === 'about' ? Users : MessageSquare
              const label = tab === 'about' ? t.aboutUs : t.contactUs
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border border-purple-500/50 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-transparent border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse shadow-[0_0_4px_#ffffff]" />
                  )}
                  <Icon size={16} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative">
          {activeTab === 'about' ? (
            <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Vision & Mission */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <AccentBar color="purple" height={8} />
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">{t.ourVision}</h2>
                  </div>
                  <p className="text-lg text-white/60 leading-relaxed">
                    {t.visionDesc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-purple-400 mb-1">2M+</div>
                      <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{t.listeners}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-bold text-blue-400 mb-1">50M+</div>
                      <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{t.tracks}</div>
                    </div>
                  </div>
                </div>
                <GlassPanel className="p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-purple-500">“</span>
                    {t.theMission}
                    <span className="text-purple-500">”</span>
                  </h3>
                  <p className="text-xl font-medium text-white/90 italic leading-relaxed">
                    "{t.missionQuote}"
                  </p>
                </GlassPanel>
              </section>

              {/* Values */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-display font-bold text-white tracking-tight">{t.whatWeStandFor}</h2>
                  <p className="text-white/50">{t.principlesDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {VALUES.map((v, i) => (
                    <GlassPanel key={i} className="p-8 group hover:-translate-y-1 transition-transform duration-300">
                      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{v.body}</p>
                    </GlassPanel>
                  ))}
                </div>
              </section>

              {/* Team Section */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-display font-bold text-white tracking-tight">{t.meetTheTeam}</h2>
                  <p className="text-white/50">{t.innovatorsDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {TEAM.map((member, i) => (
                    <div key={i} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                      <GlassPanel className="p-6 text-center relative z-10 h-full flex flex-col items-center">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                          style={{ 
                            background: `linear-gradient(135deg, ${member.color}, rgba(0,0,0,0.4))`,
                            border: `2px solid ${member.color}44`,
                            color: 'white'
                          }}
                        >
                          {member.initials}
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">{member.name}</h4>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">{member.role}</p>
                      </GlassPanel>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Contact Info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <AccentBar color="blue" height={8} />
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">{t.getInTouch}</h2>
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    {t.contactDesc}
                  </p>
                </div>

                <div className="space-y-4">
                  <GlassPanel className="p-5 flex items-center gap-4 group cursor-pointer hover:border-blue-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">{t.emailUs}</div>
                      <div className="text-white font-medium">support@vibewave.fm</div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-white/20" />
                  </GlassPanel>

                  <GlassPanel className="p-5 flex items-center gap-4 group cursor-pointer hover:border-purple-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">{t.visitUs}</div>
                      <div className="text-white font-medium">San Francisco, CA</div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-white/20" />
                  </GlassPanel>

                  <GlassPanel className="p-5 flex items-center gap-4 group cursor-pointer hover:border-green-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">{t.callUs}</div>
                      <div className="text-white font-medium">+1 (555) VIBE-WAVE</div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-white/20" />
                  </GlassPanel>
                </div>

                <GlassPanel className="p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <ExternalLink size={16} className="text-purple-400" />
                    {t.helpCenter}
                  </h4>
                  <p className="text-sm text-white/50 mb-4">{t.checkFaq}</p>
                  <button className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    {t.viewFaq} <ChevronRight size={14} />
                  </button>
                </GlassPanel>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7">
                <GlassPanel className="p-8 md:p-10 relative overflow-hidden">
                  {formSubmitted ? (
                    <div className="text-center space-y-6 py-12">
                      <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-bounce">
                        <CheckCircle2 size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">{t.messageSent}</h3>
                        <p className="text-white/50">{t.sentDesc}</p>
                      </div>
                      <button 
                        onClick={() => setFormSubmitted(false)}
                        className="text-sm font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors"
                      >
                        {t.sendAnother}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.fullName}</label>
                          <input 
                            required
                            type="text" 
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.emailAddress}</label>
                          <input 
                            required
                            type="email" 
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.subject}</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none">
                          <option className="bg-[#1a1425]">General Inquiry</option>
                          <option className="bg-[#1a1425]">Technical Support</option>
                          <option className="bg-[#1a1425]">Billing & Subscription</option>
                          <option className="bg-[#1a1425]">Artist & Labels</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.message}</label>
                        <textarea 
                          required
                          rows={5}
                          placeholder="Tell us how we can help..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(155,77,224,0.3)] hover:shadow-[0_15px_40px_rgba(155,77,224,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={16} />
                            {t.sendMessage}
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </GlassPanel>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
