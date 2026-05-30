import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/server/services/auth/auth.service';
import { formatErrorResponse } from '@/server/utils/errors';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: { message: 'Refresh token not found', statusCode: 401 } }, { status: 401 });
    }

    // Refresh tokens
    const result = await authService.refreshToken(refreshToken);

    // Set new cookies
    const response = NextResponse.json(result, { status: 200 });

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

    // Clear invalid cookies
    const response = NextResponse.json(errorResponse, { status: error.statusCode || 500 });
    response.cookies.set('accessToken', '', { maxAge: 0 });
    response.cookies.set('refreshToken', '', { maxAge: 0 });

    return response;
  }
}
