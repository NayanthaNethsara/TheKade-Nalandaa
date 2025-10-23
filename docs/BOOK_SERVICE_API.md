# Book Service API

This document describes the HTTP API for the Book Service, including book management and user reviews.

- Service: Book Service
- Base URL (local dev): http://localhost:5064
- Swagger UI (local dev): http://localhost:5064/swagger

Contents

- Authentication & Authorization
- Books API
- Book Reviews API
- Error model
- Curl recipes
- Troubleshooting

---

## Authentication & Authorization

Most book endpoints require JWT Bearer tokens. Add the header:

Authorization: Bearer <your_token>

- Public: BookReview endpoints in this build are open (no auth). Books endpoints are protected.
- Roles:
  - Admin can approve and delete books, and view pending books.
  - Non-admins can create and view approved books.

---

## DTOs

### Book

- BookDto

  - id: number
  - title: string
  - description?: string
  - authorId: number
  - authorName: string
  - titleSlug: string
  - coverImagePath: string
  - isApproved: boolean

- BookCreateDto

  - title: string
  - description?: string
  - authorId: number
  - authorName: string
  - chunks: string[] (storage paths)
  - titleSlug: string
  - coverImagePath: string

- BookWithChunkDto
  - id, title, description, authorId, authorName, titleSlug, coverImagePath, firstChunkPath, isApproved

### BookReview

- BookReviewDto
  - id, bookId, userId, userName, rating (1-5), reviewText?, createdAt, updatedAt?
- BookReviewCreateDto
  - bookId, userId, userName, rating (1-5), reviewText?
- BookReviewUpdateDto
  - rating (1-5), reviewText?
- BookReviewStatsDto
  - bookId, averageRating, totalReviews

---

## Books API

Route prefix: /api/Books

### GET /api/Books

Auth: Bearer

Returns list of approved books.

Response 200 OK:
[
{
"id": 1,
"title": "Intro to .NET",
"description": "...",
"authorId": 10,
"authorName": "Jane Doe",
"titleSlug": "intro-to-dotnet",
"coverImagePath": "/images/cover.jpg",
"isApproved": true
}
]

### GET /api/Books/pending

Auth: Bearer (Admin)

Returns list of pending books to be approved.

### GET /api/Books/{id}

Auth: Bearer

Returns a single book. If the book is not approved and the caller is not Admin, response is 403.

Responses:

- 200 OK BookWithChunkDto
- 403 Forbid
- 404 Not Found

### POST /api/Books

Auth: Bearer

Create a new book (initially unapproved). If the caller has claims for name/id, these may override authorId/authorName.

Request (BookCreateDto):
{
"title": "My Book",
"description": "...",
"authorId": 10,
"authorName": "Author Name",
"chunks": ["/chunks/c1.pdf"],
"titleSlug": "my-book",
"coverImagePath": "/images/cover.jpg"
}

Responses:

- 201 Created (Location header points to GET by id)
- 400 Bad Request (invalid payload)

### PUT /api/Books/{id}

Auth: Bearer

Update book details.

Responses:

- 200 OK (updated BookDto/BookWithChunkDto)
- 404 Not Found

### DELETE /api/Books/{id}

Auth: Bearer (Admin)

Delete a book and its chunks.

Responses:

- 204 No Content
- 404 Not Found

### POST /api/Books/{id}/approve

Auth: Bearer (Admin)

Approve a submitted book.

Responses:

- 204 No Content
- 404 Not Found

### GET /api/Books/{bookId}/chunks/{chunkNumber}

Auth: Bearer

Returns chunk metadata for a book. Non-admins cannot access chunks for unapproved books.

Responses:

- 200 OK
- 403 Forbid (if parent book unapproved and caller not Admin)
- 404 Not Found (book/chunk not found)

---

## Book Reviews API

Route prefix: /api/BookReview

### GET /api/BookReview

Auth: None

Returns all reviews across books.

200 OK [BookReviewDto]

### GET /api/BookReview/{id}

Auth: None

Returns a single review.

Responses:

- 200 OK BookReviewDto
- 404 Not Found {"message": "Review not found"}

### GET /api/BookReview/book/{bookId}

Auth: None

Returns reviews for the specified book.

Responses:

- 200 OK [BookReviewDto]
- 404 Not Found {"message": "Book not found"}

### GET /api/BookReview/book/{bookId}/stats

Auth: None

Returns rating statistics for the book.

200 OK BookReviewStatsDto

### GET /api/BookReview/user/{userId}

Auth: None

Returns reviews by user.

200 OK [BookReviewDto]

### POST /api/BookReview

Auth: None

Create a review for a book. Only one review per user per book.

Request (BookReviewCreateDto):
{
"bookId": 1,
"userId": "user-123",
"userName": "Alice",
"rating": 5,
"reviewText": "Great book!"
}

Responses:

- 201 Created BookReviewDto
- 400 Bad Request {"message": "Rating must be between 1 and 5"}
- 404 Not Found {"message": "Book not found"}
- 409 Conflict {"message": "User has already reviewed this book"}

### PUT /api/BookReview/{id}

Auth: None

Update a review.

Request (BookReviewUpdateDto):
{
"rating": 4,
"reviewText": "Updated text"
}

Responses:

- 200 OK BookReviewDto
- 400 Bad Request {"message": "Rating must be between 1 and 5"}
- 404 Not Found {"message": "Review not found"}

### DELETE /api/BookReview/{id}

Auth: None

Delete a review.

Responses:

- 204 No Content
- 404 Not Found {"message": "Review not found"}

---

## Error model

Generic error body (when present):
{
"message": "..."
}

---

## Curl recipes

export BASE=http://localhost:5064

# Reviews

curl -s $BASE/api/BookReview | jq

curl -s -X POST $BASE/api/BookReview \
 -H "Content-Type: application/json" \
 -d '{
"bookId": 1,
"userId": "test-user-123",
"userName": "John Doe",
"rating": 5,
"reviewText": "Excellent book!"
}' | jq

curl -s $BASE/api/BookReview/1 | jq

curl -s $BASE/api/BookReview/book/1 | jq

curl -s $BASE/api/BookReview/user/test-user-123 | jq

curl -s $BASE/api/BookReview/book/1/stats | jq

curl -s -X PUT $BASE/api/BookReview/1 \
 -H "Content-Type: application/json" \
 -d '{"rating":4, "reviewText":"Updated"}' | jq

curl -i -X DELETE $BASE/api/BookReview/1

# Books (protected, require Bearer <token>)

# Example:

# curl -H "Authorization: Bearer $TOKEN" $BASE/api/Books

---

## Troubleshooting

- 401 Unauthorized on /api/Books/\*: You must include a valid JWT Bearer token in Authorization header. BookReview endpoints are open in this build.
- 409 Conflict creating review: A user can only have one review per book. Use PUT to update.
- Ratings must be integers 1-5.
- Database migrations: run inside backend/BookService
  - dotnet ef database update
