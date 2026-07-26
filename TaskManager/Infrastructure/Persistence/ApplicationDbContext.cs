using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>(e =>
        {
            e.ToTable("Projects");
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).HasMaxLength(100).IsRequired();
            e.Property(p => p.Description).HasMaxLength(500);
            e.Property(p => p.CreatedAt).IsRequired();

            e.HasMany(p => p.Tasks)
             .WithOne(t => t.Project!)
             .HasForeignKey(t => t.ProjectId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TaskItem>(e =>
        {
            e.ToTable("Tasks");
            e.HasKey(t => t.Id);
            e.Property(t => t.Title).HasMaxLength(200).IsRequired();
            e.Property(t => t.Description).HasMaxLength(1000);
            e.Property(t => t.Status).HasConversion<string>().HasMaxLength(20).IsRequired();
            e.Property(t => t.ProjectId).IsRequired();
            e.Property(t => t.CreatedAt).IsRequired();

            e.HasIndex(t => t.ProjectId);
            e.HasIndex(t => t.Status);
        });
    }
}
