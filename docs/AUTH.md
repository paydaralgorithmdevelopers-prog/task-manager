# Authentication System

## Overview

All authentication is handled internally by Next.js API routes and Drizzle ORM.  
There is **no external auth backend**. Tokens live exclusively in **httpOnly cookies** — never in `localStorage` or `sessionStorage`.

## Endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | No | Credential login |
| `POST` | `/api/auth/logout` | Cookie | Clear session |
| `GET` | `/api/auth/me` | Cookie | Get current user |
| `POST` | `/api/auth/refresh` | Cookie | Rotate tokens |

## Login (`POST /api/auth/login`)

**Request body:**
```json
{ "email": "admin@example.com", "password": "secret", "rememberMe": true }
```

**Success response (200):**
```json
{ "user": { "id": 1, "name": "Alice", "email": "…", "role": "ROOT_ADMIN", "isActive": true, … } }
```

**Error responses:**
- `429` — Rate limit exceeded (10 attempts / 15 min per IP)
- `401` — Invalid credentials
- `403` — Account inactive

**Side effects:**
- Sets `accessToken` cookie (httpOnly, 15 min)
- Sets `refreshToken` cookie (httpOnly, 1 day or 30 days if `rememberMe`)
- Stores `bcrypt(refreshToken)` in `users.refresh_token_hash`

## Token Refresh (`POST /api/auth/refresh`)

Uses the `refreshToken` cookie. Performs **rotation**:
- Issues a new access + refresh token pair
- Updates `refresh_token_hash` in DB
- If an old (already-rotated) token is presented → **all sessions invalidated** (token reuse detection)

## Silent Refresh (Middleware)

`middleware.ts` transparently refreshes tokens on every request:
1. Try to verify `accessToken` cookie
2. If invalid/expired, try `refreshToken`
3. If valid refresh token → generate new access token, set cookie, continue
4. If both invalid → redirect to login (for protected routes)

## Cookies

| Name | httpOnly | Secure | SameSite | Expires |
|---|---|---|---|---|
| `accessToken` | ✅ | In prod | `lax` | 15 min |
| `refreshToken` | ✅ | In prod | `lax` | 1 or 30 days |

## Rate Limiting

In-memory sliding window: 10 failed attempts per IP per 15 minutes.  
Resets on successful login.  
> For production with multiple instances, replace with Redis-backed rate limiter.

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/taskmanager
JWT_SECRET=<at-least-32-char-random-string>
JWT_REFRESH_SECRET=<different-32-char-random-string>
JWT_EXPIRATION=15m       # optional, default 15m
```

## Guards

### Middleware (server-side)
`middleware.ts` reads `PROTECTED_ROUTE_ROLES` from `src/features/auth/constants/routes.ts` and enforces role requirements before the page renders.

### HOC (client-side)
```tsx
export default withPageRequiredAuth(MyPage, { roles: [Role.ROOT_ADMIN] });
```
Redirects to login or unauthorized before rendering the component.

### Hook (in-component)
```tsx
const { can, isRole } = usePermission();
if (can(Permission.USER_CREATE)) { /* show create button */ }
```

### Guard component
```tsx
<PermissionGuard permission={Permission.USER_DELETE} fallback={<span>No access</span>}>
  <DeleteButton />
</PermissionGuard>
```
