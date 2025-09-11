using AuthService.Helpers;
using AuthService.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            // Business/service layer
            services.AddScoped<IAuthService, AuthServiceImpl>();

            services.AddScoped<IUserService, UserService>();

            // Helpers
            services.AddScoped<JwtService>();
            services.AddScoped<IGoogleOAuthHelper, GoogleOAuthHelper>();

            // Global HttpClient
            services.AddHttpClient();

            return services;
        }
    }
}
