using AuthService.Helpers;
using AuthService.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<JwtService>();
            services.AddScoped<GoogleOAuthHelper>();
            services.AddHttpClient(); // global HttpClient

            return services;
        }
    }
}
