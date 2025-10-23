using Microsoft.EntityFrameworkCore;
using BookService.Models;

namespace BookService.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; } = null!;
        public DbSet<BookChunk> BookChunks { get; set; } = null!;
        public DbSet<Models.Bookmark> Bookmarks { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Book → BookChunk relationship
            modelBuilder.Entity<Book>()
                .HasMany(b => b.Chunks)
                .WithOne(c => c.Book)
                .HasForeignKey(c => c.BookId)
                .OnDelete(DeleteBehavior.Cascade); // deleting a book deletes its chunks

            // Book -> Bookmark (many) relationship
            modelBuilder.Entity<Book>()
                .HasMany<Models.Bookmark>()
                .WithOne(bm => bm.Book)
                .HasForeignKey(bm => bm.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
