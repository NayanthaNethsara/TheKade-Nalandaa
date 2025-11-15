using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents a vote (helpful/unhelpful) on a book review
    /// Tracks user engagement and helps determine review quality
    /// </summary>
    [Table("ReviewVotes")]
    public class ReviewVote
    {
        /// <summary>
        /// Primary key for the review vote entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VoteId { get; set; }

        /// <summary>
        /// Foreign key reference to the review being voted on
        /// </summary>
        [Required]
        [ForeignKey("Review")]
        public int ReviewId { get; set; }

        /// <summary>
        /// Foreign key reference to the user who cast the vote
        /// </summary>
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        /// <summary>
        /// Type of vote: true for helpful, false for unhelpful
        /// </summary>
        [Required]
        public bool IsHelpful { get; set; }

        /// <summary>
        /// Optional comment explaining the vote
        /// </summary>
        [StringLength(500, ErrorMessage = "Vote comment cannot exceed 500 characters")]
        public string? VoteComment { get; set; }

        /// <summary>
        /// Confidence level of the vote (1-5, where 5 is most confident)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Vote confidence must be between 1 and 5")]
        public int VoteConfidence { get; set; } = 3;

        /// <summary>
        /// Reason category for the vote
        /// </summary>
        [StringLength(50, ErrorMessage = "Vote reason cannot exceed 50 characters")]
        public string? VoteReason { get; set; }

        /// <summary>
        /// IP address from which the vote was cast
        /// </summary>
        [StringLength(45, ErrorMessage = "IP address cannot exceed 45 characters")]
        public string? VoteIpAddress { get; set; }

        /// <summary>
        /// User agent string from the vote submission
        /// </summary>
        [StringLength(500, ErrorMessage = "User agent cannot exceed 500 characters")]
        public string? VoteUserAgent { get; set; }

        /// <summary>
        /// Platform from which the vote was cast
        /// </summary>
        [StringLength(50, ErrorMessage = "Vote platform cannot exceed 50 characters")]
        public string? VotePlatform { get; set; }

        /// <summary>
        /// Indicates if this vote has been verified as legitimate
        /// </summary>
        public bool IsVerified { get; set; } = true;

        /// <summary>
        /// Indicates if this vote is currently active/visible
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Weight of this vote in calculations (default 1.0)
        /// </summary>
        public double VoteWeight { get; set; } = 1.0;

        /// <summary>
        /// Timestamp when the vote was cast
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Timestamp when the vote was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

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
        /// Navigation property to the user who cast the vote
        /// </summary>
        [JsonIgnore]
        public virtual User? User { get; set; }

        // Computed properties
        /// <summary>
        /// Vote type as string for display purposes
        /// </summary>
        [NotMapped]
        public string VoteType => IsHelpful ? "Helpful" : "Unhelpful";

        /// <summary>
        /// Vote age in days
        /// </summary>
        [NotMapped]
        public int AgeInDays => (DateTime.UtcNow - CreatedAt).Days;

        /// <summary>
        /// Indicates if this is a recent vote (less than 7 days old)
        /// </summary>
        [NotMapped]
        public bool IsRecent => AgeInDays <= 7;

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        [NotMapped]
        public string FormattedCreatedDate => CreatedAt.ToString("MMM dd, yyyy");

        /// <summary>
        /// Vote display icon
        /// </summary>
        [NotMapped]
        public string VoteIcon => IsHelpful ? "👍" : "👎";

        /// <summary>
        /// Confidence level as text
        /// </summary>
        [NotMapped]
        public string ConfidenceText => VoteConfidence switch
        {
            1 => "Very Low",
            2 => "Low",
            3 => "Medium",
            4 => "High",
            5 => "Very High",
            _ => "Unknown"
        };

        /// <summary>
        /// Validates the vote data
        /// </summary>
        /// <returns>List of validation errors</returns>
        public List<string> Validate()
        {
            var errors = new List<string>();

            if (ReviewId <= 0)
                errors.Add("Valid review ID is required");

            if (UserId <= 0)
                errors.Add("Valid user ID is required");

            if (VoteConfidence < 1 || VoteConfidence > 5)
                errors.Add("Vote confidence must be between 1 and 5");

            if (!string.IsNullOrWhiteSpace(VoteComment) && VoteComment.Length > 500)
                errors.Add("Vote comment cannot exceed 500 characters");

            return errors;
        }

        /// <summary>
        /// Prepares the vote for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            if (UpdatedAt == null && CreatedAt != default)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            // Trim whitespace from string properties
            VoteComment = VoteComment?.Trim();
            VoteReason = VoteReason?.Trim();
            VotePlatform = VotePlatform?.Trim();
        }
    }
}