import React, { useState } from 'react';
import { Image as ImageIcon, Video, Sparkles, Wand2, Play, Download, RefreshCw, Layers, Film, ArrowRight, Eye, Sliders, Check, Maximize2, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { GeneratedImage, VideoProject, VideoShot } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface MultimodalStudioProps {
  onGenerateImage: (prompt: string, aspectRatio: string, style: string) => Promise<any>;
  onEditImage: (baseImage: string, instruction: string, style: string) => Promise<any>;
  onGenerateVideo: (prompt: string, baseImage?: string, duration?: string, aspectRatio?: string, motionStyle?: string) => Promise<any>;
  onExtendVideo: (videoId: string, prompt: string, duration?: string) => Promise<any>;
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;
  initialPrompt?: string;
  initialImageUrl?: string;
}

const STYLE_PRESETS = [
  { id: 'Cinematic Photorealism', label: 'Cinematic Cyan', desc: 'Photorealistic film lighting with Lievin cyan volumetric glow' },
  { id: 'Cybernetic HUD', label: 'Cybernetic HUD', desc: 'Futuristic technical blueprint with neon telemetry vectors' },
  { id: 'Deep Midnight Azure', label: 'Midnight Azure', desc: 'Moody deep-space aesthetics with dark navy contrast' },
  { id: 'Surrealist Concept Art', label: 'Surrealist Concept', desc: 'High-concept architectural & biological synthesis' }
];

const MOTION_PRESETS = [
  'Cinematic pan and slow forward dolly',
  '360-degree orbital rotation around central axis',
  'Low-angle soaring vertical ascent',
  'First-person high-speed drone flyover',
  'Deep depth-of-field rack focus and ambient drift'
];

export const MultimodalStudio: React.FC<MultimodalStudioProps> = ({
  onGenerateImage,
  onEditImage,
  onGenerateVideo,
  onExtendVideo,
  isGeneratingImage,
  isGeneratingVideo,
  initialPrompt = '',
  initialImageUrl = ''
}) => {
  const [studioTab, setStudioTab] = useState<'vision' | 'video'>('vision');

  // Vision State
  const [imagePrompt, setImagePrompt] = useState(initialPrompt || 'An autonomous quantum optical processor core pulsing with cyan coherent laser beams in a vacuum chamber');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState('Cinematic Photorealism');
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(() => {
    if (initialImageUrl) {
      return {
        id: `img-${Date.now()}`,
        imageUrl: initialImageUrl,
        prompt: initialPrompt || 'Initial Visual Asset',
        aspectRatio: '16:9',
        style: 'Cinematic Photorealism',
        generatedWith: 'lievin-generative-vision',
        timestamp: new Date().toISOString()
      };
    }
    return null;
  });
  const [editInstruction, setEditInstruction] = useState('');
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState(initialPrompt || 'Cinematic sequence of an autonomous cybernetic explorer navigating an alien crystalline cavern');
  const [videoDuration, setVideoDuration] = useState<'5s' | '10s'>('5s');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedMotion, setSelectedMotion] = useState(MOTION_PRESETS[0]);
  const [videoBaseImage, setVideoBaseImage] = useState<string>(initialImageUrl || '');
  const [currentVideoProject, setCurrentVideoProject] = useState<VideoProject | null>(null);
  const [extendPrompt, setExtendPrompt] = useState('');
  const [isExtending, setIsExtending] = useState(false);

  // Handle Image Generation
  const handleCreateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imagePrompt.trim() || isGeneratingImage) return;

    try {
      const res = await onGenerateImage(imagePrompt.trim(), aspectRatio, selectedStyle);
      if (res && res.imageUrl) {
        const newImg: GeneratedImage = {
          id: `img-${Date.now()}`,
          imageUrl: res.imageUrl,
          prompt: imagePrompt,
          fullPrompt: res.fullPrompt,
          aspectRatio,
          style: selectedStyle,
          generatedWith: res.generatedWith || 'lievin-generative-vision',
          timestamp: new Date().toISOString()
        };
        setActiveImage(newImg);
        setImageHistory((prev) => [newImg, ...prev.slice(0, 7)]);
      }
    } catch (err) {
      console.error('Image generation error:', err);
    }
  };

  // Handle Image Editing
  const handleApplyEdit = async () => {
    if (!activeImage || !editInstruction.trim() || isGeneratingImage) return;

    try {
      const res = await onEditImage(activeImage.imageUrl, editInstruction.trim(), selectedStyle);
      if (res && res.imageUrl) {
        const editedImg: GeneratedImage = {
          id: `edit-${Date.now()}`,
          imageUrl: res.imageUrl,
          prompt: `${activeImage.prompt} [Edit: ${editInstruction}]`,
          aspectRatio: activeImage.aspectRatio,
          style: selectedStyle,
          generatedWith: res.generatedWith || 'lievin-neural-editor',
          timestamp: new Date().toISOString()
        };
        setActiveImage(editedImg);
        setImageHistory((prev) => [editedImg, ...prev]);
        setEditInstruction('');
      }
    } catch (err) {
      console.error('Image edit error:', err);
    }
  };

  // Transfer Image to Video
  const handleTransferToVideo = () => {
    if (!activeImage) return;
    setVideoBaseImage(activeImage.imageUrl);
    setVideoPrompt(`Animate cinematic shot inspired by: ${activeImage.prompt}`);
    setStudioTab('video');
  };

  // Handle Video Generation
  const handleCreateVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!videoPrompt.trim() || isGeneratingVideo) return;

    try {
      const res = await onGenerateVideo(
        videoPrompt.trim(),
        videoBaseImage || undefined,
        videoDuration,
        videoAspectRatio,
        selectedMotion
      );

      if (res) {
        const newProject: VideoProject = {
          id: res.videoId || `vid-${Date.now()}`,
          videoUrl: res.videoUrl,
          prompt: videoPrompt,
          duration: videoDuration,
          aspectRatio: videoAspectRatio,
          generatedWith: res.generatedWith || 'lievin-temporal-director',
          shots: res.shots || [
            { id: 1, timestamp: '0:00 - 0:02', title: 'Shot 1: Hook', description: 'Volumetric cinematic composition' },
            { id: 2, timestamp: '0:02 - 0:05', title: 'Shot 2: Camera Pan', description: selectedMotion }
          ],
          frames: res.frames,
          soundtrackPrompt: res.soundtrackPrompt,
          timestamp: new Date().toISOString()
        };
        setCurrentVideoProject(newProject);
      }
    } catch (err) {
      console.error('Video generation error:', err);
    }
  };

  // Handle Video Extension
  const handleExtendCurrentVideo = async () => {
    if (!currentVideoProject || isExtending) return;
    const prompt = extendPrompt.trim() || 'Continue the scene seamlessly as the camera glides across the horizon';

    setIsExtending(true);
    try {
      const res = await onExtendVideo(currentVideoProject.id, prompt, '5s');
      if (res) {
        setCurrentVideoProject((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            duration: '10s',
            isExtended: true,
            shots: [...prev.shots, ...(res.shots || [])]
          };
        });
        setExtendPrompt('');
      }
    } catch (err) {
      console.error('Video extension error:', err);
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Studio Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              {studioTab === 'vision' ? (
                <ImageIcon className="w-5 h-5 text-cyan-400" />
              ) : (
                <Video className="w-5 h-5 text-cyan-400" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-mono">
                Lievin Multimodal Production Suite
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Studio Grade
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-fidelity visual concept synthesis, instructional inpainting, and cinematic temporal video direction
            </p>
          </div>
        </div>

        {/* Studio Mode Toggle */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setStudioTab('vision')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              studioTab === 'vision'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Vision Studio (Images)</span>
          </button>
          <button
            onClick={() => setStudioTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              studioTab === 'video'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>Video Director (Reels)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VISION STUDIO TAB */}
      {/* ============================================================ */}
      {studioTab === 'vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Prompt input card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Visual Concept Prompt
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Model: gemini-3.1-flash-lite-image
                </span>
              </div>

              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe your visual concept in detail (e.g. Ultra-detailed futuristic fusion reactor with cyan glowing magnetic confinement coils)..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors resize-none font-sans"
              />

              {/* Style Presets */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-medium text-slate-400">
                  Lievin Aesthetic Presets:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedStyle(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedStyle === p.id
                          ? 'bg-cyan-950/60 border-cyan-400/60 text-cyan-300 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{p.label}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-medium text-slate-400">
                  Canvas Aspect Ratio:
                </span>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                  {(['16:9', '1:1', '9:16', '4:3'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                        aspectRatio === ratio
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCreateImage}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering Concept...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Visual Concept</span>
                  </>
                )}
              </button>
            </div>

            {/* Instructional Inpainting & Image-to-Image Editor */}
            {activeImage && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Instructional Image Editor
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Neural Inpainting
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Prompt iterative transformations onto the current canvas without redrawing from scratch.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    placeholder="e.g. Add volumetric neon cyan haze and orbital reflections..."
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    onClick={handleApplyEdit}
                    disabled={!editInstruction.trim() || isGeneratingImage}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs uppercase transition-all shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Canvas Preview Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between min-h-[480px]">
              {/* Canvas Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-mono font-bold uppercase text-white">
                    Master Concept Viewport
                  </span>
                  {activeImage && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      {activeImage.aspectRatio} • {activeImage.style}
                    </span>
                  )}
                </div>

                {activeImage && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTransferToVideo}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      title="Seed Video Director with this visual frame"
                    >
                      <Film className="w-3.5 h-3.5" />
                      Animate in Video Director
                    </button>
                    <a
                      href={activeImage.imageUrl}
                      download="lievin-concept-art.png"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800"
                      title="Download image asset"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Canvas Viewport */}
              <div className="relative flex-1 rounded-2xl bg-black/95 border border-slate-800/80 flex items-center justify-center overflow-hidden min-h-[380px]">
                {activeImage ? (
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img
                      src={activeImage.imageUrl}
                      alt={activeImage.prompt}
                      className="max-h-[460px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                    />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-500/20 text-xs text-slate-200">
                      <p className="font-semibold text-cyan-300 truncate">
                        {activeImage.prompt}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Generated with {activeImage.generatedWith}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-200">
                      Visual Canvas Idle
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Configure your prompt on the left to render high-resolution visual concepts with Lievin AI.
                    </p>
                    <button
                      onClick={handleCreateImage}
                      className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider hover:bg-cyan-900 transition-all cursor-pointer"
                    >
                      Render Default Concept
                    </button>
                  </div>
                )}
              </div>

              {/* History Strip */}
              {imageHistory.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Session Concept Reel ({imageHistory.length}):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {imageHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(item)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          activeImage?.id === item.id
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt="thumb"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIDEO DIRECTOR TAB */}
      {/* ============================================================ */}
      {studioTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Video Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Temporal Video Director
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Model: gemini-omni-1.1-flash
                </span>
              </div>

              {/* Reference Image Preview if present */}
              {videoBaseImage && (
                <div className="relative p-2 rounded-xl bg-slate-950 border border-purple-500/40 flex items-center gap-3">
                  <img
                    src={videoBaseImage}
                    alt="Starting frame"
                    className="w-14 h-14 rounded-lg object-cover border border-purple-500/30"
                  />
                  <div className="flex-1 truncate">
                    <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                      Starting Image Keyframe
                    </span>
                    <p className="text-xs text-slate-300 truncate">
                      Will animate motion from this visual frame
                    </p>
                  </div>
                  <button
                    onClick={() => setVideoBaseImage('')}
                    className="text-xs text-slate-500 hover:text-rose-400 p-1"
                    title="Remove keyframe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Video Prompt */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-400">
                  Scene Direction & Action:
                </label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe scene action and motion dynamics..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors resize-none font-sans"
                />
              </div>

              {/* Camera Motion Directives */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-slate-400">
                  Camera Motion Style:
                </label>
                <div className="space-y-1.5">
                  {MOTION_PRESETS.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMotion(m)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer truncate ${
                        selectedMotion === m
                          ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-400">
                    Duration:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                    {(['5s', '10s'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setVideoDuration(d)}
                        className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                          videoDuration === d
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-400">
                    Format:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                    {(['16:9', '9:16'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setVideoAspectRatio(r)}
                        className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                          videoAspectRatio === r
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Video Action */}
              <button
                onClick={handleCreateVideo}
                disabled={!videoPrompt.trim() || isGeneratingVideo}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Directing Video Sequence...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Direct & Render Video</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Extension Box */}
            {currentVideoProject && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Video Extension & Continuity
                </span>
                <p className="text-xs text-slate-400">
                  Extend the current video shot by +5 seconds using multi-turn temporal continuation.
                </p>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={extendPrompt}
                    onChange={(e) => setExtendPrompt(e.target.value)}
                    placeholder="Describe how the scene continues (e.g. Camera slowly pulls back to reveal the planet)..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleExtendCurrentVideo}
                    disabled={isExtending}
                    className="w-full py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isExtending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extending Sequence...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Extend Scene +5s</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Video Reel Viewport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase text-white">
                    Temporal Reel Playback
                  </span>
                  {currentVideoProject && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {currentVideoProject.duration} • {currentVideoProject.aspectRatio}
                    </span>
                  )}
                </div>

                {currentVideoProject && (
                  <span className="text-[10px] font-mono text-slate-500">
                    Engine: {currentVideoProject.generatedWith}
                  </span>
                )}
              </div>

              {/* Video Player Render */}
              {currentVideoProject ? (
                <div className="space-y-4">
                  <VideoPlayer
                    videoUrl={currentVideoProject.videoUrl}
                    frames={currentVideoProject.frames}
                    shots={currentVideoProject.shots}
                    duration={currentVideoProject.duration}
                    title={currentVideoProject.prompt}
                    soundtrackPrompt={currentVideoProject.soundtrackPrompt}
                    onExtend={() => handleExtendCurrentVideo()}
                  />

                  {/* Multi-shot Timeline Card */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Shot Breakdown & Cinematic Narrative:
                    </span>
                    <div className="space-y-1.5 font-mono text-xs">
                      {currentVideoProject.shots.map((shot) => (
                        <div
                          key={shot.id}
                          className="flex items-start justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80"
                        >
                          <div>
                            <span className="text-cyan-400 font-bold">
                              {shot.title}
                            </span>
                            <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                              {shot.description}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                            {shot.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 space-y-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <Video className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-200">
                    Temporal Director Standing By
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Direct a multi-shot video clip from a text prompt or animate any concept from the Vision Studio.
                  </p>
                  <button
                    onClick={handleCreateVideo}
                    className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider hover:bg-cyan-900 transition-all cursor-pointer"
                  >
                    Direct Default Scene
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
