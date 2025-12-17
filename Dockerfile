# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json / instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Build de NestJS
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm install --only=production

# Copiar la carpeta dist desde el build
COPY --from=builder /app/dist ./dist

# Copiar el .env
COPY .env .env

# Exponer el puerto de tu app
EXPOSE 3008

# Comando para correr la app
CMD ["node", "dist/main.js"]
