import AppShell from '@/components/layout/app-shell'
import ArtistPage from '@/components/pages/artist-page'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <AppShell>
      <ArtistPage slug={slug} />
    </AppShell>
  )
}
