using AuthService.Configurations;
using DotNetEnv;


var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    Env.Load();
}

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables(); // load env vars from Azure or GitHub secrets

// Add configs
var isTest = AppDomain.CurrentDomain.GetAssemblies().Any(a => a.FullName != null && a.FullName.Contains("QA.AuthService.Tests"));
if (!isTest)
{
    builder.Services.AddDatabase(builder.Configuration);
}
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

app.MapGet("/", () => "Auth Service is running...");

app.Run();

public partial class Program { }