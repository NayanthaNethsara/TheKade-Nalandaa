# 🚀 Backend API Quick Start Guide

## 1. Prerequisites

- **.NET 9 SDK**
- **Docker & Docker Compose**
- **PostgreSQL** (used via Docker)
- **Node.js** (for frontend, if testing full stack)

## 2. Environment Setup

Each backend service uses EF Core migrations and requires environment variables.

```bash
cp .env.example .env
```

Update values in `.env` (database URL, JWT secret, etc.).

## 3. Running with Docker Compose

Inside the backend folder:

```bash
docker compose up --build
```

This spins up:

- All backend API services
- PostgreSQL databases (per service if configured)

## 4. Database Migrations

Each service manages its own EF Core migrations.

To apply migrations manually:

```bash
cd BookService
dotnet ef database update
```

Or inside container:

```bash
docker compose exec bookservice dotnet ef database update
```

## 5. API Access

Once running:

- **Base URL:** `http://localhost:8000` (or as defined in `docker-compose.yml`)

### Auth Service

- `POST /api/auth/register` – register user
- `POST /api/auth/login` – login and get JWT
- `GET /api/auth/me` – get current user

### Book Service

- `GET /api/books` – list all books
- `GET /api/books/{id}` – get book by id
- `POST /api/books` – create book (admin only)

### LegalAid Service

- `POST /api/questions` – ask a legal question
- `GET /api/questions/{id}` – get question + answer

> 🔑 **JWT token required for most endpoints** – pass via `Authorization: Bearer <token>` header.

## 6. API Docs

Swagger is enabled per service:

- Visit: `http://localhost:8000/swagger`

Each microservice has its own Swagger page for testing endpoints.

## 7. Frontend Connection

Start frontend separately:

```bash
npm install
npm run dev
```

It expects backend running on `http://localhost:8000` (update `.env.local` in frontend if different).
