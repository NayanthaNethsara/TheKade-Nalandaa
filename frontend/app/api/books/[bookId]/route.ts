import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5064";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const bookId = (await params).bookId;
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
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({});
  }
}
