using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using AuthService.Helpers;
using QA.AuthService.Tests.Helper;
using AuthService.Data;
using Microsoft.EntityFrameworkCore;

namespace QA.AuthService.Tests.Integration;

public class CustomWebAppFactory : WebApplicationFactory<Program>
{
    private static readonly Microsoft.Data.Sqlite.SqliteConnection _connection = CreateAndOpenConnection();

    private static Microsoft.Data.Sqlite.SqliteConnection CreateAndOpenConnection()
    {
        var conn = new Microsoft.Data.Sqlite.SqliteConnection("DataSource=:memory:;Cache=Shared");
        conn.Open();
        return conn;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "secretkey12345abcdsecretkey12345abcd",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience",
                ["ConnectionStrings:DefaultConnection"] = "DataSource=:memory:;Cache=Shared"
            }!);
        });

        builder.ConfigureTestServices(services =>
        {
            
            services.AddScoped<IGoogleOAuthHelper, MockGoogleOAuthHelper>();

            
            var dbContextDescriptors = services.Where(d =>
                d.ServiceType == typeof(AuthDbContext) ||
                (d.ServiceType.IsGenericType && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>))
            ).ToList();
            foreach (var descriptor in dbContextDescriptors)
            {
                services.Remove(descriptor);
            }

            // Add in-memory SQLite  
            services.AddDbContext<AuthDbContext>(options =>
            {
                options.UseSqlite(_connection);
            });
        });
    }
}