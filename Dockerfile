# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
# Genera el cliente en la ubicación personalizada
RUN npx prisma generate --generator client --output ./src/generated/prisma

COPY . .
RUN npm run build

# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copiar el cliente generado en la ubicación personalizada
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]