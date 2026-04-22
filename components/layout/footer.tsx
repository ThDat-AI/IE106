import Link from 'next/link'

const FOOTER_LINKS = {
  Product: [
    { label: 'Home', href: '/' },
    { label: 'Your Vibe', href: '/your-vibe' },
    { label: 'Library', href: '/library' },
    { label: 'Charts', href: '/charts' },
  ],
  Support: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Copyright / DMCA', href: '/copyright' },
    { label: 'Community Guidelines', href: '/community-guidelines' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="w-full mt-auto"
      style={{
        backgroundColor: '#1F162E',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="grid grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#9B4DE0' }}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9 Q5 4 7 9 Q9 14 11 9 Q13 4 15 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span className="font-display font-bold text-base" style={{ color: 'rgba(255,255,255,0.95)' }}>
                VibeWave
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Music that works with you
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3
                className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-vw hover:opacity-80"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="flex items-center justify-between mt-10 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            &copy; {new Date().getFullYear()} VibeWave. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <select
              className="bg-transparent text-xs border-none outline-none cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              aria-label="Language selector"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}
