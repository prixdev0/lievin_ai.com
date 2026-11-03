import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  History, X, Play, Edit3, Trash2, Download, Upload, Copy, Check, Search, 
  Layers, Globe, Image as ImageIcon, Video, Cpu, Clock, Sparkles,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ChevronRight,
  Filter, RotateCcw, ArrowUpDown, UserCheck, FileJson, AlertTriangle
} from 'lucide-react';
import { CommandHistoryItem, CommandActionType } from '../types';

interface CommandHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CommandHistoryItem[];
  onRerun: (item: CommandHistoryItem) => void;
  onEditAndRun: (newPrompt: string, originalItem: CommandHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onImportHistory?: (items: CommandHistoryItem[], mode: 'merge' | 'replace') => void;
}

const AGENT_OPTIONS = [
  { id: 'all', label: 'All Agents' },
  { id: 'Nexus Meta-Synthesizer', label: 'Nexus Coordinator' },
  { id: 'Lievin Web Navigator', label: 'Web Navigator' },
  { id: 'Deep Cognitive Reasoner', label: 'Logic Reasoner' },
  { id: 'Lievin Vision Studio', label: 'Vision Studio' },
  { id: 'Temporal Video Director', label: 'Video Director' }
];

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Types' },
  { id: 'mission', label: 'Autonomous Missions', icon: Layers },
  { id: 'search', label: 'Web Searches', icon: Globe },
  { id: 'vision', label: 'Visual Studio', icon: ImageIcon },
  { id: 'video', label: 'Video Director', icon: Video },
  { id: 'reasoning', label: 'Deep Reasoning', icon: Cpu }
];

