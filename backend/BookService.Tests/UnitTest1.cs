using Xunit;
using Microsoft.EntityFrameworkCore;
using BookService.Data;
using BookService.Repositories;
using BookService.Services;
using BookService.Models;
using BookService.Dtos;

namespace BookService.Tests
{
    public class BookServiceTests : IDisposable
    {
        private readonly BookDbContext _context;
        private readonly IBookRepository _bookRepository;
        private readonly IBookService _bookService;

        public BookServiceTests()
        {
            var options = new DbContextOptionsBuilder<BookDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new BookDbContext(options);
            _bookRepository = new BookRepository(_context);
            _bookService = new BookServiceImpl(_bookRepository);
        }

        [Fact]
        public async Task CreateBookAsync_ShouldCreateBookSuccessfully()
        {
            // Arrange
            var createDto = new BookCreateDto(
                "Test Book",
                "Test Description",
                1,
                "Test Author",
                new List<string> { "/chunks/chunk1.pdf", "/chunks/chunk2.pdf" },
                "test-book",
                "/images/test.jpg"
            );

            // Act
            var result = await _bookService.CreateBookAsync(createDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Book", result.Title);
            Assert.Equal("Test Description", result.Description);
            Assert.Equal(1, result.AuthorId);
            Assert.Equal("Test Author", result.AuthorName);
            Assert.Equal("test-book", result.TitleSlug);
            Assert.Equal("/images/test.jpg", result.CoverImagePath);

            // Verify book was saved to database
            var savedBook = await _context.Books.Include(b => b.Chunks).FirstOrDefaultAsync(b => b.Id == result.Id);
            Assert.NotNull(savedBook);
            Assert.Equal(2, savedBook!.Chunks.Count);
        }

        [Fact]
        public async Task GetAllBooksAsync_ShouldReturnEmptyList_WhenNoBooksExist()
        {
            // Act
            var result = await _bookService.GetAllBooksAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllBooksAsync_ShouldReturnAllBooks_WhenBooksExist()
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
            var result = await _bookService.GetAllBooksAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, b => b.Title == "Book 1" && b.AuthorName == "Author 1");
            Assert.Contains(result, b => b.Title == "Book 2" && b.AuthorName == "Author 2");
        }

        [Fact]
        public async Task GetBookByIdAsync_ShouldReturnBook_WhenBookExists()
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

            // Act
            var result = await _bookService.GetBookByIdAsync(book.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Book", result.Title);
            Assert.Equal("Test Description", result.Description);
            Assert.Equal(1, result.AuthorId);
            Assert.Equal("Test Author", result.AuthorName);
            Assert.Equal("/chunks/chunk1.pdf", result.ChunkPath);
        }

        [Fact]
        public async Task GetBookByIdAsync_ShouldReturnNull_WhenBookDoesNotExist()
        {
            // Act
            var result = await _bookService.GetBookByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateBookAsync_ShouldUpdateBook_WhenBookExists()
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

            var updateDto = new BookCreateDto(
                "Updated Title",
                "Updated Description",
                1,
                "Original Author",
                new List<string>(),
                "updated-title",
                "/images/updated.jpg"
            );

            // Act
            var result = await _bookService.UpdateBookAsync(book.Id, updateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Title", result.Title);
            Assert.Equal("Updated Description", result.Description);
            Assert.Equal("updated-title", result.TitleSlug);
            Assert.Equal("/images/updated.jpg", result.CoverImagePath);

            // Verify database was updated
            var updatedBook = await _context.Books.FindAsync(book.Id);
            Assert.Equal("Updated Title", updatedBook!.Title);
        }

        [Fact]
        public async Task UpdateBookAsync_ShouldReturnNull_WhenBookDoesNotExist()
        {
            // Arrange
            var updateDto = new BookCreateDto(
                "Updated Title",
                "Updated Description",
                1,
                "Author",
                new List<string>(),
                "updated-title",
                "/images/updated.jpg"
            );

            // Act
            var result = await _bookService.UpdateBookAsync(999, updateDto);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteBookAsync_ShouldDeleteBook_WhenBookExists()
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
            var result = await _bookService.DeleteBookAsync(book.Id);

            // Assert
            Assert.True(result);

            // Verify book was deleted from database
            var deletedBook = await _context.Books.FindAsync(book.Id);
            Assert.Null(deletedBook);
        }

        [Fact]
        public async Task DeleteBookAsync_ShouldReturnFalse_WhenBookDoesNotExist()
        {
            // Act
            var result = await _bookService.DeleteBookAsync(999);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task CreateBookAsync_ShouldCreateBookWithChunks_WhenChunkUrlsProvided()
        {
            // Arrange
            var createDto = new BookCreateDto(
                "Book with Chunks",
                "Description",
                1,
                "Author",
                new List<string>
                {
                    "/chunks/chunk1.pdf",
                    "/chunks/chunk2.pdf",
                    "/chunks/chunk3.pdf"
                },
                "book-with-chunks",
                "/images/cover.jpg"
            );

            // Act
            var result = await _bookService.CreateBookAsync(createDto);

            // Assert
            Assert.NotNull(result);

            // Verify chunks were created
            var savedBook = await _context.Books
                .Include(b => b.Chunks)
                .FirstOrDefaultAsync(b => b.Id == result.Id);

            Assert.NotNull(savedBook);
            Assert.Equal(3, savedBook.Chunks.Count);
            Assert.Contains(savedBook.Chunks, c => c.ChunkNumber == 1 && c.StoragePath == "/chunks/chunk1.pdf");
            Assert.Contains(savedBook.Chunks, c => c.ChunkNumber == 2 && c.StoragePath == "/chunks/chunk2.pdf");
            Assert.Contains(savedBook.Chunks, c => c.ChunkNumber == 3 && c.StoragePath == "/chunks/chunk3.pdf");
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
