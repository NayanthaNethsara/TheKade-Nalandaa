using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents a reply or comment on a book review
    /// Enables threaded discussions and community engagement
    /// </summary>
    [Table("ReviewReplies")]
    public class ReviewReply
    {
        /// <summary>
        /// Primary key for the review reply entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReplyId { get; set; }

        /// <summary>
        /// Foreign key reference to the review being replied to
        /// </summary>
        [Required]
        [ForeignKey("Review")]
        public int ReviewId { get; set; }

        /// <summary>
        /// Foreign key reference to the user who wrote the reply
        /// </summary>
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        /// <summary>
        /// Foreign key reference to the parent reply (for threaded conversations)
        /// Null if this is a direct reply to the review
        /// </summary>
        [ForeignKey("ParentReply")]
        public int? ParentReplyId { get; set; }

        /// <summary>
        /// Content of the reply
        /// </summary>
        [Required]
        [StringLength(2000, MinimumLength = 5, ErrorMessage = "Reply content must be between 5 and 2000 characters")]
        public string ReplyContent { get; set; } = string.Empty;

        /// <summary>
        /// Type of reply (comment, question, correction, etc.)
        /// </summary>
        [StringLength(50, ErrorMessage = "Reply type cannot exceed 50 characters")]
        public string ReplyType { get; set; } = "comment";

        /// <summary>
        /// Tone of the reply (positive, neutral, negative, constructive)
        /// </summary>
        [StringLength(20, ErrorMessage = "Reply tone cannot exceed 20 characters")]
        public string ReplyTone { get; set; } = "neutral";

        /// <summary>
        /// Language in which the reply is written
        /// </summary>
        [StringLength(10, ErrorMessage = "Language code cannot exceed 10 characters")]
        public string ReplyLanguage { get; set; } = "en";

        /// <summary>
        /// Indicates if this reply contains spoilers
        /// </summary>
        public bool ContainsSpoilers { get; set; } = false;

        /// <summary>
        /// Indicates if this reply is from the book author
        /// </summary>
        public bool IsAuthorReply { get; set; } = false;

        /// <summary>
        /// Indicates if this reply is from a verified reviewer
        /// </summary>
        public bool IsVerifiedReply { get; set; } = false;

        /// <summary>
        /// Indicates if this reply has been pinned by moderators
        /// </summary>
        public bool IsPinned { get; set; } = false;

        /// <summary>
        /// Indicates if this reply has been featured/highlighted
        /// </summary>
        public bool IsFeatured { get; set; } = false;

        /// <summary>
        /// Number of likes received by this reply
        /// </summary>
        public int LikeCount { get; set; } = 0;

        /// <summary>
        /// Number of dislikes received by this reply
        /// </summary>
        public int DislikeCount { get; set; } = 0;

        /// <summary>
        /// Total number of reactions (likes + dislikes)
        /// </summary>
        public int TotalReactions => LikeCount + DislikeCount;

        /// <summary>
        /// Like ratio (likes / total reactions)
        /// </summary>
        public double LikeRatio => TotalReactions > 0 ? (double)LikeCount / TotalReactions : 0.0;

        /// <summary>
        /// Number of times this reply has been reported
        /// </summary>
        public int ReportCount { get; set; } = 0;

        /// <summary>
        /// Indicates if the reply has been flagged for moderation
        /// </summary>
        public bool IsFlagged { get; set; } = false;

        /// <summary>
        /// Indicates if the reply has been approved by moderators
        /// </summary>
        public bool IsApproved { get; set; } = true;

        /// <summary>
        /// Indicates if the reply is currently visible to users
        /// </summary>
        public bool IsVisible { get; set; } = true;

        /// <summary>
        /// Indicates if the reply has been edited
        /// </summary>
        public bool IsEdited { get; set; } = false;

        /// <summary>
        /// Indicates if the reply has been deleted (soft delete)
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Priority score for reply ordering (higher = more prominent)
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
        /// Depth level in the reply thread (0 for direct replies to review)
        /// </summary>
        public int ThreadDepth { get; set; } = 0;

        /// <summary>
        /// Word count of the reply content
        /// </summary>
        public int WordCount { get; set; } = 0;

        /// <summary>
        /// Character count of the reply content
        /// </summary>
        public int CharacterCount { get; set; } = 0;

        /// <summary>
        /// Reading time estimate in seconds
        /// </summary>
        public int EstimatedReadingTime { get; set; } = 0;

        /// <summary>
        /// IP address from which the reply was submitted
        /// </summary>
        [StringLength(45, ErrorMessage = "IP address cannot exceed 45 characters")]
        public string? SubmissionIpAddress { get; set; }

        /// <summary>
        /// User agent string from the submission
        /// </summary>
        [StringLength(500, ErrorMessage = "User agent cannot exceed 500 characters")]
        public string? SubmissionUserAgent { get; set; }

        /// <summary>
        /// Platform from which the reply was submitted
        /// </summary>
        [StringLength(50, ErrorMessage = "Submission platform cannot exceed 50 characters")]
        public string? SubmissionPlatform { get; set; }

        /// <summary>
        /// Version of the app/platform used for submission
        /// </summary>
        [StringLength(20, ErrorMessage = "Platform version cannot exceed 20 characters")]
        public string? PlatformVersion { get; set; }

        /// <summary>
        /// Timestamp when the reply was created
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Timestamp when the reply was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Timestamp when the reply was last edited
        /// </summary>
        public DateTime? EditedAt { get; set; }

        /// <summary>
        /// Timestamp when the reply was deleted
        /// </summary>
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Timestamp when the reply was last moderated
        /// </summary>
        public DateTime? ModeratedAt { get; set; }

        /// <summary>
        /// User ID of the moderator who last reviewed this reply
        /// </summary>
        public int? ModeratedBy { get; set; }

        /// <summary>
        /// Reason for moderation action
        /// </summary>
        [StringLength(200, ErrorMessage = "Moderation reason cannot exceed 200 characters")]
        public string? ModerationReason { get; set; }

        /// <summary>
        /// Edit history stored as JSON
        /// </summary>
        public string? EditHistory { get; set; }

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
        /// Navigation property to the associated review
        /// </summary>
        [JsonIgnore]
        public virtual Review? Review { get; set; }

        /// <summary>
        /// Navigation property to the user who wrote the reply
        /// </summary>
        [JsonIgnore]
        public virtual User? User { get; set; }

        /// <summary>
        /// Navigation property to the parent reply (for threaded conversations)
        /// </summary>
        [JsonIgnore]
        public virtual ReviewReply? ParentReply { get; set; }

        /// <summary>
        /// Navigation property to child replies
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReviewReply> ChildReplies { get; set; } = new List<ReviewReply>();

        /// <summary>
        /// Navigation property to reply reactions/votes
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReplyReaction> ReplyReactions { get; set; } = new List<ReplyReaction>();

        /// <summary>
        /// Navigation property to reply reports
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReplyReport> ReplyReports { get; set; } = new List<ReplyReport>();

        // Computed properties
        /// <summary>
        /// Reply age in days
        /// </summary>
        [NotMapped]
        public int AgeInDays => (DateTime.UtcNow - CreatedAt).Days;

        /// <summary>
        /// Indicates if this is a recent reply (less than 7 days old)
        /// </summary>
        [NotMapped]
        public bool IsRecent => AgeInDays <= 7;

        /// <summary>
        /// Indicates if this is a top-level reply (direct reply to review)
        /// </summary>
        [NotMapped]
        public bool IsTopLevel => ParentReplyId == null;

        /// <summary>
        /// Number of child replies
        /// </summary>
        [NotMapped]
        public int ChildReplyCount => ChildReplies?.Count ?? 0;

        /// <summary>
        /// Indicates if this reply has child replies
        /// </summary>
        [NotMapped]
        public bool HasChildReplies => ChildReplyCount > 0;

        /// <summary>
        /// Reply status for display purposes
        /// </summary>
        [NotMapped]
        public string Status
        {
            get
            {
                if (IsDeleted) return "Deleted";
                if (!IsApproved) return "Pending Approval";
                if (IsFlagged) return "Flagged";
                if (!IsVisible) return "Hidden";
                if (IsPinned) return "Pinned";
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
        /// Formatted edited date for display
        /// </summary>
        [NotMapped]
        public string? FormattedEditedDate => EditedAt?.ToString("MMM dd, yyyy");

        /// <summary>
        /// Truncated reply content for preview (first 100 characters)
        /// </summary>
        [NotMapped]
        public string PreviewContent => ReplyContent.Length > 100 
            ? ReplyContent.Substring(0, 100) + "..." 
            : ReplyContent;

        /// <summary>
        /// Reply type display text
        /// </summary>
        [NotMapped]
        public string ReplyTypeDisplay => ReplyType switch
        {
            "comment" => "Comment",
            "question" => "Question",
            "correction" => "Correction",
            "appreciation" => "Appreciation",
            "criticism" => "Criticism",
            "suggestion" => "Suggestion",
            _ => "Comment"
        };

        /// <summary>
        /// Reply tone display text
        /// </summary>
        [NotMapped]
        public string ReplyToneDisplay => ReplyTone switch
        {
            "positive" => "Positive",
            "negative" => "Negative",
            "neutral" => "Neutral",
            "constructive" => "Constructive",
            "critical" => "Critical",
            _ => "Neutral"
        };

        /// <summary>
        /// Thread depth indicator for display
        /// </summary>
        [NotMapped]
        public string ThreadIndent => new string(' ', ThreadDepth * 4);

        /// <summary>
        /// Validates the reply data
        /// </summary>
        /// <returns>List of validation errors</returns>
        public List<string> Validate()
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(ReplyContent))
                errors.Add("Reply content is required");

            if (ReplyContent?.Length > 2000)
                errors.Add("Reply content cannot exceed 2000 characters");

            if (ReplyContent?.Length < 5)
                errors.Add("Reply content must be at least 5 characters");

            if (ReviewId <= 0)
                errors.Add("Valid review ID is required");

            if (UserId <= 0)
                errors.Add("Valid user ID is required");

            if (ThreadDepth > 10)
                errors.Add("Reply thread depth cannot exceed 10 levels");

            return errors;
        }

        /// <summary>
        /// Calculates and updates the quality score based on various factors
        /// </summary>
        public void CalculateQualityScore()
        {
            var score = 0;

            // Length factor (0-20 points)
            if (WordCount >= 50) score += 20;
            else if (WordCount >= 25) score += 15;
            else if (WordCount >= 10) score += 10;
            else if (WordCount >= 5) score += 5;

            // Engagement factor (0-30 points)
            if (TotalReactions > 0)
            {
                score += (int)(LikeRatio * 30);
            }

            // Thread participation factor (0-20 points)
            if (HasChildReplies)
            {
                score += Math.Min(20, ChildReplyCount * 5);
            }

            // Author/verified factor (0-15 points)
            if (IsAuthorReply) score += 15;
            else if (IsVerifiedReply) score += 10;

            // Moderation factor (0-15 points)
            if (IsPinned) score += 15;
            else if (IsFeatured) score += 10;
            else if (!IsFlagged && IsApproved) score += 5;

            QualityScore = Math.Min(100, score);
        }

        /// <summary>
        /// Updates the word and character counts
        /// </summary>
        public void UpdateCounts()
        {
            if (!string.IsNullOrWhiteSpace(ReplyContent))
            {
                WordCount = ReplyContent.Split(new char[] { ' ', '\t', '\n', '\r' }, 
                    StringSplitOptions.RemoveEmptyEntries).Length;
                CharacterCount = ReplyContent.Length;
                EstimatedReadingTime = Math.Max(5, WordCount * 60 / 200); // Assuming 200 words per minute, result in seconds
            }
        }

        /// <summary>
        /// Calculates the thread depth based on parent reply
        /// </summary>
        public void CalculateThreadDepth()
        {
            if (ParentReply != null)
            {
                ThreadDepth = ParentReply.ThreadDepth + 1;
            }
            else
            {
                ThreadDepth = 0;
            }
        }

        /// <summary>
        /// Prepares the reply for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            UpdateCounts();
            CalculateQualityScore();
            
            if (UpdatedAt == null && CreatedAt != default)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            // Trim whitespace from string properties
            ReplyContent = ReplyContent?.Trim();
            ReplyType = ReplyType?.Trim();
            ReplyTone = ReplyTone?.Trim();
            ModerationReason = ModerationReason?.Trim();
        }

        /// <summary>
        /// Marks the reply as edited
        /// </summary>
        public void MarkAsEdited()
        {
            IsEdited = true;
            EditedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Soft deletes the reply
        /// </summary>
        /// <param name="reason">Reason for deletion</param>
        public void SoftDelete(string? reason = null)
        {
            IsDeleted = true;
            IsVisible = false;
            DeletedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            
            if (!string.IsNullOrWhiteSpace(reason))
            {
                ModerationReason = reason;
            }
        }

        /// <summary>
        /// Restores a soft-deleted reply
        /// </summary>
        public void Restore()
        {
            IsDeleted = false;
            IsVisible = true;
            DeletedAt = null;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}