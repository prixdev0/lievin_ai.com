import React, { useState } from 'react';
import { Cpu, Globe, Brain, Image, Video, Terminal, Activity, Zap, CheckCircle2, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { AgentProfile, AgentId } from '../types';

interface AgentSwarmHUDProps {
  agents: AgentProfile[];
  activeAgentId?: AgentId | null;
  onSelectAgent?: (id: AgentId) => void;
  isOrchestrating?: boolean;
}

export const AgentSwarmHUD: React.FC<AgentSwarmHUDProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  isOrchestrating = false
}) => {
  const [inspectAgent, setInspectAgent] = useState<AgentProfile | null>(null);

  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'nexus-coordinator':
        return <Brain className="w-4 h-4" />;
      case 'web-navigator':
        return <Globe className="w-4 h-4" />;
      case 'logic-reasoner':
        return <Cpu className="w-4 h-4" />;
      case 'visual-studio':
        return <Image className="w-4 h-4" />;
      case 'video-director':
        return <Video className="w-4 h-4" />;
      case 'code-sandbox':
        return <Terminal className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md overflow-hidden">
      {/* Background Neural Grid and Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wide uppercase text-white font-mono">
                Cognitive Multi-Agent Hive
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Autonomous Sync Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Coordinated distributed cognition across search, reasoning, image synthesis, and video direction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800">
            <span className="text-slate-500">Latency:</span>
            <span className="text-cyan-400 font-semibold">24ms</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800">
            <span className="text-slate-500">Working Memory:</span>
            <span className="text-purple-400 font-semibold">1.4 MB BlackBoard</span>
          </div>
        </div>
      </div>

      {/* Agents Swarm Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {agents.map((agent) => {
          const isActive = activeAgentId === agent.id || (isOrchestrating && agent.status !== 'idle');
          return (
            <button
              key={agent.id}
              onClick={() => {
                setInspectAgent(agent);
                onSelectAgent?.(agent.id);
              }}
              className={`relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Agent Top Details */}
              <div className="flex items-start justify-between gap-1 mb-2">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                      : 'bg-slate-900 text-slate-400 group-hover:text-cyan-400 border border-slate-800'
                  }`}
                >
                  {getAgentIcon(agent.id)}
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOrchestrating
                        ? 'bg-cyan-400 animate-pulse'
                        : agent.status === 'thinking' || agent.status === 'browsing'
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-1">
                    {agent.model.replace('gemini-', '')}
                  </span>
                </div>
              </div>

              {/* Agent Titles */}
              <div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                  {agent.name}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {agent.role}
                </p>
              </div>

              {/* Status pill bottom */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Status</span>
                <span className={isActive ? 'text-cyan-300 font-semibold' : 'text-slate-400'}>
                  {isOrchestrating ? 'Active' : agent.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Agent Inspector Modal */}
      {inspectAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setInspectAgent(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {getAgentIcon(inspectAgent.id)}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {inspectAgent.name}
                </h4>
                <p className="text-xs font-mono text-cyan-400">
                  Model: {inspectAgent.model}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {inspectAgent.role}
            </p>

            <div className="space-y-2 mb-6 font-mono text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Operational Modality:</span>
                <span className="text-white capitalize">{inspectAgent.id.split('-')[0]}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Cognitive State:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Grounding / Tool Protocol:</span>
                <span className="text-cyan-300">Google Native GenAI v2.4</span>
              </div>
            </div>

            <button
              onClick={() => setInspectAgent(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
