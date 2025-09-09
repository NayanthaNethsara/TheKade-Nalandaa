using AuthService.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserProfile> UserProfiles { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                // Unique indexes
                entity.HasIndex(u => u.GoogleId).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();

                // Login constraint: either GoogleId or PasswordHash must be non-null
                entity.ToTable(tb => tb.HasCheckConstraint(
                    "CK_User_Login",
                    "([GoogleId] IS NOT NULL OR [PasswordHash] IS NOT NULL)"
                ));

            });

            modelBuilder.Entity<UserProfile>(entity =>
            {
                // One-to-one relationship with User
                entity.HasOne(up => up.User)
                      .WithOne(u => u.Profile)
                      .HasForeignKey<UserProfile>(up => up.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // if user is deleted, profile also goes
            });
        }
    }
}
