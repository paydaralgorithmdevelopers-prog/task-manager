import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/server/services/tasks/task.service';
import { createTaskSchema } from '@/server/utils/validators';
import { formatErrorResponse } from '@/server/utils/errors';
import { verifyAccessToken } from '@/server/utils/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get access token
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: { message: 'Unauthorized', statusCode: 401 } }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: { message: 'Invalid token', statusCode: 401 } }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const sprintId = searchParams.get('sprintId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let tasks;

    if (search && projectId) {
      tasks = await taskService.search(parseInt(projectId), search);
    } else if (sprintId) {
      tasks = await taskService.getBySprint(parseInt(sprintId));
    } else if (assigneeId) {
      tasks = await taskService.getByAssignee(parseInt(assigneeId));
    } else if (status && projectId) {
      tasks = await taskService.getByStatus(parseInt(projectId), status);
    } else if (projectId) {
      tasks = await taskService.getByProject(parseInt(projectId));
    } else {
      return NextResponse.json({ error: { message: 'Missing required parameters', statusCode: 400 } }, { status: 400 });
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const validatedData = createTaskSchema.parse(body);

    // Get project ID from body
    const { projectId, ...taskData } = body;
    if (!projectId) {
      return NextResponse.json({ error: { message: 'Project ID is required', statusCode: 400 } }, { status: 400 });
    }

    // Create task
    const task = await taskService.create(parseInt(projectId), taskData, payload.userId);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: error.statusCode || 500 });
  }
}
