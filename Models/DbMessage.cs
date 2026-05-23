using System.ComponentModel.DataAnnotations;

namespace VeloraApp.Models;

public class DbMessage
{
    [Key]
    public int Id { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string RecipientId { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty; // E.g., "10:14 PM"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
