import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const bookId = (await params).bookId;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BACKEND_URL) {
    console.error("BOOK_API_BASE_URL is not defined");
    return NextResponse.json({}, { status: 500 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/Books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        accept: "*/*",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      // Pass through the actual status code from backend
      const errorText = await response.text();
      return NextResponse.json(
        {
          error:
            errorText || `Backend responded with status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const book = await response.json();
    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      {
        error:
          "Failed to fetch book data" +
          (error instanceof Error ? `: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const bookId = (await params).bookId;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BACKEND_URL) {
    console.error("BOOK_API_BASE_URL is not defined");
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/Books/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        accept: "*/*",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok && response.status !== 204) {
      // Pass through the actual status code from backend
      const errorText = await response.text();
      return NextResponse.json(
        {
          error:
            errorText || `Backend responded with status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      {
        error:
          "Failed to delete book" +
          (error instanceof Error ? `: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const bookId = (await params).bookId;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BACKEND_URL) {
    console.error("BOOK_API_BASE_URL is not defined");
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 }
    );
  }

  try {
    const bookData = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/Books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
        accept: "*/*",
      },
      body: JSON.stringify(bookData),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      // Pass through the actual status code from backend
      const errorText = await response.text();
      return NextResponse.json(
        {
          error:
            errorText || `Backend responded with status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      {
        error:
          "Failed to update book" +
          (error instanceof Error ? `: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}
