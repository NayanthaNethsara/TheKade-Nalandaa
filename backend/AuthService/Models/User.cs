using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Models
{
    public static class Roles
    {
        public const string Reader = "Reader";
        public const string Author = "Author";
        public const string Admin = "Admin";
    }

    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string GoogleId { get; set; } = null!; // Google OAuth unique ID

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = Roles.Reader; // default role

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
