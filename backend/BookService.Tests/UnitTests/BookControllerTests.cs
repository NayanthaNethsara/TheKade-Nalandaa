using System.Collections.Generic;
using System.Threading.Tasks;
using BookService.Controllers;
using BookService.Dtos;
using BookService.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BookService.Tests
{
    public class BooksControllerTests
    {
        private readonly Mock<IBookService> _bookServiceMock;
        private readonly BooksController _controller;

        public BooksControllerTests()
        {
            _bookServiceMock = new Mock<IBookService>();
            _controller = new BooksController(_bookServiceMock.Object);
        }

        // Get All Books
        [Fact]
        public async Task GetAll_ReturnsOkWithBooks()
        {
            var books = new List<BookDto>  // fake book list
            {
                new BookDto(1, "Book 1", "Desc 1", 101, "Author A", "book-1", "/cover1.png"),
                new BookDto(2, "Book 2", "Desc 2", 102, "Author B", "book-2", "/cover2.png")
            };

            _bookServiceMock.Setup(s => s.GetAllBooksAsync()).ReturnsAsync(books); // mocking the service

            var result = await _controller.GetAll() as OkObjectResult;

            Assert.NotNull(result);  // check outcome
            var data = Assert.IsType<List<BookDto>>(result.Value);
            Assert.Equal(2, data.Count);  // book count
        } 

        // Get By Id
        [Fact]
        public async Task GetById_BookExists_ReturnsOk()
        {
            var book = new BookDto(1, "Book 1", "Desc 1", 101, "Author A", "book-1", "/cover1.png");
            _bookServiceMock.Setup(s => s.GetBookByIdAsync(1)).ReturnsAsync(book);

            var result = await _controller.GetById(1) as OkObjectResult;

            Assert.NotNull(result);
            var data = Assert.IsType<BookDto>(result.Value);
            Assert.Equal(1, data.Id);
        }

        // Edge case
        [Fact]
        public async Task GetById_BookNotFound_ReturnsNotFound()
        {
            _bookServiceMock.Setup(s => s.GetBookByIdAsync(1)).ReturnsAsync((BookDto?)null);

            var result = await _controller.GetById(1);

            Assert.IsType<NotFoundResult>(result);
        }

        // Create
        [Fact]
        public async Task Create_ReturnsCreatedBook()
        {
            var dto = new BookCreateDto(
                "Book 1", "Desc 1", 101, "Author A",
                new List<string> { "/chunk1", "/chunk2" },
                "book-1", "/cover1.png"
            );

            var created = new BookDto(1, dto.Title, dto.Description, dto.AuthorId, dto.AuthorName, dto.TitleSlug, dto.CoverImagePath);
            _bookServiceMock.Setup(s => s.CreateBookAsync(dto)).ReturnsAsync(created);

            var result = await _controller.Create(dto) as CreatedAtActionResult;

            Assert.NotNull(result);
            var data = Assert.IsType<BookDto>(result.Value);
            Assert.Equal(1, data.Id);
            Assert.Equal("Book 1", data.Title);
            Assert.Equal(nameof(BooksController.GetById), result.ActionName);
        }

        // Update
        [Fact]
        public async Task Update_BookExists_ReturnsUpdatedBook()
        {
            var dto = new BookCreateDto("Updated", "Desc", 101, "Author A", new List<string>(), "updated-slug", "/cover.png");
            var updatedBook = new BookDto(1, dto.Title, dto.Description, dto.AuthorId, dto.AuthorName, dto.TitleSlug, dto.CoverImagePath);

            _bookServiceMock.Setup(s => s.UpdateBookAsync(1, dto)).ReturnsAsync(updatedBook);

            var result = await _controller.Update(1, dto) as OkObjectResult;

            Assert.NotNull(result);
            var data = Assert.IsType<BookDto>(result.Value);
            Assert.Equal("Updated", data.Title);
        }

        // Edge case
        [Fact]
        public async Task Update_BookNotFound_ReturnsNotFound()
        {
            var dto = new BookCreateDto("Updated", "Desc", 101, "Author A", new List<string>(), "updated-slug", "/cover.png");
            _bookServiceMock.Setup(s => s.UpdateBookAsync(1, dto)).ReturnsAsync((BookDto?)null);

            var result = await _controller.Update(1, dto);

            Assert.IsType<NotFoundResult>(result);
        }

        // Delete
        [Fact]
        public async Task Delete_BookExists_ReturnsNoContent()
        {
            _bookServiceMock.Setup(s => s.DeleteBookAsync(1)).ReturnsAsync(true);

            var result = await _controller.Delete(1);

            Assert.IsType<NoContentResult>(result);
        }

        // Edge case
        [Fact]
        public async Task Delete_BookNotFound_ReturnsNotFound()
        {
            _bookServiceMock.Setup(s => s.DeleteBookAsync(1)).ReturnsAsync(false);

            var result = await _controller.Delete(1);

            Assert.IsType<NotFoundResult>(result);
        }

        // Get Chunk
        [Fact]
        public async Task GetChunk_ChunkExists_ReturnsOk()
        {
            var chunk = new BookChunkDto(1, 1, "/chunk1");
            _bookServiceMock.Setup(s => s.GetChunkAsync(1, 1)).ReturnsAsync(chunk);

            var result = await _controller.GetChunk(1, 1) as OkObjectResult;

            Assert.NotNull(result);
            var data = Assert.IsType<BookChunkDto>(result.Value);
            Assert.Equal(1, data.ChunkNumber);
        }

        // Edge case
        [Fact]
        public async Task GetChunk_BookNotFound_ReturnsNotFound()
        {
            _bookServiceMock.Setup(s => s.GetChunkAsync(1, 1)).ReturnsAsync((BookChunkDto?)null);

            var result = await _controller.GetChunk(1, 1);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
