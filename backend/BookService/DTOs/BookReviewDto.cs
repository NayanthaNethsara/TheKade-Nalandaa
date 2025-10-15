namespace BookService.DTOs;

public class BookReviewDto
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? ReviewText { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class BookReviewCreateDto
{
    public int BookId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? ReviewText { get; set; }
}

public class BookReviewUpdateDto
{
    public int Rating { get; set; }
    public string? ReviewText { get; set; }
}

public class BookReviewStatsDto
{
    public int BookId { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
}
