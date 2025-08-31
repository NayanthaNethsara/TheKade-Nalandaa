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
                options.UseMySql(
                    config.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 33))
                )
            );

            return services;
        }
    }
}
