import { db } from '@/db';
import { projects, projectMembers, Project, NewProject } from '@/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';

export class ProjectRepository {
  /**
   * Create a new project
   */
  async create(data: NewProject): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  /**
   * Find project by ID
   */
  async findById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return project;
  }

  /**
   * Find projects by organization
   */
  async findByOrganization(organizationId: number): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.organizationId, organizationId))
      .orderBy(desc(projects.createdAt));
  }

  /**
   * Find project by organization and key
   */
  async findByOrgAndKey(organizationId: number, key: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.organizationId, organizationId), eq(projects.key, key)))
      .limit(1);
    return project;
  }

  /**
   * Update project
   */
  async update(id: number, data: Partial<NewProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  /**
   * Delete project
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Add member to project
   */
  async addMember(projectId: number, userId: number, role: string) {
    const [member] = await db
      .insert(projectMembers)
      .values({
        projectId,
        userId,
        role: role as any,
      })
      .returning();
    return member;
  }

  /**
   * Remove member from project
   */
  async removeMember(projectId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Get project members
   */
  async getMembers(projectId: number) {
    return db.select().from(projectMembers).where(eq(projectMembers.projectId, projectId));
  }

  /**
   * Check if user is project member
   */
  async isMember(projectId: number, userId: number): Promise<boolean> {
    const [member] = await db
      .select()
      .from(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
      .limit(1);
    return !!member;
  }

  /**
   * Get user's projects
   */
  async getUserProjects(userId: number): Promise<Project[]> {
    const memberProjects = await db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(eq(projectMembers.userId, userId));

    if (memberProjects.length === 0) {
      return [];
    }

    const projectIds = memberProjects.map((m) => m.projectId);
    return db.select().from(projects).where(inArray(projects.id, projectIds));
  }

  /**
   * Update member role
   */
  async updateMemberRole(projectId: number, userId: number, role: string) {
    const [member] = await db
      .update(projectMembers)
      .set({ role: role as any })
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
      .returning();
    return member;
  }
}

export const projectRepository = new ProjectRepository();
