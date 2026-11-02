import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { SoundLabSection } from './components/SoundLabSection';
import { AnthropologySection } from './components/AnthropologySection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AudioPlayerBar } from './components/AudioPlayerBar';

export default function App() {
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f3f4f6] relative flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ServicesSection onSelectServiceForContact={(srv) => setSelectedService(srv)} />
        <PortfolioSection />
        <SoundLabSection />
        <AnthropologySection />
        <SkillsSection />
        <ContactSection prefilledService={selectedService} />
      </main>

      <Footer />
      <AudioPlayerBar />
    </div>
  );
}
