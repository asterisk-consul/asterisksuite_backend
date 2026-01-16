# ===== BUILD =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npm run build


# ===== RUNTIME =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY prisma ./prisma
COPY --from=builder /app/dist ./dist

# 🔑 Generar Prisma YA EN PRODUCCIÓN
RUN npx prisma generate

EXPOSE 3008
CMD ["node", "dist/src/main.js"]
