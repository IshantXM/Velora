'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVelora } from '../context/VeloraContext';
import { Send, Sparkles, MessageSquare, Compass, ShieldAlert, BadgeCheck, AlertTriangle, ArrowRight, Award } from 'lucide-react';
import { mockProfiles } from '../data/mockData';

export const ChatSpace: React.FC = () => {
  const { chatThreads, sendMessage, matches, activeMatchId, setActiveMatchId } = useVelora();
  const [inputText, setInputText] = useState('');
  
  // Tone Enhancer states
  const [draftInput, setDraftInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedOutput, setEnhancedOutput] = useState('');
  
  // Anti-creepy filter alert
  const [creepyAlert, setCreepyAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeMatchId]);

  // Handle active thread selection
  const activeThread = activeMatchId ? chatThreads[activeMatchId] : null;
  const activeProfile = activeMatchId ? mockProfiles.find(p => p.id === activeMatchId) : null;

  // Monitor user draft input for creepy/uncalibrated phrases
  useEffect(() => {
    if (!draftInput.trim()) {
      setCreepyAlert(null);
      return;
    }
    
    const lower = draftInput.toLowerCase();
    // Simulated flags for creepy, pushy, or uncalibrated terms
    if (lower.includes('number') || lower.includes('snapchat') || lower.includes('snap') || lower.includes('phone') || lower.includes('address') || lower.includes('sexy') || lower.includes('babe')) {
      setCreepyAlert('Wingman Warning: Requesting contact handles too early or using uncalibrated nicknames often triggers safety boundary filters. Try talking about their projects instead!');
    } else {
      setCreepyAlert(null);
    }
  }, [draftInput]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatchId) return;

    sendMessage(activeMatchId, inputText.trim());
    setInputText('');
  };

  const handleApplyEnhanced = () => {
    if (!enhancedOutput) return;
    setInputText(enhancedOutput);
    setDraftInput('');
    setEnhancedOutput('');
  };

  const handleEnhanceText = () => {
    if (!draftInput.trim() || !activeProfile) return;

    setIsEnhancing(true);
    setTimeout(() => {
      // Custom tone enhancement responses depending on the partner profile
      let enhanced = '';
      if (activeProfile.id === 'yuki-tanaka') {
        enhanced = `Love your GLSL shader concept! 🍵 I was wondering, what kind of soil moisture threshold mappings do you use to trigger minor vs major chords?`;
      } else if (activeProfile.id === 'elias-weber') {
        enhanced = `Brilliant work on the carbon-absorbing mycelium panels. Do you think using local organic waste inputs could bypass raw resource constraints in Berlin?`;
      } else if (activeProfile.id === 'chloe-laurent') {
        enhanced = `That bebop transformer model sounds fascinating! 🥐 How did you design the reward function to encourage musical tension without breaking standard progression theory?`;
      } else {
        enhanced = `I absolute love your spice route stories! What is the single most surprising cultural etiquette shift you have experienced while travel documenting?`;
      }
      setEnhancedOutput(enhanced);
      setIsEnhancing(false);
    }, 1500);
  };

  return (
    <div className="relative w-full h-[calc(100vh-70px)] bg-warm-black flex flex-col md:flex-row select-none border border-white/5 md:rounded-3xl overflow-hidden shadow-2xl">
      {/* Background ambience */}
      <div className="ambient-glow ambient-amber opacity-5" />
      <div className="ambient-glow ambient-terracotta opacity-5" />

      {/* Left Column: Active Chats List (4 cols md) */}
      <div className="w-full md:w-80 border-r border-white/5 bg-black/30 flex flex-col">
        <div className="p-5 border-b border-white/5 text-left">
          <h3 className="text-sm font-bold font-outfit uppercase tracking-widest text-stone-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-glow" /> Chemistry Nodes
          </h3>
          <p className="text-[10px] text-stone-500 mt-1">Calibrated matching connections</p>
        </div>

        <div className="flex-grow overflow-y-auto p-3 space-y-2 text-left">
          {matches.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-600 text-xs font-sans text-center px-4">
              Swipe right on Match Explorer to spark new chemistry nodes.
            </div>
          ) : (
            matches.map(id => {
              const profile = mockProfiles.find(p => p.id === id);
              const thread = chatThreads[id];
              if (!profile || !thread) return null;

              const isSelected = activeMatchId === id;
              const lastMessage = thread.messages[thread.messages.length - 1];

              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveMatchId(id);
                    setDraftInput('');
                    setEnhancedOutput('');
                    setCreepyAlert(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition duration-200 ${
                    isSelected
                      ? 'bg-amber-glow/5 border-amber-glow/20'
                      : 'bg-white/[0.01] border-transparent hover:bg-white/[0.03] hover:border-white/5'
                  }`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-200 truncate font-outfit">{profile.name}</h4>
                      <span className="text-[9px] text-stone-600 font-mono">
                        {lastMessage ? lastMessage.timestamp : ''}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 truncate mt-0.5 font-sans">
                      {thread.typing ? (
                        <span className="text-amber-glow animate-pulse">Composing details...</span>
                      ) : lastMessage ? (
                        lastMessage.text
                      ) : (
                        'Aura matching success...'
                      )}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Middle Column: Chat Feed Pane */}
      <div className="flex-grow flex flex-col justify-between bg-black/10">
        {activeProfile && activeThread ? (
          <>
            {/* Active partner topbar */}
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="w-9 h-9 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1 font-outfit">
                    {activeProfile.name}
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-glow fill-warm-black" />
                  </h4>
                  <p className="text-[9px] text-stone-400 font-mono uppercase tracking-widest flex items-center gap-1">
                    <Compass className="w-3 h-3 text-terracotta" /> {activeProfile.city}, {activeProfile.country}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-stone-400">
                Humor Archetype: {activeProfile.humorScore}% Dry
              </span>
            </div>

            {/* Messages body scrolling */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 text-left">
              {activeThread.messages.map((msg, index) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={index}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[75%] space-y-1">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-amber-glow to-terracotta text-warm-black font-semibold rounded-tr-none'
                            : 'bg-white/[0.03] border border-white/5 text-stone-200 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className={`block text-[8px] text-stone-600 font-mono ${isMe ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Simulated typing status */}
              {activeThread.typing && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl rounded-tl-none text-xs text-stone-500 italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-glow rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-amber-glow rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-amber-glow rounded-full animate-bounce delay-250" />
                    <span>{activeProfile.name} is writing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form bar */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/5 bg-black/40 flex gap-2 items-center"
            >
              <input
                type="text"
                placeholder={`Speak chemistry to ${activeProfile.name}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-grow bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-gold/30 transition"
              />
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-amber-glow to-terracotta hover:opacity-90 rounded-xl text-stone-950 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="w-10 h-10 text-stone-600 mb-4 animate-pulse" />
            <h4 className="text-sm font-bold text-white font-outfit">Select a Connection</h4>
            <p className="text-xs text-stone-500 mt-1">Open an active chemistry node from the sidebar to dialogue.</p>
          </div>
        )}
      </div>

      {/* Right Column: AI Wingman Sidebar (5 cols equivalent or w-80) */}
      {activeProfile && activeThread && (
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 bg-black/35 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-white/5 text-left bg-gradient-to-r from-amber-500/5 to-transparent">
            <h3 className="text-xs font-bold font-outfit uppercase tracking-widest text-amber-glow flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-amber-glow" /> AI Wingman Coach
            </h3>
            <p className="text-[10px] text-stone-500 mt-0.5">Real-time cross-cultural calibration engine</p>
          </div>

          <div className="p-5 space-y-6 text-left">
            {/* Suggestion block */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">Icebreaker Suggestions</span>
              <button
                onClick={() => setInputText(activeProfile.icebreaker.replace(/Ask [a-zA-Z ]+: "/, '').slice(0, -1))}
                className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-gold/20 hover:bg-gold/5 text-stone-300 hover:text-white transition duration-200 text-left text-xs leading-relaxed"
              >
                "{activeProfile.icebreaker.replace(/Ask [a-zA-Z ]+: "/, '').slice(0, -1)}"
              </button>
            </div>

            {/* Custom Tone Enhancer Tool */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">Wingman Tone Enhancer</span>
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Type draft (e.g. hello, cool project)"
                  value={draftInput}
                  onChange={e => setDraftInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[11px] text-stone-300 placeholder-stone-700 focus:outline-none focus:border-gold/20"
                />
                
                {/* Alert warning if uncalibrated */}
                {creepyAlert && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9.5px] text-amber-300 flex items-start gap-2 leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-glow shrink-0 mt-0.5" />
                    <span>{creepyAlert}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleEnhanceText}
                  disabled={isEnhancing || !draftInput.trim()}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-amber-glow to-terracotta hover:opacity-90 disabled:opacity-30 rounded-lg text-[10px] font-bold text-warm-black uppercase font-outfit cursor-pointer transition"
                >
                  {isEnhancing ? 'Calibrating Tone...' : 'Enhance Conversion'}
                </button>
              </div>

              {/* Enhanced message preview */}
              {enhancedOutput && (
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/10 space-y-2.5">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span className="text-[9px] font-mono text-gold-light uppercase tracking-widest">Enhanced draft</span>
                  </div>
                  <p className="text-[11px] text-stone-300 italic leading-relaxed">"{enhancedOutput}"</p>
                  <button
                    onClick={handleApplyEnhanced}
                    className="w-full py-1.5 bg-white/5 hover:bg-white/10 rounded text-[9px] font-semibold text-stone-300 hover:text-white uppercase tracking-wider transition cursor-pointer"
                  >
                    Apply Draft to Input
                  </button>
                </div>
              )}
            </div>

            {/* Cultural Guide */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">Cultural Etiquette Guide</span>
              <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-[11px] text-stone-400 leading-relaxed">
                <span className="block font-bold text-stone-300 mb-1 flex items-center gap-1 font-outfit uppercase text-[9.5px]">
                  📌 {activeProfile.city} Dynamics
                </span>
                {activeProfile.culturalTip}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
