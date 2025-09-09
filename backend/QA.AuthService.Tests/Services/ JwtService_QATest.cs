using AuthService.Models;
using AuthService.Services;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;

namespace QA.AuthService.Tests.Services;

public class JwtService_QATests
{
    [Fact]
    public void GenerateToken_ContainsRoleClaim()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "secretkey12345abcdsecretkey12345abcd",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience"
            }!).Build();

        var svc = new JwtService(config);
        var user = new User
        {
            Id = 1,
            Email = "qa@example.com",
            Role = "Admin",
            GoogleId = "test-google-id",
            Name = "QA Tester"
        };

        var token = svc.GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.Claims.First(c => c.Type == "role").Value.Should().Be("Admin");
    }
}