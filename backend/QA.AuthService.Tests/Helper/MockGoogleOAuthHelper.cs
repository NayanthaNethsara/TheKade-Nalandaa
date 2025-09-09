using System.Text.Json;
using System.Threading.Tasks;
using AuthService.Helpers;

using AuthService.Helpers;

namespace QA.AuthService.Tests.Helper
{
    public class MockGoogleOAuthHelper : IGoogleOAuthHelper
    {
        public Task<JsonElement> ExchangeCodeAsync(string code, string redirectUri)
        {
            // Return a fake Google user info JSON
            var json = "{ \"id\": \"test-google-id\", \"email\": \"mockuser@example.com\", \"name\": \"Mock User\" }";
            var element = JsonDocument.Parse(json).RootElement;
            return Task.FromResult(element);
        }
    }
}
