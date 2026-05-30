import { usersTable } from "@/db/schema";
import { hasPermission, Permission } from "@/features/auth/constants/permissions";
import { db } from "@/lib/db";
import { jwtService } from "@/services/auth/jwt.service";
import { passwordService } from "@/services/auth/password.service";
import { CreateUserRequest, Role } from "@/types/auth.types";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return null;
  return jwtService.verifyAccessToken(token);
}

// GET /api/users — list users (ROOT_ADMIN only)
export async function GET(request: NextRequest) {
  const auth = getAuthenticatedUser(request);

  if (!auth || !hasPermission(auth.role as Role, Permission.USER_READ)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
  );
  const search = searchParams.get("search")?.trim() ?? "";
  const roleFilter = searchParams.get("role") as Role | null;
  const offset = (page - 1) * limit;

  const baseQuery = db
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
    .from(usersTable);

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.name, `%${search}%`),
        ilike(usersTable.username, `%${search}%`)
      )
    );
  }
  if (roleFilter) {
    conditions.push(eq(usersTable.role, roleFilter));
  }

  const usersQuery = conditions.length
    ? baseQuery.where(conditions.length === 1 ? conditions[0]! : or(...(conditions as [ReturnType<typeof eq>, ...ReturnType<typeof eq>[]])))
    : baseQuery;

  const [users, totalResult] = await Promise.all([
    usersQuery
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(usersTable),
  ]);

  return NextResponse.json({
    data: users,
    meta: {
      page,
      limit,
      total: totalResult[0]?.total ?? 0,
    },
  });
}

// POST /api/users — create user (ROOT_ADMIN only)
export async function POST(request: NextRequest) {
  const auth = getAuthenticatedUser(request);

  if (!auth || !hasPermission(auth.role as Role, Permission.USER_CREATE)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: CreateUserRequest = await request.json();

  if (!body.email || !body.password || !body.name || !body.role) {
    return NextResponse.json(
      { error: "email, name, password, and role are required" },
      { status: 400 }
    );
  }

  if (!Object.values(Role).includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const email = body.email.toLowerCase().trim();

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await passwordService.hashPassword(body.password);

  const [newUser] = await db
    .insert(usersTable)
    .values({
      email,
      username: body.username ?? null,
      name: body.name,
      passwordHash,
      role: body.role,
      isActive: true,
      createdBy: auth.userId,
    })
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      username: usersTable.username,
      name: usersTable.name,
      role: usersTable.role,
      isActive: usersTable.isActive,
      createdAt: usersTable.createdAt,
    });

  return NextResponse.json(newUser, { status: 201 });
}
