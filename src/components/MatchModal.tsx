'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVelora } from '../context/VeloraContext';
import { mockProfiles } from '../data/mockData';
import { Sparkles, MessageSquare, Compass, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MatchModal: React.FC = () => {
  const { triggerMatchCelebration, setTriggerMatchCelebration, userProfile, setView, setActiveMatchId } = useVelora();

  const matchedProfile = triggerMatchCelebration
    ? mockProfiles.find(p => p.id === triggerMatchCelebration)
    : null;

  // Trigger confetti burst on activation
  useEffect(() => {
    if (matchedProfile) {
      // Fire confetti multiple times for premium sensation
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // confettis with warm gold, bronze, amber tones
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#eab308', '#f59e0b', '#d97706'] });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ea580c', '#eab308', '#f59e0b'] });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [matchedProfile]);

  const handleChatNow = () => {
    if (!matchedProfile) return;
    setActiveMatchId(matchedProfile.id);
    setTriggerMatchCelebration(null); // Clear modal
    setView('chat'); // Route to chat
  };

  const handleClose = () => {
    setTriggerMatchCelebration(null);
  };

  return (
    <AnimatePresence>
      {matchedProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 select-none"
        >
          {/* Ambient glowing circles */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-glow/20 rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-terracotta/20 rounded-full filter blur-3xl opacity-20 pointer-events-none animate-pulse" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-full max-w-lg text-center space-y-8 relative">
            
            {/* Header Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="space-y-2"
            >
              <div className="flex justify-center gap-1.5 text-amber-glow animate-sparkle">
                <Sparkles className="w-5 h-5 fill-amber-glow" />
                <span className="text-xs font-outfit uppercase tracking-widest font-bold">Resonance Found</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-white font-playfair">
                Chemistry Calibrated
              </h2>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Your humor profiles and ambition vectors have registered a high-affinity resonance overlay.
              </p>
            </motion.div>

            {/* Pulsing Avatar overlay */}
            <div className="flex items-center justify-center gap-8 py-6">
              {/* User Avatar */}
              <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-2xl bg-amber-glow/10 border border-amber-glow/20 animate-pulse" />
                <img
                  src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'}
                  alt="Your avatar"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-white/20 relative shadow-2xl"
                />
                <span className="absolute -bottom-2 right-2 px-2 py-0.5 rounded bg-amber-glow text-warm-black font-mono text-[9px] font-bold">YOU</span>
              </motion.div>

              {/* Pulsing Connection badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', damping: 8 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-glow to-terracotta flex items-center justify-center text-warm-black shadow-lg font-outfit font-bold text-xs"
              >
                &amp;
              </motion.div>

              {/* Match Avatar */}
              <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-2xl bg-terracotta/10 border border-terracotta/20 animate-pulse" />
                <img
                  src={matchedProfile.avatar}
                  alt={matchedProfile.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-white/20 relative shadow-2xl"
                />
                <span className="absolute -bottom-2 left-2 px-2 py-0.5 rounded bg-terracotta text-white font-mono text-[9px] font-bold">
                  {matchedProfile.name.split(' ')[0].toUpperCase()}
                </span>
              </motion.div>
            </div>

            {/* Simulated Wingman Starter suggestion */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] text-left max-w-md mx-auto space-y-2.5"
            >
              <div className="flex items-center gap-1.5 text-xs text-amber-glow font-bold font-outfit">
                <Sparkles className="w-4 h-4 fill-amber-glow" /> AI Wingman Icebreaker Suggestion
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "{matchedProfile.icebreaker.replace(/Ask [a-zA-Z ]+: "/, '').slice(0, -1)}"
              </p>
              <span className="block text-[8px] font-mono text-stone-500 uppercase tracking-wider">
                COMPATIBILITY FOCUS: SHARED {matchedProfile.humorScore < 50 ? 'DRY DEADPAN' : 'WITTY'} HUMOR ARCHETYPE
              </span>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex flex-col gap-3 max-w-xs mx-auto"
            >
              <button
                onClick={handleChatNow}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-glow via-terracotta to-clay text-warm-black font-semibold font-outfit tracking-wider uppercase rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition duration-300 text-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-warm-black" /> Send generative spark
              </button>

              <button
                onClick={handleClose}
                className="py-3 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-stone-200 transition"
              >
                Keep Exploring Nodes
              </button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
