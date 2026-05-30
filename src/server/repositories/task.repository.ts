import { db } from '@/db';
import { tasks, taskLabels, taskWatchers, Task, NewTask } from '@/db/schema';
import { eq, and, inArray, desc, sql, or } from 'drizzle-orm';

export class TaskRepository {
  /**
   * Create a new task
   */
  async create(data: NewTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(data).returning();
    return task;
  }

  /**
   * Find task by ID
   */
  async findById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return task;
  }

  /**
   * Find task by key
   */
  async findByKey(key: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.key, key)).limit(1);
    return task;
  }

  /**
   * Find tasks by project
   */
  async findByProject(projectId: number): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Find tasks by sprint
   */
  async findBySprint(sprintId: number): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.sprintId, sprintId))
      .orderBy(tasks.position);
  }

  /**
   * Find tasks by status
   */
  async findByStatus(projectId: number, status: string): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.status, status as any)))
      .orderBy(tasks.position);
  }

  /**
   * Find tasks assigned to user
   */
  async findByAssignee(userId: number): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedTo, userId))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Update task
   */
  async update(id: number, data: Partial<NewTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  /**
   * Delete task
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Get next task number for project
   */
  async getNextTaskNumber(projectId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(eq(tasks.projectId, projectId));
    return (result[0]?.count || 0) + 1;
  }

  /**
   * Add label to task
   */
  async addLabel(taskId: number, labelId: number) {
    const [label] = await db.insert(taskLabels).values({ taskId, labelId }).returning();
    return label;
  }

  /**
   * Remove label from task
   */
  async removeLabel(taskId: number, labelId: number): Promise<boolean> {
    const result = await db
      .delete(taskLabels)
      .where(and(eq(taskLabels.taskId, taskId), eq(taskLabels.labelId, labelId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Get task labels
   */
  async getLabels(taskId: number) {
    return db.select().from(taskLabels).where(eq(taskLabels.taskId, taskId));
  }

  /**
   * Add watcher to task
   */
  async addWatcher(taskId: number, userId: number) {
    const [watcher] = await db.insert(taskWatchers).values({ taskId, userId }).returning();
    return watcher;
  }

  /**
   * Remove watcher from task
   */
  async removeWatcher(taskId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(taskWatchers)
      .where(and(eq(taskWatchers.taskId, taskId), eq(taskWatchers.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Get task watchers
   */
  async getWatchers(taskId: number) {
    return db.select().from(taskWatchers).where(eq(taskWatchers.taskId, taskId));
  }

  /**
   * Search tasks
   */
  async search(projectId: number, query: string): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          or(
            sql`${tasks.title} ILIKE ${`%${query}%`}`,
            sql`${tasks.description} ILIKE ${`%${query}%`}`,
            sql`${tasks.key} ILIKE ${`%${query}%`}`
          )
        )
      )
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Get subtasks
   */
  async getSubtasks(parentTaskId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.parentTaskId, parentTaskId));
  }

  /**
   * Update task positions
   */
  async updatePositions(updates: { id: number; position: number }[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (const update of updates) {
        await tx.update(tasks).set({ position: update.position }).where(eq(tasks.id, update.id));
      }
    });
  }
}

export const taskRepository = new TaskRepository();
