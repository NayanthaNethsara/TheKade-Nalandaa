using System.Net;
using System.Net.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using AuthService.Data;

namespace QA.AuthService.Tests.Integration;

public class TestControllerAuth_QATests : IClassFixture<CustomWebAppFactory>
{
    private readonly HttpClient _client;

    public TestControllerAuth_QATests(CustomWebAppFactory factory)
    {
        _client = factory.CreateClient();
        
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        db.Database.EnsureCreated();
    }

    [Fact]
    public async Task Hello_WithoutToken_Returns401()
    {
        var res = await _client.GetAsync("/test/hello");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Hello_WithValidToken_Returns200()
    {
        var jwt = JwtTestHelper.CreateJwt();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);

        var res = await _client.GetAsync("/test/hello");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await res.Content.ReadAsStringAsync();
        body.Should().Contain("userId");
        body.Should().Contain("userEmail");
    }
}