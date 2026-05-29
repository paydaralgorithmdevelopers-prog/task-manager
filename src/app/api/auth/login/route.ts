import { getDatabase } from "@/database/data-source";
import { UserEntity } from "@/database/entities";
import { jwtService } from "@/services/auth/jwt.service";
import { passwordService } from "@/services/auth/password.service";
import { LoginRequest } from "@/types/auth.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const userRepository = db.getRepository(UserEntity);

    const body: LoginRequest = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email (include password for comparison)
    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email: body.email })
      .addSelect("user.passwordHash")
      .getOne();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await passwordService.comparePassword(
      body.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "User account is inactive" },
        { status: 403 }
      );
    }

    // Generate tokens
    const tokens = jwtService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token hash in database
    const refreshTokenHash = await passwordService.hashPassword(tokens.refreshToken);
    user.refreshTokenHash = refreshTokenHash;
    await userRepository.save(user);

    // Set secure cookies
    const response = NextResponse.json(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("[LOGIN] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
