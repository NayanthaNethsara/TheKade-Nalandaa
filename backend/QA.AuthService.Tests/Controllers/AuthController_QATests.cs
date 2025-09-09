using AuthService.Controllers;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace QA.AuthService.Tests.Controllers;

public class AuthController_QATests
{
    [Fact]
    public async Task GoogleLogin_ReturnsToken()
    {
        var mock = new Mock<IAuthService>();
        var dto = new GoogleLoginDto("code", "http://localhost/callback");
        mock.Setup(s => s.LoginWithGoogleAsync(dto)).ReturnsAsync("jwt-token");

        var controller = new AuthController(mock.Object);

        var result = await controller.GoogleLogin(dto) as OkObjectResult;
        result.Should().NotBeNull();
        result!.Value.Should().BeEquivalentTo(new { token = "jwt-token" });
    }
}