using AuthService.Models;

namespace AuthService.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByGoogleIdAsync(string googleId);
        Task<User> AddAsync(User user);
        Task SaveChangesAsync();
    }
}
