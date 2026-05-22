'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVelora } from '../context/VeloraContext';
import { Sparkles, Terminal, Play, BarChart2, PlusCircle, Check, Loader2, ArrowRight } from 'lucide-react';

interface Clip {
  id: string;
  title: string;
  videoUrl: string;
  author: string;
  humorScore: number;
  archetype: string;
  confidence: number;
}

export const StandUpArena: React.FC = () => {
  const { standupClips, addStandupClip } = useVelora();
  const [selectedClip, setSelectedClip] = useState<Clip | null>(standupClips[0]);
  
  // Simulated AI Analyzer states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Clip submission states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-41553-large.mp4');

  const startAnalysis = () => {
    if (!selectedClip) return;
    
    setIsScanning(true);
    setScanComplete(false);
    setScanLogs([]);
    setScanStep(0);

    const steps = [
      'Initializing Velora-Humor-Core v1.4...',
      'Decomposing audio wave vectors & pitch variation...',
      'Isolating vocal delivery sarcasm coefficients...',
      'Evaluating punchline syntax positioning...',
      'Calibrating timing intervals (deadpan indices)...',
      'Finalizing semantic humor matching parameters...'
    ];

    steps.forEach((text, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, `[LOG] ${text}`]);
        setScanStep(index + 1);

        if (index === steps.length - 1) {
          setTimeout(() => {
            setScanComplete(true);
            setIsScanning(false);
          }, 800);
        }
      }, (index + 1) * 700);
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addStandupClip(newTitle.trim(), newVideoUrl);
    
    // Auto select the new clip
    setTimeout(() => {
      const added = {
        id: `clip-${Date.now()}`, // fallback locally, the context handles state, we can find the latest
        title: newTitle.trim(),
        videoUrl: newVideoUrl,
        author: 'You',
        humorScore: 88,
        archetype: 'Observational Satire',
        confidence: 84
      };
      setSelectedClip(added);
      setNewTitle('');
      setShowAddForm(false);
      setScanComplete(false); // Reset analysis on new clip selection
    }, 100);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-70px)] bg-warm-black p-6 md:p-8 select-none border border-white/5 md:rounded-3xl overflow-y-auto">
      {/* Background ambience */}
      <div className="ambient-glow ambient-amber opacity-10" />
      <div className="ambient-glow ambient-terracotta opacity-10" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-playfair text-white flex items-center gap-2">
            StandUp Arena
          </h2>
          <p className="text-xs text-stone-400">Upload short comedy clips and let AI score your delivery mechanics.</p>
        </div>
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold font-outfit uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 text-stone-200 hover:text-white rounded-xl transition duration-300 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-glow" /> Upload Clip
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Video and AI logs */}
        <div className="lg:col-span-7 space-y-6">
          {selectedClip ? (
            <div className="space-y-4">
              {/* Main Player Card */}
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl">
                <video
                  key={selectedClip.id}
                  src={selectedClip.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono tracking-widest text-amber-glow uppercase mb-1">
                    STANDUP PERFORMANCE
                  </span>
                  <h3 className="text-lg font-bold text-white font-outfit">{selectedClip.title}</h3>
                  <p className="text-xs text-stone-400">By {selectedClip.author}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={startAnalysis}
                  disabled={isScanning}
                  className="flex-grow flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-glow via-terracotta to-clay hover:opacity-90 disabled:opacity-50 text-warm-black font-semibold font-outfit uppercase tracking-wider text-xs rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Delivery...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-warm-black" /> Run AI Humor Scan
                    </>
                  )}
                </button>
              </div>

              {/* Analyzer console */}
              <AnimatePresence>
                {(isScanning || scanComplete) && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="p-5 rounded-2xl border border-amber-glow/10 bg-black/40 backdrop-blur font-mono text-[11px] space-y-4 shadow-xl"
                  >
                    <div className="flex items-center gap-2 text-stone-300 font-bold border-b border-white/5 pb-2">
                      <Terminal className="w-4.5 h-4.5 text-amber-glow" />
                      <span>VELORA HUMOR SCANNER CONSOLE</span>
                    </div>

                    <div className="space-y-1.5 overflow-y-auto max-h-[140px] scrollbar-thin text-left text-amber-glow/85">
                      {scanLogs.map((log, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="text-stone-600 select-none">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {isScanning && (
                        <div className="flex items-center gap-1 text-stone-500 animate-pulse pl-4">
                          <span>[PROCESSING]</span>
                          <span className="inline-block w-1.5 h-3 bg-stone-500 animate-pulse ml-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Results block */}
                    {scanComplete && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-t border-amber-glow/10 pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
                      >
                        <div className="space-y-2">
                          <div>
                            <span className="text-[9px] text-stone-500 font-mono">HUMOR ARCHETYPE</span>
                            <p className="text-sm font-bold text-white font-outfit uppercase tracking-tight">
                              {selectedClip.archetype}
                            </p>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-500 font-mono">CALIBRATION CONFIDENCE</span>
                            <p className="text-sm font-bold text-amber-glow font-outfit">
                              {selectedClip.confidence}% MATCH
                            </p>
                          </div>
                        </div>

                        {/* Radial or bar visualizer */}
                        <div className="space-y-2">
                          <span className="text-[9px] text-stone-500 font-mono">AI HUMOR COEFFICIENT</span>
                          <div className="flex items-center gap-3">
                            <div className="flex-grow h-3 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                              <div
                                className="h-full bg-gradient-to-r from-amber-glow via-terracotta to-clay rounded-full"
                                style={{ width: `${selectedClip.humorScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-white">{selectedClip.humorScore}/100</span>
                          </div>
                          <p className="text-[10px] text-stone-400 italic">
                            Highly calibrated sarcasm delivery, matches best with dry intellectual chemistry grids.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-stone-600 text-xs font-outfit">
              Select a standup clip to begin analysis.
            </div>
          )}
        </div>

        {/* Right Column - Clips feed & Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulated File Upload Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddSubmit}
                className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4 overflow-hidden text-left"
              >
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest">Upload your standup clip</h4>
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-500 font-mono uppercase">Clip Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Raising Seed Round in German"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-stone-200 placeholder-stone-700 focus:outline-none focus:border-gold/30 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-500 font-mono uppercase">Video Mock Feed</label>
                  <select
                    value={newVideoUrl}
                    onChange={e => setNewVideoUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-stone-400 focus:outline-none focus:border-gold/30 transition"
                  >
                    <option value="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-41553-large.mp4">Code Typing clip (Dev Humor)</option>
                    <option value="https://assets.mixkit.co/videos/preview/mixkit-spinning-vinyl-record-on-a-record-player-41641-large.mp4">Vinyl Record spinning (Music/DJ humor)</option>
                    <option value="https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-at-a-cafe-40172-large.mp4">Cafe Work (Freelance/Coffee humor)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-glow to-terracotta hover:opacity-90 rounded-xl text-xs font-semibold text-warm-black font-outfit uppercase tracking-wider transition cursor-pointer"
                >
                  Verify & Append to Arena <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Standup Grid */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Trending StandUp Clips</h4>
            <div className="grid grid-cols-1 gap-3">
              {standupClips.map((clip) => {
                const isActive = selectedClip?.id === clip.id;
                return (
                  <button
                    key={clip.id}
                    onClick={() => {
                      setSelectedClip(clip);
                      setScanComplete(false); // Reset analysis overlay
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border text-left transition duration-300 ${
                      isActive
                        ? 'bg-amber-glow/5 border-amber-glow/20 shadow-md shadow-amber-glow/5'
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Thumbnail placeholder */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0 flex items-center justify-center">
                      <video src={clip.videoUrl} muted className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-4.5 h-4.5 text-stone-300" />
                      </div>
                    </div>

                    {/* Clip details */}
                    <div className="flex-grow min-w-0">
                      <h5 className="text-xs font-bold text-stone-200 truncate font-outfit">{clip.title}</h5>
                      <p className="text-[10px] text-stone-500 mt-0.5">By {clip.author}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-stone-900 text-[8px] font-mono text-stone-400">
                          {clip.archetype}
                        </span>
                        <span className="text-[9px] text-amber-glow font-semibold flex items-center gap-0.5">
                          <BarChart2 className="w-3 h-3" /> {clip.humorScore}% Score
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
