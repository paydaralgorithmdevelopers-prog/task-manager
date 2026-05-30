import { projectRepository } from '@/server/repositories/project.repository';
import { sprintRepository } from '@/server/repositories/sprint.repository';
import { taskRepository } from '@/server/repositories/task.repository';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/server/utils/errors';
import { hasPermission, UserWithPermissions } from '@/server/utils/permissions';
import { CreateTaskInput, UpdateTaskInput } from '@/server/utils/validators';

export class TaskService {
  /**
   * Create a new task
   */
  async create(projectId: number, data: CreateTaskInput, userId: number) {
    // Verify project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Verify sprint exists if provided
    if (data.sprintId) {
      const sprint = await sprintRepository.findById(data.sprintId);
      if (!sprint || sprint.projectId !== projectId) {
        throw new BadRequestError('Invalid sprint');
      }
    }

    // Get next task number and generate key
    const taskNumber = await taskRepository.getNextTaskNumber(projectId);
    const key = `${project.key}-${taskNumber}`;

    // Create task
    const task = await taskRepository.create({
      ...data,
      key,
      projectId,
      createdBy: userId,
    });

    return task;
  }

  /**
   * Get task by ID
   */
  async getById(id: number) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }

  /**
   * Get task by key
   */
  async getByKey(key: string) {
    const task = await taskRepository.findByKey(key);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }

  /**
   * Get tasks by project
   */
  async getByProject(projectId: number) {
    return taskRepository.findByProject(projectId);
  }

  /**
   * Get tasks by sprint
   */
  async getBySprint(sprintId: number) {
    return taskRepository.findBySprint(sprintId);
  }

  /**
   * Get tasks by status
   */
  async getByStatus(projectId: number, status: string) {
    return taskRepository.findByStatus(projectId, status);
  }

  /**
   * Get tasks assigned to user
   */
  async getByAssignee(userId: number) {
    return taskRepository.findByAssignee(userId);
  }

  /**
   * Update task
   */
  async update(id: number, data: UpdateTaskInput, userId: number) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check permissions (simplified - in production, check user role)
    const user = { id: userId, role: undefined as any } as UserWithPermissions;
    if (!hasPermission(user, 'task.update', task))

    // Verify sprint exists if being updated
    if (data.sprintId) {
      const sprint = await sprintRepository.findById(data.sprintId);
      if (!sprint || sprint.projectId !== task.projectId) {
        throw new BadRequestError('Invalid sprint');
      }
    }

    // Update task
    const updatedTask = await taskRepository.update(id, data);
    return updatedTask;
  }

  /**
   * Delete task
   */
  async delete(id: number, userId: number) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check permissions
    const user = { id: userId, role: undefined as any } as UserWithPermissions;
    if (!hasPermission(user, 'task.delete', task)) {
      throw new ForbiddenError('Not authorized to delete this task');
    }

    await taskRepository.delete(id);
    return { success: true };
  }

  /**
   * Assign task
   */
  async assign(id: number, assigneeId: number) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return taskRepository.update(id, { assignedTo: assigneeId });
  }

  /**
   * Change task status
   */
  async changeStatus(id: number, status: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const completedAt = status === 'done' ? new Date() : null;
    return taskRepository.update(id, { status: status as any, completedAt });
  }

  /**
   * Add label to task
   */
  async addLabel(taskId: number, labelId: number) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return taskRepository.addLabel(taskId, labelId);
  }

  /**
   * Remove label from task
   */
  async removeLabel(taskId: number, labelId: number) {
    return taskRepository.removeLabel(taskId, labelId);
  }

  /**
   * Add watcher to task
   */
  async addWatcher(taskId: number, userId: number) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return taskRepository.addWatcher(taskId, userId);
  }

  /**
   * Remove watcher from task
   */
  async removeWatcher(taskId: number, userId: number) {
    return taskRepository.removeWatcher(taskId, userId);
  }

  /**
   * Search tasks
   */
  async search(projectId: number, query: string) {
    return taskRepository.search(projectId, query);
  }

  /**
   * Get subtasks
   */
  async getSubtasks(parentTaskId: number) {
    return taskRepository.getSubtasks(parentTaskId);
  }

  /**
   * Reorder tasks
   */
  async reorder(updates: { id: number; position: number; status?: string }[]) {
    // Update positions and status if changed
    for (const update of updates) {
      if (update.status) {
        await taskRepository.update(update.id, {
          position: update.position,
          status: update.status as any,
        });
      }
    }

    await taskRepository.updatePositions(updates.map(({ id, position }) => ({ id, position })));
    return { success: true };
  }
}

export const taskService = new TaskService();
