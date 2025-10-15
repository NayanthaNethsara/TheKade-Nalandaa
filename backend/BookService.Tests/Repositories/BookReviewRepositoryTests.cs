using BookService.Data;
using BookService.Models;
using BookService.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BookService.Tests.Repositories;

public class BookReviewRepositoryTests : IDisposable
{
    private readonly BookDbContext _context;
    private readonly BookReviewRepository _repository;

    public BookReviewRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<BookDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new BookDbContext(options);
        _repository = new BookReviewRepository(_context);

        // Seed test data
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        var books = new List<Book>
        {
            new Book { Id = 1, Title = "Test Book 1", TitleSlug = "test-book-1", CoverImagePath = "/covers/test1.jpg", AuthorId = 1, AuthorName = "Author One" },
            new Book { Id = 2, Title = "Test Book 2", TitleSlug = "test-book-2", CoverImagePath = "/covers/test2.jpg", AuthorId = 2, AuthorName = "Author Two" }
        };

        var reviews = new List<BookReview>
        {
            new BookReview { Id = 1, BookId = 1, UserId = "user1", UserName = "User One", Rating = 5, ReviewText = "Excellent!", CreatedAt = DateTime.UtcNow },
            new BookReview { Id = 2, BookId = 1, UserId = "user2", UserName = "User Two", Rating = 4, ReviewText = "Very good", CreatedAt = DateTime.UtcNow },
            new BookReview { Id = 3, BookId = 2, UserId = "user1", UserName = "User One", Rating = 3, ReviewText = "It's okay", CreatedAt = DateTime.UtcNow }
        };

