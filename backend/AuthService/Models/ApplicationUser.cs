using Microsoft.AspNetCore.Identity;

namespace AuthService.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string FullName { get; set; }
        // Other profile fields
    }
}
