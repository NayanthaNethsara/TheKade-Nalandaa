using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string GoogleId { get; set; } = null!; // Google OAuth unique ID

        [Required, EmailAddress, MaxLength(255)]
        public string Email { get; set; } = null!;

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required, MaxLength(20)]
        public string Role { get; set; } = Roles.Reader; // default

        [Required, MaxLength(20)]
        public string Subscription { get; set; } = SubscriptionStatus.Free; // default

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public UserProfile? Profile { get; set; }
    }
}
