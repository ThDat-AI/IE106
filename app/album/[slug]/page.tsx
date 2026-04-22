import AppShell from '@/components/layout/app-shell'
import AlbumDetailPage from '@/components/pages/album-detail-page'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <AppShell>
      <AlbumDetailPage slug={slug} />
    </AppShell>
  )
}
