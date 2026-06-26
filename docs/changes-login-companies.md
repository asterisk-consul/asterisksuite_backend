# Cambios en Login - Empresas del Usuario

## Fecha: 26/06/2026

---

## 1. Objetivo

Agregar al response del `POST /auth/login` la información de las empresas a las que pertenece el usuario, para que el frontend pueda mostrar un selector de empresa y redirigir al subdominio correspondiente sin necesidad de logearse nuevamente.

---

## 2. Archivos modificados

### `src/auth/auth.service.ts`

#### 2.1. `generateTokens()` — Se agregan empresas al response

Se añadió una consulta a la tabla `company_users` para obtener las empresas del usuario y se incluye en el retorno del método.

**Código nuevo (líneas 61-79):**

```typescript
// 🔎 Empresas del usuario
const companyMemberships = await this.prisma.company_users.findMany({
  where: { user_id: user.id },
  include: { company: true },
});

const companies = companyMemberships.map((cu) => ({
  id: cu.company.id,
  name: cu.company.name,
  subdomain: cu.company.subdomain,
  role: cu.role,
}));

return {
  user: safeUser,
  companies,
  accessToken,
  refreshToken,
};
```

Este método es llamado por `login()`, `register()` y `refresh()`, por lo que todos esos endpoints ahora retornan las empresas.

#### 2.2. `getCurrentUser()` — Fix: usar schema `public`

El método `getCurrentUser()` usaba `this.prisma` que resuelve al contexto del tenant (ej: `dev_db`). La tabla `users` está en el schema `public`, por lo que fallaba.

**Antes (línea 260):**
```typescript
const user = await this.prisma.users.findUnique({
```

**Después:**
```typescript
const publicPrisma = this.db.getDefaultClient();
const user = await publicPrisma.users.findUnique({
```

### `prisma/schema/public.prisma`

#### 2.3. Fix: nombre de columna `role` vs `platform_role`

El schema Prisma tenía `platform_role PlatformRole?` pero la columna real en la BD es `role`. Esto causaba errores `ColumnNotFound` al intentar leer/escribir la columna.

**Antes (línea 58):**
```prisma
platform_role PlatformRole?
```

**Después:**
```prisma
role                      PlatformRole?
```

Se regeneró el Prisma client con `npx prisma generate` después del cambio.

---

## 3. Response del login

### `POST /auth/login`

```json
{
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": null
  },
  "companies": [
    {
      "id": "uuid-de-la-empresa",
      "name": "Empresa A",
      "subdomain": "empresaa",
      "role": "OWNER"
    },
    {
      "id": "uuid-otra-empresa",
      "name": "Empresa B",
      "subdomain": "empresab",
      "role": "USER"
    }
  ],
  "accessToken": "eyJ...",
  "refreshToken": "a1b2c3..."
}
```

### Campos de `companies`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string (UUID)` | ID de la empresa |
| `name` | `string` | Nombre de la empresa |
| `subdomain` | `string` | Subdominio único (identificador del tenant) |
| `role` | `string` | Rol del usuario dentro de la empresa: `OWNER`, `ADMIN` o `USER` |

### Si el usuario no tiene empresas

```json
{
  "user": { ... },
  "companies": [],
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

## 4. Validación de subdominio (ya existente, sin cambios)

El `TenantAccessGuard` (`src/common/guards/tenant-access.guard.ts`) valida en **cada request** que:

1. El usuario tiene un JWT válido
2. El header `X-Tenant` o `X-Subdomain` indica una empresa
3. El usuario es miembro de esa empresa

Si el front envía `X-Tenant: empresaa` y el usuario no pertenece a esa empresa → `403 Forbidden`.

---

## 5. Lógica para el Frontend

```
1. Recibir response del POST /auth/login
2. Guardar accessToken y refreshToken
3. Evaluar companies.length:
   - Si === 1: redirigir automáticamente a https://{subdomain}.dominio.com
   - Si > 1: mostrar selector de empresas (name + subdomain)
   - Si === 0: mostrar mensaje "No tenés empresas asignadas"
4. Al elegir empresa, redirigir al subdominio
5. En todas las requests al backend, enviar header:
   X-Tenant: "{subdomain}"
   Authorization: "Bearer {accessToken}"
```

---

## 6. Notas

- El `register()` también retorna companies (será `[]` para usuarios nuevos).
- El `role` en cada empresa (`OWNER`, `ADMIN`, `USER`) es el rol **dentro de esa empresa**, no el rol de plataforma.
- El `role` en el objeto `user` del response es el `platform_role` del usuario (valores: `PLATFORM_OWNER`, `SUPPORT`, `PLATFORM_ADMIN` o `null`).
- No se modificó el JWT. La empresa seleccionada se envía por header `X-Tenant`, no va en el token.
