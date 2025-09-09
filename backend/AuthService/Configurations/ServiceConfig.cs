using AuthService.Helpers;
using AuthService.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            // Register your business/service layer
            services.AddScoped<IAuthService, AuthServiceImpl>();

            // Helpers
            services.AddScoped<JwtService>();
            services.AddScoped<IGoogleOAuthHelper, GoogleOAuthHelper>();

            // Global HttpClient
            services.AddHttpClient();

            return services;
        }
    }
}
