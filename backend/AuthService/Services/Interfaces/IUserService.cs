using AuthService.DTOs;

namespace AuthService.Services;

public interface IUserService
{
    Task<List<ReaderSummeryDto>> GetAllReadersAsync();
    Task<ReaderSummeryDto?> GetReaderByIdAsync(int id);

}

