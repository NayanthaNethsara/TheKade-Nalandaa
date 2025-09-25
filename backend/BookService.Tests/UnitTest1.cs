using Xunit;
using Microsoft.EntityFrameworkCore;
using BookService.Data;
using BookService.Repositories;
using BookService.Services;
using BookService.Controllers;
using BookService.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BookService.Dtos;

namespace BookService.Tests
{
    public class BooksControllerTests
    {
        private BooksController GetControllerWithInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<BookDbContext>()
                .UseInMemoryDatabase(databaseName: "BookServiceTestDb")
                .Options;

            var dbContext = new BookDbContext(options);

            var repo = new BookRepository(dbContext);
            var service = new BookServiceImpl(repo);
            return new BooksController(service);
        }

        [Fact]
        public async Task GetAllBooks_ReturnsEmpty_WhenNoBooks()
        {
            // Arrange
            var controller = GetControllerWithInMemoryDb();

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var books = Assert.IsType<List<BookDto>>(okResult.Value);
            Assert.Empty(books);
        }
    }
}
