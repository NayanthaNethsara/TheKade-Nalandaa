namespace AuthService.DTOs;

public record GoogleLoginDto(string Code, string RedirectUri);
