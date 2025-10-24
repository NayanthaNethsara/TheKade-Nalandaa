# Book Review Feature

## Overview

The Book Review feature allows users to rate and review books in the system. Each user can submit one review per book with a rating (1-5 stars) and optional review text.

## Features

- ✅ Create book reviews with ratings (1-5 stars) and text
- ✅ Update existing reviews
- ✅ Delete reviews
- ✅ View all reviews for a specific book
- ✅ View all reviews by a specific user
- ✅ Get review statistics (average rating, total reviews) for each book
- ✅ One review per user per book (enforced at database level)
- ✅ Cascade delete (when a book is deleted, all its reviews are deleted)

## API Endpoints

### Get All Reviews

```http
GET /api/BookReview
```

Returns all reviews in the system.

**Response:**

```json
[
  {
    "id": 1,
    "bookId": 1,
    "userId": "user123",
    "userName": "John Doe",
    "rating": 5,
    "reviewText": "Excellent book!",
    "createdAt": "2025-10-15T10:00:00Z",
    "updatedAt": null
  }
]
```

### Get Review by ID

```http
GET /api/BookReview/{id}
```

Returns a specific review by its ID.

**Response:** Same as above (single review object)

### Get Reviews by Book ID

```http
GET /api/BookReview/book/{bookId}
```

Returns all reviews for a specific book.

**Response:** Array of review objects

### Get Reviews by User ID

```http
GET /api/BookReview/user/{userId}
```

Returns all reviews written by a specific user.

**Response:** Array of review objects

### Get Book Review Statistics

```http
GET /api/BookReview/book/{bookId}/stats
```

Returns aggregate statistics for a book's reviews.

**Response:**

```json
{
  "bookId": 1,
  "averageRating": 4.5,
  "totalReviews": 10
}
```

### Create Review

```http
POST /api/BookReview
Content-Type: application/json

{
  "bookId": 1,
  "userId": "user123",
  "userName": "John Doe",
  "rating": 5,
  "reviewText": "Excellent book! Highly recommend."
}
```

**Validation:**

- Rating must be between 1 and 5
- Book must exist
- User cannot have already reviewed this book

**Response:** 201 Created with the created review object

### Update Review

```http
PUT /api/BookReview/{id}
Content-Type: application/json

{
  "rating": 4,
  "reviewText": "Updated review text"
}
```

**Validation:**

- Rating must be between 1 and 5
- Review must exist

**Response:** 200 OK with the updated review object

### Delete Review

```http
DELETE /api/BookReview/{id}
```

**Response:** 204 No Content

## Database Schema

### BookReview Table

```sql
CREATE TABLE BookReviews (
    Id INT PRIMARY KEY IDENTITY,
    BookId INT NOT NULL,
    UserId NVARCHAR(450) NOT NULL,
    UserName NVARCHAR(MAX) NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    ReviewText NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT FK_BookReviews_Books FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_BookReviews_BookId_UserId UNIQUE (BookId, UserId)
);
```

**Indexes:**

- Primary key on `Id`
- Unique index on `(BookId, UserId)` to ensure one review per user per book
- Foreign key index on `BookId`

## Architecture

### Model

```csharp
public class BookReview
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public int Rating { get; set; } // 1-5
    public string? ReviewText { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Book Book { get; set; } // Navigation property
}
```

### DTOs

- `BookReviewDto` - Full review data
- `BookReviewCreateDto` - For creating new reviews
- `BookReviewUpdateDto` - For updating existing reviews
- `BookReviewStatsDto` - Review statistics

### Repository Pattern

**Interface:** `IBookReviewRepository`

**Methods:**

- `GetAllAsync()` - Get all reviews
- `GetByIdAsync(int id)` - Get review by ID
- `GetByBookIdAsync(int bookId)` - Get reviews for a book
- `GetByUserIdAsync(string userId)` - Get reviews by user
- `GetByBookAndUserAsync(int bookId, string userId)` - Find user's review for a book
- `CreateAsync(BookReview review)` - Create new review
- `UpdateAsync(BookReview review)` - Update existing review
- `DeleteAsync(int id)` - Delete review
- `GetAverageRatingAsync(int bookId)` - Calculate average rating
- `GetReviewCountAsync(int bookId)` - Count reviews for a book

## Unit Tests

### Controller Tests (`BookReviewControllerTests`)

- ✅ Get all reviews
- ✅ Get review by ID (exists/not exists)
- ✅ Get reviews by book ID (book exists/not exists)
- ✅ Get reviews by user ID
- ✅ Get book review statistics
- ✅ Create review (valid/invalid rating/book not found/duplicate review)
- ✅ Update review (valid/invalid rating/not found)
- ✅ Delete review (exists/not exists)

### Repository Tests (`BookReviewRepositoryTests`)

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Query by book ID
- ✅ Query by user ID
- ✅ Query by book and user
- ✅ Calculate average rating
- ✅ Count reviews
- ✅ Timestamp handling (CreatedAt, UpdatedAt)

**Total: 37 passing tests**

## Migration

A database migration has been created:

```
Migration: 20251015154747_AddBookReviewTable
```

To apply the migration:

```bash
cd backend/BookService
dotnet ef database update
```

## Usage Example

### Creating a Review

```csharp
// User rates a book 5 stars
var createDto = new BookReviewCreateDto
{
    BookId = 1,
    UserId = "auth0|123456",
    UserName = "John Doe",
    Rating = 5,
    ReviewText = "Absolutely loved this book! The characters were well-developed and the plot kept me engaged throughout."
};

var response = await httpClient.PostAsJsonAsync("/api/BookReview", createDto);
```

### Updating a Review

```csharp
// User changes their mind and updates the rating
var updateDto = new BookReviewUpdateDto
{
    Rating = 4,
    ReviewText = "Upon reflection, I'm changing my rating to 4 stars. Still a great read though!"
};

var response = await httpClient.PutAsJsonAsync($"/api/BookReview/{reviewId}", updateDto);
```

### Getting Book Statistics

```csharp
// Get average rating for a book
var stats = await httpClient.GetFromJsonAsync<BookReviewStatsDto>($"/api/BookReview/book/{bookId}/stats");
Console.WriteLine($"Average Rating: {stats.AverageRating}/5 ({stats.TotalReviews} reviews)");
```

## Frontend Integration

When integrating with the frontend, consider:

1. **Display average rating** on book cards and detail pages
2. **Show review count** to indicate book popularity
3. **List reviews** on book detail page (sorted by newest first)
4. **Allow users to submit reviews** (one per book)
5. **Allow users to edit their own reviews**
6. **Display user's reviews** on their profile page
7. **Show star ratings** visually (★★★★★)

## Security Considerations

- **Authentication**: Ensure users are authenticated before submitting reviews
- **Authorization**: Users should only be able to edit/delete their own reviews
- **Input Validation**:
  - Rating must be 1-5
  - ReviewText should have a maximum length (recommended: 2000 characters)
  - UserId should match the authenticated user's ID
- **Rate Limiting**: Consider implementing rate limiting to prevent spam reviews

## Future Enhancements

- [ ] Add "helpful" votes for reviews
- [ ] Allow users to report inappropriate reviews
- [ ] Add moderation system for reviews
- [ ] Implement sorting (most helpful, newest, highest/lowest rating)
- [ ] Add pagination for reviews
- [ ] Include verified purchase badge
- [ ] Add image uploads to reviews
- [ ] Implement review responses from authors
