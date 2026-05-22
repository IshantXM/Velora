'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVelora } from '../context/VeloraContext';
import { Heart, X, Compass, Award, Play, Activity } from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const MatchExplorer: React.FC = () => {
  const { profiles, swipedIds, swipeUser, userProfile } = useVelora();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter profiles that haven't been swiped yet
  const activeProfiles = profiles.filter(p => !swipedIds[p.id]);
  const currentProfile = activeProfiles[0];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentProfile) return;
    
    // Trigger swipe in context
    swipeUser(currentProfile.id, direction);
    
    // Advance index
    setCurrentIndex(prev => prev + 1);
  };

  // Helper to calculate absolute compatibility score
  const getCompatibilityScore = (p: typeof profiles[0]) => {
    if (!userProfile) return 85; // Default fallback

    const hDiff = Math.abs((userProfile.humorScore || 50) - p.humorScore);
    const aDiff = Math.abs((userProfile.ambitionScore || 50) - p.ambitionScore);
    const sDiff = Math.abs((userProfile.sleepScore || 50) - p.sleepScore);

    const totalDiff = (hDiff + aDiff + sDiff) / 3;
    return Math.round(100 - totalDiff);
  };

  return (
    <div className="relative w-full h-[calc(100vh-70px)] bg-warm-black flex items-center justify-center p-4 md:p-6 select-none overflow-hidden max-w-4xl mx-auto">
      {/* Ambience */}
      <div className="ambient-glow ambient-amber opacity-5" />
      <div className="ambient-glow ambient-terracotta opacity-5" />

      <AnimatePresence mode="wait">
        {currentProfile ? (
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-3xl glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto md:overflow-hidden text-left"
          >
            {/* Left Column: Visuals (5 cols) */}
            <div className="md:col-span-5 relative h-[300px] md:h-full bg-stone-900 border-r border-white/5">
              <img
                src={currentProfile.images[0]}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Text overlay on image (for mobile layout support) */}
              <div className="absolute left-6 bottom-6 right-6">
                <span className="text-[9px] font-mono tracking-widest text-amber-glow uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Chemistry Match
                </span>
                <h3 className="text-2xl font-bold font-outfit text-white mt-2 flex items-baseline gap-2">
                  {currentProfile.name}, <span className="font-light">{currentProfile.age}</span>
                </h3>
                <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-1 font-outfit">
                  <Compass className="w-3.5 h-3.5 text-terracotta" /> {currentProfile.city}, {currentProfile.country}
                </p>
              </div>
            </div>

            {/* Right Column: Chemistry Profile Data (7 cols) */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6 md:h-full md:overflow-y-auto">
              
              {/* Profile Bio & Badges */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.badges.includes('GitHub') && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-stone-300 font-mono flex items-center gap-1.5">
                      <GithubIcon className="w-3.5 h-3.5" /> Dev Verified
                    </span>
                  )}
                  {currentProfile.badges.includes('LinkedIn') && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[10px] text-[#71b1f9] font-mono flex items-center gap-1.5">
                      <LinkedinIcon className="w-3.5 h-3.5" /> Career Verified
                    </span>
                  )}
                  {currentProfile.badges.includes('University') && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-glow font-mono flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> University Node
                    </span>
                  )}
                  {currentProfile.badges.includes('Founder') && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-mono">
                      🚀 Founder
                    </span>
                  )}
                </div>

                <p className="text-sm text-stone-300 leading-relaxed font-sans italic">
                  "{currentProfile.bio}"
                </p>
              </div>

              {/* Chemistry Metrics Visual Grid */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-outfit flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-glow" /> Chemistry Calibrations
                  </h4>
                  <span className="text-xs font-bold text-amber-glow bg-amber-glow/5 border border-amber-glow/10 px-2 py-0.5 rounded-full font-mono">
                    {getCompatibilityScore(currentProfile)}% Compatibility
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Slider comparison 1: Humor */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      <span>Humor Profile ({currentProfile.humorArchetype.split(' ')[0]})</span>
                      <span className="text-stone-300">Match: {Math.round(100 - Math.abs((userProfile?.humorScore || 50) - currentProfile.humorScore))}%</span>
                    </div>
                    <div className="relative h-2 bg-stone-900 rounded-full border border-white/5 overflow-hidden">
                      {/* User's pin position */}
                      <div
                        className="absolute w-2 h-full bg-stone-500 z-10"
                        style={{ left: `${userProfile?.humorScore || 50}%` }}
                        title="Your score"
                      />
                      {/* Candidate's score bar */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-amber-glow to-terracotta rounded-full"
                        style={{ width: `${currentProfile.humorScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-stone-600 font-mono">
                      <span>DEADPAN</span>
                      <span>EXUBERANT</span>
                    </div>
                  </div>

                  {/* Slider comparison 2: Ambition */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      <span>Ambition Speed</span>
                      <span className="text-stone-300">Match: {Math.round(100 - Math.abs((userProfile?.ambitionScore || 50) - currentProfile.ambitionScore))}%</span>
                    </div>
                    <div className="relative h-2 bg-stone-900 rounded-full border border-white/5 overflow-hidden">
                      {/* User's pin */}
                      <div
                        className="absolute w-2 h-full bg-stone-500 z-10"
                        style={{ left: `${userProfile?.ambitionScore || 50}%` }}
                      />
                      {/* Candidate's bar */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-terracotta to-clay rounded-full"
                        style={{ width: `${currentProfile.ambitionScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-stone-600 font-mono">
                      <span>FLOW LIFESTYLE</span>
                      <span>HYPERSPEED</span>
                    </div>
                  </div>

                  {/* Slider comparison 3: Sleep */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      <span>Sleep Rhythm ({currentProfile.sleepSchedule.split(' ')[0]})</span>
                      <span className="text-stone-300">Match: {Math.round(100 - Math.abs((userProfile?.sleepScore || 50) - currentProfile.sleepScore))}%</span>
                    </div>
                    <div className="relative h-2 bg-stone-900 rounded-full border border-white/5 overflow-hidden">
                      {/* User's pin */}
                      <div
                        className="absolute w-2 h-full bg-stone-500 z-10"
                        style={{ left: `${userProfile?.sleepScore || 50}%` }}
                      />
                      {/* Candidate's bar */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-clay to-gold rounded-full"
                        style={{ width: `${currentProfile.sleepScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-stone-600 font-mono">
                      <span>EARLY BIRD</span>
                      <span>NIGHT OWL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personality traits tags */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">Personality Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.personalityTraits.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-stone-300 font-outfit"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons (Swipe Left / Right) */}
              <div className="flex justify-center gap-6 border-t border-white/5 pt-6 mt-2">
                {/* Swipe Left (Dislike) */}
                <button
                  onClick={() => handleSwipe('left')}
                  className="p-4 rounded-full bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Swipe Right (Like / Spark Chemistry) */}
                <button
                  onClick={() => handleSwipe('right')}
                  className="p-4 rounded-full bg-gradient-to-r from-amber-glow via-terracotta to-clay hover:opacity-90 text-warm-black shadow-lg shadow-amber-glow/10 hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <Heart className="w-6 h-6 fill-warm-black" />
                </button>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center p-8 glass-panel border border-white/5 rounded-3xl max-w-sm"
          >
            <div className="w-12 h-12 bg-amber-glow/10 border border-amber-glow/20 rounded-2xl flex items-center justify-center text-amber-glow mb-4 animate-pulse">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">Sphere fully mapped</h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              You've explored all active chemistry nodes in this sector. Try uploading a StandUp clip to attract more global attention.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
