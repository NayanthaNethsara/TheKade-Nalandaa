using Microsoft.EntityFrameworkCore;
using BookService.Models;

namespace BookService.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; } = null!;
        public DbSet<BookChunk> BookChunks { get; set; } = null!;
        public DbSet<BookReview> BookReviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Book → BookChunk relationship
            modelBuilder.Entity<Book>()
                .HasMany(b => b.Chunks)
                .WithOne(c => c.Book)
                .HasForeignKey(c => c.BookId)
                .OnDelete(DeleteBehavior.Cascade); // deleting a book deletes its chunks

            // Book → BookReview relationship
            modelBuilder.Entity<Book>()
                .HasMany<BookReview>()
                .WithOne(r => r.Book)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade); // deleting a book deletes its reviews

            // Ensure one review per user per book
            modelBuilder.Entity<BookReview>()
                .HasIndex(r => new { r.BookId, r.UserId })
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
