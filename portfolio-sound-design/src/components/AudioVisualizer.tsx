import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { Activity, BarChart2, Radio } from 'lucide-react';

interface AudioVisualizerProps {
  height?: number;
  className?: string;
  showModeSwitch?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  height = 120,
  className = '',
  showModeSwitch = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualMode, setVisualMode] = useState<'wave' | 'frequency' | 'radial'>('wave');
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const analyser = audioEngine.getAnalyser();
      const state = audioEngine.getPlaybackState();
      const isPlaying = state.isPlaying;

      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (visualMode === 'wave') {
          // Time domain oscilloscope
          analyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#f59e0b';
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';

          ctx.beginPath();
          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * h) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }

          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        } else if (visualMode === 'frequency') {
          // Frequency FFT bars
          analyser.getByteFrequencyData(dataArray);

          const barCount = 48;
          const barWidth = (width / barCount) - 2;
          const step = Math.floor(bufferLength / barCount);

          for (let i = 0; i < barCount; i++) {
            const val = dataArray[i * step] || 0;
            const barHeight = (val / 255) * (h * 0.85);
            const x = i * (barWidth + 2);
            const y = h - barHeight;

            // Gradient from amber-600 to amber-400
            const grad = ctx.createLinearGradient(0, h, 0, y);
            grad.addColorStop(0, 'rgba(217, 119, 6, 0.3)');
            grad.addColorStop(1, '#f59e0b');

            ctx.fillStyle = grad;
            ctx.fillRect(x, y, barWidth, barHeight);
          }
        } else {
          // Radial / Sonic bloom
          analyser.getByteFrequencyData(dataArray);
          const centerX = width / 2;
          const centerY = h / 2;
          const radius = Math.min(centerX, centerY) * 0.45;

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';

          ctx.beginPath();
          for (let i = 0; i < 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            const val = dataArray[i * 2] || 0;
            const offset = (val / 255) * 28;
            const r = radius + offset;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      } else {
        // Subtle ambient idle breathing wave
        phase += 0.03;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';

        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const y = h / 2 + Math.sin(x * 0.02 + phase) * 8 * Math.sin(x * 0.005);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary subtle harmonic line
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = h / 2 + Math.cos(x * 0.015 - phase * 0.7) * 5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [visualMode]);

  return (
    <div className={`relative rounded-xl border border-slate-800/80 bg-[#0a0f1d]/90 p-3 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono-tech tracking-wider uppercase text-[11px] text-amber-300">
            Oscilloscope & Spectre Acoustique
          </span>
        </div>

        {showModeSwitch && (
          <div className="flex items-center gap-1 bg-slate-900/90 rounded-md p-0.5 border border-slate-800">
            <button
              onClick={() => setVisualMode('wave')}
              className={`p-1.5 rounded text-xs transition-colors ${
                visualMode === 'wave' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Forme d'onde (Oscilloscope)"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setVisualMode('frequency')}
              className={`p-1.5 rounded text-xs transition-colors ${
                visualMode === 'frequency' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Fréquences FFT"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setVisualMode('radial')}
              className={`p-1.5 rounded text-xs transition-colors ${
                visualMode === 'radial' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Champ Radial"
            >
              <Radio className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full h-auto block rounded"
      />
    </div>
  );
};
