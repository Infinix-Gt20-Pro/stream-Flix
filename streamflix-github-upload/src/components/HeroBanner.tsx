'use client';

import React, { useState } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { MediaItem } from '@/data/mockData';

interface HeroBannerProps {
  featured: MediaItem;
  onPlay: (item: MediaItem) => void;
  onMoreInfo: (item: MediaItem) => void;
}

export default function HeroBanner({ featured, onPlay, onMoreInfo }: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [inList, setInList] = useState(false);

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] lg:h-[82vh] max-h-[850px] overflow-hidden select-none">
      {/* Background Image with Cinematic Grading */}
      <div 
        className="absolute inset-0 bg-cover bg-center sm:bg-top scale-105 transform transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${featured.backdropUrl})` }}
      >
        {/* Multi-layered Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/70 sm:via-[#060608]/50 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060608] to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24 z-10">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          
          {/* Top Series / Original Tag */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand/20 border border-brand/30 text-brand text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-brand-glow">
              <Sparkles className="w-3 h-3 text-brand animate-pulse" />
              Streamflix Original Premiere
            </span>
            <span className="hidden sm:inline text-xs text-zinc-400 font-medium">#1 in Trending Global</span>
          </div>

          {/* Large Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase text-shadow-cinematic leading-none">
            {featured.title}
          </h1>

          {/* Metadata Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
            <span className="text-emerald-400 font-bold tracking-wide">
              {featured.matchScore}% Match
            </span>
            <span className="text-zinc-400">{featured.year}</span>
            <span className="px-1.5 py-0.5 rounded border border-zinc-500/50 bg-black/40 text-zinc-300 text-[11px]">
              {featured.ageRating}
            </span>
            <span className="text-zinc-400">{featured.duration}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-[10px] font-bold tracking-wider">
              {featured.quality}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 text-[10px] font-bold tracking-wider">
              {featured.audio}
            </span>
          </div>

          {/* Synopsis Description */}
          <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 text-shadow-cinematic drop-shadow">
            {featured.overview}
          </p>

          {/* Genres Pills */}
          <div className="hidden sm:flex flex-wrap gap-2 pt-1">
            {featured.genres.map((genre) => (
              <span 
                key={genre}
                className="text-[11px] font-medium text-zinc-400 hover:text-white transition"
              >
                &bull; {genre}
              </span>
            ))}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              onClick={() => onPlay(featured)}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm sm:text-base tracking-wide transition transform active:scale-95 shadow-brand-glow"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>

            {/* More Info Button */}
            <button
              onClick={() => onMoreInfo(featured)}
              className="flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-sm sm:text-base tracking-wide border border-white/15 transition transform active:scale-95 shadow-glass"
            >
              <Info className="w-5 h-5 text-zinc-200" />
              More Info
            </button>

            {/* Add to list quick button */}
            <button
              onClick={() => setInList(!inList)}
              className={`p-3 rounded-xl border transition transform active:scale-95 ${
                inList
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400'
                  : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
              }`}
              title={inList ? 'Remove from My List' : 'Add to My List'}
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Right Controls: Audio Mute & Age Tag */}
      <div className="absolute right-4 sm:right-8 bottom-16 sm:bottom-24 flex items-center gap-3 z-10">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition active:scale-95"
          title={isMuted ? 'Unmute Audio Preview' : 'Mute Audio Preview'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand" />}
        </button>

        <div className="hidden sm:flex items-center bg-black/60 backdrop-blur-md border-l-4 border-brand px-3 py-1.5 text-xs font-bold text-zinc-200">
          <span>{featured.ageRating}</span>
        </div>
      </div>
    </div>
  );
}
