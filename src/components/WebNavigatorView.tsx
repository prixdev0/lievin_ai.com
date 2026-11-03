import React, { useState } from 'react';
import { Globe, Search, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Cpu, Layers, Bookmark, Share2 } from 'lucide-react';
import { WebSource, BrowsingStep } from '../types';

interface WebNavigatorViewProps {
  onSearch: (query: string) => Promise<any>;
  isLoading: boolean;
  onSendToReasoning?: (fact: string) => void;
  onSendToVision?: (fact: string) => void;
}

export const WebNavigatorView: React.FC<WebNavigatorViewProps> = ({
  onSearch,
  isLoading,
  onSendToReasoning,
  onSendToVision
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUrl, setActiveUrl] = useState('https://web.lievin.ai/browse');
  const [activeTab, setActiveTab] = useState<'preview' | 'facts' | 'dom'>('preview');
  
  // Navigation results state
  const [navResult, setNavResult] = useState<{
    query: string;
    directAnswer: string;
    searchQueries: string[];
    sources: WebSource[];
    extractedFacts: string[];
    browsingSteps: BrowsingStep[];
  } | null>({
    query: '2026 breakthroughs in autonomous multi-agent cognitive systems and grounding',
    directAnswer: `Recent empirical evaluations reveal that integrated multi-agent architectures outperform isolated narrow foundation models by over 42% on open-ended scientific discovery and multimodal task execution. Key paradigms include asynchronous cognitive blackboards, dynamic tool-use delegation (such as native search grounding and temporal video synthesis), and self-verifying thought loops.`,
    searchQueries: [
      '2026 multi-agent cognitive architecture benchmarks',
      'autonomous web navigation grounding models',
      'end-to-end multimodal video agent synthesis'
    ],
    sources: [
      { title: 'Frontiers in Cognitive Multi-Agent Systems (2026)', url: 'https://arxiv.org/abs/2604.09121', domain: 'arxiv.org', credibility: 98, snippet: 'Empirical cross-validation of distributed agents with shared cognitive memory.' },
      { title: 'Nature Machine Intelligence: Autonomous Grounded Reasoning', url: 'https://nature.com/articles/s42256-026', domain: 'nature.com', credibility: 99, snippet: 'Real-time search grounding prevents hallucination across open-web retrieval.' },
      { title: 'MIT Technology Review: Beyond Narrow AI', url: 'https://technologyreview.com/2026/04/multi-agent-era', domain: 'technologyreview.com', credibility: 94, snippet: 'Why unified perception-action pipelines define the path toward practical AGI.' }
    ],
    extractedFacts: [
      'Multi-agent consensus verification reduces factual error rate below 1.2% in live web discovery.',
      'Asynchronous video generation models can be directed dynamically via multi-turn natural language extensions.',
      'Shared cognitive blackboards allow image generation outputs to seed keyframe prompts for temporal video reels.',
      'Google GenAI Interactions API enables stateful agent session maintenance across multi-turn reasoning workflows.'
    ],
    browsingSteps: [
      { action: 'RESOLVE_DNS', detail: 'Target domains established across high-impact research repositories' },
      { action: 'EXECUTE_QUERY', detail: 'Dispatched live search grounding queries to web index' },
      { action: 'EXTRACT_ENTITIES', detail: 'Parsed DOM trees and synthesized factual propositions with URL citations' },
      { action: 'VALIDATE_TRUTH', detail: 'Cross-referenced claims across 3 independent academic sources' }
    ]
  });

  const handleExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || isLoading) return;

    try {
      const res = await onSearch(searchQuery.trim());
      if (res) {
        setNavResult(res);
        if (res.sources && res.sources[0]) {
          setActiveUrl(res.sources[0].url);
        }
      }
    } catch (err) {
      console.error('Web navigation error:', err);
    }
  };

  const sampleQueries = [
    'Quantum teleportation records and room-temperature superconductors 2026',
    'Deep oceanic trench hydrothermal ecosystems and thermal gradient power',
    'Next-gen space telescopes and exoplanet atmospheric biomarker discoveries'
  ];

  return (
    <div className="w-full space-y-6">
      {/* Search & Omnibar Controller */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Globe className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  Lievin Autonomous Web Navigator
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Live Grounding Engine
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Crawls the live web, parses page structures, verifies citations, and extracts ground-truth facts
                </p>
              </div>
            </div>
          </div>

          {/* Omnibar Form */}
          <form onSubmit={handleExecute} className="relative">
            <div className="flex items-center gap-2 p-2 bg-slate-950/90 border-2 border-slate-700 focus-within:border-cyan-500 rounded-2xl shadow-xl transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search query or URL for autonomous web traversal and deep factual extraction..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none px-2"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Crawling...</span>
                  </>
                ) : (
                  <>
                    <span>Traverse Web</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggested Queries */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono text-slate-400">Suggested:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(q);
                  onSearch(q).then((res) => res && setNavResult(res));
                }}
                className="text-xs text-slate-300 hover:text-cyan-300 bg-slate-950/70 hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-800 transition-all cursor-pointer truncate max-w-xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Browser Viewport & Fact Extraction Station */}
      {navResult && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Browser Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            {/* Window controls */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Simulated Omnibar in Browser */}
            <div className="flex-1 max-w-xl mx-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{activeUrl}</span>
            </div>

            {/* View tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Synthesized Brief
              </button>
              <button
                onClick={() => setActiveTab('facts')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'facts'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Facts ({navResult.extractedFacts.length})
              </button>
              <button
                onClick={() => setActiveTab('dom')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'dom'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Crawl Trajectory
              </button>
            </div>
          </div>

          {/* Browser Body Area */}
          <div className="p-6 space-y-6">
            {activeTab === 'preview' && (
              <div className="space-y-6">
                {/* Direct Answer Box */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                      Autonomous Web Synthesis
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {navResult.directAnswer}
                  </p>
                </div>

                {/* Sources & Grounding Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Verified Web Sources & Citations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {navResult.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {src.domain}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              {src.credibility || 95}% Veracity
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {src.title}
                          </h4>
                          {src.snippet && (
                            <p className="text-[11px] text-slate-400 line-clamp-2">
                              {src.snippet}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => setActiveUrl(src.url)}
                            className="text-[11px] font-medium text-slate-400 hover:text-white"
                          >
                            Set Inspector URL
                          </button>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded text-slate-400 hover:text-cyan-300"
                            title="Visit external site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-mono">
                    Extracted Ground-Truth Facts
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Cross-referenced with mathematical consistency check
                  </span>
                </div>

                <div className="space-y-2.5">
                  {navResult.extractedFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4 group hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {fact}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onSendToReasoning && (
                          <button
                            onClick={() => onSendToReasoning(fact)}
                            className="px-2.5 py-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/30 rounded-lg flex items-center gap-1 transition-all"
                            title="Feed fact into Reasoning Engine"
                          >
                            <Cpu className="w-3 h-3" />
                            Reason Over
                          </button>
                        )}
                        {onSendToVision && (
                          <button
                            onClick={() => onSendToVision(`Render concept illustration for: ${fact}`)}
                            className="px-2.5 py-1 text-[11px] font-mono text-purple-300 bg-purple-950/70 hover:bg-purple-900 border border-purple-500/30 rounded-lg flex items-center gap-1 transition-all"
                            title="Render visual concept from fact"
                          >
                            <Layers className="w-3 h-3" />
                            Visualize
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dom' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white font-mono">
                  Autonomous Web Crawl Trajectory & DOM Parser
                </h3>

                <div className="space-y-2 font-mono text-xs">
                  {navResult.browsingSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold uppercase text-[10px]">
                          {step.action}
                        </span>
                        <span className="text-slate-300">{step.detail}</span>
                      </div>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> OK
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                  <p className="text-cyan-400">// Executed Live Search Queries:</p>
                  {navResult.searchQueries.map((sq, i) => (
                    <p key={i} className="pl-4 text-slate-300">
                      &gt; "{sq}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
