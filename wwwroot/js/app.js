// Velora Core Application Controller
// Blue-Green-Violet Design System integration
// Persistent PostgreSQL Backend Connectivity

// Client Application State
const state = {
  currentView: 'landing',
  
  // User Profile
  userProfile: null,
  
  // Onboarding parameters
  onboardingStep: 1,
  selectedAvatar: presetAvatars[0],
  uniName: '',
  uniVerified: false,
  gitConnected: false,
  linkedConnected: false,
  
  // App parameters populated from API
  profiles: [],
  swipedIds: {},
  matches: [],
  chatThreads: {}, 
  activeMatchId: null,
  
  // Content storage
  reels: [],
  likedReels: [],
  liveRooms: [],
  activeRoomId: null,
  isSpeaker: false,
  
  standupClips: [
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
  ]
};

// ----------------------------------------------------
// Navigation Controller (Asynchronous API triggers)
// ----------------------------------------------------
async function navigateTo(viewName) {
  if (!state.userProfile && viewName !== 'landing' && viewName !== 'onboarding') {
    viewName = 'landing';
  }

  state.currentView = viewName;

  // Toggle Visibility of Views
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  
  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
  }

  // Toggle Nav Bar Visibility
  const globalNav = document.getElementById('global-nav');
  if (viewName === 'landing' || viewName === 'onboarding') {
    globalNav.classList.add('hidden');
  } else {
    globalNav.classList.remove('hidden');
    // Highlight links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.remove('text-stone-400');
        link.classList.add('text-white', 'border-b-2', 'border-amber-glow');
      } else {
        link.classList.remove('text-white', 'border-b-2', 'border-amber-glow');
        link.classList.add('text-stone-400');
      }
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.remove('text-stone-500');
        btn.classList.add('text-amber-glow');
      } else {
        btn.classList.remove('text-amber-glow');
        btn.classList.add('text-stone-500');
      }
    });
  }

  // Trigger specific view rendering with active API data loaders
  if (viewName === 'landing') startGlobeRenderer(state);
  if (viewName === 'matcher') {
    await fetchProfiles();
    renderMatcher();
  }
  if (viewName === 'reels') {
    await fetchReels();
    renderReels();
  }
  if (viewName === 'standup') renderStandup();
  if (viewName === 'chat') {
    await fetchMatches();
    renderChat();
  }
  if (viewName === 'rooms') {
    await fetchRooms();
    renderRooms();
  }
  if (viewName === 'dashboard') {
    await fetchMatches();
    renderDashboard();
  }

  window.scrollTo(0, 0);
  lucide.createIcons();
}

// ----------------------------------------------------
// API Connection Routines
// ----------------------------------------------------
async function fetchProfiles() {
  try {
    const response = await fetch('/api/profiles');
    if (response.ok) {
      state.profiles = await response.json();
    } else {
      state.profiles = mockProfiles.filter(p => p.id !== 'me');
    }
  } catch (err) {
    console.warn("Profiles fetch failed, using fallback mock data:", err);
    state.profiles = mockProfiles.filter(p => p.id !== 'me');
  }
}

async function fetchMatches() {
  try {
    const response = await fetch('/api/matches');
    if (response.ok) {
      state.matches = await response.json();
    } else {
      state.matches = mockProfiles.filter(p => p.id === 'yuki-tanaka' || p.id === 'chloe-laurent');
    }
  } catch (err) {
    console.warn("Matches fetch failed, using fallback mock data:", err);
    state.matches = mockProfiles.filter(p => p.id === 'yuki-tanaka' || p.id === 'chloe-laurent');
  }

  // Setup chat thread structure locally
  state.matches.forEach(m => {
    if (!state.chatThreads[m.id]) {
      state.chatThreads[m.id] = {
        profileId: m.id,
        messages: [],
        typing: false,
        wingmanSuggestion: m.icebreaker
      };
    }
  });
}

async function fetchChatMessages(profileId) {
  try {
    const response = await fetch(`/api/chat/${profileId}`);
    if (response.ok) {
      if (!state.chatThreads[profileId]) {
        state.chatThreads[profileId] = { profileId, messages: [], typing: false, wingmanSuggestion: '' };
      }
      state.chatThreads[profileId].messages = await response.json();
      return;
    }
  } catch (err) {
    console.warn("Chat fetch failed, using fallback mock data:", err);
  }
  
  const profile = mockProfiles.find(p => p.id === profileId);
  if (profile && profile.defaultConversation) {
    if (!state.chatThreads[profileId]) {
      state.chatThreads[profileId] = { profileId, messages: [], typing: false, wingmanSuggestion: profile.icebreaker };
    }
    state.chatThreads[profileId].messages = [...profile.defaultConversation];
  }
}

async function fetchReels() {
  try {
    const response = await fetch('/api/reels');
    if (response.ok) {
      state.reels = await response.json();
    } else {
      state.reels = mockReels;
    }
  } catch (err) {
    console.warn("Reels fetch failed, using fallback mock data:", err);
    state.reels = mockReels;
  }
}

async function fetchRooms() {
  try {
    const response = await fetch('/api/rooms');
    if (response.ok) {
      state.liveRooms = await response.json();
    } else {
      state.liveRooms = mockLiveRooms;
    }
  } catch (err) {
    console.warn("Live rooms fetch failed, using fallback mock data:", err);
    state.liveRooms = mockLiveRooms;
  }
}


// ----------------------------------------------------
// Onboarding Controller & Validation
// ----------------------------------------------------
function initOnboarding() {
  state.onboardingStep = 1;
  state.uniVerified = false;
  state.gitConnected = false;
  state.linkedConnected = false;
  state.uniName = '';
  document.getElementById('onboard-uni').value = '';
  document.getElementById('onboard-name').value = '';
  document.getElementById('onboard-bio').value = '';
  
  // Render Preset Avatars
  const avatarContainer = document.getElementById('avatar-presets-container');
  avatarContainer.innerHTML = '';
  presetAvatars.forEach((url, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `relative rounded-2xl overflow-hidden w-14 h-14 transition duration-300 border-2 ${
      state.selectedAvatar === url ? 'border-amber-glow scale-105 shadow-lg shadow-amber-glow/20' : 'border-transparent opacity-60 hover:opacity-90'
    }`;
    btn.innerHTML = `<img src="${url}" alt="avatar" class="w-full h-full object-cover">`;
    btn.onclick = () => {
      state.selectedAvatar = url;
      document.querySelectorAll('#avatar-presets-container button').forEach((b, i) => {
        if (presetAvatars[i] === url) {
          b.className = 'relative rounded-2xl overflow-hidden w-14 h-14 transition duration-300 border-2 border-amber-glow scale-105 shadow-lg shadow-amber-glow/20';
        } else {
          b.className = 'relative rounded-2xl overflow-hidden w-14 h-14 transition duration-300 border-2 border-transparent opacity-60 hover:opacity-90';
        }
      });
    };
    avatarContainer.appendChild(btn);
  });

  // Dynamic Validation Event Listeners
  const nameInput = document.getElementById('onboard-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      if (state.onboardingStep === 1) {
        toggleNextButton(!e.target.value.trim());
      }
    });
  }

  const uniInput = document.getElementById('onboard-uni');
  if (uniInput) {
    uniInput.addEventListener('input', (e) => {
      state.uniVerified = false;
      state.uniName = '';
      
      const btn = document.getElementById('onboard-uni-verify-btn');
      if (btn) {
        btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-gradient-to-r from-amber-glow to-terracotta text-warm-black';
        btn.innerText = 'Verify';
      }

      const statusLabel = document.getElementById('onboard-uni-status');
      if (statusLabel) {
        statusLabel.innerHTML = `<i data-lucide="alert-circle" class="w-3 h-3 text-stone-600"></i> Status: Unverified`;
      }
      lucide.createIcons();

      if (state.onboardingStep === 3) {
        toggleNextButton(true);
      }
    });
  }

  renderOnboardingStep();
}

