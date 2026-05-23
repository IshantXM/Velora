using VeloraApp.Models;

namespace VeloraApp.Data;

public static class DbInitializer
{
    public static void Initialize(VeloraDbContext context)
    {
        // Ensure database is created (or runs pending migrations)
        context.Database.EnsureCreated();

        // Seed Users if empty
        if (!context.Users.Any())
        {
            var seedUsers = new[]
            {
                new DbUser
                {
                    Id = "yuki-tanaka",
                    Name = "Yuki Tanaka",
                    Age = 22,
                    City = "Tokyo",
                    Country = "Japan",
                    Bio = "Writing shaders to translate plant bio-signals into generative music. Looking for someone to share matcha and find hidden Tokyo record bars at 3 AM.",
                    Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
                    Images = "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=600,https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600",
                    Badges = "GitHub,Creator,University",
                    Interests = "Creative Coding,Vinyl Records,Ambient Music,Bonsai Art,Cyberpunk",
                    PersonalityTraits = "Introverted Explorer,Quietly Fierce,Detail Obsessed",
                    HumorScore = 35,
                    AmbitionScore = 82,
                    SleepScore = 90,
                    SleepSchedule = "Night Owl (3:00 AM - 10:00 AM)",
                    StandupClip = "https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-his-code-on-a-laptop-42171-large.mp4",
                    HumorArchetype = "Absurdist Deadpan & Self-Referential Coding Humor",
                    CommunicationStyle = "Thoughtful, uses emojis carefully (🍵, 👾), pauses between topics to reflect.",
                    CulturalTip = "In Japan, indirectness represents politeness. Instead of asking to meet directly, Yuki will appreciate discussing shared creative interests first.",
                    Icebreaker = "Ask Yuki: \"If you had to map the consciousness of a bonsai tree to a modular synthesizer, what key would it play in?\"",
                    ChatResponsesJson = @"[
                      {""trigger"":""music"",""response"":""I love experimental vinyl. I collect mostly Japanese ambient records from the 80s, like Hiroshi Yoshimura. Have you heard of him?"",""wingmanTip"":""Yuki loves sharing musical recommendations. Ask her to share her favorite vinyl track link!""},
                      {""trigger"":""tokyo"",""response"":""Tokyo is beautiful when it rains. I usually take my camera to Golden Gai or the alleys of Shimokitazawa to record soundscapes."",""wingmanTip"":""Acknowledge the beauty of rain or mention your city's night scene to build cross-cultural chemistry.""},
                      {""trigger"":""code"",""response"":""I write mostly GLSL and Rust. Synthesizing graphics and sound in real time feels like digital alchemy."",""wingmanTip"":""Praise her digital alchemy metaphor and share what you love coding or building.""},
                      {""trigger"":""meet"",""response"":""I would love to do a virtual coffee co-working session on Zoom, maybe we can write code and listen to ambient music together? 🍵"",""wingmanTip"":""Accept the virtual session warmly! This is a high-trust invite in Japanese culture.""}
                    ]",
                    IsCurrentUser = false
                },
                new DbUser
                {
                    Id = "elias-weber",
                    Name = "Elias Weber",
                    Age = 24,
                    City = "Berlin",
                    Country = "Germany",
                    Bio = "Co-founding a synthetic biology startup to grow carbon-absorbing building panels. DJing dark techno at underground clubs. Let's debate bio-ethics and basslines.",
                    Avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
                    Images = "https://images.unsplash.com/photo-1558005819-30d443b25a3a?auto=format&fit=crop&q=80&w=600,https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
                    Badges = "Founder,LinkedIn,University",
                    Interests = "Synthetic Biology,Techno,Brutalist Architecture,Philosophy,Bio-hacking",
                    PersonalityTraits = "Direct Challenger,Relentless Builder,Subtly Warm",
                    HumorScore = 15,
                    AmbitionScore = 95,
                    SleepScore = 85,
                    SleepSchedule = "Night Owl (2:00 AM - 8:30 AM)",
                    StandupClip = "https://assets.mixkit.co/videos/preview/mixkit-spinning-vinyl-record-on-a-record-player-41641-large.mp4",
                    HumorArchetype = "Dry German Irony & Startup Cynicism",
                    CommunicationStyle = "Very direct, intellectually challenging, sparse but high-impact punctuation.",
                    CulturalTip = "Berliners value brutal honesty and intellectual depth. Small talk like \"how was your day\" is ignored. Propose a debate or ask deep questions instead.",
                    Icebreaker = "Ask Elias: \"Will synthetic biology replace concrete before or after AI replaces junior developers?\"",
                    ChatResponsesJson = @"[
                      {""trigger"":""techno"",""response"":""Berlin clubs are sacred spaces. It is not about drinking; it is a collective ritual. I play vinyl sets at Tresor sometimes. Very fast, industrial rhythms."",""wingmanTip"":""Ask about his favorite vinyl record to spin, or mention what kind of music gets you into a flow state.""},
                      {""trigger"":""startup"",""response"":""Raising capital in Europe is a nightmare compared to Silicon Valley, but we have better beer. Our next milestone is pilot tests in Hamburg."",""wingmanTip"":""Respect the hustle! Ask him how he balances lab experiments with pitches.""},
                      {""trigger"":""biology"",""response"":""We are basically rewriting the code of nature. Yeast can synthesize anything if you compile the DNA sequence correctly."",""wingmanTip"":""Compare nature's code to software debugging—Elias appreciates analogies between biotech and software.""},
                      {""trigger"":""meet"",""response"":""If you ever find yourself in Berlin, let's grab a Club Mate and walk around Templehof field to discuss bio-design."",""wingmanTip"":""A classic Berlin invite. Agree to the Club Mate walk!""}
                    ]",
                    IsCurrentUser = false
                },
                new DbUser
                {
                    Id = "priya-sharma",
                    Name = "Priya Sharma",
                    Age = 21,
                    City = "Mumbai",
                    Country = "India",
                    Bio = "Travel storyteller documenting the ancient spice routes. I speak five languages, cook a mean curry, and can find the best local street food in any city in 10 minutes.",
                    Avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
                    Images = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600,https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=600",
                    Badges = "Creator,University",
                    Interests = "Travel Journalism,Food History,Languages,Photography,Hiking",
                    PersonalityTraits = "Radiant Extrovert,Spontaneous Storyteller,Empathetic Catalyst",
                    HumorScore = 75,
                    AmbitionScore = 78,
                    SleepScore = 20,
                    SleepSchedule = "Early Bird (6:00 AM - 10:30 PM)",
                    StandupClip = "https://assets.mixkit.co/videos/preview/mixkit-serving-hot-coffee-in-a-glass-41618-large.mp4",
                    HumorArchetype = "Expressive Storytelling & Cultural Ironies",
                    CommunicationStyle = "Fast-paced, highly expressive, lots of exclamation marks, jumps enthusiastically from topic to topic.",
                    CulturalTip = "Priya values high-energy connections and stories of adventure. Ask her about her scariest travel experience to instantly bypass small talk.",
                    Icebreaker = "Ask Priya: \"What is the most misunderstood spice in the world, and why does everyone use it wrong?\"",
                    ChatResponsesJson = @"[
                      {""trigger"":""food"",""response"":""Food is history you can eat! If you cook cardamoms properly, they release a citrusy warmth. Most restaurants over-roast them, which is basically a crime."",""wingmanTip"":""Share your favorite comfort food or ask Priya for a simple secret trick she learned from a local chef.""},
                      {""trigger"":""travel"",""response"":""Next month is Peru, then back to Mumbai. I live out of a 40L backpack. Traveling light is the only way to stay open to the universe."",""wingmanTip"":""Ask her how she manages to document stories while constantly moving, showing respect for her craft.""},
                      {""trigger"":""language"",""response"":""I speak Hindi, English, Spanish, Arabic, and Marathi. Language changes how you think. In Arabic, there are 10 words for love, each for a different stage."",""wingmanTip"":""Fascinating insight. Ask about one of the stages of love in Arabic or mention a word in your language that has no translation.""},
                      {""trigger"":""meet"",""response"":""We should do a FaceTime spice-cooking challenge! I will teach you how to make real Chai over video."",""wingmanTip"":""Accept the FaceTime Chai challenge! This is interactive, fun, and creates memorable chemistry.""}
                    ]",
                    IsCurrentUser = false
                },
                new DbUser
                {
                    Id = "chloe-laurent",
                    Name = "Chloe Laurent",
                    Age = 23,
                    City = "Montreal",
                    Country = "Canada",
                    Bio = "Training LLMs to play jazz piano and co-compose melodies. Lover of cozy sweaters, vinyl, and searching Montreal for the fluffiest almond croissant.",
                    Avatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
                    Images = "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600,https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600",
                    Badges = "GitHub,University",
                    Interests = "AI Research,Jazz Piano,Croissants,Indie Games,Nordic Cinema",
                    PersonalityTraits = "Cozy Dreamer,Sharp Analyst,Quietly Playful",
                    HumorScore = 48,
                    AmbitionScore = 85,
                    SleepScore = 78,
                    SleepSchedule = "Night Owl (1:30 AM - 9:00 AM)",
                    StandupClip = "https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-at-a-cafe-40172-large.mp4",
                    HumorArchetype = "Intellectual Puns & Self-Deprecating Musician Trope",
                    CommunicationStyle = "Gentle, uses rich vocabulary, punctuation is precise, sprinkles in French terms occasionally (bonjour, c'est la vie).",
                    CulturalTip = "French-Canadian culture values warmth and creative collaboration. Elias is intense, but Chloe appreciates cozy, slow conversations over art, AI, and food.",
                    Icebreaker = "Ask Chloe: \"If a neural network tries to improvise a jazz solo, does it sound like Miles Davis or a printer jam?\"",
                    ChatResponsesJson = @"[
                      {""trigger"":""jazz"",""response"":""I play classical and jazz. Jazz is all about the notes you choose NOT to play. It is like coding—the cleanest code is often what you delete."",""wingmanTip"":""Perfect analogy! Reply by discussing the art of simplicity in either code, design, or daily life.""},
                      {""trigger"":""croissant"",""response"":""A real croissant must flaky enough to leave a trail of crumbs all over your sweater. If it does not, it is just shaped bread. 🥐"",""wingmanTip"":""Play along with the sweater crumb test! Ask if she's found the champion bakery in Montreal yet.""},
                      {""trigger"":""ai"",""response"":""I work on generative music models. I want AI to collaborate with human musicians, not replace them. Co-creation is much more beautiful."",""wingmanTip"":""Express agreement with the co-creation philosophy. Ask how she guides the model's mood.""},
                      {""trigger"":""meet"",""response"":""We should share a Spotify playlist. I want to see what songs you listen to when you need to focus or write code."",""wingmanTip"":""Suggest creating a collaborative playlist—it's a low-pressure, highly romantic digital step.""}
                    ]",
                    IsCurrentUser = false
                }
            };
            context.Users.AddRange(seedUsers);
            context.SaveChanges();
        }

        // Seed Matches if empty (Establish default prototype matches with Yuki and Chloe)
        if (!context.Matches.Any())
        {
            var seedMatches = new[]
            {
                new DbMatch { UserAId = "me", UserBId = "yuki-tanaka" },
                new DbMatch { UserAId = "me", UserBId = "chloe-laurent" }
            };
            context.Matches.AddRange(seedMatches);
            context.SaveChanges();
        }

        // Seed default chat messages if empty
        if (!context.Messages.Any())
        {
            var seedMessages = new[]
            {
                new DbMessage { SenderId = "yuki-tanaka", RecipientId = "me", Text = "Hey there. I just finished compiling a generative track based on my micro-bonsai tree...", Timestamp = "10:14 PM" },
                new DbMessage { SenderId = "me", RecipientId = "yuki-tanaka", Text = "Wow, that sounds incredible! How does the tree influence the synthesizer?", Timestamp = "10:15 PM" },
                new DbMessage { SenderId = "yuki-tanaka", RecipientId = "me", Text = "I use soil moisture sensors. When it gets thirsty, it shifts into minor scales 🍂. It is very dramatic.", Timestamp = "10:17 PM" },
                
                new DbMessage { SenderId = "chloe-laurent", RecipientId = "me", Text = "I taught my transformer model a basic bebop progression today. It responded with a chord that does not exist in standard theory, but it actually sounded... comforting?", Timestamp = "8:42 PM" },
                new DbMessage { SenderId = "me", RecipientId = "chloe-laurent", Text = "Wow, maybe the model found a shortcut in music mathematics!", Timestamp = "8:44 PM" },
                new DbMessage { SenderId = "chloe-laurent", RecipientId = "me", Text = "Exactly! It defied the circle of fifths. I call it the \"AI flat-ninth\" haha.", Timestamp = "8:45 PM" }
            };
            context.Messages.AddRange(seedMessages);
            context.SaveChanges();
        }

        // Seed Reels if empty
        if (!context.Reels.Any())
        {
            var seedReels = new[]
            {
                new DbReel
                {
                    Id = "reel-1",
                    AuthorName = "Yuki Tanaka",
                    AuthorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
                    AuthorCountry = "Japan",
                    AuthorBadge = "GitHub",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-41553-large.mp4",
                    Caption = "Tuning my modular synth using soil resistance sensors on a 15-year-old bonsai tree. It is feeling moody today. 🪴🔊 #ambient #creativecoding #tokyotech",
                    Tags = "Creative Coding,Ambient Music,Bonsai",
                    Likes = 1242,
                    CommentsJson = @"[
                      {""user"":""cyber_gardener"",""text"":""The pitch bends when you water it? Unbelievable."",""time"":""2h ago""},
                      {""user"":""elias_weber"",""text"":""This is brilliant. We should try it with bioluminescent algae cultures."",""time"":""4h ago""}
                    ]"
                },
                new DbReel
                {
                    Id = "reel-2",
                    AuthorName = "Priya Sharma",
                    AuthorAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
                    AuthorCountry = "India",
                    AuthorBadge = "Creator",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-serving-hot-coffee-in-a-glass-41618-large.mp4",
                    Caption = "Secrets of South Indian filter coffee. Aeration is key! ☕️🇮🇳 #travelindia #coffeehistory",
                    Tags = "Travel Stories,Food History,Coffee",
                    Likes = 3105,
                    CommentsJson = @"[
                      {""user"":""caffeine_addict"",""text"":""Look at that foam! I can smell it from here."",""time"":""1d ago""},
                      {""user"":""chloe_l"",""text"":""I need to find this in Montreal immediately."",""time"":""12h ago""}
                    ]"
                },
                new DbReel
                {
                    Id = "reel-3",
                    AuthorName = "Elias Weber",
                    AuthorAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                    AuthorCountry = "Germany",
                    AuthorBadge = "Founder",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-neon-light-reflections-in-wet-asphalt-at-night-42008-large.mp4",
                    Caption = "3 AM post-club stroll through Berlin Kreuzberg. Designing biological bricks in my head. 🦾🧱 #berlinnightlife #biotech #founder",
                    Tags = "Berlin Stories,Founder Life,Techno",
                    Likes = 852,
                    CommentsJson = @"[
                      {""user"":""tokyo_drift"",""text"":""Berlin night vibes are unmatched."",""time"":""6h ago""},
                      {""user"":""bio_hacker"",""text"":""Are the brick samples stable at low temps?"",""time"":""3h ago""}
                    ]"
                }
            };
            context.Reels.AddRange(seedReels);
            context.SaveChanges();
        }

