/**
 * Spotify API Integration Utility
 * This module provides functions to interact with the Spotify Web API.
 * 
 * Documentation: https://developer.spotify.com/documentation/web-api/
 */

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = '';
let tokenExpiration = 0;

/**
 * Gets a Spotify access token using the Client Credentials flow.
 * Note: This token is for application-level access (searching, getting tracks),
 * not user-level access (play history, private playlists).
 */
export async function getSpotifyToken() {
  // Return cached token if it's still valid (with 1 minute buffer)
  if (accessToken && Date.now() < tokenExpiration - 60000) {
    return accessToken;
  }

  if (!client_id || !client_secret) {
    console.error('Missing Spotify Client ID or Secret in environment variables.');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Spotify Token Error:', data.error);
      return null;
    }

    accessToken = data.access_token;
    // Set expiration time (current time + expires_in seconds)
    tokenExpiration = Date.now() + data.expires_in * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return null;
  }
}

/**
 * Helper to make authenticated requests to Spotify API
 */
async function spotifyFetch(endpoint: string) {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Spotify API Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Spotify Fetch Error:', error);
    return null;
  }
}

/**
 * Search for tracks on Spotify
 */
export async function searchSpotifyTracks(query: string, limit = 20) {
  const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
  if (!data || !data.tracks) return [];

  return data.tracks.items.map((track: any) => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '',
    duration: Math.floor(track.duration_ms / 1000),
    url: track.preview_url, // Spotify preview URLs can be null
    spotify_url: track.external_urls.spotify,
  }));
}

/**
 * Get new releases from Spotify
 */
export async function getNewReleases(limit = 20) {
  const data = await spotifyFetch(`/browse/new-releases?limit=${limit}`);
  if (!data || !data.albums) return [];

  return data.albums.items.map((album: any) => ({
    id: album.id,
    title: album.name,
    artist: album.artists.map((a: any) => a.name).join(', '),
    albumArt: album.images[0]?.url || '',
    type: album.album_type,
    release_date: album.release_date,
    spotify_url: album.external_urls.spotify,
  }));
}
/**
 * Search for albums on Spotify
 */
export async function searchSpotifyAlbums(query: string, limit = 10) {
  const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`);
  if (!data || !data.albums) return [];

  return data.albums.items.map((album: any) => ({
    id: album.id,
    title: album.name,
    artist: album.artists.map((a: any) => a.name).join(', '),
    albumArt: album.images[0]?.url || '',
    type: album.album_type,
    release_date: album.release_date,
    spotify_url: album.external_urls.spotify,
  }));
}
