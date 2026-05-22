'use client';

import React from 'react';
import { useVelora, AppView } from '../context/VeloraContext';
import { Sparkles, MessageSquare, Compass, Tv, Mic, LayoutDashboard, Menu, LogOut, Flame } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setView, userProfile, matches } = useVelora();

  // Hide navigation on landing and onboarding
  if (currentView === 'landing' || currentView === 'onboarding') {
    return null;
  }

  const navItems = [
    { view: 'matcher' as AppView, label: 'Chemistry', icon: Compass },
    { view: 'standup' as AppView, label: 'StandUp', icon: Flame },
    { view: 'reels' as AppView, label: 'Aura Reels', icon: Tv },
    { view: 'rooms' as AppView, label: 'Live Rooms', icon: Mic },
    { view: 'chat' as AppView, label: 'Messaging', icon: MessageSquare, badge: matches.length > 0 },
    { view: 'dashboard' as AppView, label: 'Insights', icon: LayoutDashboard }
  ];

  return (
    <div className="w-full flex flex-col shrink-0 select-none z-40 bg-warm-black">
      {/* Top Navbar */}
      <header className="w-full h-[70px] px-6 md:px-10 border-b border-white/5 bg-warm-black/90 backdrop-blur-md flex items-center justify-between z-40">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-2"
        >
          <span className="text-xl font-bold font-outfit tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-amber-glow to-terracotta">
            VELORA
          </span>
          <span className="px-1.5 py-0.5 text-[8px] tracking-widest font-semibold uppercase rounded-full border border-gold/20 bg-gold/5 text-gold-light font-outfit">
            BETA
          </span>
        </button>

        {/* User profile brief */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-white/5 hover:border-gold/20 bg-white/[0.02] hover:bg-gold/5 transition duration-200"
          >
            <img
              src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80'}
              alt="Your avatar"
              className="w-7 h-7 rounded-lg object-cover border border-white/10"
            />
            <span className="hidden sm:inline text-xs font-semibold text-stone-200 font-outfit pr-2">
              {userProfile?.name || 'Aura Seeker'}
            </span>
          </button>

          <button
            onClick={() => setView('landing')}
            className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-red-500/5 hover:border-red-500/20 text-stone-500 hover:text-red-400 transition"
            title="Disconnect node"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Bottom Nav for visual beauty (highly dynamic layout) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg glass-panel rounded-2xl border border-white/5 shadow-2xl p-2 flex items-center justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition duration-300 min-w-14 cursor-pointer ${
                isActive
                  ? 'text-amber-glow bg-amber-glow/5 scale-105'
                  : 'text-stone-500 hover:text-stone-300 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] font-outfit uppercase font-semibold tracking-wider mt-1">
                {item.label.split(' ')[0]}
              </span>

              {/* Channel unread indicator dots */}
              {item.badge && !isActive && (
                <span className="absolute top-1.5 right-3.5 h-1.5 w-1.5 rounded-full bg-amber-glow animate-ping" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
