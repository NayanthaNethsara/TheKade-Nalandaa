using AuthService.Controllers;
using AuthService.Data;
using AuthService.DTOs;
using AuthService.Helpers;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace AuthService.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly AuthController _controller;
        private readonly Mock<AuthDbContext> _mockDb;
        private readonly Mock<JwtService> _mockJwt;
        private readonly Mock<GoogleOAuthHelper> _mockGoogleHelper;

        public AuthControllerTests()
        {
            // Mock configuration for JwtService
            var inMemorySettings = new Dictionary<string, string?> {
                {"Jwt:Secret", "SuperSecretKeyForTesting123!"}
            };
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            // Mock AuthDbContext
            var options = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase("TestDb")
                .Options;
            _mockDb = new Mock<AuthDbContext>(options);

            // Mock JwtService
            _mockJwt = new Mock<JwtService>(config);

            // Mock HttpClient for GoogleOAuthHelper
            var httpHandler = new Mock<HttpMessageHandler>();
            httpHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Content = new StringContent("{\"access_token\":\"dummy-access-token\"}")
                });

            var httpClient = new HttpClient(httpHandler.Object);
            var httpFactoryMock = new Mock<IHttpClientFactory>();
            httpFactoryMock.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Mock GoogleOAuthHelper
            _mockGoogleHelper = new Mock<GoogleOAuthHelper>(config, httpFactoryMock.Object);

            // Initialize controller
            _controller = new AuthController(_mockDb.Object, _mockJwt.Object, _mockGoogleHelper.Object);
        }

        [Fact]
        public async Task GoogleLogin_ReturnsToken()
        {
            // Arrange
            var dto = new GoogleLoginDto("test_code", "http://localhost");

            // Mock GoogleOAuthHelper response
            _mockGoogleHelper.Setup(x => x.ExchangeCodeAsync(dto.Code, dto.RedirectUri))
                .ReturnsAsync(System.Text.Json.JsonDocument.Parse("{\"email\":\"test@test.com\",\"name\":\"Test User\"}").RootElement);

            // Mock JwtService response
            _mockJwt.Setup(x => x.GenerateToken(It.IsAny<AuthService.Models.User>()))
                .Returns("FAKE_TOKEN");

            // Act
            var result = await _controller.GoogleLogin(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var data = Assert.IsType<Dictionary<string, string>>(okResult.Value);
            Assert.Equal("FAKE_TOKEN", data["token"]);
        }
    }
}
