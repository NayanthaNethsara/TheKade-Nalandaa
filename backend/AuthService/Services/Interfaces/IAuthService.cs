using AuthService.DTOs;

namespace AuthService.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginWithGoogleAsync(GoogleLoginDto dto);
    Task<AuthResponseDto> RegisterLocalAsync(RegisterUserDto dto);
    Task<AuthResponseDto> LoginLocalAsync(LoginUserDto dto);
}
