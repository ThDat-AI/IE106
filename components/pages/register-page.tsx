"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Check, User, Mail, Lock, Music2, Headphones, Radio, Disc3 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n-store'
import { AmbientOrbs, GlassPanel } from '@/components/ui/vibewave'

/* ── SVG brand icons ── */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"/>
    </svg>
  )
}

function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09ZM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
    </svg>
  )
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  )
}

/* ── Floating music note particles ── */
function FloatingNotes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-note"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${6 + i * 0.8}s`,
            opacity: 0.06 + i * 0.015,
          }}
        >
          {i % 3 === 0 ? (
            <Headphones size={24 + i * 4} className="text-purple-400" />
          ) : i % 3 === 1 ? (
            <Radio size={20 + i * 3} className="text-blue-400" />
          ) : (
            <Disc3 size={22 + i * 3} className="text-pink-400" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  function validate() {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = t.nameRequired
    if (!form.email) e.email = t.emailRequired
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t.validEmail
    if (!form.password) e.password = t.passwordRequired
    else if (form.password.length < 8) e.password = t.passwordMinRegister
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  const inputStyle = (field: string, hasError: boolean) => ({
    backgroundColor: focusedField === field ? 'rgba(155, 77, 224, 0.06)' : 'rgba(255, 255, 255, 0.03)',
    border: `1.5px solid ${hasError ? '#ef4444' : focusedField === field ? 'rgba(155, 77, 224, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: focusedField === field ? '0 0 20px rgba(155, 77, 224, 0.15)' : 'none',
  })

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const PERKS = [t.perk1, t.perk2, t.perk3, t.perk4]

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ backgroundColor: '#0A0712' }}>
      <AmbientOrbs position="fixed" />

      {/* ── LEFT PANEL: Brand showcase (desktop) ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative items-center justify-center p-12">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(155, 77, 224, 0.08) 0%, rgba(67, 56, 202, 0.04) 50%, rgba(155, 77, 224, 0.05) 100%)' }} />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(155, 77, 224, 0.3), transparent)' }}
        />
        <div className="absolute top-0 bottom-0 right-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(155, 77, 224, 0.2), transparent)' }} />

        {/* Floating notes */}
        <FloatingNotes />

        <div className="relative z-10 max-w-md space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 0 40px rgba(155, 77, 224, 0.5)' }}>
              <Music2 size={28} color="white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>VibeWave</span>
          </div>

          {/* Hero */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-500" style={{ fontSize: 'clamp(34px, 3.5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Start your music journey today
            </h2>
            <p className="text-base leading-relaxed max-w-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {t.createAccountSub}
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-4">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-3 group/perk">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover/perk:scale-110" style={{ backgroundColor: 'rgba(155, 77, 224, 0.1)', border: '1px solid rgba(155, 77, 224, 0.25)' }}>
                  <Check size={13} style={{ color: '#9B4DE0' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>{perk}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {['#9B4DE0', '#7E22CE', '#4338CA'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0712] flex items-center justify-center" style={{ backgroundColor: `${c}30`, boxShadow: `0 0 10px ${c}40` }}>
                  <Music2 size={12} style={{ color: c }} />
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
              <span className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>2M+</span> music lovers worldwide
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Register form ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="absolute top-1/2 left-1/2 lg:left-3/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #9B4DE0 0%, transparent 70%)', filter: 'blur(120px)' }} />

        <div className="w-full max-w-[480px] relative z-10">
          <GlassPanel className="p-7 md:p-9" variant="dark">
            {/* Header */}
            <div className="flex flex-col items-center mb-7 text-center">
              <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 relative group lg:hidden" style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', boxShadow: '0 0 30px rgba(155, 77, 224, 0.4)', width: 52, height: 52 }}>
                <Music2 size={26} color="white" className="transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h1 className="font-display font-bold text-3xl mb-2 tracking-tight" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{t.createAccount}</h1>
              <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>{t.createAccountSub}</p>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-4 gap-2.5 mb-7">
              {[
                { icon: <GoogleIcon size={18} />, label: 'Google', id: 'reg-google' },
                { icon: <FacebookIcon size={18} />, label: 'Facebook', id: 'reg-facebook' },
                { icon: <AppleIcon size={18} />, label: 'Apple', id: 'reg-apple' },
                { icon: <PhoneIcon size={18} />, label: 'Phone', id: 'reg-phone' },
              ].map((p) => (
                <button
                  key={p.id} id={p.id} type="button"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-semibold transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.6)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  aria-label={`Sign up with ${p.label}`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)' }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>{t.orContinueWith} Email</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)' }} />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="reg-name" className="block text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{t.fullName}</label>
                <div className="relative flex items-center group" style={inputStyle('name', !!errors.name)}>
                  <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors duration-200"><User size={17} /></div>
                  <input id="reg-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder="Alex Johnson" className="w-full bg-transparent border-none outline-none py-3 px-3 text-[14px] placeholder:text-white/20" style={{ color: 'rgba(255, 255, 255, 0.9)' }} aria-invalid={!!errors.name} />
                </div>
                {errors.name && <p className="text-xs font-medium mt-1 ml-1" style={{ color: '#f87171' }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{t.email}</label>
                <div className="relative flex items-center group" style={inputStyle('email', !!errors.email)}>
                  <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors duration-200"><Mail size={17} /></div>
                  <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="you@example.com" className="w-full bg-transparent border-none outline-none py-3 px-3 text-[14px] placeholder:text-white/20" style={{ color: 'rgba(255, 255, 255, 0.9)' }} aria-invalid={!!errors.email} />
                </div>
                {errors.email && <p className="text-xs font-medium mt-1 ml-1" style={{ color: '#f87171' }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{t.password}</label>
                <div className="relative flex items-center group" style={inputStyle('password', !!errors.password)}>
                  <div className="pl-4 text-white/30 group-focus-within:text-purple-400 transition-colors duration-200"><Lock size={17} /></div>
                  <input id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder={t.passwordMinRegister} className="w-full bg-transparent border-none outline-none py-3 px-3 text-[14px] placeholder:text-white/20" style={{ color: 'rgba(255, 255, 255, 0.9)' }} aria-invalid={!!errors.password} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div className="px-1 py-1">
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: pwStrength >= i ? (pwStrength === 1 ? '#ef4444' : pwStrength === 2 ? '#9B4DE0' : '#05D69E') : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: pwStrength >= i ? `0 0 10px ${pwStrength === 1 ? '#ef444466' : pwStrength === 2 ? '#9B4DE066' : '#05D69E66'}` : 'none'
                          }}
                        />
                      ))}
                      <span className="text-[10px] font-bold uppercase tracking-widest ml-2" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                        {pwStrength === 1 ? t.weak : pwStrength === 2 ? t.good : t.strong}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-xs font-medium mt-1 ml-1" style={{ color: '#f87171' }}>{errors.password}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-[0.98] mt-2 overflow-hidden cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #9B4DE0 0%, #7E22CE 100%)', color: 'white', boxShadow: '0 8px 25px -5px rgba(155, 77, 224, 0.5)', opacity: loading ? 0.8 : 1 }}
              >
                {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : (
                  <>
                    <span>{t.createAccount}</span>
                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </form>

            {/* Mobile perks */}
            <div className="mt-6 pt-6 border-t border-white/5 space-y-2.5 lg:hidden">
              {PERKS.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(155, 77, 224, 0.1)', border: '1px solid rgba(155, 77, 224, 0.25)' }}>
                    <Check size={11} style={{ color: '#9B4DE0' }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{perk}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                {t.alreadyHaveAccount}{' '}
                <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors duration-200">{t.signInLink}</Link>
              </p>
              <p className="text-[10px] leading-relaxed px-4" style={{ color: 'rgba(255, 255, 255, 0.25)' }}>
                {t.termsAgree}{' '}
                <Link href="/legal?tab=terms" className="underline hover:text-white/40 transition-colors duration-200">{t.termsLink}</Link>
                {' '}{t.andText}{' '}
                <Link href="/legal?tab=privacy" className="underline hover:text-white/40 transition-colors duration-200">{t.privacyLink}</Link>.
              </p>
            </div>
          </GlassPanel>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes float-note {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-30px) rotate(10deg);
            opacity: 0.12;
          }
        }
        .animate-float-note {
          animation: float-note 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
