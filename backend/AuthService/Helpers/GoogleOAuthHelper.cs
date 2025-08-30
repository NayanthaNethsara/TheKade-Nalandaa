using System.Net.Http.Headers;
using System.Text.Json;

namespace AuthService.Helpers;

public class GoogleOAuthHelper
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http = new();

    public GoogleOAuthHelper(IConfiguration config) => _config = config;

    public async Task<JsonElement> ExchangeCodeAsync(string code, string redirectUri)
    {
        var tokenResp = await _http.PostAsync("https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"code", code},
                {"client_id", _config["Google:ClientId"]!},
                {"client_secret", _config["Google:ClientSecret"]!},
                {"redirect_uri", redirectUri},
                {"grant_type", "authorization_code"}
            }));

        tokenResp.EnsureSuccessStatusCode();
        var json = await tokenResp.Content.ReadAsStringAsync();
        var accessToken = JsonDocument.Parse(json).RootElement.GetProperty("access_token").GetString();

        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var userInfo = await _http.GetStringAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        return JsonDocument.Parse(userInfo).RootElement;
    }
}
