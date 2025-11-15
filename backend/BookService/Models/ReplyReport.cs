using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents a report filed against a review reply
    /// Used for content moderation and community safety in reply threads
    /// </summary>
    [Table("ReplyReports")]
    public class ReplyReport
    {
        /// <summary>
        /// Primary key for the reply report entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReportId { get; set; }

        /// <summary>
        /// Foreign key reference to the reply being reported
        /// </summary>
        [Required]
        [ForeignKey("ReviewReply")]
        public int ReplyId { get; set; }

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
        /// Indicates if this report is part of a harassment pattern
        /// </summary>
        public bool IsPartOfHarassmentPattern { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves cyberbullying
        /// </summary>
        public bool InvolvesCyberbullying { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves hate speech
        /// </summary>
        public bool InvolvesHateSpeech { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves doxxing or privacy violation
        /// </summary>
        public bool InvolvesDoxxing { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves impersonation
        /// </summary>
        public bool InvolvesImpersonation { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves copyright infringement
        /// </summary>
        public bool InvolvesCopyright { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves misinformation
        /// </summary>
        public bool InvolvesMisinformation { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves self-harm content
        /// </summary>
        public bool InvolvesSelfHarm { get; set; } = false;

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

        /// <summary>
        /// Indicates if this report involves financial scam
        /// </summary>
        public bool InvolvesFinancialScam { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves malware or phishing
        /// </summary>
        public bool InvolvesMalware { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves fake accounts
        /// </summary>
        public bool InvolvesFakeAccounts { get; set; } = false;

        /// <summary>
        /// Indicates if this report involves coordinated inauthentic behavior
        /// </summary>
        public bool InvolvesCoordinatedBehavior { get; set; } = false;

        /// <summary>
        /// Risk assessment score (0-100, higher = more risky)
        /// </summary>
        public int RiskScore { get; set; } = 0;

        /// <summary>
        /// Urgency score (0-100, higher = more urgent)
        /// </summary>
        public int UrgencyScore { get; set; } = 0;

        /// <summary>
        /// Impact score (0-100, higher = more impactful)
        /// </summary>
        public int ImpactScore { get; set; } = 0;

        /// <summary>
        /// Confidence score in the report validity (0-100)
        /// </summary>
        public int ConfidenceScore { get; set; } = 0;

        /// <summary>
        /// Machine learning prediction score for report validity (0-1)
        /// </summary>
        public double MLPredictionScore { get; set; } = 0.0;

        /// <summary>
        /// Sentiment analysis score of the reported content (-1 to 1)
        /// </summary>
        public double ContentSentimentScore { get; set; } = 0.0;

        /// <summary>
        /// Toxicity score of the reported content (0-1, higher = more toxic)
        /// </summary>
        public double ContentToxicityScore { get; set; } = 0.0;

        /// <summary>
        /// Spam detection score for the reported content (0-1)
        /// </summary>
        public double ContentSpamScore { get; set; } = 0.0;

        /// <summary>
        /// Language detection confidence for the reported content (0-1)
        /// </summary>
        public double LanguageDetectionConfidence { get; set; } = 0.0;

        /// <summary>
        /// Detected language of the reported content
        /// </summary>
        [StringLength(10, ErrorMessage = "Detected language cannot exceed 10 characters")]
        public string? DetectedLanguage { get; set; }

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
        /// Device type used for reporting (mobile, desktop, tablet)
        /// </summary>
        [StringLength(20, ErrorMessage = "Device type cannot exceed 20 characters")]
        public string? DeviceType { get; set; }

        /// <summary>
        /// Browser used for reporting
        /// </summary>
        [StringLength(50, ErrorMessage = "Browser cannot exceed 50 characters")]
        public string? Browser { get; set; }

        /// <summary>
        /// Operating system used for reporting
        /// </summary>
        [StringLength(50, ErrorMessage = "Operating system cannot exceed 50 characters")]
        public string? OperatingSystem { get; set; }

        /// <summary>
        /// Geographic location (country/region) of the report
        /// </summary>
        [StringLength(100, ErrorMessage = "Geographic location cannot exceed 100 characters")]
        public string? GeographicLocation { get; set; }

        /// <summary>
        /// Time zone of the reporter
        /// </summary>
        [StringLength(50, ErrorMessage = "Time zone cannot exceed 50 characters")]
        public string? TimeZone { get; set; }

        /// <summary>
        /// Language preference of the reporter
        /// </summary>
        [StringLength(10, ErrorMessage = "Language cannot exceed 10 characters")]
        public string? ReporterLanguage { get; set; }

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
        /// Timestamp when the report was escalated
        /// </summary>
        public DateTime? EscalatedAt { get; set; }

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
        /// User ID of the moderator who escalated this report
        /// </summary>
        [ForeignKey("EscalatedBy")]
        public int? EscalatedByUserId { get; set; }

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
        /// Legal review required flag
        /// </summary>
        public bool RequiresLegalReview { get; set; } = false;

        /// <summary>
        /// Law enforcement notification required flag
        /// </summary>
        public bool RequiresLawEnforcementNotification { get; set; } = false;

        /// <summary>
        /// External agency notification required flag
        /// </summary>
        public bool RequiresExternalAgencyNotification { get; set; } = false;

        /// <summary>
        /// Timestamp when legal review was requested
        /// </summary>
        public DateTime? LegalReviewRequestedAt { get; set; }

        /// <summary>
        /// Timestamp when law enforcement was notified
        /// </summary>
        public DateTime? LawEnforcementNotifiedAt { get; set; }

        /// <summary>
        /// Timestamp when external agency was notified
        /// </summary>
        public DateTime? ExternalAgencyNotifiedAt { get; set; }

        /// <summary>
        /// Case number for legal or law enforcement reference
        /// </summary>
        [StringLength(100, ErrorMessage = "Case number cannot exceed 100 characters")]
        public string? CaseNumber { get; set; }

        /// <summary>
        /// Reference number for external agency
        /// </summary>
        [StringLength(100, ErrorMessage = "Reference number cannot exceed 100 characters")]
        public string? ExternalReferenceNumber { get; set; }

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
        /// Navigation property to the reported reply
        /// </summary>
        [JsonIgnore]
        public virtual ReviewReply? ReviewReply { get; set; }

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
        /// Navigation property to the moderator who escalated the report
        /// </summary>
        [JsonIgnore]
        public virtual User? EscalatedBy { get; set; }

        /// <summary>
        /// Navigation property to the original report (if this is a duplicate)
        /// </summary>
        [JsonIgnore]
        public virtual ReplyReport? OriginalReport { get; set; }

        /// <summary>
        /// Navigation property to duplicate reports
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ReplyReport> DuplicateReports { get; set; } = new List<ReplyReport>();

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
        /// Indicates if this report is overdue (pending for more than 24 hours)
        /// </summary>
        [NotMapped]
        public bool IsOverdue => ReportStatus == "pending" && AgeInDays > 1;

        /// <summary>
        /// Indicates if this is a high-risk report
        /// </summary>
        [NotMapped]
        public bool IsHighRisk => RiskScore >= 70;

        /// <summary>
        /// Indicates if this report involves serious violations
        /// </summary>
        [NotMapped]
        public bool InvolvesSeriousViolations => InvolvesHateSpeech || InvolvesViolence || 
                                                InvolvesSelfHarm || InvolvesIllegalActivity || 
                                                InvolvesCyberbullying || InvolvesDoxxing;

        /// <summary>
        /// Indicates if this report requires immediate attention
        /// </summary>
        [NotMapped]
        public bool RequiresImmediateAttention => IsUrgent || IsHighRisk || InvolvesSeriousViolations;

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
            "legal_review" => "Legal Review",
            "law_enforcement" => "Law Enforcement",
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
            "cyberbullying" => "Cyberbullying",
            "hate_speech" => "Hate Speech",
            "violence" => "Violence/Threats",
            "self_harm" => "Self-Harm",
            "doxxing" => "Doxxing/Privacy",
            "impersonation" => "Impersonation",
            "misinformation" => "Misinformation",
            "copyright" => "Copyright Violation",
            "adult_content" => "Adult Content",
            "illegal_activity" => "Illegal Activity",
            "financial_scam" => "Financial Scam",
            "malware" => "Malware/Phishing",
            "fake_accounts" => "Fake Accounts",
            "coordinated_behavior" => "Coordinated Behavior",
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
        /// Risk level display text
        /// </summary>
        [NotMapped]
        public string RiskLevelDisplay => RiskScore switch
        {
            >= 80 => "Critical Risk",
            >= 60 => "High Risk",
            >= 40 => "Medium Risk",
            >= 20 => "Low Risk",
            _ => "Minimal Risk"
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
        /// Calculates risk, urgency, impact, and confidence scores
        /// </summary>
        public void CalculateScores()
        {
            CalculateRiskScore();
            CalculateUrgencyScore();
            CalculateImpactScore();
            CalculateConfidenceScore();
        }

        /// <summary>
        /// Calculates the risk score based on various factors
        /// </summary>
        private void CalculateRiskScore()
        {
            var score = 0;

            // Base severity and priority
            score += ReportSeverity * 10;
            score += ReportPriority * 8;

            // Serious violations
            if (InvolvesViolence) score += 20;
            if (InvolvesSelfHarm) score += 20;
            if (InvolvesHateSpeech) score += 15;
            if (InvolvesCyberbullying) score += 15;
            if (InvolvesDoxxing) score += 15;
            if (InvolvesIllegalActivity) score += 15;
            if (InvolvesHarassmentPattern) score += 10;
            if (InvolvesMisinformation) score += 10;
            if (InvolvesImpersonation) score += 10;
            if (InvolvesFinancialScam) score += 10;
            if (InvolvesMalware) score += 10;
            if (InvolvesCoordinatedBehavior) score += 10;

            // Content analysis scores
            if (ContentToxicityScore > 0.8) score += 15;
            else if (ContentToxicityScore > 0.6) score += 10;
            else if (ContentToxicityScore > 0.4) score += 5;

            if (ContentSentimentScore < -0.8) score += 10;
            else if (ContentSentimentScore < -0.6) score += 7;
            else if (ContentSentimentScore < -0.4) score += 5;

            RiskScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the urgency score
        /// </summary>
        private void CalculateUrgencyScore()
        {
            var score = 0;

            // Time-sensitive violations
            if (InvolvesViolence || InvolvesSelfHarm) score += 30;
            if (InvolvesHateSpeech || InvolvesCyberbullying) score += 25;
            if (InvolvesDoxxing) score += 25;
            if (InvolvesIllegalActivity) score += 20;
            if (InvolvesFinancialScam || InvolvesMalware) score += 20;

            // Report characteristics
            score += ReportPriority * 10;
            score += ReportSeverity * 8;

            // Age factor (older reports become more urgent)
            if (AgeInDays > 3) score += 15;
            else if (AgeInDays > 1) score += 10;
            else if (AgeInDays > 0) score += 5;

            // Duplicate factor
            if (HasDuplicates) score += DuplicateCount * 5;

            UrgencyScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the impact score
        /// </summary>
        private void CalculateImpactScore()
        {
            var score = 0;

            // Community impact
            if (InvolvesHateSpeech) score += 25;
            if (InvolvesCyberbullying) score += 25;
            if (InvolvesViolence) score += 20;
            if (InvolvesHarassmentPattern) score += 20;
            if (InvolvesCoordinatedBehavior) score += 20;
            if (InvolvesMisinformation) score += 15;
            if (InvolvesDoxxing) score += 15;

            // Platform impact
            if (InvolvesFakeAccounts) score += 15;
            if (InvolvesFinancialScam) score += 15;
            if (InvolvesMalware) score += 15;
            if (ContentSpamScore > 0.8) score += 10;

            // Severity and priority
            score += ReportSeverity * 5;
            score += ReportPriority * 5;

            // Duplicate impact
            if (HasDuplicates) score += Math.Min(20, DuplicateCount * 3);

            ImpactScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the confidence score in report validity
        /// </summary>
        private void CalculateConfidenceScore()
        {
            var score = 50; // Base confidence

            // ML prediction confidence
            if (MLPredictionScore > 0.8) score += 25;
            else if (MLPredictionScore > 0.6) score += 15;
            else if (MLPredictionScore > 0.4) score += 10;
            else if (MLPredictionScore < 0.2) score -= 15;

            // Content analysis confidence
            if (ContentToxicityScore > 0.7) score += 15;
            if (ContentSpamScore > 0.7) score += 10;
            if (LanguageDetectionConfidence > 0.9) score += 5;

            // Report quality indicators
            if (!string.IsNullOrWhiteSpace(ReportDescription)) score += 10;
            if (!string.IsNullOrWhiteSpace(ReportEvidence)) score += 10;
            if (!string.IsNullOrWhiteSpace(EvidenceUrls)) score += 5;
            if (!string.IsNullOrWhiteSpace(AttachmentPaths)) score += 5;

            // Duplicate confirmation
            if (HasDuplicates) score += Math.Min(15, DuplicateCount * 2);

            // Anonymous reports are less confident
            if (IsAnonymous) score -= 10;

            ConfidenceScore = Math.Max(0, Math.Min(100, score));
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

            if (ReplyId <= 0)
                errors.Add("Valid reply ID is required");

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
        /// Prepares the report for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            CalculateScores();
            
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