using BookService.Services;
using BookService.Repositories;  // <-- add this
using Microsoft.Extensions.DependencyInjection;

namespace BookService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddHttpClient();

            // Register repository
            services.AddScoped<IBookRepository, BookRepository>();

            // Book service
            services.AddScoped<IBookService, BookServiceImpl>();

            return services;
        }
    }
}
