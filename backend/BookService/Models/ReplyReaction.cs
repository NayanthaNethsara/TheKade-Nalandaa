using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents a reaction (like, dislike, emoji) to a review reply
    /// Enables rich user engagement and sentiment tracking
    /// </summary>
    [Table("ReplyReactions")]
    public class ReplyReaction
    {
        /// <summary>
        /// Primary key for the reply reaction entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReactionId { get; set; }

        /// <summary>
        /// Foreign key reference to the reply being reacted to
        /// </summary>
        [Required]
        [ForeignKey("ReviewReply")]
        public int ReplyId { get; set; }

        /// <summary>
        /// Foreign key reference to the user who made the reaction
        /// </summary>
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        /// <summary>
        /// Type of reaction (like, dislike, love, laugh, angry, sad, etc.)
        /// </summary>
        [Required]
        [StringLength(20, ErrorMessage = "Reaction type cannot exceed 20 characters")]
        public string ReactionType { get; set; } = string.Empty;

        /// <summary>
        /// Emoji representation of the reaction
        /// </summary>
        [StringLength(10, ErrorMessage = "Reaction emoji cannot exceed 10 characters")]
        public string? ReactionEmoji { get; set; }

        /// <summary>
        /// Intensity of the reaction (1-5, where 5 is most intense)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Reaction intensity must be between 1 and 5")]
        public int ReactionIntensity { get; set; } = 3;

        /// <summary>
        /// Optional comment explaining the reaction
        /// </summary>
        [StringLength(200, ErrorMessage = "Reaction comment cannot exceed 200 characters")]
        public string? ReactionComment { get; set; }

        /// <summary>
        /// Context in which the reaction was made (reading, sharing, etc.)
        /// </summary>
        [StringLength(50, ErrorMessage = "Reaction context cannot exceed 50 characters")]
        public string? ReactionContext { get; set; }

        /// <summary>
        /// Sentiment value of the reaction (-1 to 1, where -1 is negative, 0 is neutral, 1 is positive)
        /// </summary>
        public double SentimentValue { get; set; } = 0.0;

        /// <summary>
        /// Weight of this reaction in calculations (default 1.0)
        /// </summary>
        public double ReactionWeight { get; set; } = 1.0;

        /// <summary>
        /// Indicates if this reaction is currently active/visible
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Indicates if this reaction has been verified as legitimate
        /// </summary>
        public bool IsVerified { get; set; } = true;

        /// <summary>
        /// Indicates if this reaction is from a premium user
        /// </summary>
        public bool IsPremiumReaction { get; set; } = false;

        /// <summary>
        /// Indicates if this reaction is anonymous
        /// </summary>
        public bool IsAnonymous { get; set; } = false;

        /// <summary>
        /// Indicates if this reaction should be highlighted
        /// </summary>
        public bool IsHighlighted { get; set; } = false;

        /// <summary>
        /// Indicates if this reaction has been pinned by moderators
        /// </summary>
        public bool IsPinned { get; set; } = false;

        /// <summary>
        /// Number of times this reaction has been reported
        /// </summary>
        public int ReportCount { get; set; } = 0;

        /// <summary>
        /// Indicates if this reaction has been flagged for moderation
        /// </summary>
        public bool IsFlagged { get; set; } = false;

        /// <summary>
        /// Indicates if this reaction has been approved by moderators
        /// </summary>
        public bool IsApproved { get; set; } = true;

        /// <summary>
        /// Priority score for reaction ordering (higher = more prominent)
        /// </summary>
        public int Priority { get; set; } = 0;

        /// <summary>
        /// Quality score calculated by the system (0-100)
        /// </summary>
        public int QualityScore { get; set; } = 0;

        /// <summary>
        /// Engagement score for this reaction (0-100)
        /// </summary>
        public int EngagementScore { get; set; } = 0;

        /// <summary>
        /// Influence score of this reaction on other users (0-100)
        /// </summary>
        public int InfluenceScore { get; set; } = 0;

        /// <summary>
        /// IP address from which the reaction was made
        /// </summary>
        [StringLength(45, ErrorMessage = "IP address cannot exceed 45 characters")]
        public string? ReactionIpAddress { get; set; }

        /// <summary>
        /// User agent string from the reaction submission
        /// </summary>
        [StringLength(500, ErrorMessage = "User agent cannot exceed 500 characters")]
        public string? ReactionUserAgent { get; set; }

        /// <summary>
        /// Platform from which the reaction was made
        /// </summary>
        [StringLength(50, ErrorMessage = "Reaction platform cannot exceed 50 characters")]
        public string? ReactionPlatform { get; set; }

        /// <summary>
        /// Version of the app/platform used for the reaction
        /// </summary>
        [StringLength(20, ErrorMessage = "Platform version cannot exceed 20 characters")]
        public string? PlatformVersion { get; set; }

        /// <summary>
        /// Device type used for the reaction (mobile, desktop, tablet)
        /// </summary>
        [StringLength(20, ErrorMessage = "Device type cannot exceed 20 characters")]
        public string? DeviceType { get; set; }

        /// <summary>
        /// Browser used for the reaction
        /// </summary>
        [StringLength(50, ErrorMessage = "Browser cannot exceed 50 characters")]
        public string? Browser { get; set; }

        /// <summary>
        /// Operating system used for the reaction
        /// </summary>
        [StringLength(50, ErrorMessage = "Operating system cannot exceed 50 characters")]
        public string? OperatingSystem { get; set; }

        /// <summary>
        /// Screen resolution when the reaction was made
        /// </summary>
        [StringLength(20, ErrorMessage = "Screen resolution cannot exceed 20 characters")]
        public string? ScreenResolution { get; set; }

        /// <summary>
        /// Time zone of the user when the reaction was made
        /// </summary>
        [StringLength(50, ErrorMessage = "Time zone cannot exceed 50 characters")]
        public string? TimeZone { get; set; }

        /// <summary>
        /// Language preference of the user
        /// </summary>
        [StringLength(10, ErrorMessage = "Language cannot exceed 10 characters")]
        public string? Language { get; set; }

        /// <summary>
        /// Geographic location (country/region) of the reaction
        /// </summary>
        [StringLength(100, ErrorMessage = "Geographic location cannot exceed 100 characters")]
        public string? GeographicLocation { get; set; }

        /// <summary>
        /// Referrer URL that led to this reaction
        /// </summary>
        [StringLength(500, ErrorMessage = "Referrer URL cannot exceed 500 characters")]
        public string? ReferrerUrl { get; set; }

        /// <summary>
        /// Session ID associated with this reaction
        /// </summary>
        [StringLength(100, ErrorMessage = "Session ID cannot exceed 100 characters")]
        public string? SessionId { get; set; }

        /// <summary>
        /// Duration of user session before making this reaction (in seconds)
        /// </summary>
        public int SessionDuration { get; set; } = 0;

        /// <summary>
        /// Number of pages viewed in the session before this reaction
        /// </summary>
        public int PagesViewedInSession { get; set; } = 0;

        /// <summary>
        /// Time spent on the reply before making the reaction (in seconds)
        /// </summary>
        public int TimeSpentOnReply { get; set; } = 0;

        /// <summary>
        /// Scroll position when the reaction was made (percentage)
        /// </summary>
        public int ScrollPosition { get; set; } = 0;

        /// <summary>
        /// Mouse/touch coordinates when the reaction was made (stored as JSON)
        /// </summary>
        public string? InteractionCoordinates { get; set; }

        /// <summary>
        /// A/B test variant information (if applicable)
        /// </summary>
        [StringLength(50, ErrorMessage = "A/B test variant cannot exceed 50 characters")]
        public string? ABTestVariant { get; set; }

        /// <summary>
        /// Personalization context that influenced this reaction
        /// </summary>
        [StringLength(200, ErrorMessage = "Personalization context cannot exceed 200 characters")]
        public string? PersonalizationContext { get; set; }

        /// <summary>
        /// Machine learning prediction confidence for this reaction (0-1)
        /// </summary>
        public double MLPredictionConfidence { get; set; } = 0.0;

        /// <summary>
        /// Anomaly detection score for this reaction (0-1, higher = more anomalous)
        /// </summary>
        public double AnomalyScore { get; set; } = 0.0;

        /// <summary>
        /// Spam detection score for this reaction (0-1, higher = more likely spam)
        /// </summary>
        public double SpamScore { get; set; } = 0.0;

        /// <summary>
        /// Bot detection score for this reaction (0-1, higher = more likely bot)
        /// </summary>
        public double BotScore { get; set; } = 0.0;

        /// <summary>
        /// Timestamp when the reaction was created
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Timestamp when the reaction was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Timestamp when the reaction was last verified
        /// </summary>
        public DateTime? VerifiedAt { get; set; }

        /// <summary>
        /// Timestamp when the reaction was last moderated
        /// </summary>
        public DateTime? ModeratedAt { get; set; }

        /// <summary>
        /// User ID of the moderator who last reviewed this reaction
        /// </summary>
        public int? ModeratedBy { get; set; }

        /// <summary>
        /// Reason for moderation action
        /// </summary>
        [StringLength(200, ErrorMessage = "Moderation reason cannot exceed 200 characters")]
        public string? ModerationReason { get; set; }

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
        /// Navigation property to the associated review reply
        /// </summary>
        [JsonIgnore]
        public virtual ReviewReply? ReviewReply { get; set; }

        /// <summary>
        /// Navigation property to the user who made the reaction
        /// </summary>
        [JsonIgnore]
        public virtual User? User { get; set; }

        // Computed properties
        /// <summary>
        /// Reaction age in days
        /// </summary>
        [NotMapped]
        public int AgeInDays => (DateTime.UtcNow - CreatedAt).Days;

        /// <summary>
        /// Indicates if this is a recent reaction (less than 24 hours old)
        /// </summary>
        [NotMapped]
        public bool IsRecent => AgeInDays == 0;

        /// <summary>
        /// Indicates if this is a positive reaction
        /// </summary>
        [NotMapped]
        public bool IsPositive => SentimentValue > 0;

        /// <summary>
        /// Indicates if this is a negative reaction
        /// </summary>
        [NotMapped]
        public bool IsNegative => SentimentValue < 0;

        /// <summary>
        /// Indicates if this is a neutral reaction
        /// </summary>
        [NotMapped]
        public bool IsNeutral => SentimentValue == 0;

        /// <summary>
        /// Indicates if this reaction is likely spam
        /// </summary>
        [NotMapped]
        public bool IsLikelySpam => SpamScore > 0.7;

        /// <summary>
        /// Indicates if this reaction is likely from a bot
        /// </summary>
        [NotMapped]
        public bool IsLikelyBot => BotScore > 0.7;

        /// <summary>
        /// Indicates if this reaction is anomalous
        /// </summary>
        [NotMapped]
        public bool IsAnomalous => AnomalyScore > 0.8;

        /// <summary>
        /// Indicates if this reaction needs review
        /// </summary>
        [NotMapped]
        public bool NeedsReview => IsLikelySpam || IsLikelyBot || IsAnomalous || IsFlagged || ReportCount > 0;

        /// <summary>
        /// Reaction type display text
        /// </summary>
        [NotMapped]
        public string ReactionTypeDisplay => ReactionType switch
        {
            "like" => "Like",
            "dislike" => "Dislike",
            "love" => "Love",
            "laugh" => "Laugh",
            "wow" => "Wow",
            "sad" => "Sad",
            "angry" => "Angry",
            "care" => "Care",
            "celebrate" => "Celebrate",
            "support" => "Support",
            "insightful" => "Insightful",
            "funny" => "Funny",
            "helpful" => "Helpful",
            "inspiring" => "Inspiring",
            "thoughtful" => "Thoughtful",
            _ => ReactionType
        };

        /// <summary>
        /// Reaction emoji with fallback
        /// </summary>
        [NotMapped]
        public string ReactionEmojiDisplay => ReactionEmoji ?? ReactionType switch
        {
            "like" => "👍",
            "dislike" => "👎",
            "love" => "❤️",
            "laugh" => "😂",
            "wow" => "😮",
            "sad" => "😢",
            "angry" => "😠",
            "care" => "🤗",
            "celebrate" => "🎉",
            "support" => "💪",
            "insightful" => "💡",
            "funny" => "😄",
            "helpful" => "🙏",
            "inspiring" => "✨",
            "thoughtful" => "🤔",
            _ => "👍"
        };

        /// <summary>
        /// Intensity level display text
        /// </summary>
        [NotMapped]
        public string IntensityDisplay => ReactionIntensity switch
        {
            1 => "Very Low",
            2 => "Low",
            3 => "Medium",
            4 => "High",
            5 => "Very High",
            _ => "Unknown"
        };

        /// <summary>
        /// Sentiment display text
        /// </summary>
        [NotMapped]
        public string SentimentDisplay => SentimentValue switch
        {
            > 0.5 => "Very Positive",
            > 0.2 => "Positive",
            > -0.2 => "Neutral",
            > -0.5 => "Negative",
            _ => "Very Negative"
        };

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        [NotMapped]
        public string FormattedCreatedDate => CreatedAt.ToString("MMM dd, yyyy HH:mm");

        /// <summary>
        /// Time since reaction was created (human readable)
        /// </summary>
        [NotMapped]
        public string TimeAgo
        {
            get
            {
                var timeSpan = DateTime.UtcNow - CreatedAt;
                if (timeSpan.TotalMinutes < 1) return "Just now";
                if (timeSpan.TotalMinutes < 60) return $"{(int)timeSpan.TotalMinutes}m ago";
                if (timeSpan.TotalHours < 24) return $"{(int)timeSpan.TotalHours}h ago";
                if (timeSpan.TotalDays < 30) return $"{(int)timeSpan.TotalDays}d ago";
                return FormattedCreatedDate;
            }
        }

        /// <summary>
        /// Validates the reaction data
        /// </summary>
        /// <returns>List of validation errors</returns>
        public List<string> Validate()
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(ReactionType))
                errors.Add("Reaction type is required");

            if (ReplyId <= 0)
                errors.Add("Valid reply ID is required");

            if (UserId <= 0)
                errors.Add("Valid user ID is required");

            if (ReactionIntensity < 1 || ReactionIntensity > 5)
                errors.Add("Reaction intensity must be between 1 and 5");

            if (SentimentValue < -1 || SentimentValue > 1)
                errors.Add("Sentiment value must be between -1 and 1");

            if (ReactionWeight < 0)
                errors.Add("Reaction weight cannot be negative");

            if (!string.IsNullOrWhiteSpace(ReactionComment) && ReactionComment.Length > 200)
                errors.Add("Reaction comment cannot exceed 200 characters");

            return errors;
        }

        /// <summary>
        /// Calculates and updates the quality score based on various factors
        /// </summary>
        public void CalculateQualityScore()
        {
            var score = 0;

            // Base score for having a reaction
            score += 20;

            // Intensity factor (0-20 points)
            score += ReactionIntensity * 4;

            // Comment factor (0-15 points)
            if (!string.IsNullOrWhiteSpace(ReactionComment))
            {
                score += Math.Min(15, ReactionComment.Length / 10);
            }

            // Verification factor (0-15 points)
            if (IsVerified) score += 15;

            // Premium factor (0-10 points)
            if (IsPremiumReaction) score += 10;

            // Engagement factor (0-10 points)
            if (TimeSpentOnReply > 30) score += 10;
            else if (TimeSpentOnReply > 10) score += 5;

            // Authenticity factor (0-10 points)
            if (!IsLikelySpam && !IsLikelyBot) score += 10;

            QualityScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates and updates the engagement score
        /// </summary>
        public void CalculateEngagementScore()
        {
            var score = 0;

            // Time engagement (0-30 points)
            if (TimeSpentOnReply > 120) score += 30;
            else if (TimeSpentOnReply > 60) score += 25;
            else if (TimeSpentOnReply > 30) score += 20;
            else if (TimeSpentOnReply > 10) score += 15;
            else if (TimeSpentOnReply > 0) score += 10;

            // Session engagement (0-25 points)
            if (SessionDuration > 600) score += 25;
            else if (SessionDuration > 300) score += 20;
            else if (SessionDuration > 180) score += 15;
            else if (SessionDuration > 60) score += 10;
            else if (SessionDuration > 0) score += 5;

            // Page engagement (0-20 points)
            if (PagesViewedInSession > 10) score += 20;
            else if (PagesViewedInSession > 5) score += 15;
            else if (PagesViewedInSession > 2) score += 10;
            else if (PagesViewedInSession > 0) score += 5;

            // Interaction depth (0-15 points)
            if (!string.IsNullOrWhiteSpace(ReactionComment)) score += 15;
            else if (ReactionIntensity > 3) score += 10;
            else if (ReactionIntensity > 1) score += 5;

            // Context engagement (0-10 points)
            if (!string.IsNullOrWhiteSpace(ReactionContext)) score += 10;

            EngagementScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates and updates the influence score
        /// </summary>
        public void CalculateInfluenceScore()
        {
            var score = 0;

            // Reaction type influence (0-25 points)
            score += ReactionType switch
            {
                "love" => 25,
                "insightful" => 24,
                "inspiring" => 23,
                "helpful" => 22,
                "thoughtful" => 21,
                "support" => 20,
                "celebrate" => 19,
                "like" => 18,
                "wow" => 15,
                "funny" => 12,
                "care" => 10,
                "laugh" => 8,
                "sad" => 5,
                "dislike" => 3,
                "angry" => 1,
                _ => 10
            };

            // Intensity influence (0-20 points)
            score += ReactionIntensity * 4;

            // Premium influence (0-15 points)
            if (IsPremiumReaction) score += 15;

            // Verification influence (0-15 points)
            if (IsVerified) score += 15;

            // Highlighting influence (0-15 points)
            if (IsHighlighted) score += 15;
            else if (IsPinned) score += 10;

            // Quality influence (0-10 points)
            if (QualityScore > 80) score += 10;
            else if (QualityScore > 60) score += 7;
            else if (QualityScore > 40) score += 5;
            else if (QualityScore > 20) score += 3;

            InfluenceScore = Math.Min(100, score);
        }

        /// <summary>
        /// Sets the sentiment value based on reaction type
        /// </summary>
        public void SetSentimentFromReactionType()
        {
            SentimentValue = ReactionType switch
            {
                "love" => 1.0,
                "celebrate" => 0.9,
                "inspiring" => 0.8,
                "helpful" => 0.7,
                "insightful" => 0.7,
                "like" => 0.6,
                "support" => 0.6,
                "thoughtful" => 0.5,
                "care" => 0.4,
                "wow" => 0.3,
                "funny" => 0.2,
                "laugh" => 0.2,
                "sad" => -0.3,
                "dislike" => -0.6,
                "angry" => -0.8,
                _ => 0.0
            };

            // Adjust based on intensity
            SentimentValue *= (ReactionIntensity / 3.0);
            SentimentValue = Math.Max(-1.0, Math.Min(1.0, SentimentValue));
        }

        /// <summary>
        /// Prepares the reaction for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            SetSentimentFromReactionType();
            CalculateQualityScore();
            CalculateEngagementScore();
            CalculateInfluenceScore();
            
            if (UpdatedAt == null && CreatedAt != default)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            // Trim whitespace from string properties
            ReactionType = ReactionType?.Trim().ToLower();
            ReactionComment = ReactionComment?.Trim();
            ReactionContext = ReactionContext?.Trim();
            ModerationReason = ModerationReason?.Trim();
        }
    }
}