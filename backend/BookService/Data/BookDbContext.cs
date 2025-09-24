using BookService.Models;
using Microsoft.EntityFrameworkCore;

namespace BookService.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<BookChunk> BookChunks => Set<BookChunk>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Book entity
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Title).IsRequired().HasMaxLength(250);
                entity.Property(b => b.Description).HasMaxLength(2000);
                entity.Property(b => b.AuthorName).IsRequired();
                entity.Property(b => b.IsApproved).HasDefaultValue(false);
                entity.Property(b => b.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(b => b.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            // BookChunk entity
            modelBuilder.Entity<BookChunk>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.ChunkNumber).IsRequired();
                entity.Property(c => c.Content).IsRequired(); // store PDF page chunk as base64 or binary
                entity.HasOne(c => c.Book)
                      .WithMany(b => b.Chunks)
                      .HasForeignKey(c => c.BookId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
