using BookService.Services;
using BookService.Repositories;  // <-- add this
using BookService.Repositories.Interfaces;
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
            services.AddScoped<IBookReviewRepository, BookReviewRepository>();

            // Book service
            services.AddScoped<IBookService, BookServiceImpl>();

            return services;
        }
    }
}
