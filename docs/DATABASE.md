# Database Schema

## Connection

`src/lib/db.ts` — singleton Drizzle instance using `pg` connection pool.

```ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

## Users Table

```sql
CREATE TABLE users (
  id              INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name            VARCHAR(255) NOT NULL,
  username        VARCHAR(100) UNIQUE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255),
  avatar          VARCHAR(512),
  role            VARCHAR(50)  NOT NULL DEFAULT 'VIEWER',
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  refresh_token_hash VARCHAR(255),
  created_by      INTEGER REFERENCES users(id),
  created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX users_email_idx    ON users(email);
CREATE INDEX users_username_idx ON users(username);
CREATE INDEX users_role_idx     ON users(role);
```

### Field Notes

| Field | Purpose |
|---|---|
| `role` | One of: `ROOT_ADMIN`, `SCRUM_MASTER`, `DEVELOPER`, `VIEWER` |
| `is_active` | When `false`, login is rejected with 403 |
| `refresh_token_hash` | `bcrypt` hash of current refresh token. Cleared on logout. Rotation detection: if presented token doesn't match hash, all sessions are invalidated. |
| `created_by` | `id` of the ROOT_ADMIN who created this user |
| `password_hash` | `bcrypt` hash, 10 rounds |

## Migrations

Migrations live in `drizzle/` and are managed by Drizzle Kit.

```bash
# Generate a new migration from schema changes
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate

# Open Drizzle Studio (visual DB browser)
npx drizzle-kit studio
```

Config: `drizzle.config.ts`

## Seeding the First ROOT_ADMIN

There is no signup UI — all users are created by a ROOT_ADMIN.  
To bootstrap the first admin, run a one-time seed script:

```ts
// scripts/seed-admin.ts
import { db } from "../src/lib/db";
import { usersTable } from "../src/db/schema";
import bcrypt from "bcryptjs";
import { Role } from "../src/features/auth/constants/roles";

await db.insert(usersTable).values({
  name: "Root Admin",
  email: "admin@example.com",
  passwordHash: await bcrypt.hash("ChangeMe123!", 10),
  role: Role.ROOT_ADMIN,
  isActive: true,
});
```

Run with: `npx tsx scripts/seed-admin.ts`
