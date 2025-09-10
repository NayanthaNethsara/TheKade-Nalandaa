using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        // Optional now — Google-only users will have a value, local accounts may have null
        [MaxLength(100)]
        public string? GoogleId { get; set; }

        [Required, EmailAddress, MaxLength(255)]
        public string Email { get; set; } = null!;

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required, MaxLength(20)]
        public Roles Role { get; set; } = Roles.Reader; // default

        [Required, MaxLength(20)]
        public SubscriptionStatus Subscription { get; set; } = SubscriptionStatus.Free; // default

        // Nullable: for Google-only users this will be null.
        // For local accounts store hashed password (e.g. using IPasswordHasher<T>).
        [MaxLength(512)]
        public string? PasswordHash { get; set; }

        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // navigation to detailed profile (optional)
        public UserProfile? Profile { get; set; }

        [Required]
        public bool Active { get; set; } = true; // default
    }
}
