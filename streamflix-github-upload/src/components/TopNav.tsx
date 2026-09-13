'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, X, SlidersHorizontal } from 'lucide-react';

interface TopNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function TopNav({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: TopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'trending', label: 'Trending' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'providers', label: 'Providers' },
    { id: 'action', label: 'Sci-Fi & Action' },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060608]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Mobile Brand Logo */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-black text-sm text-white shadow-brand-glow">
            N
          </div>
          <span className="font-black tracking-wider text-base text-white">
            STREAM<span className="text-brand">FLIX</span>
          </span>
        </div>

        {/* Filter Pills (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand text-white shadow-brand-glow'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right side controls: Search bar & Notifications */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search Input Box */}
          <div className="relative flex items-center">
            <div
              className={`flex items-center rounded-full transition-all duration-300 ${
                isSearchOpen || searchQuery
                  ? 'w-48 sm:w-64 bg-white/10 border border-white/20 px-3 py-1.5'
                  : 'w-9 h-9 sm:w-auto sm:px-3 sm:py-1.5 sm:bg-white/5 sm:border sm:border-white/10'
              }`}
            >
              <Search
                className="w-4 h-4 text-zinc-400 cursor-pointer flex-shrink-0"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              <input
                type="text"
                placeholder="Search titles, actors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent text-xs text-white placeholder-zinc-400 focus:outline-none ml-2 w-full ${
                  isSearchOpen || searchQuery ? 'block' : 'hidden sm:block'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Notification Bell (Mobile & Desktop) */}
          <button className="relative p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
          </button>

          {/* Profile Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-bold text-xs text-white shadow ring-1 ring-white/20 cursor-pointer">
            KA
          </div>
        </div>
      </div>

      {/* Mobile Filter Tabs Row */}
      <div className="flex sm:hidden px-4 pb-2.5 gap-2 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition whitespace-nowrap ${
                isSelected
                  ? 'bg-brand text-white shadow-brand-glow'
                  : 'bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
