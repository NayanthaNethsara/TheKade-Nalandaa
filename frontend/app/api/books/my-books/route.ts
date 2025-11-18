import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!BACKEND_URL) {
      console.error("BOOK_API_BASE_URL is not defined");
      return NextResponse.json([], { status: 500 });
    }

    const response = await fetch(`${BACKEND_URL}/api/Books/my-books`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        accept: "*/*",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const books = await response.json();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching my books from backend:", error);
    return NextResponse.json(
      {
        error:
          "Failed to fetch your books" +
          (error instanceof Error ? `: ${error.message}` : ""),
      },
      { status: 500 }
    );
  }
}
