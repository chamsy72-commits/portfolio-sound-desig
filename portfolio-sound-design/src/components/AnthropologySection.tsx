import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Compass, BookMarked, Globe, Sparkles, Feather } from 'lucide-react';

export const AnthropologySection: React.FC = () => {
  const research = PORTFOLIO_DATA.anthropologyResearch;

  return (
    <section id="anthropology" className="py-20 relative bg-[#070b14] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Domaine de Recherche & Thèse</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              Anthropologie du Son & Écologie Acoustique
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            Une recherche fondamentale sur l'écoute comme pratique culturelle, mémoire spatiale et vecteur d'identité en Tunisie et en Méditerranée.
          </p>
        </div>

        {/* Philosophy Intro Card */}
        <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-6 sm:p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-amber-500/10 pointer-events-none">
            <Feather className="w-32 h-32" />
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-mono-tech uppercase text-amber-400 mb-2 block">
              Perspective de l'Enseignant-Chercheur
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {research.subtitle}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {research.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tech text-slate-400">
              <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-amber-300">
                Doctorat en Musicologie
              </span>
              <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-amber-300">
                Habilitation Universitaire (HDR)
              </span>
              <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                ISAM Gabès · Université de Gabès
              </span>
            </div>
          </div>
        </div>

        {/* 4 Research Axes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {research.axes.map((axis, idx) => (
            <div
              key={idx}
              className="bg-[#0e1628] border border-slate-800/90 rounded-xl p-6 hover:border-amber-500/50 hover:bg-[#101a30] transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono-tech text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  AXE 0{idx + 1}
                </span>
                <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {axis.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {axis.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
