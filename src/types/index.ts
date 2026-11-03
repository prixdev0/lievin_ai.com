export type WorkspaceTab = 
  | 'search-ask' 
  | 'mission-deck' 
  | 'web-navigator' 
  | 'multimodal-studio' 
  | 'cognitive-graph';

export type AgentId = 
  | 'nexus-coordinator'
  | 'web-navigator'
  | 'logic-reasoner'
  | 'visual-studio'
  | 'video-director'
  | 'code-sandbox';

export interface AgentProfile {
  id: AgentId;
  name: string;
  role: string;
  model: string;
  color: string;
  accentColor: string;
  avatarIcon: string;
  status: 'idle' | 'thinking' | 'browsing' | 'rendering' | 'directing' | 'completed';
  metrics: {
    tasksCompleted: number;
    tokensProcessed: number;
    latencyMs: number;
  };
}

export interface WebSource {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  credibility?: number;
}

export interface BrowsingStep {
  action: string;
  detail: string;
}

export interface WebNavigationResult {
  query: string;
  directAnswer: string;
  searchQueries: string[];
  sources: WebSource[];
  extractedFacts: string[];
  browsingSteps: BrowsingStep[];
  peopleAlsoAsk?: Array<{ question: string; answer: string; sourceUrl?: string }>;
  relatedSearches?: string[];
  stats?: {
    totalResults: string;
    searchDuration: string;
    page: number;
    totalPages: number;
  };
}

export interface DeepReasoningResult {
  query: string;
  thoughtTraces: string[];
  synthesis: string;
  confidenceScore: number;
  timestamp: string;
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  fullPrompt?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  style: string;
  generatedWith: string;
  timestamp: string;
  history?: string[];
}

export interface VideoShot {
  id: number;
  timestamp: string;
  title: string;
  description: string;
  prompt?: string;
}

export interface VideoProject {
  id: string;
  videoUrl: string;
  prompt: string;
  duration: '5s' | '10s';
  aspectRatio: '16:9' | '9:16';
  generatedWith: string;
  shots: VideoShot[];
  frames?: string[];
  soundtrackPrompt?: string;
  timestamp: string;
  isExtended?: boolean;
  baseImageId?: string;
}

export interface AgentStep {
  agentId: AgentId;
  agentName: string;
  type: 'plan' | 'web_search' | 'reasoning' | 'image_generation' | 'video_generation' | 'code_execution';
  timestamp: string;
  content?: string;
  citations?: WebSource[];
  prompt?: string;
  imageUrl?: string;
  videoPosterUrl?: string;
  videoPrompt?: string;
  duration?: string;
  shots?: VideoShot[];
  confidenceScore?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface Mission {
  id: string;
  title: string;
  missionPrompt: string;
  timestamp: string;
  status: 'in_progress' | 'completed' | 'failed';
  steps: AgentStep[];
  finalSynthesis?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'web_fact' | 'logic_axiom' | 'visual_asset' | 'video_sequence';
  summary: string;
  sourceUrl?: string;
  mediaUrl?: string;
  confidence: number;
  timestamp: string;
}

export type CommandActionType = 'mission' | 'search' | 'vision' | 'video' | 'reasoning';

export interface CommandHistoryItem {
  id: string;
  type: CommandActionType;
  prompt: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'failed';
  agentsInvolved?: string[];
  summary?: string;
  parameters?: Record<string, any>;
  resultId?: string;
}

export interface ActiveTaskProgress {
  isActive: boolean;
  taskType: 'mission' | 'search' | 'vision' | 'video' | 'reasoning' | 'idle';
  title: string;
  stageLabel: string;
  progressPercent: number; // 0 to 100
  activeAgentId?: AgentId;
  activeAgentName?: string;
  activeAgentColor?: string;
  elapsedSeconds?: number;
  targetTab?: WorkspaceTab;
}

export type HybridProvider = 'local-webgpu' | 'openai' | 'anthropic' | 'gemini';

export interface HybridConfig {
  provider: HybridProvider;
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  modelId: string;
  webGpuSupported: boolean;
  webGpuDevice: string;
  preloadModel: boolean;
  freeTierActive?: boolean;
  freeApiKey?: string;
  subAgentKeys?: SubAgentApiKey[];
}

export type SubAgentKeyScope = 'full' | 'search_grounding' | 'agent_swarm' | 'vision_media';

export interface SubAgentApiKey {
  id: string;
  key: string;
  label: string;
  scope: SubAgentKeyScope;
  rateLimit: string;
  expiresAt: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
}

export interface FreeKeyServiceItem {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'ready';
  quota: string;
  latency: string;
}

export interface FreeEngineKeyData {
  status: string;
  tier: string;
  masterKey: string;
  isFree: boolean;
  unlimited: boolean;
  expiresIn: string;
  services: FreeKeyServiceItem[];
  message: string;
}

export type MediaPlatform = 'google_search' | 'youtube' | 'facebook' | 'chrome_search';

export interface MediaAdapterSource {
  platform: MediaPlatform;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  metric?: string;
  relevanceScore: number;
  recencyScore: number;
  compositeScore: number;
}

export interface IntentClassificationResult {
  needsFreshData: boolean;
  intentType: 'realtime_qa' | 'cloud_text' | 'multimodal_asset' | 'coordinate_edit' | 'task_automation' | 'general';
  subQueries: string[];
  mediaTargets: MediaPlatform[];
  reasoning: string;
}

export interface PromptInjectionPipelineData {
  intentClassification: IntentClassificationResult;
  parallelQueries: string[];
  rerankedSources: MediaAdapterSource[];
  injectedSystemPrompt: string;
  executionTimeMs: number;
  freshnessYear: number;
}

export interface RagMArchitectureData {
  receptor: {
    frameCount: number;
    audioChannels: number;
    vectorDimensions: number;
    tools: string[];
    description: string;
  };
  memory: {
    registry: string;
    targetBoundingBox: string;
    maskModel: string;
    confidence: number;
    description: string;
  };
  imagination: {
    diffusionEngine: string;
    conditioningNodes: string[];
    frameInterpolation: string;
    description: string;
  };
  muscle: {
    pixelOps: string[];
    ffmpegCmd: string;
    exportProfile: string;
    description: string;
  };
}

export interface CognitiveReasoningData {
  variableDeconstruction: string[];
  executionRationale: string;
  validationAudit: string[];
}

export type OperationalFieldId = 
  | 'field1_qa'
  | 'field2_text'
  | 'field3_multimodal'
  | 'field4_edit'
  | 'field5_automation';

export interface OperationalFieldInfo {
  id: OperationalFieldId;
  title: string;
  badge: string;
  subtitle: string;
  icon: string;
  exampleQuery: string;
  description: string;
}

