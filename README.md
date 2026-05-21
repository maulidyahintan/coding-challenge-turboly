# Turboly Adaptive Task Manager

Turboly is a full-stack task management web app built with Next.js 16, TypeScript, Prisma, and React Query.
It supports secure authentication (email/password and Google OAuth), task CRUD, priority-aware sorting, and adaptive dashboards for mobile, tablet, and desktop.

## Production

- Live app: https://adaptive-task-manager-two.vercel.app

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

### Desktop

![Desktop Login](/screenshoot/dekstop_login.png)
![Desktop Register](/screenshoot/dekstop_register.png)
![Desktop Dashboard](/screenshoot/dekstop_dashboard.png)
![Desktop Create Task](/screenshoot/dekstop_create_task.png)
![Desktop Update Task](/screenshoot/dekstop_update_task.png)

### Tablet

![Tablet Login](/screenshoot/tablet_login.png)
![Tablet Register](/screenshoot/tablet_register.png)
![Tablet Task Manager](/screenshoot/tablet_task_manager.png)
![Tablet Task Manager Max Sidebar](/screenshoot/tablet_task_manager_max_sidebar.png)
![Tablet Calendar Min Sidebar](/screenshoot/tablet_calendar_minimize_sidebar.png)
![Tablet Calendar Max Sidebar](/screenshoot/tablet_calendar_maximize_sidebar.png)
![Tablet Create Task](/screenshoot/tablet_create_task.png)
![Tablet Update Task](/screenshoot/tablet_update_task.png)
![Tablet Unauthorized Page](/screenshoot/tablet_unauthorized_page.png)

### Mobile

![Mobile Login](/screenshoot/mobile_login.png)
![Mobile Register](/screenshoot/mobile_register.png)
![Mobile Tab Home](/screenshoot/mobile_tab_home.png)
![Mobile Tab Tasks](/screenshoot/mobile_tab_tasks.png)
![Mobile Tab Calendar](/screenshoot/mobile_tab_calendar.png)
![Mobile Tab Profile](/screenshoot/mobile_tab_profile.png)
![Mobile Create Task](/screenshoot/mobile_create_task.png)
![Mobile Update Task](/screenshoot/mobile_update_task.png)
![Mobile Unauthorized Page](/screenshoot/mobile_unauthorized_page.png)

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19, Tailwind CSS 4, lucide-react
- Data fetching/state: @tanstack/react-query
- Database: SQLite + Prisma ORM
- Validation: Zod
- Auth/session: bcryptjs + jose (JWT)
- Testing: Jest 30, React Testing Library, jest-environment-jsdom

## Project Structure

```txt
src/
  app/
    api/
      auth/       # login, register, logout, google OAuth routes
      tasks/      # CRUD task routes
    dashboard/    # dashboard page (server component)
    login/
    register/
    unauthorized/
  components/
    adaptive/
      desktop/dashboard/   # desktop two-panel layout
      mobile/dashboard/    # mobile tab-based layout
      tablet/dashboard/    # tablet sidebar layout
    dashboard/
      __tests__/           # unit tests for all dashboard components
        section-calendar/
        task/
      section-calendar/    # month calendar + selected date task list
      task/                # task card, alert square, list section, utils
    ui/                    # shared UI primitives (DataStateMessage, FormLabel, etc.)
  hooks/                   # useLogout, useTasksMutation, useTasksQuery, useAuthMutation
  lib/
    auth/                  # JWT session, server session, auth service
    prisma/                # Prisma client singleton
    validations/           # Zod schemas (auth, task, error)
  providers/               # QueryClientProvider, TasksProvider
  types/
prisma/
  schema.prisma
jest.config.mjs            # Jest configuration
jest.setup.ts              # @testing-library/jest-dom setup
middleware.ts              # route protection middleware
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

- `yarn dev` — run development server
- `yarn build` — build production bundle
- `yarn start` — run production server
- `yarn lint` — run ESLint
- `yarn test` — run all unit tests
- `yarn test:watch` — run unit tests in watch mode

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

## Unit Testing

Tests are written with **Jest** and **React Testing Library**, following `@testing-library` best practices: query by accessible role/label, simulate real user interactions, and assert on visible outcomes.

### Running tests

```bash
yarn test              # run all tests once
yarn test:watch        # re-run on file changes
```

### Test location

All unit tests for dashboard components live in:

```txt
src/components/dashboard/__tests__/
  create-task-button.test.tsx
  dashboard-branding.test.tsx
  delete-confirm-dialog.test.tsx
  logout-button.test.tsx
  task-modal.test.tsx
  task-modal-container.test.tsx
  section-calendar/
    month-calendar.test.tsx
    preview-task-card.test.tsx
    selected-date-task-list.test.tsx
  task/
    task-alert-square.test.tsx
    task-alerts-section.test.tsx
    task-card.test.tsx
    task-list-section.test.tsx
    utils.test.ts
```

**14 test suites — 95 tests — all passing.**

### What is covered

| Suite | Focus |
|---|---|
| `utils.test.ts` | Pure functions: `isOverdueDueDate`, `isDueTodayDate`, `sortTasks`, `filterTasksByQuery`, `readTaskPayload`, `validateTaskPayload` |
| `task-alert-square` | Tone color CSS variable, click handler, active ring, View label visibility |
| `task-card` | Render, overdue state, action callbacks, disabled state |
| `task-list-section` | Loading / empty / error states, search, sort, delete confirm dialog flow |
| `task-alerts-section` | 5 alert squares rendered via mocked context |
| `preview-task-card` | Title, description, priority styles, Detail button |
| `month-calendar` | DayPicker renders, selected date aria attribute |
| `selected-date-task-list` | Date-based task filtering, no-date and empty states |
| `create-task-button` | Render, click |
| `dashboard-branding` | Static text, h1 heading |
| `delete-confirm-dialog` | Confirm / cancel / pending state |
| `task-modal` | Open/close, initial values, submit, delete confirm, task status toggle |
| `task-modal-container` | Create mode via mocked context + mutations |
| `logout-button` | Dropdown toggle, logout call, outside-click close |



## UI Adaptation Strategy

The dashboard uses dedicated adaptive components instead of one monolithic layout:

- Mobile: `src/components/adaptive/mobile/dashboard/index.tsx`
- Tablet: `src/components/adaptive/tablet/dashboard/index.tsx`
- Desktop: `src/components/adaptive/desktop/dashboard/index.tsx`

This keeps device-specific behavior explicit and easier to maintain.

## What I Would Improve Next

- Add unit/integration tests for auth and task API route handlers
- Add E2E scenarios for adaptive layout behavior across breakpoints
- Add provider-based auth model for additional social login identities
- Add CI pipeline gates for lint, typecheck, and test coverage thresholds

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
