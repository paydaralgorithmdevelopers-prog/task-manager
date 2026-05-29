import { jwtService } from "@/services/auth/jwt.service";
import { AuthPayload } from "@/types/auth.types";
import { NextRequest, NextResponse } from "next/server";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Verify JWT token and extract user data
 */
export async function verifyAuth(request: NextRequest): Promise<{
  valid: boolean;
  user?: AuthPayload;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      return {
        valid: false,
        error: "No authorization token provided",
      };
    }

    const user = jwtService.verifyAccessToken(token);

    if (!user) {
      return {
        valid: false,
        error: "Invalid or expired token",
      };
    }

    return {
      valid: true,
      user,
    };
  } catch (error) {
    return {
      valid: false,
      error: "Authentication failed",
    };
  }
}

/**
 * Middleware to protect API routes
 */
export async function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const auth = await verifyAuth(request);

    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Add user to request context
    (request as any).user = auth.user;

    return handler(request);
  };
}

/**
 * Check if user is authenticated (for client-side)
 */
export function getAuthTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;

  const authToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  return authToken || null;
}
