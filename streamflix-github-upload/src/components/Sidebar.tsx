'use client';

import React from 'react';
import { 
  Home, 
  Flame, 
  Film, 
  Tv, 
  Bookmark, 
  Search, 
  Bell, 
  Boxes 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onSearchClick }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Series', icon: Tv },
    { id: 'providers', label: 'Providers', icon: Boxes },
    { id: 'my-list', label: 'My List', icon: Bookmark },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 lg:w-64 glass-sidebar z-40 transition-all duration-300 select-none">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center px-4 lg:px-6 gap-3 border-b border-white/5">
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
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 lg:px-4 space-y-1.5 overflow-y-auto no-scrollbar">
        {/* Search button in sidebar */}
        <button
          onClick={onSearchClick}
          className="w-full flex items-center gap-4 px-3.5 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition group"
          title="Search"
        >
          <Search className="w-5 h-5 transition-transform group-hover:scale-110 text-zinc-400 group-hover:text-brand" />
          <span className="hidden lg:inline text-sm font-medium">Quick Search</span>
        </button>

        <div className="my-3 border-t border-white/5" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-xl transition relative group ${
                isActive
                  ? 'bg-gradient-to-r from-brand/20 to-brand/5 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              {/* Active neon accent pill */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-brand rounded-r-full shadow-brand-glow" />
              )}
              <Icon 
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-brand' : 'text-zinc-400 group-hover:text-zinc-200'
                }`} 
              />
              <span className="hidden lg:inline text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Profile / Bottom Actions */}
      <div className="p-3 lg:p-4 border-t border-white/5 space-y-2">
        <button 
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition"
          title="Notifications"
        >
          <div className="relative">
            <Bell className="w-5 h-5 text-zinc-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full" />
          </div>
          <span className="hidden lg:inline text-xs text-zinc-400">Notifications</span>
        </button>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-bold text-xs text-white shadow">
            KA
          </div>
          <div className="hidden lg:flex flex-col text-left truncate">
            <span className="text-xs font-semibold text-white truncate">Kashan A.</span>
            <span className="text-[10px] text-zinc-400">Premium Ultra 4K</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
