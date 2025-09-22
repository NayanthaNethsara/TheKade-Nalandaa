using BookService.Configurations;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables in development
if (builder.Environment.IsDevelopment())
{
    DotNetEnv.Env.Load();
}

// Load configuration from appsettings.json and env vars
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add services
builder.Services.AddSecurityServices(builder.Configuration); // JWT & CORS
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
