import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export default function proxy(request: NextRequest) {
  // 1. Security Headers
  // Start with a response that passes the request down the chain
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  );

  // 2. Route Protection
  const path = request.nextUrl.pathname;

  // Example token check (in a real app, this might be a secure HTTP-only cookie)
  // For the boilerplate, we assume a "session-token" cookie might exist when fully implemented.
  const token = request.cookies.get("session-token")?.value;

  const isPublicRoute = publicRoutes.includes(path);

  // If no token and trying to access a protected route (not public and not static)
  if (
    !token &&
    !isPublicRoute &&
    !path.startsWith("/api") &&
    !path.startsWith("/_next") &&
    path !== "/favicon.ico"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If token exists and trying to access login/register, redirect to home
  if (token && (path === "/login" || path === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
