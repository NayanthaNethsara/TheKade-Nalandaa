using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // ------------------ GOOGLE LOGIN ------------------
    [HttpPost("login/google")]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginDto dto)
    {
        try
        {
            var result = await _authService.LoginWithGoogleAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ------------------ LOCAL REGISTER (Reader) ------------------
    [HttpPost("register")]
    public async Task<IActionResult> RegisterLocal([FromBody] RegisterUserDto dto)
    {
        try
        {
            var result = await _authService.RegisterLocalAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ------------------ LOCAL LOGIN ------------------
    [HttpPost("login")]
    public async Task<IActionResult> LoginLocal([FromBody] LoginUserDto dto)
    {
        try
        {
            var result = await _authService.LoginLocalAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ------------------ AUTHOR REGISTRATION ------------------
    [HttpPost("register-author")]
    public async Task<IActionResult> RegisterAuthor([FromBody] RegisterAuthorDto dto)
    {
        try
        {
            var result = await _authService.RegisterAuthorAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ------------------ FORGOT PASSWORD ------------------
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        try
        {
            await _authService.ForgotPasswordAsync(dto);
            return Ok(new { message = "If the email exists, a reset link has been sent." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ------------------ RESET PASSWORD ------------------
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        try
        {
            await _authService.ResetPasswordAsync(dto);
            return Ok(new { message = "Password has been reset successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
