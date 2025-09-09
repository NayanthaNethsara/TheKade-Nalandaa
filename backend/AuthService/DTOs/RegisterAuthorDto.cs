namespace AuthService.DTOs;

public record RegisterAuthorDto(
    string Email,
    string Name,
    string Password,
    string NIC,
    string? Phone
);
