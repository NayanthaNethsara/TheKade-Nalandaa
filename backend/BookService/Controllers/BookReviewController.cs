using BookService.DTOs;
using BookService.Models;
using BookService.Repositories;
using BookService.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BookService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookReviewController : ControllerBase
{
    private readonly IBookReviewRepository _reviewRepository;
    private readonly IBookRepository _bookRepository;

    public BookReviewController(
        IBookReviewRepository reviewRepository,
        IBookRepository bookRepository)
    {
        _reviewRepository = reviewRepository;
        _bookRepository = bookRepository;
    }

    /// <summary>
    /// Get all reviews
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookReviewDto>>> GetAllReviews()
    {
        var reviews = await _reviewRepository.GetAllAsync();
        var reviewDtos = reviews.Select(MapToDto);
        return Ok(reviewDtos);
    }

    /// <summary>
    /// Get review by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<BookReviewDto>> GetReviewById(int id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
            return NotFound(new { message = "Review not found" });

        return Ok(MapToDto(review));
    }

    /// <summary>
    /// Get all reviews for a specific book
    /// </summary>
    [HttpGet("book/{bookId}")]
    public async Task<ActionResult<IEnumerable<BookReviewDto>>> GetReviewsByBookId(int bookId)
    {
        // Check if book exists
        var book = await _bookRepository.GetByIdAsync(bookId);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        var reviews = await _reviewRepository.GetByBookIdAsync(bookId);
        var reviewDtos = reviews.Select(MapToDto);
        return Ok(reviewDtos);
    }

    /// <summary>
    /// Get all reviews by a specific user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<BookReviewDto>>> GetReviewsByUserId(string userId)
    {
        var reviews = await _reviewRepository.GetByUserIdAsync(userId);
        var reviewDtos = reviews.Select(MapToDto);
        return Ok(reviewDtos);
    }

    /// <summary>
    /// Get review statistics for a book
    /// </summary>
    [HttpGet("book/{bookId}/stats")]
    public async Task<ActionResult<BookReviewStatsDto>> GetBookReviewStats(int bookId)
    {
        // Check if book exists
        var book = await _bookRepository.GetByIdAsync(bookId);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        var averageRating = await _reviewRepository.GetAverageRatingAsync(bookId);
        var totalReviews = await _reviewRepository.GetReviewCountAsync(bookId);

        return Ok(new BookReviewStatsDto
        {
            BookId = bookId,
            AverageRating = Math.Round(averageRating, 2),
            TotalReviews = totalReviews
        });
    }

    /// <summary>
    /// Create a new review
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<BookReviewDto>> CreateReview([FromBody] BookReviewCreateDto createDto)
    {
        // Validate rating
        if (createDto.Rating < 1 || createDto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        // Check if book exists
        var book = await _bookRepository.GetByIdAsync(createDto.BookId);
        if (book == null)
            return NotFound(new { message = "Book not found" });

        // Check if user already reviewed this book
        var existingReview = await _reviewRepository.GetByBookAndUserAsync(createDto.BookId, createDto.UserId);
        if (existingReview != null)
            return Conflict(new { message = "User has already reviewed this book" });

        var review = new BookReview
        {
            BookId = createDto.BookId,
            UserId = createDto.UserId,
            UserName = createDto.UserName,
            Rating = createDto.Rating,
            ReviewText = createDto.ReviewText
        };

        var createdReview = await _reviewRepository.CreateAsync(review);
        return CreatedAtAction(
            nameof(GetReviewById),
            new { id = createdReview.Id },
            MapToDto(createdReview));
    }

    /// <summary>
    /// Update an existing review
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<BookReviewDto>> UpdateReview(int id, [FromBody] BookReviewUpdateDto updateDto)
    {
        // Validate rating
        if (updateDto.Rating < 1 || updateDto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        var existingReview = await _reviewRepository.GetByIdAsync(id);
        if (existingReview == null)
            return NotFound(new { message = "Review not found" });

        existingReview.Rating = updateDto.Rating;
        existingReview.ReviewText = updateDto.ReviewText;

        var updatedReview = await _reviewRepository.UpdateAsync(existingReview);
        if (updatedReview == null)
            return NotFound(new { message = "Failed to update review" });

        return Ok(MapToDto(updatedReview));
    }

    /// <summary>
    /// Delete a review
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteReview(int id)
    {
        var success = await _reviewRepository.DeleteAsync(id);
        if (!success)
            return NotFound(new { message = "Review not found" });

        return NoContent();
    }

    private static BookReviewDto MapToDto(BookReview review)
    {
        return new BookReviewDto
        {
            Id = review.Id,
            BookId = review.BookId,
            UserId = review.UserId,
            UserName = review.UserName,
            Rating = review.Rating,
            ReviewText = review.ReviewText,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };
    }
}
