import { db } from '@/db';
import { organizations, organizationMembers, Organization, NewOrganization } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export class OrganizationRepository {
  /**
   * Create a new organization
   */
  async create(data: NewOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(data).returning();
    return org;
  }

  /**
   * Find organization by ID
   */
  async findById(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return org;
  }

  /**
   * Find organization by slug
   */
  async findBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
    return org;
  }

  /**
   * Update organization
   */
  async update(id: number, data: Partial<NewOrganization>): Promise<Organization | undefined> {
    const [org] = await db
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org;
  }

  /**
   * Delete organization
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Add member to organization
   */
  async addMember(organizationId: number, userId: number, role: string) {
    const [member] = await db
      .insert(organizationMembers)
      .values({
        organizationId,
        userId,
        role: role as any,
      })
      .returning();
    return member;
  }

  /**
   * Remove member from organization
   */
  async removeMember(organizationId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(organizationMembers)
      .where(
        and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId))
      );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Get organization members
   */
  async getMembers(organizationId: number) {
    return db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.organizationId, organizationId));
  }

  /**
   * Check if user is organization member
   */
  async isMember(organizationId: number, userId: number): Promise<boolean> {
    const [member] = await db
      .select()
      .from(organizationMembers)
      .where(
        and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId))
      )
      .limit(1);
    return !!member;
  }

  /**
   * Get user's organizations
   */
  async getUserOrganizations(userId: number) {
    const memberships = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, userId));

    if (memberships.length === 0) {
      return [];
    }

    const orgIds = memberships.map((m) => m.organizationId);
    return db
      .select()
      .from(organizations)
      .where(
        eq(
          organizations.id,
          orgIds[0] as any
        )
      );
  }

  /**
   * Update member role
   */
  async updateMemberRole(organizationId: number, userId: number, role: string) {
    const [member] = await db
      .update(organizationMembers)
      .set({ role: role as any })
      .where(
        and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId))
      )
      .returning();
    return member;
  }
}

export const organizationRepository = new OrganizationRepository();
