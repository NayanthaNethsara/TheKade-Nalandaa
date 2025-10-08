using AuthService.Data;
using AuthService.Models;
using AuthService.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AuthService.Tests.Repositories
{
    public class UserRepositoryTests
    {
        private readonly DbContextOptions<AuthDbContext> _dbOptions;
        private readonly AuthDbContext _dbContext;
        private readonly UserRepository _repository;

        public UserRepositoryTests()
        {
            _dbOptions = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new AuthDbContext(_dbOptions);
            _repository = new UserRepository(_dbContext);

            // Seed test data
            SeedTestData().Wait();
        }

        private async Task SeedTestData()
        {
            var users = new List<User>
            {
                new User
                {
                    Email = "test@example.com",
                    Name = "Test User",
                    Role = Roles.Reader,
                    PasswordHash = "hash",
                    Active = true
                },
                new User
                {
                    Email = "google@example.com",
                    Name = "Google User",
                    GoogleId = "google123",
                    Role = Roles.Reader,
                    Active = true
                }
            };

            await _dbContext.Users.AddRangeAsync(users);
            await _dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task GetByEmailAsync_ExistingEmail_ReturnsUser()
        {
            // Act
            var user = await _repository.GetByEmailAsync("test@example.com");

            // Assert
            Assert.NotNull(user);
            Assert.Equal("Test User", user.Name);
        }

        [Fact]
        public async Task GetByEmailAsync_NonExistingEmail_ReturnsNull()
        {
            // Act
            var user = await _repository.GetByEmailAsync("nonexistent@example.com");

            // Assert
            Assert.Null(user);
        }

        [Fact]
        public async Task GetByGoogleIdAsync_ExistingGoogleId_ReturnsUser()
        {
            // Act
            var user = await _repository.GetByGoogleIdAsync("google123");

            // Assert
            Assert.NotNull(user);
            Assert.Equal("Google User", user.Name);
        }

        [Fact]
        public async Task GetByGoogleIdAsync_NonExistingGoogleId_ReturnsNull()
        {
            // Act
            var user = await _repository.GetByGoogleIdAsync("nonexistent");

            // Assert
            Assert.Null(user);
        }

        [Fact]
        public async Task AddAsync_NewUser_AddsToContext()
        {
            // Arrange
            var newUser = new User
            {
                Email = "new@example.com",
                Name = "New User",
                Role = Roles.Reader
            };

            // Act
            var result = await _repository.AddAsync(newUser);
            await _repository.SaveChangesAsync();

            // Assert
            Assert.NotNull(result);
            var savedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == "new@example.com");
            Assert.NotNull(savedUser);
            Assert.Equal("New User", savedUser.Name);
        }

        [Fact]
        public async Task SaveChangesAsync_PersistsChanges()
        {
            // Arrange
            var existingUser = await _dbContext.Users.FirstAsync(u => u.Email == "test@example.com");
            existingUser.Name = "Updated Name";

            // Act
            await _repository.SaveChangesAsync();

            // Assert
            await _dbContext.Entry(existingUser).ReloadAsync();
            Assert.Equal("Updated Name", existingUser.Name);
        }

        [Fact]
        public async Task AddAsync_DuplicateEmail_ThrowsException()
        {
            // Arrange
            var duplicateUser = new User
            {
                Email = "test@example.com", // Already exists
                Name = "Duplicate User",
                Role = Roles.Reader
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _repository.AddAsync(duplicateUser));
        }
    }
}