# Task Manager Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── signup/route.ts
│   │   │   ├── refresh/route.ts
│   │   │   └── logout/route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts (CRUD)
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/status/route.ts
│   │   ├── teams/
│   │   │   ├── route.ts
│   │   │   └── [id]/members/route.ts
│   │   └── middleware.ts (JWT verification)
│   ├── [language]/
│   │   ├── dashboard/
│   │   │   ├── page.tsx (Kanban board)
│   │   │   └── layout.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── teams/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── login/
│   │   │   └── page.tsx (Neo style)
│   │   └── layout.tsx (Protected)
│
├── components/
│   ├── kanban/
│   │   ├── kanban-board.tsx
│   │   ├── kanban-column.tsx
│   │   └── task-card.tsx
│   ├── auth/
│   │   └── neo-login-form.tsx
│   └── tasks/
│       ├── task-form.tsx
│       └── task-list.tsx
│
├── database/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── task.entity.ts
│   │   ├── team.entity.ts
│   │   └── team-member.entity.ts
│   ├── migrations/
│   │   └── (auto-generated)
│   ├── data-source.ts
│   └── seed.ts
│
├── hooks/
│   ├── use-tasks.ts
│   └── use-teams.ts
│
├── services/
│   ├── database/
│   │   ├── connection.ts
│   │   └── query-runner.ts
│   ├── auth/
│   │   ├── jwt.service.ts
│   │   ├── password.service.ts
│   │   └── auth.service.ts
│   └── tasks/
│       └── task.service.ts
│
├── types/
│   ├── auth.types.ts
│   ├── task.types.ts
│   └── team.types.ts
│
└── middleware/
    ├── auth.middleware.ts
    └── error-handler.ts
```
