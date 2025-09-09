
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Text.Json;
using FluentAssertions;
using QA.AuthService.Tests.Integration;
using Microsoft.Extensions.DependencyInjection;
using AuthService.Data;
using AuthService.DTOs;
using Xunit;

namespace QA.AuthService.Tests.Controllers;

public class GoogleAuthControllerTests : IClassFixture<CustomWebAppFactory>
{
    private readonly HttpClient _client;
    public GoogleAuthControllerTests(CustomWebAppFactory factory)
    {
        _client = factory.CreateClient();
        
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        db.Database.EnsureCreated();
    }

    [Fact]
    public async Task GoogleLogin_ReturnsJwtToken_ForMockUser()
    {
        var dto = new GoogleLoginDto("mock-code", "https://localhost/callback");
        var res = await _client.PostAsJsonAsync("/auth/google", dto);
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await res.Content.ReadFromJsonAsync<JsonElement>();
        body.TryGetProperty("token", out var token).Should().BeTrue();
        token.GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task GoogleLogin_JwtToken_ContainsRoleClaim()
    {
        var dto = new GoogleLoginDto("mock-code", "https://localhost/callback");
        var res = await _client.PostAsJsonAsync("/auth/google", dto);
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await res.Content.ReadFromJsonAsync<JsonElement>();
        body.TryGetProperty("token", out var token).Should().BeTrue();
        var jwt = token.GetString();
        jwt.Should().NotBeNullOrEmpty();

        // Decode JWT payload (base64 decode, not signature verify)
        var parts = jwt!.Split('.');
        parts.Length.Should().BeGreaterOrEqualTo(2);
        var payload = System.Text.Json.JsonDocument.Parse(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(PadBase64(parts[1])))).RootElement;
        payload.TryGetProperty("role", out var role).Should().BeTrue();
        role.GetString().Should().NotBeNullOrEmpty();
    }

    private static string PadBase64(string base64)
    {
        int pad = 4 - (base64.Length % 4);
        if (pad < 4) base64 += new string('=', pad);
        return base64.Replace('-', '+').Replace('_', '/');
    }
}
