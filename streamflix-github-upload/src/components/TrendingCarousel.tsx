'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Star, Plus, Check } from 'lucide-react';
import { TMDBMovie } from '@/lib/tmdb';

interface TrendingCarouselProps {
  movies: TMDBMovie[];
}

export default function TrendingCarousel({ movies }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [list, setList] = useState<Record<number, boolean>>({});

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [movies]);

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleList = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative group/carousel">
      {/* Left Scroll Arrow (Desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/85 hover:bg-brand text-white items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition transform hover:scale-110 active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
              : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';

          const year = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : '2025';

          const matchScore = movie.vote_average
            ? Math.min(99, Math.max(70, Math.round(movie.vote_average * 10)))
            : 85;

          const isInList = !!list[movie.id];

          return (
            <div
              key={movie.id}
              className="snap-start flex-none group relative cursor-pointer select-none transition-all duration-300"
            >
              {/* Premium Movie Card */}
              <div className="relative overflow-hidden rounded-xl bg-dark-card border border-white/10 shadow-xl transition-all duration-300 group-hover:scale-[1.04] group-hover:border-brand/60 group-hover:shadow-brand-glow/30 w-[150px] sm:w-[185px] md:w-[210px] h-[225px] sm:h-[280px] md:h-[315px]">
                {/* Poster Image */}
                <img
                  src={posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {movie.vote_average ? movie.vote_average.toFixed(1) : '7.5'}
                  </span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 space-y-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate drop-shadow">
                    {movie.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-zinc-300">
                    <span className="font-bold text-emerald-400">
                      {matchScore}% Match
                    </span>
                    <span className="text-zinc-400 font-medium">{year}</span>
                    <span className="px-1.5 py-0.2 rounded border border-white/15 bg-white/5 text-[9px] text-zinc-300 uppercase font-semibold">
                      HD
                    </span>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="pt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/watch/${movie.id}`}
                      className="w-7 h-7 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center shadow-brand-glow transition transform active:scale-90"
                      title="Play"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </Link>

                    <button
                      onClick={(e) => toggleList(movie.id, e)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition active:scale-90 ${
                        isInList
                          ? 'bg-emerald-600/40 border-emerald-500 text-emerald-400'
                          : 'bg-black/60 border-white/30 text-white hover:bg-white/20'
                      }`}
                      title={isInList ? 'Remove from My List' : 'Add to My List'}
                    >
                      {isInList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Scroll Arrow (Desktop) */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/85 hover:bg-brand text-white items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition transform hover:scale-110 active:scale-95"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
