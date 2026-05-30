import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/server/services/tasks/task.service';
import { updateTaskSchema } from '@/server/utils/validators';
import { formatErrorResponse } from '@/server/utils/errors';
import { verifyAccessToken } from '@/server/utils/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    // Get access token
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: { message: 'Unauthorized', statusCode: 401 } }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: { message: 'Invalid token', statusCode: 401 } }, { status: 401 });
    }

    // Get task
    const task = await taskService.getById(parseInt(taskId));

    return NextResponse.json({ task }, { status: 200 });
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    // Get access token
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: { message: 'Unauthorized', statusCode: 401 } }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: { message: 'Invalid token', statusCode: 401 } }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = updateTaskSchema.parse(body);

    // Update task
    const task = await taskService.update(parseInt(taskId), validatedData, payload.userId);

    return NextResponse.json({ task }, { status: 200 });
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    // Get access token
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: { message: 'Unauthorized', statusCode: 401 } }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: { message: 'Invalid token', statusCode: 401 } }, { status: 401 });
    }

    // Delete task
    await taskService.delete(parseInt(taskId), payload.userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}
