import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Film, Boxes, Flame, Star, Trophy, Zap, Clapperboard } from 'lucide-react';
import SearchSection from '@/components/SearchSection';

interface SearchPageProps {
  searchParams?: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const initialQuery = searchParams?.q || '';

  return (
    <div className="min-h-screen bg-[#060608] text-white flex select-none">
      {/* ═══════ Desktop Sidebar ═══════ */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 lg:w-64 glass-sidebar z-40">
        <div className="h-20 flex items-center px-4 lg:px-6 gap-3 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
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
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 lg:px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          <Link
            href="/"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Film className="w-5 h-5 text-zinc-400" />
            <span className="hidden lg:inline text-sm">Home & Featured</span>
          </Link>

          <Link
            href="/search"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl bg-gradient-to-r from-brand/20 to-brand/5 text-white font-semibold relative group shadow-brand-glow"
          >
            <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-brand rounded-r-full shadow-brand-glow" />
            <span className="w-5 h-5 text-brand flex items-center justify-center">🔍</span>
            <span className="hidden lg:inline text-sm">Search Catalog</span>
          </Link>

          <a
            href="/#trending-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Flame className="w-5 h-5 text-zinc-400 group-hover:text-amber-500" />
            <span className="hidden lg:inline text-sm">Trending Now</span>
          </a>

          <a
            href="/#popular-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Star className="w-5 h-5 text-zinc-400 group-hover:text-sky-400" />
            <span className="hidden lg:inline text-sm">Popular Movies</span>
          </a>

          <a
            href="/#top-rated-section"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Trophy className="w-5 h-5 text-zinc-400 group-hover:text-yellow-400" />
            <span className="hidden lg:inline text-sm">Top Rated</span>
          </a>

          <Link
            href="/extensions"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium"
          >
            <Boxes className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            <span className="hidden lg:inline text-sm">CloudStream Repos</span>
          </Link>
        </nav>
      </aside>

      {/* ═══════ Main Search Container ═══════ */}
      <main className="flex-1 min-w-0 md:pl-20 lg:pl-64 flex flex-col">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 bg-[#060608]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition transform active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Movies</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-xs text-brand font-bold shadow-brand-glow">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                Live Search API
              </div>
            </div>
          </div>
        </header>

        {/* ═══════ Premium Search Section Component ═══════ */}
        <SearchSection initialQuery={initialQuery} isStandalonePage={true} />
      </main>
    </div>
  );
}
