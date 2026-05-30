import { usersTable } from "@/db/schema";
import { db } from "@/lib/db";
import { jwtService } from "@/services/auth/jwt.service";
import { passwordService } from "@/services/auth/password.service";
import { LoginRequest, Role } from "@/types/auth.types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter: max 10 attempts per IP per 15 minutes.
// For multi-instance/serverless deployments, replace with a Redis-backed solution.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email.toLowerCase().trim()))
      .limit(1);

    // Constant-time comparison — always compare even if user not found to prevent timing attacks
    const passwordValid = user
      ? await passwordService.comparePassword(body.password, user.passwordHash)
      : await passwordService.comparePassword(body.password, "$2a$10$invalidhashfortimingatk");

    if (!user || !passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been disabled. Contact your administrator." },
        { status: 403 }
      );
    }

    const rememberMe = body.rememberMe ?? false;
    const refreshTtlDays = rememberMe ? 30 : 1;

    const tokens = jwtService.generateTokens(
      { userId: user.id, email: user.email, role: user.role as Role },
      { refreshExpiresInDays: refreshTtlDays }
    );

    // Store hashed refresh token for rotation validation
    const refreshTokenHash = await passwordService.hashPassword(
      tokens.refreshToken
    );
    await db
      .update(usersTable)
      .set({ refreshTokenHash, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    const responseBody = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role as Role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      },
    };

    const response = NextResponse.json(responseBody, { status: 200 });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: refreshTtlDays * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

