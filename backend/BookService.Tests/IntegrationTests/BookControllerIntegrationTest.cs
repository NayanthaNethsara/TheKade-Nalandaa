using BookService.Controllers;
using BookService.Data;
using BookService.Dtos;
using BookService.Repositories;
using BookService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace IntegrationTests
{
    public class BookControllerIntegrationTest
    {
        private BooksController GetController(out BookDbContext db)
        {
            var options = new DbContextOptionsBuilder<BookDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // fresh database for each test
                .Options;

            db = new BookDbContext(options);

            var repo = new BookRepository(db);
            var service = new BookServiceImpl(repo);

            return new BooksController(service);
        }

        [Fact]
        public async Task GetAll_ReturnsEmptyInitially()
        {
            var controller = GetController(out _);

            var result = await controller.GetAll() as OkObjectResult;

            Assert.NotNull(result);
            var books = Assert.IsType<List<BookDto>>(result.Value);
            Assert.Empty(books);
        }

        [Fact]
        public async Task Create_Then_GetById_Works()
        {
            var controller = GetController(out _);

            var dto = new BookCreateDto(
                "Test Title", "Description", 1, "Author",
                new List<string> { "chunk1.pdf", "chunk2.pdf" },
                "test-title", "cover.jpg"
            );

            var createResult = await controller.Create(dto) as CreatedAtActionResult;
            Assert.NotNull(createResult);

            var created = Assert.IsType<BookDto>(createResult.Value);

            var getResult = await controller.GetById(created.Id) as OkObjectResult;
            Assert.NotNull(getResult);

            var fetched = Assert.IsType<BookDto>(getResult.Value);
            Assert.Equal("Test Title", fetched.Title);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenMissing()
        {
            var controller = GetController(out _);

            var result = await controller.GetById(999);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Update_ChangesBookData()
        {
            var controller = GetController(out _);

            var dto = new BookCreateDto(
                "Original", "Desc", 1, "Author",
                new List<string>(), "original", "cover.jpg"
            );

            var createResult = await controller.Create(dto) as CreatedAtActionResult;
            var created = Assert.IsType<BookDto>(createResult!.Value);

            var updateDto = new BookCreateDto(
                "Updated", "Updated Desc", 1, "Author",
                new List<string>(), "updated", "cover2.jpg"
            );

            var updateResult = await controller.Update(created.Id, updateDto) as OkObjectResult;
            Assert.NotNull(updateResult);

            var updated = Assert.IsType<BookDto>(updateResult.Value);
            Assert.Equal("Updated", updated.Title);
            Assert.Equal("cover2.jpg", updated.CoverImagePath);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenBookMissing()
        {
            var controller = GetController(out _);

            var dto = new BookCreateDto(
                "Title", "Desc", 1, "Author",
                new List<string>(), "slug", "cover.jpg"
            );

            var result = await controller.Update(999, dto);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Delete_RemovesBook()
        {
            var controller = GetController(out _);

            var dto = new BookCreateDto(
                "DeleteMe", "Desc", 1, "Author",
                new List<string>(), "slug", "cover.jpg"
            );

            var createResult = await controller.Create(dto) as CreatedAtActionResult;
            var created = Assert.IsType<BookDto>(createResult!.Value);

            var deleteResult = await controller.Delete(created.Id);
            Assert.IsType<NoContentResult>(deleteResult);

            var getResult = await controller.GetById(created.Id);
            Assert.IsType<NotFoundResult>(getResult);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenBookMissing()
        {
            var controller = GetController(out _);

            var result = await controller.Delete(999);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetChunk_ReturnsSpecificChunk()
        {
            var controller = GetController(out _);

            var dto = new BookCreateDto(
                "ChunkBook", "Desc", 1, "Author",
                new List<string> { "chunk1.pdf", "chunk2.pdf" },
                "slug", "cover.jpg"
            );

            var createResult = await controller.Create(dto) as CreatedAtActionResult;
            var created = Assert.IsType<BookDto>(createResult!.Value);

            var result = await controller.GetChunk(created.Id, 1) as OkObjectResult;
            Assert.NotNull(result);

            var chunk = Assert.IsType<BookChunkDto>(result.Value);
            Assert.Equal(1, chunk.ChunkNumber);
            Assert.Equal("chunk1.pdf", chunk.FileUrl);
        }

        [Fact]
        public async Task GetChunk_ReturnsNotFound_WhenChunkMissing()
        {
            var controller = GetController(out _);

            var dto = new BookCreateDto(
                "ChunkBook", "Desc", 1, "Author",
                new List<string>(), "slug", "cover.jpg"
            );

            var createResult = await controller.Create(dto) as CreatedAtActionResult;
            var created = Assert.IsType<BookDto>(createResult!.Value);

            var result = await controller.GetChunk(created.Id, 99);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}

