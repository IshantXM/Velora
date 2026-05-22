'use client';

import React from 'react';
import { useVelora } from '../context/VeloraContext';
import { Sparkles, BrainCircuit, Globe2, Heart, Award, ArrowUpRight, Compass, MessageSquare } from 'lucide-react';
import { mockProfiles } from '../data/mockData';

export const AiDashboard: React.FC = () => {
  const { userProfile, matches, setView, setActiveMatchId } = useVelora();

  // Fallback defaults if onboarding not finished
  const humor = userProfile?.humorScore ?? 58;
  const ambition = userProfile?.ambitionScore ?? 62;
  const sleep = userProfile?.sleepScore ?? 72;
  const name = userProfile?.name ?? 'Aura Seeker';
  const city = userProfile?.city ?? 'San Francisco';
  const country = userProfile?.country ?? 'United States';

  // Calculate matching cities indices
  const globalAffinity = [
    { city: 'Tokyo, JP', score: Math.round(98 - Math.abs(sleep - 90) * 0.15 - Math.abs(humor - 35) * 0.2), archetype: 'Absurdist Deadpan', color: '#eab308' },
    { city: 'Berlin, DE', score: Math.round(96 - Math.abs(ambition - 95) * 0.15 - Math.abs(humor - 15) * 0.2), archetype: 'Dry German Irony', color: '#f59e0b' },
    { city: 'Montreal, CA', score: Math.round(97 - Math.abs(sleep - 78) * 0.15 - Math.abs(humor - 48) * 0.2), archetype: 'Intellectual Puns', color: '#d97706' },
    { city: 'Mumbai, IN', score: Math.round(92 - Math.abs(sleep - 20) * 0.15 - Math.abs(humor - 75) * 0.2), archetype: 'Quick Witty Stories', color: '#eab308' }
  ].sort((a, b) => b.score - a.score);

  const handleJumpToChat = (id: string) => {
    setActiveMatchId(id);
    setView('chat');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-70px)] bg-warm-black p-6 md:p-8 select-none border border-white/5 md:rounded-3xl overflow-y-auto">
      {/* Background ambience */}
      <div className="ambient-glow ambient-amber opacity-10" />
      <div className="ambient-glow ambient-terracotta opacity-10" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 mb-6">
        <div className="text-left">
          <h2 className="text-2xl font-bold font-playfair text-white flex items-center gap-2">
            AI Chemistry Insights
          </h2>
          <p className="text-xs text-stone-400">Deep mathematical analytics tracking your global communication footprint.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-glow/10 bg-amber-glow/5 text-amber-glow">
          <BrainCircuit className="w-4.5 h-4.5 animate-pulse" />
          <span className="text-[10px] font-outfit uppercase tracking-widest font-semibold">Active Calibrator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column - Core Metrics & Radar (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Metrics summary card */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Humor circle */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Humor Index</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="#1c1a18" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="42" stroke="#eab308" strokeWidth="6" fill="transparent"
                          strokeDasharray={263.8} strokeDashoffset={263.8 - (263.8 * humor) / 100}
                          strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white font-outfit">{humor}%</span>
                  <span className="text-[8px] font-mono text-stone-500">
                    {humor < 35 ? 'DEADPAN' : humor > 65 ? 'PLAYFUL' : 'WITTY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ambition Circle */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 border-y sm:border-y-0 sm:border-x border-white/5 py-4 sm:py-0">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Ambition Index</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="#1c1a18" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="42" stroke="#d97706" strokeWidth="6" fill="transparent"
                          strokeDasharray={263.8} strokeDashoffset={263.8 - (263.8 * ambition) / 100}
                          strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white font-outfit">{ambition}%</span>
                  <span className="text-[8px] font-mono text-stone-500">
                    {ambition < 35 ? 'COZY' : ambition > 75 ? 'HUSTLER' : 'BUILDER'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sleep Circle */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Sleep Footprint</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="#1c1a18" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="42" stroke="#ea580c" strokeWidth="6" fill="transparent"
                          strokeDasharray={263.8} strokeDashoffset={263.8 - (263.8 * sleep) / 100}
                          strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white font-outfit">{sleep}%</span>
                  <span className="text-[8px] font-mono text-stone-500 font-semibold">
                    {sleep < 35 ? 'LARK' : sleep > 65 ? 'OWL' : 'ANCHOR'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Personality Coordinates Graph */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-outfit text-stone-200 uppercase tracking-widest">
                Personality Matrix Coordinates
              </h3>
              <span className="text-[10px] font-mono text-stone-500">COORDINATE AXIS</span>
            </div>

            {/* Simulated custom bar graphs representing the coordinates */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Logic vs. Empathy</span>
                  <span className="text-white font-semibold">74% Logical</span>
                </div>
                <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-amber-glow rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Independence vs. Collaboration</span>
                  <span className="text-white font-semibold">68% Collaborative</span>
                </div>
                <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-terracotta rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Curiosity vs. Routine Execution</span>
                  <span className="text-white font-semibold">89% Curiously-Driven</span>
                </div>
                <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-clay rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badges summary */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
            <h3 className="text-sm font-bold font-outfit text-stone-200 uppercase tracking-widest">
              Unlocked Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
                <div className="p-2 bg-amber-glow/10 border border-amber-glow/20 rounded-xl text-amber-glow">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200 font-outfit">Humor Calibrated</h4>
                  <p className="text-[10px] text-stone-500 leading-relaxed mt-0.5">
                    Analyzed by StandUp-core. Unlocked high-end deadpan matching algorithms.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
                <div className="p-2 bg-terracotta/10 border border-terracotta/20 rounded-xl text-terracotta">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200 font-outfit">Cross-Cultural Visa</h4>
                  <p className="text-[10px] text-stone-500 leading-relaxed mt-0.5">
                    Activated global location mapping nodes. Open for Japanese, German, and Indian channels.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Heatmap & Match timelines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Global Affinity Heatmap */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
            <h3 className="text-sm font-bold font-outfit text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
              <Globe2 className="w-4.5 h-4.5 text-amber-glow animate-spin-slow" /> Global Affinity Maps
            </h3>
            
            <div className="space-y-3.5">
              {globalAffinity.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-300 flex items-center gap-1.5 font-outfit">
                      <Compass className="w-3.5 h-3.5" style={{ color: item.color }} /> {item.city}
                    </span>
                    <span className="font-mono text-stone-400 font-bold">{item.score}% Match</span>
                  </div>
                  <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="block text-[8px] font-mono text-stone-500">
                    ALIGNMENT: {item.archetype.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent matches timeline */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4 text-left">
            <h3 className="text-sm font-bold font-outfit text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-terracotta" /> Core Chemistry Nodes
            </h3>

            <div className="space-y-4 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {matches.length === 0 ? (
                <div className="text-stone-600 text-xs font-sans py-2 pl-2">
                  No active connections mapped yet.
                </div>
              ) : (
                matches.map(id => {
                  const profile = mockProfiles.find(p => p.id === id);
                  if (!profile) return null;

                  return (
                    <div key={id} className="relative flex items-center justify-between group">
                      {/* Timeline indicator node */}
                      <span className="absolute -left-[18.5px] w-2 h-2 rounded-full bg-amber-glow border border-warm-black" />

                      <div className="flex items-center gap-2.5 pl-2">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-stone-300 font-outfit">{profile.name}</h4>
                          <span className="text-[8px] text-stone-600 font-mono uppercase tracking-widest">
                            {profile.city} node
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJumpToChat(profile.id)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-stone-400 group-hover:text-amber-glow group-hover:bg-amber-glow/5 transition cursor-pointer"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
