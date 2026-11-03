import React from 'react';
import { Search, Layers, Globe, Image, Video, Network, Sparkles, Shield, Activity, Compass, Loader2, ArrowRight } from 'lucide-react';
import { ActiveTaskProgress, WorkspaceTab, HybridConfig } from '../types';
import { Sliders, Cpu, Cloud, Check, Key } from 'lucide-react';

export type { WorkspaceTab };

interface HeaderProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  systemStatus: string;
  isOrchestrating?: boolean;
  onOpenHistory?: () => void;
  historyCount?: number;
  activeTask?: ActiveTaskProgress | null;
  onOpenSettings?: () => void;
  hybridConfig?: HybridConfig;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  systemStatus,
  isOrchestrating = false,
  onOpenHistory,
  historyCount = 0,
  activeTask = null,
  onOpenSettings,
  hybridConfig
}) => {
  const tabs = [
    {
      id: 'search-ask' as WorkspaceTab,
      label: 'Search / Ask',
      badge: 'Main',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'mission-deck' as WorkspaceTab,
      label: 'Mission Deck',
      badge: 'Autonomous',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'web-navigator' as WorkspaceTab,
      label: 'Web Navigator',
      badge: 'Browser',
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'multimodal-studio' as WorkspaceTab,
      label: 'Multimodal Studio',
      badge: 'Image + Video',
      icon: <Video className="w-4 h-4" />
    },
    {
      id: 'cognitive-graph' as WorkspaceTab,
      label: 'Memory Graph',
      badge: 'Blackboard',
      icon: <Network className="w-4 h-4" />
    }
  ];

  const isBusy = isOrchestrating || (activeTask && activeTask.isActive);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      {/* 1. Global Multi-Agent Top Progress Bar */}
      <div 
        role="progressbar"
        aria-valuenow={activeTask?.isActive ? Math.round(activeTask.progressPercent) : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative w-full h-[3px] bg-slate-900/90 overflow-hidden shadow-inner"
      >
        {activeTask?.isActive ? (
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-300 transition-all duration-300 ease-out relative"
            style={{ width: `${Math.min(100, Math.max(3, activeTask.progressPercent))}%` }}
          >
            {/* Glowing laser head on the leading edge */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-white/90 shadow-[0_0_12px_#38bdf8,0_0_24px_#06b6d4]" />
            {/* Shimmer pulse across track */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        ) : (
          <div className="h-full w-full bg-slate-800/25" />
        )}
      </div>

      {/* 2. Global Active Task Telemetry Ticker (when active task is in progress) */}
      {activeTask?.isActive && (
        <div className="w-full bg-gradient-to-r from-cyan-950/70 via-slate-900/95 to-sky-950/70 border-b border-cyan-500/25 px-4 py-1.5 backdrop-blur-md transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                {activeTask.taskType}
              </span>

              {activeTask.activeAgentName && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-200/90 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {activeTask.activeAgentName}
                </span>
              )}

              <span className="text-slate-300 text-[11px] truncate max-w-xs md:max-w-md lg:max-w-xl font-mono">
                {activeTask.stageLabel || activeTask.title}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
                {Math.round(activeTask.progressPercent)}%
              </span>
              {activeTask.targetTab && activeTab !== activeTask.targetTab && (
                <button
                  onClick={() => onTabChange(activeTask.targetTab!)}
                  className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer group"
                >
                  <span>View Workspace</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding: Lievin AI */}
          <div className="flex items-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('mission-deck'); }} className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#0a192f] via-[#0284c7]/30 to-[#38bdf8]/20 p-1 border border-cyan-400/30 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:border-cyan-400/60 transition-all">
                <img
                  src="/favicon.svg"
                  alt="Lievin AI Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-white font-mono">
                    LIEVIN<span className="text-cyan-400 font-light ml-1">AI</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    AGI COGNITIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                  Autonomous Multi-Agent Cognitive Ecosystem
                </p>
              </div>
            </a>
          </div>

          {/* Navigation Workspace Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono hidden md:inline-block ${
                        isActive
                          ? 'bg-cyan-500/30 text-cyan-200'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge & Command History Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Hybrid Core Routing Trigger */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer group"
                title="Public Online AI Routing Settings (OpenAI, Anthropic, Gemini)"
              >
                {hybridConfig?.provider === 'openai' ? (
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <Cloud className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline font-mono">OpenAI 4o (Online)</span>
                  </span>
                ) : hybridConfig?.provider === 'anthropic' ? (
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Cloud className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline font-mono">Claude 3.5 (Online)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline font-mono font-medium">Online Cloud: Gemini</span>
                  </span>
                )}
                <Sliders className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            )}

            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer group"
                title="Open Command History & Audit Trail (Ctrl+H)"
              >
                <span className="p-0.5 rounded text-cyan-400 group-hover:rotate-[-15deg] transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                </span>
                <span className="hidden sm:inline">History</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {historyCount}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBusy
                    ? 'bg-cyan-400 animate-ping'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="text-slate-300 hidden md:inline">
                {isBusy && activeTask
                  ? `${Math.round(activeTask.progressPercent)}% Running`
                  : isOrchestrating
                  ? 'Orchestrating...'
                  : '6 Agents Online'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

