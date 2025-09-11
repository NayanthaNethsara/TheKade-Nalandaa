using AuthService.Models;

namespace AuthService.DTOs;

public record ReaderSummeryDto(
    int Id,
    string Name,
    string Email,
    SubscriptionStatus Subscription,
    DateTime CreatedAt
);

public record AuthorSummeryDto(
    int Id,
    string Name,
    string Email,
    DateTime CreatedAt
);