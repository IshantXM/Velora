'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVelora } from '../context/VeloraContext';
import { ArrowRight, ArrowLeft, ShieldCheck, Check, Award, Compass } from 'lucide-react';

const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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

const LinkedinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding, setView } = useVelora();
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState(21);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  
  // Slider states (0-100)
  const [sleepScore, setSleepScore] = useState(50);
  const [ambitionScore, setAmbitionScore] = useState(50);
  const [humorScore, setHumorScore] = useState(50);

  // Verification states
  const [gitHubConnected, setGitHubConnected] = useState(false);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [uniName, setUniName] = useState('');
  const [uniVerified, setUniVerified] = useState(false);

  // Loading animation state for verification buttons
  const [verifyingGit, setVerifyingGit] = useState(false);
  const [verifyingLinked, setVerifyingLinked] = useState(false);
  const [verifyingUni, setVerifyingUni] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Assemble final profile data
      const badges = [];
      if (gitHubConnected) badges.push('GitHub');
      if (linkedInConnected) badges.push('LinkedIn');
      if (uniVerified) badges.push('University');
      if (ambitionScore > 75) badges.push('Founder');
      if (badges.length === 0) badges.push('Creator');

      let sleepSchedule = 'Balanced (12:00 AM - 7:30 AM)';
      if (sleepScore > 70) {
        sleepSchedule = 'Night Owl (2:30 AM - 9:30 AM)';
      } else if (sleepScore < 30) {
        sleepSchedule = 'Early Bird (5:30 AM - 10:00 PM)';
      }

      completeOnboarding({
        name: name || 'Aura Seeker',
        age: age || 21,
        city: city || 'San Francisco',
        country: country || 'United States',
        bio: bio || 'Building the future, researching connection, and seeking humor alignment.',
        avatar,
        sleepScore,
        ambitionScore,
        humorScore,
        sleepSchedule,
        badges,
        interests: ['Social Tech', 'Humor Archetypes', 'Global Connections'],
        personalityTraits: ['Cozy Architect', 'Spontaneous Thinker']
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      setView('landing');
    }
  };

  // Simulating APIs
  const connectGitHub = () => {
    setVerifyingGit(true);
    setTimeout(() => {
      setGitHubConnected(true);
      setVerifyingGit(false);
    }, 1500);
  };

  const connectLinkedIn = () => {
    setVerifyingLinked(true);
    setTimeout(() => {
      setLinkedInConnected(true);
      setVerifyingLinked(false);
    }, 1500);
  };

  const verifyUniversity = () => {
    if (!uniName) return;
    setVerifyingUni(true);
    setTimeout(() => {
      setUniVerified(true);
      setVerifyingUni(false);
    }, 1500);
  };

  // Step transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full min-h-screen bg-warm-black flex items-center justify-center p-6 select-none overflow-hidden">
      <div className="ambient-glow ambient-amber opacity-[0.08]" />
      <div className="ambient-glow ambient-terracotta opacity-[0.08]" />

      <div className="w-full max-w-xl glass-panel rounded-3xl p-8 relative z-10 border border-white/5 flex flex-col justify-between min-h-[550px] shadow-2xl">
        
        {/* Top Header bar with steps count */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-outfit uppercase tracking-widest text-stone-500">Aura Calibration</span>
            <h2 className="text-sm font-semibold font-outfit text-white">Step {step} of 4</h2>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-gold to-terracotta' : 'bg-warm-gray'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area with slide animations */}
        <div className="flex-grow flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold font-playfair text-stone-100">Tell us about your aura</h3>
                  <p className="text-xs text-stone-400">Introduce yourself to the global chemical mesh.</p>
                </div>

                {/* Avatar selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-outfit tracking-widest uppercase text-stone-400">Select Identity Image</label>
                  <div className="flex gap-4">
                    {AVATAR_PRESETS.map((av, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(av)}
                        className={`relative rounded-2xl overflow-hidden w-14 h-14 transition duration-300 border-2 ${
                          avatar === av ? 'border-amber-glow scale-105 shadow-lg shadow-amber-glow/20' : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                      >
                        <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                        {avatar === av && (
                          <div className="absolute inset-0 bg-warm-black/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-amber-glow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-outfit tracking-widest uppercase text-stone-400">What do we call you?</label>
                    <input
                      type="text"
                      placeholder="E.g., Ishant"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:border-gold/30 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-outfit tracking-widest uppercase text-stone-400">Age</label>
                    <input
                      type="number"
                      min={18}
                      max={30}
                      value={age}
                      onChange={e => setAge(parseInt(e.target.value) || 18)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-stone-200 text-sm focus:outline-none focus:border-gold/30 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-outfit tracking-widest uppercase text-stone-400">City</label>
                    <input
                      type="text"
                      placeholder="E.g., Berlin"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:border-gold/30 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-outfit tracking-widest uppercase text-stone-400">Country</label>
                    <input
                      type="text"
                      placeholder="E.g., Germany"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:border-gold/30 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-outfit tracking-widest uppercase text-stone-400">Mini editorial bio</label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Building a sustainable clay filtration system. Love 3 AM techno clubs and high-end street food."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:border-gold/30 transition resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold font-playfair text-stone-100">Set your Chemistry Dials</h3>
                  <p className="text-xs text-stone-400">Drag sliders to calibrate your personality index metrics.</p>
                </div>

                {/* Slider 1 - Humor */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-outfit uppercase tracking-wider">
                    <span className="text-stone-400">Humor Style</span>
                    <span className="text-amber-glow font-bold">
                      {humorScore < 30 ? 'Absurdist Deadpan 🍵' : humorScore > 70 ? 'Playful Expressive 🎉' : 'Balanced Witty 🎭'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={humorScore}
                    onChange={e => setHumorScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-amber-glow"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                    <span>DRY & DEADPAN</span>
                    <span>SLAPSTICK & EXUBERANT</span>
                  </div>
                </div>

                {/* Slider 2 - Ambition */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-outfit uppercase tracking-wider">
                    <span className="text-stone-400">Ambition Alignment</span>
                    <span className="text-terracotta font-bold">
                      {ambitionScore < 35 ? 'Cozy Slow flow 🪵' : ambitionScore > 75 ? 'Hyperspeed Hustler 🚀' : 'Harmonious Builder ⚖️'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ambitionScore}
                    onChange={e => setAmbitionScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-terracotta"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                    <span>RELAXED LIFESTYLE</span>
                    <span>STARTUP GRIND</span>
                  </div>
                </div>

                {/* Slider 3 - Sleep */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-outfit uppercase tracking-wider">
                    <span className="text-stone-400">Sleep Footprint</span>
                    <span className="text-gold font-bold">
                      {sleepScore < 35 ? 'Early Bird ☀️' : sleepScore > 70 ? 'Night Owl 🦉' : 'Midday Anchor ⛅'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sleepScore}
                    onChange={e => setSleepScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-warm-gray rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                    <span>EARLY BIRD (5 AM)</span>
                    <span>NIGHT OWL (3 AM)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold font-playfair text-stone-100">Verify Credibility Badges</h3>
                  <p className="text-xs text-stone-400">Connect platforms to showcase verified university/professional status.</p>
                </div>

                {/* GitHub verification */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-stone-300">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">GitHub Developer Credential</h4>
                      <p className="text-[10px] text-stone-500">Unlocks "Developer" badge & repo metrics</p>
                    </div>
                  </div>
                  <button
                    onClick={connectGitHub}
                    disabled={gitHubConnected || verifyingGit}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition ${
                      gitHubConnected
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                        : verifyingGit
                        ? 'bg-neutral-800 text-stone-500 animate-pulse'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    {gitHubConnected ? 'Connected' : verifyingGit ? 'Syncing...' : 'Connect'}
                  </button>
                </div>

                {/* LinkedIn verification */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[#0a66c2]">
                      <LinkedinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">LinkedIn Career Verification</h4>
                      <p className="text-[10px] text-stone-500">Unlocks "Founder" or "Researcher" badge</p>
                    </div>
                  </div>
                  <button
                    onClick={connectLinkedIn}
                    disabled={linkedInConnected || verifyingLinked}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition ${
                      linkedInConnected
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                        : verifyingLinked
                        ? 'bg-neutral-800 text-stone-500 animate-pulse'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    {linkedInConnected ? 'Connected' : verifyingLinked ? 'Syncing...' : 'Connect'}
                  </button>
                </div>

                {/* University verification */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-glow">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">Academic node verification</h4>
                      <p className="text-[10px] text-stone-500">Instantly links student database email</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter University name (e.g. Stanford)"
                      disabled={uniVerified}
                      value={uniName}
                      onChange={e => setUniName(e.target.value)}
                      className="flex-grow bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-stone-300 placeholder-stone-600 text-xs focus:outline-none focus:border-gold/30 transition"
                    />
                    <button
                      onClick={verifyUniversity}
                      disabled={uniVerified || verifyingUni || !uniName}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition ${
                        uniVerified
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                          : verifyingUni
                          ? 'bg-neutral-800 text-stone-500 animate-pulse'
                          : 'bg-gradient-to-r from-amber-glow to-terracotta text-warm-black'
                      }`}
                    >
                      {uniVerified ? 'Verified' : verifyingUni ? 'Validating...' : 'Verify'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-amber-glow/10 rounded-2xl flex items-center justify-center border border-amber-glow/20 text-amber-glow mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold font-playfair text-stone-100">Aura Calibration Complete</h3>
                  <p className="text-xs text-stone-400">Here is your verified Velora chemical matrix snapshot.</p>
                </div>

                {/* Simulated Profile Card preview */}
                <div className="w-full max-w-sm rounded-2xl p-5 border border-white/10 bg-gradient-to-b from-stone-900/80 to-stone-950/80 text-left space-y-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-glow to-transparent opacity-10 rounded-full blur-xl" />
                  
                  <div className="flex gap-4">
                    <img src={avatar} alt="Identity avatar" className="w-14 h-14 rounded-xl object-cover border border-white/10 shadow-lg" />
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-1.5 font-outfit">
                        {name || 'Aura Seeker'}, {age}
                      </h4>
                      <p className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-terracotta" /> {city || 'San Francisco'}, {country || 'US'}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-300 italic leading-relaxed">
                    "{bio || 'Ready to explore matches based on humor alignment, communication style, and ambitions.'}"
                  </p>

                  <div className="border-t border-white/5 pt-3 flex flex-wrap gap-1.5">
                    {/* Badges */}
                    {gitHubConnected && (
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-stone-300 font-mono flex items-center gap-1">
                        <GithubIcon className="w-2.5 h-2.5" /> Dev
                      </span>
                    )}
                    {linkedInConnected && (
                      <span className="px-2 py-0.5 rounded bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[9px] text-[#71b1f9] font-mono flex items-center gap-1">
                        <LinkedinIcon className="w-2.5 h-2.5" /> Career
                      </span>
                    )}
                    {uniVerified && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-glow font-mono flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" /> {uniName}
                      </span>
                    )}
                    {ambitionScore > 75 && (
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] text-orange-400 font-mono">
                        🚀 Founder
                      </span>
                    )}
                  </div>

                  {/* Chemistry metrics bars preview */}
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-400">
                      <div>
                        <span className="block text-[8px] font-mono text-stone-500">HUMOR</span>
                        <span className="font-semibold text-amber-glow">{humorScore}%</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono text-stone-500">AMBITION</span>
                        <span className="font-semibold text-terracotta">{ambitionScore}%</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono text-stone-500">SLEEP STYLE</span>
                        <span className="font-semibold text-gold">{sleepScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={step === 1 && !name}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition duration-300 cursor-pointer ${
              step === 1 && !name
                ? 'bg-white/5 text-stone-600 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-glow to-terracotta hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] text-warm-black'
            }`}
          >
            {step === 4 ? 'Enter Velora' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
