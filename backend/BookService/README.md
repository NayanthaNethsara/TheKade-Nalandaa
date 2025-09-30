# BookService API

The BookService is a microservice responsible for managing books and book chunks in the TheKade-Nalandaa application. It provides REST API endpoints for book management, including CRUD operations and chunk-based content delivery.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Migrations](#database-migrations)
- [Docker Support](#docker-support)
- [Testing](#testing)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Features

- **Book Management**: Create, read, update, and delete books
- **Book Chunks**: Divide books into chunks for efficient content delivery
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **Entity Framework Core**: Database operations with SQL Server
- **Docker Support**: Containerized deployment
- **Swagger Documentation**: Interactive API documentation
- **Environment Configuration**: Support for development and production environments

## Architecture

The BookService follows a clean architecture pattern with the following layers:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic implementation
- **Repositories**: Data access layer
- **Models**: Entity definitions
- **DTOs**: Data Transfer Objects for API communication
- **Configurations**: Service and database configuration

## File Structure

```
BookService/
├── Controllers/
│   └── BookController.cs          # API endpoints for book operations
├── Services/
│   ├── Interfaces/
│   │   └── IBookService.cs        # Service interface
│   └── BookService.cs             # Business logic implementation
├── Repositories/
│   ├── Interfaces/
│   │   ├── IBookRepositories.cs   # Repository interfaces
│   │   └── IBookChunkRepository.cs
│   ├── BookRepositories.cs        # Book data access
│   └── BookChunkRepository.cs     # Book chunk data access
├── Models/
│   ├── Book.cs                    # Book entity
│   └── BookChunk.cs               # Book chunk entity
├── DTOs/
│   ├── BookDto.cs                 # Book data transfer object
│   ├── BookCreateDto.cs           # Book creation DTO
│   ├── BookChunkDto.cs            # Book chunk DTO
│   └── BookWithChunkDto.cs        # Book with chunks DTO
├── Data/
│   └── BookDbContext.cs           # Entity Framework context
├── Configurations/
│   ├── DatabaseConfig.cs          # Database configuration
│   ├── SecurityConfig.cs          # JWT and security configuration
│   └── ServiceConfig.cs           # Service registration
├── Migrations/                    # Entity Framework migrations
├── Properties/
├── Dockerfile                     # Docker container configuration
├── Program.cs                     # Application entry point
├── appsettings.json              # Application settings
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server LocalDB
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NayanthaNethsara/TheKade-Nalandaa.git
   cd TheKade-Nalandaa/backend/BookService
   ```

2. **Install dependencies**

   ```bash
   dotnet restore
   ```

3. **Configure environment variables**

   Create a `.env` file in the BookService directory:

   ```env
   CONNECTION_STRING=Server=localhost;Database=BookServiceDB;Trusted_Connection=true;TrustServerCertificate=true;
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_ISSUER=TheKade-Nalandaa
   JWT_AUDIENCE=TheKade-Nalandaa-Users
   ```

4. **Update database**

   ```bash
   dotnet ef database update
   ```

**For cloud deployment (e.g., Supabase/PostgreSQL), update the database with:**

```bash
dotnet ef database update --context BookDbContext --connection "db"
```

5. **Run the application**
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7001` (HTTPS) or `http://localhost:5001` (HTTP).

### Development Setup

For development with hot reload:

```bash
dotnet watch run
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

- **Swagger UI**: `https://localhost:7001/swagger`

### Main Endpoints

#### Books

- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update a book
- `DELETE /api/books/{id}` - Delete a book

#### Book Chunks

- `GET /api/books/{bookId}/chunks/{chunkNumber}` - Get specific book chunk

### Example API Requests

**Create a Book:**

```json
POST /api/books
Content-Type: application/json

{
  "title": "Sample Book",
  "description": "A sample book description",
  "authorId": 1,
  "authorName": "John Doe",
  "titleSlug": "sample-book",
  "coverImagePath": "/images/sample-book-cover.jpg"
}
```

**Get All Books:**

```json
GET /api/books
```

## Database Migrations

The project uses Entity Framework Core for database operations.

### Create a new migration

```bash
dotnet ef migrations add MigrationName
```

### Update database

```bash
dotnet ef database update
```

### Remove last migration

```bash
dotnet ef migrations remove
```

## Docker Support

### Build Docker Image

```bash
docker build -t bookservice .
```

### Run with Docker

```bash
docker run -p 8080:8080 -e CONNECTION_STRING="your-connection-string" bookservice
```

### Docker Compose

The service can be run with other services using the docker-compose.yml in the backend folder:

```bash
cd ../
docker-compose up bookservice
```

## Testing

### Run Unit Tests

```bash
cd ../BookService.Tests
dotnet test
```

### Run Tests with Coverage

```bash
dotnet test --collect:"XPlat Code Coverage"
```

## Configuration

### Environment Variables

| Variable            | Description                | Default                |
| ------------------- | -------------------------- | ---------------------- |
| `CONNECTION_STRING` | Database connection string | Required               |
| `JWT_SECRET`        | JWT signing key            | Required               |
| `JWT_ISSUER`        | JWT token issuer           | TheKade-Nalandaa       |
| `JWT_AUDIENCE`      | JWT token audience         | TheKade-Nalandaa-Users |

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": ""
  }
}
```

## Security

- JWT token authentication is required for protected endpoints
- CORS is configured to allow frontend access
- SQL injection protection through Entity Framework parameterized queries
- Environment-based configuration for secrets

## Performance Considerations

- Book content is chunked for efficient loading
- Entity Framework query optimization
- Async/await pattern for non-blocking operations
- Proper HTTP status codes and error handling

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the TheKade-Nalandaa application. See the main repository for license information.

## Support

For support and questions, please refer to the main project documentation or create an issue in the repository.
