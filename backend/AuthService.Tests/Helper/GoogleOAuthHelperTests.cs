using AuthService.Helpers;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System.Text.Json;

namespace AuthService.Tests.Helpers
{
    public class GoogleOAuthHelperTests
    {
        [Fact]
        public async Task ExchangeCodeAsync_ReturnsUserInfo()
        {
            // Arrange
            var mockConfig = new ConfigurationBuilder()
                .AddInMemoryCollection(new[]
                {
                    new KeyValuePair<string, string?>("Google:ClientId", "dummy-client-id"),
                    new KeyValuePair<string, string?>("Google:ClientSecret", "dummy-client-secret")
                })
                .Build();

            // Mock HttpMessageHandler
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);

            // Mock token response
            handlerMock.Protected()
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

            // Mock user info response
            handlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.RequestUri!.AbsoluteUri.Contains("userinfo")),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("{\"email\":\"test@example.com\",\"name\":\"Test User\"}")
                });

            var httpClient = new HttpClient(handlerMock.Object);

            var httpFactoryMock = new Mock<IHttpClientFactory>();
            httpFactoryMock.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var helper = new GoogleOAuthHelper(mockConfig, httpFactoryMock.Object);

            // Act
            var result = await helper.ExchangeCodeAsync("dummy-code", "http://localhost/callback");

            // Assert
            Assert.Equal("test@example.com", result.GetProperty("email").GetString());
            Assert.Equal("Test User", result.GetProperty("name").GetString());
        }
    }
}
