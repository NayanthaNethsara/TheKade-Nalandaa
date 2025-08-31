# Use the .NET 9 SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy only project file first (caches restore layer)
COPY *.csproj ./
RUN dotnet restore

# Now copy rest of the code
COPY . ./
RUN dotnet build -c Release -o /out

FROM build AS publish
RUN dotnet publish -c Release -o /out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /out .
ENTRYPOINT ["dotnet", "AuthService.dll"]
