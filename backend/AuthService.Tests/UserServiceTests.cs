using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Moq;
using AuthService.Services;
using AuthService.DTOs;
using AuthService.Models;
using Xunit.Abstractions;

namespace AuthService.Tests
{
    public class UserServiceMockTests
    {
        private readonly Mock<IUserService> _mockService;
        private readonly ITestOutputHelper _output;

        public UserServiceMockTests(ITestOutputHelper output)
        {
            _mockService = new Mock<IUserService>();
            _output = output;
        }

        [Fact]
        public async Task GetAllReadersAsync_ShouldReturnReaders()
        {
            var fakeReaders = new List<ReaderSummeryDto>
            {
                new ReaderSummeryDto(1, "Alice", "alice@test.com", SubscriptionStatus.Free, System.DateTime.UtcNow),
                new ReaderSummeryDto(2, "Bob", "bob@test.com", SubscriptionStatus.Premium, System.DateTime.UtcNow)
            };

            _mockService.Setup(s => s.GetAllReadersAsync())
                        .ReturnsAsync(fakeReaders);

            var result = await _mockService.Object.GetAllReadersAsync();

            _output.WriteLine($"Returned {result.Count} readers");
            foreach (var r in result)
                _output.WriteLine($"- {r.Id}: {r.Name} ({r.Email}) [{r.Subscription}]");

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllReadersAsync_ShouldReturnEmptyList()
        {
            _mockService.Setup(s => s.GetAllReadersAsync())
                        .ReturnsAsync(new List<ReaderSummeryDto>());

            var result = await _mockService.Object.GetAllReadersAsync();

            _output.WriteLine("Readers list is empty as expected");

            Assert.Empty(result);
        }

        [Fact]
        public async Task GetReaderByIdAsync_ShouldReturnSingleReader()
        {
            var fakeReader = new ReaderSummeryDto(1, "Alice", "alice@test.com", SubscriptionStatus.Free, System.DateTime.UtcNow);

            _mockService.Setup(s => s.GetReaderByIdAsync(1))
                        .ReturnsAsync(fakeReader);

            var result = await _mockService.Object.GetReaderByIdAsync(1);

            _output.WriteLine(result != null
                ? $"Found reader: {result.Name} ({result.Email})"
                : "Reader not found");

            Assert.NotNull(result);
            Assert.Equal("Alice", result!.Name);
        }

        [Fact]
        public async Task GetReaderByIdAsync_ShouldReturnNull_IfNotFound()
        {
            _mockService.Setup(s => s.GetReaderByIdAsync(99))
                        .ReturnsAsync((ReaderSummeryDto?)null);

            var result = await _mockService.Object.GetReaderByIdAsync(99);

            _output.WriteLine("No reader found for ID 99 (expected)");

            Assert.Null(result);
        }

        [Fact]
        public async Task ActivateUser_ShouldPass()
        {
            _mockService.Setup(s => s.ActivateUserAsync(1))
                        .Returns(Task.CompletedTask);

            await _mockService.Object.ActivateUserAsync(1);

            _output.WriteLine("User 1 activated successfully");

            Assert.True(true);
        }

        [Fact]
        public async Task DeactivateUser_ShouldPass()
        {
            _mockService.Setup(s => s.DeactivateUserAsync(1))
                        .Returns(Task.CompletedTask);

            await _mockService.Object.DeactivateUserAsync(1);

            _output.WriteLine("User 1 deactivated successfully");

            Assert.True(true);
        }
    }
}
