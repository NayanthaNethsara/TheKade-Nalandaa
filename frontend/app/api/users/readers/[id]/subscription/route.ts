import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userId, subscription } = body;
    // Call backend API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/readers/${userId}/subscription`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscription }),
      }
    );
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.error || "Failed to update subscription" },
        { status: res.status }
      );
    }
    return NextResponse.json({ message: "Subscription updated successfully" });
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : undefined;
    return NextResponse.json(
      { error: errorMessage || "Internal server error" },
      { status: 500 }
    );
  }
}
