import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, SkipForward, SkipBack, Film, Sparkles, Download } from 'lucide-react';
import { VideoShot } from '../types';

interface VideoPlayerProps {
  videoUrl: string;
  frames?: string[];
  shots?: VideoShot[];
  duration?: string;
  title?: string;
  soundtrackPrompt?: string;
  onExtend?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  frames = [],
  shots = [],
  duration = '5s',
  title = 'Aether Cinematic Video Sequence',
  soundtrackPrompt,
  onExtend,
  onEdit,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const durationSec = duration === '10s' ? 10 : 5;
  const isMp4 = videoUrl.startsWith('data:video') || videoUrl.endsWith('.mp4');

  // Animation frame loop for storyboard frames
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      if (isPlaying) {
        const delta = (timestamp - lastTimestamp) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= durationSec) {
            return 0; // loop
          }
          return next;
        });
      }
      lastTimestamp = timestamp;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed, durationSec]);

  // Track active shot based on currentTime
  useEffect(() => {
    const shotCount = shots.length || 3;
    const progress = currentTime / durationSec;
    const idx = Math.min(Math.floor(progress * shotCount), shotCount - 1);
    setActiveShotIndex(idx);
  }, [currentTime, durationSec, shots.length]);

  // Web Audio Synth ambient drone when unmuted and playing
  useEffect(() => {
    if (isMuted || !isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(82.4, ctx.currentTime); // Low E
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(123.47, ctx.currentTime); // B2

      // Low pass filter for warm cinematic drone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      return () => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
          setTimeout(() => {
            osc1.stop();
            osc2.stop();
            ctx.close();
          }, 350);
        } catch {}
      };
    } catch {}
  }, [isPlaying, isMuted]);

  // Calculate which frame to display if using frames
  const currentFrameUrl = (() => {
    if (isMp4) return videoUrl;
    if (!frames || frames.length === 0) return videoUrl;
    const frameIndex = Math.min(
      Math.floor((currentTime / durationSec) * frames.length),
      frames.length - 1
    );
    return frames[frameIndex] || videoUrl;
  })();

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(pos * durationSec);
  };

  return (
    <div
      ref={containerRef}
      className={`relative group bg-slate-950/90 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl backdrop-blur-md flex flex-col ${className}`}
    >
      {/* Top Video Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
            Temporal Video Reel • {duration}
          </span>
          <span className="text-xs text-slate-300 font-medium truncate max-w-[280px]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onExtend && (
            <button
              onClick={onExtend}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-lg transition-all shadow-sm"
              title="Extend scene by 5 seconds"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Extend +5s
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all"
              title="Edit video scene"
            >
              <Film className="w-3.5 h-3.5 text-slate-400" />
              Edit Scene
            </button>
          )}
        </div>
      </div>

      {/* Primary Video Screen */}
      <div className="relative aspect-video w-full bg-black/95 flex items-center justify-center overflow-hidden">
        {isMp4 ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
        ) : (
          <div className="relative w-full h-full select-none">
            <img
              src={currentFrameUrl}
              alt="Video Scene"
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Dynamic camera pan / parallax scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
            <div className="absolute inset-0 pointer-events-none border border-cyan-500/10" />
          </div>
        )}

        {/* Big Center Play/Pause button on hover */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg group-hover:opacity-100 opacity-80"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-cyan-300 fill-cyan-300" />
          ) : (
            <Play className="w-7 h-7 text-cyan-300 fill-cyan-300 translate-x-0.5" />
          )}
        </button>

        {/* Active Shot Badge Overlay */}
        {shots && shots[activeShotIndex] && (
          <div className="absolute bottom-16 left-4 z-10 max-w-md p-2.5 rounded-lg bg-black/75 border border-cyan-500/30 backdrop-blur-md text-left transition-all pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-cyan-500/20 text-cyan-300 rounded font-semibold">
                {shots[activeShotIndex].timestamp}
              </span>
              <p className="text-xs font-semibold text-white">
                {shots[activeShotIndex].title}
              </p>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {shots[activeShotIndex].description}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Timeline & Scrubber Bar */}
      <div className="relative z-20 px-4 pt-3 pb-3 bg-slate-900/90 border-t border-slate-800 flex flex-col gap-2">
        {/* Progress Track */}
        <div
          onClick={handleSeek}
          className="relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden group/bar"
        >
          {/* Shot segment dividers */}
          {shots.map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
              style={{ left: `${(i / (shots.length || 3)) * 100}%` }}
            />
          ))}
          {/* Active progress */}
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-75 relative"
            style={{ width: `${(currentTime / durationSec) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md" />
          </div>
        </div>

        {/* Video Control Actions */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 hover:text-cyan-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="p-1 hover:text-cyan-400 transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span>
              {currentTime.toFixed(1)}s / {durationSec.toFixed(1)}s
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1 transition-colors ${!isMuted ? 'text-cyan-400' : 'hover:text-slate-200'}`}
              title={isMuted ? 'Unmute synthesized audio track' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Toggle */}
            <div className="flex items-center bg-slate-800/80 rounded px-1 py-0.5 text-[10px]">
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:text-white'}`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
