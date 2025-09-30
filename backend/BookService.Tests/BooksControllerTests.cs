using Xunit;
using Microsoft.AspNetCore.Mvc;
using Moq;
using BookService.Controllers;
using BookService.Services;
using BookService.Dtos;

namespace BookService.Tests
{
    public class BooksControllerTests
    {
        private readonly Mock<IBookService> _mockBookService;
        private readonly BooksController _controller;

        public BooksControllerTests()
        {
            _mockBookService = new Mock<IBookService>();
            _controller = new BooksController(_mockBookService.Object);
        }

        [Fact]
        public async Task GetAll_ShouldReturnOkResult_WithBookList()
        {
            // Arrange
            var books = new List<BookDto>
            {
                new BookDto(1, "Book 1", "Description 1", 1, "Author 1", "book-1", "/images/book1.jpg"),
                new BookDto(2, "Book 2", "Description 2", 2, "Author 2", "book-2", "/images/book2.jpg")
            };

            _mockBookService.Setup(s => s.GetAllBooksAsync())
                .ReturnsAsync(books);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooks = Assert.IsType<List<BookDto>>(okResult.Value);
            Assert.Equal(2, returnedBooks.Count);
            Assert.Equal("Book 1", returnedBooks[0].Title);
            Assert.Equal("Book 2", returnedBooks[1].Title);
        }

        [Fact]
        public async Task GetAll_ShouldReturnOkResult_WithEmptyList_WhenNoBooksExist()
        {
            // Arrange
            _mockBookService.Setup(s => s.GetAllBooksAsync())
                .ReturnsAsync(new List<BookDto>());

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBooks = Assert.IsType<List<BookDto>>(okResult.Value);
            Assert.Empty(returnedBooks);
        }

        [Fact]
        public async Task GetById_ShouldReturnOkResult_WhenBookExists()
        {
            // Arrange
            var bookId = 1;
            var book = new BookWithChunkDto(
                bookId,
                "Test Book",
                "Test Description",
                1,
                "Test Author",
                "test-book",
                "/images/test.jpg",
                "/chunks/chunk1.pdf"
            );

            _mockBookService.Setup(s => s.GetBookByIdAsync(bookId))
                .ReturnsAsync(book);

            // Act
            var result = await _controller.GetById(bookId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedBook = Assert.IsType<BookWithChunkDto>(okResult.Value);
            Assert.Equal(bookId, returnedBook.Id);
            Assert.Equal("Test Book", returnedBook.Title);
        }

        [Fact]
        public async Task GetById_ShouldReturnNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            var bookId = 999;
            _mockBookService.Setup(s => s.GetBookByIdAsync(bookId))
                .ReturnsAsync((BookWithChunkDto?)null);

            // Act
            var result = await _controller.GetById(bookId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ShouldReturnCreatedResult_WithValidBook()
        {
            // Arrange
            var createDto = new BookCreateDto(
                "New Book",
                "New Description",
                1,
                "New Author",
                new List<string> { "/chunks/chunk1.pdf" },
                "new-book",
                "/images/new.jpg"
            );

            var createdBook = new BookDto(
                1,
                "New Book",
                "New Description",
                1,
                "New Author",
                "new-book",
                "/images/new.jpg"
            );

            _mockBookService.Setup(s => s.CreateBookAsync(createDto))
                .ReturnsAsync(createdBook);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(BooksController.GetById), createdResult.ActionName);
            Assert.Equal(createdBook.Id, createdResult.RouteValues!["id"]);

            var returnedBook = Assert.IsType<BookDto>(createdResult.Value);
            Assert.Equal("New Book", returnedBook.Title);
        }

        [Fact]
        public async Task GetChunk_ShouldReturnOkResult_WhenChunkExists()
        {
            // Arrange
            var bookId = 1;
            var chunkNumber = 2;
            var chunk = new BookChunkDto(1, chunkNumber, "/chunks/chunk2.pdf");

            _mockBookService.Setup(s => s.GetChunkAsync(bookId, chunkNumber))
                .ReturnsAsync(chunk);

            // Act
            var result = await _controller.GetChunk(bookId, chunkNumber);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedChunk = Assert.IsType<BookChunkDto>(okResult.Value);
            Assert.Equal(1, returnedChunk.Id);
            Assert.Equal(chunkNumber, returnedChunk.ChunkNumber);
            Assert.Equal("/chunks/chunk2.pdf", returnedChunk.FileUrl);
        }

        [Fact]
        public async Task GetChunk_ShouldReturnNotFound_WhenChunkDoesNotExist()
        {
            // Arrange
            var bookId = 1;
            var chunkNumber = 999;
            _mockBookService.Setup(s => s.GetChunkAsync(bookId, chunkNumber))
                .ReturnsAsync((BookChunkDto?)null);

            // Act
            var result = await _controller.GetChunk(bookId, chunkNumber);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ShouldCallServiceOnce_WithCorrectDto()
        {
            // Arrange
            var createDto = new BookCreateDto(
                "Test Book",
                "Test Description",
                1,
                "Test Author",
                new List<string>(),
                "test-book",
                "/images/test.jpg"
            );

            var createdBook = new BookDto(1, "Test Book", "Test Description", 1, "Test Author", "test-book", "/images/test.jpg");

            _mockBookService.Setup(s => s.CreateBookAsync(It.IsAny<BookCreateDto>()))
                .ReturnsAsync(createdBook);

            // Act
            await _controller.Create(createDto);

            // Assert
            _mockBookService.Verify(s => s.CreateBookAsync(It.Is<BookCreateDto>(dto =>
                dto.Title == "Test Book" &&
                dto.AuthorName == "Test Author" &&
                dto.TitleSlug == "test-book")), Times.Once);
        }

        [Fact]
        public async Task GetById_ShouldCallServiceOnce_WithCorrectId()
        {
            // Arrange
            var bookId = 42;
            _mockBookService.Setup(s => s.GetBookByIdAsync(bookId))
                .ReturnsAsync((BookWithChunkDto?)null);

            // Act
            await _controller.GetById(bookId);

            // Assert
            _mockBookService.Verify(s => s.GetBookByIdAsync(42), Times.Once);
        }

        [Fact]
        public async Task GetChunk_ShouldCallServiceOnce_WithCorrectParameters()
        {
            // Arrange
            var bookId = 5;
            var chunkNumber = 3;
            _mockBookService.Setup(s => s.GetChunkAsync(bookId, chunkNumber))
                .ReturnsAsync((BookChunkDto?)null);

            // Act
            await _controller.GetChunk(bookId, chunkNumber);

            // Assert
            _mockBookService.Verify(s => s.GetChunkAsync(5, 3), Times.Once);
        }
    }
}