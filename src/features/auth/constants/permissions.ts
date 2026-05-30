import { Role } from "./roles";

export enum Permission {
  // ─── User Management (ROOT_ADMIN only) ────────────────────────────
  USER_CREATE = "user:create",
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  USER_ASSIGN_ROLE = "user:assign_role",
  USER_RESET_PASSWORD = "user:reset_password",
  USER_TOGGLE_ACTIVE = "user:toggle_active",

  // ─── Task Permissions ─────────────────────────────────────────────
  TASK_CREATE = "task:create",
  TASK_READ = "task:read",
  TASK_UPDATE = "task:update",
  TASK_DELETE = "task:delete",
  TASK_ASSIGN = "task:assign",
  TASK_UPDATE_STATUS = "task:update_status",
  TASK_COMMENT = "task:comment",

  // ─── Board Permissions ────────────────────────────────────────────
  BOARD_CREATE = "board:create",
  BOARD_READ = "board:read",
  BOARD_UPDATE = "board:update",
  BOARD_DELETE = "board:delete",

  // ─── Sprint Permissions ───────────────────────────────────────────
  SPRINT_CREATE = "sprint:create",
  SPRINT_READ = "sprint:read",
  SPRINT_UPDATE = "sprint:update",
  SPRINT_DELETE = "sprint:delete",

  // ─── Team Permissions ─────────────────────────────────────────────
  TEAM_VIEW = "team:view",
  TEAM_MANAGE = "team:manage",

  // ─── Settings ─────────────────────────────────────────────────────
  SETTINGS_READ = "settings:read",
  SETTINGS_UPDATE = "settings:update",
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ROOT_ADMIN]: Object.values(Permission),

  [Role.SCRUM_MASTER]: [
    Permission.USER_READ,
    Permission.TASK_CREATE,
    Permission.TASK_READ,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    Permission.TASK_UPDATE_STATUS,
    Permission.TASK_COMMENT,
    Permission.BOARD_CREATE,
    Permission.BOARD_READ,
    Permission.BOARD_UPDATE,
    Permission.BOARD_DELETE,
    Permission.SPRINT_CREATE,
    Permission.SPRINT_READ,
    Permission.SPRINT_UPDATE,
    Permission.SPRINT_DELETE,
    Permission.TEAM_VIEW,
    Permission.TEAM_MANAGE,
    Permission.SETTINGS_READ,
  ],

  [Role.DEVELOPER]: [
    Permission.USER_READ,
    Permission.TASK_READ,
    Permission.TASK_UPDATE_STATUS,
    Permission.TASK_COMMENT,
    Permission.BOARD_READ,
    Permission.SPRINT_READ,
    Permission.TEAM_VIEW,
  ],

  [Role.VIEWER]: [
    Permission.TASK_READ,
    Permission.BOARD_READ,
    Permission.SPRINT_READ,
    Permission.TEAM_VIEW,
  ],
};

/**
 * Check if a role has a specific permission.
 * Use this instead of `user.role === "ROOT_ADMIN"` comparisons.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
