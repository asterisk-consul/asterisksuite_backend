# ==== Build ====
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@11.24.0

# Build-time args (desde Dokploy)
ARG PUBLIC_API_BASE

# Exportarlos al entorno del build (Nuxt los lee acá)
ENV PUBLIC_API_BASE=$PUBLIC_API_BASE

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


# ==== Runtime ====
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm@11.24.0

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000
CMD ["pnpm", "start"]
