using AuthService.Services;
using AuthService.Models; // make sure User model namespace is correct
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using Xunit;

namespace AuthService.Tests.Services
{
    public class JwtServiceTests
    {
        private readonly JwtService _jwtService;

        public JwtServiceTests()
        {
            // Mock configuration
            var inMemorySettings = new Dictionary<string, string>
            {
                { "Jwt:Secret", "ThisIsALongSuperSecretKey1234567890!" }
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _jwtService = new JwtService(configuration);
        }

        [Fact]
        public void GenerateToken_ReturnsTokenString()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Name = "Test User",
                Email = "test@example.com",
                GoogleId = "google123"
            };

            // Act
            var token = _jwtService.GenerateToken(user);

            // Assert
            Assert.False(string.IsNullOrEmpty(token)); // token should not be null or empty
        }
    }
}
