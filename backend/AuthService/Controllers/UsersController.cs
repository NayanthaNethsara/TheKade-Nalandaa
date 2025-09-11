using Microsoft.AspNetCore.Mvc;
using AuthService.DTOs;
using AuthService.Services;

namespace AuthService.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // ----------------- Readers -----------------
    [HttpGet("readers")]
    public async Task<IActionResult> GetAllReaders()
    {
        try
        {
            var readers = await _userService.GetAllReadersAsync();
            return Ok(readers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("readers/{id}")]
    public async Task<IActionResult> GetReaderById(int id)
    {
        try
        {
            var reader = await _userService.GetReaderByIdAsync(id);
            if (reader == null) return NotFound(new { error = "Reader not found" });
            return Ok(reader);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // ----------------- Authors -----------------
    [HttpGet("authors")]
    public async Task<IActionResult> GetAllAuthors()
    {
        try
        {
            var authors = await _userService.GetAllAuthorsAsync();
            return Ok(authors);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("authors/{id}")]
    public async Task<IActionResult> GetAuthorById(int id)
    {
        try
        {
            var author = await _userService.GetAuthorByIdAsync(id);
            if (author == null) return NotFound(new { error = "Author not found" });
            return Ok(author);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // ----------------- Activate / Deactivate -----------------
    [HttpPatch("{id}/activate")]
    public async Task<IActionResult> ActivateUser(int id)
    {
        try
        {
            await _userService.ActivateUserAsync(id);
            return Ok(new { message = "User activated successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<IActionResult> DeactivateUser(int id)
    {
        try
        {
            await _userService.DeactivateUserAsync(id);
            return Ok(new { message = "User deactivated successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    // ----------------- Change Profile Picture -----------------
    [HttpPatch("{id}/profile-picture")]
    public async Task<IActionResult> ChangeProfilePicture(int id, [FromBody] UserProfilePictureDto dto)
    {
        if (id != dto.UserId)
            return BadRequest(new { error = "User ID mismatch" });

        try
        {
            await _userService.ChangeProfilePictureAsync(dto);
            return Ok(new { message = "Profile picture updated successfully" });
        }
        catch (Exception ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}
