using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookService.DTOs
{
    /// <summary>
    /// Data Transfer Object for creating a new book review
    /// Contains all necessary information for review submission
    /// </summary>
    public class CreateReviewDto
    {
        /// <summary>
        /// ID of the book being reviewed
        /// </summary>
        [Required(ErrorMessage = "Book ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Book ID must be a positive number")]
        public int BookId { get; set; }

        /// <summary>
        /// Overall rating score from 1-5 stars
        /// </summary>
        [Required(ErrorMessage = "Overall rating is required")]
        [Range(1, 5, ErrorMessage = "Overall rating must be between 1 and 5 stars")]
        public int OverallRating { get; set; }

        /// <summary>
        /// Detailed rating for story/plot quality (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Story rating must be between 1 and 5 stars")]
        public int? StoryRating { get; set; }

        /// <summary>
        /// Detailed rating for character development (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Character rating must be between 1 and 5 stars")]
        public int? CharacterRating { get; set; }

        /// <summary>
        /// Detailed rating for writing style and prose (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Writing style rating must be between 1 and 5 stars")]
        public int? WritingStyleRating { get; set; }

        /// <summary>
        /// Detailed rating for pacing and flow (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Pacing rating must be between 1 and 5 stars")]
        public int? PacingRating { get; set; }

        /// <summary>
        /// Detailed rating for world building (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "World building rating must be between 1 and 5 stars")]
        public int? WorldBuildingRating { get; set; }

        /// <summary>
        /// Main review title/headline
        /// </summary>
        [Required(ErrorMessage = "Review title is required")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Review title must be between 5 and 200 characters")]
        public string ReviewTitle { get; set; } = string.Empty;

        /// <summary>
        /// Detailed review content/body
        /// </summary>
        [Required(ErrorMessage = "Review content is required")]
        [StringLength(5000, MinimumLength = 20, ErrorMessage = "Review content must be between 20 and 5000 characters")]
        public string ReviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Brief summary of the review (optional)
        /// </summary>
        [StringLength(500, ErrorMessage = "Review summary cannot exceed 500 characters")]
        public string? ReviewSummary { get; set; }

        /// <summary>
        /// Indicates if the review contains spoilers
        /// </summary>
        public bool ContainsSpoilers { get; set; } = false;

        /// <summary>
        /// Indicates if the reviewer recommends this book
        /// </summary>
        public bool IsRecommended { get; set; } = true;

        /// <summary>
        /// Target audience for the book
        /// </summary>
        [StringLength(100, ErrorMessage = "Target audience cannot exceed 100 characters")]
        public string? TargetAudience { get; set; }

        /// <summary>
        /// Reading difficulty level (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Reading difficulty must be between 1 and 5")]
        public int? ReadingDifficulty { get; set; }

        /// <summary>
        /// Emotional impact rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Emotional impact must be between 1 and 5")]
        public int? EmotionalImpact { get; set; }

        /// <summary>
        /// Educational value rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Educational value must be between 1 and 5")]
        public int? EducationalValue { get; set; }

        /// <summary>
        /// Entertainment value rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Entertainment value must be between 1 and 5")]
        public int? EntertainmentValue { get; set; }

        /// <summary>
        /// Originality rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Originality rating must be between 1 and 5")]
        public int? OriginalityRating { get; set; }

        /// <summary>
        /// List of positive aspects mentioned in the review
        /// </summary>
        public string? PositiveAspects { get; set; }

        /// <summary>
        /// List of negative aspects mentioned in the review
        /// </summary>
        public string? NegativeAspects { get; set; }

        /// <summary>
        /// Favorite quotes or passages from the book
        /// </summary>
        [StringLength(1000, ErrorMessage = "Favorite quotes cannot exceed 1000 characters")]
        public string? FavoriteQuotes { get; set; }

        /// <summary>
        /// Similar books or authors recommended by the reviewer
        /// </summary>
        [StringLength(500, ErrorMessage = "Similar recommendations cannot exceed 500 characters")]
        public string? SimilarRecommendations { get; set; }

        /// <summary>
        /// Tags associated with the review for categorization
        /// </summary>
        public string? ReviewTags { get; set; }

        /// <summary>
        /// Language in which the review is written
        /// </summary>
        [StringLength(10, ErrorMessage = "Language code cannot exceed 10 characters")]
        public string ReviewLanguage { get; set; } = "en";

        /// <summary>
        /// Indicates if this is a verified purchase review
        /// </summary>
        public bool IsVerifiedPurchase { get; set; } = false;
    }

    /// <summary>
    /// Data Transfer Object for updating an existing book review
    /// Contains updatable fields for review modification
    /// </summary>
    public class UpdateReviewDto
    {
        /// <summary>
        /// Overall rating score from 1-5 stars
        /// </summary>
        [Range(1, 5, ErrorMessage = "Overall rating must be between 1 and 5 stars")]
        public int? OverallRating { get; set; }

        /// <summary>
        /// Detailed rating for story/plot quality (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Story rating must be between 1 and 5 stars")]
        public int? StoryRating { get; set; }

        /// <summary>
        /// Detailed rating for character development (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Character rating must be between 1 and 5 stars")]
        public int? CharacterRating { get; set; }

        /// <summary>
        /// Detailed rating for writing style and prose (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Writing style rating must be between 1 and 5 stars")]
        public int? WritingStyleRating { get; set; }

        /// <summary>
        /// Detailed rating for pacing and flow (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Pacing rating must be between 1 and 5 stars")]
        public int? PacingRating { get; set; }

        /// <summary>
        /// Detailed rating for world building (1-5 stars)
        /// </summary>
        [Range(1, 5, ErrorMessage = "World building rating must be between 1 and 5 stars")]
        public int? WorldBuildingRating { get; set; }

        /// <summary>
        /// Main review title/headline
        /// </summary>
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Review title must be between 5 and 200 characters")]
        public string? ReviewTitle { get; set; }

        /// <summary>
        /// Detailed review content/body
        /// </summary>
        [StringLength(5000, MinimumLength = 20, ErrorMessage = "Review content must be between 20 and 5000 characters")]
        public string? ReviewContent { get; set; }

        /// <summary>
        /// Brief summary of the review
        /// </summary>
        [StringLength(500, ErrorMessage = "Review summary cannot exceed 500 characters")]
        public string? ReviewSummary { get; set; }

        /// <summary>
        /// Indicates if the review contains spoilers
        /// </summary>
        public bool? ContainsSpoilers { get; set; }

        /// <summary>
        /// Indicates if the reviewer recommends this book
        /// </summary>
        public bool? IsRecommended { get; set; }

        /// <summary>
        /// Target audience for the book
        /// </summary>
        [StringLength(100, ErrorMessage = "Target audience cannot exceed 100 characters")]
        public string? TargetAudience { get; set; }

        /// <summary>
        /// Reading difficulty level (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Reading difficulty must be between 1 and 5")]
        public int? ReadingDifficulty { get; set; }

        /// <summary>
        /// Emotional impact rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Emotional impact must be between 1 and 5")]
        public int? EmotionalImpact { get; set; }

        /// <summary>
        /// Educational value rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Educational value must be between 1 and 5")]
        public int? EducationalValue { get; set; }

        /// <summary>
        /// Entertainment value rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Entertainment value must be between 1 and 5")]
        public int? EntertainmentValue { get; set; }

        /// <summary>
        /// Originality rating (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Originality rating must be between 1 and 5")]
        public int? OriginalityRating { get; set; }

        /// <summary>
        /// List of positive aspects mentioned in the review
        /// </summary>
        public string? PositiveAspects { get; set; }

        /// <summary>
        /// List of negative aspects mentioned in the review
        /// </summary>
        public string? NegativeAspects { get; set; }

        /// <summary>
        /// Favorite quotes or passages from the book
        /// </summary>
        [StringLength(1000, ErrorMessage = "Favorite quotes cannot exceed 1000 characters")]
        public string? FavoriteQuotes { get; set; }

        /// <summary>
        /// Similar books or authors recommended by the reviewer
        /// </summary>
        [StringLength(500, ErrorMessage = "Similar recommendations cannot exceed 500 characters")]
        public string? SimilarRecommendations { get; set; }

        /// <summary>
        /// Tags associated with the review for categorization
        /// </summary>
        public string? ReviewTags { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for review response
    /// Contains comprehensive review information for API responses
    /// </summary>
    public class ReviewResponseDto
    {
        /// <summary>
        /// Unique identifier for the review
        /// </summary>
        public int ReviewId { get; set; }

        /// <summary>
        /// ID of the book being reviewed
        /// </summary>
        public int BookId { get; set; }

        /// <summary>
        /// ID of the user who wrote the review
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Username of the reviewer
        /// </summary>
        public string? Username { get; set; }

        /// <summary>
        /// Display name of the reviewer
        /// </summary>
        public string? ReviewerDisplayName { get; set; }

        /// <summary>
        /// Avatar URL of the reviewer
        /// </summary>
        public string? ReviewerAvatarUrl { get; set; }

        /// <summary>
        /// Indicates if the reviewer is verified
        /// </summary>
        public bool IsVerifiedReviewer { get; set; }

        /// <summary>
        /// Overall rating score from 1-5 stars
        /// </summary>
        public int OverallRating { get; set; }

        /// <summary>
        /// Detailed rating for story/plot quality (1-5 stars)
        /// </summary>
        public int? StoryRating { get; set; }

        /// <summary>
        /// Detailed rating for character development (1-5 stars)
        /// </summary>
        public int? CharacterRating { get; set; }

        /// <summary>
        /// Detailed rating for writing style and prose (1-5 stars)
        /// </summary>
        public int? WritingStyleRating { get; set; }

        /// <summary>
        /// Detailed rating for pacing and flow (1-5 stars)
        /// </summary>
        public int? PacingRating { get; set; }

        /// <summary>
        /// Detailed rating for world building (1-5 stars)
        /// </summary>
        public int? WorldBuildingRating { get; set; }

        /// <summary>
        /// Average of all detailed ratings
        /// </summary>
        public double AverageDetailedRating { get; set; }

        /// <summary>
        /// Main review title/headline
        /// </summary>
        public string ReviewTitle { get; set; } = string.Empty;

        /// <summary>
        /// Detailed review content/body
        /// </summary>
        public string ReviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Brief summary of the review
        /// </summary>
        public string? ReviewSummary { get; set; }

        /// <summary>
        /// Truncated review content for preview
        /// </summary>
        public string PreviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if the review contains spoilers
        /// </summary>
        public bool ContainsSpoilers { get; set; }

        /// <summary>
        /// Indicates if the reviewer recommends this book
        /// </summary>
        public bool IsRecommended { get; set; }

        /// <summary>
        /// Target audience for the book
        /// </summary>
        public string? TargetAudience { get; set; }

        /// <summary>
        /// Reading difficulty level (1-5)
        /// </summary>
        public int? ReadingDifficulty { get; set; }

        /// <summary>
        /// Emotional impact rating (1-5)
        /// </summary>
        public int? EmotionalImpact { get; set; }

        /// <summary>
        /// Educational value rating (1-5)
        /// </summary>
        public int? EducationalValue { get; set; }

        /// <summary>
        /// Entertainment value rating (1-5)
        /// </summary>
        public int? EntertainmentValue { get; set; }

        /// <summary>
        /// Originality rating (1-5)
        /// </summary>
        public int? OriginalityRating { get; set; }

        /// <summary>
        /// List of positive aspects mentioned in the review
        /// </summary>
        public string? PositiveAspects { get; set; }

        /// <summary>
        /// List of negative aspects mentioned in the review
        /// </summary>
        public string? NegativeAspects { get; set; }

        /// <summary>
        /// Favorite quotes or passages from the book
        /// </summary>
        public string? FavoriteQuotes { get; set; }

        /// <summary>
        /// Similar books or authors recommended by the reviewer
        /// </summary>
        public string? SimilarRecommendations { get; set; }

        /// <summary>
        /// Tags associated with the review for categorization
        /// </summary>
        public string? ReviewTags { get; set; }

        /// <summary>
        /// Language in which the review is written
        /// </summary>
        public string ReviewLanguage { get; set; } = "en";

        /// <summary>
        /// Indicates if this is a verified purchase review
        /// </summary>
        public bool IsVerifiedPurchase { get; set; }

        /// <summary>
        /// Number of helpful votes received by this review
        /// </summary>
        public int HelpfulVotes { get; set; }

        /// <summary>
        /// Number of unhelpful votes received by this review
        /// </summary>
        public int UnhelpfulVotes { get; set; }

        /// <summary>
        /// Total number of votes (helpful + unhelpful)
        /// </summary>
        public int TotalVotes { get; set; }

        /// <summary>
        /// Helpfulness ratio (helpful votes / total votes)
        /// </summary>
        public double HelpfulnessRatio { get; set; }

        /// <summary>
        /// Number of replies/comments on this review
        /// </summary>
        public int ReplyCount { get; set; }

        /// <summary>
        /// Indicates if the review has been featured/highlighted
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        /// Quality score calculated by the system (0-100)
        /// </summary>
        public int QualityScore { get; set; }

        /// <summary>
        /// Sentiment analysis score (-1 to 1)
        /// </summary>
        public double SentimentScore { get; set; }

        /// <summary>
        /// Word count of the review content
        /// </summary>
        public int WordCount { get; set; }

        /// <summary>
        /// Reading time estimate in minutes
        /// </summary>
        public int EstimatedReadingTime { get; set; }

        /// <summary>
        /// Review age in days
        /// </summary>
        public int AgeInDays { get; set; }

        /// <summary>
        /// Indicates if this is a recent review (less than 30 days old)
        /// </summary>
        public bool IsRecent { get; set; }

        /// <summary>
        /// Indicates if this is a detailed review (has detailed ratings)
        /// </summary>
        public bool IsDetailedReview { get; set; }

        /// <summary>
        /// Indicates if this is a high-quality review
        /// </summary>
        public bool IsHighQuality { get; set; }

        /// <summary>
        /// Review status for display purposes
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Star rating display (e.g., "★★★★☆")
        /// </summary>
        public string StarDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        public string FormattedCreatedDate { get; set; } = string.Empty;

        /// <summary>
        /// Formatted last updated date for display
        /// </summary>
        public string? FormattedUpdatedDate { get; set; }

        /// <summary>
        /// Timestamp when the review was created
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Timestamp when the review was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// List of review replies (if included)
        /// </summary>
        public List<ReviewReplyResponseDto>? Replies { get; set; }

        /// <summary>
        /// Book information (if included)
        /// </summary>
        public BookSummaryDto? Book { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for review summary/preview
    /// Contains minimal review information for lists and previews
    /// </summary>
    public class ReviewSummaryDto
    {
        /// <summary>
        /// Unique identifier for the review
        /// </summary>
        public int ReviewId { get; set; }

        /// <summary>
        /// ID of the book being reviewed
        /// </summary>
        public int BookId { get; set; }

        /// <summary>
        /// Username of the reviewer
        /// </summary>
        public string? Username { get; set; }

        /// <summary>
        /// Display name of the reviewer
        /// </summary>
        public string? ReviewerDisplayName { get; set; }

        /// <summary>
        /// Overall rating score from 1-5 stars
        /// </summary>
        public int OverallRating { get; set; }

        /// <summary>
        /// Main review title/headline
        /// </summary>
        public string ReviewTitle { get; set; } = string.Empty;

        /// <summary>
        /// Truncated review content for preview
        /// </summary>
        public string PreviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if the review contains spoilers
        /// </summary>
        public bool ContainsSpoilers { get; set; }

        /// <summary>
        /// Indicates if the reviewer recommends this book
        /// </summary>
        public bool IsRecommended { get; set; }

        /// <summary>
        /// Number of helpful votes received by this review
        /// </summary>
        public int HelpfulVotes { get; set; }

        /// <summary>
        /// Number of replies/comments on this review
        /// </summary>
        public int ReplyCount { get; set; }

        /// <summary>
        /// Indicates if the review has been featured/highlighted
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        /// Quality score calculated by the system (0-100)
        /// </summary>
        public int QualityScore { get; set; }

        /// <summary>
        /// Word count of the review content
        /// </summary>
        public int WordCount { get; set; }

        /// <summary>
        /// Review age in days
        /// </summary>
        public int AgeInDays { get; set; }

        /// <summary>
        /// Star rating display (e.g., "★★★★☆")
        /// </summary>
        public string StarDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        public string FormattedCreatedDate { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp when the review was created
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for review statistics
    /// Contains aggregated statistics for a book's reviews
    /// </summary>
    public class ReviewStatisticsDto
    {
        /// <summary>
        /// ID of the book
        /// </summary>
        public int BookId { get; set; }

        /// <summary>
        /// Total number of reviews
        /// </summary>
        public int TotalReviews { get; set; }

        /// <summary>
        /// Average overall rating
        /// </summary>
        public double AverageRating { get; set; }

        /// <summary>
        /// Average story rating
        /// </summary>
        public double? AverageStoryRating { get; set; }

        /// <summary>
        /// Average character rating
        /// </summary>
        public double? AverageCharacterRating { get; set; }

        /// <summary>
        /// Average writing style rating
        /// </summary>
        public double? AverageWritingStyleRating { get; set; }

        /// <summary>
        /// Average pacing rating
        /// </summary>
        public double? AveragePacingRating { get; set; }

        /// <summary>
        /// Average world building rating
        /// </summary>
        public double? AverageWorldBuildingRating { get; set; }

        /// <summary>
        /// Number of 5-star reviews
        /// </summary>
        public int FiveStarCount { get; set; }

        /// <summary>
        /// Number of 4-star reviews
        /// </summary>
        public int FourStarCount { get; set; }

        /// <summary>
        /// Number of 3-star reviews
        /// </summary>
        public int ThreeStarCount { get; set; }

        /// <summary>
        /// Number of 2-star reviews
        /// </summary>
        public int TwoStarCount { get; set; }

        /// <summary>
        /// Number of 1-star reviews
        /// </summary>
        public int OneStarCount { get; set; }

        /// <summary>
        /// Percentage of reviewers who recommend this book
        /// </summary>
        public double RecommendationPercentage { get; set; }

        /// <summary>
        /// Number of verified purchase reviews
        /// </summary>
        public int VerifiedPurchaseCount { get; set; }

        /// <summary>
        /// Number of reviews with spoilers
        /// </summary>
        public int SpoilerReviewCount { get; set; }

        /// <summary>
        /// Number of featured reviews
        /// </summary>
        public int FeaturedReviewCount { get; set; }

        /// <summary>
        /// Average quality score of reviews
        /// </summary>
        public double AverageQualityScore { get; set; }

        /// <summary>
        /// Average word count of reviews
        /// </summary>
        public double AverageWordCount { get; set; }

        /// <summary>
        /// Total number of helpful votes across all reviews
        /// </summary>
        public int TotalHelpfulVotes { get; set; }

        /// <summary>
        /// Total number of replies across all reviews
        /// </summary>
        public int TotalReplies { get; set; }

        /// <summary>
        /// Most recent review date
        /// </summary>
        public DateTime? MostRecentReviewDate { get; set; }

        /// <summary>
        /// Rating distribution as percentages
        /// </summary>
        public Dictionary<int, double> RatingDistribution { get; set; } = new();

        /// <summary>
        /// Most common tags across all reviews
        /// </summary>
        public List<string> PopularTags { get; set; } = new();

        /// <summary>
        /// Most mentioned positive aspects
        /// </summary>
        public List<string> TopPositiveAspects { get; set; } = new();

        /// <summary>
        /// Most mentioned negative aspects
        /// </summary>
        public List<string> TopNegativeAspects { get; set; } = new();
    }

    /// <summary>
    /// Data Transfer Object for review vote
    /// Contains information about voting on reviews
    /// </summary>
    public class ReviewVoteDto
    {
        /// <summary>
        /// ID of the review being voted on
        /// </summary>
        [Required(ErrorMessage = "Review ID is required")]
        public int ReviewId { get; set; }

        /// <summary>
        /// Type of vote: true for helpful, false for unhelpful
        /// </summary>
        [Required(ErrorMessage = "Vote type is required")]
        public bool IsHelpful { get; set; }

        /// <summary>
        /// Optional comment explaining the vote
        /// </summary>
        [StringLength(500, ErrorMessage = "Vote comment cannot exceed 500 characters")]
        public string? VoteComment { get; set; }

        /// <summary>
        /// Confidence level of the vote (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Vote confidence must be between 1 and 5")]
        public int VoteConfidence { get; set; } = 3;

        /// <summary>
        /// Reason category for the vote
        /// </summary>
        [StringLength(50, ErrorMessage = "Vote reason cannot exceed 50 characters")]
        public string? VoteReason { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for review report
    /// Contains information for reporting inappropriate reviews
    /// </summary>
    public class ReviewReportDto
    {
        /// <summary>
        /// ID of the review being reported
        /// </summary>
        [Required(ErrorMessage = "Review ID is required")]
        public int ReviewId { get; set; }

        /// <summary>
        /// Category of the report
        /// </summary>
        [Required(ErrorMessage = "Report category is required")]
        [StringLength(50, ErrorMessage = "Report category cannot exceed 50 characters")]
        public string ReportCategory { get; set; } = string.Empty;

        /// <summary>
        /// Specific reason for the report
        /// </summary>
        [Required(ErrorMessage = "Report reason is required")]
        [StringLength(100, ErrorMessage = "Report reason cannot exceed 100 characters")]
        public string ReportReason { get; set; } = string.Empty;

        /// <summary>
        /// Detailed description of the issue
        /// </summary>
        [StringLength(1000, ErrorMessage = "Report description cannot exceed 1000 characters")]
        public string? ReportDescription { get; set; }

        /// <summary>
        /// Severity level of the report (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Report severity must be between 1 and 5")]
        public int ReportSeverity { get; set; } = 3;

        /// <summary>
        /// Evidence or supporting information for the report
        /// </summary>
        [StringLength(2000, ErrorMessage = "Report evidence cannot exceed 2000 characters")]
        public string? ReportEvidence { get; set; }

        /// <summary>
        /// Indicates if the report is anonymous
        /// </summary>
        public bool IsAnonymous { get; set; } = false;

        /// <summary>
        /// Indicates if the reporter wants to be notified of resolution
        /// </summary>
        public bool WantsNotification { get; set; } = true;
    }

    /// <summary>
    /// Data Transfer Object for review search and filtering
    /// Contains parameters for searching and filtering reviews
    /// </summary>
    public class ReviewSearchDto
    {
        /// <summary>
        /// ID of the book to filter reviews for
        /// </summary>
        public int? BookId { get; set; }

        /// <summary>
        /// ID of the user to filter reviews for
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// Minimum rating to filter by
        /// </summary>
        [Range(1, 5, ErrorMessage = "Minimum rating must be between 1 and 5")]
        public int? MinRating { get; set; }

        /// <summary>
        /// Maximum rating to filter by
        /// </summary>
        [Range(1, 5, ErrorMessage = "Maximum rating must be between 1 and 5")]
        public int? MaxRating { get; set; }

        /// <summary>
        /// Filter by recommendation status
        /// </summary>
        public bool? IsRecommended { get; set; }

        /// <summary>
        /// Filter by spoiler content
        /// </summary>
        public bool? ContainsSpoilers { get; set; }

        /// <summary>
        /// Filter by verified purchase status
        /// </summary>
        public bool? IsVerifiedPurchase { get; set; }

        /// <summary>
        /// Filter by featured status
        /// </summary>
        public bool? IsFeatured { get; set; }

        /// <summary>
        /// Minimum quality score to filter by
        /// </summary>
        [Range(0, 100, ErrorMessage = "Quality score must be between 0 and 100")]
        public int? MinQualityScore { get; set; }

        /// <summary>
        /// Minimum word count to filter by
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Word count must be non-negative")]
        public int? MinWordCount { get; set; }

        /// <summary>
        /// Maximum age in days to filter by
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Age in days must be non-negative")]
        public int? MaxAgeInDays { get; set; }

        /// <summary>
        /// Language to filter by
        /// </summary>
        [StringLength(10, ErrorMessage = "Language code cannot exceed 10 characters")]
        public string? Language { get; set; }

        /// <summary>
        /// Tags to filter by (comma-separated)
        /// </summary>
        public string? Tags { get; set; }

        /// <summary>
        /// Search query for review content
        /// </summary>
        [StringLength(200, ErrorMessage = "Search query cannot exceed 200 characters")]
        public string? SearchQuery { get; set; }

        /// <summary>
        /// Sort field for ordering results
        /// </summary>
        public string SortBy { get; set; } = "CreatedAt";

        /// <summary>
        /// Sort direction (asc or desc)
        /// </summary>
        public string SortDirection { get; set; } = "desc";

        /// <summary>
        /// Page number for pagination
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be positive")]
        public int Page { get; set; } = 1;

        /// <summary>
        /// Page size for pagination
        /// </summary>
        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 10;

        /// <summary>
        /// Include replies in the response
        /// </summary>
        public bool IncludeReplies { get; set; } = false;

        /// <summary>
        /// Include book information in the response
        /// </summary>
        public bool IncludeBook { get; set; } = false;

        /// <summary>
        /// Include user information in the response
        /// </summary>
        public bool IncludeUser { get; set; } = true;
    }

    /// <summary>
    /// Data Transfer Object for paginated review results
    /// Contains paginated list of reviews with metadata
    /// </summary>
    public class PaginatedReviewsDto
    {
        /// <summary>
        /// List of reviews for the current page
        /// </summary>
        public List<ReviewResponseDto> Reviews { get; set; } = new();

        /// <summary>
        /// Current page number
        /// </summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// Total number of pages
        /// </summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// Page size used for pagination
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Total number of reviews matching the criteria
        /// </summary>
        public int TotalCount { get; set; }

        /// <summary>
        /// Indicates if there is a previous page
        /// </summary>
        public bool HasPreviousPage { get; set; }

        /// <summary>
        /// Indicates if there is a next page
        /// </summary>
        public bool HasNextPage { get; set; }

        /// <summary>
        /// Review statistics for the filtered results
        /// </summary>
        public ReviewStatisticsDto? Statistics { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for book summary information
    /// Used in review responses to provide book context
    /// </summary>
    public class BookSummaryDto
    {
        /// <summary>
        /// Unique identifier for the book
        /// </summary>
        public int BookId { get; set; }

        /// <summary>
        /// Title of the book
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Author of the book
        /// </summary>
        public string Author { get; set; } = string.Empty;

        /// <summary>
        /// Cover image URL of the book
        /// </summary>
        public string? CoverImageUrl { get; set; }

        /// <summary>
        /// Publication date of the book
        /// </summary>
        public DateTime? PublicationDate { get; set; }

        /// <summary>
        /// Genre of the book
        /// </summary>
        public string? Genre { get; set; }

        /// <summary>
        /// Average rating of the book
        /// </summary>
        public double AverageRating { get; set; }

        /// <summary>
        /// Total number of reviews for the book
        /// </summary>
        public int ReviewCount { get; set; }
    }
}