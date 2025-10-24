using BookService.Controllers;
using BookService.DTOs;
using BookService.Models;
using BookService.Repositories;
using BookService.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BookService.Tests.Controllers;

public class BookReviewControllerTests
{
    private readonly Mock<IBookReviewRepository> _mockReviewRepository;
    private readonly Mock<IBookRepository> _mockBookRepository;
    private readonly BookReviewController _controller;

    public BookReviewControllerTests()
    {
        _mockReviewRepository = new Mock<IBookReviewRepository>();
        _mockBookRepository = new Mock<IBookRepository>();
        _controller = new BookReviewController(_mockReviewRepository.Object, _mockBookRepository.Object);
    }

    [Fact]
    public async Task GetAllReviews_ReturnsOkResult_WithListOfReviews()
    {
        // Arrange
        var reviews = new List<BookReview>
        {
            new BookReview { Id = 1, BookId = 1, UserId = "user1", UserName = "User One", Rating = 5, ReviewText = "Great book!" },
            new BookReview { Id = 2, BookId = 1, UserId = "user2", UserName = "User Two", Rating = 4, ReviewText = "Good read" }
        };
        _mockReviewRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(reviews);

        // Act
        var result = await _controller.GetAllReviews();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedReviews = Assert.IsAssignableFrom<IEnumerable<BookReviewDto>>(okResult.Value);
        Assert.Equal(2, returnedReviews.Count());
    }

    [Fact]
    public async Task GetReviewById_ReturnsOkResult_WhenReviewExists()
    {
        // Arrange
        var review = new BookReview
        {
            Id = 1,
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 5,
            ReviewText = "Excellent!"
        };
        _mockReviewRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(review);

        // Act
        var result = await _controller.GetReviewById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedReview = Assert.IsType<BookReviewDto>(okResult.Value);
        Assert.Equal(1, returnedReview.Id);
        Assert.Equal("User One", returnedReview.UserName);
    }

