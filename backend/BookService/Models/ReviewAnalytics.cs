using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookService.Models
{
    /// <summary>
    /// Represents analytics data for book reviews
    /// Tracks engagement metrics, performance indicators, and user behavior
    /// </summary>
    [Table("ReviewAnalytics")]
    public class ReviewAnalytics
    {
        /// <summary>
        /// Primary key for the review analytics entity
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AnalyticsId { get; set; }

        /// <summary>
        /// Foreign key reference to the review being analyzed
        /// </summary>
        [Required]
        [ForeignKey("Review")]
        public int ReviewId { get; set; }

        /// <summary>
        /// Date for which these analytics are recorded
        /// </summary>
        [Required]
        public DateTime AnalyticsDate { get; set; } = DateTime.UtcNow.Date;

        /// <summary>
        /// Number of times the review was viewed
        /// </summary>
        public int ViewCount { get; set; } = 0;

        /// <summary>
        /// Number of unique users who viewed the review
        /// </summary>
        public int UniqueViewCount { get; set; } = 0;

        /// <summary>
        /// Number of times the review was clicked/expanded
        /// </summary>
        public int ClickCount { get; set; } = 0;

        /// <summary>
        /// Number of times the review was shared
        /// </summary>
        public int ShareCount { get; set; } = 0;

        /// <summary>
        /// Number of times the review was bookmarked/saved
        /// </summary>
        public int BookmarkCount { get; set; } = 0;

        /// <summary>
        /// Number of times the review was copied
        /// </summary>
        public int CopyCount { get; set; } = 0;

        /// <summary>
        /// Number of times the review was printed
        /// </summary>
        public int PrintCount { get; set; } = 0;

        /// <summary>
        /// Number of helpful votes received on this date
        /// </summary>
        public int HelpfulVotesReceived { get; set; } = 0;

        /// <summary>
        /// Number of unhelpful votes received on this date
        /// </summary>
        public int UnhelpfulVotesReceived { get; set; } = 0;

        /// <summary>
        /// Number of replies received on this date
        /// </summary>
        public int RepliesReceived { get; set; } = 0;

        /// <summary>
        /// Number of reports filed against the review on this date
        /// </summary>
        public int ReportsReceived { get; set; } = 0;

        /// <summary>
        /// Average time spent reading the review (in seconds)
        /// </summary>
        public double AverageReadTime { get; set; } = 0.0;

        /// <summary>
        /// Total time spent by all users reading the review (in seconds)
        /// </summary>
        public double TotalReadTime { get; set; } = 0.0;

        /// <summary>
        /// Bounce rate (percentage of users who left immediately)
        /// </summary>
        public double BounceRate { get; set; } = 0.0;

        /// <summary>
        /// Engagement rate (percentage of viewers who interacted)
        /// </summary>
        public double EngagementRate { get; set; } = 0.0;

        /// <summary>
        /// Conversion rate (percentage of viewers who took action)
        /// </summary>
        public double ConversionRate { get; set; } = 0.0;

        /// <summary>
        /// Click-through rate (percentage of views that resulted in clicks)
        /// </summary>
        public double ClickThroughRate { get; set; } = 0.0;

        /// <summary>
        /// Share rate (percentage of views that resulted in shares)
        /// </summary>
        public double ShareRate { get; set; } = 0.0;

        /// <summary>
        /// Helpfulness ratio for this date
        /// </summary>
        public double DailyHelpfulnessRatio { get; set; } = 0.0;

        /// <summary>
        /// Number of mobile views
        /// </summary>
        public int MobileViews { get; set; } = 0;

        /// <summary>
        /// Number of desktop views
        /// </summary>
        public int DesktopViews { get; set; } = 0;

        /// <summary>
        /// Number of tablet views
        /// </summary>
        public int TabletViews { get; set; } = 0;

        /// <summary>
        /// Number of views from search engines
        /// </summary>
        public int SearchEngineViews { get; set; } = 0;

        /// <summary>
        /// Number of direct views (typed URL or bookmark)
        /// </summary>
        public int DirectViews { get; set; } = 0;

        /// <summary>
        /// Number of referral views (from other websites)
        /// </summary>
        public int ReferralViews { get; set; } = 0;

        /// <summary>
        /// Number of social media views
        /// </summary>
        public int SocialMediaViews { get; set; } = 0;

        /// <summary>
        /// Number of views from email campaigns
        /// </summary>
        public int EmailViews { get; set; } = 0;

        /// <summary>
        /// Number of views from internal links
        /// </summary>
        public int InternalViews { get; set; } = 0;

        /// <summary>
        /// Number of new user views (first-time visitors)
        /// </summary>
        public int NewUserViews { get; set; } = 0;

        /// <summary>
        /// Number of returning user views
        /// </summary>
        public int ReturningUserViews { get; set; } = 0;

        /// <summary>
        /// Number of registered user views
        /// </summary>
        public int RegisteredUserViews { get; set; } = 0;

        /// <summary>
        /// Number of anonymous user views
        /// </summary>
        public int AnonymousUserViews { get; set; } = 0;

        /// <summary>
        /// Number of premium user views
        /// </summary>
        public int PremiumUserViews { get; set; } = 0;

        /// <summary>
        /// Number of free user views
        /// </summary>
        public int FreeUserViews { get; set; } = 0;

        /// <summary>
        /// Average user session duration when viewing this review (in seconds)
        /// </summary>
        public double AverageSessionDuration { get; set; } = 0.0;

        /// <summary>
        /// Number of users who viewed other reviews after this one
        /// </summary>
        public int SubsequentReviewViews { get; set; } = 0;

        /// <summary>
        /// Number of users who purchased the book after reading this review
        /// </summary>
        public int BookPurchasesInfluenced { get; set; } = 0;

        /// <summary>
        /// Number of users who added the book to wishlist after reading this review
        /// </summary>
        public int WishlistAdditions { get; set; } = 0;

        /// <summary>
        /// Number of users who followed the reviewer after reading this review
        /// </summary>
        public int ReviewerFollows { get; set; } = 0;

        /// <summary>
        /// Number of users who viewed the reviewer's profile
        /// </summary>
        public int ReviewerProfileViews { get; set; } = 0;

        /// <summary>
        /// Number of users who viewed the book details page
        /// </summary>
        public int BookPageViews { get; set; } = 0;

        /// <summary>
        /// Number of users who viewed similar books
        /// </summary>
        public int SimilarBookViews { get; set; } = 0;

        /// <summary>
        /// Number of users who searched for the author
        /// </summary>
        public int AuthorSearches { get; set; } = 0;

        /// <summary>
        /// Number of users who searched for similar books
        /// </summary>
        public int SimilarBookSearches { get; set; } = 0;

        /// <summary>
        /// Peak concurrent viewers for this review on this date
        /// </summary>
        public int PeakConcurrentViewers { get; set; } = 0;

        /// <summary>
        /// Hour of day with most views (0-23)
        /// </summary>
        public int PeakViewHour { get; set; } = 0;

        /// <summary>
        /// Geographic distribution of views (stored as JSON)
        /// </summary>
        public string? GeographicDistribution { get; set; }

        /// <summary>
        /// Language distribution of viewers (stored as JSON)
        /// </summary>
        public string? LanguageDistribution { get; set; }

        /// <summary>
        /// Age group distribution of viewers (stored as JSON)
        /// </summary>
        public string? AgeGroupDistribution { get; set; }

        /// <summary>
        /// Gender distribution of viewers (stored as JSON)
        /// </summary>
        public string? GenderDistribution { get; set; }

        /// <summary>
        /// Browser distribution of viewers (stored as JSON)
        /// </summary>
        public string? BrowserDistribution { get; set; }

        /// <summary>
        /// Operating system distribution of viewers (stored as JSON)
        /// </summary>
        public string? OperatingSystemDistribution { get; set; }

        /// <summary>
        /// Screen resolution distribution of viewers (stored as JSON)
        /// </summary>
        public string? ScreenResolutionDistribution { get; set; }

        /// <summary>
        /// Time zone distribution of viewers (stored as JSON)
        /// </summary>
        public string? TimeZoneDistribution { get; set; }

        /// <summary>
        /// Referrer domain distribution (stored as JSON)
        /// </summary>
        public string? ReferrerDistribution { get; set; }

        /// <summary>
        /// Search keyword distribution (stored as JSON)
        /// </summary>
        public string? SearchKeywordDistribution { get; set; }

        /// <summary>
        /// Social media platform distribution (stored as JSON)
        /// </summary>
        public string? SocialMediaDistribution { get; set; }

        /// <summary>
        /// User interaction heatmap data (stored as JSON)
        /// </summary>
        public string? InteractionHeatmap { get; set; }

        /// <summary>
        /// Scroll depth analytics (stored as JSON)
        /// </summary>
        public string? ScrollDepthAnalytics { get; set; }

        /// <summary>
        /// Exit point analytics (where users left the review)
        /// </summary>
        public string? ExitPointAnalytics { get; set; }

        /// <summary>
        /// A/B test variant information (if applicable)
        /// </summary>
        [StringLength(50, ErrorMessage = "A/B test variant cannot exceed 50 characters")]
        public string? ABTestVariant { get; set; }

        /// <summary>
        /// Performance metrics (load time, render time, etc.) stored as JSON
        /// </summary>
        public string? PerformanceMetrics { get; set; }

        /// <summary>
        /// Error tracking data (JavaScript errors, failed requests, etc.)
        /// </summary>
        public string? ErrorTracking { get; set; }

        /// <summary>
        /// User feedback and ratings for the review experience
        /// </summary>
        public string? UserFeedback { get; set; }

        /// <summary>
        /// Sentiment analysis results for user interactions
        /// </summary>
        public string? SentimentAnalysis { get; set; }

        /// <summary>
        /// Machine learning insights and predictions
        /// </summary>
        public string? MLInsights { get; set; }

        /// <summary>
        /// Personalization effectiveness metrics
        /// </summary>
        public string? PersonalizationMetrics { get; set; }

        /// <summary>
        /// Content recommendation performance
        /// </summary>
        public string? RecommendationMetrics { get; set; }

        /// <summary>
        /// Search ranking position for this review
        /// </summary>
        public int SearchRankingPosition { get; set; } = 0;

        /// <summary>
        /// SEO performance metrics
        /// </summary>
        public string? SEOMetrics { get; set; }

        /// <summary>
        /// Accessibility metrics and compliance data
        /// </summary>
        public string? AccessibilityMetrics { get; set; }

        /// <summary>
        /// Quality score for this analytics period
        /// </summary>
        public int QualityScore { get; set; } = 0;

        /// <summary>
        /// Engagement score for this analytics period
        /// </summary>
        public int EngagementScore { get; set; } = 0;

        /// <summary>
        /// Influence score (how much this review influenced user behavior)
        /// </summary>
        public int InfluenceScore { get; set; } = 0;

        /// <summary>
        /// Virality score (how much the review was shared/spread)
        /// </summary>
        public int ViralityScore { get; set; } = 0;

        /// <summary>
        /// Retention score (how well the review retained user attention)
        /// </summary>
        public int RetentionScore { get; set; } = 0;

        /// <summary>
        /// Timestamp when the analytics were created
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Timestamp when the analytics were last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Timestamp when the analytics were last processed
        /// </summary>
        public DateTime? ProcessedAt { get; set; }

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

        // Computed properties
        /// <summary>
        /// Total votes received on this date
        /// </summary>
        [NotMapped]
        public int TotalVotesReceived => HelpfulVotesReceived + UnhelpfulVotesReceived;

        /// <summary>
        /// Total device views (mobile + desktop + tablet)
        /// </summary>
        [NotMapped]
        public int TotalDeviceViews => MobileViews + DesktopViews + TabletViews;

        /// <summary>
        /// Total traffic source views
        /// </summary>
        [NotMapped]
        public int TotalTrafficSourceViews => SearchEngineViews + DirectViews + ReferralViews + 
                                             SocialMediaViews + EmailViews + InternalViews;

        /// <summary>
        /// Total user type views
        /// </summary>
        [NotMapped]
        public int TotalUserTypeViews => NewUserViews + ReturningUserViews;

        /// <summary>
        /// Mobile view percentage
        /// </summary>
        [NotMapped]
        public double MobileViewPercentage => TotalDeviceViews > 0 ? (double)MobileViews / TotalDeviceViews * 100 : 0;

        /// <summary>
        /// Desktop view percentage
        /// </summary>
        [NotMapped]
        public double DesktopViewPercentage => TotalDeviceViews > 0 ? (double)DesktopViews / TotalDeviceViews * 100 : 0;

        /// <summary>
        /// Tablet view percentage
        /// </summary>
        [NotMapped]
        public double TabletViewPercentage => TotalDeviceViews > 0 ? (double)TabletViews / TotalDeviceViews * 100 : 0;

        /// <summary>
        /// New user percentage
        /// </summary>
        [NotMapped]
        public double NewUserPercentage => TotalUserTypeViews > 0 ? (double)NewUserViews / TotalUserTypeViews * 100 : 0;

        /// <summary>
        /// Returning user percentage
        /// </summary>
        [NotMapped]
        public double ReturningUserPercentage => TotalUserTypeViews > 0 ? (double)ReturningUserViews / TotalUserTypeViews * 100 : 0;

        /// <summary>
        /// View-to-engagement ratio
        /// </summary>
        [NotMapped]
        public double ViewToEngagementRatio => ViewCount > 0 ? (double)(ClickCount + ShareCount + BookmarkCount) / ViewCount : 0;

        /// <summary>
        /// View-to-conversion ratio
        /// </summary>
        [NotMapped]
        public double ViewToConversionRatio => ViewCount > 0 ? (double)(BookPurchasesInfluenced + WishlistAdditions) / ViewCount : 0;

        /// <summary>
        /// Analytics age in days
        /// </summary>
        [NotMapped]
        public int AgeInDays => (DateTime.UtcNow.Date - AnalyticsDate).Days;

        /// <summary>
        /// Indicates if these are recent analytics (today's data)
        /// </summary>
        [NotMapped]
        public bool IsToday => AnalyticsDate.Date == DateTime.UtcNow.Date;

        /// <summary>
        /// Indicates if these are yesterday's analytics
        /// </summary>
        [NotMapped]
        public bool IsYesterday => AnalyticsDate.Date == DateTime.UtcNow.Date.AddDays(-1);

        /// <summary>
        /// Indicates if these analytics are from this week
        /// </summary>
        [NotMapped]
        public bool IsThisWeek => AgeInDays <= 7;

        /// <summary>
        /// Indicates if these analytics are from this month
        /// </summary>
        [NotMapped]
        public bool IsThisMonth => AnalyticsDate.Month == DateTime.UtcNow.Month && 
                                   AnalyticsDate.Year == DateTime.UtcNow.Year;

        /// <summary>
        /// Formatted analytics date for display
        /// </summary>
        [NotMapped]
        public string FormattedAnalyticsDate => AnalyticsDate.ToString("MMM dd, yyyy");

        /// <summary>
        /// Day of week for the analytics date
        /// </summary>
        [NotMapped]
        public string DayOfWeek => AnalyticsDate.DayOfWeek.ToString();

        /// <summary>
        /// Calculates all derived metrics and scores
        /// </summary>
        public void CalculateMetrics()
        {
            // Calculate rates and ratios
            if (ViewCount > 0)
            {
                ClickThroughRate = (double)ClickCount / ViewCount * 100;
                ShareRate = (double)ShareCount / ViewCount * 100;
                BounceRate = ViewCount > 0 ? (double)(ViewCount - ClickCount) / ViewCount * 100 : 0;
                EngagementRate = (double)(ClickCount + ShareCount + BookmarkCount + TotalVotesReceived + RepliesReceived) / ViewCount * 100;
                ConversionRate = (double)(BookPurchasesInfluenced + WishlistAdditions) / ViewCount * 100;
            }

            if (TotalVotesReceived > 0)
            {
                DailyHelpfulnessRatio = (double)HelpfulVotesReceived / TotalVotesReceived;
            }

            // Calculate quality score (0-100)
            CalculateQualityScore();

            // Calculate engagement score (0-100)
            CalculateEngagementScore();

            // Calculate influence score (0-100)
            CalculateInfluenceScore();

            // Calculate virality score (0-100)
            CalculateViralityScore();

            // Calculate retention score (0-100)
            CalculateRetentionScore();
        }

        /// <summary>
        /// Calculates the quality score based on various metrics
        /// </summary>
        private void CalculateQualityScore()
        {
            var score = 0;

            // View quality (0-25 points)
            if (UniqueViewCount > 0)
            {
                var uniqueRatio = (double)UniqueViewCount / ViewCount;
                score += (int)(uniqueRatio * 25);
            }

            // Engagement quality (0-25 points)
            if (EngagementRate > 10) score += 25;
            else if (EngagementRate > 5) score += 15;
            else if (EngagementRate > 2) score += 10;
            else if (EngagementRate > 0) score += 5;

            // Helpfulness quality (0-25 points)
            if (DailyHelpfulnessRatio > 0.8) score += 25;
            else if (DailyHelpfulnessRatio > 0.6) score += 20;
            else if (DailyHelpfulnessRatio > 0.4) score += 15;
            else if (DailyHelpfulnessRatio > 0.2) score += 10;

            // Read time quality (0-25 points)
            if (AverageReadTime > 120) score += 25; // 2+ minutes
            else if (AverageReadTime > 60) score += 20; // 1+ minute
            else if (AverageReadTime > 30) score += 15; // 30+ seconds
            else if (AverageReadTime > 10) score += 10; // 10+ seconds

            QualityScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the engagement score based on user interactions
        /// </summary>
        private void CalculateEngagementScore()
        {
            var score = 0;

            // Click engagement (0-20 points)
            if (ClickThroughRate > 10) score += 20;
            else if (ClickThroughRate > 5) score += 15;
            else if (ClickThroughRate > 2) score += 10;
            else if (ClickThroughRate > 0) score += 5;

            // Social engagement (0-20 points)
            if (ShareCount > 10) score += 20;
            else if (ShareCount > 5) score += 15;
            else if (ShareCount > 2) score += 10;
            else if (ShareCount > 0) score += 5;

            // Vote engagement (0-20 points)
            if (TotalVotesReceived > 20) score += 20;
            else if (TotalVotesReceived > 10) score += 15;
            else if (TotalVotesReceived > 5) score += 10;
            else if (TotalVotesReceived > 0) score += 5;

            // Reply engagement (0-20 points)
            if (RepliesReceived > 10) score += 20;
            else if (RepliesReceived > 5) score += 15;
            else if (RepliesReceived > 2) score += 10;
            else if (RepliesReceived > 0) score += 5;

            // Bookmark engagement (0-20 points)
            if (BookmarkCount > 10) score += 20;
            else if (BookmarkCount > 5) score += 15;
            else if (BookmarkCount > 2) score += 10;
            else if (BookmarkCount > 0) score += 5;

            EngagementScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the influence score based on user behavior changes
        /// </summary>
        private void CalculateInfluenceScore()
        {
            var score = 0;

            // Purchase influence (0-40 points)
            if (BookPurchasesInfluenced > 10) score += 40;
            else if (BookPurchasesInfluenced > 5) score += 30;
            else if (BookPurchasesInfluenced > 2) score += 20;
            else if (BookPurchasesInfluenced > 0) score += 10;

            // Wishlist influence (0-20 points)
            if (WishlistAdditions > 20) score += 20;
            else if (WishlistAdditions > 10) score += 15;
            else if (WishlistAdditions > 5) score += 10;
            else if (WishlistAdditions > 0) score += 5;

            // Follow influence (0-20 points)
            if (ReviewerFollows > 10) score += 20;
            else if (ReviewerFollows > 5) score += 15;
            else if (ReviewerFollows > 2) score += 10;
            else if (ReviewerFollows > 0) score += 5;

            // Discovery influence (0-20 points)
            if (SimilarBookViews > 20) score += 20;
            else if (SimilarBookViews > 10) score += 15;
            else if (SimilarBookViews > 5) score += 10;
            else if (SimilarBookViews > 0) score += 5;

            InfluenceScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the virality score based on sharing and spread
        /// </summary>
        private void CalculateViralityScore()
        {
            var score = 0;

            // Share virality (0-40 points)
            if (ShareRate > 5) score += 40;
            else if (ShareRate > 2) score += 30;
            else if (ShareRate > 1) score += 20;
            else if (ShareRate > 0) score += 10;

            // Social media virality (0-30 points)
            if (SocialMediaViews > 100) score += 30;
            else if (SocialMediaViews > 50) score += 25;
            else if (SocialMediaViews > 20) score += 20;
            else if (SocialMediaViews > 10) score += 15;
            else if (SocialMediaViews > 0) score += 10;

            // Referral virality (0-30 points)
            if (ReferralViews > 50) score += 30;
            else if (ReferralViews > 25) score += 25;
            else if (ReferralViews > 10) score += 20;
            else if (ReferralViews > 5) score += 15;
            else if (ReferralViews > 0) score += 10;

            ViralityScore = Math.Min(100, score);
        }

        /// <summary>
        /// Calculates the retention score based on user attention and return behavior
        /// </summary>
        private void CalculateRetentionScore()
        {
            var score = 0;

            // Read time retention (0-30 points)
            if (AverageReadTime > 300) score += 30; // 5+ minutes
            else if (AverageReadTime > 180) score += 25; // 3+ minutes
            else if (AverageReadTime > 120) score += 20; // 2+ minutes
            else if (AverageReadTime > 60) score += 15; // 1+ minute
            else if (AverageReadTime > 30) score += 10; // 30+ seconds

            // Bounce rate retention (0-25 points)
            if (BounceRate < 20) score += 25;
            else if (BounceRate < 40) score += 20;
            else if (BounceRate < 60) score += 15;
            else if (BounceRate < 80) score += 10;
            else if (BounceRate < 90) score += 5;

            // Subsequent engagement retention (0-25 points)
            if (SubsequentReviewViews > 20) score += 25;
            else if (SubsequentReviewViews > 10) score += 20;
            else if (SubsequentReviewViews > 5) score += 15;
            else if (SubsequentReviewViews > 2) score += 10;
            else if (SubsequentReviewViews > 0) score += 5;

            // Session duration retention (0-20 points)
            if (AverageSessionDuration > 600) score += 20; // 10+ minutes
            else if (AverageSessionDuration > 300) score += 15; // 5+ minutes
            else if (AverageSessionDuration > 180) score += 10; // 3+ minutes
            else if (AverageSessionDuration > 60) score += 5; // 1+ minute

            RetentionScore = Math.Min(100, score);
        }

        /// <summary>
        /// Validates the analytics data
        /// </summary>
        /// <returns>List of validation errors</returns>
        public List<string> Validate()
        {
            var errors = new List<string>();

            if (ReviewId <= 0)
                errors.Add("Valid review ID is required");

            if (AnalyticsDate > DateTime.UtcNow.Date)
                errors.Add("Analytics date cannot be in the future");

            if (ViewCount < 0)
                errors.Add("View count cannot be negative");

            if (UniqueViewCount > ViewCount)
                errors.Add("Unique view count cannot exceed total view count");

            if (AverageReadTime < 0)
                errors.Add("Average read time cannot be negative");

            if (BounceRate < 0 || BounceRate > 100)
                errors.Add("Bounce rate must be between 0 and 100");

            return errors;
        }

        /// <summary>
        /// Prepares the analytics for database insertion/update
        /// </summary>
        public void PrepareForSave()
        {
            CalculateMetrics();
            
            if (UpdatedAt == null && CreatedAt != default)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            ProcessedAt = DateTime.UtcNow;
        }
    }
}