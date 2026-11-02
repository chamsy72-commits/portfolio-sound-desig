import React, { useState } from 'react';
import { PORTFOLIO_DATA, Service } from '../data/portfolioData';
import { AudioWaveform, Music, Cpu, GraduationCap, ArrowRight, CheckCircle2, Eye, X } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForContact?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForContact }) => {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'AudioWaveform':
        return <AudioWaveform className="w-6 h-6 text-amber-400" />;
      case 'Music':
        return <Music className="w-6 h-6 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-amber-400" />;
      case 'GraduationCap':
      default:
        return <GraduationCap className="w-6 h-6 text-amber-400" />;
    }
  };

  const handleOrderService = (service: Service) => {
    if (onSelectServiceForContact) {
      onSelectServiceForContact(service.title);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 relative bg-[#090e1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <span>Prestations & Ingénierie Acoustique</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              Services & Prestations
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            Une expertise sonore complète pour les productions théâtrales, cinématographiques, radiophoniques et universitaires.
          </p>
        </div>

        {/* Services Grid (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_DATA.services.map((service) => (
            <div
              key={service.id}
              className="bg-[#0e1629] border border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
            >
              <div>
                {/* Header with icon & badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-mono-tech text-slate-400 group-hover:text-amber-400 transition-colors uppercase">
                    Sur Mesure
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors mb-1">
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-amber-400/90 mb-4">
                  {service.subtitle}
                </p>

                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Optional attached masterclass/formation poster */}
                {service.image && (
                  <div className="mb-5 bg-[#080d19] p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                    <img
                      src={service.image}
                      alt="Affiche Masterclass Quel Son pour Quelle Image"
                      className="w-14 h-20 object-cover rounded border border-amber-500/30 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                      onClick={() => setSelectedPoster(service.image || null)}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200">Affiche Masterclass Officielle</p>
                      <p className="text-[11px] text-slate-400">« Quel SON pour quelle IMAGE ? » · ISAMG</p>
                      <button
                        onClick={() => setSelectedPoster(service.image || null)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1 font-mono-tech cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Agrandir l'affiche</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Core Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables & CTA */}
              <div className="pt-4 border-t border-slate-800/80 mt-auto">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mb-4">
                  <span className="font-mono-tech text-slate-500">Livrables :</span>
                  {service.deliverables.map((del, dIdx) => (
                    <span key={dIdx} className="text-slate-300">
                      {del}{dIdx < service.deliverables.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleOrderService(service)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500/80 text-xs font-semibold text-slate-200 hover:text-amber-300 group-hover:bg-amber-500/10 transition-all cursor-pointer"
                >
                  <span>Demander un devis pour ce service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Poster Zoom Modal */}
      {selectedPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-xl max-h-[90vh] bg-[#0c1322] border border-amber-500/30 rounded-2xl p-4 overflow-hidden">
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPoster}
              alt="Affiche en grand format"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};
