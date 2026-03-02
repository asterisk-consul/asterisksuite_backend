# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Instalamos todas las dependencias para poder buildear
RUN npm install

COPY prisma ./prisma
# Generamos el cliente (esto lo pone en node_modules/.prisma por defecto)
RUN npx prisma generate

COPY . .
RUN npm run build

# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app

# Seteamos el entorno a producción
ENV NODE_ENV=production

COPY package*.json ./
# Instalamos solo dependencias de producción
RUN npm install --only=production

# COPIAMOS el esquema y generamos el cliente en producción
# Esto asegura que el "graph" y los motores (engines) estén donde deben estar
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copiamos el código compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]