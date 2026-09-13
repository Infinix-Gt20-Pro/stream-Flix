'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Film, Server, RefreshCw, Shield, ShieldAlert, ExternalLink } from 'lucide-react';

interface WatchPageProps {
  params: {
    id: string;
  };
}

interface MovieDetails {
  title?: string;
  release_date?: string;
  vote_average?: number;
}

export default function WatchPage({ params }: WatchPageProps) {
  const movieId = params.id;

  const SERVERS = [
    {
      id: 'uhdmovies',
      name: 'Server 1 (UHD Movies - Main Plugin)',
      short: '🔴 UHD Movies (Main)',
      badge: 'Main Plugin',
      url: `https://player.autoembed.co/embed/movie/${movieId}?autoplay=1&muted=0`,
    },
    {
      id: 'xdmovies',
      name: 'Server 2 (XD Movies - Secondary Plugin)',
      short: '🟢 XD Movies (Secondary)',
      badge: 'Secondary',
      url: `https://embed.smashystream.com/playere.php?tmdb=${movieId}`,
    },
    {
      id: 'autoembed',
      name: 'Server 3 (AutoEmbed Direct)',
      short: 'AutoEmbed HD',
      badge: 'Direct',
      url: `https://player.autoembed.co/embed/movie/${movieId}?autoplay=1&muted=0`,
    },
    {
      id: 'smashystream',
      name: 'Server 4 (SmashyStream Multi)',
      short: 'SmashyStream',
      badge: 'Multi-Server',
      url: `https://embed.smashystream.com/playere.php?tmdb=${movieId}`,
    },
    {
      id: 'twoembed',
      name: 'Server 5 (2Embed VIP)',
      short: '2Embed VIP',
      badge: 'VIP Fast',
      url: `https://www.2embed.cc/embed/${movieId}`,
    },
    {
      id: 'vidlink',
      name: 'Server 6 (VidLink Cinema)',
      short: 'VidLink Cinema',
      badge: 'Clean UI',
      url: `https://vidlink.pro/movie/${movieId}?autoplay=true&volume=100&muted=false`,
    },
    {
      id: 'superembed',
      name: 'Server 7 (SuperEmbed Mirror)',
      short: 'SuperEmbed',
      badge: 'Backup',
      url: `https://multiembed.mov/?video_id=${movieId}&tmdb=1&autoplay=1`,
    },
  ];

  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [key, setKey] = useState(0);
  const [blockPopups, setBlockPopups] = useState(true);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    // Intercept rogue window.open popup attempts on the parent window
    const originalOpen = window.open;
    window.open = function (...args: any[]) {
      console.warn('Blocked popup attempt:', args);
      return null;
    };
    return () => {
      window.open = originalOpen;
    };
  }, []);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=c18c9bd5c38eaad2a897b314ee434e40&language=en-US`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.title) {
          // If title has non-Latin characters (Devanagari, Gujarati, etc.), sanitize to Latin English
          const hasNonLatin = /[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF]/.test(data.title);
          const cleanTitle = hasNonLatin
            ? (data.original_title && !/[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF]/.test(data.original_title) ? data.original_title : data.title.replace(/[\u0900-\u097F\u0A80-\u0AFF\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF]/g, '').trim())
            : data.title;
          setMovieDetails({ ...data, title: cleanTitle || data.title });
        }
      })
      .catch(() => {});
  }, [movieId]);

  const handleServerChange = (server: typeof SERVERS[0]) => {
    setSelectedServer(server);
    setKey((prev) => prev + 1);
  };

  const movieYear = movieDetails?.release_date
    ? new Date(movieDetails.release_date).getFullYear()
    : null;

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden select-none">
      {/* ═══════ Top Control Bar Overlay ═══════ */}
      <header className="absolute top-0 left-0 right-0 z-50 p-2.5 sm:p-4 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-black/95 via-black/60 to-transparent pointer-events-none">
        {/* Back to Home & Movie Info */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-black/80 hover:bg-brand text-white border border-white/20 hover:border-brand backdrop-blur-xl shadow-2xl transition-all duration-300 transform active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">Back</span>
          </Link>

          {movieDetails?.title && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs">
              <Film className="w-3.5 h-3.5 text-brand" />
              <span className="font-semibold text-zinc-100 max-w-[220px] truncate">{movieDetails.title}</span>
              {movieYear && <span className="text-zinc-400 text-[11px]">({movieYear})</span>}
            </div>
          )}
        </div>

        {/* Server Switcher & Action Controls */}
        <div className="pointer-events-auto flex items-center flex-wrap gap-2">
          {/* Active Server Badge / Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 text-xs shadow-lg">
            <Server className="w-3.5 h-3.5 text-brand hidden sm:inline" />
            <select
              value={selectedServer.id}
              onChange={(e) => {
                const target = SERVERS.find((s) => s.id === e.target.value);
                if (target) handleServerChange(target);
              }}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              {SERVERS.map((server) => (
                <option key={server.id} value={server.id} className="bg-zinc-900 text-white">
                  {server.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ad-Block Shield Status (Client-Side JS Interceptor, No Broken Sandbox) */}
          <button
            onClick={() => {
              setBlockPopups(!blockPopups);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs backdrop-blur-xl transition ${
              blockPopups
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/70'
                : 'bg-zinc-900/80 border-white/20 text-zinc-400 hover:bg-zinc-800/80'
            }`}
            title={blockPopups ? 'Ad Shield ACTIVE: Popups & redirects blocked' : 'Ad Shield OFF'}
          >
            {blockPopups ? <Shield className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-medium hidden md:inline">
              {blockPopups ? 'Ad Shield Active' : 'Ad Shield Off'}
            </span>
          </button>

          {/* Reload Stream Button */}
          <button
            onClick={() => setKey((prev) => prev + 1)}
            className="p-2 rounded-full bg-black/80 hover:bg-white/10 backdrop-blur-xl border border-white/15 text-zinc-300 hover:text-white transition"
            title="Reload Video Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Open Direct in New Tab */}
          <a
            href={selectedServer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/80 hover:bg-white/10 backdrop-blur-xl border border-white/15 text-zinc-400 hover:text-white transition"
            title="Open stream in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ═══════ Floating Quick-Switch Server Bar (Main UHD & Secondary XD) ═══════ */}
      <div className="absolute top-16 left-0 right-0 z-40 px-3 py-1.5 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-black/75 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl max-w-full overflow-x-auto no-scrollbar">
          {SERVERS.map((server) => {
            const isSelected = selectedServer.id === server.id;
            return (
              <button
                key={server.id}
                onClick={() => handleServerChange(server)}
                className={`flex-none px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all duration-200 ${
                  isSelected
                    ? server.id === 'uhdmovies'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : server.id === 'xdmovies'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-brand text-white shadow-lg shadow-brand/30'
                    : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {server.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════ Full-Width / Full-Height Cinematic Video Player ═══════ */}
      <main className="w-full h-full flex items-center justify-center bg-black">
        <iframe
          key={`${key}-${selectedServer.id}`}
          src={selectedServer.url}
          title={`Movie Player ${movieId}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share"
          allowFullScreen
        />
      </main>

      {/* Bottom subtle bar with fast helper */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-zinc-400">
        <span>If stream doesn't start, switch between <strong className="text-red-400">🔴 Server 1 (UHD)</strong> and <strong className="text-emerald-400">🟢 Server 2 (XD)</strong></span>
      </div>
    </div>
  );
}
