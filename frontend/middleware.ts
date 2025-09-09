import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isPublic = ["/login", "/forget-password", "/register"].includes(
      pathname
    );

    console.log("ExpireData:", token?.exp);
    console.log("Date Now", Date.now());
    const isExpired =
      token?.exp && typeof token.exp === "number"
        ? Date.now() >= token.exp * 1000
        : true;

    if (!isPublic && (!token || isExpired)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isPublic && token && !isExpired) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        error: "Middleware crashed",
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const config = {
  matcher: [
    "/middleware-check",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/((?!api|_next|static|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico|woff|woff2|ttf|eot)).*)",
  ],
};
