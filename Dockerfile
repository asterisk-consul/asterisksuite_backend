# ===== Etapa de build =====
FROM node:22-alpine AS builder

RUN npm install -g pnpm@11.5.2

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
COPY . .

# DATABASE_URL dummy solo para que prisma generate pueda leer el config
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate
RUN pnpm run build

# ===== Etapa de producción =====
FROM node:22-alpine

RUN npm install -g pnpm@11.5.2

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
