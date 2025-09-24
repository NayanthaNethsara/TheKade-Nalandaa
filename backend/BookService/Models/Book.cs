using System;
using System.Collections.Generic;

namespace BookService.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        // Author info from AuthService
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = null!;

        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for chunks
        public ICollection<BookChunk> Chunks { get; set; } = new List<BookChunk>();
    }
}
