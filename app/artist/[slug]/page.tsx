import AppShell from '@/components/layout/app-shell'
import ArtistPage from '@/components/pages/artist-page'

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <AppShell>
      <ArtistPage slug={params.slug} />
    </AppShell>
  )
}
