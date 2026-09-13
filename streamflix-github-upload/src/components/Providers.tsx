'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  Download, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  Layers,
  Code2,
  Power,
  Check,
  RotateCcw,
  Film,
  Tv,
  Flame,
  Filter,
  Search,
  SlidersHorizontal,
  XCircle,
  Play
} from 'lucide-react';

export interface PluginItem {
  name: string;
  internalName?: string;
  description: string;
  version: number | string;
  apiVersion?: number;
  repositoryUrl?: string;
  url?: string;
  fileSize?: number;
  language?: string;
  status?: number;
  authors?: string[];
  tvTypes?: string[];
}

export interface RepoData {
  name: string;
  description: string;
  manifestVersion: number;
  pluginLists: string[];
  repositories?: any[];
  totalPlugins?: number;
  plugins: PluginItem[];
}

const STORAGE_KEY = 'streamflix_enabled_plugins_v1';

export default function Providers() {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'disabled' | 'movies' | 'hindi' | 'anime'>('all');
  
  // Enabled plugin mapping: { [pluginId]: boolean }
  const [enabledPlugins, setEnabledPlugins] = useState<Record<string, boolean>>({});

  // 1. Fetch Repository Manifest & Plugin Lists
  const fetchRepoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/repo');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data: RepoData = await res.json();
      setRepoData(data);

      // Initialize or load enabled state from localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setEnabledPlugins(JSON.parse(saved));
        } catch (e) {
          initializeDefaults(data.plugins || []);
        }
      } else {
        initializeDefaults(data.plugins || []);
      }
    } catch (err: any) {
      console.error('Error loading repo data:', err);
      setError(err?.message || 'Failed to fetch repository extensions');
    } finally {
      setLoading(false);
    }
  };

  const getPluginId = (p: PluginItem) => p.internalName || p.name;

  const initializeDefaults = (plugins: PluginItem[]) => {
    const initial: Record<string, boolean> = {};
    plugins.forEach((p) => {
      // By default enable all verified plugins
      initial[getPluginId(p)] = true;
    });
    setEnabledPlugins(initial);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {}
  };

  useEffect(() => {
    fetchRepoData();
  }, []);

  // Save to localStorage on changes
  const saveState = (newState: Record<string, boolean>) => {
    setEnabledPlugins(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {}
  };

  // Toggle single plugin ON/OFF
  const togglePlugin = (p: PluginItem) => {
    const id = getPluginId(p);
    const updated = {
      ...enabledPlugins,
      [id]: !isPluginActive(p),
    };
    saveState(updated);
  };

  const isPluginActive = (p: PluginItem): boolean => {
    const id = getPluginId(p);
    return enabledPlugins[id] !== false; // default to true if undefined
  };

  // Bulk Actions
  const enableAll = () => {
    if (!repoData?.plugins) return;
    const updated: Record<string, boolean> = {};
    repoData.plugins.forEach((p) => {
      updated[getPluginId(p)] = true;
    });
    saveState(updated);
  };

  const disableAll = () => {
    if (!repoData?.plugins) return;
    const updated: Record<string, boolean> = {};
    repoData.plugins.forEach((p) => {
      updated[getPluginId(p)] = false;
    });
    saveState(updated);
  };

  const resetRecommended = () => {
    if (!repoData?.plugins) return;
    const updated: Record<string, boolean> = {};
    repoData.plugins.forEach((p) => {
      const name = p.name.toLowerCase();
      // Keep recommended movie & cinema providers active
      const isRecommended = 
        name.includes('movie') ||
        name.includes('stream') ||
        name.includes('flix') ||
        name.includes('phisher') ||
        name.includes('hindi') ||
        name.includes('anidb') ||
        name.includes('wish') ||
        name.includes('vega') ||
        name.includes('hub');
      updated[getPluginId(p)] = isRecommended;
    });
    saveState(updated);
  };

  const handleDownload = (plugin: PluginItem) => {
    setDownloadingId(plugin.name);
    if (plugin.url) {
      window.open(plugin.url, '_blank');
    }
    setTimeout(() => setDownloadingId(null), 2000);
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    return `${(bytes / k).toFixed(1)} KB`;
  };

  // Counts
  const totalCount = repoData?.plugins?.length || 0;
  const activeCount = useMemo(() => {
    if (!repoData?.plugins) return 0;
    return repoData.plugins.filter((p) => isPluginActive(p)).length;
  }, [repoData, enabledPlugins]);

  // Filtering Logic
  const filteredPlugins = useMemo(() => {
    return (repoData?.plugins || []).filter((p) => {
      const active = isPluginActive(p);
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const lang = (p.language || '').toLowerCase();

      // Filter Tab
      if (selectedFilter === 'active' && !active) return false;
      if (selectedFilter === 'disabled' && active) return false;
      if (selectedFilter === 'movies') {
        const isMovie = name.includes('movie') || name.includes('cinema') || name.includes('flix') || name.includes('stream');
        if (!isMovie) return false;
      }
      if (selectedFilter === 'hindi') {
        const isHindi = lang.includes('hi') || name.includes('hindi') || desc.includes('hindi') || name.includes('bolly') || name.includes('desh');
        if (!isHindi) return false;
      }
      if (selectedFilter === 'anime') {
        const isAnime = name.includes('ani') || desc.includes('anime') || name.includes('manga');
        if (!isAnime) return false;
      }

      // Text Query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        name.includes(q) ||
        desc.includes(q) ||
        (p.internalName && p.internalName.toLowerCase().includes(q)) ||
        lang.includes(q)
      );
    });
  }, [repoData, enabledPlugins, selectedFilter, searchQuery]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* ═══════ Top Hero Stats & Manage Badge ═══════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand text-xs font-black uppercase tracking-wider shadow-brand-glow">
              <Boxes className="w-3.5 h-3.5 text-brand" />
              CloudStream Extensions Manager
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {activeCount} Active / {totalCount} Total
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Manage & Toggle <span className="text-brand">Streaming Plugins</span>
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Choose which extensions to enable or disable. Enabled plugins power movie scraper sources, streaming mirrors, and multi-source feeds across the application.
          </p>
        </div>

        {/* Quick Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={enableAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition transform active:scale-95 shadow-sm"
            title="Enable all plugins"
          >
            <Check className="w-3.5 h-3.5" />
            Enable All
          </button>

          <button
            onClick={disableAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-white/15 text-zinc-300 text-xs font-bold transition transform active:scale-95 shadow-sm"
            title="Disable all plugins"
          >
            <XCircle className="w-3.5 h-3.5" />
            Disable All
          </button>

          <button
            onClick={resetRecommended}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand/20 hover:bg-brand/30 border border-brand/40 text-brand text-xs font-bold transition transform active:scale-95 shadow-brand-glow"
            title="Reset to recommended movie streamers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recommended
          </button>

          <button
            onClick={fetchRepoData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
            title="Refresh Manifest"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand' : ''}`} />
          </button>
        </div>
      </div>

      {/* ═══════ Filter Tabs & Real-Time Search Bar ═══════ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'active', label: `🟢 Active (${activeCount})` },
            { id: 'disabled', label: `⚪ Disabled (${totalCount - activeCount})` },
            { id: 'movies', label: '🎬 Movies' },
            { id: 'hindi', label: '👑 Hindi / Bollywood' },
            { id: 'anime', label: '🎌 Anime' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all duration-200 ${
                selectedFilter === tab.id
                  ? 'bg-brand text-white shadow-brand-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Filter Input */}
        <div className="relative flex items-center w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search 144+ plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 rounded-full text-zinc-400 hover:text-white transition"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════ Loading Skeleton View ═══════ */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-zinc-900/60 rounded-2xl p-6 border border-white/5 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="w-16 h-7 rounded-full bg-white/10" />
              </div>
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* ═══════ Error State ═══════ */}
      {!loading && error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-6 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-white font-bold text-base">Failed to Load Extensions</h3>
            <p className="text-xs text-rose-300">{error}</p>
          </div>
          <button
            onClick={fetchRepoData}
            className="px-5 py-2 rounded-xl bg-brand text-white font-semibold text-xs shadow-brand-glow hover:bg-brand-hover transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ═══════ Empty State ═══════ */}
      {!loading && !error && filteredPlugins.length === 0 && (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <Layers className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-white font-bold text-base">No Matching Plugins</h3>
          <p className="text-xs text-zinc-400">
            No extensions match your current query or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold shadow-brand-glow"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ═══════ Interactive Plugin Grid with Toggle Switches ═══════ */}
      {!loading && !error && filteredPlugins && filteredPlugins.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map((plugin, idx) => {
            const active = isPluginActive(plugin);

            return (
              <div
                key={plugin.name || idx}
                className={`group relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                  active
                    ? 'bg-zinc-900/90 hover:bg-zinc-900 border-white/15 hover:border-brand/60 shadow-xl hover:shadow-brand-glow/20'
                    : 'bg-zinc-950/60 border-white/5 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Top Row: Icon, Status Pill & Interactive Toggle */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl transition-all shadow-md ${
                      active
                        ? 'bg-gradient-to-tr from-brand to-rose-600 shadow-brand-glow group-hover:scale-105'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {plugin.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Interactive ON/OFF Switch */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePlugin(plugin)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                          active
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                        }`}
                        title={active ? 'Click to Disable Plugin' : 'Click to Enable Plugin'}
                      >
                        <Power className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-zinc-500'}`} />
                        <span>{active ? 'ACTIVE' : 'OFF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Name & Internal Identifier */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand transition-colors line-clamp-1">
                        {plugin.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-zinc-300">
                        v{plugin.version}
                      </span>
                    </div>

                    {plugin.internalName && (
                      <span className="text-[10px] font-mono text-zinc-500 block truncate">
                        ID: {plugin.internalName}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">
                    {plugin.description || 'Verified streaming scraper and source provider extension.'}
                  </p>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-zinc-400 font-medium">
                    {plugin.language && (
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300 uppercase font-semibold">
                        {plugin.language}
                      </span>
                    )}
                    {plugin.fileSize && (
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300">
                        {formatBytes(plugin.fileSize)}
                      </span>
                    )}
                    {plugin.apiVersion && (
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400">
                        API v{plugin.apiVersion}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  {plugin.repositoryUrl ? (
                    <a
                      href={plugin.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-zinc-500">Verified Repo</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlugin(plugin)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition transform active:scale-95 ${
                        active
                          ? 'bg-white/10 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-300'
                          : 'bg-brand text-white shadow-brand-glow hover:bg-brand-hover'
                      }`}
                    >
                      {active ? 'Turn Off' : 'Turn On'}
                    </button>

                    <button
                      onClick={() => handleDownload(plugin)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                      title="Download APK / CS3 extension bundle"
                    >
                      {downloadingId === plugin.name ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
