export interface ITunesTrack {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl100: string
  previewUrl: string
  trackTimeMillis: number
}

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumArt: string
  duration: number
  url: string
  lyrics?: string
}

export async function searchMusic(term: string, limit = 20, country = 'VN'): Promise<Track[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}&country=${country}`
    )

    if (response.status === 429) {
      console.error('iTunes API rate limit exceeded (429).')
      return []
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse iTunes response:', text)
      return []
    }
    
    if (!data.results) return []

    return data.results.map((item: ITunesTrack) => ({
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      artworkUrl100: item.artworkUrl100,
      albumArt: item.artworkUrl100.replace('100x100', '600x600'),
      duration: Math.floor(item.trackTimeMillis / 1000),
      url: item.previewUrl,
    }))
  } catch (error) {
    console.error('Error fetching from iTunes:', error)
    return []
  }
}

export async function searchAlbums(term: string, limit = 10, country = 'VN'): Promise<any[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=${limit}&country=${country}`
    )

    if (response.status === 429) {
      console.error('iTunes API rate limit exceeded (429).')
      return []
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse iTunes response:', text)
      return []
    }
    
    if (!data.results) return []

    return data.results.map((item: any) => ({
      id: String(item.collectionId),
      title: item.collectionName,
      artist: item.artistName,
      albumArt: item.artworkUrl100.replace('100x100', '600x600'),
      type: 'album',
      release_date: item.releaseDate,
    }))
  } catch (error) {
    console.error('Error fetching albums from iTunes:', error)
    return []
  }
}

export async function searchTracks(term: string, limit = 20, country = 'VN'): Promise<Track[]> {
  return searchMusic(term, limit, country)
}

export async function getTopSongsByRegion(region: string = 'VN', limit = 20): Promise<Track[]> {
  const terms: Record<string, string> = {
    'VN': 'V-Pop',
    'global': 'Top Hits',
    'us': 'Billboard Hot 100',
    'uk': 'UK Top 40'
  }
  
  const countryCodes: Record<string, string> = {
    'vn': 'VN',
    'global': 'US',
    'us': 'US',
    'uk': 'GB'
  }

  return searchMusic(terms[region.toUpperCase()] || 'Top Hits', limit, countryCodes[region.toLowerCase()] || 'US')
}

export async function getArtistTracks(artistName: string, limit = 10): Promise<Track[]> {
  return searchMusic(artistName, limit, 'VN')
}

export async function searchArtistImage(artistName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=1`
    )

    if (response.status === 429) {
      console.error('iTunes API rate limit exceeded (429).')
      return ''
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse iTunes artist response:', text)
      return ''
    }
    
    if (data.results.length === 0) {
      const songResponse = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=1`
      )
      
      const songText = await songResponse.text()
      let songData
      try {
        songData = JSON.parse(songText)
      } catch (e) {
        console.error('Failed to parse iTunes song response:', songText)
        return ''
      }

      if (songData.results.length > 0) {
        return songData.results[0].artworkUrl100.replace('100x100', '600x600')
      }
    } else {
      const songResponse = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=1`
      )
      
      const songText = await songResponse.text()
      let songData
      try {
        songData = JSON.parse(songText)
      } catch (e) {
        console.error('Failed to parse iTunes song response:', songText)
        return ''
      }

      if (songData.results.length > 0) {
        return songData.results[0].artworkUrl100.replace('100x100', '600x600')
      }
    }
    return ''
  } catch (error) {
    console.error('Error fetching artist image:', error)
    return ''
  }
}

export async function fetchLyrics(artist: string, title: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
    
    if (response.status === 429) {
      console.error('Lyrics API rate limit exceeded (429).')
      return null
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse lyrics response:', text)
      return null
    }
    return data.lyrics || null
  } catch (error) {
    console.error('Error fetching lyrics:', error)
    return null
  }
}

export function getMockLyrics(title: string, artist: string): string {
  return `[00:00.00] ${title} - ${artist}\n` +
         `[00:05.00] (Real-time lyrics from lyrics.ovh are currently unavailable for this track)\n` +
         `[00:10.00] VibeWave is bringing you the best music experience.\n` +
         `[00:15.00] Enjoy the rhythm and the flow.\n` +
         `[00:20.00] Vietnamese music is rising high.\n` +
         `[00:25.00] From Đen Vâu to Sơn Tùng M-TP.\n` +
         `[00:30.00] We support all your favorite artists.\n` +
         `[00:35.00] Keep listening and stay vibing.\n` +
         `[00:40.00] VibeWave: Your music, your way.`
}
