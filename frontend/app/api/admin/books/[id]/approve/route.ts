import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

// POST approve book (admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    if (!BACKEND_URL) {
      console.error("BOOK_API_BASE_URL is not defined");
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/Books/${params.id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Book approved successfully",
    });
  } catch (error) {
    console.error("Error approving book:", error);
    return NextResponse.json(
      { error: "Failed to approve book" },
      { status: 500 }
    );
  }
}
