# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build


# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma

# 🔥 CLAVE: el cliente generado va a src/generated/prisma
# Necesitás copiarlo desde el builder ANTES del build
COPY --from=builder /app/src/generated ./src/generated

# También copiar node_modules/.prisma por los binarios nativos
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]