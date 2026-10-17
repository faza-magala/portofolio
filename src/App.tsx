import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { LearningJourney } from './components/sections/LearningJourney';
import { Contact } from './components/sections/Contact';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF] text-[#172B4D]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <LearningJourney />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;