function renderOnboardingStep() {
  document.getElementById('onboarding-step-num').innerText = state.onboardingStep;
  
  const dotsContainer = document.getElementById('onboarding-progress-dots');
  dotsContainer.innerHTML = '';
  for (let s = 1; s <= 4; s++) {
    const dot = document.createElement('div');
    dot.className = `w-8 h-1 rounded-full transition-all duration-300 ${
      s <= state.onboardingStep ? 'bg-gradient-to-r from-gold to-terracotta' : 'bg-warm-gray'
    }`;
    dotsContainer.appendChild(dot);
  }

  document.querySelectorAll('.onboarding-substep').forEach(panel => {
    panel.classList.add('hidden');
  });

  document.getElementById(`onboarding-step${state.onboardingStep}`).classList.remove('hidden');

  if (state.onboardingStep === 4) {
    document.getElementById('onboarding-next-text').innerText = 'Enter Velora';
  } else {
    document.getElementById('onboarding-next-text').innerText = 'Continue';
  }

  if (state.onboardingStep === 1) {
    const nameVal = document.getElementById('onboard-name').value.trim();
    toggleNextButton(!nameVal);
  } else if (state.onboardingStep === 3) {
    toggleNextButton(!state.uniVerified || !state.uniName.trim());
  } else {
    toggleNextButton(false);
  }
}

function toggleNextButton(disabled) {
  const nextBtn = document.getElementById('onboarding-next-btn');
  if (disabled) {
    nextBtn.className = 'flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition duration-300 bg-white/5 text-stone-600 border border-white/5 cursor-not-allowed';
    nextBtn.disabled = true;
  } else {
    nextBtn.className = 'flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition duration-300 bg-gradient-to-r from-amber-glow to-terracotta hover:shadow-[0_0_20px_rgba(0,181,255,0.25)] text-warm-black cursor-pointer';
    nextBtn.disabled = false;
  }
}

// Calibration labels on sliders
function updateHumorLabel(val) {
  const label = document.getElementById('onboard-humor-label');
  if (val < 30) label.innerText = 'Absurdist Deadpan 🍵';
  else if (val > 70) label.innerText = 'Playful Expressive 🎉';
  else label.innerText = 'Balanced Witty 🎭';
}
function updateAmbitionLabel(val) {
  const label = document.getElementById('onboard-ambition-label');
  if (val < 35) label.innerText = 'Cozy Slow flow 🪵';
  else if (val > 75) label.innerText = 'Hyperspeed Hustler 🚀';
  else label.innerText = 'Harmonious Builder ⚖️';
}
function updateSleepLabel(val) {
  const label = document.getElementById('onboard-sleep-label');
  if (val < 35) label.innerText = 'Early Bird ☀️';
  else if (val > 70) label.innerText = 'Night Owl 🦉';
  else label.innerText = 'Midday Anchor ⛅';
}

// Step Verification Triggers
function verifyGitAction() {
  const btn = document.getElementById('onboard-git-btn');
  btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-neutral-800 text-stone-500 animate-pulse';
  btn.innerText = 'Syncing...';
  setTimeout(() => {
    state.gitConnected = true;
    btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
    btn.innerText = 'Connected';
  }, 1200);
}

function verifyLinkedAction() {
  const btn = document.getElementById('onboard-linked-btn');
  btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-neutral-800 text-stone-500 animate-pulse';
  btn.innerText = 'Syncing...';
  setTimeout(() => {
    state.linkedConnected = true;
    btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
    btn.innerText = 'Connected';
  }, 1200);
}

function handleCustomAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    state.selectedAvatar = e.target.result;
    
    document.getElementById('onboard-avatar-url').value = '';

    const status = document.getElementById('custom-avatar-status');
    status.classList.remove('hidden');
    status.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3"></i> Uploaded: ${file.name}`;
    lucide.createIcons();

    document.querySelectorAll('#avatar-presets-container button').forEach(b => {
      b.className = 'relative rounded-2xl overflow-hidden w-14 h-14 transition duration-300 border-2 border-transparent opacity-60 hover:opacity-90';
    });
  };
  reader.readAsDataURL(file);
}

function handleCustomAvatarUrl(url) {
  url = url.trim();
  if (!url) {
    document.getElementById('custom-avatar-status').classList.add('hidden');
    return;
  }
  state.selectedAvatar = url;
  
  document.getElementById('onboard-avatar-file').value = '';

  const status = document.getElementById('custom-avatar-status');
  status.classList.remove('hidden');
  status.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3"></i> Custom URL loaded`;
  lucide.createIcons();

  document.querySelectorAll('#avatar-presets-container button').forEach(b => {
    b.className = 'relative rounded-2xl overflow-hidden w-14 h-14 transition duration-300 border-2 border-transparent opacity-60 hover:opacity-90';
  });
}

