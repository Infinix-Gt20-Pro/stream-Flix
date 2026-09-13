import { MediaItem } from '@/data/mockData';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || 'c18c9bd5c38eaad2a897b314ee434e40';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const IMAGE_W500 = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export function formatTmdbItem(raw: any, explicitType?: 'movie' | 'series', rank?: number): MediaItem {
  const isMovie = explicitType ? explicitType === 'movie' : (raw.media_type === 'movie' || !!raw.title);
  const title = raw.title || raw.name || 'Untitled';
  const overview = raw.overview || 'No description available for this title.';
  const releaseDate = raw.release_date || raw.first_air_date || '2025';
  const year = parseInt(releaseDate.split('-')[0], 10) || 2025;
  
  const backdropUrl = raw.backdrop_path 
    ? `${IMAGE_ORIGINAL}${raw.backdrop_path}`
    : raw.poster_path 
      ? `${IMAGE_ORIGINAL}${raw.poster_path}`
      : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop';

  const posterUrl = raw.poster_path
    ? `${IMAGE_W500}${raw.poster_path}`
    : raw.backdrop_path
      ? `${IMAGE_W500}${raw.backdrop_path}`
      : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';

  const voteAverage = typeof raw.vote_average === 'number' ? raw.vote_average : 8.0;
  const matchScore = Math.min(99, Math.max(75, Math.round(voteAverage * 10)));

  const genres = Array.isArray(raw.genre_ids)
    ? raw.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean)
    : ['Cinema', isMovie ? 'Movie' : 'Series'];

  return {
    id: `tmdb-${raw.id}`,
    tmdbId: raw.id,
    title,
    overview,
    backdropUrl,
    posterUrl,
    matchScore,
    ageRating: raw.adult ? '18+' : '16+',
    year,
    duration: isMovie ? '2h 15m' : 'TV Series',
    quality: '4K Ultra HD',
    audio: 'Dolby Atmos',
    genres: genres.length > 0 ? genres : ['Trending', isMovie ? 'Movie' : 'Series'],
    cast: ['Featured Cast', 'Hollywood Ensemble'],
    type: isMovie ? 'movie' : 'series',
    rank,
  };
}

// Fetch helper with API key
async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    with_original_language: 'hi',
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 1800 }, // cache 30 mins
  });

  if (!res.ok) {
    throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// 1. Trending (Movies & TV)
export async function getTrendingMedia(): Promise<MediaItem[]> {
  const data = await fetchFromTmdb('/trending/all/day');
  return (data.results || [])
    .filter((i: any) => i.backdrop_path && i.poster_path)
    .slice(0, 15)
    .map((item: any) => formatTmdbItem(item));
}

// 2. Top 10 Ranked Today
export async function getTop10Ranked(): Promise<MediaItem[]> {
  const data = await fetchFromTmdb('/movie/top_rated');
  return (data.results || [])
    .filter((i: any) => i.poster_path)
    .slice(0, 10)
    .map((item: any, idx: number) => formatTmdbItem(item, 'movie', idx + 1));
}

// 3. Popular Movies
export async function getPopularMovies(): Promise<MediaItem[]> {
  const data = await fetchFromTmdb('/movie/popular');
  return (data.results || [])
    .filter((i: any) => i.backdrop_path && i.poster_path)
    .slice(0, 15)
    .map((item: any) => formatTmdbItem(item, 'movie'));
}

// 4. Popular TV Series
export async function getPopularSeries(): Promise<MediaItem[]> {
  const data = await fetchFromTmdb('/tv/popular');
  return (data.results || [])
    .filter((i: any) => i.backdrop_path && i.poster_path)
    .slice(0, 15)
    .map((item: any) => formatTmdbItem(item, 'series'));
}

// 5. YouTube Trailer Key
export async function getTrailerKey(tmdbId: number, type: 'movie' | 'series'): Promise<string | null> {
  try {
    const endpoint = type === 'movie' ? `/movie/${tmdbId}/videos` : `/tv/${tmdbId}/videos`;
    const data = await fetchFromTmdb(endpoint);
    const videos = data.results || [];
    
    // Prioritize official trailer on YouTube
    const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') ||
                    videos.find((v: any) => v.site === 'YouTube' && v.type === 'Teaser') ||
                    videos.find((v: any) => v.site === 'YouTube');

    return trailer ? trailer.key : null;
  } catch (err) {
    console.error('Error fetching trailer for', tmdbId, err);
    return null;
  }
}

// 6. Search Multi
export async function searchTmdb(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  try {
    const url = `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const qLower = query.toLowerCase().trim();
    return (data.results || [])
      .filter((i: any) => (i.media_type === 'movie' || i.media_type === 'tv' || !i.media_type) && (i.poster_path || i.backdrop_path))
      .sort((a: any, b: any) => {
        const titleA = (a.title || a.name || '').toLowerCase();
        const titleB = (b.title || b.name || '').toLowerCase();
        const exactA = titleA === qLower ? 2 : titleA.startsWith(qLower) ? 1 : 0;
        const exactB = titleB === qLower ? 2 : titleB.startsWith(qLower) ? 1 : 0;
        if (exactA !== exactB) return exactB - exactA;
        return (b.popularity || 0) - (a.popularity || 0);
      })
      .slice(0, 30)
      .map((item: any) => formatTmdbItem(item));
  } catch (err) {
    console.error('searchTmdb error:', err);
    return [];
  }
}

// 7. Complete Homepage Feed
export async function getCompleteFeed() {
  try {
    const [trending, top10, movies, series] = await Promise.all([
      getTrendingMedia(),
      getTop10Ranked(),
      getPopularMovies(),
      getPopularSeries(),
    ]);

    // Choose the most prominent high-scoring title as featured hero
    const hero = trending[0] || movies[0];

    // Attempt to fetch trailer for hero in background
    if (hero?.tmdbId) {
      const trailerKey = await getTrailerKey(hero.tmdbId, hero.type);
      if (trailerKey) hero.trailerKey = trailerKey;
    }

    return {
      hero,
      trending,
      top10,
      movies,
      series,
    };
  } catch (err) {
    console.error('Failed to fetch full TMDB feed:', err);
    return null;
  }
}
