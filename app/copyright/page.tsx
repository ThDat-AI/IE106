import AppShell from '@/components/layout/app-shell'
import LegalPage from '@/components/pages/legal-page'

export const metadata = {
  title: 'Copyright & DMCA — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <LegalPage
        title="Copyright & DMCA Policy"
        lastUpdated="April 1, 2025"
        sections={[
          {
            id: 'respect',
            heading: '1. Respect for Copyright',
            body: 'VibeWave takes intellectual property rights seriously. All music and content available through our Service is licensed from rights holders. We do not permit users to upload, distribute, or otherwise make available any content that infringes copyright.',
          },
          {
            id: 'licensing',
            heading: '2. Our Licensing Practices',
            body: 'VibeWave operates under direct licensing agreements with major and independent music rights organizations, record labels, and publishers. We pay royalties for all streams in accordance with applicable law and our licensing agreements.',
          },
          {
            id: 'dmca',
            heading: '3. DMCA Takedown Procedure',
            body: 'If you believe that content available on VibeWave infringes your copyright, you may submit a DMCA takedown notice to our designated agent. Your notice must include: (a) identification of the copyrighted work; (b) identification of the infringing material and its location; (c) your contact information; (d) a statement of good faith belief; (e) a statement of accuracy under penalty of perjury; and (f) your physical or electronic signature.',
          },
          {
            id: 'agent',
            heading: '4. Designated Copyright Agent',
            body: 'DMCA notices should be sent to: Copyright Agent, VibeWave Inc., 123 Mission Street, San Francisco, CA 94105. Email: dmca@vibewave.fm. Please use the subject line "DMCA Takedown Request."',
          },
          {
            id: 'counter',
            heading: '5. Counter-Notification',
            body: 'If you believe your content was removed due to a mistake or misidentification, you may submit a counter-notification. Your counter-notice must meet the requirements of 17 U.S.C. § 512(g)(3). We will forward valid counter-notices to the original complainant.',
          },
          {
            id: 'repeat',
            heading: '6. Repeat Infringers',
            body: 'VibeWave will terminate the accounts of users who are determined to be repeat infringers of intellectual property rights, in appropriate circumstances and at VibeWave\'s discretion.',
          },
        ]}
      />
    </AppShell>
  )
}
