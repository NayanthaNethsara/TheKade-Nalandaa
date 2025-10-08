using Microsoft.EntityFrameworkCore;
using AuthService.Data;
using AuthService.DTOs;
using AuthService.Helpers;
using AuthService.Models;

namespace AuthService.Services;

public class UserService : IUserService
{
    private readonly AuthDbContext _dbContext;

    public UserService(AuthDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // ----------------- Readers -----------------
    public async Task<List<ReaderSummeryDto>> GetAllReadersAsync()
    {
        return await _dbContext.Users
            .Where(u => u.Role == Roles.Reader)
            .Select(u => new ReaderSummeryDto(
                u.Id,
                u.Name,
                u.Email,
                u.Subscription,
                u.CreatedAt,
                u.Active
            ))
            .ToListAsync();
    }

    public async Task<ReaderSummeryDto?> GetReaderByIdAsync(int id)
    {
        return await _dbContext.Users
            .Where(u => u.Id == id && u.Role == Roles.Reader)
            .Select(u => new ReaderSummeryDto(
                u.Id,
                u.Name,
                u.Email,
                u.Subscription,
                u.CreatedAt,
                u.Active
            ))
            .FirstOrDefaultAsync();
    }

    // ----------------- Authors -----------------
    public async Task<List<AuthorSummeryDto>> GetAllAuthorsAsync()
    {
        return await _dbContext.Users
            .Where(u => u.Role == Roles.Author)
            .Select(u => new AuthorSummeryDto(
                u.Id,
                u.Name,
                u.Email,
                u.CreatedAt,
                u.Active
            ))
            .ToListAsync();
    }

    public async Task<AuthorSummeryDto?> GetAuthorByIdAsync(int id)
    {
        return await _dbContext.Users
            .Where(u => u.Id == id && u.Role == Roles.Author)
            .Select(u => new AuthorSummeryDto(
                u.Id,
                u.Name,
                u.Email,
                u.CreatedAt,
                u.Active
            ))
            .FirstOrDefaultAsync();
    }

    // ----------------- Activate / Deactivate -----------------
    public async Task ActivateUserAsync(int userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");
        user.Active = true;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeactivateUserAsync(int userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");
        user.Active = false;
        await _dbContext.SaveChangesAsync();
    }

    // ----------------- Change Profile Picture -----------------
    public async Task ChangeProfilePictureAsync(UserProfilePictureDto dto)
    {
        var user = await _dbContext.Users.FindAsync(dto.UserId);
        if (user == null) throw new Exception("User not found");

        user.ProfilePictureUrl = dto.PictureUrl; // or handle IFormFile upload
        await _dbContext.SaveChangesAsync();
    }
}
