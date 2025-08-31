using AuthService.Controllers;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace AuthService.Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task GoogleLogin_ReturnsToken()
        {
            // Arrange
            var dto = new GoogleLoginDto("test_code", "http://localhost");

            // Mock IAuthService
            var mockAuthService = new Mock<IAuthService>();
            mockAuthService
                .Setup(x => x.LoginWithGoogleAsync(dto))
                .ReturnsAsync("FAKE_TOKEN");

            // Initialize controller with the mocked service
            var controller = new AuthController(mockAuthService.Object);

            // Act
            var result = await controller.GoogleLogin(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);

            // Use reflection / dynamic access
            var tokenProperty = okResult.Value!.GetType().GetProperty("token")!;
            var tokenValue = tokenProperty.GetValue(okResult.Value) as string;

            Assert.Equal("FAKE_TOKEN", tokenValue);

        }
    }
}
