# Contour Education Mini LMS

A student-facing mini Learning Management System where students can sign up,
log in, view their consultations, mark them as complete/incomplete, and book
new consultations.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19, TailwindCSS 4
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth (password-based) with `@supabase/ssr`
- **Validation:** Yup (shared schemas for client + server)
- **Icons:** Lucide React
- **Package Manager:** Yarn

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

## Setup Instructions

### 1. Install dependencies

```bash
yarn install
```

### 2. Start local Supabase

Make sure Docker Desktop is running, then:

```bash
yarn supabase start
```

This spins up local Supabase services (Postgres, Auth, REST API, Studio).
On first run it may take a few minutes to pull Docker images.

Once started, the CLI outputs your local credentials:

| Service         | URL / Port                    |
| --------------- | ----------------------------- |
| API URL         | `http://127.0.0.1:54321`      |
| Studio          | `http://127.0.0.1:54323`      |
| Database (PG)   | `postgresql://...@127.0.0.1:54322/postgres` |
| Anon Key        | `<your-anon-key>`             |

To retrieve the anon key you can navigate to the studio url (http://127.0.0.1:54323) -> Connect on top left -> Choose App Frameworks tab -> COPY both the credentails

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-supabase-start>
```

Copy the `anon key` from the `supabase start` output.

### 4. Run database migrations

```bash
yarn supabase db reset
```

This resets the local database and applies all migrations from
`supabase/migrations/`. It creates the `students` and `consultations`
tables with Row Level Security policies.

### 5. Start the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Stopping Supabase

```bash
yarn supabase stop
```

## Project Structure

```
app/
  layout.tsx                  Root layout (fonts, metadata)
  page.tsx                    Home — redirects to /dashboard
  login/page.tsx              Login page (Server Component)
  signup/page.tsx             Signup page (Server Component)
  dashboard/page.tsx          Dashboard (Server Component, auth-guarded)
  error/page.tsx              Generic error page
  actions/
    auth.ts                   Server Actions: login, signup, logout
    consultation.ts           Server Actions: create, toggle complete
components/
  loginForm.tsx               Login form (Client Component)
  signupForm.tsx              Signup form (Client Component)
  consultationDashboard.tsx   Dashboard shell + consultation list
  consultationCard.tsx        Individual consultation with toggle
  bookingModal.tsx            Booking form modal
lib/
  supabase/server.ts          Supabase server client factory
  validations/                Yup schemas (shared client + server)
  utils/date.ts               Date/time formatting helpers
types/
  consultation.ts             Consultation TypeScript type
supabase/
  migrations/                 SQL migrations (schema + RLS)
  config.toml                 Local Supabase configuration
```

## Database Schema

### `students`

| Column     | Type        | Notes                                    |
| ---------- | ----------- | ---------------------------------------- |
| id         | uuid        | PK, references `auth.users(id)` cascade  |
| first_name | text        | not null                                  |
| last_name  | text        | not null                                  |
| phone      | text        | not null                                  |
| created_at | timestamptz | default `now()`                           |
| updated_at | timestamptz | default `now()`                           |

### `consultations`

| Column      | Type        | Notes                                    |
| ----------- | ----------- | ---------------------------------------- |
| id          | uuid        | PK, auto-generated                       |
| user_id     | uuid        | FK to `students(id)`, indexed            |
| first_name  | text        | not null                                  |
| last_name   | text        | not null                                  |
| reason      | text        | not null                                  |
| datetime    | timestamptz | not null                                  |
| is_complete | boolean     | default `false`                           |
| created_at  | timestamptz | default `now()`                           |
| updated_at  | timestamptz | default `now()`                           |

### Row Level Security

Both tables have RLS enabled and forced. Policies ensure users can only
SELECT, INSERT, and UPDATE their own rows using `auth.uid()`.

## Authentication

Password-based authentication using Supabase Auth with `@supabase/ssr`.
I chose password-based over magic link/OTP for simplicity and because it
doesn't require email provider configuration for local development.

- **Sign up:** Creates an `auth.users` record, then inserts a `students`
  row linked by the same UUID.
- **Login:** `signInWithPassword()` — session tokens stored in HTTP cookies
  via the `@supabase/ssr` cookie adapter.
- **Logout:** `signOut()` clears the session and redirects to `/login`.
- **Route protection:** The dashboard Server Component calls `getUser()`
  (which validates the JWT server-side) and redirects unauthenticated
  users to `/login`.

All auth calls happen server-side through Server Actions. No Supabase
browser client is used.

## AI Usage
- Due to time constraint, I did use AI to help me with designing the look of the application (frontend, color-scheme, styling, etc).
- All Tailwindcss along with global.css file are written by AI (Claude Code)


## Implementation Summary

This is my first time working with Next.js (App Router) and Supabase.
Coming from Nuxt & Symfony (PHP), I tried to get a grasp of how things work on a high level
and focused on understanding the core concepts — Server Components vs
Client Components, Server Actions, and Supabase's auth and RLS model —
and applying them as best I could within the time constraints.
There are definitely areas where a more experienced Next.js/Supabase developer would
approach things differently (e.g. middleware for route protection, different way of error handling, communicating with supabase, etc).

I've documented what I'm aware of in the Known Limitations section below.

### Architecture Decisions

- **Server Components by default:** Data fetching happens in Server
  Components. Client Components are used only where interactivity is
  needed (forms, state, event handlers). Initally I used client components and API routes since there's no concept of Server Action in Nuxt (I learnt about this midway through and pivot)

- **Server Actions for all mutations:** Login, signup, logout, booking,
  and toggling complete status all use `"use server"` actions. This keeps
  credentials and database access server-side

- **Dual-layer validation:** Yup schemas are shared between client and
  server. Client-side validation gives instant field-level feedback.
  Server-side re-validation protects against bypassed client checks (could using zod here but I'm more familiar with Yup)

- **RLS - Row level security** Even if application logic has a
  bug, database-level policies prevent cross-user data access, first time I run into this

### Assumptions

- Consultations store their own `first_name` and `last_name` fields
  (as specified in the requirements) rather than joining to the student
  record. This allows student to book a consultation for their friends (maybe?, just my assumption)
- Datetime validation requires the consultation to be in the future at
  the time of submission.
- Password policy enforces minimum 8 characters with uppercase,
  lowercase, digit, and special character.
- No DELETE operations are exposed — consultations cannot be deleted,
  only marked as complete/incomplete. This preserves an audit trail.

### Known Limitations and Trade-offs

- **No middleware route protection:** Route protection is handled within
  the dashboard Server Component rather than via `middleware.ts`. This
  means authenticated users can still visit `/login` and `/signup`, and
  new protected routes would need to implement their own auth guard. In a
  production application, middleware would handle session refresh and
  centralized route protection.

- **No rate limiting:** Server Actions do not have rate limiting.
  In production, this should be added to prevent brute-force login
  attempts and abuse of the booking endpoint (can use Redis for this)

- **No logging or observability:** you might see some of the console logs are commented out and
  there is no structured logging or session tracking. In production,
  I would integrate an observability platform like Sentry or New Relic
  for error tracking, distributed tracing, and monitoring. This would help with debugging production error base on user session as well as performance monitoring so we can easily see where is the bottleneck
in the application

- **No unit/integration tests:** Due to time constraints, no tests were
  written. In production, I would add tests for the Yup validation
  schemas (edge cases like future datetime, password complexity, no
  numbers in names) and integration tests for Server Actions (auth
  flows, consultation CRUD) using Jest.

