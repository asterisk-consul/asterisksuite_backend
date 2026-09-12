# Plan: IIBB + Selección de Domicilio + Retenciones

## Contexto

El sistema de impuestos necesita soporte completo para:
1. **IIBB (Ingresos Brutos)**: Impuesto provincial que depende de la jurisdicción del partner, no del producto
2. **Selección de domicilio**: Un partner puede tener múltiples ubicaciones en diferentes provincias. Al crear un documento se debe poder seleccionar cuál aplica
3. **Retenciones**: Impuestos que se retienen al pagar a proveedores (IVA, IIBB, Ganancias, SUSS)

---

## Estado Actual

### Lo que ya existe
- `business_parties` → `party_locations` → `locations.province` (one-to-many)
- `locations.province`: campo de texto libre ("CORDOBA", "BUENOS_AIRES", "CABA")
- `operation_taxes`: tabla con `jurisdiction`, `document_type`, `rate` (vacía, sin seed)
- `tax-category-taxes`: seeded con IVA 21%, 10.5%, 27%
- Frontend `retentionLogic.ts`: util hardcodeado con configs de retención
- Cuentas contables para IIBB/retenciones en seed

### Lo que está roto
- `TaxContext` no tiene `partnerProvince` ni `partnerLocationId`
- `TaxResolutionService` usa `warehouseId` (UUID) como jurisdicción en vez de province
- No hay `is_primary` en `party_locations`
- No hay CRUD controller para `operation_taxes`
- `business_parties` no tiene `retention_agent`
- Retenciones solo son un util frontend sin backend
- `tax-calculation.service.ts` solo procesa `calculation_level: 'line'`, no `'document'`

---

## Fase 1: Selección de Domicilio del Partner

### 1.1 Migración DB: `party_locations.is_primary`

```prisma
model party_locations {
  // ... existente
  is_primary  Boolean  @default(false)
}
```

### 1.2 Backend: Agregar campos a `TaxContext`

**Archivo:** `src/modules/erp/tax-engine/interfaces/tax-context.interface.ts`

```typescript
export interface TaxContext {
  // ... existente
  partnerLocationId?: string   // ← NUEVO
  partnerProvince?: string     // ← NUEVO: resuelto de location.province
}
```

### 1.3 Backend: DTO acepta `partner_location_id`

**Archivo:** `src/modules/erp/documents/dto/create-document.dto.ts`

```typescript
export class CreateDocumentDto {
  // ... existente
  @IsUUID()
  @IsOptional()
  partner_location_id?: string  // ← NUEVO
}
```

### 1.4 Backend: Resolver location en services de documentos

**Archivos:** `documents_purchases.service.ts`, `documents_sales.services.ts`

En CREATE y UPDATE:
1. Si `dto.partner_location_id` viene → buscar `locations.province` de ese ID
2. Si no viene → buscar `party_locations` del party:
   - Si tiene 1 sola → usar esa automáticamente
   - Si tiene varias → requerir selección (error si no se envía)
   - Si tiene 0 → no resolver IIBB (province = null)
3. Pasar `partnerProvince` al `TaxContext`

```typescript
// Ejemplo de resolución
async resolvePartnerProvince(partyId: string, locationId?: string): Promise<string | null> {
  if (locationId) {
    const loc = await this.prisma.party_locations.findFirst({
      where: { party_id: partyId, location_id: locationId, deleted_at: null },
      include: { locations: true }
    })
    return loc?.locations?.province ?? null
  }

  const locations = await this.prisma.party_locations.findMany({
    where: { party_id: partyId, deleted_at: null },
    include: { locations: true }
  })

  if (locations.length === 1) return locations[0].locations?.province ?? null
  if (locations.length === 0) return null
  // Varias locations → necesita selección
  throw new BadRequestException('El partner tiene múltiples domicilios. Seleccione uno con partner_location_id')
}
```

### 1.5 Frontend: Select de domicilio en FacturaForm

**Archivo:** `app/modulos/erp/facturas/components/FacturaForm.vue`

Cuando se selecciona un party:
1. Cargar sus `party_locations` (ya viene en la respuesta del API)
2. Si tiene 1 → seleccionar automáticamente, mostrar como texto
3. Si tiene varias → mostrar `USelectMenu` para elegir
4. Si tiene 0 → mostrar "Sin domicilio registrado"
5. Enviar `partner_location_id` en el submit

---

## Fase 2: IIBB Automático

### 2.1 Seed `operation_taxes`

**Archivo nuevo:** `prisma/seeds/operation-taxes.seed.ts`

