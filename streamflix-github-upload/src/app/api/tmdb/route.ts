import { NextResponse } from 'next/server';
import { 
  getCompleteFeed, 
  getTrailerKey, 
  searchTmdb, 
  getTrendingMedia, 
  getPopularMovies, 
  getPopularSeries, 
  getTop10Ranked 
} from '@/services/tmdb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'feed';

    if (type === 'feed') {
      const feed = await getCompleteFeed();
      if (!feed) {
        return NextResponse.json({ error: 'Failed to assemble feed from TMDB' }, { status: 500 });
      }
      return NextResponse.json(feed);
    }

    if (type === 'trailer') {
      const id = parseInt(searchParams.get('id') || '0', 10);
      const mediaType = (searchParams.get('mediaType') || 'movie') as 'movie' | 'series';
      if (!id) {
        return NextResponse.json({ error: 'Missing media id' }, { status: 400 });
      }
      const trailerKey = await getTrailerKey(id, mediaType);
      return NextResponse.json({ trailerKey });
    }

    if (type === 'search') {
      const query = searchParams.get('query') || '';
      const results = await searchTmdb(query);
      return NextResponse.json({ results });
    }

    if (type === 'trending') {
      const items = await getTrendingMedia();
      return NextResponse.json({ items });
    }

    if (type === 'movies') {
      const items = await getPopularMovies();
      return NextResponse.json({ items });
    }

    if (type === 'series') {
      const items = await getPopularSeries();
      return NextResponse.json({ items });
    }

    if (type === 'top10') {
      const items = await getTop10Ranked();
      return NextResponse.json({ items });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('TMDB route error:', error);
    return NextResponse.json(
      { error: 'Internal TMDB Error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
