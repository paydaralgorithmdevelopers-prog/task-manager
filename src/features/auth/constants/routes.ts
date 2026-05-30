import { Role } from "./roles";

/**
 * Route-level access control.
 * Maps path prefixes to the minimum roles that can access them.
 * An empty array means "any authenticated user".
 */
export const PROTECTED_ROUTE_ROLES: Array<{
  pattern: RegExp;
  roles: Role[];
}> = [
  {
    // User management — ROOT_ADMIN only
    pattern: /\/dashboard\/users/,
    roles: [Role.ROOT_ADMIN],
  },
  {
    // Settings — ROOT_ADMIN only
    pattern: /\/dashboard\/settings/,
    roles: [Role.ROOT_ADMIN],
  },
  {
    // All dashboard routes — any authenticated user
    pattern: /\/dashboard/,
    roles: [],
  },
];

export const PUBLIC_ROUTES = ["/login", "/unauthorized", "/"];

/**
 * Returns whether a given pathname (without language prefix) is public.
 */
export function isPublicPath(pathWithoutLang: string): boolean {
  return PUBLIC_ROUTES.some(
    (r) => pathWithoutLang === r || pathWithoutLang.startsWith(r + "/")
  );
}

/**
 * Returns the required roles for a given pathname (without language prefix).
 * Returns null if the path is not in the protected routes list.
 * Returns empty array if any authenticated user may access.
 */
export function getRequiredRoles(pathWithoutLang: string): Role[] | null {
  for (const route of PROTECTED_ROUTE_ROLES) {
    if (route.pattern.test(pathWithoutLang)) {
      return route.roles;
    }
  }
  return null;
}
