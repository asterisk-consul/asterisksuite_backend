# syntax=docker/dockerfile:1

# ============================================================
# 1. Build del frontend (Nuxt SPA)
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

RUN npm install -g pnpm

COPY frontend/ ./

# PUBLIC_API_BASE vacío => el front llama a /api en el mismo origen
ARG PUBLIC_API_BASE=""
ENV PUBLIC_API_BASE=${PUBLIC_API_BASE}

RUN pnpm install --frozen-lockfile
RUN pnpm run build

# ============================================================
# 2. Build del backend (NestJS)
# ============================================================
FROM node:20-alpine AS backend-builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN pnpm run build

# ============================================================
# 3. Runtime: backend + frontend en una sola imagen
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=backend-builder /app/dist ./dist
COPY --from=frontend-builder /app/frontend/.output/public ./public

EXPOSE 3008

CMD ["node", "dist/src/main.js"]