function verifyUniversityAction() {
  const uniInput = document.getElementById('onboard-uni');
  const uniName = uniInput.value.trim();
  if (!uniName) return;

  const btn = document.getElementById('onboard-uni-verify-btn');
  btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-neutral-800 text-stone-500 animate-pulse';
  btn.innerText = 'Validating...';
  
  setTimeout(() => {
    state.uniVerified = true;
    state.uniName = uniName;
    
    btn.className = 'px-4 py-2 text-xs font-semibold rounded-lg font-outfit uppercase tracking-wider transition bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
    btn.innerText = 'Verified';

    const statusLabel = document.getElementById('onboard-uni-status');
    statusLabel.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i> Node confirmed: ${uniName}`;
    
    document.getElementById('onboarding-step3-error').classList.add('hidden');
    toggleNextButton(false);
    lucide.createIcons();
  }, 1500);
}

async function onboardingNext() {
  if (state.onboardingStep < 4) {
    if (state.onboardingStep === 3 && (!state.uniVerified || !state.uniName.trim())) {
      document.getElementById('onboarding-step3-error').classList.remove('hidden');
      lucide.createIcons();
      return;
    }
    state.onboardingStep++;
    renderOnboardingStep();
    if (state.onboardingStep === 4) {
      renderOnboardingSummary();
    }
  } else {
    // Complete Onboarding & POST profile to C# Database
    const name = document.getElementById('onboard-name').value.trim() || 'Aura Seeker';
    const age = parseInt(document.getElementById('onboard-age').value) || 21;
    const city = document.getElementById('onboard-city').value.trim() || 'San Francisco';
    const country = document.getElementById('onboard-country').value.trim() || 'United States';
    const bio = document.getElementById('onboard-bio').value.trim() || 'Building the future, seeking humor alignment.';

    const badges = [];
    if (state.gitConnected) badges.push('GitHub');
    if (state.linkedConnected) badges.push('LinkedIn');
    if (state.uniVerified) badges.push(state.uniName);
    
    const humorVal = parseInt(document.getElementById('onboard-humor').value);
    const ambitionVal = parseInt(document.getElementById('onboard-ambition').value);
    const sleepVal = parseInt(document.getElementById('onboard-sleep').value);

    let sleepSchedule = 'Balanced (12:00 AM - 7:30 AM)';
    if (sleepVal > 70) sleepSchedule = 'Night Owl (2:30 AM - 9:30 AM)';
    else if (sleepVal < 30) sleepSchedule = 'Early Bird (5:30 AM - 10:00 PM)';

    const payload = {
      name, age, city, country, bio,
      avatar: state.selectedAvatar,
      humorScore: humorVal,
      ambitionScore: ambitionVal,
      sleepScore: sleepVal,
      sleepSchedule,
      badges,
      interests: ['Social Tech', 'Humor Archetypes', 'Global Connections'],
      personalityTraits: ['Cozy Architect', 'Spontaneous Thinker']
    };

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log("Onboarding saved to database successfully.");
      } else {
        console.warn("Onboarding API returned non-200. Proceeding in offline prototype mode.");
      }
    } catch (err) {
      console.warn("Onboarding failed to save to database. Proceeding in offline prototype mode.", err);
    }

    state.userProfile = payload;
    document.getElementById('nav-user-name').innerText = name;
    document.getElementById('nav-user-avatar').src = state.selectedAvatar;
    navigateTo('matcher');
  }
}

function onboardingBack() {
  if (state.onboardingStep > 1) {
    state.onboardingStep--;
    renderOnboardingStep();
  } else {
    navigateTo('landing');
  }
}

function renderOnboardingSummary() {
  document.getElementById('onboard-preview-avatar').src = state.selectedAvatar;
  document.getElementById('onboard-preview-name').innerText = document.getElementById('onboard-name').value.trim() || 'Aura Seeker';
  document.getElementById('onboard-preview-age').innerText = document.getElementById('onboard-age').value || '21';
  document.getElementById('onboard-preview-location').innerText = `${document.getElementById('onboard-city').value || 'San Francisco'}, ${document.getElementById('onboard-country').value || 'US'}`;
  document.getElementById('onboard-preview-bio').innerText = document.getElementById('onboard-bio').value.trim() || 'Ready to explore matches based on humor alignment, communication style, and ambitions.';

  const badgesContainer = document.getElementById('onboard-preview-badges');
  badgesContainer.innerHTML = '';
  
  if (state.gitConnected) {
    badgesContainer.innerHTML += `<span class="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-stone-300 font-mono flex items-center gap-1"><i data-lucide="github" class="w-2.5 h-2.5"></i> Dev</span>`;
  }
  if (state.linkedConnected) {
    badgesContainer.innerHTML += `<span class="px-2 py-0.5 rounded bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[9px] text-[#71b1f9] font-mono flex items-center gap-1"><i data-lucide="linkedin" class="w-2.5 h-2.5"></i> Career</span>`;
  }
  if (state.uniVerified) {
    badgesContainer.innerHTML += `<span class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-glow font-mono flex items-center gap-1"><i data-lucide="award" class="w-2.5 h-2.5"></i> ${state.uniName}</span>`;
  }

  document.getElementById('onboard-preview-humor').innerText = `${document.getElementById('onboard-humor').value}%`;
  document.getElementById('onboard-preview-ambition').innerText = `${document.getElementById('onboard-ambition').value}%`;
  document.getElementById('onboard-preview-sleep').innerText = `${document.getElementById('onboard-sleep').value}%`;

  lucide.createIcons();
}

// ----------------------------------------------------
// Match Explorer Controller (Swipe Card UI)
// ----------------------------------------------------
function renderMatcher() {
  const container = document.getElementById('matcher-card-container');
  const emptyPanel = document.getElementById('matcher-empty');
  
  if (state.profiles.length === 0) {
    container.classList.add('hidden');
    emptyPanel.classList.remove('hidden');
    return;
  }

  container.classList.remove('hidden');
  emptyPanel.classList.add('hidden');

  const profile = state.profiles[0];
  
  const myHumor = state.userProfile?.humorScore ?? 50;
  const myAmbition = state.userProfile?.ambitionScore ?? 50;
  const mySleep = state.userProfile?.sleepScore ?? 50;

  const humorMatchPercent = Math.max(20, 100 - Math.abs(myHumor - profile.humorScore));
  const ambitionMatchPercent = Math.max(20, 100 - Math.abs(myAmbition - profile.ambitionScore));
  const sleepMatchPercent = Math.max(20, 100 - Math.abs(mySleep - profile.sleepScore));
  const overallSync = Math.round((humorMatchPercent + ambitionMatchPercent + sleepMatchPercent) / 3);

  container.innerHTML = `
    <div class="glass-panel rounded-3xl p-6 relative border border-white/10 shadow-2xl space-y-6 text-left transform duration-300">
      
      <div class="flex items-center justify-between">
        <span class="text-[9px] font-mono tracking-widest text-amber-glow uppercase bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
          Sync Index Calibration
        </span>
        <span class="text-xs font-bold text-amber-glow bg-amber-glow/5 border border-amber-glow/10 px-2.5 py-0.5 rounded-full font-mono">
          ${overallSync}% Synergy
        </span>
      </div>

      <div class="flex gap-5">
        <img src="${profile.avatar}" alt="${profile.name}" class="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0">
        <div class="space-y-1">
          <h3 class="text-xl font-bold text-white font-outfit flex items-center gap-2">
            ${profile.name}, ${profile.age}
          </h3>
          <p class="text-xs text-stone-400 flex items-center gap-1.5 font-outfit">
            <i data-lucide="compass" class="w-3.5 h-3.5 text-terracotta"></i> ${profile.city}, ${profile.country}
          </p>
          <div class="flex gap-1.5 flex-wrap pt-1">
            ${profile.badges.map(b => `<span class="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-stone-400 font-mono">${b}</span>`).join('')}
          </div>
        </div>
      </div>

      <p class="text-xs text-stone-300 leading-relaxed italic border-l-2 border-amber-glow/30 pl-3">
        "${profile.bio}"
      </p>

      <div class="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
        <h4 class="text-[10px] font-outfit uppercase tracking-widest text-stone-400 flex items-center gap-1.5 font-bold">
          <i data-lucide="activity" class="w-4 h-4 text-amber-glow"></i> Chemistry Calibration Indexes
        </h4>
        
        <div class="space-y-3.5">
          <div class="space-y-1">
            <div class="flex justify-between text-[10px] font-mono text-stone-400">
              <span>HUMOR COMPATIBILTY</span>
              <span class="text-amber-glow font-bold">${humorMatchPercent}%</span>
            </div>
            <div class="h-2 bg-stone-900 rounded-full overflow-hidden border border-white/5 relative">
              <div class="absolute w-2 h-2 rounded-full bg-white z-10 top-0" style="left: calc(${myHumor}% - 4px)"></div>
              <div class="absolute h-full bg-gradient-to-r from-amber-glow to-terracotta rounded-full" style="width: ${profile.humorScore}%"></div>
            </div>
            <div class="flex justify-between text-[8px] text-stone-600 font-mono">
              <span>DRY / DEADPAN</span>
              <span>PLAYFUL / EXPRESSIVE</span>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[10px] font-mono text-stone-400">
              <span>AMBITION ALIGNMENT</span>
              <span class="text-terracotta font-bold">${ambitionMatchPercent}%</span>
            </div>
            <div class="h-2 bg-stone-900 rounded-full overflow-hidden border border-white/5 relative">
              <div class="absolute w-2 h-2 rounded-full bg-white z-10 top-0" style="left: calc(${myAmbition}% - 4px)"></div>
              <div class="absolute h-full bg-gradient-to-r from-terracotta to-clay rounded-full" style="width: ${profile.ambitionScore}%"></div>
            </div>
            <div class="flex justify-between text-[8px] text-stone-600 font-mono">
              <span>COZY LIFESTYLE</span>
              <span>STARTUP GRIND</span>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[10px] font-mono text-stone-400">
              <span>SLEEP FOOTPRINT</span>
              <span class="text-gold font-bold">${sleepMatchPercent}%</span>
            </div>
            <div class="h-2 bg-stone-900 rounded-full overflow-hidden border border-white/5 relative">
              <div class="absolute w-2 h-2 rounded-full bg-white z-10 top-0" style="left: calc(${mySleep}% - 4px)"></div>
              <div class="absolute h-full bg-gradient-to-r from-gold to-clay rounded-full" style="width: ${profile.sleepScore}%"></div>
            </div>
            <div class="flex justify-between text-[8px] text-stone-600 font-mono">
              <span>EARLY LARK</span>
              <span>NIGHT OWL</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-6 pt-2">
        <button onclick="swipeAction('${profile.id}', 'left')" class="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-stone-400 hover:text-rose-400 transition-all duration-300 hover:scale-110 cursor-pointer">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
        <button onclick="swipeAction('${profile.id}', 'right')" class="p-4 rounded-full bg-gradient-to-r from-amber-glow via-terracotta to-clay hover:opacity-90 text-warm-black shadow-lg shadow-amber-glow/10 hover:scale-110 transition-all duration-300 cursor-pointer">
          <i data-lucide="heart" class="w-6 h-6 fill-warm-black"></i>
        </button>
      </div>

    </div>
  `;
  lucide.createIcons();
}

async function swipeAction(profileId, direction) {
  let isMatch = false;
  try {
    const response = await fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: profileId, direction })
    });

    if (response.ok) {
      const result = await response.json();
      isMatch = result.isMatch;
    } else {
      isMatch = (direction === 'right' && (profileId === 'yuki-tanaka' || profileId === 'chloe-laurent'));
    }
  } catch (err) {
    console.warn("Swipe API failed. Running in offline fallback:", err);
    isMatch = (direction === 'right' && (profileId === 'yuki-tanaka' || profileId === 'chloe-laurent'));
  }

  if (isMatch) {
    triggerMatch(profileId);
  } else {
    state.profiles = state.profiles.filter(p => p.id !== profileId);
    if (state.profiles.length === 0) {
      await fetchProfiles();
    }
    renderMatcher();
  }
}

