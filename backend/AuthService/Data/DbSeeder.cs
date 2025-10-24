using AuthService.Models;
using AuthService.Helpers;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminAsync(AuthDbContext db)
        {
            // Note: Database migrations are now applied in Program.cs before seeding
            
            // Check if any admin exists
            if (!await db.Users.AnyAsync(u => u.Role == Roles.Admin))
            {
                var admin = new User
                {
                    Email = "admin@nalanda.com",       // Default admin email
                    Name = "Amali Amanda",            // Default admin name
                    PasswordHash = PasswordHelper.HashPassword("Admin@123"), // Default password
                    Role = Roles.Admin,
                    Subscription = SubscriptionStatus.Premium,
                    Active = true,
                    CreatedAt = DateTime.UtcNow
                };

                db.Users.Add(admin);
                await db.SaveChangesAsync();

                Console.WriteLine("Default admin user created");
            }
        }
    }
}
