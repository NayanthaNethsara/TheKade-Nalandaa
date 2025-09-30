using Xunit;
using Microsoft.EntityFrameworkCore;
using BookService.Data;
using BookService.Repositories;
using BookService.Models;

namespace BookService.Tests
{
    public class BookRepositoryTests : IDisposable
    {
        private readonly BookDbContext _context;
        private readonly IBookRepository _bookRepository;

        public BookRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<BookDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new BookDbContext(options);
            _bookRepository = new BookRepository(_context);
        }

        [Fact]
        public async Task AddAsync_ShouldAddBookToDatabase()
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

            // Act
            var result = await _bookRepository.AddAsync(book);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.Equal("Test Book", result.Title);

            // Verify it was saved to the database
            var savedBook = await _context.Books.FindAsync(result.Id);
            Assert.NotNull(savedBook);
            Assert.Equal("Test Book", savedBook.Title);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnBook_WhenBookExists()
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
                    new BookChunk { ChunkNumber = 2, StoragePath = "/chunks/chunk2.pdf" }
                }
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _bookRepository.GetByIdAsync(book.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(book.Id, result.Id);
            Assert.Equal("Test Book", result.Title);
            Assert.Equal(2, result.Chunks.Count);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenBookDoesNotExist()
        {
            // Act
            var result = await _bookRepository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoBooksExist()
        {
            // Act
            var result = await _bookRepository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllBooks_WhenBooksExist()
        {
            // Arrange
            var book1 = new Book
            {
                Title = "Book 1",
                Description = "Description 1",
                AuthorId = 1,
                AuthorName = "Author 1",
                TitleSlug = "book-1",
                CoverImagePath = "/images/book1.jpg"
            };

            var book2 = new Book
            {
                Title = "Book 2",
                Description = "Description 2",
                AuthorId = 2,
                AuthorName = "Author 2",
                TitleSlug = "book-2",
                CoverImagePath = "/images/book2.jpg"
            };

            await _context.Books.AddRangeAsync(book1, book2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _bookRepository.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, b => b.Title == "Book 1");
            Assert.Contains(result, b => b.Title == "Book 2");
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateBook_WhenBookExists()
        {
            // Arrange
            var book = new Book
            {
                Title = "Original Title",
                Description = "Original Description",
                AuthorId = 1,
                AuthorName = "Original Author",
                TitleSlug = "original-title",
                CoverImagePath = "/images/original.jpg"
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Modify the book
            book.Title = "Updated Title";
            book.Description = "Updated Description";
            book.TitleSlug = "updated-title";

            // Act
            var result = await _bookRepository.UpdateAsync(book);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Title", result.Title);
            Assert.Equal("Updated Description", result.Description);
            Assert.Equal("updated-title", result.TitleSlug);

            // Verify in database
            var updatedBook = await _context.Books.FindAsync(book.Id);
            Assert.Equal("Updated Title", updatedBook!.Title);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteBook_WhenBookExists()
        {
            // Arrange
            var book = new Book
            {
                Title = "Book to Delete",
                Description = "Description",
                AuthorId = 1,
                AuthorName = "Author",
                TitleSlug = "book-to-delete",
                CoverImagePath = "/images/delete.jpg"
            };

            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _bookRepository.DeleteAsync(book.Id);

            // Assert
            Assert.True(result);

            // Verify book was deleted
            var deletedBook = await _context.Books.FindAsync(book.Id);
            Assert.Null(deletedBook);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenBookDoesNotExist()
        {
            // Act
            var result = await _bookRepository.DeleteAsync(999);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddBookWithChunks()
        {
            // Arrange
            var book = new Book
            {
                Title = "Book with Chunks",
                Description = "Description",
                AuthorId = 1,
                AuthorName = "Author",
                TitleSlug = "book-with-chunks",
                CoverImagePath = "/images/cover.jpg",
                Chunks = new List<BookChunk>
                {
                    new BookChunk { ChunkNumber = 1, StoragePath = "/chunks/chunk1.pdf" },
                    new BookChunk { ChunkNumber = 2, StoragePath = "/chunks/chunk2.pdf" },
                    new BookChunk { ChunkNumber = 3, StoragePath = "/chunks/chunk3.pdf" }
                }
            };

            // Act
            var result = await _bookRepository.AddAsync(book);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);

            // Verify chunks were saved
            var savedBook = await _context.Books
                .Include(b => b.Chunks)
                .FirstOrDefaultAsync(b => b.Id == result.Id);

            Assert.NotNull(savedBook);
            Assert.Equal(3, savedBook.Chunks.Count);
            Assert.All(savedBook.Chunks, chunk => Assert.True(chunk.BookId == savedBook.Id));
        }

        [Fact]
        public async Task GetByIdAsync_ShouldIncludeAllChunks()
        {
            // Arrange
            var book = new Book
            {
                Title = "Book with Chunks",
                Description = "Description",
                AuthorId = 1,
                AuthorName = "Author",
                TitleSlug = "book-with-chunks",
                CoverImagePath = "/images/cover.jpg",
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
            var result = await _bookRepository.GetByIdAsync(book.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Chunks.Count);

            // Verify all chunk numbers are present
            var chunkNumbers = result.Chunks.Select(c => c.ChunkNumber).ToList();
            Assert.Contains(1, chunkNumbers);
            Assert.Contains(2, chunkNumbers);
            Assert.Contains(3, chunkNumbers);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}