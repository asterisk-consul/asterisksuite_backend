# Responsable de documentos

Los documentos ERP permiten asignar un responsable, independiente de su estado,
creador y vendedor comercial. La acción está disponible en el encabezado de
ventas, presupuestos, pedidos y remitos, y en el detalle de comprobantes de compra.

- Requiere `documents.update` (OWNER conserva su bypass).
- El destinatario debe ser un usuario activo y no eliminado de la empresa actual.
- La asignación conserva el estado y `created_by`.
- La extensión de auditoría existente registra el cambio y su autor.
- El listado de ventas restringido al usuario usa el responsable cuando existe;
  los documentos todavía sin asignar conservan el filtro por creador.
- La asignación no modifica el vendedor ni sus comisiones, ni concede permisos
  adicionales al destinatario.

## Activación

Aplicar `prisma/migrations/20260907_document_assignee/migration.sql` en cada base
de empresa antes de desplegar el cliente Prisma actualizado. Agrega una columna
UUID nullable y su índice; los documentos existentes quedan sin asignar.
No ejecutar esta migración contra la base pública de identidad.

El cliente Prisma se regenera con `pnpm prisma generate`. La migración está
incluida en el repositorio; su aplicación a bases existentes es un paso de despliegue.

## API

- `GET /documents/assignment/users`: destinatarios disponibles (`documents.update`).
- `GET /documents/assignment/:id`: responsable actual (`documents.read`).
- `PATCH /documents/assignment/:id`: cuerpo `{ "user_id": "UUID" } (`documents.update`).
