# AuthService

A .NET-based authentication service for handling user registration, login, and JWT-based authentication.

## Features

- User registration and login
- JWT authentication (issuer & audience support)
- Google OAuth integration
- SQL Server database support
- Configurable via environment variables

## Tech Stack

- .NET 9
- SQL Server
- Docker
- Azure Container Apps

## Environment Variables

| Name                                   | Description                   |
| -------------------------------------- | ----------------------------- |
| `Jwt__Secret`                          | Secret key for JWT tokens     |
| `Jwt__Issuer`                          | JWT issuer                    |
| `Jwt__Audience`                        | JWT audience                  |
| `Google__ClientId`                     | Google OAuth Client ID        |
| `Google__ClientSecret`                 | Google OAuth Client Secret    |
| `ConnectionStrings__DefaultConnection` | SQL Server connection string  |
| `Frontend__Url`                        | Frontend URL                  |
| `MYSQL_ROOT_PASSWORD`                  | MySQL root password (if used) |
| `MYSQL_DATABASE`                       | Database name                 |
| `ADMIN_USER`                           | Default admin user email      |
