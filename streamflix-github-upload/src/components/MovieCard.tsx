'use client';

import React, { useState } from 'react';
import { Play, Plus, Check, Info } from 'lucide-react';
import { MediaItem } from '@/data/mockData';

interface MovieCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  aspectRatio?: 'portrait' | 'landscape';
}

export default function MovieCard({
  item,
  onSelect,
  onPlay,
  aspectRatio = 'portrait',
}: MovieCardProps) {
  const [inList, setInList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isPortrait = aspectRatio === 'portrait';
  const imageUrl = isPortrait ? item.posterUrl : item.backdropUrl;

  return (
    <div
      className="group relative flex-none cursor-pointer select-none transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item)}
    >
      {/* Card Body with fixed dimensions and aspect ratio */}
      <div
        className={`relative overflow-hidden rounded-xl bg-dark-card border border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:border-brand/50 ${
          isPortrait
            ? 'w-[145px] sm:w-[170px] md:w-[190px] h-[220px] sm:h-[255px] md:h-[285px]'
            : 'w-[230px] sm:w-[280px] md:w-[320px] h-[140px] sm:h-[170px] md:h-[190px]'
        }`}
      >
        {/* Poster / Backdrop Image */}
        <img
          src={imageUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Quality Badge on Top Right */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-zinc-300 border border-white/10">
            {item.quality}
          </span>
        </div>

        {/* Bottom Card Content */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end space-y-1.5 transition-all">
          <h3 className="font-bold text-xs sm:text-sm text-white truncate drop-shadow">
            {item.title}
          </h3>

          <div className="flex items-center justify-between text-[11px] text-zinc-300">
            <span className="font-bold text-emerald-400">
              {item.matchScore}% Match
            </span>
            <span className="px-1 py-0.2 rounded border border-white/20 text-[10px] text-zinc-400">
              {item.ageRating}
            </span>
            <span className="text-zinc-400">{item.duration}</span>
          </div>

          {/* Quick Action Bar shown on Hover or Mobile Tap */}
          <div className="pt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(item);
                }}
                className="w-7 h-7 rounded-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center shadow-brand-glow transition transform active:scale-90"
                title="Play"
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInList(!inList);
                }}
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition active:scale-90 ${
                  inList
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400'
                    : 'bg-black/60 border-white/30 text-white hover:bg-white/20'
                }`}
                title="Add to List"
              >
                {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="w-7 h-7 rounded-full bg-black/60 border border-white/30 text-zinc-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition"
              title="More info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
