export interface TMDBMovie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  media_type?: string;
  adult?: boolean;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;
  release_date?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'c18c9bd5c38eaad2a897b314ee434e40';

async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}): Promise<TMDBMovie[]> {
  try {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      with_original_language: 'hi',
      ...params,
    });

    const url = `https://api.themoviedb.org/3${endpoint}?${searchParams.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`TMDB ${endpoint} failed with ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error(`Error in TMDB fetch (${endpoint}):`, err);
    return [];
  }
}

function sanitizeTitle(movie: TMDBMovie): TMDBMovie {
  if (!movie || !movie.title) return movie;
  const hasNonLatin = /[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF]/.test(movie.title);
  if (hasNonLatin) {
    if (movie.original_title && !/[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF]/.test(movie.original_title)) {
      return { ...movie, title: movie.original_title };
    }
    const cleaned = movie.title.replace(/[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF]/g, '').trim();
    if (cleaned.length >= 2) return { ...movie, title: cleaned };
  }
  return movie;
}

async function fetchMultiPageFromTmdb(
  endpoint: string,
  params: Record<string, string> = {},
  pageCount = 3
): Promise<TMDBMovie[]> {
  try {
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    const results = await Promise.all(
      pages.map(async (page) => {
        const searchParams = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: String(page),
          ...params,
        });

        const url = `https://api.themoviedb.org/3${endpoint}?${searchParams.toString()}`;
        const res = await fetch(url, {
          next: { revalidate: 1800 },
        });

        if (!res.ok) return [];
        const data = await res.json();
        return (data.results || []) as TMDBMovie[];
      })
    );

    // Deduplicate by ID and sanitize title to English
    const seen = new Set<number>();
    const combined: TMDBMovie[] = [];
    for (const rawItem of results.flat()) {
      const item = sanitizeTitle(rawItem);
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }
    return combined;
  } catch (err) {
    console.error(`Error in multi-page TMDB fetch (${endpoint}):`, err);
    return [];
  }
}

/**
 * 1. Fetches daily trending movies (Hindi + Global Hits - 60+ titles)
 * Filtered by minimum 80 votes so unreleased movies without streams never get picked
 */
export async function getDailyTrendingMovies(): Promise<TMDBMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  const hindiTrending = await fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      sort_by: 'popularity.desc',
      with_original_language: 'hi',
      'primary_release_date.lte': today,
      'vote_count.gte': '80',
    },
    3
  );

  if (hindiTrending.length >= 20) return hindiTrending;

  const globalTrending = await fetchMultiPageFromTmdb('/trending/movie/day', {}, 3);
  return [...hindiTrending, ...globalTrending].slice(0, 60);
}

/**
 * 2. Fetches popular Bollywood blockbusters (60+ titles)
 */
export async function getPopularMovies(): Promise<TMDBMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      sort_by: 'popularity.desc',
      with_original_language: 'hi',
      'primary_release_date.lte': today,
      'vote_count.gte': '80',
    },
    3
  );
}

/**
 * 3. Fetches South Indian Blockbusters (KGF, RRR, Pushpa, Kalki, Salaar, Kantara...) (60+ titles)
 */
export async function getSouthIndianHindiMovies(): Promise<TMDBMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      sort_by: 'popularity.desc',
      with_original_language: 'te|ta|ml|kn',
      'primary_release_date.lte': today,
      'vote_count.gte': '60',
    },
    3
  );
}

/**
 * 4. Fetches Hollywood Blockbusters in Hindi / Dual Audio (Deadpool, Avengers, Batman...) (60+ titles)
 */
export async function getHollywoodHindiMovies(): Promise<TMDBMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      sort_by: 'popularity.desc',
      with_original_language: 'en',
      'primary_release_date.lte': today,
      'vote_count.gte': '80',
    },
    3
  );
}

/**
 * 5. Fetches top rated all-time classics (3 Idiots, DDLJ, Sholay, Lagaan, PK...) (60+ titles)
 */
export async function getTopRatedMovies(): Promise<TMDBMovie[]> {
  return fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      sort_by: 'vote_average.desc',
      with_original_language: 'hi',
      'vote_count.gte': '80',
    },
    3
  );
}

/**
 * 6. Fetches Hindi Action & Sci-Fi Thrillers (60+ titles)
 */
export async function getActionSciFiMovies(): Promise<TMDBMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      with_genres: '28,53,878',
      with_original_language: 'hi',
      sort_by: 'popularity.desc',
      'primary_release_date.lte': today,
      'vote_count.gte': '50',
    },
    3
  );
}

/**
 * 7. Fetches Horror, Supernatural & Mystery Hits (Stree, Bhediya, Munjya, Tumbbad...) (60+ titles)
 */
export async function getHorrorComedyMovies(): Promise<TMDBMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchMultiPageFromTmdb(
    '/discover/movie',
    {
      with_genres: '27,9648',
      with_original_language: 'hi',
      sort_by: 'popularity.desc',
      'primary_release_date.lte': today,
      'vote_count.gte': '40',
    },
    3
  );
}

/**
 * 8. Fetches movies currently in theaters
 */
export async function getNowPlayingMovies(): Promise<TMDBMovie[]> {
  const hindiNow = await fetchMultiPageFromTmdb(
    '/movie/now_playing',
    {
      region: 'IN',
    },
    2
  );

  if (hindiNow.length > 0) return hindiNow;
  return fetchMultiPageFromTmdb('/movie/now_playing', {}, 2);
}
