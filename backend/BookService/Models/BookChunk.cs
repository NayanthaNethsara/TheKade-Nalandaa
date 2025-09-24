using System;

namespace BookService.Models
{
    public class BookChunk
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int ChunkNumber { get; set; }
        public byte[] Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Book Book { get; set; } = null!;
    }
}
