namespace AuthService.DTOs;

public record LoginUserDto(
    string Email,
    string Password
);
