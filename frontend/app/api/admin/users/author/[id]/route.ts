import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const API_BASE_URL = process.env.AUTH_API_BASE_URL;
    if (!API_BASE_URL)
      return NextResponse.json(
        { error: "API base URL not configured" },
        { status: 500 }
      );
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.pathname.split("/").pop();

    const res = await fetch(`${API_BASE_URL}/api/users/author/${id}`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });

    if (!res.ok)
      return NextResponse.json(
        { error: "User not found" },
        { status: res.status }
      );

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
