import { usersTable } from "@/db/schema";
import { db } from "@/lib/db";
import { jwtService } from "@/services/auth/jwt.service";
import { AuthUser, Role } from "@/types/auth.types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwtService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        name: usersTable.name,
        role: usersTable.role,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responseUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role as Role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json(responseUser, { status: 200 });
  } catch (error) {
    console.error("[AUTH/ME]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
