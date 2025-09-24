using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookService.Models
{
    [Table("book_chunks")]
    public class BookChunk
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("book_id")]
        public int BookId { get; set; }

        [Required]
        [Column("chunk_number")]
        public int ChunkNumber { get; set; }

        [Required]
        [Column("start_page")]
        public int StartPage { get; set; }

        [Required]
        [Column("end_page")]
        public int EndPage { get; set; }

        [Required]
        [Column("storage_path")]
        public string StoragePath { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("BookId")]
        public Book Book { get; set; } = null!;
    }
}
