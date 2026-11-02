import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { AudioVisualizer } from './AudioVisualizer';
import { audioEngine } from '../services/audioEngine';
import { Play, Pause, ArrowDown, Sparkles, MapPin, Award, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioEngine.setOnStateChange((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleHeroAudioToggle = () => {
    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.playTrack('cadounis');
    }
  };

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 flex flex-col justify-center items-center text-center overflow-hidden bg-acoustic-grid">
      {/* Radial ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-900/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Portrait & Location Kicker */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-5 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
              <img
                src={PORTFOLIO_DATA.profile.photoPortrait}
                alt="Ali Chams Eddine"
                className="w-full h-full rounded-full object-cover object-top border-2 border-[#070b14]"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0d1527] border border-amber-500/40 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech whitespace-nowrap shadow-md">
              Sound Designer & Chercheur
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-mono-tech tracking-wider uppercase">
            <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Grand Tunis, Tunisie</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">ISAM Gabès / Université de Gabès</span>
          </div>
        </div>

        {/* Main Name without Dr. */}
        <h1 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Ali <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Chams Eddine</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl font-medium text-amber-300/95 max-w-3xl mx-auto mb-6 tracking-wide">
          Sound Designer, Compositeur & Chercheur en Anthropologie du Son
        </p>

        {/* Slogan */}
        <div className="relative max-w-2xl mx-auto mb-10 px-6 py-4 rounded-2xl bg-[#0c1322]/80 border border-slate-800/80 backdrop-blur-sm shadow-xl">
          <p className="text-sm sm:text-base text-slate-300 italic leading-relaxed">
            « {PORTFOLIO_DATA.profile.slogan} »
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#services"
            className="px-6 py-3 rounded-full bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.55)] active:scale-95"
          >
            Découvrir mes services
          </a>

          <button
            onClick={handleHeroAudioToggle}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:border-amber-400 hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current text-amber-400" />
                <span>Pause Immersion</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-amber-400 ml-0.5" />
                <span>Écouter un extrait sonore</span>
              </>
            )}
          </button>

          <a
            href="#contact"
            className="px-6 py-3 rounded-full bg-transparent text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all text-sm font-medium"
          >
            Me contacter
          </a>
        </div>

        {/* Live Audio Visualizer */}
        <div className="max-w-2xl mx-auto mb-12">
          <AudioVisualizer height={100} showModeSwitch={true} />
          <p className="text-[11px] font-mono-tech text-slate-500 mt-2">
            {isPlaying ? "Visualisation en direct du moteur de synthèse Web Audio" : "Cliquez sur 'Écouter un extrait sonore' pour animer le spectre"}
          </p>
        </div>

        {/* Key figures / Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
          <div className="text-left p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="font-mono-tech text-xs uppercase text-amber-400">Doctorat & HDR</span>
            </div>
            <p className="text-xs text-slate-400">Musicologie & Anthropologie Acoustique</p>
          </div>

          <div className="text-left p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="font-mono-tech text-xs uppercase text-amber-400">Théâtre & Scène</span>
            </div>
            <p className="text-xs text-slate-400">Cadence · Quand l'eau disparaît</p>
          </div>

          <div className="text-left p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono-tech text-xs uppercase text-amber-400">Fictions Primées</span>
            </div>
            <p className="text-xs text-slate-400">Al-Wokor · Ibn Khaldoun · Hayat</p>
          </div>

          <div className="text-left p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="font-mono-tech text-xs uppercase text-amber-400">Enseignement</span>
            </div>
            <p className="text-xs text-slate-400">ISAM Gabès · Grand Tunis</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#about"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-400 transition-colors font-mono-tech uppercase tracking-widest"
          >
            <span>Explorer la démarche</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
