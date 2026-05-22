export interface UserProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  bio: string;
  avatar: string;
  images: string[];
  humorScore: number; // 0-100 (dry/sarcastic to cheerful/silly)
  ambitionScore: number; // 0-100 (relaxed flow to high-stress founder)
  sleepScore: number; // 0-100 (0 = Early Bird, 100 = Night Owl)
  sleepSchedule: string;
  interests: string[];
  personalityTraits: string[];
  badges: string[]; // 'GitHub', 'LinkedIn', 'Founder', 'Creator', 'University'
  standupClip: string;
  humorArchetype: string;
  communicationStyle: string;
  culturalTip: string;
  icebreaker: string;
  chatResponses: {
    trigger: string; // keywords in user message
    response: string;
    wingmanTip: string; // wingman advice for next message
  }[];
  defaultConversation: { sender: 'me' | 'them'; text: string; timestamp: string }[];
}

export interface ReelItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    country: string;
    badge?: string;
  };
  videoUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  comments: { user: string; text: string; time: string }[];
  translation?: string;
}

export interface LiveRoomItem {
  id: string;
  title: string;
  host: {
    name: string;
    avatar: string;
    badge?: string;
  };
  listenersCount: number;
  speakers: { name: string; avatar: string; isSpeaking: boolean }[];
  category: string;
  messages: { user: string; text: string; time: string; avatar: string }[];
}

