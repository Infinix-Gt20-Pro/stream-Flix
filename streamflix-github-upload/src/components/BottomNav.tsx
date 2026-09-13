'use client';

import React from 'react';
import { Home, Flame, Film, Tv, Search } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onSearchClick }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'search', label: 'Search', icon: Search, isAction: true },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Series', icon: Tv },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-bottom-nav z-50 px-2 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.isAction) {
                onSearchClick();
              } else {
                setActiveTab(tab.id);
              }
            }}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 relative group active:scale-95 transition-transform"
          >
            {/* Active Top Accent Glow */}
            {isActive && !tab.isAction && (
              <span className="absolute top-0 w-8 h-1 bg-brand rounded-b-full shadow-brand-glow" />
            )}

            <div className={`p-1 rounded-full transition-colors ${
              isActive ? 'text-brand' : 'text-zinc-400 group-hover:text-zinc-200'
            }`}>
              <Icon className="w-5 h-5" />
            </div>

            <span className={`text-[10px] font-medium tracking-tight ${
              isActive ? 'text-white font-semibold' : 'text-zinc-400'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
