using System.Security.Cryptography;
using System.Text;
using AuthService.Data;
using AuthService.DTOs;
using AuthService.Helpers;
using AuthService.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Services;

public class AuthServiceImpl : IAuthService
{
    private readonly AuthDbContext _db;
    private readonly JwtService _jwt;
    private readonly IGoogleOAuthHelper _googleHelper;

    public AuthServiceImpl(AuthDbContext db, JwtService jwt, IGoogleOAuthHelper googleHelper)
    {
        _db = db;
        _jwt = jwt;
        _googleHelper = googleHelper;
    }

    // Google OAuth Login
    public async Task<AuthResponseDto> LoginWithGoogleAsync(GoogleLoginDto dto)
    {
        var userInfo = await _googleHelper.ExchangeCodeAsync(dto.Code, dto.RedirectUri);
        var googleId = userInfo.GetProperty("id").GetString()!;
        var email = userInfo.GetProperty("email").GetString()!;
        var name = userInfo.GetProperty("name").GetString()!;

        var user = await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);
        if (user == null)
        {
            user = new User
            {
                GoogleId = googleId,
                Email = email,
                Name = name,
                Role = Roles.Reader,
                Subscription = SubscriptionStatus.Free
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        return new AuthResponseDto(_jwt.GenerateToken(user));
    }


    // Local Registration
    public async Task<AuthResponseDto> RegisterLocalAsync(RegisterUserDto dto)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existing != null) throw new Exception("Email already in use");

        var user = new User
        {
            Email = dto.Email,
            Name = dto.Name,
            PasswordHash = PasswordHelper.HashPassword(dto.Password),
            Role = Roles.Reader,
            Subscription = SubscriptionStatus.Free
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponseDto(_jwt.GenerateToken(user));
    }


    // Local Login
    public async Task<AuthResponseDto> LoginLocalAsync(LoginUserDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        if (user == null || !PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        return new AuthResponseDto(_jwt.GenerateToken(user));
    }


}
