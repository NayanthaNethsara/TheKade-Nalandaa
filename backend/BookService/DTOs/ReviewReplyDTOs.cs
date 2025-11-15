using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookService.DTOs
{
    /// <summary>
    /// Data Transfer Object for creating a new review reply
    /// Contains all necessary information for reply submission
    /// </summary>
    public class CreateReviewReplyDto
    {
        /// <summary>
        /// ID of the review being replied to
        /// </summary>
        [Required(ErrorMessage = "Review ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Review ID must be a positive number")]
        public int ReviewId { get; set; }

        /// <summary>
        /// ID of the parent reply (for threaded conversations)
        /// Null if this is a direct reply to the review
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "Parent reply ID must be a positive number")]
        public int? ParentReplyId { get; set; }

        /// <summary>
        /// Content of the reply
        /// </summary>
        [Required(ErrorMessage = "Reply content is required")]
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
    }

    /// <summary>
    /// Data Transfer Object for updating an existing review reply
    /// Contains updatable fields for reply modification
    /// </summary>
    public class UpdateReviewReplyDto
    {
        /// <summary>
        /// Content of the reply
        /// </summary>
        [StringLength(2000, MinimumLength = 5, ErrorMessage = "Reply content must be between 5 and 2000 characters")]
        public string? ReplyContent { get; set; }

        /// <summary>
        /// Type of reply (comment, question, correction, etc.)
        /// </summary>
        [StringLength(50, ErrorMessage = "Reply type cannot exceed 50 characters")]
        public string? ReplyType { get; set; }

        /// <summary>
        /// Tone of the reply (positive, neutral, negative, constructive)
        /// </summary>
        [StringLength(20, ErrorMessage = "Reply tone cannot exceed 20 characters")]
        public string? ReplyTone { get; set; }

        /// <summary>
        /// Indicates if this reply contains spoilers
        /// </summary>
        public bool? ContainsSpoilers { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for review reply response
    /// Contains comprehensive reply information for API responses
    /// </summary>
    public class ReviewReplyResponseDto
    {
        /// <summary>
        /// Unique identifier for the reply
        /// </summary>
        public int ReplyId { get; set; }

        /// <summary>
        /// ID of the review being replied to
        /// </summary>
        public int ReviewId { get; set; }

        /// <summary>
        /// ID of the user who wrote the reply
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Username of the replier
        /// </summary>
        public string? Username { get; set; }

        /// <summary>
        /// Display name of the replier
        /// </summary>
        public string? ReplierDisplayName { get; set; }

        /// <summary>
        /// Avatar URL of the replier
        /// </summary>
        public string? ReplierAvatarUrl { get; set; }

        /// <summary>
        /// Indicates if the replier is verified
        /// </summary>
        public bool IsVerifiedReplier { get; set; }

        /// <summary>
        /// ID of the parent reply (for threaded conversations)
        /// </summary>
        public int? ParentReplyId { get; set; }

        /// <summary>
        /// Content of the reply
        /// </summary>
        public string ReplyContent { get; set; } = string.Empty;

        /// <summary>
        /// Truncated reply content for preview
        /// </summary>
        public string PreviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Type of reply (comment, question, correction, etc.)
        /// </summary>
        public string ReplyType { get; set; } = "comment";

        /// <summary>
        /// Reply type display text
        /// </summary>
        public string ReplyTypeDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Tone of the reply (positive, neutral, negative, constructive)
        /// </summary>
        public string ReplyTone { get; set; } = "neutral";

        /// <summary>
        /// Reply tone display text
        /// </summary>
        public string ReplyToneDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Language in which the reply is written
        /// </summary>
        public string ReplyLanguage { get; set; } = "en";

        /// <summary>
        /// Indicates if this reply contains spoilers
        /// </summary>
        public bool ContainsSpoilers { get; set; }

        /// <summary>
        /// Indicates if this reply is from the book author
        /// </summary>
        public bool IsAuthorReply { get; set; }

        /// <summary>
        /// Indicates if this reply is from a verified reviewer
        /// </summary>
        public bool IsVerifiedReply { get; set; }

        /// <summary>
        /// Indicates if this reply has been pinned by moderators
        /// </summary>
        public bool IsPinned { get; set; }

        /// <summary>
        /// Indicates if this reply has been featured/highlighted
        /// </summary>
        public bool IsFeatured { get; set; }

        /// <summary>
        /// Number of likes received by this reply
        /// </summary>
        public int LikeCount { get; set; }

        /// <summary>
        /// Number of dislikes received by this reply
        /// </summary>
        public int DislikeCount { get; set; }

        /// <summary>
        /// Total number of reactions (likes + dislikes)
        /// </summary>
        public int TotalReactions { get; set; }

        /// <summary>
        /// Like ratio (likes / total reactions)
        /// </summary>
        public double LikeRatio { get; set; }

        /// <summary>
        /// Quality score calculated by the system (0-100)
        /// </summary>
        public int QualityScore { get; set; }

        /// <summary>
        /// Sentiment analysis score (-1 to 1)
        /// </summary>
        public double SentimentScore { get; set; }

        /// <summary>
        /// Depth level in the reply thread (0 for direct replies to review)
        /// </summary>
        public int ThreadDepth { get; set; }

        /// <summary>
        /// Word count of the reply content
        /// </summary>
        public int WordCount { get; set; }

        /// <summary>
        /// Reading time estimate in seconds
        /// </summary>
        public int EstimatedReadingTime { get; set; }

        /// <summary>
        /// Reply age in days
        /// </summary>
        public int AgeInDays { get; set; }

        /// <summary>
        /// Indicates if this is a recent reply (less than 7 days old)
        /// </summary>
        public bool IsRecent { get; set; }

        /// <summary>
        /// Indicates if this is a top-level reply (direct reply to review)
        /// </summary>
        public bool IsTopLevel { get; set; }

        /// <summary>
        /// Number of child replies
        /// </summary>
        public int ChildReplyCount { get; set; }

        /// <summary>
        /// Indicates if this reply has child replies
        /// </summary>
        public bool HasChildReplies { get; set; }

        /// <summary>
        /// Indicates if the reply has been edited
        /// </summary>
        public bool IsEdited { get; set; }

        /// <summary>
        /// Reply status for display purposes
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Thread depth indicator for display
        /// </summary>
        public string ThreadIndent { get; set; } = string.Empty;

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        public string FormattedCreatedDate { get; set; } = string.Empty;

        /// <summary>
        /// Formatted last updated date for display
        /// </summary>
        public string? FormattedUpdatedDate { get; set; }

        /// <summary>
        /// Formatted edited date for display
        /// </summary>
        public string? FormattedEditedDate { get; set; }

        /// <summary>
        /// Timestamp when the reply was created
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Timestamp when the reply was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Timestamp when the reply was last edited
        /// </summary>
        public DateTime? EditedAt { get; set; }

        /// <summary>
        /// List of child replies (if included)
        /// </summary>
        public List<ReviewReplyResponseDto>? ChildReplies { get; set; }

        /// <summary>
        /// List of reactions on this reply (if included)
        /// </summary>
        public List<ReplyReactionResponseDto>? Reactions { get; set; }

        /// <summary>
        /// Parent reply information (if this is a nested reply)
        /// </summary>
        public ReviewReplySummaryDto? ParentReply { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for review reply summary/preview
    /// Contains minimal reply information for lists and previews
    /// </summary>
    public class ReviewReplySummaryDto
    {
        /// <summary>
        /// Unique identifier for the reply
        /// </summary>
        public int ReplyId { get; set; }

        /// <summary>
        /// ID of the review being replied to
        /// </summary>
        public int ReviewId { get; set; }

        /// <summary>
        /// Username of the replier
        /// </summary>
        public string? Username { get; set; }

        /// <summary>
        /// Display name of the replier
        /// </summary>
        public string? ReplierDisplayName { get; set; }

        /// <summary>
        /// Truncated reply content for preview
        /// </summary>
        public string PreviewContent { get; set; } = string.Empty;

        /// <summary>
        /// Type of reply display text
        /// </summary>
        public string ReplyTypeDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if this reply is from the book author
        /// </summary>
        public bool IsAuthorReply { get; set; }

        /// <summary>
        /// Indicates if this reply has been pinned by moderators
        /// </summary>
        public bool IsPinned { get; set; }

        /// <summary>
        /// Number of likes received by this reply
        /// </summary>
        public int LikeCount { get; set; }

        /// <summary>
        /// Number of child replies
        /// </summary>
        public int ChildReplyCount { get; set; }

        /// <summary>
        /// Depth level in the reply thread
        /// </summary>
        public int ThreadDepth { get; set; }

        /// <summary>
        /// Reply age in days
        /// </summary>
        public int AgeInDays { get; set; }

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        public string FormattedCreatedDate { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp when the reply was created
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for reply reaction
    /// Contains information about reactions to replies
    /// </summary>
    public class CreateReplyReactionDto
    {
        /// <summary>
        /// ID of the reply being reacted to
        /// </summary>
        [Required(ErrorMessage = "Reply ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Reply ID must be a positive number")]
        public int ReplyId { get; set; }

        /// <summary>
        /// Type of reaction (like, dislike, love, laugh, etc.)
        /// </summary>
        [Required(ErrorMessage = "Reaction type is required")]
        [StringLength(20, ErrorMessage = "Reaction type cannot exceed 20 characters")]
        public string ReactionType { get; set; } = string.Empty;

        /// <summary>
        /// Intensity of the reaction (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Reaction intensity must be between 1 and 5")]
        public int ReactionIntensity { get; set; } = 3;

        /// <summary>
        /// Optional comment explaining the reaction
        /// </summary>
        [StringLength(200, ErrorMessage = "Reaction comment cannot exceed 200 characters")]
        public string? ReactionComment { get; set; }

        /// <summary>
        /// Context in which the reaction was made
        /// </summary>
        [StringLength(50, ErrorMessage = "Reaction context cannot exceed 50 characters")]
        public string? ReactionContext { get; set; }

        /// <summary>
        /// Indicates if this reaction is anonymous
        /// </summary>
        public bool IsAnonymous { get; set; } = false;
    }

    /// <summary>
    /// Data Transfer Object for reply reaction response
    /// Contains comprehensive reaction information for API responses
    /// </summary>
    public class ReplyReactionResponseDto
    {
        /// <summary>
        /// Unique identifier for the reaction
        /// </summary>
        public int ReactionId { get; set; }

        /// <summary>
        /// ID of the reply being reacted to
        /// </summary>
        public int ReplyId { get; set; }

        /// <summary>
        /// ID of the user who made the reaction
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Username of the reactor (null if anonymous)
        /// </summary>
        public string? Username { get; set; }

        /// <summary>
        /// Display name of the reactor (null if anonymous)
        /// </summary>
        public string? ReactorDisplayName { get; set; }

        /// <summary>
        /// Type of reaction (like, dislike, love, laugh, etc.)
        /// </summary>
        public string ReactionType { get; set; } = string.Empty;

        /// <summary>
        /// Reaction type display text
        /// </summary>
        public string ReactionTypeDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Emoji representation of the reaction
        /// </summary>
        public string ReactionEmojiDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Intensity of the reaction (1-5)
        /// </summary>
        public int ReactionIntensity { get; set; }

        /// <summary>
        /// Intensity level display text
        /// </summary>
        public string IntensityDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Optional comment explaining the reaction
        /// </summary>
        public string? ReactionComment { get; set; }

        /// <summary>
        /// Context in which the reaction was made
        /// </summary>
        public string? ReactionContext { get; set; }

        /// <summary>
        /// Sentiment value of the reaction (-1 to 1)
        /// </summary>
        public double SentimentValue { get; set; }

        /// <summary>
        /// Sentiment display text
        /// </summary>
        public string SentimentDisplay { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if this reaction is anonymous
        /// </summary>
        public bool IsAnonymous { get; set; }

        /// <summary>
        /// Indicates if this reaction is from a premium user
        /// </summary>
        public bool IsPremiumReaction { get; set; }

        /// <summary>
        /// Indicates if this reaction has been verified as legitimate
        /// </summary>
        public bool IsVerified { get; set; }

        /// <summary>
        /// Quality score calculated by the system (0-100)
        /// </summary>
        public int QualityScore { get; set; }

        /// <summary>
        /// Engagement score for this reaction (0-100)
        /// </summary>
        public int EngagementScore { get; set; }

        /// <summary>
        /// Reaction age in days
        /// </summary>
        public int AgeInDays { get; set; }

        /// <summary>
        /// Indicates if this is a recent reaction (less than 24 hours old)
        /// </summary>
        public bool IsRecent { get; set; }

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        public string FormattedCreatedDate { get; set; } = string.Empty;

        /// <summary>
        /// Time since reaction was created (human readable)
        /// </summary>
        public string TimeAgo { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp when the reaction was created
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for reply report
    /// Contains information for reporting inappropriate replies
    /// </summary>
    public class CreateReplyReportDto
    {
        /// <summary>
        /// ID of the reply being reported
        /// </summary>
        [Required(ErrorMessage = "Reply ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Reply ID must be a positive number")]
        public int ReplyId { get; set; }

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

        /// <summary>
        /// Indicates if this report involves harassment
        /// </summary>
        public bool InvolvesHarassment { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves cyberbullying
        /// </summary>
        public bool InvolvesCyberbullying { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves hate speech
        /// </summary>
        public bool InvolvesHateSpeech { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves violence or threats
        /// </summary>
        public bool InvolvesViolence { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves adult content
        /// </summary>
        public bool InvolvesAdultContent { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves illegal activity
        /// </summary>
        public bool InvolvesIllegalActivity { get; set; } = false;
    }

    /// <summary>
    /// Data Transfer Object for reply search and filtering
    /// Contains parameters for searching and filtering replies
    /// </summary>
    public class ReplySearchDto
    {
        /// <summary>
        /// ID of the review to filter replies for
        /// </summary>
        public int? ReviewId { get; set; }

        /// <summary>
        /// ID of the user to filter replies for
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// ID of the parent reply to filter child replies for
        /// </summary>
        public int? ParentReplyId { get; set; }

        /// <summary>
        /// Reply type to filter by
        /// </summary>
        [StringLength(50, ErrorMessage = "Reply type cannot exceed 50 characters")]
        public string? ReplyType { get; set; }

        /// <summary>
        /// Reply tone to filter by
        /// </summary>
        [StringLength(20, ErrorMessage = "Reply tone cannot exceed 20 characters")]
        public string? ReplyTone { get; set; }

        /// <summary>
        /// Filter by spoiler content
        /// </summary>
        public bool? ContainsSpoilers { get; set; }

        /// <summary>
        /// Filter by author replies
        /// </summary>
        public bool? IsAuthorReply { get; set; }

        /// <summary>
        /// Filter by verified replies
        /// </summary>
        public bool? IsVerifiedReply { get; set; }

        /// <summary>
        /// Filter by pinned status
        /// </summary>
        public bool? IsPinned { get; set; }

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
        /// Minimum like count to filter by
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Like count must be non-negative")]
        public int? MinLikeCount { get; set; }

        /// <summary>
        /// Maximum thread depth to filter by
        /// </summary>
        [Range(0, 10, ErrorMessage = "Thread depth must be between 0 and 10")]
        public int? MaxThreadDepth { get; set; }

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
        /// Search query for reply content
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
        public string SortDirection { get; set; } = "asc";

        /// <summary>
        /// Page number for pagination
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be positive")]
        public int Page { get; set; } = 1;

        /// <summary>
        /// Page size for pagination
        /// </summary>
        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 20;

        /// <summary>
        /// Include child replies in the response
        /// </summary>
        public bool IncludeChildReplies { get; set; } = true;

        /// <summary>
        /// Include reactions in the response
        /// </summary>
        public bool IncludeReactions { get; set; } = false;

        /// <summary>
        /// Include user information in the response
        /// </summary>
        public bool IncludeUser { get; set; } = true;

        /// <summary>
        /// Maximum depth for nested replies
        /// </summary>
        [Range(0, 5, ErrorMessage = "Nested depth must be between 0 and 5")]
        public int MaxNestedDepth { get; set; } = 3;
    }

    /// <summary>
    /// Data Transfer Object for paginated reply results
    /// Contains paginated list of replies with metadata
    /// </summary>
    public class PaginatedRepliesDto
    {
        /// <summary>
        /// List of replies for the current page
        /// </summary>
        public List<ReviewReplyResponseDto> Replies { get; set; } = new();

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
        /// Total number of replies matching the criteria
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
        /// Thread structure information
        /// </summary>
        public ReplyThreadInfoDto? ThreadInfo { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for reply thread information
    /// Contains metadata about the reply thread structure
    /// </summary>
    public class ReplyThreadInfoDto
    {
        /// <summary>
        /// ID of the root review
        /// </summary>
        public int ReviewId { get; set; }

        /// <summary>
        /// Total number of replies in the thread
        /// </summary>
        public int TotalReplies { get; set; }

        /// <summary>
        /// Number of top-level replies (direct replies to review)
        /// </summary>
        public int TopLevelReplies { get; set; }

        /// <summary>
        /// Number of nested replies (replies to replies)
        /// </summary>
        public int NestedReplies { get; set; }

        /// <summary>
        /// Maximum thread depth in the conversation
        /// </summary>
        public int MaxThreadDepth { get; set; }

        /// <summary>
        /// Number of unique participants in the thread
        /// </summary>
        public int UniqueParticipants { get; set; }

        /// <summary>
        /// Number of author replies in the thread
        /// </summary>
        public int AuthorReplies { get; set; }

        /// <summary>
        /// Number of pinned replies in the thread
        /// </summary>
        public int PinnedReplies { get; set; }

        /// <summary>
        /// Total number of reactions across all replies
        /// </summary>
        public int TotalReactions { get; set; }

        /// <summary>
        /// Most recent reply timestamp
        /// </summary>
        public DateTime? MostRecentReplyDate { get; set; }

        /// <summary>
        /// Thread activity level (low, medium, high)
        /// </summary>
        public string ActivityLevel { get; set; } = "low";

        /// <summary>
        /// Average quality score of replies in the thread
        /// </summary>
        public double AverageQualityScore { get; set; }

        /// <summary>
        /// Thread sentiment analysis (-1 to 1)
        /// </summary>
        public double ThreadSentiment { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for bulk reply operations
    /// Contains information for performing operations on multiple replies
    /// </summary>
    public class BulkReplyOperationDto
    {
        /// <summary>
        /// List of reply IDs to operate on
        /// </summary>
        [Required(ErrorMessage = "Reply IDs are required")]
        [MinLength(1, ErrorMessage = "At least one reply ID is required")]
        public List<int> ReplyIds { get; set; } = new();

        /// <summary>
        /// Operation to perform (delete, hide, pin, unpin, feature, unfeature)
        /// </summary>
        [Required(ErrorMessage = "Operation is required")]
        [StringLength(20, ErrorMessage = "Operation cannot exceed 20 characters")]
        public string Operation { get; set; } = string.Empty;

        /// <summary>
        /// Reason for the operation
        /// </summary>
        [StringLength(200, ErrorMessage = "Reason cannot exceed 200 characters")]
        public string? Reason { get; set; }

        /// <summary>
        /// Additional parameters for the operation (stored as JSON)
        /// </summary>
        public string? Parameters { get; set; }

        /// <summary>
        /// Indicates if the operation should be performed immediately
        /// </summary>
        public bool ExecuteImmediately { get; set; } = true;

        /// <summary>
        /// Scheduled execution time (if not immediate)
        /// </summary>
        public DateTime? ScheduledAt { get; set; }
    }

    /// <summary>
    /// Data Transfer Object for bulk operation result
    /// Contains results of bulk operations on replies
    /// </summary>
    public class BulkReplyOperationResultDto
    {
        /// <summary>
        /// Total number of replies processed
        /// </summary>
        public int TotalProcessed { get; set; }

        /// <summary>
        /// Number of successful operations
        /// </summary>
        public int SuccessCount { get; set; }

        /// <summary>
        /// Number of failed operations
        /// </summary>
        public int FailureCount { get; set; }

        /// <summary>
        /// List of successfully processed reply IDs
        /// </summary>
        public List<int> SuccessfulReplyIds { get; set; } = new();

        /// <summary>
        /// List of failed reply IDs with error messages
        /// </summary>
        public Dictionary<int, string> FailedReplies { get; set; } = new();

        /// <summary>
        /// Overall operation status
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Operation execution time in milliseconds
        /// </summary>
        public long ExecutionTimeMs { get; set; }

        /// <summary>
        /// Additional operation details
        /// </summary>
        public string? Details { get; set; }
    }
}