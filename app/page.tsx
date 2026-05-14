import AppShell from '@/components/layout/app-shell'
import HomePage from '@/components/pages/home-page'
import { searchMusic, searchAlbums } from '@/lib/music-api'

export default async function Page() {
  // Fetch initial data on server side
  const trendingData = await searchMusic('Sơn Tùng M-TP', 4)
  const picksData = await searchMusic('V-Pop Hits 2024', 10)
  
  const albumSearchTerms = ['Hoàng Thùy Linh', 'Đen Vâu', 'Vũ.', 'Mỹ Tâm', 'Sơn Tùng M-TP']
  const randomTerm = albumSearchTerms[Math.floor(Math.random() * albumSearchTerms.length)]
  const albumsData = await searchAlbums(randomTerm, 6)

  return (
    <AppShell>
      <HomePage 
        initialTrending={trendingData} 
        initialQuickPicks={picksData} 
        initialTopAlbums={albumsData} 
      />
    </AppShell>
  )
}
