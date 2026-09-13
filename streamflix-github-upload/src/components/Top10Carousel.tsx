'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MediaItem } from '@/data/mockData';

interface Top10CarouselProps {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
}

export default function Top10Carousel({ items, onSelect, onPlay }: Top10CarouselProps) {
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
    <section className="relative my-8 sm:my-10 px-4 sm:px-6 lg:px-8 space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="w-1.5 h-5 bg-brand rounded-full inline-block shadow-brand-glow" />
          Top 10 Movies & Series Today
        </h2>
        <span className="text-xs font-semibold text-zinc-400 hover:text-brand transition cursor-pointer flex items-center gap-1">
          Explore All
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-brand text-white items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Top 10 Track */}
        <div
          ref={rowRef}
          className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, index) => {
            const rank = item.rank || index + 1;
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="snap-start flex-none relative flex items-end cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.03]"
              >
                {/* Giant Netflix-style Rank Typography */}
                <span
                  className="font-black text-7xl sm:text-9xl tracking-tighter leading-none select-none text-zinc-800 -mr-6 sm:-mr-8 z-0 transition-colors group-hover:text-brand"
                  style={{
                    WebkitTextStroke: '2px rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {rank}
                </span>

                {/* Poster Card */}
                <div className="relative z-10 w-[125px] sm:w-[155px] md:w-[175px] h-[190px] sm:h-[235px] md:h-[265px] rounded-xl overflow-hidden bg-dark-card border border-white/10 shadow-xl group-hover:border-brand/60 group-hover:shadow-brand-glow transition-all">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

                  {/* Badges on card */}
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 rounded bg-brand text-white text-[10px] font-black uppercase tracking-wider shadow">
                      TOP 10
                    </span>
                  </div>

                  {/* Card Title & Match */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 space-y-1">
                    <p className="text-xs font-bold text-white truncate drop-shadow">
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-300">
                      <span className="text-emerald-400 font-bold">{item.matchScore}% Match</span>
                      <span className="text-zinc-400">{item.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-brand text-white items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  );
}
