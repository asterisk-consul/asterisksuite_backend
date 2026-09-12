# SPEC — Módulo de Operaciones Internacionales

**Fecha**: 24 de Agosto, 2026
**Estado**: P0 implementado (Schema + Backend + Frontend)

---

## 1. Resumen

Módulo de gestión de importaciones/exportaciones internacionales. Actúa como capa de agrupación y seguimiento sobre entidades existentes (documentos, pagos, órdenes de compra, stock) sin duplicar lógica contable.

---

## 2. Decisiones Arquitectónicas

| Decisión | Implementación |
|----------|---------------|
| Multi-tenancy | Database-per-tenant, sin `company_id` en modelos tenant |
| Numeración | Secuencia `document_sequences` con prefix `IMP` (point_of_sale: 0003) |
| Documentos | Tabla intermedia N:M `international_operation_documents` |
| Pagos | Tabla intermedia N:M `international_operation_payments` |
| Órdenes de compra | FK directa `orden_compra_documents.international_operation_id` |
| Gastos | Documentos de compra asociados vía Opción A (sin entidad separada) |
| Países/ubicaciones | FKs a `locations` existente + campos de texto para compatibilidad |
| Puertos (contenedores) | FKs a `locations` existente + campos de texto |
| Recepción de mercadería | Pendiente (esperar modelo formal `goods receipt` del ERP) |
| Landed Cost | Preparado arquitectónicamente, no implementado |

---

## 3. Entidades Creadas

### 3.1 `international_operations` (schema: `international-operations.prisma`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PK | |
| `number` | VARCHAR(20) UNIQUE | Formato IMP-2026-00001 |
| `name` | VARCHAR(255)? | Nombre descriptivo |
| `operation_type` | Enum | IMPORT, EXPORT, OTHER |
| `transport_type` | Enum | MARITIME, AIR, LAND, MULTIMODAL, OTHER |
| `status` | Enum | 10 estados (PLANNED → CLOSED/CANCELLED) |
| `primary_supplier_id` | UUID? FK | → business_parties |
| `origin_country` | VARCHAR(100)? | Texto libre |
| `origin_location` | VARCHAR(255)? | Texto libre |
| `origin_location_id` | UUID? FK | → locations |
| `destination_country` | VARCHAR(100)? | Texto libre |
| `destination_location` | VARCHAR(255)? | Texto libre |
| `destination_location_id` | UUID? FK | → locations |
| `estimated_departure_date` | DATE? | |
| `actual_departure_date` | DATE? | Se setea automáticamente al cambiar a IN_TRANSIT |
| `estimated_arrival_date` | DATE? | ETA |
| `actual_arrival_date` | DATE? | Se setea automáticamente al cambiar a ARRIVED |
| `currency_code` | VARCHAR(10)? | USD, EUR, ARS, etc. |
| `incoterm` | Enum? | EXW, FCA, FOB, CFR, CIF, CPT, CIP, DAP, DPU, DDP |
| `responsible_user_id` | UUID? | |
| `notes` | TEXT? | |

### 3.2 `international_containers`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PK | |
| `operation_id` | UUID FK | → international_operations (CASCADE) |
| `container_number` | VARCHAR(50) | MSCU1234567 |
| `container_type` | Enum | TWENTY_DV, FORTY_DV, FORTY_HC, FORTY_FIVE_HC, OTHER |
| `seal_number` | VARCHAR(50)? | |
| `booking_number` | VARCHAR(50)? | |
| `bill_of_lading` | VARCHAR(50)? | |
| `vessel_name` | VARCHAR(100)? | |
| `voyage_number` | VARCHAR(50)? | |
| `origin_port` | VARCHAR(100)? | Texto |
| `origin_port_id` | UUID? FK | → locations |
| `destination_port` | VARCHAR(100)? | Texto |
| `destination_port_id` | UUID? FK | → locations |
| `estimated_departure_date` | DATE? | |
| `actual_departure_date` | DATE? | |
| `estimated_arrival_date` | DATE? | |
| `actual_arrival_date` | DATE? | |
| `status` | Enum | 9 estados (PREPARING → CLOSED) |
| `weight` | DECIMAL(12,3)? | kg |
| `volume` | DECIMAL(12,3)? | m³ |

### 3.3 `container_events`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PK | |
| `container_id` | UUID FK | → international_containers (CASCADE) |
| `event_type` | Enum | 10 tipos (LOADED_AT_ORIGIN → DELIVERED) |
| `event_date` | DATE | |
| `location_text` | VARCHAR(255)? | Puerto, depósito, aduana |
| `description` | TEXT? | |
| `estimated` | BOOLEAN | default false |
| `created_by` | UUID? | |

