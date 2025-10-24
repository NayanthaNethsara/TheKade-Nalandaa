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
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const book = await response.json();
    return NextResponse.json(book);
  } catch (error) {
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
