using BookService.Data;
using BookService.Models;
using BookService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookService.Repositories;

public class BookReviewRepository : IBookReviewRepository
{
    private readonly BookDbContext _context;

    public BookReviewRepository(BookDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BookReview>> GetAllAsync()
    {
        return await _context.BookReviews
            .Include(r => r.Book)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<BookReview?> GetByIdAsync(int id)
    {
        return await _context.BookReviews
            .Include(r => r.Book)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<BookReview>> GetByBookIdAsync(int bookId)
    {
        return await _context.BookReviews
            .Where(r => r.BookId == bookId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<BookReview>> GetByUserIdAsync(string userId)
    {
        return await _context.BookReviews
            .Include(r => r.Book)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<BookReview?> GetByBookAndUserAsync(int bookId, string userId)
    {
        return await _context.BookReviews
            .FirstOrDefaultAsync(r => r.BookId == bookId && r.UserId == userId);
    }

    public async Task<BookReview> CreateAsync(BookReview review)
    {
        review.CreatedAt = DateTime.UtcNow;
        _context.BookReviews.Add(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<BookReview?> UpdateAsync(BookReview review)
    {
        var existingReview = await GetByIdAsync(review.Id);
        if (existingReview == null) return null;

        existingReview.Rating = review.Rating;
        existingReview.ReviewText = review.ReviewText;
        existingReview.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingReview;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var review = await GetByIdAsync(id);
        if (review == null) return false;

        _context.BookReviews.Remove(review);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<double> GetAverageRatingAsync(int bookId)
    {
        var reviews = await _context.BookReviews
            .Where(r => r.BookId == bookId)
            .ToListAsync();

        return reviews.Any() ? reviews.Average(r => r.Rating) : 0;
    }

    public async Task<int> GetReviewCountAsync(int bookId)
    {
        return await _context.BookReviews
            .CountAsync(r => r.BookId == bookId);
    }
}
