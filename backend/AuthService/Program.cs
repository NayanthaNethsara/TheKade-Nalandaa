using AuthService.Configurations;
using DotNetEnv;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

// Load env variables
builder.Configuration.AddEnvironmentVariables();

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

app.Run();
