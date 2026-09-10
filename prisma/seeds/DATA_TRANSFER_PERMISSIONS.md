# Permisos de importación y exportación

Registrar solamente el catálogo en cada tenant:

```powershell
npx tsx prisma/seeds/data-transfer-permissions.seed.ts dev
```

El comando no asigna permisos ni modifica roles. Después se administran desde
Configuración → Roles. `OWNER` conserva acceso automático.

Permisos disponibles:

- `products.import` / `products.export`
- `business_parties.import` / `business_parties.export`
- `sales.documents.import` / `sales.documents.export`
- `purchases.documents.import` / `purchases.documents.export`
- `accounts.import` / `accounts.export`
- `treasury.payments.import` / `treasury.payments.export`
- `sales.reports.export`, `purchases.reports.export`
- `treasury.reports.export`, `logistics.reports.export`

`data_import.execute` se mantiene temporalmente como permiso general compatible
para las importaciones del módulo antiguo. No otorga permisos de exportación.

Para restringir empleados existentes, asignar los permisos específicos deseados y
retirar `data_import.execute` de sus roles. No hay migración automática de roles.
