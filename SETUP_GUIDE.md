# 🚀 Task Manager - Setup & Configuration Guide

## Phase 1 Status ✅

- ✅ Folder structure designed and created
- ✅ TypeORM + Database drivers installed
- ✅ Database configuration ready
- ✅ Auth middleware implemented
- ✅ Neo-style login page created
- ✅ Auth routes protected (middleware.ts)

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- PostgreSQL 13+ running locally or remotely
- npm 8+

---

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE task_manager_dev;

# Create user (optional)
CREATE USER task_manager WITH PASSWORD 'your_secure_password';
ALTER ROLE task_manager WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO task_manager;

# Quit
\q
```

### Step 2: Configure Environment Variables

Copy `example.env.local` to `.env.local` and update:

```bash
# Copy template
cp example.env.local .env.local
```

Edit `.env.local`:

```env
# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/task_manager_dev
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_manager_dev
DB_SYNCHRONIZE=true        # Auto-create tables (dev only!)
DB_LOGGING=true             # Log SQL queries

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

---

## 🔧 Running the Application

### Development Mode

```bash
# Install dependencies (if not done)
npm install --legacy-peer-deps

# Run development server with TypeORM sync
npm run dev
```

The app will:
1. Connect to PostgreSQL
2. Auto-create tables (if `DB_SYNCHRONIZE=true`)
3. Start at `http://localhost:3000`

### Database Migrations (for production)

When `DB_SYNCHRONIZE=false`, use migrations:

```bash
# Create a new migration
npx typeorm migration:create src/database/migrations/InitialSchema

# Run migrations
npx typeorm migration:run -d src/database/data-source.ts

# Revert migrations
npx typeorm migration:revert -d src/database/data-source.ts
```

---

## 🔐 Authentication Flow

### Login Flow

1. User enters credentials on **Neo-style Login Page** (`/login`)
2. Frontend sends POST `/api/auth/login`
3. Backend verifies credentials in PostgreSQL
4. JWT tokens generated (access + refresh)
5. Tokens stored in secure cookies
6. User redirected to `/dashboard`

### Route Protection

All routes are protected by `middleware.ts`:
- **Public routes**: `/login`, `/sign-up`, `/forgot-password`
- **Protected routes**: Everything else redirects to login if no valid token

---

## 📁 Key Files Overview

```
├── src/
│   ├── database/
│   │   ├── data-source.ts          # TypeORM connection config
│   │   └── entities/index.ts       # User, Task, Team entities
│   ├── middleware/
│   │   └── auth.middleware.ts      # JWT verification & auth helpers
│   ├── services/auth/
│   │   ├── jwt.service.ts          # Token generation/verification
│   │   └── password.service.ts     # Password hashing/comparing
│   ├── components/auth/
│   │   └── neo-login-form.tsx      # Cool neo-style login UI
│   ├── app/api/auth/
│   │   ├── login/route.ts          # Login endpoint
│   │   └── logout/route.ts         # Logout endpoint
│   └── app/[language]/
│       ├── login/page.tsx          # Login page
│       └── dashboard/page.tsx      # Protected dashboard
├── middleware.ts                    # Route protection middleware
└── tsconfig.json                    # Updated for TypeORM decorators
```

---

## 🧪 Testing Login

### Test Credentials (seed later)

After adding test users to database:

```
Email: test@example.com
Password: Test@1234
```

### API Testing with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'

# Response will include:
# - accessToken (JWT)
# - refreshToken (JWT)
# - user object
```

---

## 🔄 Next Steps (Phase 2)

1. **Create User Seed Script**
   - Create test users with hashed passwords
   - Run on initial database setup

2. **Implement Sign-Up Endpoint**
   - Validate email
   - Hash password
   - Create user record

3. **Token Refresh Endpoint**
   - Verify refresh token
   - Generate new access token

4. **Task CRUD Endpoints**
   - Create task
   - Update task status
   - Delete task

5. **Kanban Board Component**
   - Fetch tasks from API
   - Display in 3 columns (todo, in-progress, done)
   - Drag & drop to change status

---

## 🆘 Troubleshooting

### Port 5432 already in use
```bash
# On Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5432
kill -9 <PID>
```

### Database connection error
- Verify PostgreSQL is running
- Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD in .env.local
- Ensure database exists: `psql -U postgres -l`

### TypeORM decorator errors
- Ensure `experimentalDecorators: true` in tsconfig.json ✅
- Rebuild: `npm run dev`

### Token verification failing
- Clear browser cookies: DevTools → Application → Cookies
- Check JWT_SECRET matches in .env.local
- Verify token hasn't expired

---

## 📚 Useful Commands

```bash
# View database
psql -U postgres -d task_manager_dev

# View tables
\dt

# Clear all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Check if middleware is loading
# Monitor server logs for auth messages

# Kill stuck PostgreSQL process
sudo pkill -f postgres
```

---

## 🎨 Neo-Style Design Features

Your login page includes:
- ✨ Gradient glow effects (pink/cyan)
- 🎯 Bold monospace typography
- 🔲 Brutalist border styling
- 💫 Smooth transitions & hover effects
- 🌙 Dark theme with glass morphism

---

## 📞 Support

For TypeORM docs: https://typeorm.io
For Next.js docs: https://nextjs.org
For JWT: https://jwt.io

---

**Status**: Ready for Phase 2 🚀
**Last Updated**: 2026-05-26
