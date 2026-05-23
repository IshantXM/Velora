using System.ComponentModel.DataAnnotations;

namespace VeloraApp.Models;

public class DbLiveRoom
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    
    public string HostName { get; set; } = string.Empty;
    public string HostAvatar { get; set; } = string.Empty;
    public string HostBadge { get; set; } = string.Empty;

    public int ListenersCount { get; set; }
    
    // JSON lists for speakers and messages lists
    public string SpeakersJson { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string MessagesJson { get; set; } = string.Empty;
}
