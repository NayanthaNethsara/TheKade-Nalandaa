using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace QA.AuthService.Tests.Integration;

public static class JwtTestHelper
{
    public static string CreateJwt(string userId = "1", string email = "qa@example.com", string role = "Reader")
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secretkey12345abcdsecretkey12345abcd"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Email, email),
            new("role", role),
        };

        var token = new JwtSecurityToken(
            issuer: "test-issuer",
            audience: "test-audience",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}