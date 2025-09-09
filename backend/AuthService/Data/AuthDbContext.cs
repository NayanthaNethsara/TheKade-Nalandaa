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

                // Role constraint
                entity.ToTable(tb => tb.HasCheckConstraint(
                    "CK_User_Role",
                    $"[Role] IN ('{Roles.Reader}', '{Roles.Author}', '{Roles.Admin}')"
                ));

                // Subscription constraint
                entity.ToTable(tb => tb.HasCheckConstraint(
                    "CK_User_Subscription",
                    $"[Subscription] IN ('{SubscriptionStatus.Free}', '{SubscriptionStatus.Premium}', '{SubscriptionStatus.Author}')"
                ));
            });
        }
    }
}
