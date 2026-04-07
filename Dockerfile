# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN npm run build

# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]