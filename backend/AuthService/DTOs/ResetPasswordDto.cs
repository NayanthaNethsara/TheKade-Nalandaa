namespace AuthService.DTOs;

public record ResetPasswordDto(
    string Token,
    string NewPassword
);
