import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const API_BASE_URL = process.env.AUTH_API_BASE_URL;
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: "API base URL is not configured" },
        { status: 500 }
      );
    }

    // Only ADMIN can fetch users
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all readers from AuthService
    const response = await fetch(`${API_BASE_URL}/api/users/readers`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Fetch users response status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: response.status }
      );
    }

    const users = await response.json();

    console.log("Fetched users:", users);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
