'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/data/mockData';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title: string;
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  aspectRatio?: 'portrait' | 'landscape';
}

export default function MovieCarousel({
  title,
  items,
  onSelect,
  onPlay,
  aspectRatio = 'portrait',
}: MovieCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    const row = rowRef.current;
    if (row) {
      row.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        row.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative my-6 sm:my-8 px-4 sm:px-6 lg:px-8 space-y-3 group/carousel">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-1.5 h-5 bg-brand rounded-full inline-block shadow-brand-glow" />
          {title}
        </h2>
        <span className="text-xs font-semibold text-zinc-400 hover:text-brand transition cursor-pointer flex items-center gap-1">
          Explore All
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Carousel Container Wrapper with Left/Right Buttons */}
      <div className="relative">
        {/* Left Scroll Button (Desktop) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-brand text-white items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition transform hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Track (Flexbox/Grid with touch swipe & snap) */}
        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-3 px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start flex-none">
              <MovieCard
                item={item}
                onSelect={onSelect}
                onPlay={onPlay}
                aspectRatio={aspectRatio}
              />
            </div>
          ))}
        </div>

        {/* Right Scroll Button (Desktop) */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-brand text-white items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition transform hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  );
}
