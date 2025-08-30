using AuthService.Data;
using AuthService.DTOs;
using AuthService.Helpers;
using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AuthDbContext _db;
    private readonly JwtService _jwt;
    private readonly GoogleOAuthHelper _googleHelper;

    public AuthController(AuthDbContext db, JwtService jwt, GoogleOAuthHelper googleHelper)
    {
        _db = db;
        _jwt = jwt;
        _googleHelper = googleHelper;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        var userInfo = await _googleHelper.ExchangeCodeAsync(dto.Code, dto.RedirectUri);
        var googleId = userInfo.GetProperty("id").GetString()!;
        var email = userInfo.GetProperty("email").GetString()!;
        var name = userInfo.GetProperty("name").GetString()!;

        var user = await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);
        if (user == null)
        {
            user = new User { GoogleId = googleId, Email = email, Name = name };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var jwt = _jwt.GenerateToken(user);
        return Ok(new { token = jwt });
    }
}
