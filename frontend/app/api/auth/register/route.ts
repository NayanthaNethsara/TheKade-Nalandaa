import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const API_BASE_URL = process.env.AUTH_API_BASE_URL;
    const body = await request.json();

    const { password, email, phone, role, name, nic } = body;

    console.log(password, email, phone, role, name, nic);

    // Handle Reader registration (new format)
    if (role === "READER") {
      // Validate required fields for Reader
      if (!email || !name || !password) {
        return NextResponse.json(
          { error: "Email, name, and password are required" },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      console.log("Registering reader:", { email, name });

      const backendResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        return NextResponse.json(
          { error: data.message || "Reader registration failed" },
          { status: backendResponse.status }
        );
      }

      return NextResponse.json(
        { message: "Reader registered successfully", user: data.user },
        { status: 201 }
      );
    }

    // Handle existing Author registration (legacy format)
    if (!password || !email || !phone || !role || !name || !nic) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format (Sri Lankan format)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/api/auth/register-author`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
          phone,
          nic,
        }),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(
      { message: "User registered successfully", user: data.user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
