using System.ComponentModel.DataAnnotations;

namespace VeloraApp.Models;

public class DbMatch
{
    [Key]
    public int Id { get; set; }
    public string UserAId { get; set; } = string.Empty;
    public string UserBId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
