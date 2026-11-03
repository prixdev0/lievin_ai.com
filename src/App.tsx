import React, { useState, useEffect, useCallback } from 'react';
import { Header, WorkspaceTab } from './components/Header';
import { SearchAskView } from './components/SearchAskView';
import { AgentSwarmHUD } from './components/AgentSwarmHUD';
import { MissionDeck } from './components/MissionDeck';
import { WebNavigatorView } from './components/WebNavigatorView';
import { MultimodalStudio } from './components/MultimodalStudio';
import { KnowledgeMemoryGraph } from './components/KnowledgeMemoryGraph';
import { CommandHistoryDrawer } from './components/CommandHistoryDrawer';
import { HybridSettingsModal } from './components/HybridSettingsModal';
import { AgentProfile, Mission, KnowledgeNode, AgentId, CommandHistoryItem, CommandActionType, ActiveTaskProgress, HybridConfig, OperationalFieldId } from './types';
import { Compass, Sparkles, Shield, Cpu, ExternalLink, Globe } from 'lucide-react';

const INITIAL_AGENTS: AgentProfile[] = [
  {
    id: 'nexus-coordinator',
    name: 'Nexus Meta-Synthesizer',
    role: 'Decomposes intent, delegates sub-goals & maintains cognitive blackboard',
    model: 'gemini-3.8-flash',
    color: '#38bdf8',
    accentColor: 'cyan',
    avatarIcon: 'brain',
    status: 'idle',
    metrics: { tasksCompleted: 14, tokensProcessed: 32000, latencyMs: 28 }
  },
  {
    id: 'web-navigator',
    name: 'Lievin Web Navigator',
    role: 'Autonomous live search grounding, DOM parsing & factual verification',
    model: 'gemini-3.8-flash',
    color: '#06b6d4',
    accentColor: 'teal',
    avatarIcon: 'globe',
    status: 'idle',
    metrics: { tasksCompleted: 22, tokensProcessed: 48500, latencyMs: 34 }
  },
  {
    id: 'logic-reasoner',
    name: 'Deep Cognitive Reasoner',
    role: 'High-order multi-step reasoning, hypotheses validation & formal logic',
    model: 'gemini-3.8-flash',
    color: '#818cf8',
    accentColor: 'indigo',
    avatarIcon: 'cpu',
    status: 'idle',
    metrics: { tasksCompleted: 18, tokensProcessed: 59000, latencyMs: 42 }
  },
  {
    id: 'visual-studio',
    name: 'Lievin Vision Studio',
    role: 'End-to-end concept art, instructional inpainting & aesthetic vectoring',
    model: 'gemini-3.1-flash-lite-image',
    color: '#c084fc',
    accentColor: 'purple',
    avatarIcon: 'image',
    status: 'idle',
    metrics: { tasksCompleted: 11, tokensProcessed: 27000, latencyMs: 58 }
  },
  {
    id: 'video-director',
    name: 'Temporal Video Director',
    role: 'Text/Image-to-video, multi-turn shot editing & cinematic reel timeline',
    model: 'gemini-omni-1.1-flash',
    color: '#38bdf8',
    accentColor: 'sky',
    avatarIcon: 'video',
    status: 'idle',
    metrics: { tasksCompleted: 9, tokensProcessed: 78000, latencyMs: 110 }
  },
  {
    id: 'code-sandbox',
    name: 'Cognitive Execution Engine',
    role: 'Deterministic algorithmic validation, SVG math & simulation sandbox',
    model: 'gemini-3.8-flash',
    color: '#34d399',
    accentColor: 'emerald',
    avatarIcon: 'terminal',
    status: 'idle',
    metrics: { tasksCompleted: 16, tokensProcessed: 19500, latencyMs: 22 }
  }
];

const INITIAL_KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'node-1',
    label: 'Lievin Unified Cognitive Blackboard',
    category: 'logic_axiom',
    summary: 'Decoupled multi-agent architecture where agents read and write state asynchronously to prevent bottlenecking and enable emergent reasoning.',
    confidence: 0.98,
    timestamp: new Date().toISOString()
  },
  {
    id: 'node-2',
    label: 'Live Web Grounding Protocol',
    category: 'web_fact',
    summary: 'Native Google Search grounding eliminates hallucinations by binding empirical domain citations directly into generation steps.',
    sourceUrl: 'https://arxiv.org',
    confidence: 0.99,
    timestamp: new Date().toISOString()
  },
  {
    id: 'node-3',
    label: 'Temporal Video Continuity Chaining',
    category: 'video_sequence',
    summary: 'Using previous interaction states to extend 5s camera shots into 10s-40s coherent multi-shot narrative reels.',
    confidence: 0.96,
    timestamp: new Date().toISOString()
  },
  {
    id: 'node-4',
    label: 'Instructional Neural Inpainting',
    category: 'visual_asset',
    summary: 'Iterative natural-language image editing preserving seed composition while introducing new thematic elements.',
    confidence: 0.97,
    timestamp: new Date().toISOString()
  }
];

