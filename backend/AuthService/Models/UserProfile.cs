using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Models
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }

        [Required, ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [MaxLength(12)]
        public string? NIC { get; set; }

        [Phone, MaxLength(15)]
        public string? Phone { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? Occupation { get; set; }
    }
}
