import React, { useEffect, useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Play, Pause, Square, Volume2, VolumeX, Sparkles, Disc } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(45);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    audioEngine.setOnStateChange((playing, id) => {
      setIsPlaying(playing);
      setTrackId(id);
    });

    audioEngine.setOnTimeUpdate((time, dur) => {
      setCurrentTime(time);
      setDuration(dur || 45);
    });

    const state = audioEngine.getPlaybackState();
    setIsPlaying(state.isPlaying);
    setTrackId(state.trackId);
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
    } else if (trackId) {
      audioEngine.playTrack(trackId);
    } else {
      audioEngine.playTrack('cadounis');
    }
  };

  const handleStop = () => {
    audioEngine.stopAll();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioEngine.setVolume(volume || 0.8);
      setIsMuted(false);
    } else {
      audioEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  // Find track title
  const activeProject = PORTFOLIO_DATA.projects.find(p => p.audioKey === trackId);
  const currentTitle = trackId === 'sound-lab' 
    ? "Atelier d'Anthropologie Sonore (Multi-Stems)" 
    : activeProject ? activeProject.title : "Extrait Sonore Sculpté";
  const currentSubtitle = activeProject ? activeProject.categoryLabel : "Grand Tunis · Ali Chams Eddine";

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isPlaying && !trackId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-t border-amber-500/20 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] transition-all">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-100 truncate">{currentTitle}</p>
              <span className="text-[10px] text-amber-400 font-mono-tech uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                Studio Stem
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{currentSubtitle}</p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            title={isPlaying ? "Mettre en pause" : "Reprendre l'écoute"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleStop}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
            title="Arrêter"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Progress / time */}
          <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <div className="w-24 sm:w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-200"
                style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & details */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-slate-400">
            <button onClick={toggleMute} className="hover:text-amber-400 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20 accent-amber-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <a
            href="#sound-lab"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Atelier Sonore</span>
          </a>
        </div>
      </div>
    </div>
  );
};
