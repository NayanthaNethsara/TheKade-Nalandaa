using BookService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BookService.Configurations
{
    public static class DatabaseConfig
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<BookDbContext>(options =>
                options.UseNpgsql(
                    config.GetConnectionString("DefaultConnection")
                )
            );

            return services;
        }
    }
}
