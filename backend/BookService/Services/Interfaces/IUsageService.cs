using System;
using System.Threading.Tasks;

namespace BookService.Services
{
    public record UsageSummary(int DailyUsed, int DailyLimit, int MonthlyUsed, int MonthlyLimit, DateTime DailyResetAt, DateTime MonthlyResetAt);

    public interface IUsageService
    {
        Task<(bool allowed, int remaining, DateTime resetAt)> CanConsumeAsync(int userId, int amount = 1);
        Task ConsumeAsync(int userId, int amount = 1);
        Task<UsageSummary> GetUsageSummaryAsync(int userId);
    }
}
