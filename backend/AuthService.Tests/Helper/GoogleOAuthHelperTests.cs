using AuthService.Helpers;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace AuthService.Tests.Helpers
{
    public class GoogleOAuthHelperTests
    {
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly Mock<IHttpClientFactory> _mockHttpFactory;
        private readonly Mock<HttpMessageHandler> _mockHandler;

        public GoogleOAuthHelperTests()
        {
            _mockConfig = new Mock<IConfiguration>();
            _mockConfig.Setup(x => x["Google:ClientId"]).Returns("dummy-client-id");
            _mockConfig.Setup(x => x["Google:ClientSecret"]).Returns("dummy-client-secret");

            _mockHandler = new Mock<HttpMessageHandler>();
            var client = new HttpClient(_mockHandler.Object);

            _mockHttpFactory = new Mock<IHttpClientFactory>();
            _mockHttpFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(client);
        }

        [Fact]
        public async Task ExchangeCodeAsync_SuccessfulExchange_ReturnsUserInfo()
        {
            // Arrange
            SetupSuccessfulHttpResponses();
            var helper = new GoogleOAuthHelper(_mockConfig.Object, _mockHttpFactory.Object);

            // Act
            var result = await helper.ExchangeCodeAsync("valid-code", "http://localhost/callback");

            // Assert
            Assert.Equal("test@example.com", result.GetProperty("email").GetString());
            Assert.Equal("Test User", result.GetProperty("name").GetString());
        }

        [Fact]
        public async Task ExchangeCodeAsync_TokenRequestFails_ThrowsException()
        {
            // Arrange
            SetupFailedTokenRequest();
            var helper = new GoogleOAuthHelper(_mockConfig.Object, _mockHttpFactory.Object);

            // Act & Assert
            await Assert.ThrowsAsync<HttpRequestException>(() =>
                helper.ExchangeCodeAsync("invalid-code", "http://localhost/callback"));
        }

        [Fact]
        public async Task ExchangeCodeAsync_UserInfoRequestFails_ThrowsException()
        {
            // Arrange
            SetupFailedUserInfoRequest();
            var helper = new GoogleOAuthHelper(_mockConfig.Object, _mockHttpFactory.Object);

            // Act & Assert
            await Assert.ThrowsAsync<HttpRequestException>(() =>
                helper.ExchangeCodeAsync("valid-code", "http://localhost/callback"));
        }

        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData(null)]
        public async Task ExchangeCodeAsync_InvalidCode_ThrowsArgumentException(string code)
        {
            // Arrange
            var helper = new GoogleOAuthHelper(_mockConfig.Object, _mockHttpFactory.Object);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() =>
                helper.ExchangeCodeAsync(code, "http://localhost/callback"));
        }

        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData(null)]
        [InlineData("invalid-url")]
        public async Task ExchangeCodeAsync_InvalidRedirectUri_ThrowsArgumentException(string redirectUri)
        {
            // Arrange
            var helper = new GoogleOAuthHelper(_mockConfig.Object, _mockHttpFactory.Object);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() =>
                helper.ExchangeCodeAsync("valid-code", redirectUri));
        }
        private void SetupSuccessfulHttpResponses()
        {
            // Setup token response
            _mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.AbsoluteUri.Contains("token")),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"access_token\":\"dummy-access-token\"}")
                });

            // Setup user info response
            _mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.AbsoluteUri.Contains("userinfo")),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"email\":\"test@example.com\",\"name\":\"Test User\",\"id\":\"123456789\"}")
                });
        }

        private void SetupFailedTokenRequest()
        {
            _mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.AbsoluteUri.Contains("token")),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Content = new StringContent("{\"error\":\"invalid_grant\"}")
                });
        }

        private void SetupFailedUserInfoRequest()
        {
            // Setup successful token response
            _mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.AbsoluteUri.Contains("token")),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"access_token\":\"dummy-access-token\"}")
                });

            // Setup failed user info response
            _mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.AbsoluteUri.Contains("userinfo")),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    Content = new StringContent("{\"error\":\"invalid_token\"}")
                });
        }
    }
}
