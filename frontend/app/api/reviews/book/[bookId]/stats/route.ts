import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/BookReview/book/${(await params).bookId}/stats`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("/api/reviews/book/[bookId]/stats GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch review stats" },
      { status: 500 }
    );
  }
}
