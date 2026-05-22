'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVelora } from '../context/VeloraContext';
import { Radio, Users, Mic, Send, LogOut, ArrowRight, Volume2, UserCheck, MessageSquare } from 'lucide-react';
import { mockLiveRooms } from '../data/mockData';

export const LiveRooms: React.FC = () => {
  const { liveRooms, activeRoomId, joinRoom, leaveRoom, sendRoomMessage, isSpeaker, toggleRaiseHand, userProfile } = useVelora();
  const [commentText, setCommentText] = useState('');

  const currentRoom = activeRoomId ? liveRooms.find(r => r.id === activeRoomId) : null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    sendRoomMessage(commentText.trim());
    setCommentText('');
  };

  // Simulating random scrolling live chat comments from other users when in room
  useEffect(() => {
    if (!activeRoomId) return;

    const interval = setInterval(() => {
      const mockComments = [
        { user: 'techno_coder', text: 'This bio-concrete concept is blowing my mind.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=30&h=30' },
        { user: 'travel_junkie', text: 'FaceTime chai challenge sounds fun, count me in.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=30&h=30' },
        { user: 'ai_researcher', text: 'Circle of fifths is mathematically bound, breaking it is crazy.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=30&h=30' },
        { user: 'startup_sprint', text: 'Berlin is definitely better for bootstrapping hardware.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=30&h=30' }
      ];
      
      const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)];
      sendRoomMessage(randomComment.text);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeRoomId]);

  return (
    <div className="relative w-full min-h-[calc(100vh-70px)] bg-warm-black p-6 md:p-8 select-none border border-white/5 md:rounded-3xl overflow-y-auto">
      {/* Background ambience */}
      <div className="ambient-glow ambient-amber opacity-10" />
      <div className="ambient-glow ambient-terracotta opacity-10" />

      <AnimatePresence mode="wait">
        {!currentRoom ? (
          // View: Rooms Listing
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-left"
          >
            <div>
              <h2 className="text-2xl font-bold font-playfair text-white flex items-center gap-2">
                Live Dialogues
              </h2>
              <p className="text-xs text-stone-400">Join active audio forums matching global founders and creators.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {liveRooms.map(room => (
                <div
                  key={room.id}
                  className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:border-gold/20 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between h-56 group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-lg bg-stone-900 border border-white/[0.03] text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                        {room.category}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-glow" /> {room.listenersCount} listening
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-200 group-hover:text-white font-outfit leading-snug">
                      {room.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={room.host.avatar}
                        alt={room.host.name}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10"
                      />
                      <div>
                        <span className="block text-[8px] text-stone-500 font-mono">HOST</span>
                        <span className="text-xs font-semibold text-stone-300 font-outfit">{room.host.name}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => joinRoom(room.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-glow to-terracotta text-warm-black text-[11px] font-bold font-outfit uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Listen In <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          // View: Room Active Panel
          <motion.div
            key="room"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Left Column: Speaker grid & status controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Room Header Info */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                      AUDIO DISCUSSION
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit leading-snug">{currentRoom.title}</h3>
                </div>

                <button
                  onClick={leaveRoom}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-400 hover:text-white border border-white/10 hover:border-white/20 bg-black/40 rounded-xl transition"
                >
                  <LogOut className="w-3.5 h-3.5" /> Leave
                </button>
              </div>

              {/* Speakers grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-outfit flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-glow" /> Speakers on Stage
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 bg-white/[0.01] border border-white/5 rounded-3xl p-6">
                  {currentRoom.speakers.map((speaker, index) => {
                    // Simulate pulsing waveforms for active speaking states
                    const isTalking = speaker.isSpeaking || (isSpeaker && speaker.name === userProfile?.name);
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-3">
                        <div className="relative">
                          {/* Pulsing visualizer circle border */}
                          {isTalking && (
                            <svg className="absolute -inset-2.5 w-[68px] h-[68px] animate-spin-slow text-amber-glow">
                              <circle
                                cx="34"
                                cy="34"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeDasharray="6, 8"
                              />
                            </svg>
                          )}

                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className={`w-12 h-12 rounded-2xl object-cover border-2 shadow-lg transition-transform duration-300 ${
                              isTalking ? 'border-amber-glow scale-105' : 'border-transparent opacity-80'
                            }`}
                          />

                          {/* Speaking status micro badge */}
                          {isTalking && (
                            <div className="absolute -bottom-1 -right-1 p-0.5 bg-amber-glow text-warm-black rounded-lg">
                              <Volume2 className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div className="text-center min-w-0">
                          <span className="block text-xs font-bold text-stone-200 truncate font-outfit">
                            {speaker.name === userProfile?.name ? 'You' : speaker.name.split(' ')[0]}
                          </span>
                          <span className="text-[8px] text-stone-500 font-mono">
                            {speaker.name === currentRoom.host.name ? 'HOST' : 'SPEAKER'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Speaker requests controls */}
              <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-bold text-stone-200 font-outfit">
                    {isSpeaker ? 'You are currently a speaker' : 'Want to chime in with your opinion?'}
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    {isSpeaker ? 'Your microphone is live on stage.' : 'Request speaker access from the host node.'}
                  </p>
                </div>

                <button
                  onClick={toggleRaiseHand}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold font-outfit uppercase tracking-wider rounded-xl transition duration-300 cursor-pointer ${
                    isSpeaker
                      ? 'bg-neutral-800 border border-neutral-700 text-amber-glow'
                      : 'bg-gradient-to-r from-amber-glow to-terracotta text-warm-black shadow-md hover:opacity-90'
                  }`}
                >
                  <Mic className="w-4 h-4" /> {isSpeaker ? 'Return to Listener' : 'Raise Hand to Speak'}
                </button>
              </div>
            </div>

            {/* Right Column: Live Room Text Chat Feed (5 cols) */}
            <div className="lg:col-span-5 h-[400px] lg:h-full flex flex-col justify-between bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-glow" />
                <h4 className="text-xs font-bold text-white font-outfit uppercase tracking-widest">Audience Chat</h4>
              </div>

              {/* Chat message logs */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[300px] lg:max-h-[350px]">
                {currentRoom.messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-md object-cover border border-white/10 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] font-bold text-stone-300 font-outfit">{msg.user}</span>
                        <span className="text-[7.5px] text-stone-600 font-mono">{msg.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message send form */}
              <form onSubmit={handleSendComment} className="p-3 border-t border-white/5 bg-black/40 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or react..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="flex-grow bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-gold/30 transition"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-gradient-to-r from-amber-glow to-terracotta hover:opacity-90 rounded-xl text-stone-950 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
