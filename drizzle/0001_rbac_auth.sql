-- Migration: Add RBAC fields to users table
-- Run this against an existing database to apply schema changes.
-- For a fresh database, use drizzle-kit migrate (which runs 0000_unusual_namor.sql first).

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "username" varchar(100) UNIQUE,
  ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "refresh_token_hash" varchar(255),
  ADD COLUMN IF NOT EXISTS "created_by" integer;

-- Migrate existing status column to is_active
UPDATE "users" SET "is_active" = CASE WHEN "status" = 'active' THEN true ELSE false END;

-- Drop the old status column (optional — comment out if backward compat needed)
ALTER TABLE "users" DROP COLUMN IF EXISTS "status";

-- Update role values from old naming to new RBAC naming
UPDATE "users" SET "role" = 'ROOT_ADMIN' WHERE "role" = 'admin';
UPDATE "users" SET "role" = 'DEVELOPER' WHERE "role" IN ('user', 'developer');

-- Alter role default
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'VIEWER';

-- Indexes
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" ("username");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");
