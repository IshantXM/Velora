using System.ComponentModel.DataAnnotations;

namespace VeloraApp.Models;

public class DbUser
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;

    // Stored as comma-separated lists for simple cross-platform schema compliance
    public string Images { get; set; } = string.Empty;
    public string Badges { get; set; } = string.Empty;
    public string Interests { get; set; } = string.Empty;
    public string PersonalityTraits { get; set; } = string.Empty;
    
    public int HumorScore { get; set; }
    public int AmbitionScore { get; set; }
    public int SleepScore { get; set; }
    public string SleepSchedule { get; set; } = string.Empty;
    public string StandupClip { get; set; } = string.Empty;
    public string HumorArchetype { get; set; } = string.Empty;
    public string CommunicationStyle { get; set; } = string.Empty;
    public string CulturalTip { get; set; } = string.Empty;
    public string Icebreaker { get; set; } = string.Empty;

    // Semi-structured JSON trigger responses configuration
    public string ChatResponsesJson { get; set; } = string.Empty;
    
    public bool IsCurrentUser { get; set; }
}
