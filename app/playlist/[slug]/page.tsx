import AppShell from '@/components/layout/app-shell'
import PlaylistDetailPage from '@/components/pages/playlist-detail-page'

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <AppShell>
      <PlaylistDetailPage slug={params.slug} />
    </AppShell>
  )
}
