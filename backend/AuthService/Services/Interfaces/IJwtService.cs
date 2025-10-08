using AuthService.Models;

namespace AuthService.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}