import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // public pages
  const publicPaths = ["/login", "/register", "/forget-password"];
  const isPublic = publicPaths.includes(pathname);

  try {
    const token = await getToken({ req, secret: SECRET });

    // check token expiration using your accessTokenExpires
    const isExpired =
      token?.accessTokenExpires && typeof token.accessTokenExpires === "number"
        ? Date.now() >= token.accessTokenExpires
        : true;

    if (!pathname.startsWith("/api")) {
      // protected page + no token or expired → redirect to login
      if (!isPublic && (!token || isExpired)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // public page + valid token → redirect to dashboard
      if (isPublic && token && !isExpired) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next(); // allow access
    }

    if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
      if (!token || isExpired) {
        return new NextResponse(
          JSON.stringify({
            message: "Unauthorized - token expired or missing",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      return NextResponse.next(); // allow API access
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
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

// Define which paths the middleware applies to
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next|static|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico|woff|woff2|ttf|eot)).*)", // catch other pages
  ],
};
