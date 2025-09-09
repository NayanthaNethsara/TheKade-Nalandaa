using AuthService.Models;

namespace AuthService.DTOs;

public record UserDto(
    Guid Id,
    string Email,
    string Name,
    Roles Role,
    SubscriptionStatus Subscription
);
