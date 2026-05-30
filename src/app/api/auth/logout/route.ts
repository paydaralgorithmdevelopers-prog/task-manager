import { usersTable } from "@/db/schema";
import { db } from "@/lib/db";
import { jwtService } from "@/services/auth/jwt.service";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (token) {
      const payload = jwtService.verifyAccessToken(token);
      if (payload) {
        // Invalidate refresh token in DB
        await db
          .update(usersTable)
          .set({ refreshTokenHash: null, updatedAt: new Date() })
          .where(eq(usersTable.id, payload.userId));
      }
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    console.error("[LOGOUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

