import { jwtService } from "@/services/auth/jwt.service";
import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/privacy-policy",
  "/",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract language code from pathname (e.g., /en/dashboard -> 'en')
  const pathParts = pathname.split("/");
  const language = pathParts[1];

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => {
    const fullRoute = `/${language}${route}`;
    return pathname === fullRoute || pathname === route;
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, verify JWT token
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    // Redirect to login if no token
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${language}/login`;
    return NextResponse.redirect(loginUrl);
  }

  // Verify token validity
  const payload = jwtService.verifyAccessToken(token);

  if (!payload) {
    // Token is invalid or expired
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${language}/login`;

    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("accessToken", "", { maxAge: 0 });
    response.cookies.set("refreshToken", "", { maxAge: 0 });

    return response;
  }

  // Token is valid, allow request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all routes except static files, api routes, etc.
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
