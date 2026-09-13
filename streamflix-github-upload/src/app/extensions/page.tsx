import React from 'react';
import Link from 'next/link';
import Providers from '@/components/Providers';
import { Film, ArrowLeft, Boxes, Sparkles } from 'lucide-react';

export default function ExtensionsPage() {
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

        <nav className="flex-1 py-6 px-3 lg:px-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition font-medium group"
          >
            <Film className="w-5 h-5 text-zinc-400 group-hover:text-brand" />
            <span className="hidden lg:inline text-sm">Movies & Cinema</span>
          </Link>

          <div
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl bg-gradient-to-r from-brand/20 to-brand/5 text-white font-semibold relative"
          >
            <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-brand rounded-r-full shadow-brand-glow" />
            <Boxes className="w-5 h-5 text-brand" />
            <span className="hidden lg:inline text-sm">CloudStream Repos</span>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-rose-600 flex items-center justify-center font-bold text-xs text-white shadow">
            CS
          </div>
          <div className="hidden lg:flex flex-col truncate">
            <span className="text-xs font-semibold text-white">144+ XDA & CloudStream Providers</span>
            <span className="text-[10px] text-emerald-400">Hexated & Master Repos</span>
          </div>
        </div>
      </aside>

      {/* ═══════ Main Content Area ═══════ */}
      <main className="flex-1 min-w-0 md:pl-20 lg:pl-64 pb-20 md:pb-12 flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#060608]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand text-zinc-300 hover:text-white border border-white/10 transition text-xs font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Movies</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition"
              >
                <span>Search Movies</span>
              </Link>
              <span className="px-3 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand text-xs font-bold shadow-brand-glow">
                144+ Plugins Sync
              </span>
            </div>
          </div>
        </header>

        {/* Dedicated Providers Grid View */}
        <div className="pt-4">
          <Providers />
        </div>

        {/* Footer */}
        <footer className="mt-16 px-6 py-12 border-t border-white/5 text-zinc-500 text-xs space-y-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-brand" />
            STREAMFLIX &bull; CloudStream Multi-Repository Hub
          </div>
          <p>&copy; 2026 Streamflix, Inc. Dedicated Extensions Page.</p>
        </footer>
      </main>
    </div>
  );
}
