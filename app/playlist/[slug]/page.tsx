import AppShell from '@/components/layout/app-shell'
import PlaylistDetailPage from '@/components/pages/playlist-detail-page'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <AppShell>
      <PlaylistDetailPage slug={slug} />
    </AppShell>
  )
}
