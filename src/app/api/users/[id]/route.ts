import { usersTable } from "@/db/schema";
import {
    hasPermission,
    Permission,
} from "@/features/auth/constants/permissions";
import { db } from "@/lib/db";
import { jwtService } from "@/services/auth/jwt.service";
import { passwordService } from "@/services/auth/password.service";
import {
    ResetPasswordRequest,
    Role,
    UpdateUserRequest,
} from "@/types/auth.types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return null;
  return jwtService.verifyAccessToken(token);
}

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/users/:id
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedUser(request);
  if (!auth || !hasPermission(auth.role as Role, Permission.USER_READ)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
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
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PATCH /api/users/:id — update role, isActive, name, username
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedUser(request);
  if (!auth || !hasPermission(auth.role as Role, Permission.USER_UPDATE)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const body: UpdateUserRequest = await request.json();

  // Prevent non-ROOT_ADMIN from assigning roles
  if (
    body.role !== undefined &&
    !hasPermission(auth.role as Role, Permission.USER_ASSIGN_ROLE)
  ) {
    return NextResponse.json(
      { error: "Insufficient permissions to assign roles" },
      { status: 403 }
    );
  }

  // Prevent modifying the last ROOT_ADMIN
  if (body.role !== undefined || body.isActive === false) {
    const [targetUser] = await db
      .select({ role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (targetUser?.role === Role.ROOT_ADMIN) {
      const [{ value: adminCount }] = await db
        .select({ value: db.$count(usersTable, eq(usersTable.role, Role.ROOT_ADMIN)) })
        .from(usersTable);

      if ((adminCount as unknown as number) <= 1) {
        return NextResponse.json(
          { error: "Cannot modify the last ROOT_ADMIN" },
          { status: 400 }
        );
      }
    }
  }

  const updateData: Partial<typeof usersTable.$inferInsert> & {
    updatedAt?: Date;
  } = { updatedAt: new Date() };

  if (body.name !== undefined) updateData.name = body.name;
  if (body.username !== undefined) updateData.username = body.username;
  if (body.role !== undefined) updateData.role = body.role;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  const [updated] = await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, userId))
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      username: usersTable.username,
      name: usersTable.name,
      role: usersTable.role,
      isActive: usersTable.isActive,
      updatedAt: usersTable.updatedAt,
    });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/users/:id
export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedUser(request);
  if (!auth || !hasPermission(auth.role as Role, Permission.USER_DELETE)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  if (userId === auth.userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const [deleted] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });

  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// POST /api/users/:id/reset-password — ROOT_ADMIN resets a user's password
export async function POST(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedUser(request);
  if (
    !auth ||
    !hasPermission(auth.role as Role, Permission.USER_RESET_PASSWORD)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const body: ResetPasswordRequest = await request.json();

  if (!body.newPassword || body.newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const passwordHash = await passwordService.hashPassword(body.newPassword);

  const [updated] = await db
    .update(usersTable)
    .set({ passwordHash, refreshTokenHash: null, updatedAt: new Date() })
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
