import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Download, MessageSquare, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  prefilledService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ prefilledService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: prefilledService || 'Théâtre & Arts de la Scène',
    subject: '',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update project type if prefilledService changes
  React.useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({ ...prev, projectType: prefilledService }));
    }
  }, [prefilledService]);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Ali Chams Eddine
N:Chams Eddine;Ali;;;
TITLE:Sound Designer & Chercheur en Anthropologie du Son
ORG:ISAM Gabès - Université de Gabès
TEL;TYPE=CELL,VOICE:${PORTFOLIO_DATA.profile.phone}
EMAIL;TYPE=WORK,INTERNET:${PORTFOLIO_DATA.profile.email}
ADR;TYPE=WORK:;;Grand Tunis;Grand Tunis;;;Tunisie
NOTE:${PORTFOLIO_DATA.profile.slogan}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Ali_Chams_Eddine_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Open mailto with populated subject and body
    const subject = encodeURIComponent(`[Demande Portfolio] ${formData.projectType} - ${formData.subject || 'Projet Sonore'}`);
    const body = encodeURIComponent(`Bonjour Ali Chams Eddine,\n\nNom: ${formData.name}\nEmail: ${formData.email}\nType de projet: ${formData.projectType}\n\nMessage:\n${formData.message}\n\nCordialement.`);
    
    setTimeout(() => {
      window.location.href = `mailto:${PORTFOLIO_DATA.profile.email}?subject=${subject}&body=${body}`;
    }, 400);
  };

  return (
    <section id="contact" className="py-20 relative bg-[#070b14] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" />
              <span>Collaboration & Échanges Professionnels</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-4">
              Contact & Localisation
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-light">
            Pour une création sonore théâtrale, une musique de film, un projet radiophonique ou une intervention universitaire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Card & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />

              <h3 className="text-lg font-bold text-white mb-2 font-serif-title">
                Coordonnées Directes
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Disponible pour des projets dans le Grand Tunis, à l'échelle nationale et internationale.
              </p>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 group hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-mono-tech uppercase">E-mail professionnel</p>
                      <a
                        href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                        className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-amber-400 truncate block transition-colors"
                      >
                        {PORTFOLIO_DATA.profile.email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(PORTFOLIO_DATA.profile.email, 'email')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white shrink-0"
                    title="Copier l'email"
                  >
                    {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone Item */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 group hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-mono-tech uppercase">Téléphone & WhatsApp</p>
                      <a
                        href={`tel:${PORTFOLIO_DATA.profile.phone}`}
                        className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-amber-400 truncate block transition-colors font-mono-tech"
                      >
                        {PORTFOLIO_DATA.profile.phone}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(PORTFOLIO_DATA.profile.phone, 'phone')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white shrink-0"
                    title="Copier le numéro"
                  >
                    {copiedPhone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location Item */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-mono-tech uppercase">Localisation</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Grand Tunis, Tunisie
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Région métropolitaine de Tunis & axe universitaire de Gabès
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadVCard}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Télécharger la fiche contact (.vcf)</span>
                </button>

                <a
                  href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  <span>Envoyer un email</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Geographical Presence note */}
            <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-5 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200 block mb-1">
                Présence & Déplacements :
              </span>
              Basé dans le Grand Tunis pour les résidences de création théâtrale, sessions studio et régies en direct. Interventions académiques et séminaires à l'Université de Gabès (ISAMG).
            </div>
          </div>

          {/* Right Column: Interactive Contact & Quote Form */}
          <div className="lg:col-span-7 bg-[#0c1322] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-serif-title">
                Formulaire de Contact & Devis Sonore
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Décrivez votre projet artistique ou académique. Une réponse vous sera adressée sous 24 à 48 heures.
            </p>

            {isSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-emerald-200 mb-1">Message prêt à être transmis !</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
                  Votre client de messagerie a été sollicité avec votre message pré-rempli. Vous pouvez également écrire directement à <strong>{PORTFOLIO_DATA.profile.email}</strong>.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase">
                      Votre Nom & Prénom / Structure *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Compagnie Théâtrale, Réalisateur..."
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase">
                      Votre Adresse E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@exemple.tn"
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase">
                      Type de Prestation / Projet
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 outline-none transition-colors"
                    >
                      <option value="Théâtre & Arts de la Scène">Théâtre & Arts de la Scène (Sound Design)</option>
                      <option value="Composition & Production Musicale">Composition & Musique de Film</option>
                      <option value="Fiction Radiophonique / Podcast">Fiction Radiophonique / Podcast</option>
                      <option value="IA & Innovation Audio">IA & Innovation Audio</option>
                      <option value="Formation MAO (Cubase / Reaper)">Formation MAO (Cubase / Reaper)</option>
                      <option value="Conférence / Recherche Anthropologique">Conférence / Recherche Anthropologique</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase">
                      Objet du Message
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="ex: Conception sonore nouvelle pièce"
                      className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 uppercase">
                    Description du Projet & Calendrier prévisionnel *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Précisez vos besoins : durée de la pièce, type d'ambiances souhaitées, dates de répétition ou tournage..."
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la demande à Ali Chams Eddine</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
