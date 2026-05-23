using System.ComponentModel.DataAnnotations;

namespace VeloraApp.Models;

public class DbReel
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorAvatar { get; set; } = string.Empty;
    public string AuthorCountry { get; set; } = string.Empty;
    public string AuthorBadge { get; set; } = string.Empty;

    public string VideoUrl { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty; // Comma separated tags
    public int Likes { get; set; }
    
    // Flat JSON array for comments in prototype databases
    public string CommentsJson { get; set; } = string.Empty;
}
