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

    public async Task<List<ReaderSummeryDto>> GetAllReadersAsync()
    {
        return await _dbContext.Users
            .Where(u => u.Role == Roles.Reader)
            .Select(u => new ReaderSummeryDto(
                u.Id,
                u.Name,
                u.Email,
                u.Subscription,
                u.CreatedAt
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
                u.CreatedAt
            ))
            .FirstOrDefaultAsync();
    }

}
