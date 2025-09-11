import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function PATCH(req: Request) {
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

    const id = req.url.split("/").at(-2);

    const res = await fetch(`${API_BASE_URL}/api/users/${id}/deactivate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });

    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to deactivate user" },
        { status: res.status }
      );

    return NextResponse.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
