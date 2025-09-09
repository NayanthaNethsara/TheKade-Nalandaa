namespace AuthService.DTOs;

public record RegisterUserDto(
    string Email,
    string Name,
    string Password
);
