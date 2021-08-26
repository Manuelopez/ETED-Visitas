using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt)
    {}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Node> Nodes { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<VisitForm> VisitForms { get; set; }
    public DbSet<Group> Groups { get; set; }
  }
}