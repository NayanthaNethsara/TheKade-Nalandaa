# API Guide

This document explains how to interact with the APIs in **TheKade Platform**.

---

## Base URL

All requests go through the **API Gateway**:

```
http://localhost:8000/api/v1/
```

Each service has its own route prefix:

- **Auth Service** → `/auth`
- **Book Service** → `/books`
- **Subscription Service** → `/subscriptions`
- **Analytic Service** → `/analytics`

---

## Authentication

- All endpoints (except login/register) require **JWT Bearer tokens**.
- Include the token in the `Authorization` header:

```http
Authorization: Bearer <your_token>
```

Tokens are issued by Auth Service after login.

---

## Common Endpoints

### Auth Service

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
    "username": "john",
    "password": "password123",
    "email": "john@example.com"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
    "username": "john",
    "password": "password123"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>",
  "expiresIn": 3600
}
```

---

### Book Service

#### Get Books

```http
GET /books
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
For the complete Book Service API (including Reviews), see: [BOOK_SERVICE_API.md](./BOOK_SERVICE_API.md)

    "title": "Intro to .NET",
    "author": "Jane Doe"
  }
]
```

---

### Subscription Service

#### Subscribe User

```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
    "planId": "basic"
}
```

---

### Analytic Service

#### Get Usage Stats

```http
GET /analytics/usage
Authorization: Bearer <token>
```

**Response:**

```json
{
  "activeUsers": 120,
  "booksRead": 430,
  "subscriptions": 75
}
```

---

## Error Handling

Errors follow this structure:

```json
{
  "error": "Invalid credentials",
  "code": 401
}
```

---

## Full API Reference

Each microservice provides a Swagger UI:

- Auth Service → [http://localhost:5001/swagger](http://localhost:5001/swagger)
- Book Service → [http://localhost:5002/swagger](http://localhost:5002/swagger)
- Subscription Service → [http://localhost:5003/swagger](http://localhost:5003/swagger)
- Analytic Service → [http://localhost:5004/swagger](http://localhost:5004/swagger)
