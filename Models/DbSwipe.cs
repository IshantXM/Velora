using System.ComponentModel.DataAnnotations;

namespace VeloraApp.Models;

public class DbSwipe
{
    [Key]
    public int Id { get; set; }
    public string FromUserId { get; set; } = string.Empty;
    public string ToUserId { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty; // "left" or "right"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
