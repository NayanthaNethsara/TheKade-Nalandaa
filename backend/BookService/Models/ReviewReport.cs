using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents a report filed against a book review
    /// Used for content moderation and community safety
    /// </summary>
    [Table("ReviewReports")]
    public class ReviewReport
    {
        /// <summary>
        /// Primary key for the review report entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReportId { get; set; }

        /// <summary>
        /// Foreign key reference to the review being reported
        /// </summary>
        [Required]
        [ForeignKey("Review")]
        public int ReviewId { get; set; }

        /// <summary>
        /// Foreign key reference to the user who filed the report
        /// </summary>
        [Required]
        [ForeignKey("ReportedBy")]
        public int ReportedByUserId { get; set; }

        /// <summary>
        /// Category of the report (spam, inappropriate, offensive, etc.)
        /// </summary>
        [Required]
        [StringLength(50, ErrorMessage = "Report category cannot exceed 50 characters")]
        public string ReportCategory { get; set; } = string.Empty;

        /// <summary>
        /// Specific reason for the report
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "Report reason cannot exceed 100 characters")]
        public string ReportReason { get; set; } = string.Empty;

        /// <summary>
        /// Detailed description of the issue
        /// </summary>
        [StringLength(1000, ErrorMessage = "Report description cannot exceed 1000 characters")]
        public string? ReportDescription { get; set; }

        /// <summary>
        /// Severity level of the report (1-5, where 5 is most severe)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Report severity must be between 1 and 5")]
        public int ReportSeverity { get; set; } = 3;

        /// <summary>
        /// Priority level for moderation (1-5, where 5 is highest priority)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Report priority must be between 1 and 5")]
        public int ReportPriority { get; set; } = 3;

        /// <summary>
        /// Current status of the report
        /// </summary>
        [Required]
        [StringLength(20, ErrorMessage = "Report status cannot exceed 20 characters")]
        public string ReportStatus { get; set; } = "pending";

        /// <summary>
        /// Evidence or supporting information for the report
        /// </summary>
        [StringLength(2000, ErrorMessage = "Report evidence cannot exceed 2000 characters")]
        public string? ReportEvidence { get; set; }

        /// <summary>
        /// URLs or references to supporting evidence
        /// </summary>
        [StringLength(500, ErrorMessage = "Evidence URLs cannot exceed 500 characters")]
        public string? EvidenceUrls { get; set; }

        /// <summary>
        /// Screenshots or attachments related to the report (file paths)
        /// </summary>
        [StringLength(1000, ErrorMessage = "Attachment paths cannot exceed 1000 characters")]
        public string? AttachmentPaths { get; set; }

        /// <summary>
        /// Indicates if the report is anonymous
        /// </summary>
        public bool IsAnonymous { get; set; } = false;

        /// <summary>
        /// Indicates if the reporter wants to be notified of resolution
        /// </summary>
        public bool WantsNotification { get; set; } = true;

        /// <summary>
        /// Indicates if this is a duplicate report
        /// </summary>
        public bool IsDuplicate { get; set; } = false;

        /// <summary>
        /// Reference to the original report if this is a duplicate
        /// </summary>
        [ForeignKey("OriginalReport")]
        public int? OriginalReportId { get; set; }

        /// <summary>
        /// Indicates if the report has been verified by moderators
        /// </summary>
        public bool IsVerified { get; set; } = false;

        /// <summary>
        /// Indicates if the report is currently being investigated
        /// </summary>
        public bool IsUnderInvestigation { get; set; } = false;

        /// <summary>
        /// Indicates if the report has been resolved
        /// </summary>
        public bool IsResolved { get; set; } = false;

        /// <summary>
        /// Indicates if the report was found to be valid
        /// </summary>
        public bool? IsValid { get; set; }

        /// <summary>
        /// Action taken as a result of the report
        /// </summary>
        [StringLength(100, ErrorMessage = "Resolution action cannot exceed 100 characters")]
        public string? ResolutionAction { get; set; }

        /// <summary>
        /// Detailed notes about the resolution
        /// </summary>
        [StringLength(1000, ErrorMessage = "Resolution notes cannot exceed 1000 characters")]
        public string? ResolutionNotes { get; set; }

        /// <summary>
        /// Feedback from the reporter about the resolution
        /// </summary>
        [StringLength(500, ErrorMessage = "Reporter feedback cannot exceed 500 characters")]
        public string? ReporterFeedback { get; set; }

        /// <summary>
        /// Rating of the resolution by the reporter (1-5)
        /// </summary>
        [Range(1, 5, ErrorMessage = "Resolution rating must be between 1 and 5")]
        public int? ResolutionRating { get; set; }

        /// <summary>
        /// Time taken to resolve the report (in hours)
        /// </summary>
        public double? ResolutionTimeHours { get; set; }

        /// <summary>
        /// IP address from which the report was submitted
        /// </summary>
        [StringLength(45, ErrorMessage = "IP address cannot exceed 45 characters")]
        public string? ReportIpAddress { get; set; }

        /// <summary>
        /// User agent string from the report submission
        /// </summary>
        [StringLength(500, ErrorMessage = "User agent cannot exceed 500 characters")]
        public string? ReportUserAgent { get; set; }

        /// <summary>
        /// Platform from which the report was submitted
        /// </summary>
        [StringLength(50, ErrorMessage = "Report platform cannot exceed 50 characters")]
        public string? ReportPlatform { get; set; }

        /// <summary>
        /// Version of the app/platform used for reporting
        /// </summary>
        [StringLength(20, ErrorMessage = "Platform version cannot exceed 20 characters")]
        public string? PlatformVersion { get; set; }

        /// <summary>
        /// Timestamp when the report was created
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Timestamp when the report was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Timestamp when the report was assigned to a moderator
        /// </summary>
        public DateTime? AssignedAt { get; set; }

        /// <summary>
        /// Timestamp when investigation started
        /// </summary>
        public DateTime? InvestigationStartedAt { get; set; }

        /// <summary>
        /// Timestamp when the report was resolved
        /// </summary>
        public DateTime? ResolvedAt { get; set; }

        /// <summary>
        /// Timestamp when the reporter was notified of resolution
        /// </summary>
        public DateTime? NotifiedAt { get; set; }

        /// <summary>
        /// User ID of the moderator assigned to this report
        /// </summary>
        [ForeignKey("AssignedModerator")]
        public int? AssignedModeratorId { get; set; }

        /// <summary>
        /// User ID of the moderator who resolved this report
        /// </summary>
        [ForeignKey("ResolvedBy")]
        public int? ResolvedByUserId { get; set; }

        /// <summary>
        /// Internal notes for moderators
        /// </summary>
        [StringLength(2000, ErrorMessage = "Internal notes cannot exceed 2000 characters")]
        public string? InternalNotes { get; set; }

        /// <summary>
        /// Escalation level (0 = normal, higher numbers = more escalated)
        /// </summary>
        public int EscalationLevel { get; set; } = 0;

        /// <summary>
        /// Reason for escalation
        /// </summary>
        [StringLength(200, ErrorMessage = "Escalation reason cannot exceed 200 characters")]
        public string? EscalationReason { get; set; }

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
        /// Navigation property to the reported review
        /// </summary>
        [JsonIgnore]
        public virtual Review? Review { get; set; }

        /// <summary>
        /// Navigation property to the user who filed the report
        /// </summary>
        [JsonIgnore]
        public virtual User? ReportedBy { get; set; }

        /// <summary>
        /// Navigation property to the assigned moderator
        /// </summary>
        [JsonIgnore]
        public virtual User? AssignedModerator { get; set; }

        /// <summary>
        /// Navigation property to the moderator who resolved the report
        /// </summary>
        [JsonIgnore]
        public virtual User? ResolvedBy { get; set; }

        /// <summary>
        /// Navigation property to the original report (if this is a duplicate)
        /// </summary>
        [JsonIgnore]
        public virtual ReviewReport? OriginalReport { get; set; }

        /// <summary>
        /// Navigation property to duplicate reports
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReviewReport> DuplicateReports { get; set; } = new List<ReviewReport>();

        // Computed properties
        /// <summary>
        /// Report age in days
        /// </summary>
        [NotMapped]
        public int AgeInDays => (DateTime.UtcNow - CreatedAt).Days;

        /// <summary>
        /// Indicates if this is a recent report (less than 24 hours old)
        /// </summary>
        [NotMapped]
        public bool IsRecent => AgeInDays == 0;

        /// <summary>
        /// Indicates if this is an urgent report (high priority and severity)
        /// </summary>
        [NotMapped]
        public bool IsUrgent => ReportPriority >= 4 && ReportSeverity >= 4;

        /// <summary>
        /// Indicates if this report is overdue (pending for more than 48 hours)
        /// </summary>
        [NotMapped]
        public bool IsOverdue => ReportStatus == "pending" && AgeInDays > 2;

        /// <summary>
        /// Number of duplicate reports
        /// </summary>
        [NotMapped]
        public int DuplicateCount => DuplicateReports?.Count ?? 0;

        /// <summary>
        /// Indicates if this report has duplicates
        /// </summary>
        [NotMapped]
        public bool HasDuplicates => DuplicateCount > 0;

        /// <summary>
        /// Report status display text
        /// </summary>
        [NotMapped]
        public string StatusDisplay => ReportStatus switch
        {
            "pending" => "Pending Review",
            "assigned" => "Assigned",
            "investigating" => "Under Investigation",
            "resolved" => "Resolved",
            "dismissed" => "Dismissed",
            "escalated" => "Escalated",
            "duplicate" => "Duplicate",
            _ => "Unknown"
        };

        /// <summary>
        /// Report category display text
        /// </summary>
        [NotMapped]
        public string CategoryDisplay => ReportCategory switch
        {
            "spam" => "Spam",
            "inappropriate" => "Inappropriate Content",
            "offensive" => "Offensive Language",
            "harassment" => "Harassment",
            "misinformation" => "Misinformation",
            "copyright" => "Copyright Violation",
            "fake" => "Fake Review",
            "other" => "Other",
            _ => ReportCategory
        };

        /// <summary>
        /// Severity level display text
        /// </summary>
        [NotMapped]
        public string SeverityDisplay => ReportSeverity switch
        {
            1 => "Very Low",
            2 => "Low",
            3 => "Medium",
            4 => "High",
            5 => "Critical",
            _ => "Unknown"
        };

        /// <summary>
        /// Priority level display text
        /// </summary>
        [NotMapped]
        public string PriorityDisplay => ReportPriority switch
        {
            1 => "Very Low",
            2 => "Low",
            3 => "Normal",
            4 => "High",
            5 => "Critical",
            _ => "Unknown"
        };

        /// <summary>
        /// Formatted creation date for display
        /// </summary>
        [NotMapped]
        public string FormattedCreatedDate => CreatedAt.ToString("MMM dd, yyyy HH:mm");

        /// <summary>
        /// Formatted resolution date for display
        /// </summary>
        [NotMapped]
        public string? FormattedResolvedDate => ResolvedAt?.ToString("MMM dd, yyyy HH:mm");

        /// <summary>
        /// Time since report was created (human readable)
        /// </summary>
        [NotMapped]
        public string TimeAgo
        {
            get
            {
                var timeSpan = DateTime.UtcNow - CreatedAt;
                if (timeSpan.TotalMinutes < 1) return "Just now";
                if (timeSpan.TotalMinutes < 60) return $"{(int)timeSpan.TotalMinutes} minutes ago";
                if (timeSpan.TotalHours < 24) return $"{(int)timeSpan.TotalHours} hours ago";
                if (timeSpan.TotalDays < 30) return $"{(int)timeSpan.TotalDays} days ago";
                return FormattedCreatedDate;
            }
        }

        /// <summary>
        /// Validates the report data
        /// </summary>
        /// <returns>List of validation errors</returns>
        public List<string> Validate()
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(ReportCategory))
                errors.Add("Report category is required");

            if (string.IsNullOrWhiteSpace(ReportReason))
                errors.Add("Report reason is required");

            if (ReviewId <= 0)
                errors.Add("Valid review ID is required");

            if (ReportedByUserId <= 0)
                errors.Add("Valid reporter user ID is required");

            if (ReportSeverity < 1 || ReportSeverity > 5)
                errors.Add("Report severity must be between 1 and 5");

            if (ReportPriority < 1 || ReportPriority > 5)
                errors.Add("Report priority must be between 1 and 5");

            if (!string.IsNullOrWhiteSpace(ReportDescription) && ReportDescription.Length > 1000)
                errors.Add("Report description cannot exceed 1000 characters");

            return errors;
        }

        /// <summary>
        /// Assigns the report to a moderator
        /// </summary>
        /// <param name="moderatorId">ID of the moderator to assign</param>
        public void AssignToModerator(int moderatorId)
        {
            AssignedModeratorId = moderatorId;
            AssignedAt = DateTime.UtcNow;
            ReportStatus = "assigned";
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Starts investigation of the report
        /// </summary>
        public void StartInvestigation()
        {
            IsUnderInvestigation = true;
            InvestigationStartedAt = DateTime.UtcNow;
            ReportStatus = "investigating";
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Resolves the report
        /// </summary>
        /// <param name="resolvedByUserId">ID of the user resolving the report</param>
        /// <param name="action">Action taken</param>
        /// <param name="notes">Resolution notes</param>
        /// <param name="isValid">Whether the report was valid</param>
        public void Resolve(int resolvedByUserId, string action, string? notes = null, bool? isValid = null)
        {
            IsResolved = true;
            IsUnderInvestigation = false;
            ResolvedByUserId = resolvedByUserId;
            ResolvedAt = DateTime.UtcNow;
            ResolutionAction = action;
            ResolutionNotes = notes;
            IsValid = isValid;
            ReportStatus = "resolved";
            UpdatedAt = DateTime.UtcNow;

            // Calculate resolution time
            if (InvestigationStartedAt.HasValue)
            {
                ResolutionTimeHours = (DateTime.UtcNow - InvestigationStartedAt.Value).TotalHours;
            }
            else
            {
                ResolutionTimeHours = (DateTime.UtcNow - CreatedAt).TotalHours;
            }
        }

        /// <summary>
        /// Dismisses the report
        /// </summary>
        /// <param name="dismissedByUserId">ID of the user dismissing the report</param>
        /// <param name="reason">Reason for dismissal</param>
        public void Dismiss(int dismissedByUserId, string reason)
        {
            ResolvedByUserId = dismissedByUserId;
            ResolvedAt = DateTime.UtcNow;
            ResolutionAction = "dismissed";
            ResolutionNotes = reason;
            IsValid = false;
            ReportStatus = "dismissed";
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Escalates the report
        /// </summary>
        /// <param name="reason">Reason for escalation</param>
        public void Escalate(string reason)
        {
            EscalationLevel++;
            EscalationReason = reason;
            ReportPriority = Math.Min(5, ReportPriority + 1);
            ReportStatus = "escalated";
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Marks the report as duplicate
        /// </summary>
        /// <param name="originalReportId">ID of the original report</param>
        public void MarkAsDuplicate(int originalReportId)
        {
            IsDuplicate = true;
            OriginalReportId = originalReportId;
            ReportStatus = "duplicate";
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Prepares the report for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            if (UpdatedAt == null && CreatedAt != default)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            // Trim whitespace from string properties
            ReportCategory = ReportCategory?.Trim();
            ReportReason = ReportReason?.Trim();
            ReportDescription = ReportDescription?.Trim();
            ResolutionAction = ResolutionAction?.Trim();
            ResolutionNotes = ResolutionNotes?.Trim();
            EscalationReason = EscalationReason?.Trim();
        }
    }
}