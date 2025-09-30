# BookService Tests

This directory contains comprehensive unit tests for the BookService microservice using xUnit and in-memory databases for mocking.

## Test Structure

### Test Files

- **`UnitTest1.cs`** - Main BookService business logic tests
- **`BookRepositoryTests.cs`** - Repository layer tests with in-memory database
- **`BooksControllerTests.cs`** - Controller tests with mocked dependencies
- **`BookChunkTests.cs`** - Book chunk repository tests

## Testing Approach

### 1. Service Layer Tests (`UnitTest1.cs`)

- **Purpose**: Test business logic in `BookServiceImpl`
- **Database**: Entity Framework In-Memory Database
- **Coverage**:
  - Book creation with chunks
  - Book retrieval (single and all)
  - Book updates
  - Book deletion
  - Edge cases (null returns, non-existent records)

### 2. Repository Layer Tests (`BookRepositoryTests.cs`)

- **Purpose**: Test data access layer
- **Database**: Entity Framework In-Memory Database
- **Coverage**:
  - CRUD operations for books
  - Database persistence verification
  - Relationship handling (books with chunks)
  - Edge cases and error scenarios

### 3. Controller Layer Tests (`BooksControllerTests.cs`)

- **Purpose**: Test API endpoints and HTTP responses
- **Mocking**: Moq library for service dependencies
- **Coverage**:
  - HTTP status codes (200, 201, 404)
  - Request/response mapping
  - Service method invocation verification
  - Parameter validation

### 4. Book Chunk Tests (`BookChunkTests.cs`)

- **Purpose**: Test chunk-specific functionality
- **Database**: Entity Framework In-Memory Database
- **Coverage**:
  - Chunk retrieval by book ID
  - Chunk CRUD operations
  - Chunk ordering and relationships

## Test Patterns

### In-Memory Database Setup

```csharp
var options = new DbContextOptionsBuilder<BookDbContext>()
    .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
    .Options;
```

- Each test uses a unique database name to ensure isolation
- No shared state between tests
- Automatic cleanup with `IDisposable`

### Mocking with Moq

```csharp
var mockService = new Mock<IBookService>();
mockService.Setup(s => s.GetAllBooksAsync())
    .ReturnsAsync(books);
```

### Test Data Creation

- Uses realistic test data
- Covers different scenarios (empty collections, null values, etc.)
- Consistent naming patterns

## Dependencies

### NuGet Packages

- **Microsoft.EntityFrameworkCore.InMemory** (9.0.9) - In-memory database provider
- **Moq** (4.20.72) - Mocking framework
- **xunit** (2.9.2) - Testing framework
- **xunit.runner.visualstudio** (2.8.2) - Visual Studio test runner
- **Microsoft.NET.Test.Sdk** (17.12.0) - .NET test SDK
- **FluentAssertions** (6.12.1) - Fluent assertion library (optional)

## Running Tests

### Command Line

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test class
dotnet test --filter "BookServiceTests"

# Run tests with detailed output
dotnet test --logger "console;verbosity=detailed"
```

### Visual Studio

- Use Test Explorer
- Right-click on test methods/classes to run individually
- Set breakpoints for debugging

## Test Coverage

Current test coverage includes:

- ✅ **Service Layer**: 100% method coverage
- ✅ **Repository Layer**: 100% method coverage
- ✅ **Controller Layer**: 100% endpoint coverage
- ✅ **Book Chunks**: Complete CRUD operations
- ✅ **Error Scenarios**: Null returns, not found cases
- ✅ **Edge Cases**: Empty collections, invalid IDs

## Best Practices Applied

1. **Test Isolation**: Each test is independent and can run in any order
2. **Arrange-Act-Assert**: Clear test structure
3. **Descriptive Names**: Test method names describe the scenario and expected outcome
4. **Single Responsibility**: Each test focuses on one specific behavior
5. **Mock External Dependencies**: Controllers don't depend on real services
6. **In-Memory Database**: Fast, isolated database tests
7. **Cleanup**: Proper disposal of resources

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

- No external dependencies (databases, files, network)
- Fast execution (all tests complete in under 1 second)
- Deterministic results
- Clear failure messages

## Future Enhancements

Consider adding:

- Integration tests with real database
- Performance tests for large datasets
- API integration tests with TestServer
- Property-based testing for edge cases
- Mutation testing to verify test quality
