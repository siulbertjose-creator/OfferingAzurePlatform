# Readymind Cloud Portfolio Hub

A premium glassmorphism enterprise portal showcasing Readymind's 6 Azure cloud service offerings with real use cases per offering — dark mode, Readymind green (#6DC030) accents, and admin CRUD management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/acim-portal run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-offerings` — seed 6 offerings + sample use cases
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
- `lib/db/src/schema/offerings.ts` — Offerings table schema
- `lib/db/src/schema/useCases.ts` — Use cases table schema (FK → offerings)
- `lib/db/src/schema/successCases.ts` — Legacy success_cases table
- `artifacts/api-server/src/routes/offerings.ts` — Offerings + use cases CRUD routes
- `artifacts/api-server/src/routes/successCases.ts` — Legacy success cases routes
- `artifacts/acim-portal/src/pages/` — Frontend pages (home, offering-detail, admin/*)
- `artifacts/acim-portal/src/index.css` — Dark mode theme (Readymind green primary)

## Architecture decisions

- Contract-first: OpenAPI spec gates codegen which gates frontend hooks
- Orval zod config uses `mode: "single"` (not split) to avoid barrel export conflicts
- `lib/api-spec/package.json` codegen script overwrites `lib/api-zod/src/index.ts` after orval to remove generated barrel conflicts
- Dark mode enforced via `class="dark"` on `<html>` in `index.html`
- Admin auth is mock-only (hardcoded credentials + localStorage token)
- Offerings router registered BEFORE successCases router in `routes/index.ts`

## Product

- **Home** (`/`): Hero + animated 3×2 grid of 6 Readymind service offerings with pillar badges, duration, and benefit summaries
- **Offering Detail** (`/offerings/:id`): Header with pillar + duration, "¿Qué es?" / "¿Qué resuelve?" cards, searchable use cases sub-panel with industry filter and Before/After cards
- **Admin login** (`/admin`): Mock auth form (admin / acim2024)
- **Admin dashboard** (`/admin/dashboard`): Stats, offerings grid (edit/delete/view), use cases list (edit/delete)
- **Offering form** (`/admin/offerings/new`, `/admin/offerings/:id/edit`): Full CRUD form for offerings
- **Use case form** (`/admin/use-cases/new`, `/admin/use-cases/:id/edit`): Full CRUD form for use cases with offering selector, industry selector, Before/After textareas

## User preferences

- Premium glassmorphism UI: dark mode default, Readymind green (#6DC030) accents, backdrop-blur cards
- Spanish content for all descriptions and UI labels
- Enterprise / Fortune 500 aesthetic

## Gotchas

- `@apply dark` is invalid in Tailwind v4 — use `class="dark"` on `<html>` in index.html
- Orval in split mode generates conflicting barrel — codegen script rewrites `lib/api-zod/src/index.ts`
- API server routes: `/success-cases/stats` must be defined BEFORE `/:id` route to avoid param capture
- `useRoute` is broken in child route components — always use `useParams` instead
- Offerings router must be registered before successCasesRouter in `routes/index.ts`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the full API contract