export const CommandHistoryDrawer: React.FC<CommandHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRerun,
  onEditAndRun,
  onClearHistory,
  onDeleteItem,
  onImportHistory
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<{
    items: CommandHistoryItem[];
    fileName: string;
    count: number;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Keyboard shortcut: close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const hasActiveFilters = filterType !== 'all' || filterAgent !== 'all' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setFilterType('all');
    setFilterAgent('all');
    setSearchQuery('');
  };

  const filteredHistory = useMemo(() => {
    const queryLower = searchQuery.toLowerCase().trim();

    return history
      .filter((item) => {
        // Filter by Mission/Action Type
        const matchesType = filterType === 'all' || item.type === filterType;

        // Filter by Agent involved
        const matchesAgent =
          filterAgent === 'all' ||
          (item.agentsInvolved &&
            item.agentsInvolved.some((ag) => ag.toLowerCase().includes(filterAgent.toLowerCase())));

        // Filter by Search Query
        const matchesSearch =
          queryLower === '' ||
          item.prompt.toLowerCase().includes(queryLower) ||
          (item.summary && item.summary.toLowerCase().includes(queryLower)) ||
          (item.agentsInvolved && item.agentsInvolved.some((a) => a.toLowerCase().includes(queryLower)));

        return matchesType && matchesAgent && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [history, filterType, filterAgent, searchQuery, sortOrder]);

  const getActionIcon = (type: CommandActionType) => {
    switch (type) {
      case 'mission':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'search':
        return <Globe className="w-4 h-4 text-sky-400" />;
      case 'vision':
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-blue-400" />;
      case 'reasoning':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getActionBadgeClass = (type: CommandActionType) => {
    switch (type) {
      case 'mission':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'search':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'vision':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'video':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'reasoning':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-750';
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (item: CommandHistoryItem) => {
    setEditingItemId(item.id);
    setEditedPrompt(item.prompt);
  };

  const handleSaveAndRun = (item: CommandHistoryItem) => {
    if (!editedPrompt.trim()) return;
    onEditAndRun(editedPrompt.trim(), item);
    setEditingItemId(null);
  };

  // 1. Export Command History as JSON
  const handleExportJSON = () => {
    try {
      const exportPayload = {
        exportVersion: '1.0',
        exportedAt: new Date().toISOString(),
        platform: 'Lievin AI Cognitive Multi-Agent Ecosystem',
        totalCommands: history.length,
        commands: history
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `lievin-cognitive-archive-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage({
        type: 'success',
        text: `Exported ${history.length} cognitive workflow records to JSON file.`
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Export failed: ${err.message || 'Unknown error'}`
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // 2. Trigger Import File Dialog
  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // 3. Handle File Selection and Parsing
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let candidateList: any[] = [];
        if (Array.isArray(parsed)) {
          candidateList = parsed;
        } else if (parsed && Array.isArray(parsed.commands)) {
          candidateList = parsed.commands;
        } else if (parsed && Array.isArray(parsed.history)) {
          candidateList = parsed.history;
        } else {
          throw new Error('Unrecognized JSON schema. Expected an array of commands or an object containing a "commands" array.');
        }

        // Validate and sanitize items
        const validItems: CommandHistoryItem[] = candidateList
          .filter((item) => item && typeof item === 'object' && (item.prompt || item.query))
          .map((item, idx) => ({
            id: String(item.id || `imported-${Date.now()}-${idx}`),
            type: (['mission', 'search', 'vision', 'video', 'reasoning'].includes(item.type)
              ? item.type
              : 'mission') as CommandActionType,
            prompt: String(item.prompt || item.query || '').trim(),
            timestamp:
              item.timestamp && !isNaN(new Date(item.timestamp).getTime())
                ? item.timestamp
                : new Date().toISOString(),
            status: item.status === 'failed' ? 'failed' : item.status === 'in_progress' ? 'in_progress' : 'completed',
            agentsInvolved: Array.isArray(item.agentsInvolved) ? item.agentsInvolved : ['Lievin AI Collective'],
            summary: item.summary ? String(item.summary) : undefined,
            parameters: item.parameters && typeof item.parameters === 'object' ? item.parameters : undefined,
            resultId: item.resultId ? String(item.resultId) : undefined
          }));

        if (validItems.length === 0) {
          setStatusMessage({
            type: 'error',
            text: 'No valid cognitive command records found in this JSON file.'
          });
          setTimeout(() => setStatusMessage(null), 4500);
          return;
        }

        setPendingImport({
          items: validItems,
          fileName: file.name,
          count: validItems.length
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: `Import failed: ${err.message || 'Invalid JSON file structure.'}`
        });
        setTimeout(() => setStatusMessage(null), 5000);
      } finally {
        if (e.target) e.target.value = '';
      }
    };

    reader.onerror = () => {
      setStatusMessage({
        type: 'error',
        text: 'Failed to read file from disk.'
      });
      setTimeout(() => setStatusMessage(null), 4500);
      if (e.target) e.target.value = '';
    };

    reader.readAsText(file);
  };

  // 4. Confirm Import (Merge or Replace)
  const handleConfirmImport = (mode: 'merge' | 'replace') => {
    if (!pendingImport) return;

    if (onImportHistory) {
      onImportHistory(pendingImport.items, mode);
    }

    setStatusMessage({
      type: 'success',
      text: `Successfully ${mode === 'merge' ? 'merged' : 'restored'} ${pendingImport.count} cognitive workflow commands.`
    });
    setTimeout(() => setStatusMessage(null), 4000);

    setPendingImport(null);
  };

  // Helper: Text highlight for search matches
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-cyan-500/30 text-cyan-200 rounded px-0.5 font-semibold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-950 border-l border-cyan-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <History className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white font-mono">
                      Command History
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {history.length} Logged
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Track, edit, import/export, and re-run past user commands and agent missions
                  </p>
                </div>
              </div>

              {/* Top Quick Actions (Export, Import, Close) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportJSON}
                  disabled={history.length === 0}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Export History JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleTriggerImport}
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Import History JSON"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Toast Banner */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all animate-in fade-in ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                    : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : statusMessage.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="p-1 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Pending Import Confirmation Dialog */}
            {pendingImport && (
              <div className="p-4 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 shadow-xl space-y-3 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                    <FileJson className="w-4 h-4 text-cyan-400" />
                    <span>Import Cognitive Workflow Archive</span>
                  </div>
                  <button
                    onClick={() => setPendingImport(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Detected <strong className="text-cyan-300">{pendingImport.count} command operations</strong> in{' '}
                  <span className="font-mono text-white underline">{pendingImport.fileName}</span>. How would you like to restore them?
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                  <button
                    onClick={() => handleConfirmImport('merge')}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Merge with Current
                  </button>
                  <button
                    onClick={() => handleConfirmImport('replace')}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Replace Archive
                  </button>
                  <button
                    onClick={() => setPendingImport(null)}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands by prompt, keyword, or summary..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips Cluster: Row 1 - By Mission / Operation Type */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  Filter by Type:
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset Filters
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {TYPE_OPTIONS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = filterType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setFilterType(t.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
                      }`}
                    >
                      {Icon && <Icon className="w-3 h-3 shrink-0" />}
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Chips Cluster: Row 2 - By Agent Involved */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <UserCheck className="w-3 h-3 text-purple-400" />
                Filter by Agent:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {AGENT_OPTIONS.map((a) => {
                  const isSelected = filterAgent === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setFilterAgent(a.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
                      }`}
                    >
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Results Summary & Sort Toggle */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>
                Showing <strong className="text-slate-300">{filteredHistory.length}</strong> of {history.length} logged operations
              </span>

              <button
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 cursor-pointer"
                title="Toggle sort order"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Drawer Main Body (Scrollable list of commands) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <History className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-300">
                  No Command History Found
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {hasActiveFilters
                    ? 'No operations matched your active filters or search keyword.'
                    : 'Dispatch a mission or import a cognitive JSON archive to begin.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-900 transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <button
                    onClick={handleTriggerImport}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON Archive</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isEditing = editingItemId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group shadow-md"
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getActionBadgeClass(
                            item.type
                          )}`}
                        >
                          {getActionIcon(item.type)}
                          <span>{item.type}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>

                      {/* Top Action Pills (Copy & Delete) */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(item.id, item.prompt)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Copy prompt"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete command"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Prompt View or Inline Edit Mode */}
                    {isEditing ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={editedPrompt}
                          onChange={(e) => setEditedPrompt(e.target.value)}
                          rows={3}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-cyan-500 text-xs text-white outline-none resize-none font-sans"
                          placeholder="Edit your prompt..."
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveAndRun(item)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-slate-950" />
                            <span>Launch Edited</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                          {renderHighlightedText(item.prompt, searchQuery)}
                        </p>

                        {/* Agents Involved Badges with Filter click */}
                        {item.agentsInvolved && item.agentsInvolved.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-mono text-slate-500">Agents:</span>
                            {item.agentsInvolved.map((agent, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => setFilterAgent(agent)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-950 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                                title={`Filter by ${agent}`}
                              >
                                {agent}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Outcome Summary */}
                        {item.summary && (
                          <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-850 line-clamp-2">
                            {renderHighlightedText(item.summary, searchQuery)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Footer for this command */}
                    {!isEditing && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Prompt</span>
                        </button>

                        <button
                          onClick={() => {
                            onRerun(item);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-cyan-300" />
                          <span>Re-run Command</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Actions (Export, Import & Clear History) */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                disabled={history.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                title="Download full audit log as a JSON file"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleTriggerImport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Restore or merge previously exported command history JSON"
              >
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Import JSON</span>
              </button>
            </div>

            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-400">Clear all?</span>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                disabled={history.length === 0}
                className="flex items-center gap-1 text-rose-400/80 hover:text-rose-400 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
