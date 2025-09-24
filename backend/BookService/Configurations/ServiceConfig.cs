using BookService.Helpers;
using Microsoft.Extensions.DependencyInjection;

namespace BookService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            // Business/service layer

            // Helpers

            // Global HttpClient
            services.AddHttpClient();

            return services;
        }
    }
}
