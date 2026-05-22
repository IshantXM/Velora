'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProfiles, mockReels, mockLiveRooms, UserProfile, ReelItem, LiveRoomItem } from '../data/mockData';

export type AppView = 'landing' | 'onboarding' | 'reels' | 'matcher' | 'standup' | 'chat' | 'rooms' | 'dashboard';

interface Message {
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

interface ChatThread {
  profileId: string;
  messages: Message[];
  typing: boolean;
  wingmanSuggestion: string;
}

interface VeloraContextType {
  currentView: AppView;
  setView: (view: AppView) => void;
  userProfile: Partial<UserProfile> | null;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  profiles: UserProfile[];
  swipedIds: Record<string, 'left' | 'right'>;
  matches: string[]; // profile ids
  swipeUser: (profileId: string, direction: 'left' | 'right') => { isMatch: boolean };
  chatThreads: Record<string, ChatThread>;
  sendMessage: (profileId: string, text: string) => void;
  activeMatchId: string | null;
  setActiveMatchId: (id: string | null) => void;
  reels: ReelItem[];
  likeReel: (reelId: string) => void;
  likedReels: string[];
  liveRooms: LiveRoomItem[];
  activeRoomId: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendRoomMessage: (text: string) => void;
  isSpeaker: boolean;
  toggleRaiseHand: () => void;
  standupClips: { id: string; title: string; videoUrl: string; author: string; humorScore: number; archetype: string; confidence: number }[];
  addStandupClip: (title: string, videoUrl: string) => void;
  triggerMatchCelebration: string | null; // Profile ID if match just happened
  setTriggerMatchCelebration: (id: string | null) => void;
}

const VeloraContext = createContext<VeloraContextType | undefined>(undefined);

export const VeloraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<AppView>('landing');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);
  
  // Swipe State
  const [swipedIds, setSwipedIds] = useState<Record<string, 'left' | 'right'>>({});
  const [matches, setMatches] = useState<string[]>([]);
  const [triggerMatchCelebration, setTriggerMatchCelebration] = useState<string | null>(null);

  // Chat State
  const [chatThreads, setChatThreads] = useState<Record<string, ChatThread>>({});
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  // Reels state
  const [reels, setReels] = useState<ReelItem[]>(mockReels);
  const [likedReels, setLikedReels] = useState<string[]>([]);

  // Live rooms
  const [liveRooms, setLiveRooms] = useState<LiveRoomItem[]>(mockLiveRooms);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(false);

  // StandUp Arena additions
  const [standupClips, setStandupClips] = useState([
    {
      id: 'clip-1',
      title: 'Dangers of Coding in Public Cafes',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-at-a-cafe-40172-large.mp4',
      author: 'Chloe Laurent',
      humorScore: 84,
      archetype: 'Intellectual Deadpan',
      confidence: 91
    },
    {
      id: 'clip-2',
      title: 'Bonsai Trees are the Original Tamagotchis',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-his-code-on-a-laptop-42171-large.mp4',
      author: 'Yuki Tanaka',
      humorScore: 78,
      archetype: 'Absurdist Deadpan',
      confidence: 85
    },
    {
      id: 'clip-3',
      title: 'German Bureaucracy vs Mycelium Growth Rate',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-vinyl-record-on-a-record-player-41641-large.mp4',
      author: 'Elias Weber',
      humorScore: 68,
      archetype: 'Dry Sarcastic',
      confidence: 77
    }
  ]);

  // Load default chats for preset matches
  useEffect(() => {
    const initialThreads: Record<string, ChatThread> = {};
    mockProfiles.forEach(profile => {
      initialThreads[profile.id] = {
        profileId: profile.id,
        messages: profile.defaultConversation,
        typing: false,
        wingmanSuggestion: profile.icebreaker
      };
    });
    setChatThreads(initialThreads);
    // Initialize matches with 'yuki-tanaka' and 'chloe-laurent' to make the app feel alive and conversational
    setMatches(['yuki-tanaka', 'chloe-laurent']);
  }, []);

  const completeOnboarding = (profile: Partial<UserProfile>) => {
    setUserProfile(profile);
    setView('matcher');
  };

  const likeReel = (reelId: string) => {
    setLikedReels(prev => {
      const liked = prev.includes(reelId);
      const newLiked = liked ? prev.filter(id => id !== reelId) : [...prev, reelId];
      
      // Update counts in list
      setReels(current => 
        current.map(r => {
          if (r.id === reelId) {
            return { ...r, likes: liked ? r.likes - 1 : r.likes + 1 };
          }
          return r;
        })
      );
      return newLiked;
    });
  };

  const swipeUser = (profileId: string, direction: 'left' | 'right') => {
    setSwipedIds(prev => ({ ...prev, [profileId]: direction }));
    
    // Auto-match for right swipes to demonstrate matching animations in the prototype
    if (direction === 'right') {
      const alreadyMatched = matches.includes(profileId);
      if (!alreadyMatched) {
        setMatches(prev => [...prev, profileId]);
        setTriggerMatchCelebration(profileId);
        return { isMatch: true };
      }
    }
    return { isMatch: false };
  };

  const sendMessage = (profileId: string, text: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    setChatThreads(prev => {
      const thread = prev[profileId];
      if (!thread) return prev;
      return {
        ...prev,
        [profileId]: {
          ...thread,
          messages: [...thread.messages, { sender: 'me', text, timestamp }],
          wingmanSuggestion: 'AI Wingman is analyzing the flow...'
        }
      };
    });

    // Simulate match typing & responding
    const targetProfile = mockProfiles.find(p => p.id === profileId);
    if (!targetProfile) return;

    // Show typing
    setTimeout(() => {
      setChatThreads(prev => {
        const thread = prev[profileId];
        if (!thread) return prev;
        return {
          ...prev,
          [profileId]: { ...thread, typing: true }
        };
      });
    }, 1000);

    // Append response based on keywords
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let responseText = "That's super interesting! I'd love to chat more about this. What are you working on today?";
      let suggestionText = `Ask about their routine in ${targetProfile.city}.`;

      // Match custom keyword replies
      const matchedTrigger = targetProfile.chatResponses.find(r => 
        lowerText.includes(r.trigger)
      );

      if (matchedTrigger) {
        responseText = matchedTrigger.response;
        suggestionText = matchedTrigger.wingmanTip;
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        responseText = `Hey! 🍵 Glad we matched. I was just reading about your profile. Love that we both score high on ${targetProfile.humorScore < 50 ? 'dry humor' : 'playful chemistry'}.`;
        suggestionText = `Try asking: "${targetProfile.icebreaker.replace('Ask ' + targetProfile.name + ': "', '').slice(0, -1)}"`;
      }

      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatThreads(prev => {
        const thread = prev[profileId];
        if (!thread) return prev;
        return {
          ...prev,
          [profileId]: {
            ...thread,
            typing: false,
            messages: [...thread.messages, { sender: 'them', text: responseText, timestamp: responseTime }],
            wingmanSuggestion: suggestionText
          }
        };
      });
    }, 3000);
  };

  const joinRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setIsSpeaker(false);
  };

  const leaveRoom = () => {
    setActiveRoomId(null);
    setIsSpeaker(false);
  };

  const sendRoomMessage = (text: string) => {
    if (!activeRoomId || !userProfile) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    setLiveRooms(current =>
      current.map(room => {
        if (room.id === activeRoomId) {
          return {
            ...room,
            messages: [
              ...room.messages,
              {
                user: userProfile.name || 'Anonymous User',
                text,
                time,
                avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=30&h=30'
              }
            ]
          };
        }
        return room;
      })
    );
  };

  const toggleRaiseHand = () => {
    setIsSpeaker(prev => !prev);
    // Update speaker listing in current active room
    if (activeRoomId && userProfile) {
      setLiveRooms(current =>
        current.map(room => {
          if (room.id === activeRoomId) {
            const exists = room.speakers.some(s => s.name === userProfile.name);
            let updatedSpeakers = [...room.speakers];
            if (!isSpeaker && !exists) {
              updatedSpeakers.push({
                name: userProfile.name || 'You',
                avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100',
                isSpeaking: false
              });
            } else if (isSpeaker) {
              updatedSpeakers = updatedSpeakers.filter(s => s.name !== userProfile.name);
            }
            return {
              ...room,
              speakers: updatedSpeakers
            };
          }
          return room;
        })
      );
    }
  };

  const addStandupClip = (title: string, videoUrl: string) => {
    const scores = [88, 76, 81, 92];
    const archetypes = ['Dry Satire', 'Deadpan Intellect', 'Observational Wit', 'Self-Deprecating'];
    const randomIndex = Math.floor(Math.random() * scores.length);

    const newClip = {
      id: `clip-${Date.now()}`,
      title,
      videoUrl,
      author: userProfile?.name || 'You',
      humorScore: scores[randomIndex],
      archetype: archetypes[randomIndex],
      confidence: Math.floor(Math.random() * 15) + 80
    };

    setStandupClips(prev => [newClip, ...prev]);
  };

  return (
    <VeloraContext.Provider
      value={{
        currentView,
        setView,
        userProfile,
        completeOnboarding,
        profiles: mockProfiles,
        swipedIds,
        matches,
        swipeUser,
        chatThreads,
        sendMessage,
        activeMatchId,
        setActiveMatchId,
        reels,
        likeReel,
        likedReels,
        liveRooms,
        activeRoomId,
        joinRoom,
        leaveRoom,
        sendRoomMessage,
        isSpeaker,
        toggleRaiseHand,
        standupClips,
        addStandupClip,
        triggerMatchCelebration,
        setTriggerMatchCelebration
      }}
    >
      {children}
    </VeloraContext.Provider>
  );
};

export const useVelora = () => {
  const context = useContext(VeloraContext);
  if (!context) {
    throw new Error('useVelora must be used within a VeloraProvider');
  }
  return context;
};
