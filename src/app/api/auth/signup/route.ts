import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/server/services/auth/auth.service';
import { signupSchema } from '@/server/utils/validators';
import { formatErrorResponse } from '@/server/utils/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signupSchema.parse(body);

    // Signup user
    const result = await authService.signup(validatedData);

    // Set secure cookies
    const response = NextResponse.json(result, { status: 201 });

    response.cookies.set('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}
