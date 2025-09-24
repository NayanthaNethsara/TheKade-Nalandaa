using BookService.Helpers;
using Microsoft.Extensions.DependencyInjection;

namespace BookService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {

            services.AddHttpClient();

            return services;
        }
    }
}
