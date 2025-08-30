using System.Net.Http.Headers;
using System.Text.Json;

namespace AuthService.Helpers;

public class GoogleOAuthHelper
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public GoogleOAuthHelper(IConfiguration config, IHttpClientFactory httpFactory)
    {
        _config = config;
        _http = httpFactory.CreateClient();
    }

    public async Task<JsonElement> ExchangeCodeAsync(string code, string redirectUri)
    {
        Console.WriteLine("Exchanging code with Google OAuth...");

        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            {"code", code},
            {"client_id", _config["Google:ClientId"]!},
            {"client_secret", _config["Google:ClientSecret"]!},
            {"redirect_uri", redirectUri},
            {"grant_type", "authorization_code"}
        });

        var tokenResp = await _http.PostAsync("https://oauth2.googleapis.com/token", content);
        Console.WriteLine($"Token response status: {tokenResp.StatusCode}");
        var respBody = await tokenResp.Content.ReadAsStringAsync();
        Console.WriteLine($"Token response body: {respBody}");

        tokenResp.EnsureSuccessStatusCode();

        var accessToken = JsonDocument.Parse(respBody).RootElement.GetProperty("access_token").GetString();
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var userInfo = await _http.GetStringAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        Console.WriteLine($"User info: {userInfo}");

        return JsonDocument.Parse(userInfo).RootElement;
    }
}
