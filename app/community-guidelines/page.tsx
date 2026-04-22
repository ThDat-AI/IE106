import AppShell from '@/components/layout/app-shell'
import LegalPage from '@/components/pages/legal-page'

export const metadata = {
  title: 'Community Guidelines — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <LegalPage
        title="Community Guidelines"
        lastUpdated="April 1, 2025"
        sections={[
          {
            id: 'spirit',
            heading: '1. The VibeWave Spirit',
            body: 'VibeWave is a space for music discovery, expression, and connection. Our community guidelines exist to ensure that experience remains positive, safe, and inclusive for everyone. We ask all members to engage with respect and good faith.',
          },
          {
            id: 'respect',
            heading: '2. Respect Others',
            body: 'Treat all community members, artists, and staff with dignity and respect. Harassment, bullying, threats, and targeted abuse are strictly prohibited. This includes behavior in comments, playlist names, profile bios, and any other user-generated content.',
          },
          {
            id: 'prohibited',
            heading: '3. Prohibited Content',
            body: 'The following content is not permitted on VibeWave: hate speech based on race, ethnicity, religion, gender, sexual orientation, disability, or national origin; content that promotes violence or illegal activity; sexually explicit material; spam or misleading information; and content that infringes intellectual property rights.',
          },
          {
            id: 'authenticity',
            heading: '4. Authenticity',
            body: 'Do not impersonate other users, artists, public figures, or VibeWave staff. Maintain an authentic presence and do not use automated systems to artificially inflate play counts, followers, or engagement.',
          },
          {
            id: 'privacy-community',
            heading: '5. Privacy',
            body: 'Respect the privacy of others. Do not share personal information about other users without their consent, including real names, locations, contact details, or private messages.',
          },
          {
            id: 'reporting',
            heading: '6. Reporting Violations',
            body: 'If you encounter content or behavior that violates these guidelines, please use the in-app report feature or contact support@vibewave.fm. We review all reports and take appropriate action, which may include content removal or account suspension.',
          },
          {
            id: 'enforcement',
            heading: '7. Enforcement',
            body: 'Violations of these guidelines may result in content removal, temporary suspension, or permanent termination of your account, depending on the severity and frequency of the violation. VibeWave reserves the right to make enforcement decisions at its sole discretion.',
          },
        ]}
      />
    </AppShell>
  )
}
