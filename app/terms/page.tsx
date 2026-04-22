import AppShell from '@/components/layout/app-shell'
import LegalPage from '@/components/pages/legal-page'

export const metadata = {
  title: 'Terms of Service — VibeWave',
}

export default function Page() {
  return (
    <AppShell>
      <LegalPage
        title="Terms of Service"
        lastUpdated="April 1, 2025"
        sections={[
          {
            id: 'acceptance',
            heading: '1. Acceptance of Terms',
            body: 'By accessing or using VibeWave ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Service. VibeWave reserves the right to update these terms at any time without prior notice.',
          },
          {
            id: 'account',
            heading: '2. Account Registration',
            body: 'To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to keep your account credentials secure. You are responsible for all activity that occurs under your account. VibeWave reserves the right to terminate accounts that violate these terms.',
          },
          {
            id: 'license',
            heading: '3. License to Use',
            body: 'Subject to these Terms, VibeWave grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes. This license does not include the right to download, copy, sell, sublicense, or otherwise distribute any content from the Service.',
          },
          {
            id: 'content',
            heading: '4. Content and Intellectual Property',
            body: 'All music, artwork, data, and other content made available through VibeWave is owned by VibeWave or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, publicly perform, or create derivative works from any content without express written consent.',
          },
          {
            id: 'subscription',
            heading: '5. Subscription and Billing',
            body: 'VibeWave offers free and paid subscription plans. Paid plans are billed in advance on a monthly or annual basis. You authorize VibeWave to charge your payment method on the applicable billing cycle. Subscriptions automatically renew unless cancelled at least 24 hours before the renewal date.',
          },
          {
            id: 'termination',
            heading: '6. Termination',
            body: 'VibeWave may suspend or terminate your account at any time, with or without cause or notice, including if we reasonably believe you have violated these Terms. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination will do so.',
          },
          {
            id: 'disclaimer',
            heading: '7. Disclaimer of Warranties',
            body: 'The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. VibeWave does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.',
          },
          {
            id: 'limitation',
            heading: '8. Limitation of Liability',
            body: 'To the fullest extent permitted by law, VibeWave and its officers, employees, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service.',
          },
          {
            id: 'governing',
            heading: '9. Governing Law',
            body: 'These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California.',
          },
          {
            id: 'contact',
            heading: '10. Contact',
            body: 'Questions about these Terms should be directed to legal@vibewave.fm.',
          },
        ]}
      />
    </AppShell>
  )
}