### 3.4 `international_operation_documents` (N:M)

| Campo | Tipo |
|-------|------|
| `operation_id` | UUID FK |
| `document_id` | UUID FK |
| `created_at` | TIMESTAMP |

PK compuesta: `@@id([operation_id, document_id])`

### 3.5 `international_operation_payments` (N:M)

| Campo | Tipo |
|-------|------|
| `operation_id` | UUID FK |
| `payment_id` | UUID FK |
| `created_at` | TIMESTAMP |

PK compuesta: `@@id([operation_id, payment_id])`

---

## 4. Enums

```prisma
OperationType:      IMPORT, EXPORT, OTHER
TransportType:      MARITIME, AIR, LAND, MULTIMODAL, OTHER
OperationStatus:    PLANNED, IN_PREPARATION, SHIPPED, IN_TRANSIT, ARRIVED, CUSTOMS, RELEASED, DELIVERED, CLOSED, CANCELLED
ContainerType:      TWENTY_DV, FORTY_DV, FORTY_HC, FORTY_FIVE_HC, OTHER
ContainerStatus:    PREPARING, LOADED, SHIPPED, IN_TRANSIT, ARRIVED, CUSTOMS, RELEASED, DELIVERED, CLOSED
ContainerEventType: LOADED_AT_ORIGIN, DEPARTED_ORIGIN, SHIPPED, IN_TRANSIT, ARRIVED_AT_PORT, CUSTOMS, RELEASED, INLAND_TRANSPORT, ARRIVED_AT_WAREHOUSE, DELIVERED
Incoterm:           EXW, FCA, FOB, CFR, CIF, CPT, CIP, DAP, DPU, DDP
```

---

## 5. Transiciones de Estado

### Operación

```
PLANNED → IN_PREPARATION → SHIPPED → IN_TRANSIT → ARRIVED → CUSTOMS → RELEASED → DELIVERED → CLOSED
```

Cualquier estado → CANCELLED (excepto CLOSED)

### Side effects automáticos

| Transición | Efecto |
|------------|--------|
| → IN_TRANSIT | `actual_departure_date = now()` (si no existe) |
| → ARRIVED | `actual_arrival_date = now()` (si no existe) |

---

## 6. Modificaciones a Entidades Existentes

### `orden_compra_documents` (documents.prisma)

```prisma
international_operation_id String? @db.Uuid
international_operation international_operations? @relation(...)
```

### `documents` (documents.prisma)

Relación inversa: `international_operation_docs international_operation_documents[]`

### `payments` (treasury.prisma)

Relación inversa: `international_operation_payments international_operation_payments[]`

### `business_parties` (parties.prisma)

Relación inversa: `international_operations international_operations[]`

### `locations` (multimodels.prisma)

Relaciones inversas:
- `io_origin_locations international_operations[]`
- `io_destination_locations international_operations[]`
- `ic_origin_ports international_containers[]`
- `ic_destination_ports international_containers[]`

---

## 7. RBAC

**Permiso base:** `international_operations`

| Acción | Código |
|--------|--------|
| Leer | `international_operations.read` |
| Crear | `international_operations.create` |
| Editar | `international_operations.update` |
| Eliminar | `international_operations.delete` |

**Asignación por defecto:**
- admin → todos
- manager → read, create, update (auto-derivado)
- user → read, create, update (hardcoded)
- viewer → read (auto-filtrado)

---

## 8. Secuencia de Numeración

| Campo | Valor |
|-------|-------|
| `name` | Operaciones Internacionales |
| `point_of_sale` | 0003 |
| `prefix` | IMP |
| `automatic` | true |
| Formato | IMP-{year}-{number:5d} → IMP-2026-00001 |

Seed incluido en:
- `prisma/seeds/seed-sql.ts` → `SQL_DOCUMENT_SEQUENCES`
- `prisma/seeds/document-types.seed.ts` → `sequences[]`
- `prisma/seeds/document-types.seed.sql`

---

## 9. Backend — API Endpoints

### Operaciones

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| POST | `/international-operations` | create | Crear operación |
| GET | `/international-operations` | read | Listado paginado + filtros |
| GET | `/international-operations/:id` | read | Detalle con includes |
| GET | `/international-operations/:id/summary` | read | Dashboard/KPIs |
| PATCH | `/international-operations/:id` | update | Editar |
| PATCH | `/international-operations/:id/status` | update | Cambiar estado (con validación) |
| DELETE | `/international-operations/:id` | delete | Soft delete |

### Asociaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/international-operations/:id/documents` | Asociar documento |
| DELETE | `/international-operations/:id/documents/:docId` | Desasociar |
| POST | `/international-operations/:id/payments` | Asociar pago |
| DELETE | `/international-operations/:id/payments/:payId` | Desasociar |
| POST | `/international-operations/:id/purchase-orders` | Asociar OC |
| DELETE | `/international-operations/:id/purchase-orders/:poId` | Desasociar |

### Contenedores

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/international-operations/:id/containers` | Crear |
| GET | `/international-operations/:id/containers` | Listar |
| GET | `/international-operations/containers/:containerId` | Detalle |
| PATCH | `/international-operations/containers/:containerId` | Editar |
| DELETE | `/international-operations/containers/:containerId` | Soft delete |

### Eventos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/international-operations/containers/:containerId/events` | Crear |
| GET | `/international-operations/containers/:containerId/events` | Listar |
| DELETE | `/international-operations/events/:eventId` | Eliminar |

---

## 10. Frontend — Archivos

### Módulo (`app/modulos/international-operations/`)

| Archivo | Descripción |
|---------|-------------|
| `types/international-operations.types.ts` | Interfaces y DTOs |
| `service/international-operations.service.ts` | $fetch wrapper |
| `store/international-operations.store.ts` | Pinia store |
| `composable/useInternationalOperations.ts` | Facade con helpers |

### Páginas (`app/pages/operaciones-internacionales/`)

| Archivo | Descripción |
|---------|-------------|
| `index.vue` | Listado con LogisticaTable + filtros + sorting |
| `columns.ts` | Definición de columnas con createTableBuilder |
| `create.vue` | Formulario de creación (moneda select, incoterm con ?, locaciones) |
| `[id]/index.vue` | Dashboard: KPIs, financiero, contenedores, documentos, pagos |
| `[id]/containers/create.vue` | Crear contenedor (tipo con ?, puertos con locaciones) |
| `[id]/containers/[containerId]/index.vue` | Detalle contenedor + timeline de eventos |

### Proxy routes (`server/api/international-operations/`)

20 archivos de proxy que usan `apiProxy()` para forward al backend NestJS.

---

## 11. Lo que Falta (P1/P2)

### P1 — Muy importante

| Feature | Estado | Notas |
|---------|--------|-------|
| Gastos de importación | No implementado | Usar documentos de compra asociados (Opción A) |
| Recepción de mercadería | Pendiente | Esperar modelo formal `goods receipt` del ERP |
| Alertas de ETA | No implementado | Calcular en runtime desde summary |
| Fechas estimadas/reales | Parcial | Solo se setean automáticamente en cambios de estado |
| Cierre de operación | No implementado | Validación previa al cierre |
| Editar operación (`[id]/edit.vue`) | No creado | Solo create existe |
| Páginas documentos/pagos/mercadería | No creadas | `[id]/documentos.vue`, `[id]/pagos.vue`, `[id]/mercaderia.vue` |

### P2 — Segunda etapa

| Feature | Estado |
|---------|--------|
| Landed Cost | Preparado arquitectónicamente |
| Prorrateo de gastos sobre productos | No |
| Costo real por producto | No |
| Rentabilidad por operación | No |
| Exportaciones | Schema preparado (OperationType.EXPORT) |
| Transporte aéreo/terrestre | Schema preparado (TransportType) |
| Integraciones externas (navieras) | No |

---

## 12. Migraciones Pendientes

```bash
pnpm prisma migrate dev --name add-international-operations
pnpm prisma migrate dev --name add-io-location-fks
pnpm prisma migrate dev --name add-container-port-fks
```

O consolidar en una sola migración.

---

## 13. Seed para Empresas Existentes

```bash
# RBAC + secuencia IMP
npx tsx prisma/seeds/rbac.seed.ts <tenant>
npx tsx prisma/seeds/document-types.seed.ts
```

---

## 14. Commit Sugerido

```
feat: add international operations module (import/export tracking)

- Prisma schema: international_operations, international_containers,
  container_events, junction tables for documents/payments
- Backend: NestJS module with CRUD, status transitions, summary endpoint,
  container/event management, RBAC permissions
- Frontend: list with LogisticaTable, create form with currency select,
  incoterm help popover, location selects, dashboard with KPIs
- 20 Nuxt server proxy routes for API forwarding
- Seeded IMP sequence (point_of_sale: 0003, prefix: IMP)
```
