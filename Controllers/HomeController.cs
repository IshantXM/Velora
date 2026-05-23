using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using VeloraApp.Data;
using VeloraApp.Models;

namespace VeloraApp.Controllers;

public class HomeController : Controller
{
    private readonly VeloraDbContext _context;

    public HomeController(VeloraDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    // ----------------------------------------------------
    // Profiles API
    // ----------------------------------------------------
    [HttpGet("api/profiles")]
    public IActionResult GetProfiles()
    {
        // Filter out profiles the current user has already swiped
        var swipedTargetIds = _context.Swipes
            .Where(s => s.FromUserId == "me")
            .Select(s => s.ToUserId)
            .ToList();

        var profiles = _context.Users
            .Where(u => !u.IsCurrentUser && !swipedTargetIds.Contains(u.Id))
            .Select(u => new
            {
                id = u.Id,
                name = u.Name,
                age = u.Age,
                city = u.City,
                country = u.Country,
                bio = u.Bio,
                avatar = u.Avatar,
                images = string.IsNullOrEmpty(u.Images) ? new string[] { } : u.Images.Split(',', StringSplitOptions.RemoveEmptyEntries),
                badges = string.IsNullOrEmpty(u.Badges) ? new string[] { } : u.Badges.Split(',', StringSplitOptions.RemoveEmptyEntries),
                interests = string.IsNullOrEmpty(u.Interests) ? new string[] { } : u.Interests.Split(',', StringSplitOptions.RemoveEmptyEntries),
                personalityTraits = string.IsNullOrEmpty(u.PersonalityTraits) ? new string[] { } : u.PersonalityTraits.Split(',', StringSplitOptions.RemoveEmptyEntries),
                humorScore = u.HumorScore,
                ambitionScore = u.AmbitionScore,
                sleepScore = u.SleepScore,
                sleepSchedule = u.SleepSchedule,
                standupClip = u.StandupClip,
                humorArchetype = u.HumorArchetype,
                communicationStyle = u.CommunicationStyle,
                culturalTip = u.CulturalTip,
                icebreaker = u.Icebreaker
            })
            .ToList();

        return Ok(profiles);
    }

    // ----------------------------------------------------
    // Onboarding API
    // ----------------------------------------------------
    public class OnboardRequest
    {
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string[] Badges { get; set; } = new string[] { };
        public string[] Interests { get; set; } = new string[] { };
        public string[] PersonalityTraits { get; set; } = new string[] { };
        public int HumorScore { get; set; }
        public int AmbitionScore { get; set; }
        public int SleepScore { get; set; }
        public string SleepSchedule { get; set; } = string.Empty;
    }

    [HttpPost("api/onboarding")]
    public IActionResult SaveOnboarding([FromBody] OnboardRequest request)
    {
        if (request == null) return BadRequest("Invalid request payload.");

        var existingUser = _context.Users.FirstOrDefault(u => u.Id == "me");
        if (existingUser != null)
        {
            existingUser.Name = request.Name;
            existingUser.Age = request.Age;
            existingUser.City = request.City;
            existingUser.Country = request.Country;
            existingUser.Bio = request.Bio;
            existingUser.Avatar = request.Avatar;
            existingUser.Badges = string.Join(",", request.Badges);
            existingUser.Interests = string.Join(",", request.Interests);
            existingUser.PersonalityTraits = string.Join(",", request.PersonalityTraits);
            existingUser.HumorScore = request.HumorScore;
            existingUser.AmbitionScore = request.AmbitionScore;
            existingUser.SleepScore = request.SleepScore;
            existingUser.SleepSchedule = request.SleepSchedule;
            _context.Users.Update(existingUser);
        }
        else
        {
            var newUser = new DbUser
            {
                Id = "me",
                Name = request.Name,
                Age = request.Age,
                City = request.City,
                Country = request.Country,
                Bio = request.Bio,
                Avatar = request.Avatar,
                Badges = string.Join(",", request.Badges),
                Interests = string.Join(",", request.Interests),
                PersonalityTraits = string.Join(",", request.PersonalityTraits),
                HumorScore = request.HumorScore,
                AmbitionScore = request.AmbitionScore,
                SleepScore = request.SleepScore,
                SleepSchedule = request.SleepSchedule,
                IsCurrentUser = true
            };
            _context.Users.Add(newUser);
        }

        _context.SaveChanges();
        return Ok(new { success = true });
    }

    // ----------------------------------------------------
    // Swipe API
    // ----------------------------------------------------
    public class SwipeRequest
    {
        public string TargetId { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
    }

    [HttpPost("api/swipe")]
    public IActionResult RecordSwipe([FromBody] SwipeRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.TargetId)) return BadRequest();

        var swipe = new DbSwipe
        {
            FromUserId = "me",
            ToUserId = request.TargetId,
            Direction = request.Direction
        };
        _context.Swipes.Add(swipe);
        _context.SaveChanges();

        bool isMatch = false;
        if (request.Direction == "right")
        {
            var matchExists = _context.Matches.Any(m =>
                (m.UserAId == "me" && m.UserBId == request.TargetId) ||
                (m.UserAId == request.TargetId && m.UserBId == "me"));

            if (!matchExists)
            {
                var match = new DbMatch { UserAId = "me", UserBId = request.TargetId };
                _context.Matches.Add(match);
                _context.SaveChanges();
                isMatch = true;
            }
        }

        return Ok(new { isMatch });
    }

