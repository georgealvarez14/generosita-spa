# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server
npm run build        # prisma generate && next build
npm run lint         # ESLint (flat config, @typescript-eslint/no-explicit-any: error)
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single pass (used in CI)
npx tsc --noEmit     # Type check without building

# Always run before tsc in a fresh environment — generates @prisma/client types from schema
npx prisma generate

# Run a single test file
npx vitest run src/lib/bookingUtils.test.ts

# Sync schema changes to the database (no migrations, direct push)
npx prisma db push
```

CI order matters: `npm ci` → `prisma generate` → `tsc --noEmit` → `lint` → `test:run`.

## Architecture

### Dual Identity System

The most important non-obvious pattern in this codebase: **two separate identity stores run in parallel**.

- **Supabase Auth** — handles passwords, sessions, JWTs. Used via `createClient()` from `src/utils/supabase/server.ts` (Server Components) or `src/utils/supabase/client.ts` (Client Components).
- **Prisma `cliente` table** — holds profile data and the `rol` field (`"cliente"` | `"admin"`). The `id` in this table is kept in sync with the Supabase Auth `user.id`.

On every login/signup, `syncUserProfile()` in `src/app/login/actions.ts` (a Server Action) bridges the two: it finds or creates the Prisma record, and handles the edge case where the Supabase Auth record was recreated but the Prisma profile still exists with the old ID.

**Authorization flow:** Admin layout (`src/app/admin/layout.tsx`) checks `prisma.cliente.findUnique({ where: { id: user.id } })` and verifies `rol === 'admin'`. Never trust `rol` from the client.

### Date/Time Handling

Prisma returns PostgreSQL `DATE` columns as **midnight UTC** `Date` objects, and `TIME` columns as `Date` objects using local hours. All helpers for this live in `src/lib/bookingUtils.ts`:

- Use `getUTCDateKey(date)` — not `toLocaleDateString` or `getDate()` — to extract `YYYY-MM-DD` from a Prisma `DATE` field. Using local methods causes off-by-one errors on non-UTC servers.
- Use `createNoonUTCDate(fechaStr)` when writing a date back to the DB. Storing at noon UTC prevents the date shifting backward when PostgreSQL converts the timestamp to a `DATE` column.
- Use `formatHoraFromDate(date)` for `TIME` fields — these use local `.getHours()`, which is intentional.

### Prisma + multiSchema Type Workaround

`prisma/schema.prisma` uses `previewFeatures = ["multiSchema"]`. This causes TypeScript to lose type inference on `prisma.cita` operations that include relations. The established workaround throughout the codebase is:

```ts
const citas = await prisma.cita.findMany({
  include: { servicios: true },
}) as unknown as CitaConServicios[]
```

Use types from `src/types/index.ts` for the cast target. Do not cast to `any`.

### Type System

`src/types/index.ts` is the single source of truth for shared types:

- `CitaRecord / CitaConServicios / CitaConRelaciones` — Prisma-side types (dates are `Date` objects)
- `CitaDTO / ServicioDTO / ClienteDTO` — API-side types (dates are `string`, safe to serialize to JSON)
- `InputFieldProps` — for admin form input components
- `StatsResponse / AvailabilityResponse` — API response shapes

### Key Directories

| Path | Purpose |
|---|---|
| `src/app/api/` | Next.js Route Handlers — all serverless API endpoints |
| `src/app/admin/` | Admin panel (role-gated at layout level) |
| `src/app/portal/` | Client self-service portal |
| `src/lib/prisma.ts` | Prisma singleton (prevents connection exhaustion in dev via `globalThis`) |
| `src/lib/bookingUtils.ts` | All time/date logic — tested in `bookingUtils.test.ts` |
| `src/types/index.ts` | Centralized TypeScript interfaces |
| `src/utils/supabase/` | Supabase client factories (server vs. client) |
| `prisma/schema.prisma` | Single schema source of truth — `migration_add_rol.sql` was already applied and deleted |

### Booking Overlap Logic

Conflict detection happens in two places: `src/app/api/bookings/route.ts` (on write) and `src/app/api/availability/route.ts` (on read for the booking form). Both use `isTimeOverlapping(reqStart, reqEnd, existingStart, existingEnd)` from `bookingUtils.ts`. The algorithm is `reqStart < existingEnd && reqEnd > existingStart` — adjacent slots (one ends exactly when the other starts) do **not** overlap.

### Styling

Tailwind CSS **v4** (not v3). The `brand` color token and variants like `brand-dark`, `brand-light` are defined in the global CSS. The `font-outfit` class maps to the Outfit variable font. Do not add inline styles for things these tokens already cover.

### Environment Variables Required

```
DATABASE_URL                    # PostgreSQL connection string (Supabase)
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY       # Service role key (storage uploads, bypasses RLS)
CRON_SECRET                     # Token for /api/notify endpoint
```

`next.config.ts` whitelists the Supabase storage hostname for `next/image`. If the Supabase project changes, update `remotePatterns` there.
