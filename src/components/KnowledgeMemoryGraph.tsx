import React, { useState } from 'react';
import { Network, Database, Globe, Cpu, Image as ImageIcon, Video, Search, Plus, Download, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import { KnowledgeNode } from '../types';

interface KnowledgeMemoryGraphProps {
  nodes: KnowledgeNode[];
  onInjectNodeToMission?: (text: string) => void;
  onAddCustomNode?: (label: string, summary: string, category: KnowledgeNode['category']) => void;
}

export const KnowledgeMemoryGraph: React.FC<KnowledgeMemoryGraphProps> = ({
  nodes,
  onInjectNodeToMission,
  onAddCustomNode
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeNode['category']>('web_fact');

  const filteredNodes = nodes.filter((node) => {
    const matchesCat = filterCategory === 'all' || node.category === filterCategory;
    const matchesSearch =
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newSummary.trim()) return;
    onAddCustomNode?.(newLabel.trim(), newSummary.trim(), newCategory);
    setNewLabel('');
    setNewSummary('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: KnowledgeNode['category']) => {
    switch (cat) {
      case 'web_fact':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'logic_axiom':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'visual_asset':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'video_sequence':
        return <Video className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: KnowledgeNode['category']) => {
    switch (cat) {
      case 'web_fact':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'logic_axiom':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'visual_asset':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'video_sequence':
        return 'bg-blue-950 text-blue-300 border-blue-800';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Blackboard Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">
                  Lievin Cognitive Blackboard & Memory Graph
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {nodes.length} Entangled Axioms
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Shared stateful blackboard unifying web facts, reasoning proofs, visual assets, and temporal video timeline nodes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Axiom
            </button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(nodes, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lievin-memory-graph.json';
                a.click();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800"
              title="Export memory snapshot"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cognitive memory graph..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All Nodes' },
              { id: 'web_fact', label: 'Web Facts' },
              { id: 'logic_axiom', label: 'Logic Axioms' },
              { id: 'visual_asset', label: 'Visuals' },
              { id: 'video_sequence', label: 'Video Sequences' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterCategory === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getCategoryBadgeClass(
                    node.category
                  )}`}
                >
                  {getCategoryIcon(node.category)}
                  {node.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {(node.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {node.label}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                  {node.summary}
                </p>
              </div>

              {/* Media Preview if attached */}
              {node.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-32 bg-black">
                  <img
                    src={node.mediaUrl}
                    alt={node.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 text-[10px]">
                {new Date(node.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {onInjectNodeToMission && (
                <button
                  onClick={() => onInjectNodeToMission(`Synthesize and expand upon this axiom: "${node.summary}"`)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  <span>Dispatch Mission</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono">
              Insert Knowledge Axiom into Blackboard
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 font-sans">
              <div>
                <label className="text-xs font-mono text-slate-400">Node Label:</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Asynchronous Blackboards in Multi-Agent Swarms"
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="web_fact">Web Grounded Fact</option>
                  <option value="logic_axiom">Logic Axiom / Proof</option>
                  <option value="visual_asset">Visual Concept</option>
                  <option value="video_sequence">Video Sequence</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">Detailed Proposition:</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Detail the verified principle or empirical finding..."
                  rows={3}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold uppercase tracking-wider"
                >
                  Commit to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
