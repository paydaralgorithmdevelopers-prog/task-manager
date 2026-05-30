/**
 * Seed script — creates the ROOT_ADMIN user if it does not already exist.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 */

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌  DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  const USERNAME = "admin";
  const EMAIL = "admin@taskmaster.local";
  const PASSWORD = "admin";
  const NAME = "Root Admin";
  const ROLE = "ROOT_ADMIN";

  // Check if the root admin already exists
  const existing = await db
    .select({ id: schema.usersTable.id })
    .from(schema.usersTable)
    .where(eq(schema.usersTable.username, USERNAME))
    .limit(1);

  if (existing.length > 0) {
    console.log(`ℹ️  Root admin '${USERNAME}' already exists (id=${existing[0].id}). Skipping.`);
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const [user] = await db
    .insert(schema.usersTable)
    .values({
      name: NAME,
      username: USERNAME,
      email: EMAIL,
      passwordHash,
      role: ROLE,
      isActive: true,
    })
    .returning({ id: schema.usersTable.id, email: schema.usersTable.email });

  console.log(`✅  Root admin created — id=${user.id}, email=${user.email}`);
  console.log(`    username : ${USERNAME}`);
  console.log(`    password : ${PASSWORD}`);
  console.log(`\n⚠️  Change the default password after first login!`);

  await pool.end();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
