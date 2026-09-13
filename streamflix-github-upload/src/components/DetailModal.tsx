'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ThumbsUp, 
  Share2,
  Sparkles
} from 'lucide-react';
import { MediaItem } from '@/data/mockData';

interface DetailModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  autoPlay?: boolean;
}

export default function DetailModal({
  item,
  isOpen,
  onClose,
  autoPlay = false,
}: DetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [inList, setInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay, item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-dark-surface rounded-2xl overflow-hidden border border-white/10 shadow-2xl my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-brand text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition transform active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video / Banner Header */}
        <div className="relative w-full h-[280px] sm:h-[420px] bg-black overflow-hidden group">
          <img
            src={item.backdropUrl}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              isPlaying ? 'scale-105 filter brightness-90' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/40 to-black/30" />

          {/* Playing Simulation Banner */}
          {isPlaying && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-brand/80 backdrop-blur-md text-white text-xs font-bold shadow-brand-glow">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              NOW PLAYING PREVIEW
            </div>
          )}

          {/* Media Player Controls Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg">
              {item.title}
            </h2>

            {/* Simulated Player Scrubber if Playing */}
            {isPlaying && (
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand h-full w-1/3 animate-pulse" />
              </div>
            )}

            {/* Player Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-sm transition transform active:scale-95 shadow-brand-glow"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Play Now
                    </>
                  )}
                </button>

                <button
                  onClick={() => setInList(!inList)}
                  className={`p-2.5 rounded-xl border transition active:scale-95 ${
                    inList
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400'
                      : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={inList ? 'In My List' : 'Add to My List'}
                >
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2.5 rounded-xl border transition active:scale-95 ${
                    isLiked
                      ? 'bg-brand/30 border-brand text-brand'
                      : 'bg-white/10 border-white/10 hover:bg-white/20 text-zinc-300'
                  }`}
                  title="Rate"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white transition active:scale-95"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Information Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="text-emerald-400 font-bold">{item.matchScore}% Match</span>
            <span className="text-zinc-400">{item.year}</span>
            <span className="px-2 py-0.5 rounded border border-zinc-600 bg-white/5 text-zinc-300 text-xs">
              {item.ageRating}
            </span>
            <span className="text-zinc-400">{item.duration}</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-bold">
              {item.quality}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-bold">
              {item.audio}
            </span>
          </div>

          {/* Grid: Synopsis + Cast & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {item.overview}
              </p>

              <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
                <div className="flex gap-2">
                  <span className="text-zinc-500 font-semibold w-20">Genres:</span>
                  <span className="text-zinc-300">{item.genres.join(', ')}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-zinc-500 font-semibold w-20">Audio:</span>
                  <span className="text-zinc-300">{item.audio} (English, Hindi, Spanish, Japanese)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-zinc-500 font-semibold w-20">Subtitles:</span>
                  <span className="text-zinc-300">English [CC], Hindi, Spanish, French</span>
                </div>
              </div>
            </div>

            {/* Cast & Crew sidebar column */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-brand">
                Cast & Credits
              </h4>
              <ul className="space-y-1.5 text-zinc-300">
                {item.cast.map((actor) => (
                  <li key={actor} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    {actor}
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] text-zinc-400">Available in Ultra 4K HDR with spatial audio on supported devices.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
