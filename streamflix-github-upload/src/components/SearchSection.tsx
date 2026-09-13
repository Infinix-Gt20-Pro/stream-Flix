'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  X, 
  Flame, 
  Film, 
  Tv, 
  Star, 
  Play, 
  SlidersHorizontal, 
  Zap, 
  Clapperboard,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MediaItem } from '@/data/mockData';

interface SearchSectionProps {
  initialQuery?: string;
  isStandalonePage?: boolean;
}

const TRENDING_SEARCH_CHIPS = [
  { label: '🔥 Stree 2', query: 'Stree 2' },
  { label: '👑 Jawan', query: 'Jawan' },
  { label: '⚔️ Kalki 2898 AD', query: 'Kalki' },
  { label: '⚡ Deadpool & Wolverine', query: 'Deadpool' },
  { label: '🐺 Animal', query: 'Animal' },
  { label: '💥 Fighter', query: 'Fighter' },
  { label: '🎓 3 Idiots', query: '3 Idiots' },
  { label: '😱 Shaitaan', query: 'Shaitaan' },
  { label: '🚀 Interstellar', query: 'Interstellar' },
  { label: '🦇 The Batman', query: 'The Batman' },
  { label: '💥 Kill', query: 'Kill' },
];

export default function SearchSection({ initialQuery = '', isStandalonePage = false }: SearchSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  // 1. Initial Load: Fetch Trending / Recommended Items for the zero-state
  useEffect(() => {
    fetch('/api/tmdb?type=trending')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setTrendingItems(data.items);
        }
      })
      .catch((err) => console.error('Failed to load initial trending:', err));
  }, []);

  // 2. Perform Debounced Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/tmdb?type=search&query=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          startTransition(() => {
            setResults(Array.isArray(data.results) ? data.results : []);
            setIsLoading(false);
          });
        })
        .catch((err) => {
          console.error('Search fetch error:', err);
          setIsLoading(false);
        });
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // 3. Filter Results
  const filteredResults = (query.trim() ? results : trendingItems).filter((item) => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (minRating > 0) {
      const score = (item.matchScore || 0) / 10;
      if (score < minRating) return false;
    }
    return true;
  });

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <section className={`w-full ${isStandalonePage ? 'pt-6 pb-20' : 'py-12'} px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none`}>
      {/* ═══════ Header Badge & Search Bar ═══════ */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        {/* Luminous Title Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/20 border border-brand/40 text-brand shadow-brand-glow backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-brand animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase">Ultra Cinema Search</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase text-shadow-cinematic">
          Find Your Next <span className="text-brand">Masterpiece</span>
        </h1>

        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed">
          Search across thousands of Bollywood, Hollywood, and global cinematic titles with real-time stream resolution.
        </p>

        {/* ═══════ Luminous Glass Search Input ═══════ */}
        <div className="w-full relative mt-2 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand via-rose-600 to-amber-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500 group-focus-within:opacity-75" />
          
          <div className="relative flex items-center bg-[#0d0d12]/90 border border-white/20 group-focus-within:border-brand rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-2xl transition-all">
            <div className="pl-3 pr-2 text-zinc-400 group-focus-within:text-brand transition">
              {isLoading ? (
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-brand" />
              ) : (
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, series, actors (e.g. Stree 2, Jawan, Deadpool)..."
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-white placeholder-zinc-500 focus:outline-none px-2"
              autoFocus={isStandalonePage}
            />

            {query && (
              <button
                onClick={clearSearch}
                className="p-1.5 mr-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {}}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-brand-glow transition transform active:scale-95 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Search
            </button>
          </div>
        </div>

        {/* ═══════ One-Click Trending Search Chips ═══════ */}
        <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-2 justify-start sm:justify-center">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Hot:
          </span>
          {TRENDING_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => setQuery(chip.query)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                query.toLowerCase() === chip.query.toLowerCase()
                  ? 'bg-brand text-white border-brand shadow-brand-glow'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/10 hover:border-brand/40'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ Filter & Sorting Controls ═══════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
            Category:
          </span>
          <div className="flex items-center bg-black/60 rounded-xl p-1 border border-white/10 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                selectedType === 'all' ? 'bg-brand text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                selectedType === 'movie' ? 'bg-brand text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" /> Movies
            </button>
            <button
              onClick={() => setSelectedType('series')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                selectedType === 'series' ? 'bg-brand text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Tv className="w-3 h-3" /> Series
            </button>
          </div>
        </div>

        {/* Rating Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
            Rating:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Any', val: 0 },
              { label: '7.0+ ★', val: 7 },
              { label: '8.0+ ★', val: 8 },
            ].map((r) => (
              <button
                key={r.label}
                onClick={() => setMinRating(r.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                  minRating === r.val
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count Indicator */}
        <div className="text-xs text-zinc-400 font-medium ml-auto">
          {query.trim() ? (
            <span>
              Found <strong className="text-white">{filteredResults.length}</strong> titles matching &ldquo;{query}&rdquo;
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Trending Recommendations ({filteredResults.length})
            </span>
          )}
        </div>
      </div>

      {/* ═══════ Loading Skeletons ═══════ */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-900/80 border border-white/5 animate-pulse flex flex-col justify-end p-4 space-y-2">
              <div className="w-3/4 h-4 bg-white/10 rounded" />
              <div className="w-1/2 h-3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* ═══════ Results Grid ═══════ */}
      {!isLoading && filteredResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredResults.map((item) => {
            const rawId = item.tmdbId || item.id.replace('tmdb-', '');
            const score = item.matchScore ? Math.round(item.matchScore) : 85;
            const starScore = (score / 10).toFixed(1);

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-brand/60 shadow-lg hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Badges Overlays */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-black text-emerald-400">
                      {score}% Match
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-zinc-300 uppercase tracking-wider">
                      {item.type === 'movie' ? 'Movie' : 'Series'}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{starScore}</span>
                  </div>

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Play Action Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <Link
                      href={`/watch/${rawId}`}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-black shadow-brand-glow transition transform scale-90 group-hover:scale-100 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Play Now
                    </Link>
                  </div>
                </div>

                {/* Movie Information Footer */}
                <div className="p-3 bg-gradient-to-b from-zinc-900 to-[#0c0c10] flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand transition line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                      <span>{item.year || '2024'}</span>
                      <span>&bull;</span>
                      <span className="text-zinc-500 uppercase">{item.ageRating || '13+'}</span>
                      <span>&bull;</span>
                      <span className="text-[10px] px-1 bg-white/10 rounded text-zinc-300">4K</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.overview}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════ Empty Results State ═══════ */}
      {!isLoading && filteredResults.length === 0 && query.trim() && (
        <div className="text-center py-16 px-4 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Clapperboard className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white">No exact matches found</h3>
          <p className="text-xs text-zinc-400">
            We couldn&apos;t find any titles matching &ldquo;{query}&rdquo;. Try checking the spelling or explore our trending suggestions below.
          </p>
          <button
            onClick={clearSearch}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
          >
            Clear Search & View Trending
          </button>
        </div>
      )}
    </section>
  );
}
