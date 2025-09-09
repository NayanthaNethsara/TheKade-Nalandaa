using AuthService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Configurations
{
    public static class DatabaseConfig
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(
                    config.GetConnectionString("DefaultConnection")
                )
            );

            return services;
        }
    }
}
