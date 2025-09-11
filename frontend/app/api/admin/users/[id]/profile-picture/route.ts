import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function PATCH(req: NextRequest) {
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
    const body = await req.json();

    if (id !== body.userId)
      return NextResponse.json({ error: "User ID mismatch" }, { status: 400 });

    const res = await fetch(`${API_BASE_URL}/api/users/${id}/profile-picture`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to update profile picture" },
        { status: res.status }
      );

    return NextResponse.json({
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
