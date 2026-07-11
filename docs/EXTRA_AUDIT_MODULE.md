# Extra: Módulo de Audit Logs — Documentación

**Fecha:** 2026-07-10
**Estado:** Completado
**Tipo:** Extra (no planificado en fases originales)

---

## Objetivo

Exponer los datos de `audit_logs` (que el sistema ya escribe automáticamente vía Prisma extension) a través de endpoints REST para consultar el historial de cambios de cualquier registro.

---

## Contexto

### Arquitectura existente (write-only)

```
Prisma extension ($extends)
         │
         ├── CREATE → audit_logs.create()
         ├── UPDATE → audit_logs.create() (old_data + new_data)
         └── DELETE → audit_logs.create()
         
Resultado: datos guardados pero NUNCA consultados
```

### Este módulo agrega la capa de lectura

```
 audit.service.ts
       │
       ├── findAll()      → query general con filtros
       ├── findByRecord()  → historial de 1 registro
       ├── findByUser()    → actividad de 1 usuario
       └── getStats()      → estadísticas de actividad
```

---

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `src/modules/erp/audit/audit.module.ts` | Módulo NestJS |
| `src/modules/erp/audit/audit.controller.ts` | 4 endpoints |
| `src/modules/erp/audit/audit.service.ts` | Lógica de consulta |
| `src/modules/erp/audit/dto/query-audit.dto.ts` | DTO de filtros |
| `https/erp/audit.http` | Requests para probar |

---

## Endpoints

### `GET /api/erp/audit` — Historial general

Query params:

| Param | Tipo | Descripción |
|-------|------|-------------|
| `table` | string | Filtrar por nombre de tabla |
| `record_id` | string | Filtrar por ID de registro |
| `action` | CREATE/UPDATE/DELETE/RESTORE | Filtrar por tipo de acción |
| `user_id` | UUID | Filtrar por usuario que hizo el cambio |
| `days` | number | Últimos N días (max 365) |
| `limit` | number | Resultados por página (default 50, max 100) |
| `offset` | number | Offset para paginación |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "table_name": "employees",
      "record_id": "uuid",
      "old_data": { ... },
      "new_data": { ... },
      "action": "UPDATE",
      "changed_by": "uuid",
      "changed_at": "2026-07-10T...",
      "ip_address": "127.0.0.1"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### `GET /api/erp/audit/:table/:recordId` — Historial de un registro

Retorna todos los cambios de un registro específico, con resolución cross-DB del usuario:

```json
[
  {
    "id": "uuid",
    "table_name": "employees",
    "record_id": "uuid",
    "old_data": { "position": "Dev" },
    "new_data": { "position": "Senior Dev" },
    "action": "UPDATE",
    "changed_by": "uuid",
    "user": {
      "id": "uuid",
      "name": "Admin",
      "email": "admin@mail.com"
    }
  }
]
```

### `GET /api/erp/audit/user/:userId` — Actividad de un usuario

Últimos 100 cambios de un usuario, opcionalmente filtrados por días.

### `GET /api/erp/audit/stats` — Estadísticas

```json
{
  "period": "7 days",
  "total": 234,
  "byAction": [
    { "action": "CREATE", "count": 45 },
    { "action": "UPDATE", "count": 180 },
    { "action": "DELETE", "count": 9 }
  ],
  "topTables": [
    { "table": "payments", "count": 89 },
    { "table": "documents", "count": 67 }
  ]
}
```

---

## Resolución Cross-DB

El módulo resuelve el nombre del usuario desde `public.users` usando `getDefaultClient()`:

```typescript
// audit.service.ts
const publicPrisma = this.db.getDefaultClient();
const users = await publicPrisma.users.findMany({
  where: { id: { in: userIds } },
  select: { id: true, name: true, email: true },
});
```

Esto permite mostrar "quién hizo el cambio" aunque el audit log esté en la DB del tenant.

---

## Verificación

- [x] `audit.module.ts` creado
- [x] `audit.controller.ts` con 4 endpoints
- [x] `audit.service.ts` con findAll, findByRecord, findByUser, getStats
- [x] `dto/query-audit.dto.ts` con filtros validados
- [x] Registrado en `erp.modules.ts`
- [x] `https/erp/audit.http` creado (8 requests)
- [x] `prisma validate` ✅
- [x] `tsc --noEmit` ✅
