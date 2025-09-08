# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj files separately to leverage caching
COPY backend/AuthService/*.csproj ./ 
RUN dotnet restore

# Copy the rest of the code
COPY backend/AuthService/ ./ 

# Build
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy published output
COPY --from=publish /app/publish .

# Set entrypoint
ENTRYPOINT ["dotnet", "AuthService.dll"]
