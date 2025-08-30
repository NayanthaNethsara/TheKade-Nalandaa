using AuthService.Data;
using AuthService.Helpers;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load env variables automatically
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8,0,33))
    ));

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<GoogleOAuthHelper>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