    // ----------------------------------------------------
    // Matches API
    // ----------------------------------------------------
    [HttpGet("api/matches")]
    public IActionResult GetMatches()
    {
        var matchUserIds = _context.Matches
            .Where(m => m.UserAId == "me" || m.UserBId == "me")
            .Select(m => m.UserAId == "me" ? m.UserBId : m.UserAId)
            .ToList();

        var profiles = _context.Users
            .Where(u => matchUserIds.Contains(u.Id))
            .Select(u => new
            {
                id = u.Id,
                name = u.Name,
                age = u.Age,
                city = u.City,
                country = u.Country,
                bio = u.Bio,
                avatar = u.Avatar,
                badges = string.IsNullOrEmpty(u.Badges) ? new string[] { } : u.Badges.Split(',', StringSplitOptions.RemoveEmptyEntries),
                interests = string.IsNullOrEmpty(u.Interests) ? new string[] { } : u.Interests.Split(',', StringSplitOptions.RemoveEmptyEntries),
                humorScore = u.HumorScore,
                ambitionScore = u.AmbitionScore,
                sleepScore = u.SleepScore,
                sleepSchedule = u.SleepSchedule,
                standupClip = u.StandupClip,
                humorArchetype = u.HumorArchetype,
                communicationStyle = u.CommunicationStyle,
                culturalTip = u.CulturalTip,
                icebreaker = u.Icebreaker
            })
            .ToList();

        return Ok(profiles);
    }

    // ----------------------------------------------------
    // Chat Message API
    // ----------------------------------------------------
    [HttpGet("api/chat/{profileId}")]
    public IActionResult GetChatHistory(string profileId)
    {
        var messages = _context.Messages
            .Where(m =>
                (m.SenderId == "me" && m.RecipientId == profileId) ||
                (m.SenderId == profileId && m.RecipientId == "me"))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new
            {
                sender = m.SenderId == "me" ? "me" : "them",
                text = m.Text,
                timestamp = m.Timestamp
            })
            .ToList();