```sql
-- Datos de ejemplo (IDs de tax_id deben resolverse del seed de taxes)
-- PERC_IIBB con jurisdiction = provincia, document_type = letra

-- CABA
INSERT INTO operation_taxes (tax_id, jurisdiction, document_type, rate, active)
VALUES ('UUID_PERC_IIBB', 'CABA', 'A', 3.5, true);
VALUES ('UUID_PERC_IIBB', 'CABA', 'B', 2.5, true);

-- CÓRDOBA
VALUES ('UUID_PERC_IIBB', 'CORDOBA', 'A', 3.0, true);
VALUES ('UUID_PERC_IIBB', 'CORDOBA', 'B', 2.0, true);

-- BUENOS AIRES
VALUES ('UUID_PERC_IIBB', 'BUENOS_AIRES', 'A', 2.5, true);
VALUES ('UUID_PERC_IIBB', 'BUENOS_AIRES', 'B', 1.5, true);

-- SANTA FE
VALUES ('UUID_PERC_IIBB', 'SANTA_FE', 'A', 2.5, true);
VALUES ('UUID_PERC_IIBB', 'SANTA_FE', 'B', 1.5, true);
```

### 2.2 Controller CRUD `operation_taxes`

**Archivo nuevo:** `src/modules/erp/tax-engine/controllers/operation-taxes.controller.ts`

```
GET    /operation-taxes                  → listar (filtro por jurisdiction)
GET    /operation-taxes/:id              → obtener uno
POST   /operation-taxes                  → crear
PATCH  /operation-taxes/:id              → actualizar
DELETE /operation-taxes/:id              → soft delete
```

### 2.3 Fix `TaxResolutionService`: usar `partnerProvince`

**Archivo:** `src/modules/erp/tax-engine/services/tax-resolution.service.ts`

```typescript
// ANTES (roto):
const jurisdiction = ctx.warehouseId ?? 'default'

// DESPUÉS (corregido):
const jurisdiction = ctx.partnerProvince ?? 'default'
```

### 2.4 Fix `TaxCalculationService`: document-level taxes

**Archivo:** `src/modules/erp/tax-engine/services/tax-calculation.service.ts`

Agregar cálculo de taxes con `calculation_level: 'DOCUMENT'`:
- Se calculan sobre el **subtotal del documento** (no por item)
- Se agrupan en `documentTaxes` del resultado
- Se guardan en `document_taxes` con `calculation_level: 'DOCUMENT'`

### 2.5 Frontend: Página CRUD `operation_taxes`

**Ruta:** `/erp/taxes/operation-taxes`

- Tabla con columnas: Impuesto, Jurisdicción, Tipo documento, Tasa, Activo
- Filtros por jurisdicción
- Modal crear/editar
- CRUD completo

### 2.6 Persistir `partner_location_id` en el documento

**Archivo:** `prisma/schema/documents.prisma`

```prisma
model documents {
  // ... existente
  partner_location_id  String?  @db.Uuid  // ← NUEVO
}
```

---

## Fase 3: Retenciones

### 3.1 Modelo `retention_rules`

**Archivo nuevo:** `prisma/schema/retention-rules.prisma`

```prisma
model retention_rules {
  id              String   @id @default(uuid()) @db.Uuid
  code            String   @db.VarChar(20)     // RET_IVA, RET_IIBB, RET_GANANCIAS, RET_SUSS
  name            String   @db.VarChar(100)
  tax_type        String   @db.VarChar(20)     // IVA, IIBB, GANANCIAS, SUSS
  rate            Decimal  @db.Decimal(6, 3)
  min_amount      Decimal  @db.Decimal(15, 2)
  applies_to      String   @db.VarChar(20)     // ALL, SERVICES, GOODS
  jurisdiction    String?  @db.VarChar(50)     // null = nacional
  active          Boolean  @default(true)
  created_at      DateTime @default(now()) @db.Timestamp(6)
  updated_at      DateTime? @updatedAt @db.Timestamp(6)
  deleted_at      DateTime?
  created_by      String?  @db.Uuid
  updated_by      String?  @db.Uuid
  deleted_by      String?  @db.Uuid

  @@schema("tenant")
}
```

### 3.2 Campos en `business_parties`

**Archivo:** `prisma/schema/parties.prisma`

```prisma
model business_parties {
  // ... existente
  retention_agent     Boolean  @default(false)   // ← NUEVO
  iibb_registered     Boolean  @default(false)   // ← NUEVO
  iibb_registration   String?  @db.VarChar(50)   // ← NUEVO: Nro. inscripción IIBB
}
```

### 3.3 Service de retenciones

**Archivo nuevo:** `src/modules/erp/retentions/retentions.service.ts`

```typescript
interface RetentionResult {
  code: string
  name: string
  rate: number
  taxable_base: number
  amount: number
}

async calculateRetentions(
  partyId: string,
  paymentAmount: number,
  operationType: 'SALE' | 'PURCHASE'
): Promise<RetentionResult[]> {
  // 1. Buscar party → retention_agent, iibb_registered
  // 2. Si no es agente → []
  // 3. Buscar retention_rules activas
  // 4. Filtrar por applies_to, min_amount, jurisdiction
  // 5. Calcular monto de cada retención
  // 6. Retornar lista
}
```

