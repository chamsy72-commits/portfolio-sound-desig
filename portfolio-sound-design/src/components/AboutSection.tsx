import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { BookOpen, GraduationCap, Compass, Headphones, Sparkles, Mic2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 relative bg-[#070b14] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Trajectoire Académique & Artistique</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              À Propos
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            Une double exigence : la rigueur scientifique de l'anthropologie acoustique alliée à la liberté de la création scénique.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Biography Card */}
          <div className="lg:col-span-7 bg-[#0c1322] border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-bl-full pointer-events-none" />

            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-amber-400" />
                <span>L'artisanat sonore au croisement des mondes</span>
              </h3>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Fort d'un parcours académique de pointe (titulaire d'un{' '}
                  <strong className="text-amber-300 font-semibold">Doctorat en Musicologie</strong> et d'une{' '}
                  <strong className="text-amber-300 font-semibold">Habilitation Universitaire - HDR</strong>) et d'une longue pratique dans le domaine de la production musicale et de l'ingénierie du son, je mets mon expertise au service de la création artistique, théâtrale et multimédia.
                </p>
                <p>
                  <strong className="text-white">Mon approche :</strong> Allier la rigueur de la recherche en anthropologie du son à la sensibilité créative pour concevoir des paysages sonores immersifs et percutants. Mes domaines de prédilection incluent le design sonore pour le théâtre et le spectacle vivant (notamment avec les créations <em>« Cadence »</em> et <em>« Quand l'eau disparaît »</em>), les musiques de films, les fictions radiophoniques primées (<em>« Al-Wokor »</em>, <em>« Ibn Khaldoun »</em>), et l'intégration des outils d'intelligence artificielle dans la création audio contemporaine.
                </p>
              </div>

              {/* Academic Quote */}
              <div className="mt-6 pt-6 border-t border-slate-800/80">
                <blockquote className="italic text-slate-400 text-sm border-l-2 border-amber-500/60 pl-4 py-1">
                  « Écouter un lieu, ce n'est pas seulement entendre ses bruits : c'est déchiffrer son histoire, ses silences et la mémoire affective des êtres qui l'habitent. »
                </blockquote>
              </div>
            </div>

            {/* Field recording photo badge */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <img
                src={PORTFOLIO_DATA.profile.photoStudio}
                alt="Ali Chams Eddine en session de prise de son"
                className="w-16 h-16 rounded-lg object-cover object-top border border-amber-500/30 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono-tech uppercase">
                  <Mic2 className="w-3.5 h-3.5" />
                  <span>Prise de son in situ & Cinéma</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Formation « Son et Sens : Le pouvoir de la prise de son au Cinéma » animée par Ali Chams Eddine.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Credentials & Pillars */}
          <div className="lg:col-span-5 space-y-4">
            {/* Academic Credentials */}
            <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-3">
                <GraduationCap className="w-5 h-5" />
                <span>Titres Universitaires & Affiliation</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>
                    <strong className="text-white">Habilitation Universitaire (HDR)</strong> en Musicologie & Sciences de l'Art.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>
                    <strong className="text-white">Doctorat en Musicologie</strong> avec mention très honorable.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>
                    <strong className="text-white">Enseignant-chercheur</strong> à l'Institut Supérieur des Arts et Métiers de Gabès (Université de Gabès).
                  </span>
                </li>
              </ul>
            </div>

            {/* 3 Pillars of Work */}
            <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-3">
                <BookOpen className="w-5 h-5" />
                <span>Piliers de Création</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Anthropologie du Son & Écologie Acoustique</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Enregistrement de terrain (Field Recording), archéologie sonore des oasis et résonances de la Méditerranée.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dramaturgie & Scénographie Sonore</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Conception surround, ambiances immersives pour le théâtre contemporain et les fictions radiophoniques.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>MAO & Intelligence Artificielle</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Cubase, Reaper, synthèse modulaire et modèles neuronaux audio pour une recherche sonore inouïe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
