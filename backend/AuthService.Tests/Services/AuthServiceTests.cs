using AuthService.Data;
using AuthService.DTOs;
using AuthService.Helpers;
using AuthService.Models;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Text.Json;
using Xunit;

namespace AuthService.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IGoogleOAuthHelper> _mockGoogleHelper;
        private readonly Mock<IJwtService> _mockJwtService;
        private readonly DbContextOptions<AuthDbContext> _dbOptions;
        private readonly AuthDbContext _dbContext;
        private readonly AuthServiceImpl _authService;

        public AuthServiceTests()
        {
            // Setup in-memory database
            _dbOptions = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _dbContext = new AuthDbContext(_dbOptions);

            _mockGoogleHelper = new Mock<IGoogleOAuthHelper>();
            _mockJwtService = new Mock<IJwtService>();

            _authService = new AuthServiceImpl(_dbContext, _mockJwtService.Object, _mockGoogleHelper.Object);
        }

        [Fact]
        public async Task LoginWithGoogle_NewUser_CreatesUserAndReturnsToken()
        {
            // Arrange
            var dto = new GoogleLoginDto("test-code", "http://localhost:3000");
            var userInfo = JsonDocument.Parse(@"{
                ""id"": ""123"",
                ""email"": ""test@example.com"",
                ""name"": ""Test User""
            }");

            _mockGoogleHelper.Setup(x => x.ExchangeCodeAsync(dto.Code, dto.RedirectUri))
                            .ReturnsAsync(userInfo.RootElement);

            _mockJwtService.Setup(x => x.GenerateToken(It.IsAny<User>()))
                          .Returns("test-token");

            // Act
            var result = await _authService.LoginWithGoogleAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-token", result.Token);

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.GoogleId == "123");
            Assert.NotNull(user);
            Assert.Equal("test@example.com", user.Email);
            Assert.Equal(Roles.Reader, user.Role);
        }

        [Fact]
        public async Task LoginWithGoogle_ExistingUser_ReturnsToken()
        {
            // Arrange
            var existingUser = new User
            {
                GoogleId = "123",
                Email = "test@example.com",
                Name = "Test User",
                Role = Roles.Reader
            };
            await _dbContext.Users.AddAsync(existingUser);
            await _dbContext.SaveChangesAsync();

            var dto = new GoogleLoginDto("test-code", "http://localhost:3000");
            var userInfo = JsonDocument.Parse(@"{
                ""id"": ""123"",
                ""email"": ""test@example.com"",
                ""name"": ""Test User""
            }");

            _mockGoogleHelper.Setup(x => x.ExchangeCodeAsync(dto.Code, dto.RedirectUri))
                            .ReturnsAsync(userInfo.RootElement);

            _mockJwtService.Setup(x => x.GenerateToken(It.IsAny<User>()))
                          .Returns("test-token");

            // Act
            var result = await _authService.LoginWithGoogleAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-token", result.Token);
        }

        [Fact]
        public async Task RegisterLocal_ValidInput_CreatesUserAndReturnsToken()
        {
            // Arrange
            var dto = new RegisterUserDto("test@example.com", "Test User", "Test123!");

            _mockJwtService.Setup(x => x.GenerateToken(It.IsAny<User>()))
                          .Returns("test-token");

            // Act
            var result = await _authService.RegisterLocalAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-token", result.Token);

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            Assert.NotNull(user);
            Assert.Equal(dto.Name, user.Name);
            Assert.NotNull(user.PasswordHash);
            Assert.Equal(Roles.Reader, user.Role);
        }

        [Fact]
        public async Task RegisterLocal_ExistingEmail_ThrowsException()
        {
            // Arrange
            var existingUser = new User
            {
                Email = "test@example.com",
                Name = "Test User",
                PasswordHash = "hash",
                Role = Roles.Reader
            };
            await _dbContext.Users.AddAsync(existingUser);
            await _dbContext.SaveChangesAsync();

            var dto = new RegisterUserDto("test@example.com", "New User", "Test123!");

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _authService.RegisterLocalAsync(dto));
        }

        [Fact]
        public async Task LoginLocal_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var password = "Test123!";
            var user = new User
            {
                Email = "test@example.com",
                Name = "Test User",
                PasswordHash = PasswordHelper.HashPassword(password),
                Role = Roles.Reader,
                Active = true
            };
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            var dto = new LoginUserDto("test@example.com", password);

            _mockJwtService.Setup(x => x.GenerateToken(It.IsAny<User>()))
                          .Returns("test-token");

            // Act
            var result = await _authService.LoginLocalAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-token", result.Token);
        }

        [Fact]
        public async Task LoginLocal_InvalidCredentials_ThrowsException()
        {
            // Arrange
            var dto = new LoginUserDto("test@example.com", "WrongPassword");

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _authService.LoginLocalAsync(dto));
        }

        [Fact]
        public async Task LoginLocal_InactiveAccount_ThrowsException()
        {
            // Arrange
            var password = "Test123!";
            var user = new User
            {
                Email = "test@example.com",
                Name = "Test User",
                PasswordHash = PasswordHelper.HashPassword(password),
                Role = Roles.Reader,
                Active = false
            };
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            var dto = new LoginUserDto("test@example.com", password);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _authService.LoginLocalAsync(dto));
            Assert.Contains("Account is inactive", exception.Message);
        }
    }
}