    [Fact]
    public async Task GetReviewById_ReturnsNotFound_WhenReviewDoesNotExist()
    {
        // Arrange
        _mockReviewRepository.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((BookReview?)null);

        // Act
        var result = await _controller.GetReviewById(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetReviewsByBookId_ReturnsOkResult_WhenBookExists()
    {
        // Arrange
        var book = new Book { Id = 1, Title = "Test Book" };
        var reviews = new List<BookReview>
        {
            new BookReview { Id = 1, BookId = 1, UserId = "user1", UserName = "User One", Rating = 5 },
            new BookReview { Id = 2, BookId = 1, UserId = "user2", UserName = "User Two", Rating = 4 }
        };
        _mockBookRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(book);
        _mockReviewRepository.Setup(repo => repo.GetByBookIdAsync(1)).ReturnsAsync(reviews);

        // Act
        var result = await _controller.GetReviewsByBookId(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedReviews = Assert.IsAssignableFrom<IEnumerable<BookReviewDto>>(okResult.Value);
        Assert.Equal(2, returnedReviews.Count());
    }

    [Fact]
    public async Task GetReviewsByBookId_ReturnsNotFound_WhenBookDoesNotExist()
    {
        // Arrange
        _mockBookRepository.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Book?)null);

        // Act
        var result = await _controller.GetReviewsByBookId(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetReviewsByUserId_ReturnsOkResult_WithUserReviews()
    {
        // Arrange
        var reviews = new List<BookReview>
        {
            new BookReview { Id = 1, BookId = 1, UserId = "user1", UserName = "User One", Rating = 5 },
            new BookReview { Id = 2, BookId = 2, UserId = "user1", UserName = "User One", Rating = 4 }
        };
        _mockReviewRepository.Setup(repo => repo.GetByUserIdAsync("user1")).ReturnsAsync(reviews);

        // Act
        var result = await _controller.GetReviewsByUserId("user1");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedReviews = Assert.IsAssignableFrom<IEnumerable<BookReviewDto>>(okResult.Value);
        Assert.Equal(2, returnedReviews.Count());
    }

    [Fact]
    public async Task GetBookReviewStats_ReturnsOkResult_WithCorrectStats()
    {
        // Arrange
        var book = new Book { Id = 1, Title = "Test Book" };
        _mockBookRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(book);
        _mockReviewRepository.Setup(repo => repo.GetAverageRatingAsync(1)).ReturnsAsync(4.5);
        _mockReviewRepository.Setup(repo => repo.GetReviewCountAsync(1)).ReturnsAsync(10);

        // Act
        var result = await _controller.GetBookReviewStats(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var stats = Assert.IsType<BookReviewStatsDto>(okResult.Value);
        Assert.Equal(1, stats.BookId);
        Assert.Equal(4.5, stats.AverageRating);
        Assert.Equal(10, stats.TotalReviews);
    }

    [Fact]
    public async Task GetBookReviewStats_ReturnsNotFound_WhenBookDoesNotExist()
    {
        // Arrange
        _mockBookRepository.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Book?)null);

        // Act
        var result = await _controller.GetBookReviewStats(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateReview_ReturnsCreatedAtAction_WhenValidReview()
    {
        // Arrange
        var book = new Book { Id = 1, Title = "Test Book" };
        var createDto = new BookReviewCreateDto
        {
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 5,
            ReviewText = "Excellent book!"
        };
        var createdReview = new BookReview
        {
            Id = 1,
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 5,
            ReviewText = "Excellent book!"
        };

        _mockBookRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(book);
        _mockReviewRepository.Setup(repo => repo.GetByBookAndUserAsync(1, "user1")).ReturnsAsync((BookReview?)null);
        _mockReviewRepository.Setup(repo => repo.CreateAsync(It.IsAny<BookReview>())).ReturnsAsync(createdReview);

        // Act
        var result = await _controller.CreateReview(createDto);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnedReview = Assert.IsType<BookReviewDto>(createdAtActionResult.Value);
        Assert.Equal(5, returnedReview.Rating);
        Assert.Equal("User One", returnedReview.UserName);
    }

    [Fact]
    public async Task CreateReview_ReturnsBadRequest_WhenRatingIsInvalid()
    {
        // Arrange
        var createDto = new BookReviewCreateDto
        {
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 6, // Invalid rating
            ReviewText = "Test"
        };

        // Act
        var result = await _controller.CreateReview(createDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateReview_ReturnsNotFound_WhenBookDoesNotExist()
    {
        // Arrange
        var createDto = new BookReviewCreateDto
        {
            BookId = 999,
            UserId = "user1",
            UserName = "User One",
            Rating = 5
        };
        _mockBookRepository.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Book?)null);

        // Act
        var result = await _controller.CreateReview(createDto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateReview_ReturnsConflict_WhenUserAlreadyReviewed()
    {
        // Arrange
        var book = new Book { Id = 1, Title = "Test Book" };
        var existingReview = new BookReview { Id = 1, BookId = 1, UserId = "user1", Rating = 4 };
        var createDto = new BookReviewCreateDto
        {
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 5
        };

        _mockBookRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(book);
        _mockReviewRepository.Setup(repo => repo.GetByBookAndUserAsync(1, "user1")).ReturnsAsync(existingReview);

        // Act
        var result = await _controller.CreateReview(createDto);

        // Assert
        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateReview_ReturnsOkResult_WhenValidUpdate()
    {
        // Arrange
        var existingReview = new BookReview
        {
            Id = 1,
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 4,
            ReviewText = "Good"
        };
        var updateDto = new BookReviewUpdateDto
        {
            Rating = 5,
            ReviewText = "Excellent!"
        };
        var updatedReview = new BookReview
        {
            Id = 1,
            BookId = 1,
            UserId = "user1",
            UserName = "User One",
            Rating = 5,
            ReviewText = "Excellent!"
        };

        _mockReviewRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingReview);
        _mockReviewRepository.Setup(repo => repo.UpdateAsync(It.IsAny<BookReview>())).ReturnsAsync(updatedReview);

        // Act
        var result = await _controller.UpdateReview(1, updateDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedReview = Assert.IsType<BookReviewDto>(okResult.Value);
        Assert.Equal(5, returnedReview.Rating);
        Assert.Equal("Excellent!", returnedReview.ReviewText);
    }

    [Fact]
    public async Task UpdateReview_ReturnsBadRequest_WhenRatingIsInvalid()
    {
        // Arrange
        var updateDto = new BookReviewUpdateDto
        {
            Rating = 0, // Invalid rating
            ReviewText = "Test"
        };

        // Act
        var result = await _controller.UpdateReview(1, updateDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateReview_ReturnsNotFound_WhenReviewDoesNotExist()
    {
        // Arrange
        var updateDto = new BookReviewUpdateDto { Rating = 5 };
        _mockReviewRepository.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((BookReview?)null);

        // Act
        var result = await _controller.UpdateReview(999, updateDto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task DeleteReview_ReturnsNoContent_WhenSuccessful()
    {
        // Arrange
        _mockReviewRepository.Setup(repo => repo.DeleteAsync(1)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteReview(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteReview_ReturnsNotFound_WhenReviewDoesNotExist()
    {
        // Arrange
        _mockReviewRepository.Setup(repo => repo.DeleteAsync(999)).ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteReview(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
