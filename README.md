# Turboly Adaptive Task Manager

Turboly is a full-stack task management web app built with Next.js 16, TypeScript, Prisma, and React Query.
It supports secure authentication (email/password and Google OAuth), task CRUD, priority-aware sorting, and adaptive dashboards for mobile, tablet, and desktop.

## Why This Project

This project demonstrates:

- End-to-end product thinking (auth, CRUD, responsive UX, validation, session security)
- Real adaptive UI strategy with dedicated mobile/tablet/desktop dashboard components
- Practical full-stack implementation with Next.js App Router, Prisma, and React Query
- Maintainable feature-oriented architecture for future scaling

## Features

- Authentication
  - Email/password login
  - User registration with password hashing
  - Google OAuth login
  - JWT session cookie with route protection
- Task management
  - Create, read, update, delete tasks
  - Mark task complete/incomplete
  - Sort by due date, title, description, priority
  - Search by title/description
  - Date-based filtering from calendar selection
- Adaptive UI
  - Mobile: tab-based dashboard
  - Tablet: collapsible sidebar + task/calendar switching
  - Desktop: two-panel productivity layout
- Alert summaries
  - Due today
  - Overdue
  - Open
  - Completed
  - All tasks

## Screenshots

Add screenshots to show major user flows and adaptive layouts.

- Login page
- Register page
- Mobile dashboard (Home / Tasks / Calendar / Profile)
- Tablet dashboard (collapsed and expanded sidebar)
- Desktop dashboard

Recommended screenshot naming convention:

```txt
docs/screenshots/
	login.png
	register.png
	mobile-home.png
	mobile-tasks.png
	tablet-collapsed.png
	tablet-expanded.png
	desktop-dashboard.png
```

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19, Tailwind CSS 4, lucide-react
- Data fetching/state: @tanstack/react-query
- Database: SQLite + Prisma ORM
- Validation: Zod
- Auth/session: bcryptjs + jose (JWT)

## Project Structure

```txt
src/
	app/
		api/
			auth/
			tasks/
		dashboard/
		login/
		register/
		unauthorized/
	components/
		adaptive/
			mobile/
			tablet/
			desktop/
		shared/
		ui/
	features/
		task/
	hooks/
	lib/
		auth/
		prisma/
		validations/
	providers/
	types/
prisma/
	schema.prisma
middleware.ts
```

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment

Create `.env` (or `.env.local`) from `.env.example`:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-long-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APP_URL="http://localhost:3000"
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Initialize database

```bash
yarn prisma generate
yarn prisma db push
```

### 4. Run development server

```bash
yarn dev
```

Open `http://localhost:3000`.

## Scripts

- `yarn dev` - run development server
- `yarn build` - build production bundle
- `yarn start` - run production server
- `yarn lint` - run ESLint

## Authentication Flow

### Email/Password

1. Register via `POST /api/auth/register`
2. Login via `POST /api/auth/login`
3. Server validates credentials and sets `turboly_session` cookie
4. Middleware protects private routes (e.g. `/dashboard`)

### Google OAuth

1. User clicks `Continue with Google`
2. Redirect to `GET /api/auth/google`
3. Callback handled by `GET /api/auth/google/callback`
4. Verified Google email signs in existing user or auto-creates new user
5. Session cookie is set, then redirect to dashboard

## API Overview

### Auth Endpoints

- `POST /api/auth/register` - create account
- `POST /api/auth/login` - login with email/password
- `POST /api/auth/logout` - clear session
- `GET /api/auth/google` - start Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

### Task Endpoints

- `GET /api/tasks` - list current user tasks
- `POST /api/tasks` - create task
- `PATCH /api/tasks/[taskId]` - update task
- `DELETE /api/tasks/[taskId]` - delete task

All `/api/tasks/*` endpoints require valid session.

## Validation Rules

- Login/Register
  - valid email
  - password min 8 chars
- Task
  - `title`: required, max 120 chars
  - `description`: optional, max 400 chars
  - `priority`: `LOW | MEDIUM | HIGH`
  - `dueDate`: required date string

## UI Adaptation Strategy

The dashboard uses dedicated adaptive components instead of one monolithic layout:

- Mobile: `src/components/adaptive/mobile/mobile-dashboard-panels.tsx`
- Tablet: `src/components/adaptive/tablet/tablet-dashboard-panels.tsx`
- Desktop: `src/components/adaptive/desktop/desktop-dashboard-panels.tsx`

This keeps device-specific behavior explicit and easier to maintain.

## What I Would Improve Next

- Add unit/integration tests for auth and task route handlers
- Add E2E scenarios for adaptive layout behavior
- Add provider-based auth model for social login identities
- Add CI pipeline gates for lint, typecheck, and tests

## Security Notes

- Passwords are hashed using bcrypt
- Session token is signed JWT (`jose`)
- Session cookie is `httpOnly` and `sameSite=lax`
- Cookie `secure` flag is enabled in production
- Google OAuth uses state validation to prevent CSRF

## Troubleshooting

- If OAuth fails:
  - Verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APP_URL`
  - Ensure Google Console redirect URI matches exactly:
    - `http://localhost:3000/api/auth/google/callback`
- If DB errors occur:
  - Re-run `yarn prisma generate` and `yarn prisma db push`
- If lint fails after dependency updates:
  - Ensure dependencies are installed and lockfile is in sync
  - Run `yarn install` then `yarn lint`

## License

Internal coding challenge project.
