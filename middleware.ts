import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = {
  "/admin": ["admin"],
  "/therapist": ["therapist"],
  "/dashboard": ["user", "therapist", "admin", "customer"],
  "/chat-room": ["user", "therapist", "admin", "customer"],
  "/profile": ["user", "therapist", "admin", "customer"],
  "/therapists": ["user", "therapist", "admin", "customer"],
  "/settings": ["user", "therapist", "admin", "customer"],
  "/chat": ["user", "therapist", "admin", "customer"],
};

// Define public routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/",
  "/api/auth/login",
  "/api/auth/register",
  "/api/set-cookie",
  "/api/remove-cookie",
  "/api/get-cookie",
  "/api/get-refresh-cookie",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    // Get the token from cookies or headers
    const accessToken = request.cookies.get("access_token")?.value;
    const authToken = request.cookies.get("authToken")?.value;
    const authHeader = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    const token = accessToken || authToken || authHeader;

    // Debug logging
    console.log("Middleware Debug:", {
      pathname,
      accessToken: accessToken ? "exists" : "missing",
      authToken: authToken ? "exists" : "missing",
      authHeader: authHeader ? "exists" : "missing",
      hasToken: !!token,
    });

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For now, we'll let the client-side handle role verification
    // In a real app, you'd verify the token and check roles here
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
