# Fase 0: Preparación RBAC — Documentación

**Fecha:** 2026-07-10
**Estado:** Completado
**Epic:** Módulo de Tesorería (AS-278)

---

## Objetivo

Preparar la infraestructura RBAC (Role-Based Access Control) para que funcione correctamente cuando se active módulo por módulo. Se fixearon bugs críticos, se registró el guard global (comentado), y se dejaron 15+ controllers preparados con imports y decorators comentados.

---

## Problemas Detectados y Resueltos

### Bug 1: OWNER bypass muerto
**Archivo:** `src/common/guards/tenant-access.guard.ts`
**Problema:** `PermissionsGuard` verificaba `request.companyUserRole === 'OWNER'` pero nunca se seteaba en el request.
**Solución:** Agregar `req['companyUserRole'] = membership.role` después del check de membership.

```typescript
// Línea 88 — NUEVO
req['companyUserRole'] = membership.role;
```

### Bug 2: PermissionsGuard no registrado como APP_GUARD
**Archivo:** `src/access-control/access-control.module.ts`
**Problema:** `PermissionsGuard` era provider del módulo pero no se ejecutaba automáticamente.
**Solución:** Registrar como `APP_GUARD` (comentado, listo para activar).

```typescript
// { provide: APP_GUARD, useClass: PermissionsGuard },  // ← COMENTADO
```

### Bug 3: PermissionsGuard no exportado
**Archivo:** `src/access-control/access-control.module.ts`
**Problema:** No podía ser usado por otros módulos.
**Solución:** Agregar a `exports`.

### Bug 4: 3 controllers con @RequirePermissions activos sin PermissionsGuard
**Archivos:**
- `src/modules/master-data/products/products.controller.ts`
- `src/modules/erp/currencies/currencies.controller.ts`
- `src/modules/erp/documents-sales/documents_sales.controller.ts`

**Problema:** Tenían `@RequirePermissions()` activo pero solo `@UseGuards(JwtAuthGuard)` — el decorator no se ejecutaba.
**Solución:** Comentar los decorators `@RequirePermissions` e imports para que coincidan con el patrón del resto.

---

## Controllers Preparados (Imports y Decorators Comentados)

Todos estos controllers tienen `// import { RequirePermissions }` y `// @RequirePermissions(...)` listos para descomentar:

| # | Controller | Permiso(s) |
|---|-----------|------------|
| 1 | `companies.controller.ts` | `companies.*` |
| 2 | `taxes.controller.ts` | `taxes.*` |
| 3 | `accounts.controller.ts` | `accounts.*` |
| 4 | `units.controller.ts` | `units.*` |
| 5 | `categories.controller.ts` | `categories.*` |
| 6 | `attributes.controller.ts` | `attributes.*` |
| 7 | `tags.controller.ts` | `tags.*` |
| 8 | `contacts.controller.ts` | `contacts.*` |
| 9 | `business-parties.controller.ts` | `business_parties.*` |
| 10 | `document-sequence.controller.ts` | `document_sequences.*` |
| 11 | `warehouses.controller.ts` | `warehouses.*` |
| 12 | `currency-rates.controller.ts` | `currency-rates.*` |
| 13 | `documents-purchases.controller.ts` | `documents-purchases.*` |
| 14 | `documents-types.controller.ts` | `documents-types.*` |
| 15 | `trash.controller.ts` | `trash.*` |
| 16 | `data-import.controller.ts` | `data_import.*` |
| 17 | `pricing-engine.controller.ts` | `pricing-engine.*` |
| 18 | `pallets.controller.ts` | `pallets.*` |
| 19 | `stock.controller.ts` | `stock.*` |
| 20 | `picking.controller.ts` | `picking.*` |
| 21 | `vehicle-combinations.controller.ts` | `vehicle_combinations.*` |
| 22 | `photos.controller.ts` | `media.*` |
| 23 | `variant-costs.controller.ts` | `variant_costs.*` |
| 24 | `purchases.controller.ts` | `purchases.*` |
| 25 | `sales-reports.controller.ts` | `sales-reports.*` |
| 26 | `dispatch_rates.controller.ts` | `dispatch_reports.*` |
| 27 | `product-variants.controller.ts` | `product_variants.*` |
| 28 | `products.controller.ts` | `products.*` |
| 29 | `currencies.controller.ts` | `currencies.*` |
| 30 | `documents_sales.controller.ts` | `documents.*` |

---

## RBAC Seed Ejecutado

**Tenant:** `dev_db`
**Resultado:** 52 permisos, 4 roles creados/actualizados

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| admin | 52 | Acceso total |
| manager | 42 | Sin roles/users/permissions admin |
| user | 18 | Lectura + escritura básica |
| viewer | 12 | Solo lectura (*.read) |

---

## Cómo Activar un Módulo

Cuando se quiera habilitar permisos para un módulo:

1. **Descomentar** el import en el controller:
```typescript
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
```

2. **Descomentar** los decorators en cada método:
```typescript
@RequirePermissions('taxes.create')
@Post()
create(...) {}
```

3. **Descomentar** el APP_GUARD en `access-control.module.ts` (si no está activo):
```typescript
{ provide: APP_GUARD, useClass: PermissionsGuard },
```

4. **Ejecutar seed** si hay permisos nuevos:
```bash
npx tsx prisma/seeds/rbac.seed.ts <tenant>
```

5. **Probar:**
   - Login con rol `admin` → 200
   - Login con rol `viewer` → 403 en POST/PUT/DELETE
   - Sin token → 401

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/common/guards/tenant-access.guard.ts` | +1 línea: `req['companyUserRole'] = membership.role` |
| `src/access-control/access-control.module.ts` | +2 líneas: APP_GUARD comentado, PermissionsGuard exportado |
| `src/modules/master-data/products/products.controller.ts` | Comentado: imports + 6 decorators @RequirePermissions |
| `src/modules/erp/currencies/currencies.controller.ts` | Comentado: imports + 6 decorators @RequirePermissions |
| `src/modules/erp/documents-sales/documents_sales.controller.ts` | Comentado: imports + 9 decorators @RequirePermissions |
| `prisma/seeds/rbac.seed.ts` | Ya existía — ejecutado para tenant dev |

---

## Verificación

- [x] TenantAccessGuard setea `companyUserRole` en request
- [x] PermissionsGuard registrado como APP_GUARD (comentado)
- [x] PermissionsGuard exportado del módulo
- [x] 3 controllers fixeados (decorators comentados)
- [x] 15+ controllers preparados con imports comentados
- [x] RBAC seed ejecutado (52 permisos, 4 roles)
- [x] Servidor arranca sin errores
- [x] Endpoints existentes funcionan sin permisos enforced
