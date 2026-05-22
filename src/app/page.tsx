'use client';

import React from 'react';
import { useVelora } from '@/context/VeloraContext';
import { LandingHero } from '@/components/LandingHero';
import { Onboarding } from '@/components/Onboarding';
import { ReelFeed } from '@/components/ReelFeed';
import { MatchExplorer } from '@/components/MatchExplorer';
import { StandUpArena } from '@/components/StandUpArena';
import { ChatSpace } from '@/components/ChatSpace';
import { LiveRooms } from '@/components/LiveRooms';
import { AiDashboard } from '@/components/AiDashboard';
import { Navigation } from '@/components/Navigation';
import { MatchModal } from '@/components/MatchModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const { currentView } = useVelora();

  // Render view depending on state
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingHero />;
      case 'onboarding':
        return <Onboarding />;
      case 'reels':
        return <ReelFeed />;
      case 'matcher':
        return <MatchExplorer />;
      case 'standup':
        return <StandUpArena />;
      case 'chat':
        return <ChatSpace />;
      case 'rooms':
        return <LiveRooms />;
      case 'dashboard':
        return <AiDashboard />;
      default:
        return <LandingHero />;
    }
  };

  return (
    <div className="relative min-h-screen bg-warm-black flex flex-col justify-between overflow-x-hidden">
      {/* Global Navigation - hides on landing and onboarding */}
      <Navigation />

      {/* Main viewport */}
      <main className="flex-grow w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Match modal overlay (rendered on top of anything when state is active) */}
      <MatchModal />

      {/* Mobile navigation bottom padding so items aren't cut off */}
      {currentView !== 'landing' && currentView !== 'onboarding' && (
        <div className="h-24 w-full block shrink-0 select-none pointer-events-none" />
      )}
    </div>
  );
}
