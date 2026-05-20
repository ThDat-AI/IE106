"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { searchMusic } from '@/lib/music-api'
import { useTranslation } from '@/lib/i18n-store'
import { SectionHeader, MusicShelf } from '@/components/ui/vibewave'
import MusicCard from './music-card'
import type { Track } from '@/lib/player-store'

// Mock recommendations with Vietnamese song titles
const CONTINUE_LISTENING_SONGS = [
  {
    id: 'cl-1',
    title: 'Thêm bao nhiêu lâu',
    artist: 'Various Artists',
    album: 'Tiếp tục nghe',
    duration: 240,
  },
  {
    id: 'cl-2',
    title: 'Đi về nhà',
    artist: 'Various Artists',
    album: 'Tiếp tục nghe',
    duration: 220,
  },
  {
    id: 'cl-3',
    title: 'Mang tiền về cho mẹ',
    artist: 'Various Artists',
    album: 'Tiếp tục nghe',
    duration: 260,
  },
  {
    id: 'cl-4',
    title: 'Ngày mai người ta lấy chồng',
    artist: 'Various Artists',
    album: 'Tiếp tục nghe',
    duration: 250,
  },
  {
    id: 'cl-5',
    title: 'Con trai cưng',
    artist: 'Various Artists',
    album: 'Tiếp tục nghe',
    duration: 230,
  },
  {
    id: 'cl-6',
    title: 'Lặng',
    artist: 'Various Artists',
    album: 'Tiếp tục nghe',
    duration: 210,
  },
]

interface ContinueListeningItem {
  id: string
  title: string
  subtitle: string
  type: 'track'
  track?: Track
}

export default function ContinueListeningSection() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<ContinueListeningItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      // Try to fetch real data from iTunes API for each song
      const allTracks: Track[] = []
      
      for (const song of CONTINUE_LISTENING_SONGS) {
        try {
          const results = await searchMusic(song.title, 1)
          if (results.length > 0) {
            allTracks.push(results[0])
          } else {
            // Fallback: create a mock track with generic artwork
            allTracks.push({
              id: song.id,
              title: song.title,
              artist: song.artist,
              album: song.album,
              albumArt: `https://via.placeholder.com/200x200?text=${encodeURIComponent(song.title)}`,
              duration: song.duration,
              url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            })
          }
        } catch (error) {
          console.error(`Error fetching ${song.title}:`, error)
          // Fallback to mock data
          allTracks.push({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            albumArt: `https://via.placeholder.com/200x200?text=${encodeURIComponent(song.title)}`,
            duration: song.duration,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          })
        }
      }

      const items = allTracks.map((track) => ({
        id: track.id,
        title: track.title,
        subtitle: track.artist,
        type: 'track' as const,
        track,
      }))

      setRecommendations(items)
    } catch (error) {
      console.error('Error loading continue listening recommendations:', error)
      
      // Fallback to mock recommendations
      const mockItems = CONTINUE_LISTENING_SONGS.map((song) => ({
        id: song.id,
        title: song.title,
        subtitle: song.artist,
        type: 'track' as const,
        track: {
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          albumArt: `https://via.placeholder.com/200x200?text=${encodeURIComponent(song.title)}`,
          duration: song.duration,
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        },
      }))
      setRecommendations(mockItems)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section aria-labelledby="continue-listening-heading">
        <SectionHeader title={t.continueListening} href="/library/recent" />
        <div className="flex gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 w-40 animate-pulse rounded-lg"
              style={{ backgroundColor: 'var(--vw-surface)' }}
            />
          ))}
        </div>
      </section>
    )
  }

  if (!recommendations.length) {
    return null
  }

  return (
    <section aria-labelledby="continue-listening-heading">
      <SectionHeader title={t.continueListening} href="/library/recent" />
      <MusicShelf>
        {recommendations.map((item) => (
          <MusicCard
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            type={item.type}
            track={item.track}
          />
        ))}
      </MusicShelf>
    </section>
  )
}
