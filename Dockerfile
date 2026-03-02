# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# 🔥 Schema necesario en runtime para el cliente custom
COPY prisma/schema.prisma ./dist/src/generated/prisma/schema.prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]