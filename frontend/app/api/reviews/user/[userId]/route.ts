import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/BookReview/user/${userId}`,
      {
        headers: { accept: "*/*" },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: response.status }
      );
    }

    const reviews = await response.json();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("/api/reviews/user GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
