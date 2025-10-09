using AuthService.Data;
using AuthService.DTOs;
using AuthService.Models;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace AuthService.Tests.Services
{
    public class UserServiceTests
    {
        private readonly DbContextOptions<AuthDbContext> _dbOptions;
        private readonly AuthDbContext _dbContext;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _dbOptions = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new AuthDbContext(_dbOptions);
            _userService = new UserService(_dbContext);

            // Seed test data
            SeedTestData().Wait();
        }

        private async Task SeedTestData()
        {
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Name = "Test Reader",
                    Email = "reader@test.com",
                    Role = Roles.Reader,
                    Subscription = SubscriptionStatus.Free,
                    Active = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Name = "Test Author",
                    Email = "author@test.com",
                    Role = Roles.Author,
                    Active = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Name = "Premium Reader",
                    Email = "premium@test.com",
                    Role = Roles.Reader,
                    Subscription = SubscriptionStatus.Premium,
                    Active = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 4,
                    Name = "Inactive User",
                    Email = "inactive@test.com",
                    Role = Roles.Reader,
                    Active = false,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _dbContext.Users.AddRangeAsync(users);
            await _dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task GetAllReadersAsync_ReturnsOnlyReaders()
        {
            // Act
            var readers = await _userService.GetAllReadersAsync();

            // Assert
            Assert.Equal(3, readers.Count); // Including inactive reader
            Assert.All(readers, reader => Assert.Contains(reader.Email, new[] { "reader@test.com", "premium@test.com", "inactive@test.com" }));
        }

        [Fact]
        public async Task GetAllAuthorsAsync_ReturnsOnlyAuthors()
        {
            // Act
            var authors = await _userService.GetAllAuthorsAsync();

            // Assert
            Assert.Single(authors);
            Assert.Equal("author@test.com", authors[0].Email);
        }

        [Fact]
        public async Task GetReaderByIdAsync_ExistingId_ReturnsReader()
        {
            // Act
            var reader = await _userService.GetReaderByIdAsync(1);

            // Assert
            Assert.NotNull(reader);
            Assert.Equal("reader@test.com", reader.Email);
            Assert.Equal(SubscriptionStatus.Free, reader.Subscription);
        }

        [Fact]
        public async Task GetReaderByIdAsync_NonExistingId_ReturnsNull()
        {
            // Act
            var reader = await _userService.GetReaderByIdAsync(999);

            // Assert
            Assert.Null(reader);
        }

        [Fact]
        public async Task GetReaderByIdAsync_AuthorId_ReturnsNull()
        {
            // Act
            var reader = await _userService.GetReaderByIdAsync(2); // ID of the author

            // Assert
            Assert.Null(reader);
        }

        [Fact]
        public async Task GetAuthorByIdAsync_ExistingId_ReturnsAuthor()
        {
            // Act
            var author = await _userService.GetAuthorByIdAsync(2);

            // Assert
            Assert.NotNull(author);
            Assert.Equal("author@test.com", author.Email);
        }

        [Fact]
        public async Task GetAuthorByIdAsync_NonExistingId_ReturnsNull()
        {
            // Act
            var author = await _userService.GetAuthorByIdAsync(999);

            // Assert
            Assert.Null(author);
        }

        [Fact]
        public async Task GetAuthorByIdAsync_ReaderId_ReturnsNull()
        {
            // Act
            var author = await _userService.GetAuthorByIdAsync(1); // ID of a reader

            // Assert
            Assert.Null(author);
        }

        [Fact]
        public async Task ActivateUserAsync_InactiveUser_ActivatesUser()
        {
            // Act
            await _userService.ActivateUserAsync(4); // ID of inactive user

            // Assert
            var user = await _dbContext.Users.FindAsync(4);
            Assert.True(user?.Active);
        }

        [Fact]
        public async Task ActivateUserAsync_NonExistingUser_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _userService.ActivateUserAsync(999));
        }

        [Fact]
        public async Task DeactivateUserAsync_ActiveUser_DeactivatesUser()
        {
            // Act
            await _userService.DeactivateUserAsync(1); // ID of active user

            // Assert
            var user = await _dbContext.Users.FindAsync(1);
            Assert.False(user?.Active);
        }

        [Fact]
        public async Task DeactivateUserAsync_NonExistingUser_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _userService.DeactivateUserAsync(999));
        }

        [Fact]
        public async Task ChangeReaderSubscriptionAsync_ValidUpdate_UpdatesSubscription()
        {
            // Arrange
            var userId = 1;
            var newStatus = SubscriptionStatus.Premium;

            // Act
            await _userService.ChangeReaderSubscriptionAsync(userId, newStatus);

            // Assert
            var user = await _dbContext.Users.FindAsync(1);
            Assert.Equal(SubscriptionStatus.Premium, user?.Subscription);
        }

        [Fact]
        public async Task ChangeReaderSubscriptionAsync_NonExistingUser_ThrowsException()
        {
            // Arrange
            var userId = 999;
            var newStatus = SubscriptionStatus.Premium;

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _userService.ChangeReaderSubscriptionAsync(userId, newStatus));
        }

        [Fact]
        public async Task ChangeReaderSubscriptionAsync_AuthorUser_ThrowsException()
        {
            // Arrange
            var userId = 2; // ID of an author
            var newStatus = SubscriptionStatus.Premium;

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _userService.ChangeReaderSubscriptionAsync(userId, newStatus));
        }
    }
}