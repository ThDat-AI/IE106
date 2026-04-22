const TEAM = [
  { name: 'Maya Chen', role: 'Co-Founder & CEO', initials: 'MC', color: '#7b3db0' },
  { name: 'Jordan Rivera', role: 'Co-Founder & CTO', initials: 'JR', color: '#4A2D80' },
  { name: 'Sofia Patel', role: 'Head of Design', initials: 'SP', color: '#6B3DA0' },
  { name: 'Marcus Kim', role: 'Head of AI', initials: 'MK', color: '#5A3590' },
  { name: 'Aisha Okonkwo', role: 'Head of Product', initials: 'AO', color: '#7040B0' },
  { name: 'Luca Ferretti', role: 'Head of Music', initials: 'LF', color: '#4D2E75' },
]

const MILESTONES = [
  { year: '2021', event: 'VibeWave founded in San Francisco' },
  { year: '2022', event: 'Launched beta with 50,000 early listeners' },
  { year: '2023', event: 'Introduced AI-powered personalization engine' },
  { year: '2024', event: 'Reached 2 million active listeners globally' },
  { year: '2025', event: 'Launched VibeWave for creators and artists' },
]

const VALUES = [
  {
    title: 'Music first',
    body: 'Every decision starts with the listener. Minimal friction between you and the music you love.',
  },
  {
    title: 'Purposeful design',
    body: 'No element is decorative. Every pixel earns its place in the interface.',
  },
  {
    title: 'Intelligent, not intrusive',
    body: 'AI that learns your taste without surveillance. Personalization with privacy.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-20">

      {/* Hero */}
      <section>
        <h1
          className="font-display font-bold leading-display mb-6"
          style={{ fontSize: 56, color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.2px', lineHeight: 0.96 }}
        >
          About VibeWave
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 680 }}>
          VibeWave is a music streaming platform built for the way people actually listen — in the background, while they work, create, and move through their day. We believe music should start instantly, feel invisible, and get better the longer you use it.
        </p>
      </section>

      {/* Mission */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 48 }}>
        <div
          className="inline-block text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-lg mb-5"
          style={{ backgroundColor: 'rgba(155,77,224,0.12)', color: '#9B4DE0' }}
        >
          Our Mission
        </div>
        <p
          className="font-display font-semibold"
          style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px', lineHeight: 1.2, maxWidth: 720 }}
        >
          &ldquo;To make music the most effortless thing in your day — not an app you have to manage, but an experience that simply works with you.&rdquo;
        </p>
      </section>

      {/* Values */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 48 }}>
        <h2
          className="font-display font-semibold mb-10"
          style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}
        >
          What we stand for
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl p-6"
              style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-9 h-1 rounded-full mb-5"
                style={{ backgroundColor: '#9B4DE0' }}
                aria-hidden="true"
              />
              <h3
                className="font-display font-semibold mb-3"
                style={{ fontSize: 18, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}
              >
                {v.title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 48 }}>
        <h2
          className="font-display font-semibold mb-10"
          style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}
        >
          The team
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-4 rounded-2xl p-5"
              style={{ backgroundColor: '#1F162E', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${member.color}, #9B4DE0)`,
                  border: '2px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                {member.initials}
              </div>
              <div>
                <div
                  className="font-medium"
                  style={{ fontSize: 15, color: 'rgba(255,255,255,0.95)' }}
                >
                  {member.name}
                </div>
                <div
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}
                >
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 48 }}>
        <h2
          className="font-display font-semibold mb-10"
          style={{ fontSize: 28, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.5px' }}
        >
          Our journey
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[72px] top-0 bottom-0 w-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex items-start gap-6">
                <div
                  className="w-16 shrink-0 text-right font-display font-semibold"
                  style={{ fontSize: 13, color: '#9B4DE0', paddingTop: 2 }}
                >
                  {m.year}
                </div>
                {/* Dot */}
                <div className="relative flex items-center justify-center shrink-0" style={{ width: 16, marginTop: 6 }}>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#9B4DE0', border: '2px solid #170F23' }}
                    aria-hidden="true"
                  />
                </div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {m.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
