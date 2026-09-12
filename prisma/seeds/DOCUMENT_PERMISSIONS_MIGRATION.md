# Migración manual de permisos documentales

El sistema admite permisos por circuito, categoría y acción con el formato
`sales.<categoria>.<accion>` y `purchases.<categoria>.<accion>`.

Primero se registra el catálogo sin cambiar roles:

```powershell
npx tsx prisma/seeds/document-permissions.seed.ts dev
```

Para una empresa nueva o al ejecutar `seed-all.ts`, este catálogo ya está incluido
en `RBAC_PERMISSIONS` y se registra automáticamente mediante `rbac.seed.ts`. El
comando específico se conserva para actualizar solamente el catálogo de una base
existente sin reasignar roles.

## Equivalencias sugeridas

- `documents.<acción>`: asignar la acción a todas las categorías de ventas y compras.
- `sales.<acción>`: asignar la acción a todas las categorías de ventas.
- `purchases.<acción>` o `documents-purchases.<acción>`: asignar la acción a todas las categorías de compras.

Categorías: `quotes`, `orders`, `invoices`, `delivery_notes`, `credit_notes`,
`debit_notes`, `receipts` y `opening_balances`.

Mientras existan permisos generales asignados, funcionan como compatibilidad y
otorgan acceso a todas las categorías de ese circuito para la acción correspondiente.
Para aplicar restricciones granulares, asignar primero los permisos específicos y
después retirar del rol los permisos generales equivalentes.

## Orden recomendado

1. Ejecutar el seed del catálogo en cada tenant.
2. Copiar las asignaciones generales actuales hacia los permisos específicos.
3. Revisar roles personalizados.
4. Retirar permisos generales solamente de los roles que deban quedar restringidos.
5. Probar lectura, creación, edición, confirmación, anulación y eliminación.

No se incluye ni se ejecuta una migración automática de asignaciones.

## SQL sugerido para copiar permisos de roles

Este bloque conserva los permisos generales y copia su alcance actual a los nuevos
permisos. Ejecutarlo después del seed, dentro de la base del tenant:

```sql
WITH legacy_assignments AS (
  SELECT rp.role_id, p.code AS legacy_code
  FROM tenant.business_role_permissions rp
  JOIN tenant.permissions p ON p.id = rp.permission_id
  WHERE p.code ~ '^(documents|sales|purchases|documents-purchases)\.(read|create|update|confirm|cancel|delete)$'
), expanded AS (
  SELECT DISTINCT la.role_id, granular.id AS permission_id
  FROM legacy_assignments la
  JOIN tenant.permissions granular
    ON granular.code ~ '^(sales|purchases)\.(quotes|orders|invoices|delivery_notes|credit_notes|debit_notes|receipts|opening_balances)\.(read|create|update|confirm|cancel|delete)$'
   AND split_part(granular.code, '.', 3) = split_part(la.legacy_code, '.', 2)
   AND (
     split_part(la.legacy_code, '.', 1) = 'documents'
     OR split_part(granular.code, '.', 1) = split_part(la.legacy_code, '.', 1)
     OR (split_part(la.legacy_code, '.', 1) = 'documents-purchases' AND split_part(granular.code, '.', 1) = 'purchases')
   )
)
INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT role_id, permission_id FROM expanded
ON CONFLICT DO NOTHING;
```

Después de revisar el resultado, los permisos generales se pueden retirar desde la
pantalla de roles. No conviene retirarlos antes de copiar y verificar porque el
backend los mantiene como compatibilidad.
