using BookService.Configurations;
using DotNetEnv;
using BookService.Data;
using BookService.Services;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables in development
if (builder.Environment.IsDevelopment())
{
    Env.Load();
}

// Load configuration from appsettings.json and env vars
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddSecurityServices(builder.Configuration);
builder.Services.AddAppServices();
builder.Services.Configure<FreeReaderLimits>(builder.Configuration.GetSection("FreeReaderLimits"));
builder.Services.AddScoped<IUsageService, UsageService>();


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

app.Run();