// ----------------------------------------------------
// Match Celebrations (Confetti & Overlay Modal)
// ----------------------------------------------------
function triggerMatch(profileId) {
  const profile = mockProfiles.find(p => p.id === profileId) || state.profiles.find(p => p.id === profileId);
  if (!profile) return;

  document.getElementById('match-modal-user-avatar').src = state.selectedAvatar;
  document.getElementById('match-modal-match-avatar').src = profile.avatar;
  document.getElementById('match-modal-match-name-badge').innerText = profile.name.toUpperCase();
  document.getElementById('match-modal-overlay').classList.remove('hidden');

  const chatBtn = document.getElementById('match-modal-chat-btn');
  chatBtn.onclick = () => {
    closeMatchModal();
    state.activeMatchId = profileId;
    navigateTo('chat');
  };

  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#00b5ff', '#00e5a3', '#8a5cf5']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#00b5ff', '#00e5a3', '#8a5cf5']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
  lucide.createIcons();
}

async function closeMatchModal() {
  document.getElementById('match-modal-overlay').classList.add('hidden');
  await fetchProfiles();
  renderMatcher();
}

// ----------------------------------------------------
// Reels Controller
// ----------------------------------------------------
function renderReels() {
  const container = document.getElementById('reels-list-container');
  container.innerHTML = '';

  state.reels.forEach(reel => {
    const isLiked = state.likedReels.includes(reel.id);
    const div = document.createElement('div');
    div.className = 'glass-panel rounded-3xl border border-white/5 overflow-hidden text-left shadow-xl max-w-md mx-auto';
    div.innerHTML = `
      <div class="p-4 flex justify-between items-center border-b border-white/5">
        <div class="flex items-center gap-2.5">
          <img src="${reel.user.avatar}" class="w-8 h-8 rounded-lg object-cover border border-white/10" alt="Avatar">
          <div>
            <h4 class="text-xs font-bold text-stone-200 font-outfit">${reel.user.name}</h4>
            <span class="text-[8px] text-stone-500 font-mono uppercase tracking-widest">${reel.user.country} node</span>
          </div>
        </div>
        ${reel.user.badge ? `<span class="px-2 py-0.5 rounded bg-white/5 text-[9px] text-stone-400 font-mono">${reel.user.badge}</span>` : ''}
      </div>

      <div class="relative bg-black/40 aspect-[4/3] flex items-center justify-center">
        <video loop muted autoplay playsinline class="w-full h-full object-cover">
          <source src="${reel.videoUrl}" type="video/mp4">
        </video>
        <div class="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur text-stone-400 hover:text-white cursor-pointer transition" onclick="toggleMuteReel(this)">
          <i data-lucide="volume-x" class="w-4 h-4 text-white"></i>
        </div>
      </div>

      <div class="p-4 space-y-3">
        <div class="flex items-center gap-4">
          <button onclick="likeReelAction('${reel.id}')" class="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-500 transition">
            <i data-lucide="heart" class="w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}"></i>
            <span>${reel.likes}</span>
          </button>
          <button onclick="toggleCommentsPanel('${reel.id}')" class="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition">
            <i data-lucide="message-square" class="w-4 h-4"></i>
            <span>${reel.comments.length} Comments</span>
          </button>
        </div>

        <p class="text-xs text-stone-300 leading-relaxed font-sans">
          ${reel.caption}
        </p>

        <div class="flex gap-1.5 flex-wrap">
          ${reel.tags.map(t => `<span class="text-[9px] font-mono text-stone-500">#${t.replace(/\s+/g, '').toLowerCase()}</span>`).join('')}
        </div>

        <div id="comments-${reel.id}" class="hidden pt-3 border-t border-white/5 space-y-2">
          <div class="space-y-2 max-h-32 overflow-y-auto pr-1" id="comments-list-${reel.id}">
            ${reel.comments.map(c => `
              <div class="text-[10px] leading-relaxed">
                <span class="font-bold text-stone-300">${c.user}:</span> <span class="text-stone-400">${c.text}</span>
                <span class="block text-[8px] text-stone-600 mt-0.5">${c.time}</span>
              </div>
            `).join('')}
          </div>
          <div class="flex gap-2 pt-1">
            <input type="text" id="comment-input-${reel.id}" placeholder="Type a comment..." class="flex-grow bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1.5 text-[10px] text-stone-200 focus:outline-none focus:border-gold/30">
            <button onclick="addCommentAction('${reel.id}')" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] uppercase tracking-wider font-bold text-stone-300">Send</button>
          </div>
        </div>

      </div>
    `;
    container.appendChild(div);
  });
  lucide.createIcons();
}

function toggleMuteReel(btn) {
  const video = btn.parentElement.querySelector('video');
  if (video.muted) {
    video.muted = false;
    btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-white"></i>`;
  } else {
    video.muted = true;
    btn.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4 text-white"></i>`;
  }
  lucide.createIcons();
}

async function likeReelAction(reelId) {
  try {
    const response = await fetch(`/api/reels/like/${reelId}`, { method: 'POST' });
    if (response.ok) {
      console.log("Reel liked in database successfully.");
    }
  } catch (err) {
    console.warn("Liking reel failed on database. Simulating offline:", err);
  }

  if (!state.likedReels.includes(reelId)) {
    state.likedReels.push(reelId);
    const reel = state.reels.find(r => r.id === reelId);
    if (reel) reel.likes++;
  } else {
    state.likedReels = state.likedReels.filter(id => id !== reelId);
    const reel = state.reels.find(r => r.id === reelId);
    if (reel) reel.likes = Math.max(0, reel.likes - 1);
  }
  renderReels();
}

function toggleCommentsPanel(reelId) {
  const panel = document.getElementById(`comments-${reelId}`);
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}

function addCommentAction(reelId) {
  // Prototype: maintains visual updates locally
  const input = document.getElementById(`comment-input-${reelId}`);
  const text = input.value.trim();
  if (!text) return;

  const reel = state.reels.find(r => r.id === reelId);
  if (reel) {
    reel.comments.push({
      user: state.userProfile?.name || 'You',
      text: text,
      time: 'Just now'
    });
  }

  input.value = '';
  renderReels();
  document.getElementById(`comments-${reelId}`).classList.remove('hidden');
}