const INITIAL_COMMAND_HISTORY: CommandHistoryItem[] = [
  {
    id: 'cmd-1',
    type: 'mission',
    prompt: 'Autonomous investigation of 2026 photonic neuromorphic chips: gather live empirical papers, formulate causal speed-of-light efficiency axioms, render the photonic lattice visual, and direct a 3-shot cinematic video.',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'completed',
    agentsInvolved: ['Nexus Meta-Synthesizer', 'Lievin Web Navigator', 'Deep Cognitive Reasoner', 'Lievin Vision Studio', 'Temporal Video Director'],
    summary: 'Resolved 4-agent concurrent stream with 3 academic citations and 5s temporal video reel.'
  },
  {
    id: 'cmd-2',
    type: 'search',
    prompt: 'How do integrated multi-agent cognitive blackboards surpass narrow foundation models?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'completed',
    agentsInvolved: ['Lievin Web Navigator'],
    summary: 'Live Google Search Grounding across arxiv.org, nature.com, and technologyreview.com with 98% veracity.'
  },
  {
    id: 'cmd-3',
    type: 'vision',
    prompt: 'An autonomous quantum optical processor core pulsing with cyan coherent laser beams in a vacuum chamber',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'completed',
    agentsInvolved: ['Lievin Vision Studio'],
    summary: 'Rendered 16:9 master concept art with Cinematic Photorealism lighting and cyan volumetric glow.'
  },
  {
    id: 'cmd-4',
    type: 'video',
    prompt: 'Cinematic sequence of an autonomous cybernetic explorer navigating an alien crystalline cavern',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    status: 'completed',
    agentsInvolved: ['Temporal Video Director'],
    summary: 'Directed 5s multi-shot cinematic video reel with camera pan and orbital subject tracking.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('search-ask');
  const [agents, setAgents] = useState<AgentProfile[]>(INITIAL_AGENTS);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>(INITIAL_KNOWLEDGE_NODES);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [activeTask, setActiveTask] = useState<ActiveTaskProgress | null>(null);

  // Command History Drawer state
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('lievin_command_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COMMAND_HISTORY;
  });
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Public Online Engine state (persisted 100% locally in localStorage as lievin_provider & lievin_api_key)
  const [hybridConfig, setHybridConfig] = useState<HybridConfig>(() => {
    try {
      const stored = localStorage.getItem('lievin_hybrid_config');
      const legacyProvider = localStorage.getItem('lievin_provider');
      const legacyKey = localStorage.getItem('lievin_api_key');

      let parsed: HybridConfig = stored ? JSON.parse(stored) : {
        provider: 'gemini',
        openaiKey: '',
        anthropicKey: '',
        geminiKey: '',
        modelId: 'gemini-3.8-flash',
        webGpuSupported: false,
        webGpuDevice: 'Online Public Cloud Active (Local WebGPU Deprecated)',
        preloadModel: false,
        freeTierActive: true,
        freeApiKey: 'LIEVIN-FREE-CORE-2026-UNLIMITED-GLOBAL-BRAIN'
      };

      // Disallow local-webgpu: Deprecated
      if (parsed.provider === 'local-webgpu' || legacyProvider === 'LOCAL') {
        parsed.provider = 'gemini';
        localStorage.setItem('lievin_provider', 'GEMINI');
      }

      if (legacyProvider === 'OPENAI') {
        parsed.provider = 'openai';
        if (legacyKey) parsed.openaiKey = legacyKey;
      } else if (legacyProvider === 'ANTHROPIC') {
        parsed.provider = 'anthropic';
        if (legacyKey) parsed.anthropicKey = legacyKey;
      }

      return parsed;
    } catch {}
    return {
      provider: 'gemini',
      openaiKey: '',
      anthropicKey: '',
      geminiKey: '',
      modelId: 'gemini-3.8-flash',
      webGpuSupported: false,
      webGpuDevice: 'Online Public Cloud Active (Local WebGPU Deprecated)',
      preloadModel: false,
      freeTierActive: true,
      freeApiKey: 'LIEVIN-FREE-CORE-2026-UNLIMITED-GLOBAL-BRAIN'
    };
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync commandHistory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lievin_command_history', JSON.stringify(commandHistory));
    } catch {}
  }, [commandHistory]);

  // Global Ctrl+H / Cmd+H shortcut to toggle drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsHistoryDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addHistoryItem = useCallback((
    type: CommandActionType,
    prompt: string,
    agentsInvolved: string[],
    summary?: string,
    parameters?: Record<string, any>
  ) => {
    const newItem: CommandHistoryItem = {
      id: `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      prompt,
      timestamp: new Date().toISOString(),
      status: 'completed',
      agentsInvolved,
      summary,
      parameters
    };
    setCommandHistory((prev) => [newItem, ...prev.slice(0, 49)]);
  }, []);

  // Cross-tab transfer parameters
  const [visionSeedPrompt, setVisionSeedPrompt] = useState<string>('');
  const [visionSeedImage, setVisionSeedImage] = useState<string>('');

  // Fetch initial system status
  useEffect(() => {
    fetch('/api/system/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'online') {
          console.log('[Lievin AI] Multi-Agent Core Online:', data);
        }
      })
      .catch((err) => console.warn('Status check notice:', err));
  }, []);

  // 1. Run Autonomous Mission
  const handleRunMission = async (prompt: string) => {
    setIsOrchestrating(true);
    setActiveTask({
      isActive: true,
      taskType: 'mission',
      title: prompt,
      stageLabel: 'Step 1/5: Nexus Meta-Synthesizer decomposing mission intent...',
      progressPercent: 14,
      activeAgentId: 'nexus-coordinator',
      activeAgentName: 'Nexus Meta-Synthesizer',
      targetTab: 'mission-deck'
    });

    // Update agents to active states
    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: a.id === 'nexus-coordinator' ? 'thinking' : 'idle'
      }))
    );

    // Initial placeholder mission while running
    const newMissionId = `mission-${Date.now()}`;
    const initialMissionObj: Mission = {
      id: newMissionId,
      title: prompt.slice(0, 48) + '...',
      missionPrompt: prompt,
      timestamp: new Date().toISOString(),
      status: 'in_progress',
      steps: [
        {
          agentId: 'nexus-coordinator',
          agentName: 'Nexus Meta-Synthesizer',
          type: 'plan',
          timestamp: new Date().toISOString(),
          content: `Intent Analysis initialized: Decomposing "${prompt}" across web grounding, formal logic synthesis, concept visual rendering, and temporal video direction.`,
          status: 'running'
        }
      ]
    };
    setCurrentMission(initialMissionObj);

    try {
      // Step-by-step agent activation simulation
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => (a.id === 'web-navigator' ? { ...a, status: 'browsing' } : a))
        );
        setActiveTask((prev) => prev ? {
          ...prev,
          progressPercent: 38,
          stageLabel: 'Step 2/5: Lievin Web Navigator executing live Google Search grounding...',
          activeAgentId: 'web-navigator',
          activeAgentName: 'Lievin Web Navigator'
        } : null);
      }, 700);

      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => (a.id === 'logic-reasoner' ? { ...a, status: 'thinking' } : a))
        );
        setActiveTask((prev) => prev ? {
          ...prev,
          progressPercent: 62,
          stageLabel: 'Step 3/5: Deep Cognitive Reasoner verifying formal hypotheses & causal axioms...',
          activeAgentId: 'logic-reasoner',
          activeAgentName: 'Deep Cognitive Reasoner'
        } : null);
      }, 1500);

      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === 'visual-studio' ? { ...a, status: 'rendering' } : a.id === 'video-director' ? { ...a, status: 'directing' } : a
          )
        );
        setActiveTask((prev) => prev ? {
          ...prev,
          progressPercent: 84,
          stageLabel: 'Step 4/5: Vision Studio & Video Director synthesizing visual concepts & reels...',
          activeAgentId: 'visual-studio',
          activeAgentName: 'Lievin Vision Studio'
        } : null);
      }, 2400);

      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission: prompt, autonomous: true })
      });

      const data = await response.json();
      if (data && data.steps) {
        const completedMission: Mission = {
          id: data.missionId || newMissionId,
          title: prompt.slice(0, 52),
          missionPrompt: prompt,
          timestamp: data.timestamp || new Date().toISOString(),
          status: 'completed',
          steps: data.steps,
          finalSynthesis: data.finalSynthesis
        };
        setCurrentMission(completedMission);

        // Store new knowledge node from mission
        const newKnowledge: KnowledgeNode = {
          id: `node-${Date.now()}`,
          label: `Mission: ${prompt.slice(0, 32)}...`,
          category: 'logic_axiom',
          summary: data.finalSynthesis || `Autonomous synthesis executed across web, vision, and video models.`,
          confidence: 0.98,
          timestamp: new Date().toISOString()
        };
        setKnowledgeNodes((prev) => [newKnowledge, ...prev]);

        // Record mission in Command History
        addHistoryItem(
          'mission',
          prompt,
          ['Nexus Meta-Synthesizer', 'Lievin Web Navigator', 'Deep Cognitive Reasoner', 'Lievin Vision Studio', 'Temporal Video Director'],
          data.finalSynthesis ? data.finalSynthesis.slice(0, 160) + '...' : 'Autonomous multi-agent concurrent mission completed.'
        );

        setActiveTask((prev) => prev ? {
          ...prev,
          progressPercent: 100,
          stageLabel: 'Step 5/5: Mission synthesis completed & indexed in Memory Graph',
          activeAgentId: 'nexus-coordinator',
          activeAgentName: 'Nexus Meta-Synthesizer'
        } : null);
        setTimeout(() => setActiveTask(null), 1200);
      }
    } catch (err) {
      console.error('Mission error:', err);
      setActiveTask(null);
    } finally {
      setIsOrchestrating(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' })));
    }
  };

  // 2. Web Navigation Search
  const handleWebSearch = async (query: string) => {
    setIsSearchingWeb(true);
    setActiveTask({
      isActive: true,
      taskType: 'search',
      title: query,
      stageLabel: 'Lievin Web Navigator: Google Search Grounding & page DOM crawling...',
      progressPercent: 20,
      activeAgentId: 'web-navigator',
      activeAgentName: 'Lievin Web Navigator',
      targetTab: 'web-navigator'
    });

    setAgents((prev) =>
      prev.map((a) => (a.id === 'web-navigator' ? { ...a, status: 'browsing' } : a))
    );

    const progressTimer = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev || !prev.isActive || prev.progressPercent >= 90) return prev;
        return {
          ...prev,
          progressPercent: Math.min(92, prev.progressPercent + 18),
          stageLabel: prev.progressPercent > 50 
            ? 'Lievin Web Navigator: Extracting empirical facts & verifiable citations...' 
            : prev.stageLabel
        };
      });
    }, 380);

    try {
      const response = await fetch('/api/web/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      clearInterval(progressTimer);

      if (data.extractedFacts && data.extractedFacts.length > 0) {
        const factNode: KnowledgeNode = {
          id: `fact-${Date.now()}`,
          label: `Web Fact: ${query.slice(0, 30)}`,
          category: 'web_fact',
          summary: data.extractedFacts[0],
          sourceUrl: data.sources?.[0]?.url,
          confidence: 0.97,
          timestamp: new Date().toISOString()
        };
        setKnowledgeNodes((prev) => [factNode, ...prev]);
      }

      // Record in Command History
      addHistoryItem(
        'search',
        query,
        ['Lievin Web Navigator'],
        data.directAnswer ? data.directAnswer.slice(0, 150) + '...' : 'Grounded web search completed with citations.'
      );

      setActiveTask((prev) => prev ? {
        ...prev,
        progressPercent: 100,
        stageLabel: 'Web Grounding complete: Facts & citations verified'
      } : null);
      setTimeout(() => setActiveTask(null), 900);

      return data;
    } catch (err) {
      clearInterval(progressTimer);
      console.error('Web search error:', err);
      setActiveTask(null);
      return null;
    } finally {
      clearInterval(progressTimer);
      setIsSearchingWeb(false);
      setAgents((prev) =>
        prev.map((a) => (a.id === 'web-navigator' ? { ...a, status: 'idle' } : a))
      );
    }
  };

  // 2b. Real-Time Grounded Ask Pipeline
  // User Query -> Intent Classifier -> searchAll parallel -> Rerank -> Injected System Prompt
  const handleGroundedAsk = async (query: string, operationalField?: OperationalFieldId) => {
    setIsSearchingWeb(true);
    setActiveTask({
      isActive: true,
      taskType: 'search',
      title: query,
      stageLabel: 'Pipeline 1/4: Intent Classifier evaluating temporal freshness requirements...',
      progressPercent: 20,
      activeAgentId: 'web-navigator',
      activeAgentName: 'Nexus & Web Navigator',
      targetTab: 'search-ask'
    });

    setAgents((prev) =>
      prev.map((a) => (a.id === 'web-navigator' ? { ...a, status: 'browsing' } : a))
    );

    const progressTimer = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev || !prev.isActive || prev.progressPercent >= 92) return prev;
        const nextP = prev.progressPercent + 22;
        let label = prev.stageLabel;
        if (nextP > 30 && nextP <= 55) {
          label = 'Pipeline 2/4: searchAll parallel querying YouTube, Facebook, Google, Chrome...';
        } else if (nextP > 55 && nextP <= 80) {
          label = 'Pipeline 3/4: Rerank Engine computing [Relevance score] x [Recency factor]...';
        } else if (nextP > 80) {
          label = 'Pipeline 4/4: Injecting LIVE CONTEXT (2026) immutable prompt into core...';
        }
        return {
          ...prev,
          progressPercent: nextP,
          stageLabel: label
        };
      });
    }, 320);

    // STRICT DIRECTIVE: Local AI Engine (WebGPU) is Deprecated
    if (hybridConfig.provider === 'local-webgpu' || localStorage.getItem('lievin_provider') === 'LOCAL') {
      clearInterval(progressTimer);
      setIsSearchingWeb(false);
      setActiveTask(null);
      const errMsg = 'Local mode deprecated. Use OpenAI or Anthropic.';
      alert(errMsg);
      throw new Error(errMsg);
    }

    try {
      const activeCloudKey = hybridConfig.provider === 'openai' 
        ? (hybridConfig.openaiKey || localStorage.getItem('lievin_api_key') || '')
        : hybridConfig.provider === 'anthropic'
        ? (hybridConfig.anthropicKey || localStorage.getItem('lievin_api_key') || '')
        : undefined;

      const response = await fetch('/api/search/grounded-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          provider: hybridConfig.provider,
          apiKey: activeCloudKey,
          operationalField 
        })
      });
      const data = await response.json();
      clearInterval(progressTimer);

      if (data.error && data.status === 'deprecated') {
        throw new Error(data.error);
      }

      if (data.pipelineTelemetry) {
        const topSource = data.pipelineTelemetry.rerankedSources?.[0];
        const factNode: KnowledgeNode = {
          id: `fact-${Date.now()}`,
          label: `Grounded: ${query.slice(0, 32)}...`,
          category: 'web_fact',
          summary: data.directAnswer?.slice(0, 160) || 'Verified live data ingestion complete.',
          sourceUrl: topSource?.url,
          confidence: topSource?.compositeScore || 0.98,
          timestamp: new Date().toISOString()
        };
        setKnowledgeNodes((prev) => [factNode, ...prev]);
      }

      addHistoryItem(
        'search',
        query,
        ['Intent Classifier', 'Lievin Web Navigator', 'Rerank Engine'],
        data.directAnswer ? data.directAnswer.slice(0, 150) + '...' : 'Grounded multi-platform search completed.'
      );

      setActiveTask((prev) => prev ? {
        ...prev,
        progressPercent: 100,
        stageLabel: 'Grounded Live Context Ingestion & Answer Synthesis Complete!'
      } : null);

      setTimeout(() => {
        setActiveTask(null);
        setIsSearchingWeb(false);
        setAgents((prev) => prev.map((a) => (a.id === 'web-navigator' ? { ...a, status: 'idle' } : a)));
      }, 700);

      return data;
    } catch (err) {
      console.error('Grounded ask error:', err);
      clearInterval(progressTimer);
      setActiveTask(null);
      setIsSearchingWeb(false);
      setAgents((prev) => prev.map((a) => (a.id === 'web-navigator' ? { ...a, status: 'idle' } : a)));
      throw err;
    }
  };


  // 3. Image Generation
  const handleGenerateImage = async (prompt: string, aspectRatio: string, style: string) => {
    setIsGeneratingImage(true);
    setActiveTask({
      isActive: true,
      taskType: 'vision',
      title: prompt,
      stageLabel: `Lievin Vision Studio: Synthesizing ${aspectRatio} concept art (${style})...`,
      progressPercent: 16,
      activeAgentId: 'visual-studio',
      activeAgentName: 'Lievin Vision Studio',
      targetTab: 'multimodal-studio'
    });

    setAgents((prev) =>
      prev.map((a) => (a.id === 'visual-studio' ? { ...a, status: 'rendering' } : a))
    );

    const progressTimer = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev || !prev.isActive || prev.progressPercent >= 90) return prev;
        return {
          ...prev,
          progressPercent: Math.min(92, prev.progressPercent + 16),
          stageLabel: prev.progressPercent > 50 
            ? 'Lievin Vision Studio: Latent diffusion & aesthetic vectoring...' 
            : prev.stageLabel
        };
      });
    }, 400);

    try {
      const response = await fetch('/api/visual/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, style })
      });
      const data = await response.json();
      clearInterval(progressTimer);

      if (data.imageUrl) {
        const visualNode: KnowledgeNode = {
          id: `vis-${Date.now()}`,
          label: `Visual Asset: ${prompt.slice(0, 26)}`,
          category: 'visual_asset',
          summary: `Synthesized with ${data.generatedWith || 'Lievin Vision Studio'}: "${prompt}"`,
          mediaUrl: data.imageUrl,
          confidence: 0.95,
          timestamp: new Date().toISOString()
        };
        setKnowledgeNodes((prev) => [visualNode, ...prev]);

        // Record in Command History
        addHistoryItem(
          'vision',
          prompt,
          ['Lievin Vision Studio'],
          `Rendered ${aspectRatio} concept with ${style} aesthetic.`,
          { aspectRatio, style }
        );
      }

      setActiveTask((prev) => prev ? {
        ...prev,
        progressPercent: 100,
        stageLabel: 'Vision Studio: Concept art rendered successfully'
      } : null);
      setTimeout(() => setActiveTask(null), 900);

      return data;
    } catch (err) {
      clearInterval(progressTimer);
      console.error('Image generation error:', err);
      setActiveTask(null);
      return null;
    } finally {
      clearInterval(progressTimer);
      setIsGeneratingImage(false);
      setAgents((prev) =>
        prev.map((a) => (a.id === 'visual-studio' ? { ...a, status: 'idle' } : a))
      );
    }
  };

  // 4. Image Editing
  const handleEditImage = async (baseImage: string, instruction: string, style: string) => {
    setIsGeneratingImage(true);
    setActiveTask({
      isActive: true,
      taskType: 'vision',
      title: instruction,
      stageLabel: `Lievin Vision Studio: Applying inpainting instruction "${instruction}"...`,
      progressPercent: 22,
      activeAgentId: 'visual-studio',
      activeAgentName: 'Lievin Vision Studio',
      targetTab: 'multimodal-studio'
    });

    const progressTimer = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev || !prev.isActive || prev.progressPercent >= 90) return prev;
        return {
          ...prev,
          progressPercent: Math.min(92, prev.progressPercent + 18),
          stageLabel: 'Lievin Vision Studio: Inpainting canvas & blending lighting...'
        };
      });
    }, 400);

    try {
      const response = await fetch('/api/visual/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseImage, instruction, style })
      });
      const data = await response.json();
      clearInterval(progressTimer);

      // Record edit in Command History
      addHistoryItem(
        'vision',
        `Edit: ${instruction}`,
        ['Lievin Vision Studio'],
        `Instructional inpainting applied to active canvas.`,
        { instruction, style }
      );

      setActiveTask((prev) => prev ? {
        ...prev,
        progressPercent: 100,
        stageLabel: 'Inpainting canvas update complete'
      } : null);
      setTimeout(() => setActiveTask(null), 900);

      return data;
    } catch (err) {
      clearInterval(progressTimer);
      console.error('Image edit error:', err);
      setActiveTask(null);
      return null;
    } finally {
      clearInterval(progressTimer);
      setIsGeneratingImage(false);
    }
  };

  // 5. Video Generation
  const handleGenerateVideo = async (
    prompt: string,
    baseImage?: string,
    duration?: string,
    aspectRatio?: string,
    motionStyle?: string
  ) => {
    setIsGeneratingVideo(true);
    setActiveTask({
      isActive: true,
      taskType: 'video',
      title: prompt,
      stageLabel: `Temporal Video Director: Directing ${duration || '5s'} cinematic reel (${motionStyle || 'Pan'})...`,
      progressPercent: 15,
      activeAgentId: 'video-director',
      activeAgentName: 'Temporal Video Director',
      targetTab: 'multimodal-studio'
    });

    setAgents((prev) =>
      prev.map((a) => (a.id === 'video-director' ? { ...a, status: 'directing' } : a))
    );

    const progressTimer = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev || !prev.isActive || prev.progressPercent >= 90) return prev;
        return {
          ...prev,
          progressPercent: Math.min(92, prev.progressPercent + 14),
          stageLabel: prev.progressPercent > 50 
            ? 'Temporal Video Director: Multi-turn temporal sequencing & audio drone...' 
            : prev.stageLabel
        };
      });
    }, 450);

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, baseImage, duration, aspectRatio, motionStyle })
      });
      const data = await response.json();
      clearInterval(progressTimer);

      if (data.videoUrl) {
        const videoNode: KnowledgeNode = {
          id: `vid-node-${Date.now()}`,
          label: `Video Reel: ${prompt.slice(0, 26)}`,
          category: 'video_sequence',
          summary: `Directed ${duration || '5s'} cinematic reel with camera motion: ${motionStyle}`,
          mediaUrl: data.videoUrl,
          confidence: 0.96,
          timestamp: new Date().toISOString()
        };
        setKnowledgeNodes((prev) => [videoNode, ...prev]);

        // Record in Command History
        addHistoryItem(
          'video',
          prompt,
          ['Temporal Video Director'],
          `Directed ${duration || '5s'} reel with motion: ${motionStyle || 'Cinematic pan'}.`,
          { duration, aspectRatio, motionStyle }
        );
      }

      setActiveTask((prev) => prev ? {
        ...prev,
        progressPercent: 100,
        stageLabel: 'Temporal Video Director: Cinematic reel generated'
      } : null);
      setTimeout(() => setActiveTask(null), 900);

      return data;
    } catch (err) {
      clearInterval(progressTimer);
      console.error('Video generation error:', err);
      setActiveTask(null);
      return null;
    } finally {
      clearInterval(progressTimer);
      setIsGeneratingVideo(false);
      setAgents((prev) =>
        prev.map((a) => (a.id === 'video-director' ? { ...a, status: 'idle' } : a))
      );
    }
  };

  // 6. Video Extension
  const handleExtendVideo = async (videoId: string, prompt: string, duration?: string) => {
    setActiveTask({
      isActive: true,
      taskType: 'video',
      title: prompt,
      stageLabel: `Temporal Video Director: Extending video shot narrative (+${duration || '5s'})...`,
      progressPercent: 20,
      activeAgentId: 'video-director',
      activeAgentName: 'Temporal Video Director',
      targetTab: 'multimodal-studio'
    });

    const progressTimer = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev || !prev.isActive || prev.progressPercent >= 90) return prev;
        return {
          ...prev,
          progressPercent: Math.min(92, prev.progressPercent + 16),
          stageLabel: 'Temporal Video Director: Linking temporal vectors into continuous reel...'
        };
      });
    }, 400);

    try {
      const response = await fetch('/api/video/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, continuationPrompt: prompt, duration })
      });
      const data = await response.json();
      clearInterval(progressTimer);

      addHistoryItem(
        'video',
        `Extend: ${prompt}`,
        ['Temporal Video Director'],
        `Extended sequence by ${duration || '5s'}.`,
        { videoId, duration }
      );

      setActiveTask((prev) => prev ? {
        ...prev,
        progressPercent: 100,
        stageLabel: 'Temporal narrative sequence extended'
      } : null);
      setTimeout(() => setActiveTask(null), 900);

      return data;
    } catch (err) {
      clearInterval(progressTimer);
      console.error('Video extension error:', err);
      setActiveTask(null);
      return null;
    }
  };


  // Command History Re-Run & Edit Handlers
  const handleRerunCommand = (item: CommandHistoryItem) => {
    if (item.type === 'mission') {
      setActiveTab('mission-deck');
      handleRunMission(item.prompt);
    } else if (item.type === 'search') {
      setActiveTab('search-ask');
      handleWebSearch(item.prompt);
    } else if (item.type === 'vision') {
      setVisionSeedPrompt(item.prompt);
      setActiveTab('multimodal-studio');
      handleGenerateImage(
        item.prompt,
        item.parameters?.aspectRatio || '16:9',
        item.parameters?.style || 'Cinematic Photorealism'
      );
    } else if (item.type === 'video') {
      setVisionSeedPrompt(item.prompt);
      setActiveTab('multimodal-studio');
      handleGenerateVideo(
        item.prompt,
        undefined,
        item.parameters?.duration,
        item.parameters?.aspectRatio,
        item.parameters?.motionStyle
      );
    } else {
      setActiveTab('mission-deck');
      handleRunMission(item.prompt);
    }
  };

  const handleEditAndRunCommand = (newPrompt: string, originalItem: CommandHistoryItem) => {
    handleRerunCommand({
      ...originalItem,
      prompt: newPrompt
    });
  };

  const handleClearHistory = () => {
    setCommandHistory([]);
    try {
      localStorage.removeItem('lievin_command_history');
    } catch {}
  };

  const handleDeleteHistoryItem = (id: string) => {
    setCommandHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleImportHistory = (importedItems: CommandHistoryItem[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setCommandHistory(importedItems);
      try {
        localStorage.setItem('lievin_command_history', JSON.stringify(importedItems));
      } catch {}
    } else {
      // Merge mode with deduplication by ID and prompt+type signature
      setCommandHistory((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const existingSignatures = new Set(prev.map((item) => `${item.prompt.trim()}-${item.type}`));
        const newUniqueItems = importedItems.filter(
          (item) => !existingIds.has(item.id) && !existingSignatures.has(`${item.prompt.trim()}-${item.type}`)
        );
        const merged = [...newUniqueItems, ...prev].slice(0, 100);
        try {
          localStorage.setItem('lievin_command_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    }
  };

  // Navigation callbacks
  const handleNavigateToVision = (prompt?: string, imageUrl?: string) => {
    if (prompt) setVisionSeedPrompt(prompt);
    if (imageUrl) setVisionSeedImage(imageUrl);
    setActiveTab('multimodal-studio');
  };

  const handleNavigateToVideo = (prompt?: string, imageUrl?: string) => {
    if (prompt) setVisionSeedPrompt(prompt);
    if (imageUrl) setVisionSeedImage(imageUrl);
    setActiveTab('multimodal-studio');
  };

  const handleNavigateToWeb = (query?: string) => {
    setActiveTab('web-navigator');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        systemStatus="online"
        isOrchestrating={isOrchestrating}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        historyCount={commandHistory.length}
        activeTask={activeTask}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        hybridConfig={hybridConfig}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Agent Swarm HUD (Always accessible to visualize multi-agent status) */}
        <AgentSwarmHUD
          agents={agents}
          isOrchestrating={isOrchestrating}
          onSelectAgent={(id) => {
            if (id === 'web-navigator') setActiveTab('web-navigator');
            else if (id === 'visual-studio' || id === 'video-director') setActiveTab('multimodal-studio');
            else if (id === 'logic-reasoner') setActiveTab('cognitive-graph');
            else setActiveTab('mission-deck');
          }}
        />

        {/* Tab 1: Primary Search or Ask Tool (First Page) */}
        {activeTab === 'search-ask' && (
          <SearchAskView
            onSearch={handleGroundedAsk}
            isLoading={isSearchingWeb}
            onNavigateToMission={(prompt) => {
              setActiveTab('mission-deck');
              handleRunMission(prompt);
            }}
            onNavigateToVision={(prompt) => {
              setVisionSeedPrompt(prompt);
              setActiveTab('multimodal-studio');
            }}
            onNavigateToVideo={(prompt) => {
              setVisionSeedPrompt(prompt);
              setActiveTab('multimodal-studio');
            }}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            hybridConfig={hybridConfig}
          />
        )}

        {/* Tab 2: Mission Deck */}
        {activeTab === 'mission-deck' && (
          <MissionDeck
            onRunMission={handleRunMission}
            isOrchestrating={isOrchestrating}
            currentMission={currentMission}
            onNavigateToVision={handleNavigateToVision}
            onNavigateToVideo={handleNavigateToVideo}
            onNavigateToWeb={handleNavigateToWeb}
          />
        )}

        {/* Tab 2: Web Navigator */}
        {activeTab === 'web-navigator' && (
          <WebNavigatorView
            onSearch={handleWebSearch}
            isLoading={isSearchingWeb}
            onSendToReasoning={(fact) => {
              setActiveTab('mission-deck');
              handleRunMission(`Perform deep cognitive reasoning over verified fact: "${fact}"`);
            }}
            onSendToVision={(fact) => {
              setVisionSeedPrompt(fact);
              setActiveTab('multimodal-studio');
            }}
          />
        )}

        {/* Tab 3: Multimodal Studio (Vision + Video) */}
        {activeTab === 'multimodal-studio' && (
          <MultimodalStudio
            onGenerateImage={handleGenerateImage}
            onEditImage={handleEditImage}
            onGenerateVideo={handleGenerateVideo}
            onExtendVideo={handleExtendVideo}
            isGeneratingImage={isGeneratingImage}
            isGeneratingVideo={isGeneratingVideo}
            initialPrompt={visionSeedPrompt}
            initialImageUrl={visionSeedImage}
          />
        )}

        {/* Tab 4: Cognitive Memory Graph */}
        {activeTab === 'cognitive-graph' && (
          <KnowledgeMemoryGraph
            nodes={knowledgeNodes}
            onInjectNodeToMission={(axiom) => {
              setActiveTab('mission-deck');
              handleRunMission(axiom);
            }}
            onAddCustomNode={(label, summary, category) => {
              const customNode: KnowledgeNode = {
                id: `node-${Date.now()}`,
                label,
                summary,
                category,
                confidence: 1.0,
                timestamp: new Date().toISOString()
              };
              setKnowledgeNodes((prev) => [customNode, ...prev]);
            }}
          />
        )}
      </main>

      {/* Footer with Lievin AI Branding */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Lievin AI" className="w-5 h-5 opacity-80" />
            <span className="text-slate-300 font-bold">Lievin AI</span>
            <span>— Cognitive Multi-Agent Ecosystem v4.8</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Autonomous Grounding Online
            </span>
            <span>Interactions API v2.4</span>
            <span>Multimodal Vision & Video Engine</span>
          </div>
        </div>
      </footer>

      {/* Command History & Audit Trail Drawer */}
      <CommandHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={commandHistory}
        onRerun={handleRerunCommand}
        onEditAndRun={handleEditAndRunCommand}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onImportHistory={handleImportHistory}
      />

      {/* Hybrid Core Routing Settings Modal */}
      <HybridSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={hybridConfig}
        onSaveConfig={setHybridConfig}
      />
    </div>
  );
}
