using AuthService.Controllers;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace AuthService.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _controller = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task LoginWithGoogle_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var dto = new GoogleLoginDto("valid-code", "http://localhost:3000");
            var expectedResponse = new AuthResponseDto("token");
            _mockAuthService.Setup(x => x.LoginWithGoogleAsync(It.IsAny<GoogleLoginDto>()))
                           .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.LoginWithGoogle(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.Equal(expectedResponse.Token, returnValue.Token);
        }

        [Fact]
        public async Task LoginWithGoogle_InvalidInput_ReturnsBadRequest()
        {
            // Arrange
            var dto = new GoogleLoginDto("invalid-code", "http://localhost:3000");
            _mockAuthService.Setup(x => x.LoginWithGoogleAsync(It.IsAny<GoogleLoginDto>()))
                           .ThrowsAsync(new Exception("Invalid code"));

            // Act
            var result = await _controller.LoginWithGoogle(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Invalid code", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task RegisterLocal_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var dto = new RegisterUserDto("test@example.com", "Test User", "Test123!");
            var expectedResponse = new AuthResponseDto("token");
            _mockAuthService.Setup(x => x.RegisterLocalAsync(It.IsAny<RegisterUserDto>()))
                           .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.RegisterLocal(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.Equal(expectedResponse.Token, returnValue.Token);
        }

        [Fact]
        public async Task LoginLocal_ValidCredentials_ReturnsOkResult()
        {
            // Arrange
            var dto = new LoginUserDto("test@example.com", "Test123!");
            var expectedResponse = new AuthResponseDto("token");
            _mockAuthService.Setup(x => x.LoginLocalAsync(It.IsAny<LoginUserDto>()))
                           .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.LoginLocal(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.Equal(expectedResponse.Token, returnValue.Token);
        }

        [Fact]
        public async Task RegisterAuthor_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var dto = new RegisterAuthorDto("author@example.com", "Test Author", "Author123!", "123456789", null);
            var expectedResponse = new AuthResponseDto("token");
            _mockAuthService.Setup(x => x.RegisterAuthorAsync(It.IsAny<RegisterAuthorDto>()))
                           .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.RegisterAuthor(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AuthResponseDto>(okResult.Value);
            Assert.Equal(expectedResponse.Token, returnValue.Token);
        }

        [Fact]
        public async Task ForgotPassword_ValidEmail_ReturnsOkResult()
        {
            // Arrange
            var dto = new ForgotPasswordDto("test@example.com");
            _mockAuthService.Setup(x => x.ForgotPasswordAsync(It.IsAny<ForgotPasswordDto>()))
                           .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ForgotPassword(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("reset link has been sent", okResult.Value.ToString());
        }

        [Fact]
        public async Task ResetPassword_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var dto = new ResetPasswordDto("valid-token", "NewPass123!");
            _mockAuthService.Setup(x => x.ResetPasswordAsync(It.IsAny<ResetPasswordDto>()))
                           .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ResetPassword(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Password has been reset successfully", okResult.Value.ToString());
        }
    }
}