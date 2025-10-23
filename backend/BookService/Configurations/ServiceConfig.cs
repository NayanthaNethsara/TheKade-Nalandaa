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

            // Register repositories
            services.AddScoped<IBookRepository, BookRepository>();
            services.AddScoped<IBookmarkRepository, BookmarkRepository>();

            // Book service (depends on bookmark repo as well)
            services.AddScoped<IBookService, BookServiceImpl>();

            return services;
        }
    }
}
