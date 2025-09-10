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

    // Google Login
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
        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("Password is required");

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

        if (user == null || string.IsNullOrEmpty(user.PasswordHash) ||
            !PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid credentials");
        }

        if (!user.Active)
            throw new Exception("Account is inactive. Please contact support.");

        return new AuthResponseDto(_jwt.GenerateToken(user));
    }

    // Author Registration
    public async Task<AuthResponseDto> RegisterAuthorAsync(RegisterAuthorDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("Password is required");

        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existing != null) throw new Exception("Email already in use");

        using var transaction = await _db.Database.BeginTransactionAsync();

        var user = new User
        {
            Email = dto.Email,
            Name = dto.Name,
            PasswordHash = PasswordHelper.HashPassword(dto.Password),
            Role = Roles.Author,
            Subscription = SubscriptionStatus.Author,
            Active = false // Authors need admin approval
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var profile = new UserProfile
        {
            UserId = user.Id,
            NIC = dto.NIC,
            Phone = dto.Phone
        };

        _db.UserProfiles.Add(profile);
        await _db.SaveChangesAsync();

        await transaction.CommitAsync();

        return new AuthResponseDto(_jwt.GenerateToken(user));
    }

    // Forgot Password
    public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null) return; // Do not reveal if email exists

        // Generate a secure reset token (store in DB or send via email)
        var resetToken = Guid.NewGuid().ToString();

        user.PasswordResetToken = resetToken;
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);

        await _db.SaveChangesAsync();

        // TODO: Send email with reset link containing token
    }

    // Reset Password
    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.PasswordResetToken == dto.Token &&
            u.PasswordResetTokenExpiry > DateTime.UtcNow);

        if (user == null)
            throw new Exception("Invalid or expired reset token");

        user.PasswordHash = PasswordHelper.HashPassword(dto.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;

        await _db.SaveChangesAsync();
    }
}
