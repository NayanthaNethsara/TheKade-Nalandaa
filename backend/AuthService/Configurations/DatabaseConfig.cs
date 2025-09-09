using AuthService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Configurations
{
    public static class DatabaseConfig
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
        {
            var useSqlite = config.GetValue<bool>("UseSqlite");
            if (useSqlite)
            {
                services.AddDbContext<AuthDbContext>(options =>
                    options.UseSqlite(config.GetConnectionString("DefaultConnection"))
                );
            }
            else
            {
                services.AddDbContext<AuthDbContext>(options =>
                    options.UseSqlServer(config.GetConnectionString("DefaultConnection"))
                );
            }
            return services;
        }
    }
}
