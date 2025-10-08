namespace AuthService.DTOs;

using AuthService.Models;

public record ChangeSubscriptionDto(
    int UserId,
    SubscriptionStatus Subscription
);

public record ReaderSummeryDto(
    int Id,
    string Name,
    string Email,
    SubscriptionStatus Subscription,
    DateTime CreatedAt,
    bool Active
);

public record AuthorSummeryDto(
    int Id,
    string Name,
    string Email,
    DateTime CreatedAt,
    bool Active
);