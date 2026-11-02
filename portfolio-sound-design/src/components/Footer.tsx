import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Waves, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050810] border-t border-slate-800/80 text-slate-400 py-12 pb-24 sm:pb-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg font-bold text-slate-100">
                Ali Chams Eddine
              </h3>
              <p className="text-xs text-slate-400">
                Sound Designer, Musicien & Chercheur en Anthropologie du Son
              </p>
            </div>
          </div>

          {/* Quick Info & Location */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono-tech text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Grand Tunis, Tunisie</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <a href={`mailto:${PORTFOLIO_DATA.profile.email}`} className="hover:text-amber-400 transition-colors">
                {PORTFOLIO_DATA.profile.email}
              </a>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <a href={`tel:${PORTFOLIO_DATA.profile.phone}`} className="hover:text-amber-400 transition-colors">
                {PORTFOLIO_DATA.profile.phone}
              </a>
            </span>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
            title="Retour en haut"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copyright notice matching user prompt */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© 2026 Ali Chams Eddine – Tous droits réservés.</p>
          <p className="text-slate-400 font-mono-tech text-[11px]">
            Sound Design & Anthropologie du Son | Grand Tunis, Tunisie
          </p>
        </div>
      </div>
    </footer>
  );
};
