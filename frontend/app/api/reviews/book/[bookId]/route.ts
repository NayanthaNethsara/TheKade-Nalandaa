import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

/**
 * GET /api/reviews/book/[bookId]
 * Query params:
 *   stats=true — returns review stats instead of list
 * Default: returns list of reviews for the book
 */
export async function GET(
  request: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const url = new URL(request.url);
    const stats = url.searchParams.get("stats");
    const endpoint =
      stats === "true"
        ? `${BACKEND_URL}/api/BookReview/book/${params.bookId}/stats`
        : `${BACKEND_URL}/api/BookReview/book/${params.bookId}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: { accept: "*/*" },
      signal: AbortSignal.timeout(5000),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("/api/reviews/book/[bookId] GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
