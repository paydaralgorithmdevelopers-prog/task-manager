# Architecture Overview

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 6, strict mode |
| UI | MUI v9 (Material UI) |
| ORM | Drizzle ORM 0.45 + PostgreSQL (`pg`) |
| Auth tokens | `jsonwebtoken` — httpOnly cookies only |
| Password hashing | `bcryptjs`, 10 rounds |
| Forms | `react-hook-form` + `yup` |
| i18n | `i18next`, languages: `en`, `fa` |
| Notifications | `react-toastify` |

## Directory Map

```
src/
├── app/                        Next.js App Router pages & API routes
│   ├── [language]/             i18n-prefixed pages (/en/…, /fa/…)
│   │   ├── dashboard/
│   │   │   ├── page.tsx        Dashboard home (auth-guarded)
│   │   │   └── users/page.tsx  User management (ROOT_ADMIN only)
│   │   ├── login/page.tsx      Login page
│   │   ├── unauthorized/page.tsx  403 page
│   │   └── layout.tsx          Root layout with all providers
│   └── api/
│       ├── auth/login/         POST  — credential login
│       ├── auth/logout/        POST  — clear cookies + invalidate DB token
│       ├── auth/me/            GET   — returns current AuthUser from cookie
│       ├── auth/refresh/       POST  — rotate refresh token
│       ├── users/              GET (list) + POST (create)
│       └── users/[id]/         GET + PATCH + DELETE + POST (reset password)
├── components/
│   ├── app-bar.tsx             Navigation with RBAC-gated links
│   └── …
├── db/
│   └── schema.ts               Drizzle schema (usersTable, tasksTable, …)
├── features/
│   └── auth/
│       ├── components/login-form.tsx  Dark enterprise login UI
│       ├── constants/
│       │   ├── roles.ts         Role enum + labels
│       │   ├── permissions.ts   Permission enum + role→permission map
│       │   └── routes.ts        Route-level access config
│       ├── guards/permission-guard.tsx
│       └── hooks/use-permission.ts
├── lib/
│   └── db.ts                   Drizzle connection singleton
├── middleware.ts               JWT verification + silent refresh + role check
├── services/
│   └── auth/
│       ├── auth-context.ts     React contexts (AuthContext, AuthActionsContext)
│       ├── auth-provider.tsx   Calls /api/auth/me on mount
│       ├── use-auth.ts         Hook: { user, isLoaded }
│       ├── use-auth-actions.ts Hook: { setUser, logOut }
│       ├── with-page-required-auth.tsx  HOC for page-level auth guard
│       └── jwt.service.ts      generateTokens / verifyToken
└── types/
    └── auth.types.ts           AuthUser, LoginRequest, Role (re-export)
```

## Request Flow

```
Browser
  │
  ▼
middleware.ts
  ├─ reads accessToken cookie
  ├─ if expired → tries refreshToken cookie (silent refresh)
  ├─ sets x-user-id / x-user-email / x-user-role headers
  ├─ checks route roles → redirect to /unauthorized if insufficient
  └─ continues to Next.js handler
        │
        ▼
     Page / API Route
```

## Auth Flow

```
1. User submits email + password
2. POST /api/auth/login
   ├─ rate-limit: 10 req / 15 min per IP
   ├─ verify password (bcrypt, always runs to prevent timing attacks)
   ├─ generate accessToken (15 min) + refreshToken (1–30 days)
   ├─ store bcrypt(refreshToken) in DB
   └─ set httpOnly cookies: accessToken, refreshToken
3. Browser stores nothing in localStorage — only httpOnly cookies
4. Subsequent requests: middleware reads cookies automatically
5. Token refresh: middleware does it silently; /api/auth/refresh available for clients
6. Logout: POST /api/auth/logout → clear DB hash + clear cookies
```
