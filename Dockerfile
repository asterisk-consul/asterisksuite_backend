# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
# Ahora sin --output, solo especificamos el generador
RUN npx prisma generate --generator client

COPY . .
RUN npm run build

# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copiar el cliente generado (estará en src/generated según schema.prisma)
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]