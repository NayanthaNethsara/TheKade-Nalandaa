using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookService.Models
{
    [Table("books")]
    public class Book
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = null!;

        [Required]
        [Column("title_slug")]
        public string TitleSlug { get; set; } = null!;

        [Required]
        [Column("cover_image")]
        public string CoverImagePath { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("author_id")]
        public int AuthorId { get; set; }

        [Required]
        [Column("author_name")]
        public string AuthorName { get; set; } = null!;

        [Column("is_approved")]
        public bool IsApproved { get; set; } = false;

        

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("is_premium")]
        public bool IsPremium { get; set; } = false;

        public ICollection<BookChunk> Chunks { get; set; } = new List<BookChunk>();
    }
}
