import { Role } from "@/features/auth/constants/roles";
import {
  getRequiredRoles,
  isPublicPath,
} from "@/features/auth/constants/routes";
import { jwtService } from "@/services/auth/jwt.service";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract language segment (e.g. /en/dashboard → "en", "/dashboard" → "")
  const segments = pathname.split("/").filter(Boolean);
  const language = segments[0] ?? "en";

  // Strip the language prefix to get the canonical path
  const pathWithoutLang =
    pathname === `/${language}` || pathname === `/${language}/`
      ? "/"
      : pathname.startsWith(`/${language}/`)
      ? pathname.slice(language.length + 1) // "/en/dashboard" → "/dashboard"
      : pathname;

  // ── Public routes — no token required ─────────────────────────────────────
  if (isPublicPath(pathWithoutLang)) {
    return NextResponse.next();
  }

  // ── Try access token first ─────────────────────────────────────────────────
  let accessToken = request.cookies.get("accessToken")?.value ?? null;
  let payload = accessToken ? jwtService.verifyAccessToken(accessToken) : null;

  // ── Silent refresh — if access token is missing/expired but refresh exists ─
  if (!payload) {
    const refreshToken = request.cookies.get("refreshToken")?.value ?? null;

    if (refreshToken) {
      const refreshPayload = jwtService.verifyRefreshToken(refreshToken);

      if (refreshPayload) {
        // Issue a new access token inline (no DB round-trip needed for middleware)
        const tokens = jwtService.generateTokens({
          userId: refreshPayload.userId,
          email: refreshPayload.email,
          role: refreshPayload.role,
        });

        // Validate the new token to set headers
        payload = jwtService.verifyAccessToken(tokens.accessToken);

        const isProduction = process.env.NODE_ENV === "production";
        const requestHeaders = new Headers(request.headers);

        if (payload) {
          requestHeaders.set("x-user-id", String(payload.userId));
          requestHeaders.set("x-user-email", payload.email);
          requestHeaders.set("x-user-role", payload.role);
        }

        const next = NextResponse.next({ request: { headers: requestHeaders } });

        next.cookies.set("accessToken", tokens.accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/",
        });

        return checkRoleAccess(next, pathWithoutLang, payload?.role as Role | undefined, language);
      }
    }

    // No valid token at all → redirect to login
    return redirectToLogin(request, language, pathWithoutLang);
  }

  // ── Access token valid ─────────────────────────────────────────────────────
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", String(payload.userId));
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);

  const next = NextResponse.next({ request: { headers: requestHeaders } });
  return checkRoleAccess(next, pathWithoutLang, payload.role as Role, language);
}

function redirectToLogin(
  request: NextRequest,
  language: string,
  returnTo: string
): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${language}/login`;
  loginUrl.search = `?returnTo=${encodeURIComponent(
    request.nextUrl.pathname + request.nextUrl.search
  )}`;

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
  return response;
}

function checkRoleAccess(
  next: NextResponse,
  pathWithoutLang: string,
  role: Role | undefined,
  language: string
): NextResponse {
  const requiredRoles = getRequiredRoles(pathWithoutLang);

  // No role restriction for this path
  if (requiredRoles === null || requiredRoles.length === 0) return next;

  // User role not in allowed roles → 403
  if (!role || !requiredRoles.includes(role)) {
    const url = new URL(next.url ?? "");
    url.pathname = `/${language}/unauthorized`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return next;
}

export const config = {
  matcher: [
    // Run middleware on all routes except static assets and internal Next.js paths
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

