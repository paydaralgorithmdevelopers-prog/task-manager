import { db } from '@/db';
import { users, userSessions, userPreferences, User, NewUser } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export class UserRepository {
  /**
   * Create a new user
   */
  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  /**
   * Update user
   */
  async update(id: number, data: Partial<NewUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Create user session
   */
  async createSession(data: {
    userId: number;
    refreshToken: string;
    deviceInfo?: any;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    const [session] = await db.insert(userSessions).values(data).returning();
    return session;
  }

  /**
   * Find session by refresh token
   */
  async findSessionByRefreshToken(refreshToken: string) {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.refreshToken, refreshToken))
      .limit(1);
    return session;
  }

  /**
   * Delete session
   */
  async deleteSession(refreshToken: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.refreshToken, refreshToken));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Delete all sessions for user
   */
  async deleteAllUserSessions(userId: number): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.userId, userId));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Get or create user preferences
   */
  async getUserPreferences(userId: number) {
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (!prefs) {
      const [newPrefs] = await db
        .insert(userPreferences)
        .values({ userId })
        .returning();
      return newPrefs;
    }

    return prefs;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: number, data: Partial<typeof userPreferences.$inferInsert>) {
    const [prefs] = await db
      .update(userPreferences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return prefs;
  }
}

export const userRepository = new UserRepository();