### 3.4 Controller CRUD `retention_rules`

**Archivo nuevo:** `src/modules/erp/retentions/retentions.controller.ts`

```
GET    /retention-rules                  → listar
GET    /retention-rules/:id              → obtener uno
POST   /retention-rules                  → crear
PATCH  /retention-rules/:id              → actualizar
DELETE /retention-rules/:id              → soft delete
POST   /retentions/calculate             → calcular retenciones para un pago
```

### 3.5 Integración con pagos

**Archivo:** `src/modules/erp/payments/payments.service.ts`

Al confirmar un pago:
1. Llamar `retentionsService.calculateRetentions(partyId, amount, type)`
2. Guardar retenciones en el pago
3. Crear asientos contables:
   - Débito: Cuenta de retención (ej: 1.3.5 Retención IIBB)
   - Crédito: Cuenta de retención pasiva (ej: 2.2.6 Retenciones IIBB)

### 3.6 Frontend: Configuración retenciones

**Ruta:** `/erp/taxes/retention-rules`

- Tabla: Código, Nombre, Tasa, Monto mín., Aplica a, Jurisdicción, Activo
- CRUD completo

### 3.7 Frontend: Retenciones en pagos

**Archivo:** `app/pages/erp/treasury/payments/create.vue`

- Al seleccionar proveedor y monto → calcular retenciones automáticamente
- Mostrar desglose: monto bruto - retenciones = monto neto
- Permitir modificar/desactivar retenciones individuales
- Guardar retenciones al confirmar el pago

---

## Archivos a crear/modificar (resumen)

### DB (4 cambios)
| # | Archivo | Cambio |
|---|---|---|
| 1 | `party_locations` (migration) | Agregar `is_primary` |
| 2 | `business_parties` (migration) | Agregar `retention_agent`, `iibb_registered`, `iibb_registration` |
| 3 | `documents` (migration) | Agregar `partner_location_id` |
| 4 | Nuevo: `retention_rules` (schema + migration) | Modelo completo |

### Seeds (2 archivos nuevos)
| # | Archivo | Contenido |
|---|---|---|
| 5 | `prisma/seeds/operation-taxes.seed.ts` | IIBB por provincia |
| 6 | `prisma/seeds/retention-rules.seed.ts` | Retenciones base |

### Backend (10 archivos)
| # | Archivo | Cambio |
|---|---|---|
| 7 | `tax-context.interface.ts` | +`partnerLocationId`, +`partnerProvince` |
| 8 | `tax-resolution.service.ts` | Usar `partnerProvince` para IIBB |
| 9 | `tax-calculation.service.ts` | +cálculo document-level taxes |
| 10 | `create-document.dto.ts` | +`partner_location_id` |
| 11 | `documents_purchases.service.ts` | Resolver location del party |
| 12 | `documents_sales.services.ts` | Resolver location del party |
| 13 | Nuevo: `operation-taxes.controller.ts` | CRUD |
| 14 | Nuevo: `retentions.controller.ts` | CRUD + calculate |
| 15 | Nuevo: `retentions.service.ts` | Lógica de retenciones |
| 16 | `payments.service.ts` | Integrar retenciones |

### Frontend (5 archivos)
| # | Archivo | Cambio |
|---|---|---|
| 17 | `FacturaForm.vue` | Select de domicilio del party |
| 18 | Nuevo: `/erp/taxes/operation-taxes/index.vue` | CRUD IIBB |
| 19 | Nuevo: `/erp/taxes/retention-rules/index.vue` | CRUD retenciones |
| 20 | `payments/create.vue` | Integrar retenciones |
| 21 | `retentionLogic.ts` | Mover lógica a backend, simplificar frontend |

---

## Orden de implementación

1. Migraciones DB (1-4)
2. Seeds (5-6)
3. TaxContext + Resolution (7-8)
4. Document DTO + Services (10-12)
5. Tax Calculation fix (9)
6. Controller operation_taxes (13)
7. Frontend IIBB (18)
8. Frontend FacturaForm domicilio (17)
9. Modelo retention_rules (4)
10. Service retenciones (15)
11. Controller retenciones (14)
12. Integración pagos (16, 20)
13. Frontend retenciones (19)

---

## Escenarios de prueba

### IIBB
1. Partner con 1 location en CABA → crear factura letra A → IIBB CABA 3.5%
2. Partner con 2 locations (CABA + Córdoba) → seleccionar Córdoba → IIBB Córdoba 3.0%
3. Partner sin locations → factura sin IIBB
4. Modo SIMPLE → IIBB no se calcula

### Retenciones
1. Proveedor RI agente de retención → pago $50.000 → retiene IVA 3% + IIBB 2.5%
2. Proveedor no agente → pago $50.000 → 0 retenciones
3. Pago $5.000 → debajo del mínimo → 0 retenciones
4. Proveedor de servicios → retención Ganancias + SUSS
