# ACIM Cloud Architecture Success Cases Portal

A premium glassmorphism enterprise portal for Azure cloud consultants to showcase ACIM success stories — dark mode, Azure blue accents, KPI scorecards, and admin management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/acim-portal run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

**Admin credentials:** username=`admin`, password=`acim2024`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, framer-motion, lucide-react, wouter
- API: Express 5, PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for server), Vite (frontend)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/successCases.ts` — DB schema for success_cases table
- `artifacts/api-server/src/routes/successCases.ts` — CRUD + stats routes
- `artifacts/api-server/src/routes/admin.ts` — Mock admin auth routes
- `artifacts/acim-portal/src/pages/` — Frontend pages (home, case-detail, admin/*)
- `artifacts/acim-portal/src/index.css` — Dark mode theme (Azure blue primary)

## Architecture decisions

- Contract-first: OpenAPI spec gates codegen which gates frontend hooks
- Orval zod config uses `mode: "single"` (not split) to avoid barrel export conflicts
- `lib/api-spec/package.json` codegen script overwrites `lib/api-zod/src/index.ts` after orval to remove generated barrel conflicts
- Dark mode enforced via `class="dark"` on `<html>` in `index.html`
- Admin auth is mock-only (hardcoded credentials + localStorage token) — intended for prototyping ACIM program

## Product

- **Public dashboard** (`/`): Hero with KPI stats, searchable glassmorphism grid of success cases with framer-motion animations
- **Case detail** (`/cases/:id`): Executive summary, Azure Analyzer KPI gauges, Azure Auditor findings, discovery map lightbox
- **Admin login** (`/admin`): Secure-looking auth form (mock)
- **Admin dashboard** (`/admin/dashboard`): Manage all cases (create/edit/delete)
- **Case form** (`/admin/cases/new`, `/admin/cases/:id/edit`): Three-section form (Basic Info, Azure Analyzer Export, Azure Auditor Report + Discovery Map)

## User preferences

- Premium glassmorphism UI: dark mode default, Azure blue accents, backdrop-blur cards
- Spanish content for case descriptions
- Enterprise / Fortune 500 aesthetic

## Gotchas

- `@apply dark` is invalid in Tailwind v4 — use `class="dark"` on `<html>` in index.html
- Orval in split mode generates conflicting barrel — codegen script rewrites `lib/api-zod/src/index.ts`
- API server routes: `/success-cases/stats` must be defined BEFORE `/:id` route to avoid param capture

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the full API contract
