"use client";

import useAuth from "@/services/auth/use-auth";
import {
    hasAllPermissions,
    hasAnyPermission,
    hasPermission,
    Permission,
} from "../constants/permissions";
import { Role } from "../constants/roles";

/**
 * Returns permission-check helpers for the currently authenticated user.
 *
 * Usage:
 *   const { can, canAny, canAll } = usePermission();
 *   if (can(Permission.USER_CREATE)) { ... }
 */
export function usePermission() {
  const { user } = useAuth();

  const role = user?.role as Role | undefined;

  const can = (permission: Permission): boolean => {
    if (!role) return false;
    return hasPermission(role, permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    if (!role) return false;
    return hasAnyPermission(role, permissions);
  };

  const canAll = (permissions: Permission[]): boolean => {
    if (!role) return false;
    return hasAllPermissions(role, permissions);
  };

  const isRole = (r: Role | Role[]): boolean => {
    if (!role) return false;
    return Array.isArray(r) ? r.includes(role) : role === r;
  };

  return { can, canAny, canAll, isRole };
}
