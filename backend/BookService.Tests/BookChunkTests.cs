using Xunit;
using Microsoft.EntityFrameworkCore;
using BookService.Data;
using BookService.Repositories;
using BookService.Models;

namespace BookService.Tests
{
    public class BookChunkRepositoryTests : IDisposable
    {
        private readonly BookDbContext _context;
        private readonly IBookChunkRepository _chunkRepository;

        public BookChunkRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<BookDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new BookDbContext(options);
            _chunkRepository = new BookChunkRepository(_context);
        }

        [Fact]
        public async Task GetByBookIdAsync_ShouldReturnChunks_WhenChunksExist()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg",
                Chunks = new List<BookChunk>
                {
                    new BookChunk { ChunkNumber = 1, StoragePath = "/chunks/chunk1.pdf" },
                    new BookChunk { ChunkNumber = 2, StoragePath = "/chunks/chunk2.pdf" },
                    new BookChunk { ChunkNumber = 3, StoragePath = "/chunks/chunk3.pdf" }
                }
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _chunkRepository.GetByBookIdAsync(book.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count());
            Assert.Contains(result, c => c.ChunkNumber == 2 && c.StoragePath == "/chunks/chunk2.pdf");
        }

        [Fact]
        public async Task GetByBookIdAsync_ShouldReturnEmptyCollection_WhenBookHasNoChunks()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg",
                Chunks = new List<BookChunk>()
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _chunkRepository.GetByBookIdAsync(book.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetByBookIdAsync_ShouldReturnEmptyCollection_WhenBookDoesNotExist()
        {
            // Act
            var result = await _chunkRepository.GetByBookIdAsync(999);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnChunk_WhenChunkExists()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg",
                Chunks = new List<BookChunk>
                {
                    new BookChunk { ChunkNumber = 1, StoragePath = "/chunks/chunk1.pdf" }
                }
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            var chunkId = book.Chunks.First().Id;

            // Act
            var result = await _chunkRepository.GetByIdAsync(chunkId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(chunkId, result.Id);
            Assert.Equal(1, result.ChunkNumber);
            Assert.Equal("/chunks/chunk1.pdf", result.StoragePath);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenChunkDoesNotExist()
        {
            // Act
            var result = await _chunkRepository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddChunkToBook()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg"
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            var chunk = new BookChunk
            {
                BookId = book.Id,
                ChunkNumber = 1,
                StoragePath = "/chunks/new-chunk.pdf"
            };

            // Act
            var result = await _chunkRepository.AddAsync(chunk);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.Equal(book.Id, result.BookId);
            Assert.Equal(1, result.ChunkNumber);
            Assert.Equal("/chunks/new-chunk.pdf", result.StoragePath);

            // Verify it was saved to database
            var savedChunk = await _context.BookChunks.FindAsync(result.Id);
            Assert.NotNull(savedChunk);
            Assert.Equal("/chunks/new-chunk.pdf", savedChunk.StoragePath);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateExistingChunk()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg",
                Chunks = new List<BookChunk>
                {
                    new BookChunk { ChunkNumber = 1, StoragePath = "/chunks/original.pdf" }
                }
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            var chunk = book.Chunks.First();
            chunk.StoragePath = "/chunks/updated.pdf";

            // Act
            await _chunkRepository.UpdateAsync(chunk);

            // Assert - Verify in database
            var updatedChunk = await _context.BookChunks.FindAsync(chunk.Id);
            Assert.NotNull(updatedChunk);
            Assert.Equal("/chunks/updated.pdf", updatedChunk.StoragePath);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteChunk_WhenChunkExists()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg",
                Chunks = new List<BookChunk>
                {
                    new BookChunk { ChunkNumber = 1, StoragePath = "/chunks/to-delete.pdf" }
                }
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            var chunkId = book.Chunks.First().Id;

            // Act
            await _chunkRepository.DeleteAsync(chunkId);

            // Assert - Verify chunk was deleted
            var deletedChunk = await _context.BookChunks.FindAsync(chunkId);
            Assert.Null(deletedChunk);
        }

        [Fact]
        public async Task GetByBookIdAsync_ShouldReturnChunksOrderedByChunkNumber()
        {
            // Arrange
            var book = new Book
            {
                Title = "Test Book",
                Description = "Test Description",
                AuthorId = 1,
                AuthorName = "Test Author",
                TitleSlug = "test-book",
                CoverImagePath = "/images/test.jpg",
                Chunks = new List<BookChunk>
                {
                    new BookChunk { ChunkNumber = 3, StoragePath = "/chunks/chunk3.pdf" },
                    new BookChunk { ChunkNumber = 1, StoragePath = "/chunks/chunk1.pdf" },
                    new BookChunk { ChunkNumber = 2, StoragePath = "/chunks/chunk2.pdf" }
                }
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _chunkRepository.GetByBookIdAsync(book.Id);
            var chunks = result.ToList();

            // Assert
            Assert.Equal(3, chunks.Count);

            // Verify chunks are ordered by ChunkNumber
            Assert.Equal(1, chunks[0].ChunkNumber);
            Assert.Equal(2, chunks[1].ChunkNumber);
            Assert.Equal(3, chunks[2].ChunkNumber);

            // Verify storage paths
            Assert.Equal("/chunks/chunk1.pdf", chunks[0].StoragePath);
            Assert.Equal("/chunks/chunk2.pdf", chunks[1].StoragePath);
            Assert.Equal("/chunks/chunk3.pdf", chunks[2].StoragePath);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}