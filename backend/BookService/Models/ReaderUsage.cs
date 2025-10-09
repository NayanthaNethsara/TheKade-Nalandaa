using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookService.Models
{
    [Table("reader_usages")]
    public class ReaderUsage
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("period_type")]
        public string PeriodType { get; set; } = null!; // "daily" or "monthly"

        [Required]
        [Column("period_start")]
        public DateTime PeriodStart { get; set; }

        [Required]
        [Column("used_count")]
        public int UsedCount { get; set; }

        [Column("reset_at")]
        public DateTime ResetAt { get; set; }
    }
}
