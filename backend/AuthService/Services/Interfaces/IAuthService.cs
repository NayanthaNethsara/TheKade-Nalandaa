using AuthService.DTOs;
using AuthService.Models;

namespace AuthService.Services
{
    public interface IAuthService
    {
        Task<string> LoginWithGoogleAsync(GoogleLoginDto dto);
    }
}
