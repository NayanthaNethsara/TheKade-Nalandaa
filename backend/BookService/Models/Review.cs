using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents a comprehensive book review entity with detailed metadata
    /// Supports multi-dimensional rating system and advanced review analytics
    /// </summary>
    [Table("Reviews")]
    public class Review
    {
        /// <summary>
        /// Primary key for the review entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewId { get; set; }

        /// <summary>
        /// Foreign key reference to the book being reviewed
        /// </summary>
        [Required]
        [ForeignKey("Book")]
        public int BookId { get; set; }

        /// <summary>
        /// Foreign key reference to the user who wrote the review
        /// </summary>
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        /// <summary>
        /// Overall rating score from 1-5 stars
        /// </summary>
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars")]
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
        [Required]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Review title must be between 5 and 200 characters")]
        public string ReviewTitle { get; set; } = string.Empty;

        /// <summary>
        /// Detailed review content/body
        /// </summary>
        [Required]
        [StringLength(5000, MinimumLength = 20, ErrorMessage = "Review content must be between 20 and 5000 characters")]
        public string ReviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Brief summary of the review (for preview purposes)
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
        /// Target audience for the book (e.g., "Young Adults", "Mystery Lovers")
        /// </summary>
        [StringLength(100, ErrorMessage = "Target audience cannot exceed 100 characters")]
        public string? TargetAudience { get; set; }

        /// <summary>
        /// Reading difficulty level (1-5, where 1 is easy and 5 is very difficult)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Reading difficulty must be between 1 and 5")]
        public int? ReadingDifficulty { get; set; }

        /// <summary>
        /// Emotional impact rating (1-5, where 1 is low impact and 5 is high impact)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Emotional impact must be between 1 and 5")]
        public int? EmotionalImpact { get; set; }

        /// <summary>
        /// Educational value rating (1-5, where 1 is low value and 5 is high value)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Educational value must be between 1 and 5")]
        public int? EducationalValue { get; set; }

        /// <summary>
        /// Entertainment value rating (1-5, where 1 is low entertainment and 5 is high entertainment)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Entertainment value must be between 1 and 5")]
        public int? EntertainmentValue { get; set; }

        /// <summary>
        /// Originality rating (1-5, where 1 is not original and 5 is highly original)
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

        /// <summary>
        /// Number of helpful votes received by this review
        /// </summary>
        public int HelpfulVotes { get; set; } = 0;

        /// <summary>
        /// Number of unhelpful votes received by this review
        /// </summary>
        public int UnhelpfulVotes { get; set; } = 0;

        /// <summary>
        /// Total number of votes (helpful + unhelpful)
        /// </summary>
        public int TotalVotes => HelpfulVotes + UnhelpfulVotes;

        /// <summary>
        /// Helpfulness ratio (helpful votes / total votes)
        /// </summary>
        public double HelpfulnessRatio => TotalVotes > 0 ? (double)HelpfulVotes / TotalVotes : 0.0;

        /// <summary>
        /// Number of replies/comments on this review
        /// </summary>
        public int ReplyCount { get; set; } = 0;

        /// <summary>
        /// Number of times this review has been reported
        /// </summary>
        public int ReportCount { get; set; } = 0;

        /// <summary>
        /// Indicates if the review has been flagged for moderation
        /// </summary>
        public bool IsFlagged { get; set; } = false;

        /// <summary>
        /// Indicates if the review has been approved by moderators
        /// </summary>
        public bool IsApproved { get; set; } = true;

        /// <summary>
        /// Indicates if the review is currently visible to users
        /// </summary>
        public bool IsVisible { get; set; } = true;

        /// <summary>
        /// Indicates if the review has been featured/highlighted
        /// </summary>
        public bool IsFeatured { get; set; } = false;

        /// <summary>
        /// Priority score for review ordering (higher = more prominent)
        /// </summary>
        public int Priority { get; set; } = 0;

        /// <summary>
        /// Quality score calculated by the system (0-100)
        /// </summary>
        public int QualityScore { get; set; } = 0;

        /// <summary>
        /// Sentiment analysis score (-1 to 1, where -1 is negative, 0 is neutral, 1 is positive)
        /// </summary>
        public double SentimentScore { get; set; } = 0.0;

        /// <summary>
        /// Reading time estimate in minutes
        /// </summary>
        public int EstimatedReadingTime { get; set; } = 0;

        /// <summary>
        /// Word count of the review content
        /// </summary>
        public int WordCount { get; set; } = 0;

        /// <summary>
        /// Character count of the review content
        /// </summary>
        public int CharacterCount { get; set; } = 0;

        /// <summary>
        /// IP address from which the review was submitted (for security/analytics)
        /// </summary>
        [StringLength(45, ErrorMessage = "IP address cannot exceed 45 characters")]
        public string? SubmissionIpAddress { get; set; }

        /// <summary>
        /// User agent string from the submission (for analytics)
        /// </summary>
        [StringLength(500, ErrorMessage = "User agent cannot exceed 500 characters")]
        public string? SubmissionUserAgent { get; set; }

        /// <summary>
        /// Platform from which the review was submitted (web, mobile app, etc.)
        /// </summary>
        [StringLength(50, ErrorMessage = "Submission platform cannot exceed 50 characters")]
        public string? SubmissionPlatform { get; set; }

        /// <summary>
        /// Version of the app/platform used for submission
        /// </summary>
        [StringLength(20, ErrorMessage = "Platform version cannot exceed 20 characters")]
        public string? PlatformVersion { get; set; }

        /// <summary>
        /// Timestamp when the review was created
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Timestamp when the review was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Timestamp when the review was last moderated
        /// </summary>
        public DateTime? ModeratedAt { get; set; }

        /// <summary>
        /// Timestamp when the review was featured (if applicable)
        /// </summary>
        public DateTime? FeaturedAt { get; set; }

        /// <summary>
        /// User ID of the moderator who last reviewed this review
        /// </summary>
        public int? ModeratedBy { get; set; }

        /// <summary>
        /// Additional metadata stored as JSON
        /// </summary>
        public string? Metadata { get; set; }

        /// <summary>
        /// Version number for optimistic concurrency control
        /// </summary>
        [Timestamp]
        public byte[]? RowVersion { get; set; }

        // Navigation properties
        /// <summary>
        /// Navigation property to the associated book
        /// </summary>
        [JsonIgnore]
        public virtual Book? Book { get; set; }

        /// <summary>
        /// Navigation property to the user who wrote the review
        /// </summary>
        [JsonIgnore]
        public virtual User? User { get; set; }

        /// <summary>
        /// Navigation property to review votes
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReviewVote> ReviewVotes { get; set; } = new List<ReviewVote>();

        /// <summary>
        /// Navigation property to review replies/comments
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReviewReply> ReviewReplies { get; set; } = new List<ReviewReply>();

        /// <summary>
        /// Navigation property to review reports
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReviewReport> ReviewReports { get; set; } = new List<ReviewReport>();

        /// <summary>
        /// Navigation property to review analytics data
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReviewAnalytics> ReviewAnalytics { get; set; } = new List<ReviewAnalytics>();

        // Computed properties for API responses
        /// <summary>
        /// Average of all detailed ratings (excluding null values)
        /// </summary>
        [NotMapped]
        public double AverageDetailedRating
        {
            get
            {
                var ratings = new List<int?> { StoryRating, CharacterRating, WritingStyleRating, PacingRating, WorldBuildingRating }
                    .Where(r => r.HasValue)
                    .Select(r => r.Value)
                    .ToList();

                return ratings.Any() ? ratings.Average() : OverallRating;
            }
        }

        /// <summary>
        /// Indicates if this is a detailed review (has detailed ratings)
        /// </summary>
        [NotMapped]
        public bool IsDetailedReview => StoryRating.HasValue || CharacterRating.HasValue || 
                                       WritingStyleRating.HasValue || PacingRating.HasValue || 
                                       WorldBuildingRating.HasValue;

        /// <summary>
        /// Review age in days
        /// </summary>
        [NotMapped]
        public int AgeInDays => (DateTime.UtcNow - CreatedAt).Days;

        /// <summary>
        /// Indicates if this is a recent review (less than 30 days old)
        /// </summary>
        [NotMapped]
        public bool IsRecent => AgeInDays <= 30;

        /// <summary>
        /// Indicates if this is a high-quality review based on various factors
        /// </summary>
        [NotMapped]
        public bool IsHighQuality => QualityScore >= 70 && WordCount >= 100 && HelpfulnessRatio >= 0.6;

        /// <summary>
        /// Review status for display purposes
        /// </summary>
        [NotMapped]
        public string Status
        {
            get
            {
                if (!IsApproved) return "Pending Approval";
                if (IsFlagged) return "Flagged";
                if (!IsVisible) return "Hidden";
                if (IsFeatured) return "Featured";
                return "Published";
            }
        }

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        [NotMapped]
        public string FormattedCreatedDate => CreatedAt.ToString("MMM dd, yyyy");

        /// <summary>
        /// Formatted last updated date for display
        /// </summary>
        [NotMapped]
        public string? FormattedUpdatedDate => UpdatedAt?.ToString("MMM dd, yyyy");

        /// <summary>
        /// Star rating display (e.g., "★★★★☆")
        /// </summary>
        [NotMapped]
        public string StarDisplay => new string('★', OverallRating) + new string('☆', 5 - OverallRating);

        /// <summary>
        /// Truncated review content for preview (first 150 characters)
        /// </summary>
        [NotMapped]
        public string PreviewContent => ReviewContent.Length > 150 
            ? ReviewContent.Substring(0, 150) + "..." 
            : ReviewContent;

        /// <summary>
        /// Validates the review data
        /// </summary>
        /// <returns>List of validation errors</returns>
        public List<string> Validate()
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(ReviewTitle))
                errors.Add("Review title is required");

            if (string.IsNullOrWhiteSpace(ReviewContent))
                errors.Add("Review content is required");

            if (OverallRating < 1 || OverallRating > 5)
                errors.Add("Overall rating must be between 1 and 5");

            if (ReviewContent?.Length > 5000)
                errors.Add("Review content cannot exceed 5000 characters");

            if (ReviewTitle?.Length > 200)
                errors.Add("Review title cannot exceed 200 characters");

            return errors;
        }

        /// <summary>
        /// Calculates and updates the quality score based on various factors
        /// </summary>
        public void CalculateQualityScore()
        {
            var score = 0;

            // Length factor (0-25 points)
            if (WordCount >= 200) score += 25;
            else if (WordCount >= 100) score += 15;
            else if (WordCount >= 50) score += 10;
            else if (WordCount >= 20) score += 5;

            // Detailed ratings factor (0-20 points)
            if (IsDetailedReview) score += 20;

            // Helpfulness factor (0-25 points)
            if (TotalVotes > 0)
            {
                score += (int)(HelpfulnessRatio * 25);
            }

            // Engagement factor (0-15 points)
            if (ReplyCount > 5) score += 15;
            else if (ReplyCount > 2) score += 10;
            else if (ReplyCount > 0) score += 5;

            // Completeness factor (0-15 points)
            var completenessScore = 0;
            if (!string.IsNullOrWhiteSpace(ReviewSummary)) completenessScore += 3;
            if (!string.IsNullOrWhiteSpace(PositiveAspects)) completenessScore += 3;
            if (!string.IsNullOrWhiteSpace(NegativeAspects)) completenessScore += 3;
            if (!string.IsNullOrWhiteSpace(TargetAudience)) completenessScore += 3;
            if (!string.IsNullOrWhiteSpace(SimilarRecommendations)) completenessScore += 3;
            score += completenessScore;

            QualityScore = Math.Min(100, score);
        }

        /// <summary>
        /// Updates the word and character counts
        /// </summary>
        public void UpdateCounts()
        {
            if (!string.IsNullOrWhiteSpace(ReviewContent))
            {
                WordCount = ReviewContent.Split(new char[] { ' ', '\t', '\n', '\r' }, 
                    StringSplitOptions.RemoveEmptyEntries).Length;
                CharacterCount = ReviewContent.Length;
                EstimatedReadingTime = Math.Max(1, WordCount / 200); // Assuming 200 words per minute
            }
        }

        /// <summary>
        /// Prepares the review for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            UpdateCounts();
            CalculateQualityScore();
            
            if (UpdatedAt == null && CreatedAt != default)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            // Generate summary if not provided
            if (string.IsNullOrWhiteSpace(ReviewSummary) && !string.IsNullOrWhiteSpace(ReviewContent))
            {
                ReviewSummary = ReviewContent.Length > 200 
                    ? ReviewContent.Substring(0, 200) + "..."
                    : ReviewContent;
            }
        }
    }
}