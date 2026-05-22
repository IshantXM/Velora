'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVelora } from '../context/VeloraContext';
import { Heart, MessageSquare, Share2, Volume2, VolumeX, Globe, Send, X, Compass, ChevronDown, ChevronUp } from 'lucide-react';

export const ReelFeed: React.FC = () => {
  const { reels, likeReel, likedReels } = useVelora();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState<Record<string, { user: string; text: string; time: string }[]>>({});
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const activeReel = reels[currentReelIndex];

  // Initialize comment thread from mock data if empty
  useEffect(() => {
    const commentsMap: Record<string, { user: string; text: string; time: string }[]> = {};
    reels.forEach(r => {
      commentsMap[r.id] = r.comments;
    });
    setCommentsList(commentsMap);
  }, [reels]);

  // Handle Play/Pause when index changes or mute toggles
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === currentReelIndex) {
        vid.muted = isMuted;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [currentReelIndex, isMuted]);

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setShowTranslation(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeReel) return;

    const comment = {
      user: 'You',
      text: newComment.trim(),
      time: 'Just now'
    };

    setCommentsList(prev => ({
      ...prev,
      [activeReel.id]: [comment, ...(prev[activeReel.id] || [])]
    }));
    setNewComment('');
  };

  const isLiked = activeReel ? likedReels.includes(activeReel.id) : false;

  return (
    <div className="relative w-full h-[calc(100vh-70px)] bg-warm-black md:rounded-3xl overflow-hidden flex items-center justify-center select-none max-w-lg mx-auto shadow-2xl border border-white/5">
      {/* Background Ambience */}
      <div className="ambient-glow ambient-amber opacity-10" />
      <div className="ambient-glow ambient-terracotta opacity-10" />

      {activeReel ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Vertical swipe buttons (Desktop helper) */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
            <button
              onClick={handlePrevReel}
              disabled={currentReelIndex === 0}
              className={`p-2 rounded-full border border-white/10 bg-black/40 text-stone-300 hover:text-white transition ${
                currentReelIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/60'
              }`}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextReel}
              disabled={currentReelIndex === reels.length - 1}
              className={`p-2 rounded-full border border-white/10 bg-black/40 text-stone-300 hover:text-white transition ${
                currentReelIndex === reels.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/60'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className="absolute right-4 top-4 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur border border-white/10 hover:bg-black/60 text-white transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-glow animate-pulse" />}
          </button>

          {/* Video Container */}
          <div className="w-full h-full relative overflow-hidden bg-stone-950">
            <video
              ref={el => {
                videoRefs.current[currentReelIndex] = el;
              }}
              src={activeReel.videoUrl}
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover hide-video-controls"
              onClick={() => setIsMuted(prev => !prev)}
            />
            {/* Dark bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Right sidebar actions */}
          <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-5">
            {/* Like */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => likeReel(activeReel.id)}
                className={`p-3 rounded-full backdrop-blur border transition duration-300 ${
                  isLiked
                    ? 'bg-amber-glow/10 border-amber-glow/30 text-amber-glow scale-110 shadow-lg shadow-amber-glow/10'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:text-white hover:scale-105'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-amber-glow' : ''}`} />
              </button>
              <span className="text-[10px] font-mono text-stone-400 font-semibold">{activeReel.likes}</span>
            </div>

            {/* Comments trigger */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setShowComments(true)}
                className="p-3 rounded-full bg-black/40 backdrop-blur border border-white/10 text-stone-300 hover:text-white hover:scale-105 transition duration-300"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-mono text-stone-400 font-semibold">
                {commentsList[activeReel.id]?.length || activeReel.commentsCount}
              </span>
            </div>

            {/* Language Translator */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setShowTranslation(prev => !prev)}
                className={`p-3 rounded-full backdrop-blur border transition duration-300 ${
                  showTranslation
                    ? 'bg-gold/10 border-gold/30 text-gold scale-105'
                    : 'bg-black/40 border-white/10 text-stone-300 hover:text-white'
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>
              <span className="text-[9px] font-outfit uppercase tracking-widest text-stone-400">Translate</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => alert('Link copied to clipboard! Share Velora aura with your network.')}
                className="p-3 rounded-full bg-black/40 backdrop-blur border border-white/10 text-stone-300 hover:text-white transition duration-300"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom detail overlays */}
          <div className="absolute left-4 bottom-6 right-20 z-10 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={activeReel.user.avatar}
                alt={activeReel.user.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white font-outfit">{activeReel.user.name}</h4>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-amber-glow uppercase tracking-wider">
                    {activeReel.user.badge || 'Creator'}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-terracotta" /> {activeReel.user.country}
                </p>
              </div>
            </div>

            {/* Caption & Translation */}
            <div className="space-y-1.5">
              <p className="text-xs text-stone-200 leading-relaxed font-sans pr-4">
                {activeReel.caption}
              </p>
              
              <AnimatePresence>
                {showTranslation && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="p-2.5 rounded-lg bg-gold/5 border border-gold/10 text-[11px] text-gold-light italic pr-4"
                  >
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-gold/60 not-italic mb-0.5">English Translation</span>
                    "{activeReel.caption.replace(/#[a-zA-Z0-9]+/g, '')}"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeReel.tags.map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-stone-900/60 border border-white/[0.04] text-[9px] text-stone-400 font-outfit"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Glassmorphic Tray Overlay */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute inset-x-0 bottom-0 z-30 h-[380px] bg-stone-950/95 border-t border-white/10 rounded-t-3xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <h5 className="text-sm font-bold font-outfit text-white">Comments</h5>
                  <button
                    onClick={() => setShowComments(false)}
                    className="p-1 rounded-full hover:bg-white/5 text-stone-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages list */}
                <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                  {(commentsList[activeReel.id] || []).length === 0 ? (
                    <div className="h-full flex items-center justify-center text-stone-600 text-xs font-sans">
                      No comments yet. Write a spark!
                    </div>
                  ) : (
                    (commentsList[activeReel.id] || []).map((comm, idx) => (
                      <div key={idx} className="flex gap-3 text-left">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-glow to-terracotta text-stone-950 font-bold font-outfit text-xs flex items-center justify-center shrink-0">
                          {comm.user[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-stone-300 font-outfit">{comm.user}</span>
                            <span className="text-[8px] text-stone-600">{comm.time}</span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{comm.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment input form */}
                <form
                  onSubmit={handleAddComment}
                  className="p-4 border-t border-white/5 flex gap-2 items-center bg-stone-950"
                >
                  <input
                    type="text"
                    placeholder="Drop a creative comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="flex-grow bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-gold/30 transition"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-gradient-to-r from-amber-glow to-terracotta hover:opacity-90 rounded-xl text-stone-950 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-stone-600 text-sm font-outfit">Loading Reels feed...</div>
      )}
    </div>
  );
};
