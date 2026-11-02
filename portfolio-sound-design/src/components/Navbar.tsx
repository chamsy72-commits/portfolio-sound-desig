import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { audioEngine } from '../services/audioEngine';
import { Volume2, VolumeX, Menu, X, Waves, Mail, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);

    audioEngine.setOnStateChange((playing) => {
      setIsPlayingAudio(playing);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSoundscape = () => {
    if (isPlayingAudio) {
      audioEngine.pause();
    } else {
      audioEngine.playTrack('cadounis');
    }
  };

  const navLinks = [
    { label: "À propos", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio & Écoute", href: "#portfolio" },
    { label: "Atelier Sonore", href: "#sound-lab" },
    { label: "Anthropologie", href: "#anthropology" },
    { label: "Compétences", href: "#skills" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
            <Waves className="w-5 h-5 text-amber-400" />
            <div className="absolute -inset-0.5 rounded-lg bg-amber-500/10 blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-title font-bold text-base sm:text-lg tracking-wide text-slate-100 group-hover:text-amber-300 transition-colors">
                Ali Chams Eddine
              </span>
              <span className="hidden lg:inline text-[11px] font-mono-tech text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                HDR · Ph.D
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Sound Design & Anthropologie du Son
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-amber-400 transition-colors relative py-1 font-medium text-xs tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Audio soundscape toggle */}
          <button
            onClick={toggleSoundscape}
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${
              isPlayingAudio
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Activer l'ambiance sonore immersive"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-mono-tech text-[11px]">Son On</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="font-mono-tech text-[11px]">Ambiance</span>
              </>
            )}
          </button>

          {/* Contact button */}
          <a
            href="#contact"
            className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-semibold px-4 py-1.5 rounded-full text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40"
          >
            <span>Me Contacter</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleSoundscape}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400"
            title="Audio"
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b14]/98 border-b border-slate-800 px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-amber-400 py-1 border-b border-slate-800/50"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm text-center"
              >
                <Mail className="w-4 h-4" />
                <span>Prendre contact / Devis</span>
              </a>

              <p className="text-center text-xs text-slate-500 font-mono-tech mt-2">
                Grand Tunis · +216 52 767 575
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
