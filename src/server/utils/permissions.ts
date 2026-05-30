import { Permission, Role, ROLE_PERMISSIONS, roleHasPermission as roleHasPermissionBase } from '@/shared/constants/permissions';

export interface UserWithPermissions {
  id: number;
  email: string;
  role?: Role;
  organizationId?: number;
  projectRole?: Role;
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  user: UserWithPermissions | null | undefined,
  permission: Permission,
  resource?: any
): boolean {
  if (!user || !user.role) {
    return false;
  }

  // Check basic role permission
  if (!roleHasPermissionBase(user.role, permission)) {
    return false;
  }

  // Context-specific permission checks
  if (resource) {
    // Check if user can update a task (must be assigned or creator)
    if (permission === 'task.update' && resource.assignedTo) {
      return resource.assignedTo === user.id || resource.createdBy === user.id;
    }

    // Check if user can delete a task (must be creator, team lead, or project manager)
    if (permission === 'task.delete') {
      return (
        resource.createdBy === user.id ||
        user.role === 'team_lead' ||
        user.role === 'project_manager' ||
        user.role === 'org_owner'
      );
    }

    // Check if user can update/delete comments (must be author)
    if ((permission === 'comment.update' || permission === 'comment.delete') && resource.userId) {
      return resource.userId === user.id;
    }
  }

  return true;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: UserWithPermissions | null | undefined,
  permissions: Permission[],
  resource?: any
): boolean {
  return permissions.some((permission) => hasPermission(user, permission, resource));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: UserWithPermissions | null | undefined,
  permissions: Permission[],
  resource?: any
): boolean {
  return permissions.every((permission) => hasPermission(user, permission, resource));
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: UserWithPermissions | null | undefined): Permission[] {
  if (!user || !user.role) {
    return [];
  }

  return ROLE_PERMISSIONS[user.role] || [];
}

/**
 * Check if user can access organization
 */
export function canAccessOrganization(
  user: UserWithPermissions | null | undefined,
  organizationId: number
): boolean {
  if (!user) {
    return false;
  }

  // Super admin can access all organizations
  if (user.role === 'super_admin') {
    return true;
  }

  // User must belong to the organization
  return user.organizationId === organizationId;
}

/**
 * Check if user can access project
 */
export function canAccessProject(
  user: UserWithPermissions | null | undefined,
  project: { organizationId: number; id: number }
): boolean {
  if (!user) {
    return false;
  }

  // Must be able to access the organization
  return canAccessOrganization(user, project.organizationId);
}
