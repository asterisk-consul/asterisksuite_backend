# Asterisk Suite

Monorepo que contiene:

- **backend** → API (NestJS + Prisma)
- **frontend** → Aplicación cliente (Nuxt / Vue)

Gestionado con **pnpm workspaces** y ejecución concurrente.

---

## 📦 Requisitos

- Node.js ≥ 18
- pnpm instalado globalmente:

  ```bash
  npm install -g pnpm
  ```

---

## 🚀 Instalación

Desde la raíz del proyecto:

```bash
pnpm install
```

---

## ▶️ Ejecutar ambos (modo desarrollo)

```bash
pnpm dev
```

Este comando:

- Levanta el backend en modo desarrollo
- Levanta el frontend en modo desarrollo
- Muestra logs separados:
  - `[BACK]`
  - `[FRONT]`

---

## ⚙️ Ejecutar servicios por separado

### Backend

```bash
pnpm --filter backend start:dev
```

### Frontend

```bash
pnpm --filter frontend dev
```

---

## 🧩 Prisma (Base de datos)

Los comandos de Prisma se ejecutan sobre el **backend**.

### Generar cliente

```bash
pnpm --filter backend prisma generate
```

---

### Crear una migración

```bash
pnpm --filter backend prisma migrate dev --name nombre_migracion
```

---

### Aplicar migraciones (producción)

```bash
pnpm --filter backend prisma migrate deploy
```

---

### Resetear base de datos

```bash
pnpm --filter backend prisma migrate reset
```

⚠️ Esto borra todos los datos.

---

### Abrir Prisma Studio

```bash
pnpm --filter backend prisma studio
```

---

### Ver estado de migraciones

```bash
pnpm --filter backend prisma migrate status
```

---

### Formatear schema

```bash
pnpm --filter backend prisma format
```

---

## 🧪 Otros comandos útiles

### Instalar dependencia en un paquete

Backend:

```bash
pnpm add <paquete> --filter backend
```

Frontend:

```bash
pnpm add <paquete> --filter frontend
```

---

### Ejecutar scripts específicos

Backend:

```bash
pnpm --filter backend <script>
```

Frontend:

```bash
pnpm --filter frontend <script>
```

---

## 📁 Estructura del proyecto

```js
.
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
├── package.json
├── pnpm-workspace.yaml
```

---

## 🧠 Notas

- Se usa `concurrently` para correr ambos servicios.
- Prisma está aislado en el backend.
- Ideal para desarrollo fullstack sincronizado.

---

## 🐛 Troubleshooting

### pnpm no reconocido

```bash
npm install -g pnpm
```

---

### Problemas con Prisma

```bash
pnpm --filter backend prisma generate
```

o

```bash
pnpm install --force
```

---

## ✍️ Autor

Proyecto interno – ajustar según necesidad.
