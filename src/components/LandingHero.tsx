'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CanvasGlobe } from './CanvasGlobe';
import { useVelora } from '../context/VeloraContext';
import { Globe, Users, Flame, ChevronRight } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { setView } = useVelora();

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-warm-black flex flex-col justify-between px-6 py-8 md:px-12 md:py-12 select-none">
      {/* Background Ambience */}
      <div className="ambient-glow ambient-amber" />
      <div className="ambient-glow ambient-terracotta" />
      <div className="ambient-glow ambient-gold" />

      {/* Header navbar */}
      <header className="z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-outfit tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-amber-glow to-terracotta">
            VELORA
          </span>
          <span className="px-2 py-0.5 text-[10px] tracking-widest font-semibold uppercase rounded-full border border-gold/20 bg-gold/5 text-gold-light font-outfit">
            BETA
          </span>
        </div>
        <button
          onClick={() => setView('onboarding')}
          className="px-4 py-2 text-xs font-medium font-outfit tracking-widest uppercase border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition duration-300 rounded-full text-stone-300 hover:text-gold-light"
        >
          Enter Platform
        </button>
      </header>

      {/* Main Grid Content */}
      <main className="z-10 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12">
        {/* Left column - Typography and text */}
        <div className="lg:col-span-6 flex flex-col items-start justify-center gap-6 max-w-xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-gold/10 bg-gold/5 text-amber-glow"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-glow animate-pulse" />
            <span className="text-[11px] font-outfit tracking-widest uppercase font-semibold">
              Skip swiping. Feel chemistry.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white font-playfair"
          >
            Where{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-amber-glow to-terracotta">
              ambition
            </span>{' '}
            meets genuine{' '}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-clay">
              chemistry.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-stone-400 text-sm md:text-base leading-relaxed"
          >
            Velora is a futuristic, premium social chemistry platform for college students, founders, creators, and researchers. We connect global minds through humor evaluation, lifestyle metrics, and real-time cultural dialogue instead of superficial photo-swiping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
          >
            <button
              onClick={() => setView('onboarding')}
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-glow via-terracotta to-clay text-warm-black font-semibold font-outfit tracking-wider uppercase rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300 text-sm cursor-pointer"
            >
              Initialize Aura
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setView('reels')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-stone-200 hover:text-white font-semibold font-outfit tracking-wider uppercase rounded-xl transition duration-300 text-sm cursor-pointer"
            >
              Explore Reels
            </button>
          </motion.div>
        </div>

        {/* Right column - Glowing Canvas Globe */}
        <div className="lg:col-span-6 relative w-full h-[350px] md:h-[450px] lg:h-[550px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <CanvasGlobe />
          </motion.div>
        </div>
      </main>

      {/* Footer statistics */}
      <footer className="z-10 w-full grid grid-cols-3 gap-4 border-t border-white/5 pt-8 md:pt-12">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Globe className="w-4 h-4 text-amber-glow" />
            <span className="text-[10px] md:text-xs font-outfit uppercase tracking-widest">Global Nodes</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-white font-outfit tracking-tight">14,248</span>
        </div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 border-x border-white/5">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Flame className="w-4 h-4 text-terracotta" />
            <span className="text-[10px] md:text-xs font-outfit uppercase tracking-widest">Humor Matches</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-white font-outfit tracking-tight">98.4%</span>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-[10px] md:text-xs font-outfit uppercase tracking-widest">Countries Connected</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-white font-outfit tracking-tight">62</span>
        </div>
      </footer>
    </div>
  );
};
