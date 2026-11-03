import React, { useState } from 'react';
import { Send, Sparkles, Layers, Globe, Cpu, Image as ImageIcon, Video, ArrowRight, ExternalLink, CheckCircle2, Clock, Terminal, ChevronDown, ChevronUp, Copy, Play } from 'lucide-react';
import { Mission, AgentStep, WebSource, VideoShot } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface MissionDeckProps {
  onRunMission: (prompt: string) => Promise<void>;
  isOrchestrating: boolean;
  currentMission: Mission | null;
  onNavigateToVision?: (initialPrompt?: string, imageUrl?: string) => void;
  onNavigateToVideo?: (initialPrompt?: string, imageUrl?: string) => void;
  onNavigateToWeb?: (query?: string) => void;
}

const SAMPLE_MISSIONS = [
  {
    title: 'Neuromorphic Optical Computing',
    prompt: 'Autonomous investigation of 2026 photonic neuromorphic chips: gather live empirical papers, formulate causal speed-of-light efficiency axioms, render the photonic lattice visual, and direct a 3-shot cinematic video.'
  },
  {
    title: 'Martian Subsurface Biosphere',
    prompt: 'Explore subsurface geothermal aquifer habitats on Mars: retrieve live rover telemetry data, model anaerobic metabolic pathways, generate biome concept art, and direct a cinematic planetary descent video reel.'
  },
  {
    title: 'Autonomous Next-Gen AGI Swarm',
    prompt: 'Investigate multi-agent self-improving cognitive hives: crawl latest multi-agent consensus literature, formalize game-theoretic coordination proofs, render a cybernetic architecture blueprint, and produce a dynamic storyboard video.'
  },
  {
    title: 'Abyssal Deep-Ocean Clean Energy',
    prompt: 'Synthesize thermal gradient harvesting in hydrothermal vents: harvest marine energy research, synthesize thermodynamic Carnot efficiency limits, generate abyssal generator artwork, and direct an underwater explorer video.'
  }
];

export const MissionDeck: React.FC<MissionDeckProps> = ({
  onRunMission,
  isOrchestrating,
  currentMission,
  onNavigateToVision,
  onNavigateToVideo,
  onNavigateToWeb
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [expandedThoughts, setExpandedThoughts] = useState<Record<number, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isOrchestrating) return;
    onRunMission(inputPrompt.trim());
  };

  const handleSelectSample = (samplePrompt: string) => {
    setInputPrompt(samplePrompt);
    onRunMission(samplePrompt);
  };

  const toggleThought = (index: number) => {
    setExpandedThoughts(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Hero Mission Control Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Integrated AGI-Adjacent Multi-Agent Workspace
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dispatch an <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">Autonomous Mission</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              State an open-ended goal. The multi-agent hive autonomously crawls the web for verified facts, reasons through formal constraints, and generates end-to-end visual art & video reels.
            </p>
          </div>

          {/* Prompt Dispatcher Bar */}
          <form onSubmit={handleSubmit} className="relative group">
            <div className="relative flex items-center bg-slate-900/95 border-2 border-slate-700/80 focus-within:border-cyan-500 rounded-2xl shadow-xl transition-all p-2">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Describe your multi-agent mission (e.g. Research fusion power breakthroughs, prove stability criteria, create reactor concept visual, and produce video reel)..."
                rows={3}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm px-3 py-2 outline-none resize-none font-sans"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="self-end pb-1 pr-1">
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isOrchestrating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  {isOrchestrating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Coordinating...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Mission</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Pre-Loaded Autonomous Scenarios */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Quick Autonomous Missions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_MISSIONS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample.prompt)}
                  disabled={isOrchestrating}
                  className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all group flex items-start justify-between gap-2 cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {sample.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {sample.prompt}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active / Current Mission Stream */}
      {currentMission && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white font-mono">
                Cognitive Timeline • {currentMission.title || 'Active Autonomous Run'}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              ID: {currentMission.id}
            </span>
          </div>

          {/* Mission Steps */}
          <div className="space-y-4">
            {currentMission.steps.map((step, idx) => {
              const isThoughtOpen = expandedThoughts[idx] ?? true;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-lg transition-all"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between p-4 bg-slate-950/60 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        {step.type === 'plan' && <Layers className="w-4 h-4" />}
                        {step.type === 'web_search' && <Globe className="w-4 h-4" />}
                        {step.type === 'reasoning' && <Cpu className="w-4 h-4" />}
                        {step.type === 'image_generation' && <ImageIcon className="w-4 h-4" />}
                        {step.type === 'video_generation' && <Video className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {step.agentName}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                            {step.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                      <button
                        onClick={() => toggleThought(idx)}
                        className="p-1 text-slate-400 hover:text-white rounded"
                      >
                        {isThoughtOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Step Body */}
                  {isThoughtOpen && (
                    <div className="p-5 space-y-4">
                      {/* Text / Reasoning output */}
                      {step.content && (
                        <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                          {step.content}
                        </div>
                      )}

                      {/* Web Grounding Citations */}
                      {step.citations && step.citations.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-800/80">
                          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            Live Grounded Web Citations:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {step.citations.map((cite, cIdx) => (
                              <a
                                key={cIdx}
                                href={cite.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                              >
                                <div className="truncate mr-2">
                                  <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                                    {cite.title}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {cite.url}
                                  </p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Result Card */}
                      {step.imageUrl && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5" />
                              Synthesized Visual Concept:
                            </span>
                            <div className="flex items-center gap-2">
                              {onNavigateToVision && (
                                <button
                                  onClick={() => onNavigateToVision(step.prompt, step.imageUrl)}
                                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 cursor-pointer"
                                >
                                  Edit in Vision Studio
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                              {onNavigateToVideo && (
                                <button
                                  onClick={() => onNavigateToVideo(`Animate visual concept: ${step.prompt || currentMission.missionPrompt}`, step.imageUrl)}
                                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30 cursor-pointer"
                                >
                                  Animate in Video Director
                                  <Play className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-96 flex items-center justify-center">
                            <img
                              src={step.imageUrl}
                              alt="Synthesized concept visual"
                              className="w-full h-auto object-cover max-h-96"
                            />
                          </div>
                        </div>
                      )}

                      {/* Video Result Card */}
                      {step.type === 'video_generation' && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5" />
                              Directed Cinematic Video Reel:
                            </span>
                            {onNavigateToVideo && (
                              <button
                                onClick={() => onNavigateToVideo(step.videoPrompt, step.videoPosterUrl)}
                                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 cursor-pointer"
                              >
                                Open Full Reel Editor
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <VideoPlayer
                            videoUrl={step.videoPosterUrl || ''}
                            duration={step.duration || '5s'}
                            shots={step.shots}
                            title={currentMission.title}
                            onExtend={() => {
                              if (onNavigateToVideo) {
                                onNavigateToVideo(`Extend sequence: continue scene with camera flight for ${currentMission.title}`);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Mission Synthesis Box */}
          {currentMission.finalSynthesis && (
            <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/40 p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Autonomous Mission Consensus Reached
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentMission.finalSynthesis}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
