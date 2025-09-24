using BookService.Helpers;
using BookService.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace BookService.Configurations
{
    public static class ServiceConfig
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddHttpClient();

            services.AddSingleton<IStorageHelper, SupabaseStorageHelper>();


            // Pdf chunker
            services.AddSingleton<IPdfChunker, PdfChunker>();

            // Book service
            services.AddScoped<IBookService, BookServiceImpl>();

            // Later: add BookChunk service if needed
            // services.AddScoped<IBookChunkService, BookChunkService>();

            return services;
        }
    }
}
