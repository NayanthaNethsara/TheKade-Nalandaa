import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BOOK_API_BASE_URL || "http://localhost:5064";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/BookReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    console.error("/api/reviews POST error", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...update } = body;
    const response = await fetch(`${BACKEND_URL}/api/BookReview/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify(update),
      signal: AbortSignal.timeout(5000),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("/api/reviews PUT error", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const response = await fetch(`${BACKEND_URL}/api/BookReview/${id}`, {
      method: "DELETE",
      headers: { accept: "*/*" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return NextResponse.json(payload, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("/api/reviews DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