export const mockProfiles: UserProfile[] = [
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    age: 22,
    city: 'Tokyo',
    country: 'Japan',
    bio: 'Writing shaders to translate plant bio-signals into generative music. Looking for someone to share matcha and find hidden Tokyo record bars at 3 AM.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600'
    ],
    humorScore: 35, // Absurdist Deadpan
    ambitionScore: 82, // Passionate creator
    sleepScore: 90, // Night Owl
    sleepSchedule: 'Night Owl (3:00 AM - 10:00 AM)',
    interests: ['Creative Coding', 'Vinyl Records', 'Ambient Music', 'Bonsai Art', 'Cyberpunk'],
    personalityTraits: ['Introverted Explorer', 'Quietly Fierce', 'Detail Obsessed'],
    badges: ['GitHub', 'Creator', 'University'],
    standupClip: 'https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-his-code-on-a-laptop-42171-large.mp4',
    humorArchetype: 'Absurdist Deadpan & Self-Referential Coding Humor',
    communicationStyle: 'Thoughtful, uses emojis carefully (🍵, 👾), pauses between topics to reflect.',
    culturalTip: 'In Japan, indirectness represents politeness. Instead of asking to meet directly, Yuki will appreciate discussing shared creative interests first.',
    icebreaker: 'Ask Yuki: "If you had to map the consciousness of a bonsai tree to a modular synthesizer, what key would it play in?"',
    defaultConversation: [
      { sender: 'them', text: 'Hey there. I just finished compiling a generative track based on my micro-bonsai tree...', timestamp: '10:14 PM' },
      { sender: 'me', text: 'Wow, that sounds incredible! How does the tree influence the synthesizer?', timestamp: '10:15 PM' },
      { sender: 'them', text: 'I use soil moisture sensors. When it gets thirsty, it shifts into minor scales 🍂. It is very dramatic.', timestamp: '10:17 PM' }
    ],
    chatResponses: [
      {
        trigger: 'music',
        response: 'I love experimental vinyl. I collect mostly Japanese ambient records from the 80s, like Hiroshi Yoshimura. Have you heard of him?',
        wingmanTip: 'Yuki loves sharing musical recommendations. Ask her to share her favorite vinyl track link!'
      },
      {
        trigger: 'tokyo',
        response: 'Tokyo is beautiful when it rains. I usually take my camera to Golden Gai or the alleys of Shimokitazawa to record soundscapes.',
        wingmanTip: 'Acknowledge the beauty of rain or mention your city\'s night scene to build cross-cultural chemistry.'
      },
      {
        trigger: 'code',
        response: 'I write mostly GLSL and Rust. Synthesizing graphics and sound in real time feels like digital alchemy.',
        wingmanTip: 'Praise her digital alchemy metaphor and share what you love coding or building.'
      },
      {
        trigger: 'meet',
        response: 'I would love to do a virtual coffee co-working session on Zoom, maybe we can write code and listen to ambient music together? 🍵',
        wingmanTip: 'Accept the virtual session warmly! This is a high-trust invite in Japanese culture.'
      }
    ]
  },
  {
    id: 'elias-weber',
    name: 'Elias Weber',
    age: 24,
    city: 'Berlin',
    country: 'Germany',
    bio: 'Co-founding a synthetic biology startup to grow carbon-absorbing building panels. DJing dark techno at underground clubs. Let\'s debate bio-ethics and basslines.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    images: [
      'https://images.unsplash.com/photo-1558005819-30d443b25a3a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600'
    ],
    humorScore: 15, // Dry Sarcasm
    ambitionScore: 95, // Intense Startup founder
    sleepScore: 85, // Night Owl
    sleepSchedule: 'Night Owl (2:00 AM - 8:30 AM)',
    interests: ['Synthetic Biology', 'Techno', 'Brutalist Architecture', 'Philosophy', 'Bio-hacking'],
    personalityTraits: ['Direct Challenger', 'Relentless Builder', 'Subtly Warm'],
    badges: ['Founder', 'LinkedIn', 'University'],
    standupClip: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-vinyl-record-on-a-record-player-41641-large.mp4',
    humorArchetype: 'Dry German Irony & Startup Cynicism',
    communicationStyle: 'Very direct, intellectually challenging, sparse but high-impact punctuation.',
    culturalTip: 'Berliners value brutal honesty and intellectual depth. Small talk like "how was your day" is ignored. Propose a debate or ask deep questions instead.',
    icebreaker: 'Ask Elias: "Will synthetic biology replace concrete before or after AI replaces junior developers?"',
    defaultConversation: [
      { sender: 'them', text: 'My lab just synthesized a mycelium insulation panel that absorbs 4x more carbon than timber.', timestamp: '11:05 PM' },
      { sender: 'me', text: 'That is crazy! Are you planning to license it or build the factories yourself?', timestamp: '11:06 PM' },
      { sender: 'them', text: 'Factories. Licensing is for cowards who want to spend their lives writing PDFs, not shifting materials.', timestamp: '11:08 PM' }
    ],
    chatResponses: [
      {
        trigger: 'techno',
        response: 'Berlin clubs are sacred spaces. It is not about drinking; it is a collective ritual. I play vinyl sets at Tresor sometimes. Very fast, industrial rhythms.',
        wingmanTip: 'Ask about his favorite vinyl record to spin, or mention what kind of music gets you into a flow state.'
      },
      {
        trigger: 'startup',
        response: 'Raising capital in Europe is a nightmare compared to Silicon Valley, but we have better beer. Our next milestone is pilot tests in Hamburg.',
        wingmanTip: 'Respect the hustle! Ask him how he balances lab experiments with pitches.'
      },
      {
        trigger: 'biology',
        response: 'We are basically rewriting the code of nature. Yeast can synthesize anything if you compile the DNA sequence correctly.',
        wingmanTip: 'Compare nature\'s code to software debugging—Elias appreciates analogies between biotech and software.'
      },
      {
        trigger: 'meet',
        response: 'If you ever find yourself in Berlin, let\'s grab a Club Mate and walk around Templehof field to discuss bio-design.',
        wingmanTip: 'A classic Berlin invite. Agree to the Club Mate walk!'
      }
    ]
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    age: 21,
    city: 'Mumbai',
    country: 'India',
    bio: 'Travel storyteller documenting the ancient spice routes. I speak five languages, cook a mean curry, and can find the best local street food in any city in 10 minutes.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=600'
    ],
    humorScore: 75, // Quick Witty
    ambitionScore: 78, // Active creator & traveler
    sleepScore: 20, // Early Bird
    sleepSchedule: 'Early Bird (6:00 AM - 10:30 PM)',
    interests: ['Travel Journalism', 'Food History', 'Languages', 'Photography', 'Hiking'],
    personalityTraits: ['Radiant Extrovert', 'Spontaneous Storyteller', 'Empathetic Catalyst'],
    badges: ['Creator', 'University'],
    standupClip: 'https://assets.mixkit.co/videos/preview/mixkit-serving-hot-coffee-in-a-glass-41618-large.mp4',
    humorArchetype: 'Expressive Storytelling & Cultural Ironies',
    communicationStyle: 'Fast-paced, highly expressive, lots of exclamation marks, jumps enthusiastically from topic to topic.',
    culturalTip: 'Priya values high-energy connections and stories of adventure. Ask her about her scariest travel experience to instantly bypass small talk.',
    icebreaker: 'Ask Priya: "What is the most misunderstood spice in the world, and why does everyone use it wrong?"',
    defaultConversation: [
      { sender: 'them', text: 'Just landed in Morocco! The air smells like cumin and sea salt. 🇲🇦', timestamp: '9:30 AM' },
      { sender: 'me', text: 'Morocco! Are you tracing the spice route there?', timestamp: '9:32 AM' },
      { sender: 'them', text: 'Yes! Specifically tracing the 14th-century cinnamon trade paths. I almost got lost in the souks yesterday but a nice baker rescued me and fed me fresh bread!', timestamp: '9:35 AM' }
    ],
    chatResponses: [
      {
        trigger: 'food',
        response: 'Food is history you can eat! If you cook cardamoms properly, they release a citrusy warmth. Most restaurants over-roast them, which is basically a crime.',
        wingmanTip: 'Share your favorite comfort food or ask Priya for a simple secret trick she learned from a local chef.'
      },
      {
        trigger: 'travel',
        response: 'Next month is Peru, then back to Mumbai. I live out of a 40L backpack. Traveling light is the only way to stay open to the universe.',
        wingmanTip: 'Ask her how she manages to document stories while constantly moving, showing respect for her craft.'
      },
      {
        trigger: 'language',
        response: 'I speak Hindi, English, Spanish, Arabic, and Marathi. Language changes how you think. In Arabic, there are 10 words for love, each for a different stage.',
        wingmanTip: 'Fascinating insight. Ask about one of the stages of love in Arabic or mention a word in your language that has no translation.'
      },
      {
        trigger: 'meet',
        response: 'We should do a FaceTime spice-cooking challenge! I will teach you how to make real Chai over video.',
        wingmanTip: 'Accept the FaceTime Chai challenge! This is interactive, fun, and creates memorable chemistry.'
      }
    ]
  },
  {
    id: 'chloe-laurent',
    name: 'Chloe Laurent',
    age: 23,
    city: 'Montreal',
    country: 'Canada',
    bio: 'Training LLMs to play jazz piano and co-compose melodies. Lover of cozy sweaters, vinyl, and searching Montreal for the fluffiest almond croissant.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    images: [
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600'
    ],
    humorScore: 48, // Self-Deprecating Intellectual
    ambitionScore: 85, // AI Researcher / Musician
    sleepScore: 78, // Night Owl
    sleepSchedule: 'Night Owl (1:30 AM - 9:00 AM)',
    interests: ['AI Research', 'Jazz Piano', 'Croissants', 'Indie Games', 'Nordic Cinema'],
    personalityTraits: ['Cozy Dreamer', 'Sharp Analyst', 'Quietly Playful'],
    badges: ['GitHub', 'University'],
    standupClip: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-at-a-cafe-40172-large.mp4',
    humorArchetype: 'Intellectual Puns & Self-Deprecating Musician Trope',
    communicationStyle: 'Gentle, uses rich vocabulary, punctuation is precise, sprinkles in French terms occasionally (bonjour, c\'est la vie).',
    culturalTip: 'French-Canadian culture values warmth and creative collaboration. Elias is intense, but Chloe appreciates cozy, slow conversations over art, AI, and food.',
    icebreaker: 'Ask Chloe: "If a neural network tries to improvise a jazz solo, does it sound like Miles Davis or a printer jam?"',
    defaultConversation: [
      { sender: 'them', text: 'I taught my transformer model a basic bebop progression today. It responded with a chord that does not exist in standard theory, but it actually sounded... comforting?', timestamp: '8:42 PM' },
      { sender: 'me', text: 'Wow, maybe the model found a shortcut in music mathematics!', timestamp: '8:44 PM' },
      { sender: 'them', text: 'Exactly! It defied the circle of fifths. I call it the "AI flat-ninth" haha.', timestamp: '8:45 PM' }
    ],
    chatResponses: [
      {
        trigger: 'jazz',
        response: 'I play classical and jazz. Jazz is all about the notes you choose NOT to play. It is like coding—the cleanest code is often what you delete.',
        wingmanTip: 'Perfect analogy! Reply by discussing the art of simplicity in either code, design, or daily life.'
      },
      {
        trigger: 'croissant',
        response: 'A real croissant must flaky enough to leave a trail of crumbs all over your sweater. If it does not, it is just shaped bread. 🥐',
        wingmanTip: 'Play along with the sweater crumb test! Ask if she\'s found the champion bakery in Montreal yet.'
      },
      {
        trigger: 'ai',
        response: 'I work on generative music models. I want AI to collaborate with human musicians, not replace them. Co-creation is much more beautiful.',
        wingmanTip: 'Express agreement with the co-creation philosophy. Ask how she guides the model\'s mood.'
      },
      {
        trigger: 'meet',
        response: 'We should share a Spotify playlist. I want to see what songs you listen to when you need to focus or write code.',
        wingmanTip: 'Suggest creating a collaborative playlist—it\'s a low-pressure, highly romantic digital step.'
      }
    ]
  }
];

