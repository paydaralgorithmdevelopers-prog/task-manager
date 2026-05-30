import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/server/services/auth/auth.service';
import { formatErrorResponse } from '@/server/utils/errors';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      // Logout user (delete session)
      await authService.logout(refreshToken);
    }

    // Create response with cleared tokens
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear cookies
    response.cookies.set('accessToken', '', { maxAge: 0 });
    response.cookies.set('refreshToken', '', { maxAge: 0 });

    return response;
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}
