using BookService.Models;

namespace BookService.Repositories.Interfaces;

public interface IBookReviewRepository
{
    Task<IEnumerable<BookReview>> GetAllAsync();
    Task<BookReview?> GetByIdAsync(int id);
    Task<IEnumerable<BookReview>> GetByBookIdAsync(int bookId);
    Task<IEnumerable<BookReview>> GetByUserIdAsync(string userId);
    Task<BookReview?> GetByBookAndUserAsync(int bookId, string userId);
    Task<BookReview> CreateAsync(BookReview review);
    Task<BookReview?> UpdateAsync(BookReview review);
    Task<bool> DeleteAsync(int id);
    Task<double> GetAverageRatingAsync(int bookId);
    Task<int> GetReviewCountAsync(int bookId);
}
