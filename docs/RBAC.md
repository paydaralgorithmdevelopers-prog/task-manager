# Role-Based Access Control (RBAC)

## Roles

| Role | Description |
|---|---|
| `ROOT_ADMIN` | Full access — user management, all CRUD |
| `SCRUM_MASTER` | Manage sprints, boards, tasks; no user management |
| `DEVELOPER` | Create and update their own tasks; view boards |
| `VIEWER` | Read-only access to tasks, boards, sprints |

Defined in: `src/features/auth/constants/roles.ts`

```ts
export enum Role {
  ROOT_ADMIN = "ROOT_ADMIN",
  SCRUM_MASTER = "SCRUM_MASTER",
  DEVELOPER = "DEVELOPER",
  VIEWER = "VIEWER",
}
```

## Permissions

Defined in: `src/features/auth/constants/permissions.ts`

| Permission | ROOT_ADMIN | SCRUM_MASTER | DEVELOPER | VIEWER |
|---|:---:|:---:|:---:|:---:|
| `user:create` | ✅ | | | |
| `user:read` | ✅ | | | |
| `user:update` | ✅ | | | |
| `user:delete` | ✅ | | | |
| `user:assign_role` | ✅ | | | |
| `user:reset_password` | ✅ | | | |
| `task:create` | ✅ | ✅ | ✅ | |
| `task:read` | ✅ | ✅ | ✅ | ✅ |
| `task:update` | ✅ | ✅ | ✅ | |
| `task:delete` | ✅ | ✅ | | |
| `task:assign` | ✅ | ✅ | | |
| `board:create` | ✅ | ✅ | | |
| `board:read` | ✅ | ✅ | ✅ | ✅ |
| `board:update` | ✅ | ✅ | | |
| `board:delete` | ✅ | ✅ | | |
| `sprint:manage` | ✅ | ✅ | | |
| `sprint:read` | ✅ | ✅ | ✅ | ✅ |
| `team:manage` | ✅ | ✅ | | |
| `team:view` | ✅ | ✅ | ✅ | ✅ |

## Route-Level Access

Defined in: `src/features/auth/constants/routes.ts`

```ts
export const PROTECTED_ROUTE_ROLES = [
  { pattern: /^\/dashboard\/users/, roles: [Role.ROOT_ADMIN] },
  { pattern: /^\/dashboard/, roles: [Role.ROOT_ADMIN, Role.SCRUM_MASTER, Role.DEVELOPER, Role.VIEWER] },
];
```

Add new route restrictions here — the middleware reads this config automatically.

## API-Level Enforcement

Every API route that modifies data uses `requirePermission()`:

```ts
// src/app/api/users/route.ts
const auth = requirePermission(request, Permission.USER_CREATE);
if (auth instanceof NextResponse) return auth; // 401/403
```

`requirePermission` reads the `x-user-role` header injected by middleware and checks against `ROLE_PERMISSIONS`.

## Adding a New Role

1. Add the value to `Role` enum in `roles.ts`
2. Add a `ROLE_LABELS` entry
3. Add a `ROLE_PERMISSIONS[Role.NEW_ROLE]` array in `permissions.ts`
4. Add a DB migration to handle the new role string value
5. Update `PROTECTED_ROUTE_ROLES` if needed

## No Magic Strings Policy

- Never hardcode role strings like `"admin"` in component logic
- Always import from `@/features/auth/constants/roles` or `@/features/auth/constants/permissions`
- Type system enforces this — `Role` and `Permission` are string enums