function openReelUploadModal() {
  document.getElementById('reel-upload-modal').classList.remove('hidden');
}

function closeReelUploadModal() {
  document.getElementById('reel-upload-modal').classList.add('hidden');
  document.getElementById('upload-reel-caption').value = '';
  document.getElementById('upload-reel-video-url').value = '';
  document.getElementById('upload-reel-tags').value = '';
}

async function submitUploadReel() {
  const caption = document.getElementById('upload-reel-caption').value.trim();
  const videoUrl = document.getElementById('upload-reel-video-url').value.trim();
  const tags = document.getElementById('upload-reel-tags').value.trim();

  if (!videoUrl) return;

  const payload = {
    videoUrl,
    caption,
    tags
  };

  try {
    const response = await fetch('/api/reels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      console.log("Reel uploaded successfully.");
    }
  } catch (err) {
    console.warn("API upload failed, running in fallback mode:", err);
  }

  closeReelUploadModal();
  await fetchReels();
  renderReels();
}

// ----------------------------------------------------
// StandUp Arena Controller
// ----------------------------------------------------
function renderStandup() {
  const container = document.getElementById('standup-list-container');
  container.innerHTML = '';

  state.standupClips.forEach(clip => {
    const div = document.createElement('div');
    div.className = 'glass-panel rounded-3xl p-5 border border-white/5 space-y-4 text-left shadow-xl';
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <span class="text-[9px] font-mono tracking-widest text-amber-glow uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Aura: ${clip.archetype}
          </span>
          <h4 class="text-base font-bold text-stone-200 mt-1.5 font-outfit">${clip.title}</h4>
          <span class="text-[10px] text-stone-500">By ${clip.author}</span>
        </div>
        <div class="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-right font-mono shrink-0">
          <span class="block text-[8px] text-stone-600">CONFIDENCE</span>
          <span class="text-xs font-bold text-amber-glow">${clip.confidence}%</span>
        </div>
      </div>

      <div class="relative bg-black/40 aspect-video rounded-2xl overflow-hidden">
        <video loop controls class="w-full h-full object-cover">
          <source src="${clip.videoUrl}" type="video/mp4">
        </video>
      </div>

      <div class="flex items-center justify-between text-[10px] border-t border-white/5 pt-3">
        <span class="text-stone-500">Calibration rating:</span>
        <span class="font-bold text-amber-glow font-mono">${clip.humorScore}% humor amplitude</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function openUploadModal() {
  document.getElementById('standup-upload-modal').classList.remove('hidden');
}

function closeUploadModal() {
  document.getElementById('standup-upload-modal').classList.add('hidden');
  document.getElementById('upload-title').value = '';
  document.getElementById('upload-video-url').value = '';
}

function submitUploadClip() {
  const title = document.getElementById('upload-title').value.trim();
  const videoUrl = document.getElementById('upload-video-url').value.trim();
  if (!title || !videoUrl) return;

  const clip = {
    id: `clip-${Date.now()}`,
    title,
    videoUrl,
    author: state.userProfile?.name || 'You',
    humorScore: Math.floor(Math.random() * 25) + 70,
    archetype: 'Improvised Sarcasm',
    confidence: Math.floor(Math.random() * 15) + 80
  };

  state.standupClips.unshift(clip);
  closeUploadModal();
  renderStandup();
}

// ----------------------------------------------------
// Chat & AI Wingman Controller
// ----------------------------------------------------
async function renderChat() {
  // 1. Sidebar Channels Listing
  const channelsList = document.getElementById('chat-channels-list');
  channelsList.innerHTML = '';

  if (state.matches.length === 0) {
    channelsList.innerHTML = `<div class="text-[10px] text-stone-600 font-sans p-4">Align with nodes in Matcher to chat.</div>`;
  } else {
    state.matches.forEach(profile => {
      const isSelected = state.activeMatchId === profile.id;
      const thread = state.chatThreads[profile.id];
      const lastMsg = thread && thread.messages.length > 0 ? thread.messages[thread.messages.length - 1].text : 'No messages';
      
      const div = document.createElement('div');
      div.onclick = async () => {
        state.activeMatchId = profile.id;
        await fetchChatMessages(profile.id);
        renderChat();
      };
      div.className = `p-3 rounded-2xl border transition cursor-pointer flex gap-3 items-center text-left ${
        isSelected
          ? 'bg-amber-glow/5 border-amber-glow/20 shadow-md shadow-amber-glow/5'
          : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
      }`;
      div.innerHTML = `
        <img src="${profile.avatar}" class="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0">
        <div class="min-w-0 flex-grow">
          <h4 class="text-xs font-bold text-stone-200 font-outfit truncate">${profile.name}</h4>
          <p class="text-[9px] text-stone-500 truncate mt-0.5">${lastMsg}</p>
        </div>
      `;
      channelsList.appendChild(div);
    });
  }

  // 2. Active Convo Viewport Pane
  const mainPane = document.getElementById('chat-main-pane');
  if (!state.activeMatchId) {
    mainPane.innerHTML = `
      <div class="flex-grow flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
        <div class="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-stone-500 mb-3">
          <i data-lucide="message-circle" class="w-5 h-5"></i>
        </div>
        <h4 class="text-xs font-bold font-outfit uppercase tracking-widest text-stone-400">Select Chat Node</h4>
        <p class="text-[10px] text-stone-600 max-w-xs mt-1 leading-relaxed">Choose a channel from the left sidebar to calibrate communication with your match.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const activeProfile = state.matches.find(p => p.id === state.activeMatchId);
  const thread = state.chatThreads[state.activeMatchId];

  mainPane.innerHTML = `
    <div class="p-4 border-b border-white/5 flex justify-between items-center bg-black/10">
      <div class="flex items-center gap-3 text-left">
        <img src="${activeProfile.avatar}" class="w-9 h-9 rounded-xl object-cover border border-white/10">
        <div>
          <h3 class="text-xs font-bold text-white flex items-center gap-1 font-outfit">
            ${activeProfile.name} <i data-lucide="badge-check" class="w-3.5 h-3.5 text-amber-glow fill-warm-black"></i>
          </h3>
          <span class="text-[8px] text-stone-600 font-mono uppercase tracking-widest">${activeProfile.city} node</span>
        </div>
      </div>
      <button onclick="navigateTo('dashboard')" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition">
        <i data-lucide="bar-chart-2" class="w-4 h-4"></i>
      </button>
    </div>

    <div class="flex-grow flex flex-col md:flex-row min-h-0">
      <div class="flex-grow flex flex-col justify-between h-[350px] md:h-[400px] bg-black/10">
        <div id="chat-messages-container" class="flex-grow p-4 overflow-y-auto space-y-4 text-left">
          ${thread.messages.map(msg => `
            <div class="flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[70%] p-3 text-xs rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-gradient-to-r from-amber-glow to-terracotta text-warm-black font-semibold rounded-tr-none'
                  : 'bg-white/5 border border-white/5 text-stone-200 rounded-tl-none'
              }">
                <p class="leading-relaxed font-sans">${msg.text}</p>
                <span class="block text-[8px] mt-1 text-right opacity-60 font-mono">${msg.timestamp}</span>
              </div>
            </div>
          `).join('')}
          ${thread.typing ? `
            <div class="flex justify-start">
              <div class="p-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-1 select-none">
                <span class="w-1.5 h-1.5 bg-amber-glow rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-amber-glow rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
                <span class="w-1.5 h-1.5 bg-amber-glow rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="p-4 border-t border-white/5 bg-black/20 flex gap-2">
          <input type="text" id="chat-message-input" placeholder="Compose message..." onkeypress="handleChatKeyPress(event)" class="flex-grow bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600 text-xs focus:outline-none focus:border-gold/30">
          <button onclick="sendChatMessage()" class="p-3 bg-gradient-to-r from-amber-glow to-terracotta hover:opacity-90 rounded-xl text-stone-950 transition cursor-pointer">
            <i data-lucide="send" class="w-4.5 h-4.5"></i>
          </button>
        </div>
      </div>

      <div class="w-full md:w-56 border-t md:border-t-0 md:border-l border-white/5 p-4 bg-white/[0.01] text-left flex flex-col justify-between shrink-0">
        <div class="space-y-3.5">
          <h3 class="text-xs font-bold font-outfit uppercase tracking-widest text-amber-glow flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-4 h-4 fill-amber-glow"></i> AI Wingman Coach
          </h3>
          
          <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span class="text-[8px] font-mono text-stone-500 uppercase tracking-widest block">ICEBREAKER FOCUS</span>
            <p id="chat-wingman-tip" class="text-[10px] text-stone-300 leading-relaxed font-sans">
              ${thread.wingmanSuggestion}
            </p>
          </div>

          <div class="space-y-1.5">
            <span class="text-[8px] font-mono text-stone-500 uppercase tracking-widest block">CULTURAL CALIBRATION</span>
            <p class="text-[9px] text-stone-400 leading-relaxed font-sans">
              ${activeProfile.culturalTip}
            </p>
          </div>
        </div>
        <div class="pt-4 border-t border-white/5 mt-4 text-[9px] text-stone-500 flex items-center gap-1.5">
          <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-glow shrink-0"></i>
          <span>Wingman synced with database channel.</span>
        </div>
      </div>
    </div>
  `;

  const msgContainer = document.getElementById('chat-messages-container');
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
  lucide.createIcons();
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chat-message-input');
  const text = input.value.trim();
  if (!text || !state.activeMatchId) return;

  input.value = '';
  
  const thread = state.chatThreads[state.activeMatchId];
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user message locally first so it shows up instantly!
  thread.messages.push({
    sender: 'me',
    text: text,
    timestamp: timestamp
  });
  renderChat();

  let success = false;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: state.activeMatchId, text })
    });
    if (response.ok) {
      success = true;
    }
  } catch (err) {
    console.warn("Chat send API failed. Simulating offline reply:", err);
  }

  if (success) {
    // Show typing locally on client side for a seamless visual effect
    thread.typing = true;
    await fetchChatMessages(state.activeMatchId);
    renderChat();

    // Remove typing bubble and reload simulated response 2.5 seconds later
    setTimeout(async () => {
      thread.typing = false;
      await fetchChatMessages(state.activeMatchId);
      
      // Update Wingman tips advice dynamically
      const activeProfile = state.matches.find(p => p.id === state.activeMatchId);
      if (activeProfile) {
        const lowerText = text.toLowerCase();
        let suggestionText = `Ask about their routine in ${activeProfile.city}.`;
        const profileWithChat = mockProfiles.find(p => p.id === state.activeMatchId);
        if (profileWithChat && profileWithChat.chatResponses) {
          const matched = profileWithChat.chatResponses.find(trig => lowerText.includes(trig.trigger));
          if (matched) {
            suggestionText = matched.wingmanTip;
          }
        }
        document.getElementById('wingman-coach-tip').innerText = suggestionText;
      }
      renderChat();
    }, 2500);
  } else {
    // Simulate offline response
    thread.typing = true;
    renderChat();

    setTimeout(() => {
      thread.typing = false;
      
      const activeProfile = mockProfiles.find(p => p.id === state.activeMatchId) || state.matches.find(p => p.id === state.activeMatchId);
      let replyText = "That's super interesting! I'd love to chat more about this. What are you working on today?";
      let suggestionText = `Ask about their routine in ${activeProfile?.city || 'their city'}.`;

      if (activeProfile && activeProfile.chatResponses) {
        const lowerText = text.toLowerCase();
        const matched = activeProfile.chatResponses.find(trig => lowerText.includes(trig.trigger));
        if (matched) {
          replyText = matched.response;
          suggestionText = matched.wingmanTip;
        } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
          replyText = `Hey! 🍵 Glad we matched. I was just reading about your profile. Love that we both score high on ambition and alignment.`;
        }
      }

      thread.messages.push({
        sender: 'them',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (activeProfile) {
        const tipEl = document.getElementById('wingman-coach-tip');
        if (tipEl) tipEl.innerText = suggestionText;
      }
      renderChat();
    }, 2000);
  }
}


// ----------------------------------------------------
// Live Rooms Controller
// ----------------------------------------------------
function renderRooms() {
  const mainCard = document.getElementById('live-rooms-main-card');
  const chatMessages = document.getElementById('room-chat-messages');
  
  if (state.activeRoomId) {
    const activeRoom = state.liveRooms.find(r => r.id === state.activeRoomId);
    
    mainCard.innerHTML = `
      <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div>
          <span class="text-[9px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Active Stage Mode
          </span>
          <h3 class="text-sm font-bold text-stone-200 mt-1.5 font-outfit truncate max-w-xs md:max-w-md">${activeRoom.title}</h3>
        </div>
        <button onclick="leaveRoomAction()" class="px-3.5 py-1.5 text-xs font-semibold font-outfit uppercase tracking-widest rounded-lg border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 transition">
          Leave Stage
        </button>
      </div>

      <div class="flex-grow space-y-4 overflow-y-auto pr-1">
        <h4 class="text-[10px] font-outfit uppercase tracking-widest text-stone-400 flex items-center gap-1.5 font-bold">
          <i data-lucide="mic" class="w-3.5 h-3.5 text-amber-glow"></i> Speakers on Stage
        </h4>
        
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-4 py-2">
          ${activeRoom.speakers.map((sp, idx) => `
            <div class="flex flex-col items-center text-center space-y-2 group relative">
              <div class="relative w-14 h-14 rounded-full">
                ${idx === 0 ? `<svg class="absolute -inset-2.5 w-[76px] h-[76px] animate-spin-slow text-amber-glow"><circle cx="38" cy="38" r="30" stroke="currentColor" stroke-width="1.5" stroke-dasharray="10, 4" fill="transparent"/></svg>` : ''}
                <img src="${sp.avatar}" class="w-full h-full rounded-full object-cover border-2 ${idx === 0 ? 'border-amber-glow scale-105' : 'border-transparent opacity-80'}" alt="Avatar">
                ${idx === 0 ? `<div class="absolute -bottom-1 -right-1 p-0.5 bg-amber-glow text-warm-black rounded-lg"><i data-lucide="mic" class="w-3 h-3"></i></div>` : ''}
              </div>
              <span class="text-[10px] font-bold text-stone-300 truncate w-full font-outfit">${sp.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
        <button onclick="toggleRaiseHandAction()" class="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition ${
          state.isSpeaker
            ? 'bg-neutral-800 border border-neutral-700 text-amber-glow'
            : 'bg-gradient-to-r from-amber-glow to-terracotta text-warm-black shadow-md hover:opacity-90'
        }">
          <i data-lucide="mic" class="w-4 h-4"></i>
          <span>${state.isSpeaker ? 'Mute Stage Microphone' : 'Raise Hand for Stage'}</span>
        </button>
        <span class="text-[10px] text-stone-500 font-mono">${activeRoom.listenersCount} tuned in</span>
      </div>
    `;

    chatMessages.innerHTML = activeRoom.messages.map(msg => `
      <div class="text-[10px] leading-relaxed flex gap-2.5 text-left">
        <img src="${msg.avatar}" class="w-6.5 h-6.5 rounded-md object-cover border border-white/10 shrink-0">
        <div>
          <span class="font-bold text-stone-300">${msg.user}:</span> <span class="text-stone-400">${msg.text}</span>
          <span class="block text-[8px] text-stone-600 mt-0.5">${msg.time}</span>
        </div>
      </div>
    `).join('');
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

  } else {
    mainCard.innerHTML = `
      <div class="border-b border-white/5 pb-3 mb-4">
        <h3 class="text-sm font-bold text-stone-200 font-outfit">Live Dialogue Rooms</h3>
        <p class="text-[10px] text-stone-500">Tune into conversations or participate on stage.</p>
      </div>

      <div class="flex-grow space-y-3.5 overflow-y-auto pr-1">
        ${state.liveRooms.map(room => `
          <div class="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition flex flex-col justify-between gap-3 text-left">
            <div>
              <span class="text-[8px] font-mono tracking-widest text-stone-500 uppercase">${room.category.toUpperCase()}</span>
              <h4 class="text-xs font-bold text-stone-200 mt-1 font-outfit leading-snug">${room.title}</h4>
            </div>
            
            <div class="flex items-center justify-between pt-1 border-t border-white/5 mt-1">
              <div class="flex items-center gap-2">
                <img src="${room.host.avatar}" class="w-5.5 h-5.5 rounded-full object-cover border border-white/15">
                <span class="text-[9px] text-stone-400 font-outfit">Hosted by ${room.host.name}</span>
              </div>
              <button onclick="joinRoomAction('${room.id}')" class="px-3.5 py-1.5 text-[9px] font-bold font-outfit uppercase tracking-widest rounded-lg bg-gradient-to-r from-amber-glow to-terracotta text-warm-black shadow">
                Tune In
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    chatMessages.innerHTML = `
      <div class="text-[10px] text-stone-600 font-sans p-6">Join a stage to view live chat streams.</div>
    `;
  }
  lucide.createIcons();
}

function joinRoomAction(roomId) {
  state.activeRoomId = roomId;
  state.isSpeaker = false;
  renderRooms();
}

function leaveRoomAction() {
  state.activeRoomId = null;
  state.isSpeaker = false;
  renderRooms();
}

function toggleRaiseHandAction() {
  const activeRoom = state.liveRooms.find(r => r.id === state.activeRoomId);
  if (!activeRoom || !state.userProfile) return;

  state.isSpeaker = !state.isSpeaker;

  const exists = activeRoom.speakers.some(s => s.name === state.userProfile.name);
  if (state.isSpeaker && !exists) {
    activeRoom.speakers.push({
      name: state.userProfile.name,
      avatar: state.selectedAvatar,
      isSpeaking: false
    });
  } else if (!state.isSpeaker) {
    activeRoom.speakers = activeRoom.speakers.filter(s => s.name !== state.userProfile.name);
  }

  renderRooms();
}

function handleRoomChatKeyPress(e) {
  if (e.key === 'Enter') {
    sendRoomChatMessage();
  }
}

function sendRoomChatMessage() {
  const input = document.getElementById('room-chat-input');
  const text = input.value.trim();
  if (!text || !state.activeRoomId || !state.userProfile) return;

  input.value = '';

  const activeRoom = state.liveRooms.find(r => r.id === state.activeRoomId);
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  activeRoom.messages.push({
    user: state.userProfile.name,
    text: text,
    time: time,
    avatar: state.selectedAvatar
  });

  renderRooms();
}

// ----------------------------------------------------
// Insights Dashboard Controller
// ----------------------------------------------------
function renderDashboard() {
  const container = document.getElementById('view-dashboard');
  
  const humor = state.userProfile?.humorScore ?? 58;
  const ambition = state.userProfile?.ambitionScore ?? 62;
  const sleep = state.userProfile?.sleepScore ?? 72;
  
  const humorStatus = humor < 35 ? 'DEADPAN' : humor > 65 ? 'PLAYFUL' : 'WITTY';
  const ambitionStatus = ambition < 35 ? 'COZY' : ambition > 75 ? 'HUSTLER' : 'BUILDER';
  const sleepStatus = sleep < 35 ? 'LARK' : sleep > 65 ? 'OWL' : 'ANCHOR';

  const globalAffinity = [
    { city: 'Tokyo, JP', score: Math.round(98 - Math.abs(sleep - 90) * 0.15 - Math.abs(humor - 35) * 0.2), archetype: 'Absurdist Deadpan', color: '#00e5a3' },
    { city: 'Berlin, DE', score: Math.round(96 - Math.abs(ambition - 95) * 0.15 - Math.abs(humor - 15) * 0.2), archetype: 'Dry German Irony', color: '#8a5cf5' },
    { city: 'Montreal, CA', score: Math.round(97 - Math.abs(sleep - 78) * 0.15 - Math.abs(humor - 48) * 0.2), archetype: 'Intellectual Puns', color: '#00b5ff' },
    { city: 'Mumbai, IN', score: Math.round(92 - Math.abs(sleep - 20) * 0.15 - Math.abs(humor - 75) * 0.2), archetype: 'Quick Witty Stories', color: '#00e5a3' }
  ].sort((a, b) => b.score - a.score);

  container.innerHTML = `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 mb-6">
      <div>
        <h2 class="text-2xl font-bold font-playfair text-white flex items-center gap-2">
          AI Chemistry Insights
        </h2>
        <p class="text-xs text-stone-400">Deep mathematical analytics tracking your global communication footprint.</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="openEditProfileModal()" class="px-4 py-2 text-xs font-semibold font-outfit uppercase tracking-widest rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 text-stone-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit Profile
        </button>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-glow/10 bg-amber-glow/5 text-amber-glow">
          <i data-lucide="brain" class="w-4.5 h-4.5 animate-pulse"></i>
          <span class="text-[10px] font-outfit uppercase tracking-widest font-semibold">Active Calibrator</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      <div class="lg:col-span-7 space-y-6">
        
        <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="flex flex-col items-center justify-center text-center space-y-3">
            <span class="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Humor Index</span>
            <div class="relative w-24 h-24 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="#1c1a18" stroke-width="6" fill="transparent" />
                <circle cx="48" cy="48" r="42" stroke="#00e5a3" stroke-width="6" fill="transparent"
                        stroke-dasharray="263.8" stroke-dashoffset="${263.8 - (263.8 * humor) / 100}"
                        stroke-linecap="round" class="transition-all duration-1000" />
              </svg>
              <div class="flex flex-col items-center">
                <span class="text-lg font-bold text-white font-outfit">${humor}%</span>
                <span class="text-[8px] font-mono text-stone-500 font-bold">${humorStatus}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center text-center space-y-3 border-y sm:border-y-0 sm:border-x border-white/5 py-4 sm:py-0">
            <span class="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Ambition Index</span>
            <div class="relative w-24 h-24 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="#1c1a18" stroke-width="6" fill="transparent" />
                <circle cx="48" cy="48" r="42" stroke="#8a5cf5" stroke-width="6" fill="transparent"
                        stroke-dasharray="263.8" stroke-dashoffset="${263.8 - (263.8 * ambition) / 100}"
                        stroke-linecap="round" class="transition-all duration-1000" />
              </svg>
              <div class="flex flex-col items-center">
                <span class="text-lg font-bold text-white font-outfit">${ambition}%</span>
                <span class="text-[8px] font-mono text-stone-500 font-bold">${ambitionStatus}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center text-center space-y-3">
            <span class="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Sleep Footprint</span>
            <div class="relative w-24 h-24 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="#1c1a18" stroke-width="6" fill="transparent" />
                <circle cx="48" cy="48" r="42" stroke="#5a2eee" stroke-width="6" fill="transparent"
                        stroke-dasharray="263.8" stroke-dashoffset="${263.8 - (263.8 * sleep) / 100}"
                        stroke-linecap="round" class="transition-all duration-1000" />
              </svg>
              <div class="flex flex-col items-center">
                <span class="text-lg font-bold text-white font-outfit">${sleep}%</span>
                <span class="text-[8px] font-mono text-stone-500 font-bold">${sleepStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold font-outfit text-stone-200 uppercase tracking-widest">
              Personality Matrix Coordinates
            </h3>
            <span class="text-[9px] font-mono text-stone-500">COORDINATE AXIS</span>
          </div>

          <div class="space-y-4">
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-stone-400">
                <span>Logic vs. Empathy</span>
                <span class="text-white font-semibold">74% Logical</span>
              </div>
              <div class="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-amber-glow rounded-full" style="width: 74%"></div>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-xs text-stone-400">
                <span>Independence vs. Collaboration</span>
                <span class="text-white font-semibold">68% Collaborative</span>
              </div>
              <div class="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-terracotta rounded-full" style="width: 68%"></div>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-xs text-stone-400">
                <span>Curiosity vs. Routine Execution</span>
                <span class="text-white font-semibold">89% Curiously-Driven</span>
              </div>
              <div class="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-clay rounded-full" style="width: 89%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
          <h3 class="text-xs font-bold font-outfit text-stone-200 uppercase tracking-widest">
            Unlocked Credentials
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
              <div class="p-2 bg-amber-glow/10 border border-amber-glow/20 rounded-xl text-amber-glow">
                <i data-lucide="award" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-stone-200 font-outfit">Academic node verified</h4>
                <p class="text-[10px] text-stone-500 leading-relaxed mt-0.5">
                  Verified student credential on ${state.uniName || 'Stanford'}. Calibrated with campus database registry.
                </p>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
              <div class="p-2 bg-terracotta/10 border border-terracotta/20 rounded-xl text-terracotta">
                <i data-lucide="globe" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-stone-200 font-outfit">Cross-Cultural Visa</h4>
                <p class="text-[10px] text-stone-500 leading-relaxed mt-0.5">
                  Activated global location mapping nodes. Open for Japanese, German, and Indian channels.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="lg:col-span-5 space-y-6">
        <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
          <h3 class="text-xs font-bold font-outfit text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
            <i data-lucide="globe" class="w-4.5 h-4.5 text-amber-glow animate-spin-slow"></i> Global Affinity Maps
          </h3>
          
          <div class="space-y-3.5">
            ${globalAffinity.map(item => `
              <div class="space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-semibold text-stone-300 flex items-center gap-1.5 font-outfit">
                    <i data-lucide="compass" class="w-3.5 h-3.5" style="color: ${item.color}"></i> ${item.city}
                  </span>
                  <span class="font-mono text-stone-400 font-bold">${item.score}% Match</span>
                </div>
                <div class="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/5">
                  <div class="h-full rounded-full" style="width: ${item.score}%; background-color: ${item.color}"></div>
                </div>
                <span class="block text-[8px] font-mono text-stone-500 uppercase">
                  ALIGNMENT: ${item.archetype}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
          <h3 class="text-xs font-bold font-outfit text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
            <i data-lucide="heart" class="w-4 h-4 text-terracotta"></i> Core Chemistry Nodes
          </h3>

          <div class="space-y-4 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
            ${state.matches.map(profile => `
              <div class="relative flex items-center justify-between group">
                <span class="absolute -left-[18.5px] w-2 h-2 rounded-full bg-amber-glow border border-warm-black"></span>
                
                <div class="flex items-center gap-2.5 pl-2">
                  <img src="${profile.avatar}" class="w-8 h-8 rounded-lg object-cover border border-white/10">
                  <div>
                    <h4 class="text-xs font-bold text-stone-300 font-outfit">${profile.name}</h4>
                    <span class="text-[8px] text-stone-600 font-mono uppercase tracking-widest">${profile.city} node</span>
                  </div>
                </div>

                <button onclick="jumpToChatFromDashboard('${profile.id}')" class="p-2 rounded-lg bg-white/5 border border-white/10 text-stone-400 hover:text-amber-glow hover:bg-amber-glow/5 transition cursor-pointer">
                  <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;
  lucide.createIcons();
}

function jumpToChatFromDashboard(profileId) {
  state.activeMatchId = profileId;
  navigateTo('chat');
}

let editAvatarTemp = '';

function openEditProfileModal() {
  const profile = state.userProfile || {
    name: 'Aura Seeker',
    age: 21,
    city: 'San Francisco',
    country: 'United States',
    bio: 'Building the future, seeking humor alignment.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
  };

  document.getElementById('edit-profile-name').value = profile.name;
  document.getElementById('edit-profile-age').value = profile.age;
  document.getElementById('edit-profile-city').value = profile.city;
  document.getElementById('edit-profile-country').value = profile.country;
  document.getElementById('edit-profile-bio').value = profile.bio;
  
  editAvatarTemp = profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150';
  document.getElementById('edit-profile-avatar-preview').src = editAvatarTemp;
  document.getElementById('edit-profile-avatar-url').value = '';
  document.getElementById('edit-profile-avatar-file').value = '';

  document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditProfileModal() {
  document.getElementById('edit-profile-modal').classList.add('hidden');
}

function handleEditProfileAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    editAvatarTemp = e.target.result;
    document.getElementById('edit-profile-avatar-preview').src = editAvatarTemp;
    document.getElementById('edit-profile-avatar-url').value = '';
  };
  reader.readAsDataURL(file);
}

function handleEditProfileAvatarUrl(url) {
  url = url.trim();
  if (!url) return;
  editAvatarTemp = url;
  document.getElementById('edit-profile-avatar-preview').src = editAvatarTemp;
  document.getElementById('edit-profile-avatar-file').value = '';
}

async function saveEditProfile() {
  const name = document.getElementById('edit-profile-name').value.trim() || 'Aura Seeker';
  const age = parseInt(document.getElementById('edit-profile-age').value) || 21;
  const city = document.getElementById('edit-profile-city').value.trim() || 'San Francisco';
  const country = document.getElementById('edit-profile-country').value.trim() || 'United States';
  const bio = document.getElementById('edit-profile-bio').value.trim() || 'Ready to explore.';

  if (!state.userProfile) {
    state.userProfile = {};
  }

  const humorVal = state.userProfile.humorScore ?? 50;
  const ambitionVal = state.userProfile.ambitionScore ?? 50;
  const sleepVal = state.userProfile.sleepScore ?? 50;
  const sleepSchedule = state.userProfile.sleepSchedule ?? 'Balanced (12:00 AM - 7:30 AM)';
  const badges = state.userProfile.badges ?? [];

  const payload = {
    name, age, city, country, bio,
    avatar: editAvatarTemp,
    humorScore: humorVal,
    ambitionScore: ambitionVal,
    sleepScore: sleepVal,
    sleepSchedule,
    badges,
    interests: state.userProfile.interests ?? ['Social Tech'],
    personalityTraits: state.userProfile.personalityTraits ?? ['Cozy Architect']
  };

  try {
    const response = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      console.log("Profile updated in database successfully.");
    }
  } catch (err) {
    console.warn("API update failed, running in offline fallback mode:", err);
  }

  state.userProfile = payload;
  state.selectedAvatar = editAvatarTemp;

  document.getElementById('nav-user-name').innerText = name;
  document.getElementById('nav-user-avatar').src = editAvatarTemp;

  closeEditProfileModal();
  renderDashboard();
}

// ----------------------------------------------------
// Global Startup Bootstrap
// ----------------------------------------------------
window.onload = async () => {
  // Pull starting match timelines
  await fetchMatches();
  initOnboarding();
  navigateTo('landing');
  startGlobeRenderer(state);
};
