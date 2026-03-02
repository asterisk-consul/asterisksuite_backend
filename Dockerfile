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
RUN npm install --only=production

# Copy generated Prisma client (required!)
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]