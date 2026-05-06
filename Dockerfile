# ─── Stage 1: Install all dependencies ───────────────────────────────────────
FROM node:24-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.base.json tsconfig.json ./

COPY lib/api-spec/package.json          ./lib/api-spec/
COPY lib/api-zod/package.json           ./lib/api-zod/
COPY lib/api-client-react/package.json  ./lib/api-client-react/
COPY lib/db/package.json                ./lib/db/

COPY artifacts/api-server/package.json  ./artifacts/api-server/
COPY artifacts/acim-portal/package.json ./artifacts/acim-portal/

RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build frontend (React + Vite) ───────────────────────────────────
FROM deps AS frontend-builder

COPY lib/               ./lib/
COPY artifacts/acim-portal/ ./artifacts/acim-portal/

# PORT and BASE_PATH are required by vite.config.ts at build time
ENV PORT=3000 \
    BASE_PATH=/ \
    NODE_ENV=production \
    REPL_ID=""

RUN pnpm --filter @workspace/acim-portal run build

# ─── Stage 3: Build backend (Express + esbuild) ───────────────────────────────
FROM frontend-builder AS backend-builder

COPY artifacts/api-server/ ./artifacts/api-server/

RUN pnpm --filter @workspace/api-server run build

# ─── Stage 4: Production image ────────────────────────────────────────────────
FROM node:24-alpine AS production

WORKDIR /app

# Bundled API server (all deps inlined by esbuild)
COPY --from=backend-builder /app/artifacts/api-server/dist ./dist

# Built React frontend static files
COPY --from=frontend-builder /app/artifacts/acim-portal/dist/public ./public

ENV NODE_ENV=production \
    PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
