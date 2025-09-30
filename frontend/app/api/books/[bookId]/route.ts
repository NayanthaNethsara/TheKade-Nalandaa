import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5064";

export async function GET(
  request: Request,
  { params }: { params: { bookId: string } }
) {
  const { bookId } = params;
  try {
    const response = await fetch(`${BACKEND_URL}/api/Books/${bookId}`, {
      headers: {
        accept: "*/*",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const book = await response.json();
    console.log("[v0] Successfully fetched book from backend:", book);
    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book from backend:", error);
    return NextResponse.json({});
  }
}
