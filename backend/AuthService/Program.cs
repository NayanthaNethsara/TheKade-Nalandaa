using AuthService.Configurations;
using DotNetEnv;
using AuthService.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    Env.Load();
}

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables(); // load env vars from Azure or GitHub secrets

// Add configs
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddSecurityServices(builder.Configuration);
builder.Services.AddAppServices();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Middleware
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();
app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    
    // Apply pending migrations automatically on startup
    await db.Database.MigrateAsync();
    
    await DbSeeder.SeedAdminAsync(db);
}


app.Run();