        return Ok(messages);
    }

    public class MessageSendRequest
    {
        public string TargetId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }

    [HttpPost("api/chat")]
    public IActionResult SendChatMessage([FromBody] MessageSendRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.TargetId) || string.IsNullOrEmpty(request.Text)) return BadRequest();

        // Save User Message
        var now = DateTime.UtcNow.AddHours(5.5); // UTC+5:30 for Indian/local compatibility
        var userMsg = new DbMessage
        {
            SenderId = "me",
            RecipientId = request.TargetId,
            Text = request.Text,
            Timestamp = now.ToString("hh:mm tt")
        };
        _context.Messages.Add(userMsg);
        _context.SaveChanges();

        // Simulate typing response on target match profile
        var targetProfile = _context.Users.FirstOrDefault(u => u.Id == request.TargetId);
        if (targetProfile != null)
        {
            var lowerText = request.Text.ToLower();
            string replyText = "That's super interesting! I'd love to chat more about this. What are you working on today?";
            
            try
            {
                if (!string.IsNullOrEmpty(targetProfile.ChatResponsesJson))
                {
                    var triggers = System.Text.Json.JsonSerializer.Deserialize<List<ChatResponseTrigger>>(targetProfile.ChatResponsesJson);
                    if (triggers != null)
                    {
                        var matched = triggers.FirstOrDefault(t => lowerText.Contains(t.trigger.ToLower()));
                        if (matched != null)
                        {
                            replyText = matched.response;
                        }
                        else if (lowerText.Contains("hello") || lowerText.Contains("hi") || lowerText.Contains("hey"))
                        {
                            replyText = $"Hey! 🍵 Glad we matched. I was just reading about your profile. Love that we both score high on ambition and alignment.";
                        }
                    }
                }
            }
            catch { }

            // Insert simulated response into DB directly
            var replyMsg = new DbMessage
            {
                SenderId = request.TargetId,
                RecipientId = "me",
                Text = replyText,
                Timestamp = now.AddSeconds(2).ToString("hh:mm tt"),
                CreatedAt = DateTime.UtcNow.AddSeconds(2) // ensure order is correct
            };
            _context.Messages.Add(replyMsg);
            _context.SaveChanges();
        }

        return Ok(new { success = true });
    }

    private class ChatResponseTrigger
    {
        public string trigger { get; set; } = string.Empty;
        public string response { get; set; } = string.Empty;
        public string wingmanTip { get; set; } = string.Empty;
    }

    // ----------------------------------------------------
    // Reels API
    // ----------------------------------------------------
    [HttpGet("api/reels")]
    public IActionResult GetReels()
    {
        var reels = _context.Reels.ToList();
        var result = reels.Select(r => new
        {
            id = r.Id,
            user = new
            {
                name = r.AuthorName,
                avatar = r.AuthorAvatar,
                country = r.AuthorCountry,
                badge = r.AuthorBadge
            },
            videoUrl = r.VideoUrl,
            caption = r.Caption,
            tags = string.IsNullOrEmpty(r.Tags) ? new List<string>() : r.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
            likes = r.Likes,
            comments = string.IsNullOrEmpty(r.CommentsJson) ? new List<object>() : System.Text.Json.JsonSerializer.Deserialize<List<object>>(r.CommentsJson)
        }).ToList();

        return Ok(result);
    }

    [HttpPost("api/reels/like/{id}")]
    public IActionResult LikeReel(string id)
    {
        var reel = _context.Reels.FirstOrDefault(r => r.Id == id);
        if (reel == null) return NotFound();

        reel.Likes++;
        _context.SaveChanges();
        return Ok(new { likes = reel.Likes });
    }

    public class ReelUploadRequest
    {
        public string VideoUrl { get; set; } = string.Empty;
        public string Caption { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty;
    }

    [HttpPost("api/reels")]
    public IActionResult UploadReel([FromBody] ReelUploadRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.VideoUrl)) return BadRequest();

        var currentUser = _context.Users.FirstOrDefault(u => u.Id == "me");
        string name = currentUser?.Name ?? "Aura Seeker";
        string avatar = currentUser?.Avatar ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150";
        string country = currentUser?.Country ?? "United States";
        string badges = currentUser?.Badges ?? "";
        string primaryBadge = string.IsNullOrEmpty(badges) ? "University" : badges.Split(',')[0];

        var reel = new DbReel
        {
            Id = "reel-" + DateTime.UtcNow.Ticks,
            AuthorName = name,
            AuthorAvatar = avatar,
            AuthorCountry = country,
            AuthorBadge = primaryBadge,
            VideoUrl = request.VideoUrl,
            Caption = request.Caption,
            Tags = request.Tags,
            Likes = 0,
            CommentsJson = "[]"
        };

        _context.Reels.Add(reel);
        _context.SaveChanges();
        return Ok(reel);
    }

    // ----------------------------------------------------
    // Live Rooms API
    // ----------------------------------------------------
    [HttpGet("api/rooms")]
    public IActionResult GetRooms()
    {
        var rooms = _context.LiveRooms.ToList();
        var result = rooms.Select(r => new
        {
            id = r.Id,
            title = r.Title,
            host = new
            {
                name = r.HostName,
                avatar = r.HostAvatar,
                badge = r.HostBadge
            },
            listenersCount = r.ListenersCount,
            speakers = string.IsNullOrEmpty(r.SpeakersJson) ? new List<object>() : System.Text.Json.JsonSerializer.Deserialize<List<object>>(r.SpeakersJson),
            category = r.Category,
            messages = string.IsNullOrEmpty(r.MessagesJson) ? new List<object>() : System.Text.Json.JsonSerializer.Deserialize<List<object>>(r.MessagesJson)
        }).ToList();

        return Ok(result);
    }
}
