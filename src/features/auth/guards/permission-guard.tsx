"use client";

import { ReactNode } from "react";
import { Permission } from "../constants/permissions";
import { Role } from "../constants/roles";
import { usePermission } from "../hooks/use-permission";

type PermissionGuardProps = {
  /** Render children only if user has this permission */
  permission?: Permission;
  /** Render children only if user has ALL of these permissions */
  allOf?: Permission[];
  /** Render children only if user has ANY of these permissions */
  anyOf?: Permission[];
  /** Render children only if user has one of these roles */
  roles?: Role[];
  /** Fallback to render when access is denied (default: null) */
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Conditionally renders children based on the current user's permissions/roles.
 * Use this to hide UI elements the user cannot interact with.
 *
 * @example
 * <PermissionGuard permission={Permission.USER_CREATE}>
 *   <CreateUserButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  permission,
  allOf,
  anyOf,
  roles,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { can, canAll, canAny, isRole } = usePermission();

  let allowed = true;

  if (permission !== undefined) allowed = allowed && can(permission);
  if (allOf !== undefined) allowed = allowed && canAll(allOf);
  if (anyOf !== undefined) allowed = allowed && canAny(anyOf);
  if (roles !== undefined) allowed = allowed && isRole(roles);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
