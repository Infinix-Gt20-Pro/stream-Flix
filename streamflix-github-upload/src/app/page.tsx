import React from 'react';
import Link from 'next/link';
import { 
  getDailyTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getActionSciFiMovies, 
  getNowPlayingMovies,
  getSouthIndianHindiMovies,
  getHollywoodHindiMovies,
  getHorrorComedyMovies,
  TMDBMovie 
} from '@/lib/tmdb';
import TrendingCarousel from '@/components/TrendingCarousel';
import SearchSection from '@/components/SearchSection';
import { Play, Info, Sparkles, Star, Film, Flame, Trophy, Zap, Clapperboard, Boxes, Search, Globe, Skull, Crown } from 'lucide-react';

export default async function Home() {
  let trendingMovies: TMDBMovie[] = [];
  let popularMovies: TMDBMovie[] = [];
  let southMovies: TMDBMovie[] = [];
  let hollywoodMovies: TMDBMovie[] = [];
  let topRatedMovies: TMDBMovie[] = [];
  let actionMovies: TMDBMovie[] = [];
  let horrorMovies: TMDBMovie[] = [];
  let nowPlayingMovies: TMDBMovie[] = [];
  let fetchError: string | null = null;

  try {
    const [trending, popular, south, hollywood, topRated, action, horror, nowPlaying] = await Promise.all([
      getDailyTrendingMovies(),
      getPopularMovies(),
      getSouthIndianHindiMovies(),
      getHollywoodHindiMovies(),
      getTopRatedMovies(),
      getActionSciFiMovies(),
      getHorrorComedyMovies(),
      getNowPlayingMovies(),
    ]);

    trendingMovies = trending;
    popularMovies = popular;
    southMovies = south;
    hollywoodMovies = hollywood;
    topRatedMovies = topRated;
    actionMovies = action;
    horrorMovies = horror;
    nowPlayingMovies = nowPlaying;
  } catch (err: any) {
    console.error('Error fetching TMDB movie collections:', err);
    fetchError = err?.message || 'Failed to load movie collections';
  }

  // Hero Movie: verified released blockbuster with high-res backdrop and guaranteed streaming availability
  const heroMovie = trendingMovies.find((m) => m.backdrop_path && m.vote_count && m.vote_count >= 100)
    || popularMovies.find((m) => m.backdrop_path && m.vote_count && m.vote_count >= 100)
    || trendingMovies[0]
    || popularMovies[0]
    || {
      id: 20453,
      title: '3 Idiots',
      overview: 'Two friends embark on a quest for a lost buddy. On this journey, they reminisce over their college days and the memories of their friend who inspired them to think differently.',
      backdrop_path: '/7c9UVPPiTPltouxShY9gxagLaqF.jpg',
      poster_path: '/66A9MqXOyVFCssoloscw79z8Pew.jpg',
      vote_average: 8.4,
      release_date: '2009-12-23',
    };

  const remainingTrending = trendingMovies.filter((m) => m.id !== heroMovie.id);

  const heroBackdrop = heroMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : heroMovie.poster_path
      ? `https://image.tmdb.org/t/p/original${heroMovie.poster_path}`
      : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop';

  const heroYear = heroMovie.release_date
    ? new Date(heroMovie.release_date).getFullYear()
    : '2026';

  const heroMatch = heroMovie.vote_average
    ? Math.min(99, Math.max(70, Math.round(heroMovie.vote_average * 10)))
    : 96;

  return (
    <div className="min-h-screen bg-[#060608] text-white flex select-none">
      {/* ═══════ Desktop Sidebar ═══════ */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 lg:w-64 glass-sidebar z-40">
        <div className="h-20 flex items-center px-4 lg:px-6 gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-rose-600 flex items-center justify-center font-black text-xl text-white shadow-brand-glow">
            N
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-extrabold tracking-wider text-lg text-white">
              STREAM<span className="text-brand">FLIX</span>
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 font-medium uppercase">
              Ultra Cinema
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 lg:px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          <a
            href="/"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl bg-gradient-to-r from-brand/20 to-brand/5 text-white font-semibold relative group"
          >
            <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-brand rounded-r-full shadow-brand-glow" />
            <Film className="w-5 h-5 text-brand" />
            <span className="hidden lg:inline text-sm">Home & Featured</span>
          </a>

          <Link
            href="/search"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium group"
          >
            <Search className="w-5 h-5 text-zinc-400 group-hover:text-brand transition-transform group-hover:scale-110" />
            <span className="hidden lg:inline text-sm">Search Catalog</span>
          </Link>

          <a
            href="#trending-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Flame className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
            <span className="hidden lg:inline text-sm">Trending Now</span>
          </a>

          <a
            href="#popular-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Star className="w-5 h-5 text-zinc-400 group-hover:text-sky-400" />
            <span className="hidden lg:inline text-sm">Popular Movies</span>
          </a>

          <a
            href="#top-rated-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Trophy className="w-5 h-5 text-zinc-400 group-hover:text-yellow-400" />
            <span className="hidden lg:inline text-sm">Top Rated</span>
          </a>

          <a
            href="#action-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Zap className="w-5 h-5 text-zinc-400 group-hover:text-rose-500" />
            <span className="hidden lg:inline text-sm">Action & Sci-Fi</span>
          </a>

          <a
            href="#now-playing-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Clapperboard className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
            <span className="hidden lg:inline text-sm">In Theaters</span>
          </a>

          <Link
            href="/extensions"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Boxes className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            <span className="hidden lg:inline text-sm">CloudStream Repos</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-bold text-xs text-white shadow">
            TM
          </div>
          <div className="hidden lg:flex flex-col truncate">
            <span className="text-xs font-semibold text-white">TMDB Repos Sync</span>
            <span className="text-[10px] text-emerald-400">Live 100+ Titles</span>
          </div>
        </div>
      </aside>

      {/* ═══════ Main Streaming Area ═══════ */}
      <main className="flex-1 min-w-0 md:pl-20 lg:pl-64 pb-20 md:pb-12 flex flex-col">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 bg-[#060608]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Mobile Logo */}
            <div className="flex md:hidden items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-black text-sm text-white shadow-brand-glow">
                N
              </div>
              <span className="font-black tracking-wider text-base text-white">
                STREAM<span className="text-brand">FLIX</span>
              </span>
            </div>

            {/* Quick Navigation Pills */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar">
              <a href="#trending-section" className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand text-white shadow-brand-glow whitespace-nowrap">
                Trending
              </a>
              <a href="#popular-section" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition whitespace-nowrap">
                Bollywood
              </a>
              <a href="#south-section" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition whitespace-nowrap">
                South Indian
              </a>
              <a href="#hollywood-section" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition whitespace-nowrap">
                Hollywood (Hindi)
              </a>
              <a href="#top-rated-section" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition whitespace-nowrap">
                Top Rated
              </a>
              <a href="#horror-section" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition whitespace-nowrap">
                Horror
              </a>
              <a href="#action-section" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition whitespace-nowrap">
                Action & Sci-Fi
              </a>
              <Link href="/extensions" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-brand/20 border border-white/5 hover:border-brand/40 transition whitespace-nowrap">
                Extensions (88+)
              </Link>
            </div>

            {/* Right Controls: Search Bar & Repos Status */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <Link
                href="/search"
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-brand/20 border border-white/15 hover:border-brand/40 text-zinc-300 hover:text-white transition shadow-sm group"
                title="Search movies and series"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand" />
                <span className="text-xs font-semibold hidden md:inline">Search</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-zinc-400 border border-white/10 hidden lg:inline font-mono">
                  ⌘K
                </span>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Repos Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* ═══════ 1. Hero Section ═══════ */}
        <section className="relative w-full h-[68vh] sm:h-[78vh] lg:h-[85vh] max-h-[880px] overflow-hidden">
          {/* Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center sm:bg-top scale-105 transform transition-transform duration-1000 ease-out"
            style={{ backgroundImage: `url('${heroBackdrop}')` }}
          >
            {/* Dark Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/40 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/75 sm:via-[#060608]/50 to-transparent w-full lg:w-3/4" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#060608] to-transparent" />
          </div>

          {/* Hero Content Container */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24 z-10">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              {/* Featured Pill */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand/25 border border-brand/40 text-brand text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-brand-glow">
                  <Sparkles className="w-3.5 h-3.5 text-brand animate-pulse" />
                  Featured Premiere
                </span>
                <span className="hidden sm:inline text-xs text-zinc-400 font-semibold">
                  TMDB Live Catalog
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase text-shadow-cinematic leading-none">
                {heroMovie.title}
              </h1>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
                <span className="text-emerald-400 font-bold tracking-wide">
                  {heroMatch}% Match
                </span>
                <span className="text-zinc-400">{heroYear}</span>
                <span className="px-1.5 py-0.5 rounded border border-zinc-500/50 bg-black/40 text-zinc-300 text-[11px]">
                  {heroMovie.adult ? '18+' : '13+'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-[10px] font-bold tracking-wider">
                  4K Ultra HD
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-[10px] font-bold tracking-wider">
                  Dolby Atmos
                </span>
              </div>

              {/* Overview Synopsis */}
              <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 text-shadow-cinematic drop-shadow max-w-xl">
                {heroMovie.overview}
              </p>

              {/* Prominent Play and Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/watch/${heroMovie.id}`}
                  className="flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-extrabold text-sm sm:text-base tracking-wide transition transform active:scale-95 shadow-brand-glow"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Play Now
                </Link>

                <Link
                  href={`/watch/${heroMovie.id}`}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-sm sm:text-base tracking-wide border border-white/20 transition transform active:scale-95"
                >
                  <Info className="w-5 h-5 text-zinc-200" />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ Multiple Movie Carousels from Repos ═══════ */}
        <div className="-mt-10 sm:-mt-16 relative z-20 space-y-8 sm:space-y-12">
          {/* 1. Trending Now */}
          <section id="trending-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand rounded-full inline-block shadow-brand-glow" />
                Trending Now
              </h2>
              <span className="text-xs font-semibold text-zinc-400 hover:text-brand transition cursor-pointer">
                Daily Top Releases &rarr;
              </span>
            </div>
            <TrendingCarousel movies={remainingTrending} />
          </section>

          {/* 2. Popular Blockbusters */}
          {popularMovies.length > 0 && (
            <section id="popular-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-sky-500 rounded-full inline-block shadow-md" />
                  Popular Blockbusters
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-sky-400 transition cursor-pointer">
                  Most Watched Worldwide &rarr;
                </span>
              </div>
              <TrendingCarousel movies={popularMovies} />
            </section>
          )}

          {/* 3. South Indian Cinema (Hindi Dubbed) */}
          {southMovies.length > 0 && (
            <section id="south-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block shadow-md" />
                  South Indian Blockbusters (Hindi Dubbed)
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-amber-400 transition cursor-pointer">
                  RRR, KGF, Pushpa, Kalki & More &rarr;
                </span>
              </div>
              <TrendingCarousel movies={southMovies} />
            </section>
          )}

          {/* 4. Hollywood Blockbusters (Hindi / Dual Audio) */}
          {hollywoodMovies.length > 0 && (
            <section id="hollywood-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block shadow-md" />
                  Hollywood in Hindi & Dual Audio
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-purple-400 transition cursor-pointer">
                  Deadpool, Avengers, Batman & More &rarr;
                </span>
              </div>
              <TrendingCarousel movies={hollywoodMovies} />
            </section>
          )}

          {/* 5. Top Rated Movies */}
          {topRatedMovies.length > 0 && (
            <section id="top-rated-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block shadow-md" />
                  Top Rated All-Time Hits
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-yellow-400 transition cursor-pointer">
                  Highest IMDb & TMDB Scores &rarr;
                </span>
              </div>
              <TrendingCarousel movies={topRatedMovies} />
            </section>
          )}

          {/* 6. Action & Sci-Fi Thrillers */}
          {actionMovies.length > 0 && (
            <section id="action-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-rose-500 rounded-full inline-block shadow-md" />
                  Action & Sci-Fi Thrillers
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-rose-400 transition cursor-pointer">
                  High Octane & Future Worlds &rarr;
                </span>
              </div>
              <TrendingCarousel movies={actionMovies} />
            </section>
          )}

          {/* 7. Horror & Supernatural Universe */}
          {horrorMovies.length > 0 && (
            <section id="horror-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block shadow-md" />
                  Horror & Supernatural Thrillers
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition cursor-pointer">
                  Stree, Bhediya, Munjya & More &rarr;
                </span>
              </div>
              <TrendingCarousel movies={horrorMovies} />
            </section>
          )}

          {/* 8. In Theaters Now */}
          {nowPlayingMovies.length > 0 && (
            <section id="now-playing-section" className="px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block shadow-md" />
                  Now Playing in Theaters
                </h2>
                <span className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition cursor-pointer">
                  Current Box Office &rarr;
                </span>
              </div>
              <TrendingCarousel movies={nowPlayingMovies} />
            </section>
          )}

          {/* ═══════ 6. Full Premium Search Section ═══════ */}
          <div id="search-section" className="border-t border-white/10 pt-8">
            <SearchSection />
          </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-16 px-6 py-12 border-t border-white/5 text-zinc-500 text-xs space-y-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-brand" />
            STREAMFLIX Cinema Experience &bull; Live TMDB & CloudStream Multi-Repo
          </div>
          <p>&copy; 2026 Streamflix, Inc. Built with Next.js (App Router), Tailwind CSS & TypeScript.</p>
        </footer>
      </main>
    </div>
  );
}
