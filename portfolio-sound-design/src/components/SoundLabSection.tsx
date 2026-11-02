import React, { useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { Sliders, Play, Pause, RotateCcw, Sparkles, Volume2, Waves } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export const SoundLabSection: React.FC = () => {
  const [isPlayingLab, setIsPlayingLab] = useState(false);
  const [stems, setStems] = useState({
    drones: 0.7,
    water: 0.5,
    wind: 0.4,
    percussion: 0.3
  });

  const handleToggleLab = () => {
    if (isPlayingLab) {
      audioEngine.stopAll();
      setIsPlayingLab(false);
    } else {
      audioEngine.startSoundLab(stems);
      setIsPlayingLab(true);
    }
  };

  const handleSliderChange = (stem: 'drones' | 'water' | 'wind' | 'percussion', val: number) => {
    setStems(prev => ({ ...prev, [stem]: val }));
    if (isPlayingLab) {
      audioEngine.updateSoundLabStem(stem, val);
    }
  };

  const handleReset = () => {
    const defaults = { drones: 0.7, water: 0.5, wind: 0.4, percussion: 0.3 };
    setStems(defaults);
    if (isPlayingLab) {
      audioEngine.updateSoundLabStem('drones', defaults.drones);
      audioEngine.updateSoundLabStem('water', defaults.water);
      audioEngine.updateSoundLabStem('wind', defaults.wind);
      audioEngine.updateSoundLabStem('percussion', defaults.percussion);
    }
  };

  return (
    <section id="sound-lab" className="py-20 relative bg-[#090e1a] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4" />
              <span>Expérimentation Acoustique Interactive</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              Atelier Sonore & Anthropologie Acoustique
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            Manipulez les quatre strates acoustiques caractéristiques de mes créations et sculptez votre propre paysage immersif en temps réel.
          </p>
        </div>

        {/* Studio Mixer Console */}
        <div className="bg-[#0b1220] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Console Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white font-mono-tech uppercase tracking-wide">
                  Console de Mixage des Écosystèmes Sonores
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Génération synthétique procédurale en temps réel (Web Audio API)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
                title="Réinitialiser les faders"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleToggleLab}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs transition-all shadow-md ${
                  isPlayingLab
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                    : 'bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950'
                }`}
              >
                {isPlayingLab ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Arrêter le laboratoire</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Lancer l'expérience sonore</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stems Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
            {/* Stem 1: Nappe Modale */}
            <div className="bg-[#0e1628] p-5 rounded-xl border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1 font-mono-tech">
                  <span>STRATE 01</span>
                  <span>{Math.round(stems.drones * 100)}%</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Nappe Modale</h4>
                <p className="text-[11px] text-slate-400 leading-normal mb-4">
                  Drone harmonique méditerranéen (Tonalité A2, résonance sacrée).
                </p>
              </div>

              <div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={stems.drones}
                  onChange={(e) => handleSliderChange('drones', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech mt-2">
                  <span>SILENCE</span>
                  <span>IMMERSION</span>
                </div>
              </div>
            </div>

            {/* Stem 2: Texture Aquatique */}
            <div className="bg-[#0e1628] p-5 rounded-xl border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1 font-mono-tech">
                  <span>STRATE 02</span>
                  <span>{Math.round(stems.water * 100)}%</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Écho & Gouttes</h4>
                <p className="text-[11px] text-slate-400 leading-normal mb-4">
                  Inspiré de <em>Quand l'eau disparaît</em> : gouttelettes & filtres fluides.
                </p>
              </div>

              <div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={stems.water}
                  onChange={(e) => handleSliderChange('water', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech mt-2">
                  <span>SILENCE</span>
                  <span>FLUIDITÉ</span>
                </div>
              </div>
            </div>

            {/* Stem 3: Souffle Oasien & Vent */}
            <div className="bg-[#0e1628] p-5 rounded-xl border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1 font-mono-tech">
                  <span>STRATE 03</span>
                  <span>{Math.round(stems.wind * 100)}%</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Vent Oasien</h4>
                <p className="text-[11px] text-slate-400 leading-normal mb-4">
                  Inspiré du projet <em>Joudour</em> : souffle filtré basse fréquence.
                </p>
              </div>

              <div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={stems.wind}
                  onChange={(e) => handleSliderChange('wind', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech mt-2">
                  <span>SILENCE</span>
                  <span>RUMEUR</span>
                </div>
              </div>
            </div>

            {/* Stem 4: Cloche & Métal */}
            <div className="bg-[#0e1628] p-5 rounded-xl border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1 font-mono-tech">
                  <span>STRATE 04</span>
                  <span>{Math.round(stems.percussion * 100)}%</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Pulsation Scénique</h4>
                <p className="text-[11px] text-slate-400 leading-normal mb-4">
                  Inspiré de <em>Cadence</em> : battements sourds et résonances théâtrales.
                </p>
              </div>

              <div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={stems.percussion}
                  onChange={(e) => handleSliderChange('percussion', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech mt-2">
                  <span>SILENCE</span>
                  <span>TENSION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Visualizer feedback inside lab */}
          <div className="pt-4 border-t border-slate-800/80">
            <AudioVisualizer height={85} showModeSwitch={false} />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono-tech">
              <span>{isPlayingLab ? "Mixage actif · Les oscillateurs répondent aux curseurs" : "Appuyez sur 'Lancer l'expérience sonore' pour activer la synthèse"}</span>
              <span className="text-amber-400/80">48000 Hz · 32-bit float</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
