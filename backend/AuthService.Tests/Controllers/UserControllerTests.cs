using AuthService.Controllers;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace AuthService.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _mockUserService;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _mockUserService = new Mock<IUserService>();
            _controller = new UserController(_mockUserService.Object);
        }

        [Fact]
        public async Task GetAllReaders_ReturnsOkResult()
        {
            // Arrange
            var expectedReaders = new List<ReaderSummeryDto>
            {
                new ReaderSummeryDto(1, "Reader 1", "reader1@example.com", Models.SubscriptionStatus.Free, DateTime.UtcNow, true),
                new ReaderSummeryDto(2, "Reader 2", "reader2@example.com", Models.SubscriptionStatus.Premium, DateTime.UtcNow, true)
            };
            _mockUserService.Setup(x => x.GetAllReadersAsync())
                           .ReturnsAsync(expectedReaders);

            // Act
            var result = await _controller.GetAllReaders();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<ReaderSummeryDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetReaderById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var expectedReader = new ReaderSummeryDto(1, "Reader 1", "reader1@example.com", Models.SubscriptionStatus.Free, DateTime.UtcNow, true);
            _mockUserService.Setup(x => x.GetReaderByIdAsync(1))
                           .ReturnsAsync(expectedReader);

            // Act
            var result = await _controller.GetReaderById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<ReaderSummeryDto>(okResult.Value);
            Assert.Equal(expectedReader.Id, returnValue.Id);
        }

        [Fact]
        public async Task GetReaderById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockUserService.Setup(x => x.GetReaderByIdAsync(999))
                           .ReturnsAsync((ReaderSummeryDto)null);

            // Act
            var result = await _controller.GetReaderById(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetAllAuthors_ReturnsOkResult()
        {
            // Arrange
            var expectedAuthors = new List<AuthorSummeryDto>
            {
                new AuthorSummeryDto(1, "Author 1", "author1@example.com", DateTime.UtcNow, true),
                new AuthorSummeryDto(2, "Author 2", "author2@example.com", DateTime.UtcNow, true)
            };
            _mockUserService.Setup(x => x.GetAllAuthorsAsync())
                           .ReturnsAsync(expectedAuthors);

            // Act
            var result = await _controller.GetAllAuthors();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<AuthorSummeryDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetAuthorById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var expectedAuthor = new AuthorSummeryDto(1, "Author 1", "author1@example.com", DateTime.UtcNow, true);
            _mockUserService.Setup(x => x.GetAuthorByIdAsync(1))
                           .ReturnsAsync(expectedAuthor);

            // Act
            var result = await _controller.GetAuthorById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AuthorSummeryDto>(okResult.Value);
            Assert.Equal(expectedAuthor.Id, returnValue.Id);
        }

        [Fact]
        public async Task GetAuthorById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockUserService.Setup(x => x.GetAuthorByIdAsync(999))
                           .ReturnsAsync((AuthorSummeryDto)null);

            // Act
            var result = await _controller.GetAuthorById(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task ActivateUser_ExistingId_ReturnsOkResult()
        {
            // Arrange
            _mockUserService.Setup(x => x.ActivateUserAsync(1))
                           .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ActivateUser(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("activated successfully", okResult.Value.ToString());
        }

        [Fact]
        public async Task DeactivateUser_ExistingId_ReturnsOkResult()
        {
            // Arrange
            _mockUserService.Setup(x => x.DeactivateUserAsync(1))
                           .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeactivateUser(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("deactivated successfully", okResult.Value.ToString());
        }

        [Fact]
        public async Task ActivateUser_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockUserService.Setup(x => x.ActivateUserAsync(999))
                           .ThrowsAsync(new Exception("User not found"));

            // Act
            var result = await _controller.ActivateUser(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task DeactivateUser_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockUserService.Setup(x => x.DeactivateUserAsync(999))
                           .ThrowsAsync(new Exception("User not found"));

            // Act
            var result = await _controller.DeactivateUser(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}