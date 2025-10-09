using AuthService.Data;
using AuthService.Models;
using AuthService.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AuthService.Tests.Services
{
    public class UserRepositoryTests
    {
        private readonly DbContextOptions<AuthDbContext> _dbOptions;
        private readonly AuthDbContext _dbContext;
        private readonly UserRepository _userRepository;

        public UserRepositoryTests()
        {
            _dbOptions = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new AuthDbContext(_dbOptions);
            _userRepository = new UserRepository(_dbContext);
        }

        [Fact]
        public async Task AddAsync_DuplicateEmail_ThrowsInvalidOperationException()
        {
            // Arrange
            var user1 = new User
            {
                Email = "test@example.com",
                Name = "Test User 1",
                PasswordHash = "hash1"
            };

            var user2 = new User
            {
                Email = "test@example.com", // Same email
                Name = "Test User 2",
                PasswordHash = "hash2"
            };

            // Act & Assert
            await _userRepository.AddAsync(user1);
            await Assert.ThrowsAsync<InvalidOperationException>(() => _userRepository.AddAsync(user2));
        }

        [Fact]
        public async Task AddAsync_UniqueEmail_AddsUserSuccessfully()
        {
            // Arrange
            var user = new User
            {
                Email = "unique@example.com",
                Name = "Test User",
                PasswordHash = "hash"
            };

            // Act
            var result = await _userRepository.AddAsync(user);

            // Assert
            Assert.NotNull(result);
            var savedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == "unique@example.com");
            Assert.NotNull(savedUser);
            Assert.Equal("Test User", savedUser.Name);
        }
    }
}