        // Seed Live Rooms if empty
        if (!context.LiveRooms.Any())
        {
            var seedRooms = new[]
            {
                new DbLiveRoom
                {
                    Id = "room-1",
                    Title = "Code vs. Biology: Are We Just Compiling Carbon?",
                    HostName = "Elias Weber",
                    HostAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                    HostBadge = "Founder",
                    ListenersCount = 142,
                    Category = "Science & Code",
                    SpeakersJson = @"[
                      {""name"":""Elias Weber"",""avatar"":""https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"",""isSpeaking"":true},
                      {""name"":""Yuki Tanaka"",""avatar"":""https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"",""isSpeaking"":false},
                      {""name"":""Dr. Sarah Chen"",""avatar"":""https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"",""isSpeaking"":false}
                    ]",
                    MessagesJson = @"[
                      {""user"":""pixel_pusher"",""text"":""This is wild. DNA is literally just a 4-bit quaternary system."",""time"":""11:15"",""avatar"":""https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=30&h=30""},
                      {""user"":""green_tech"",""text"":""Can yeast compile JavaScript? Lol."",""time"":""11:16"",""avatar"":""https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=30&h=30""},
                      {""user"":""yuki_t"",""text"":""Actually, plant bio-data is surprisingly structured. More like a stream of MIDI events."",""time"":""11:17"",""avatar"":""https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=30&h=30""}
                    ]"
                },
                new DbLiveRoom
                {
                    Id = "room-2",
                    Title = "Finding the Soul of a City Through Food History",
                    HostName = "Priya Sharma",
                    HostAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
                    HostBadge = "Creator",
                    ListenersCount = 289,
                    Category = "Culture & Food",
                    SpeakersJson = @"[
                      {""name"":""Priya Sharma"",""avatar"":""https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"",""isSpeaking"":true},
                      {""name"":""Chloe Laurent"",""avatar"":""https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"",""isSpeaking"":true}
                    ]",
                    MessagesJson = @"[
                      {""user"":""traveler_sam"",""text"":""Priya, tell the story of the cardamom trade in Spain!"",""time"":""11:20"",""avatar"":""https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=30&h=30""},
                      {""user"":""montreal_foodie"",""text"":""Croissants in Quebec have this special maple glaze sometimes."",""time"":""11:22"",""avatar"":""https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=30&h=30""}
                    ]"
                }
            };
            context.LiveRooms.AddRange(seedRooms);
            context.SaveChanges();
        }
    }
}
