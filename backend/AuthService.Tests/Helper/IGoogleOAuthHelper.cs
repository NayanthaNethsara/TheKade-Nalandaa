// Helpers/IGoogleOAuthHelper.cs
using System.Text.Json;
using System.Threading.Tasks;

namespace AuthService.Helpers
{
    public interface IGoogleOAuthHelper
    {
        Task<JsonElement> ExchangeCodeAsync(string code, string redirectUri);
    }
}
