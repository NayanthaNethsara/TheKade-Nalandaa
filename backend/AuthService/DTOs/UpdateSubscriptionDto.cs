using AuthService.Models;

namespace AuthService.DTOs;

public record UpdateSubscriptionDto(
    Guid UserId,
    SubscriptionStatus Subscription
);
