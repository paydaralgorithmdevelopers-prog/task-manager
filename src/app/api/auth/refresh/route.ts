import { usersTable } from "@/db/schema";
import { db } from "@/lib/db";
import { jwtService } from "@/services/auth/jwt.service";
import { passwordService } from "@/services/auth/password.service";
import { Role } from "@/types/auth.types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwtService.verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!user || !user.isActive || !user.refreshTokenHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate stored refresh token hash (rotation check)
    const isTokenValid = await passwordService.comparePassword(
      refreshToken,
      user.refreshTokenHash
    );

    if (!isTokenValid) {
      // Token reuse detected — invalidate all sessions
      await db
        .update(usersTable)
        .set({ refreshTokenHash: null, updatedAt: new Date() })
        .where(eq(usersTable.id, user.id));

      return NextResponse.json(
        { error: "Token reuse detected. Please log in again." },
        { status: 401 }
      );
    }

    const tokens = jwtService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    const newRefreshTokenHash = await passwordService.hashPassword(
      tokens.refreshToken
    );

    await db
      .update(usersTable)
      .set({ refreshTokenHash: newRefreshTokenHash, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    const response = NextResponse.json({ success: true }, { status: 200 });
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[AUTH/REFRESH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
