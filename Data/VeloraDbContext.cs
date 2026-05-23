using Microsoft.EntityFrameworkCore;
using VeloraApp.Models;

namespace VeloraApp.Data;

public class VeloraDbContext : DbContext
{
    public VeloraDbContext(DbContextOptions<VeloraDbContext> options) : base(options)
    {
    }

    public DbSet<DbUser> Users { get; set; } = null!;
    public DbSet<DbSwipe> Swipes { get; set; } = null!;
    public DbSet<DbMatch> Matches { get; set; } = null!;
    public DbSet<DbMessage> Messages { get; set; } = null!;
    public DbSet<DbReel> Reels { get; set; } = null!;
    public DbSet<DbLiveRoom> LiveRooms { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Custom configurations (indexes, keys mapping if needed)
        modelBuilder.Entity<DbUser>().ToTable("users");
        modelBuilder.Entity<DbSwipe>().ToTable("swipes");
        modelBuilder.Entity<DbMatch>().ToTable("matches");
        modelBuilder.Entity<DbMessage>().ToTable("messages");
        modelBuilder.Entity<DbReel>().ToTable("reels");
        modelBuilder.Entity<DbLiveRoom>().ToTable("live_rooms");
    }
}