export const mockReels: ReelItem[] = [
  {
    id: 'reel-1',
    user: {
      name: 'Yuki Tanaka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
      country: 'Japan',
      badge: 'GitHub'
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-41553-large.mp4',
    caption: 'Tuning my modular synth using soil resistance sensors on a 15-year-old bonsai tree. It is feeling moody today. 🪴🔊 #ambient #creativecoding #tokyotech',
    tags: ['Creative Coding', 'Ambient Music', 'Bonsai'],
    likes: 1242,
    commentsCount: 84,
    comments: [
      { user: 'cyber_gardener', text: 'The pitch bends when you water it? Unbelievable.', time: '2h ago' },
      { user: 'elias_weber', text: 'This is brilliant. We should try it with bioluminescent algae cultures.', time: '4h ago' }
    ]
  },
  {
    id: 'reel-2',
    user: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
      country: 'India',
      badge: 'Creator'
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-hot-coffee-in-a-glass-41618-large.mp4',
    caption: 'Secrets of cutting-edge filter coffee in South India. It is not just about the beans; it is about the "meter pour" to aerate it. ☕️🇮🇳 #travelindia #coffeehistory',
    tags: ['Travel Stories', 'Food History', 'Coffee'],
    likes: 3105,
    commentsCount: 156,
    comments: [
      { user: 'caffeine_addict', text: 'Look at that foam! I can smell it from here.', time: '1d ago' },
      { user: 'chloe_l', text: 'I need to find this in Montreal immediately.', time: '12h ago' }
    ]
  },
  {
    id: 'reel-3',
    user: {
      name: 'Elias Weber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
      country: 'Germany',
      badge: 'Founder'
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-reflections-in-wet-asphalt-at-night-42008-large.mp4',
    caption: '3 AM post-club stroll through Berlin Kreuzberg. Designing biological bricks in my head while listening to industrial techno loops. 🦾🧱 #berlinnightlife #biotech #founder',
    tags: ['Berlin Stories', 'Founder Life', 'Techno'],
    likes: 852,
    commentsCount: 42,
    comments: [
      { user: 'tokyo_drift', text: 'Berlin night vibes are unmatched.', time: '6h ago' },
      { user: 'bio_hacker', text: 'Are the brick samples stable at low temps?', time: '3h ago' }
    ]
  }
];

export const mockLiveRooms: LiveRoomItem[] = [
  {
    id: 'room-1',
    title: 'Code vs. Biology: Are We Just Compiling Carbon?',
    host: {
      name: 'Elias Weber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
      badge: 'Founder'
    },
    listenersCount: 142,
    speakers: [
      { name: 'Elias Weber', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100', isSpeaking: true },
      { name: 'Yuki Tanaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100', isSpeaking: false },
      { name: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100', isSpeaking: false }
    ],
    category: 'Science & Code',
    messages: [
      { user: 'pixel_pusher', text: 'This is wild. DNA is literally just a 4-bit quaternary system.', time: '11:15', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=30&h=30' },
      { user: 'green_tech', text: 'Can yeast compile JavaScript? Lol.', time: '11:16', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=30&h=30' },
      { user: 'yuki_t', text: 'Actually, plant bio-data is surprisingly structured. More like a stream of MIDI events.', time: '11:17', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=30&h=30' }
    ]
  },
  {
    id: 'room-2',
    title: 'Finding the Soul of a City Through Food History',
    host: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
      badge: 'Creator'
    },
    listenersCount: 289,
    speakers: [
      { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100', isSpeaking: true },
      { name: 'Chloe Laurent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100', isSpeaking: true }
    ],
    category: 'Culture & Food',
    messages: [
      { user: 'traveler_sam', text: 'Priya, tell the story of the cardamom trade in Spain!', time: '11:20', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=30&h=30' },
      { user: 'montreal_foodie', text: 'Croissants in Quebec have this special maple glaze sometimes, it connects French baking to Canadian forests.', time: '11:22', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=30&h=30' }
    ]
  }
];
