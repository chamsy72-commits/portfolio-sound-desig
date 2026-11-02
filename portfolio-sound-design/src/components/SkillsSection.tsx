import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Wrench, Terminal, Cpu, Globe2, Check } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-20 relative bg-[#090e1a] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4" />
              <span>Environnements de Production & Méthodologie</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              Compétences Techniques & Outils
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            Une expertise éprouvée sur les stations audionumériques leaders (Cubase, Reaper), la MAO, la synthèse et les technologies d'IA.
          </p>
        </div>

        {/* Technical Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {PORTFOLIO_DATA.skills.map((category, idx) => (
            <div
              key={idx}
              className="bg-[#0c1322] border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-mono-tech text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  {category.description}
                </p>

                {/* Items */}
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{item.name}</span>
                        <span className="font-mono-tech text-amber-400">{item.level}</span>
                      </div>

                      {/* Percentage gauge bar */}
                      <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Languages section from prompt */}
        <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
            <Globe2 className="w-4 h-4" />
            <span>Communication & Rayonnement International</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-6">
            Compétences Linguistiques
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PORTFOLIO_DATA.languages.map((lang, idx) => (
              <div
                key={idx}
                className="bg-[#0e1628] border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-[10px] font-mono-tech text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {lang.level}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{lang.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {lang.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
