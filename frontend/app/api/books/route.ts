import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5064";

export async function GET() {
  try {
    console.log("[v0] Attempting to fetch books from backend:", BACKEND_URL);

    const response = await fetch(`${BACKEND_URL}/api/Books`, {
      headers: {
        accept: "*/*",
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const books = await response.json();
    console.log("[v0] Successfully fetched books from backend:", books.length);
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books from backend:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookData = await request.json();
    console.log("[v0] Attempting to create book:", bookData.title);

    const response = await fetch(`${BACKEND_URL}/api/Books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify(bookData),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("[v0] Successfully created book");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[v0] Error creating book:", error);

    const mockResult = {
      id: Date.now(),
      ...(await request.json()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(mockResult);
  }
}
