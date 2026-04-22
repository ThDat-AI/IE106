import AppShell from '@/components/layout/app-shell'
import AlbumDetailPage from '@/components/pages/album-detail-page'

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <AppShell>
      <AlbumDetailPage slug={params.slug} />
    </AppShell>
  )
}
