using AuthService.DTOs;
using AuthService.Models;

namespace AuthService.Services
{
    public interface IUserService
    {
        // Existing
        Task<List<ReaderSummeryDto>> GetAllReadersAsync();
        Task<ReaderSummeryDto?> GetReaderByIdAsync(int id);

        // New
        Task<List<AuthorSummeryDto>> GetAllAuthorsAsync();
        Task<AuthorSummeryDto?> GetAuthorByIdAsync(int id);

        Task ActivateUserAsync(int userId);
        Task DeactivateUserAsync(int userId);

        Task ChangeProfilePictureAsync(UserProfilePictureDto dto);
        Task ChangeReaderSubscriptionAsync(int userId, SubscriptionStatus subscription);
    }
}
