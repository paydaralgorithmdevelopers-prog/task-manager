import { db } from '@/db';
import { sprints, Sprint, NewSprint } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export class SprintRepository {
  /**
   * Create a new sprint
   */
  async create(data: NewSprint): Promise<Sprint> {
    const [sprint] = await db.insert(sprints).values(data).returning();
    return sprint;
  }

  /**
   * Find sprint by ID
   */
  async findById(id: number): Promise<Sprint | undefined> {
    const [sprint] = await db.select().from(sprints).where(eq(sprints.id, id)).limit(1);
    return sprint;
  }

  /**
   * Find sprints by project
   */
  async findByProject(projectId: number): Promise<Sprint[]> {
    return db
      .select()
      .from(sprints)
      .where(eq(sprints.projectId, projectId))
      .orderBy(desc(sprints.createdAt));
  }

  /**
   * Find active sprint for project
   */
  async findActiveByProject(projectId: number): Promise<Sprint | undefined> {
    const [sprint] = await db
      .select()
      .from(sprints)
      .where(and(eq(sprints.projectId, projectId), eq(sprints.status, 'active')))
      .limit(1);
    return sprint;
  }

  /**
   * Find sprints by status
   */
  async findByStatus(projectId: number, status: string): Promise<Sprint[]> {
    return db
      .select()
      .from(sprints)
      .where(and(eq(sprints.projectId, projectId), eq(sprints.status, status as any)))
      .orderBy(desc(sprints.createdAt));
  }

  /**
   * Update sprint
   */
  async update(id: number, data: Partial<NewSprint>): Promise<Sprint | undefined> {
    const [sprint] = await db
      .update(sprints)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sprints.id, id))
      .returning();
    return sprint;
  }

  /**
   * Delete sprint
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(sprints).where(eq(sprints.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Start sprint
   */
  async start(id: number): Promise<Sprint | undefined> {
    return this.update(id, { status: 'active' });
  }

  /**
   * Complete sprint
   */
  async complete(id: number): Promise<Sprint | undefined> {
    return this.update(id, { status: 'completed' });
  }
}

export const sprintRepository = new SprintRepository();
