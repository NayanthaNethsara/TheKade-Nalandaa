using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using BookService.Configurations;
using BookService.Data;
using BookService.Models;

namespace BookService.Services
{
    public class UsageService : IUsageService
    {
        private readonly FreeReaderLimits _limits;
        private readonly BookDbContext _db;

        public UsageService(IOptions<FreeReaderLimits> options, BookDbContext db)
        {
            _limits = options.Value; // contains the bound values
            _db = db;
        }

        private static DateTime GetDayStartUtc(DateTime now) => now.Date;
        private static DateTime GetMonthStartUtc(DateTime now) => new DateTime(now.Year, now.Month, 1);

        public async Task<(bool allowed, int remaining, DateTime resetAt)> CanConsumeAsync(int userId, int amount = 1)
        {
            var now = DateTime.UtcNow;
            var dayStart = GetDayStartUtc(now);
            var monthStart = GetMonthStartUtc(now);

            var daily = await _db.ReaderUsages.FirstOrDefaultAsync(u => u.UserId == userId && u.PeriodType == "daily" && u.PeriodStart == dayStart);
            var monthly = await _db.ReaderUsages.FirstOrDefaultAsync(u => u.UserId == userId && u.PeriodType == "monthly" && u.PeriodStart == monthStart);

            var dailyUsed = daily?.UsedCount ?? 0;
            var monthlyUsed = monthly?.UsedCount ?? 0;

            var dailyRemaining = Math.Max(0, _limits.DailyChunks - dailyUsed);
            var monthlyRemaining = Math.Max(0, _limits.MonthlyChunks - monthlyUsed);

            var allowed = dailyRemaining >= amount && monthlyRemaining >= amount;

            var resetAt = dayStart.AddDays(1); // daily reset
            if (dailyRemaining < monthlyRemaining)
            {
                // if daily is the bottleneck, return daily reset; otherwise monthly reset
                resetAt = dayStart.AddDays(1);
            }
            var monthlyReset = monthStart.AddMonths(1);
            // choose earliest reset related to which limit blocks the consumption
            var effectiveReset = (!allowed) ? (dailyRemaining < monthlyRemaining ? (daily?.ResetAt ?? resetAt) : (monthly?.ResetAt ?? monthlyReset)) : resetAt;

            return (allowed, Math.Min(dailyRemaining, monthlyRemaining), effectiveReset);
        }

        public async Task ConsumeAsync(int userId, int amount = 1)
        {
            var now = DateTime.UtcNow;
            var dayStart = GetDayStartUtc(now);
            var monthStart = GetMonthStartUtc(now);

            using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var daily = await _db.ReaderUsages.FirstOrDefaultAsync(u => u.UserId == userId && u.PeriodType == "daily" && u.PeriodStart == dayStart);
                if (daily == null)
                {
                    daily = new ReaderUsage
                    {
                        UserId = userId,
                        PeriodType = "daily",
                        PeriodStart = dayStart,
                        UsedCount = amount,
                        ResetAt = dayStart.AddDays(1)
                    };
                    _db.ReaderUsages.Add(daily);
                }
                else
                {
                    daily.UsedCount += amount;
                    _db.ReaderUsages.Update(daily);
                }

                var monthly = await _db.ReaderUsages.FirstOrDefaultAsync(u => u.UserId == userId && u.PeriodType == "monthly" && u.PeriodStart == monthStart);
                if (monthly == null)
                {
                    monthly = new ReaderUsage
                    {
                        UserId = userId,
                        PeriodType = "monthly",
                        PeriodStart = monthStart,
                        UsedCount = amount,
                        ResetAt = monthStart.AddMonths(1)
                    };
                    _db.ReaderUsages.Add(monthly);
                }
                else
                {
                    monthly.UsedCount += amount;
                    _db.ReaderUsages.Update(monthly);
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<UsageSummary> GetUsageSummaryAsync(int userId)
        {
            var now = DateTime.UtcNow;
            var dayStart = GetDayStartUtc(now);
            var monthStart = GetMonthStartUtc(now);

            var daily = await _db.ReaderUsages.FirstOrDefaultAsync(u => u.UserId == userId && u.PeriodType == "daily" && u.PeriodStart == dayStart);
            var monthly = await _db.ReaderUsages.FirstOrDefaultAsync(u => u.UserId == userId && u.PeriodType == "monthly" && u.PeriodStart == monthStart);

            return new UsageSummary(
                daily?.UsedCount ?? 0,
                _limits.DailyChunks,
                monthly?.UsedCount ?? 0,
                _limits.MonthlyChunks,
                daily?.ResetAt ?? dayStart.AddDays(1),
                monthly?.ResetAt ?? monthStart.AddMonths(1)
            );
        }
    }
}