        _context.Books.AddRange(books);
        _context.BookReviews.AddRange(reviews);
        _context.SaveChanges();
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllReviews()
    {
        // Act
        var reviews = await _repository.GetAllAsync();

        // Assert
        Assert.NotNull(reviews);
        Assert.Equal(3, reviews.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsCorrectReview()
    {
        // Act
        var review = await _repository.GetByIdAsync(1);

        // Assert
        Assert.NotNull(review);
        Assert.Equal(1, review.Id);
        Assert.Equal("User One", review.UserName);
        Assert.Equal(5, review.Rating);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenReviewDoesNotExist()
    {
        // Act
        var review = await _repository.GetByIdAsync(999);

        // Assert
        Assert.Null(review);
    }

    [Fact]
    public async Task GetByBookIdAsync_ReturnsReviewsForBook()
    {
        // Act
        var reviews = await _repository.GetByBookIdAsync(1);

        // Assert
        Assert.NotNull(reviews);
        Assert.Equal(2, reviews.Count());
        Assert.All(reviews, r => Assert.Equal(1, r.BookId));
    }

    [Fact]
    public async Task GetByBookIdAsync_ReturnsEmpty_WhenNoReviews()
    {
        // Act
        var reviews = await _repository.GetByBookIdAsync(999);

        // Assert
        Assert.NotNull(reviews);
        Assert.Empty(reviews);
    }

    [Fact]
    public async Task GetByUserIdAsync_ReturnsReviewsByUser()
    {
        // Act
        var reviews = await _repository.GetByUserIdAsync("user1");

        // Assert
        Assert.NotNull(reviews);
        Assert.Equal(2, reviews.Count());
        Assert.All(reviews, r => Assert.Equal("user1", r.UserId));
    }

    [Fact]
    public async Task GetByUserIdAsync_ReturnsEmpty_WhenUserHasNoReviews()
    {
        // Act
        var reviews = await _repository.GetByUserIdAsync("nonexistent");

        // Assert
        Assert.NotNull(reviews);
        Assert.Empty(reviews);
    }

    [Fact]
    public async Task GetByBookAndUserAsync_ReturnsReview_WhenExists()
    {
        // Act
        var review = await _repository.GetByBookAndUserAsync(1, "user1");

        // Assert
        Assert.NotNull(review);
        Assert.Equal(1, review.BookId);
        Assert.Equal("user1", review.UserId);
    }

    [Fact]
    public async Task GetByBookAndUserAsync_ReturnsNull_WhenNotExists()
    {
        // Act
        var review = await _repository.GetByBookAndUserAsync(1, "user999");

        // Assert
        Assert.Null(review);
    }

    [Fact]
    public async Task CreateAsync_AddsNewReview()
    {
        // Arrange
        var newReview = new BookReview
        {
            BookId = 2,
            UserId = "user3",
            UserName = "User Three",
            Rating = 4,
            ReviewText = "Great book!"
        };

        // Act
        var createdReview = await _repository.CreateAsync(newReview);

        // Assert
        Assert.NotNull(createdReview);
        Assert.True(createdReview.Id > 0);
        Assert.Equal("User Three", createdReview.UserName);
        Assert.Equal(4, createdReview.Rating);

        var reviewInDb = await _context.BookReviews.FindAsync(createdReview.Id);
        Assert.NotNull(reviewInDb);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesExistingReview()
    {
        // Arrange
        var reviewToUpdate = await _repository.GetByIdAsync(1);
        Assert.NotNull(reviewToUpdate);
        reviewToUpdate.Rating = 3;
        reviewToUpdate.ReviewText = "Changed my mind";

        // Act
        var updatedReview = await _repository.UpdateAsync(reviewToUpdate);

        // Assert
        Assert.NotNull(updatedReview);
        Assert.Equal(3, updatedReview.Rating);
        Assert.Equal("Changed my mind", updatedReview.ReviewText);
        Assert.NotNull(updatedReview.UpdatedAt);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenReviewDoesNotExist()
    {
        // Arrange
        var nonExistentReview = new BookReview
        {
            Id = 999,
            BookId = 1,
            UserId = "user1",
            Rating = 5
        };

        // Act
        var result = await _repository.UpdateAsync(nonExistentReview);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesReview()
    {
        // Act
        var result = await _repository.DeleteAsync(1);

        // Assert
        Assert.True(result);
        var deletedReview = await _context.BookReviews.FindAsync(1);
        Assert.Null(deletedReview);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenReviewDoesNotExist()
    {
        // Act
        var result = await _repository.DeleteAsync(999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetAverageRatingAsync_ReturnsCorrectAverage()
    {
        // Act
        var averageRating = await _repository.GetAverageRatingAsync(1);

        // Assert
        Assert.Equal(4.5, averageRating); // (5 + 4) / 2 = 4.5
    }

    [Fact]
    public async Task GetAverageRatingAsync_ReturnsZero_WhenNoReviews()
    {
        // Act
        var averageRating = await _repository.GetAverageRatingAsync(999);

        // Assert
        Assert.Equal(0, averageRating);
    }

    [Fact]
    public async Task GetReviewCountAsync_ReturnsCorrectCount()
    {
        // Act
        var count = await _repository.GetReviewCountAsync(1);

        // Assert
        Assert.Equal(2, count);
    }

    [Fact]
    public async Task GetReviewCountAsync_ReturnsZero_WhenNoReviews()
    {
        // Act
        var count = await _repository.GetReviewCountAsync(999);

        // Assert
        Assert.Equal(0, count);
    }

    [Fact]
    public async Task CreateAsync_SetsCreatedAtToUtcNow()
    {
        // Arrange
        var beforeCreate = DateTime.UtcNow;
        var newReview = new BookReview
        {
            BookId = 1,
            UserId = "user4",
            UserName = "User Four",
            Rating = 5
        };

        // Act
        var createdReview = await _repository.CreateAsync(newReview);
        var afterCreate = DateTime.UtcNow;

        // Assert
        Assert.True(createdReview.CreatedAt >= beforeCreate);
        Assert.True(createdReview.CreatedAt <= afterCreate);
    }

    [Fact]
    public async Task UpdateAsync_SetsUpdatedAtToUtcNow()
    {
        // Arrange
        var review = await _repository.GetByIdAsync(1);
        Assert.NotNull(review);
        review.Rating = 4;

        var beforeUpdate = DateTime.UtcNow;

        // Act
        var updatedReview = await _repository.UpdateAsync(review);
        var afterUpdate = DateTime.UtcNow;

        // Assert
        Assert.NotNull(updatedReview);
        Assert.NotNull(updatedReview.UpdatedAt);
        Assert.True(updatedReview.UpdatedAt >= beforeUpdate);
        Assert.True(updatedReview.UpdatedAt <= afterUpdate);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
