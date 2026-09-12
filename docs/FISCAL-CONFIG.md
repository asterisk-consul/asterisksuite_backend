# Configuración Fiscal - Asterisk Suite

> Documentación del sistema de configuración fiscal y motor de impuestos multi-tenant.

---

## 1. Modelo `company_tax_settings`

Tabla en la base de datos compartida (`public`) que almacena la configuración fiscal de cada empresa.

```prisma
// prisma/schema/public.prisma
model company_tax_settings {
  id                  String      @id @default(uuid()) @db.Uuid
  company_id          String      @unique @db.Uuid
  fiscal_mode         FiscalMode  @default(SIMPLE)
  prices_include_tax  Boolean     @default(true)
  show_tax_breakdown  Boolean     @default(false)
  country             String      @default("AR") @db.VarChar(3)
  created_at          DateTime    @default(now()) @db.Timestamp(6)
  updated_at          DateTime?   @updatedAt @db.Timestamp(6)
}
```

### Campos

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `company_id` | UUID | requerido | FK a `companies.id` (únicos por empresa) |
| `fiscal_mode` | Enum | `SIMPLE` | Modo de operación del motor fiscal |
| `prices_include_tax` | Boolean | `true` | Los precios ingresados incluyen IVA |
| `show_tax_breakdown` | Boolean | `false` | Mostrar desglose de impuestos en facturas |
| `country` | String(3) | `"AR"` | Código ISO del país (AR, UY, PY, CL) |

### `fiscal_mode`: SIMPLE vs COMPLETE

| Modo | `calculateVat` | `calculateIibb` | `pricesIncludeTax` | `showTaxBreakdown` | Uso |
|------|---------------|-----------------|--------------------|--------------------|-----|
| **SIMPLE** | `false` | `false` | `true` | `false` | Empresas pequeñas sin facturación electrónica AFIP |
| **COMPLETE** | `true` | `true` | `false` | `true` | Responsables inscriptos con facturación electrónica |

Los presets están definidos en `TaxResolutionService`:

```typescript
// src/modules/erp/tax-engine/services/tax-resolution.service.ts:9-26
const PRESETS: Record<string, ResolvedTaxSettings> = {
  SIMPLE: {
    fiscal_mode: 'SIMPLE',
    calculateVat: false,
    calculateIibb: false,
    pricesIncludeTax: true,
    showTaxBreakdown: false,
    country: 'AR',
  },
  COMPLETE: {
    fiscal_mode: 'COMPLETE',
    calculateVat: true,
    calculateIibb: true,
    pricesIncludeTax: false,
    showTaxBreakdown: true,
    country: 'AR',
  },
}
```

### `prices_include_tax`

Controla si los precios ingresados por el usuario ya incluyen IVA o no:

- **`true`** → Precio con IVA incluido. El motor extrae el IVA para calcular la base imponible.
- **`false`** → Precio neto (sin IVA). El motor agrega el IVA sobre el precio.

### `show_tax_breakdown`

- **`true`** → La UI de facturas muestra líneas individuales de cada impuesto (IVA 21%, IVA 10.5%, etc.)
- **`false`** → Solo se muestra el total de impuestos, sin desglose por línea.

---

## 2. Flujo del Motor de Impuestos

### 2.1 Resolución (`TaxResolutionService`)

El motor resuelve configuración e impuestos en dos pasos:

```
1. resolveSettings()  → Convierte company_tax_settings en ResolvedTaxSettings
2. resolveProductTaxes() + resolveOperationTaxes() → Impuestos aplicables
```

**Archivo**: `src/modules/erp/tax-engine/services/tax-resolution.service.ts`

#### Paso 1: Resolución de configuración

```typescript
// tax-resolution.service.ts:63-78
private resolveSettings(raw: any): ResolvedTaxSettings {
  if (!raw) return PRESETS['SIMPLE']  // Fallback seguro

  const base = PRESETS[raw.fiscal_mode] ?? PRESETS['SIMPLE']

  return {
    ...base,
    country: raw.country ?? base.country,
    pricesIncludeTax: raw.prices_include_tax ?? base.pricesIncludeTax,
    showTaxBreakdown: raw.show_tax_breakdown ?? base.showTaxBreakdown,
  }
}
```

Se toma el preset base del modo fiscal y se sobreescriben `country`, `pricesIncludeTax` y `showTaxBreakdown` con los valores de la empresa.

#### Paso 2: Resolución de impuestos de producto

```typescript
// tax-resolution.service.ts:80-117
private async resolveProductTaxes(...) {
  // 1. Busca el producto y su tax_category
  const product = await this.productRepo.findById(productId)
  if (!product?.tax_category_id) return []

  // 2. Busca los impuestos asociados a la categoría fiscal
  const categoryTaxes = await this.categoryRepo.findTaxesByCategory(product.tax_category_id)

  // 3. Filtra según configuración
  const filtered = categoryTaxes
    .filter((ct) => {
      // En modo SIMPLE, descarta IVA
      if (!settings.calculateVat && ct.tax.tax_type === 'IVA') return false
      return ct.active && ct.tax.active
    })
    .map((ct) => ({
      tax_id: ct.tax.id,
      code: ct.tax.code,
      name: ct.tax.name,
      rate: ct.tax.rate,
      tax_type: ct.tax.tax_type,
      calculation_level: ct.tax.calculation_level,
      // Para IVA: is_included_in_price depende de la configuración
      is_included_in_price: ct.tax.tax_type === 'IVA'
        ? settings.pricesIncludeTax
        : ct.is_included_in_price,
      source: 'PRODUCT',
      reason: `Categoría fiscal: ${ct.tax_category.name}`,
    }))
}
```

**Regla clave**: Para IVA, el campo `is_included_in_price` se toma de la configuración de la empresa (`pricesIncludeTax`), NO de la categoría fiscal. Esto permite que el usuario controle si trabaja con precios netos o con IVA incluido.

#### Paso 3: Resolución de impuestos de operación

```typescript
// tax-resolution.service.ts:119-149
private async resolveOperationTaxes(...) {
  if (!settings.calculateIibb) return []  // Solo en modo COMPLETE

  const jurisdiction = ctx.warehouseId ?? 'default'
  const operationTaxes = await this.operationTaxRepo.findByContext(
    jurisdiction,
    ctx.documentLetterType
  )

  // Solo impuestos activos
  return operationTaxes
    .filter((ot) => ot.active && ot.tax.active)
    .map(...)
}
```

Los impuestos de operación (percepciones IIBB, retenciones) solo se resuelven en modo **COMPLETE**.

### 2.2 Cálculo (`TaxCalculationService`)

**Archivo**: `src/modules/erp/tax-engine/services/tax-calculation.service.ts`

El cálculo se realiza por línea de item:

```typescript
// tax-calculation.service.ts:7-101
calculate(resolution, items) {
  for (const item of items) {
    const price = item.quantity * item.unitPrice

    for (const tax of allTaxes) {
      if (tax.calculation_level !== 'line') continue  // Solo nivel línea

      if (tax.is_included_in_price) {
        // IVA INCLUIDO: extraer del precio
        const amount = price - price / (1 + tax.rate / 100)
        itemTaxes.push({ amount, taxableBase: price - amount, isIncludedInPrice: true })
      } else {
        // IVA NO INCLUIDO: agregar al precio
        const amount = price * (tax.rate / 100)
        itemTaxes.push({ amount, taxableBase: price, isIncludedInPrice: false })
      }
    }

    // Subtotal = precio - impuestos incluidos
    calcItem.price = price - includedTaxes
    // Total = precio + impuestos agregados
    calcItem.total = price + addedTaxes
  }
}
```

### 2.3 Resultado del cálculo

El resultado se agrupa en `CalculatedDocument`:

```typescript
interface CalculatedDocument {
  settings: ResolvedTaxSettings
  items: CalculatedItem[]           // Items con impuestos calculados
  documentTaxes: CalculatedDocumentTax[]  // Impuestos agrupados por tax_id
  subtotal: number                  // Suma de precios (sin impuestos incluidos)
  exemptAmount: number              // Monto exento
  taxableBase: number               // Base imponible
  totalTaxes: number                // Total de todos los impuestos
  total: number                     // Total del documento
}
```

---

## 3. Ejemplos Matemáticos

### Caso 1: `pricesIncludeTax = false` (precio neto)

```
Configuración: prices_include_tax = false
Producto: precio unitario = 100, IVA 21%

Cálculo:
  price = 1 × 100 = 100
  IVA = 100 × 0.21 = 21.00

Resultado:
  subtotal (base imponible) = 100.00
  IVA 21%                   =  21.00
  total                     = 121.00
```

### Caso 2: `pricesIncludeTax = true` (precio con IVA)

```
Configuración: prices_include_tax = true
Producto: precio unitario = 100, IVA 21%

Cálculo:
  price = 1 × 100 = 100
  IVA = 100 - 100 / (1 + 0.21) = 100 - 82.64 = 17.36

Resultado:
  subtotal (base imponible) =  82.64
  IVA 21%                   =  17.36
  total                     = 100.00
```

### Caso 3: Múltiples impuestos (modo COMPLETE)

```
Configuración: prices_include_tax = false, calculateIibb = true
Producto: precio unitario = 200, IVA 21%, IIBB 3%

Cálculo línea:
  price = 1 × 200 = 200
  IVA   = 200 × 0.21 = 42.00  (agregado)
  IIBB  = 200 × 0.03 =  6.00  (agregado)

Resultado:
  subtotal         = 200.00
  IVA 21%          =  42.00
  IIBB 3%          =   6.00
  totalTaxes       =  48.00
  total            = 248.00
```

### Caso 4: Item exento + item gravado

```
Configuración: prices_include_tax = false
Item 1: precio 100, IVA 21%  → subtotal 100, IVA 21, total 121
Item 2: precio 50,  exento   → subtotal 50,  IVA 0,  total 50

Documento:
  subtotal = 100 + 50 = 150
  IVA 21%  = 21
  total    = 171
```

---

## 4. Tipos de Documento y Letras (Argentina)

### Matriz AFIP

La letra del comprobante se determina por la condición IVA del emisor y receptor.

| Emisor | Receptor | Letra | Comprobante | Discriminación IVA |
|--------|----------|-------|-------------|-------------------|
| Responsable Inscripto (RI) | RI | **A** | Factura A | IVA discriminado |
| Responsable Inscripto (RI) | Monotributo | **B** | Factura B | IVA incluido |
| Responsable Inscripto (RI) | Consumidor Final | **B** | Factura B | IVA incluido |
| Responsable Inscripto (RI) | Exento | **B** | Factura B | IVA incluido |
| Monotributo | Cualquiera | **C** | Factura C | No se discrimina IVA |
| Exento | Cualquiera | **C** | Factura C | No se discrimina IVA |

### Implementación

**Archivo**: `asterisksuite_frontend/app/modulos/erp/invoices/utils/vatConditionMap.ts`

```typescript
export type VatCondition = 'RI' | 'MONO' | 'CF' | 'EX'

export function getDocumentTypeForVatCondition(
  partnerCondition: VatCondition,
  direction: 'sale' | 'purchase',
  issuerCondition?: string | null
): string {
  const issuer = (issuerCondition ?? 'RI').toUpperCase()

  // Emisor Monotributo o Exento → siempre Factura C
  if (issuer === 'MONOTRIBUTO' || issuer === 'EXENTO') {
    return direction === 'sale' ? 'FC-A' : 'FC-C'
  }

  // Emisor RI → mapear según receptor
  const map = direction === 'sale' ? PARTNER_VAT_TO_SALE_MAP : PARTNER_VAT_TO_PURCHASE_MAP
  return map[partnerCondition.toUpperCase()] ?? (direction === 'sale' ? 'FB-A' : 'FB-C')
}
```

### Mapeo de tipos de comprobante

| Código | Nombre |
|--------|--------|
| `FA-A` | Factura A (venta) |
| `FB-A` | Factura B (venta) |
| `FC-A` | Factura C (venta) |
| `FA-C` | Factura A (compra) |
| `FB-C` | Factura B (compra) |
| `FC-C` | Factura C (compra) |

### Condiciones IVA

| Código | Descripción |
|--------|-------------|
| `RI` | Responsable Inscripto |
| `MONO` | Monotributista |
| `CF` | Consumidor Final |
| `EX` | Exento |

---

## 5. API Endpoints

### Obtener configuración fiscal

```
GET /api/company-tax-settings?company_id={uuid}
```

**Response** (200):

```json
{
  "id": "uuid",
  "company_id": "uuid-empresa",
  "fiscal_mode": "SIMPLE",
  "prices_include_tax": true,
  "show_tax_breakdown": false,
  "country": "AR",
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-07-20T15:30:00Z"
}
```

Si no existe configuración, se crea automáticamente con valores por defecto (SIMPLE).

### Actualizar configuración fiscal

```
PATCH /api/company-tax-settings
Content-Type: application/json

{
  "company_id": "uuid-empresa",
  "fiscal_mode": "COMPLETE",
  "prices_include_tax": false,
  "show_tax_breakdown": true,
  "country": "AR"
}
```

**Response** (200): Configuración actualizada.

### Notas

- `company_id` es **requerido** en ambos endpoints.
- El controller está en `src/modules/erp/tax-engine/controllers/company-tax-settings.controller.ts`.
- El frontend accede via proxy Nuxt: `/api/erp/tax-engine/company-settings`.

---

## 6. Frontend: Página de Configuración

**Archivo**: `asterisksuite_frontend/app/pages/settings/fiscal-config.vue`

**Ruta**: `/settings/fiscal-config`

### Funcionalidad

1. **Carga**: Al montar, hace `GET` a la API con el `company_id` del store de auth.
2. **Modo Fiscal**: Selección entre SIMPLE y COMPLETE con descripción.
3. **Opciones**: Switches para `prices_include_tax` y `show_tax_breakdown`.
4. **País**: Selector de país (AR, UY, PY, CL).
5. **Guardar**: `PATCH` con todos los campos.

### Estructura de la UI

```
┌─────────────────────────────────────────┐
│  Configuración Fiscal                   │
├─────────────────────────────────────────┤
│  Modo Fiscal                            │
│  ┌──────────────┐ ┌──────────────┐     │
│  │ ● Simples    │ │ ○ Completos  │     │
│  │ Sin impuestos│ │ Motor fiscal │     │
│  └──────────────┘ └──────────────┘     │
├─────────────────────────────────────────┤
│  Opciones                               │
│  Precios incluyen impuesto    [═══]    │
│  Mostrar desglose de impuestos [═══]   │
├─────────────────────────────────────────┤
│  País                                   │
│  [Argentina ▼]                          │
├─────────────────────────────────────────┤
│                        [Guardar]        │
└─────────────────────────────────────────┘
```

---

## 7. Arquitectura del Tax Engine

### Interfaces clave

```typescript
// TaxContext — Entrada al motor
interface TaxContext {
  issuerCompanyId: string      // Empresa emisora
  issuerVatCondition?: string  // Condición IVA del emisor
  partnerId?: string           // Receptor
  partnerVatCondition?: string // Condición IVA del receptor
  documentTypeId: string       // Tipo de documento
  documentLetterType?: string  // Letra (A, B, C)
  currency: string             // Moneda
  date: string                 // Fecha de emisión
  warehouseId?: string         // Ubicación (para IIBB)
  operationType: 'SALE' | 'PURCHASE'
  items: TaxContextItem[]      // Items a calcular
}

// ResolvedTaxSettings — Configuración resuelta
interface ResolvedTaxSettings {
  fiscal_mode: string
  calculateVat: boolean        // Derivado de fiscal_mode
  calculateIibb: boolean       // Derivado de fiscal_mode
  pricesIncludeTax: boolean    // De company_tax_settings
  showTaxBreakdown: boolean    // De company_tax_settings
  country: string
}

// ResolvedTax — Impuesto resuelto
interface ResolvedTax {
  tax_id: string
  code: string
  name: string
  rate: number
  tax_type: string             // 'IVA', 'IIBB', etc.
  calculation_level: string    // 'line', 'document'
  is_included_in_price: boolean
  source: 'PRODUCT' | 'OPERATION'
  reason: string
}
```

### Diagrama de flujo

```
POST /documents (body con items)
        │
        ▼
TaxResolutionService.resolve(ctx)
        │
        ├── settingsRepo.findByCompanyId()
        │         │
        │         ▼
        │   resolveSettings(raw)
        │         │
        │         ▼
        │   ResolvedTaxSettings
        │
        ├── Por cada item:
        │     productRepo.findById()
        │     categoryRepo.findTaxesByCategory()
        │         │
        │         ▼
        │     Filtra: calculateVat? is_active?
        │         │
        │         ▼
        │     ResolvedTax[] (productTaxes)
        │
        └── operationTaxRepo.findByContext()
                  │
                  ▼
              ResolvedTax[] (operationTaxes)
                  │
                  ▼
          TaxResolutionResult
                  │
                  ▼
TaxCalculationService.calculate(resolution, items)
        │
        ├── Por cada item, por cada tax:
        │     is_included_in_price?
        │       YES → extraer: amount = price - price/(1+rate/100)
        │       NO  → agregar: amount = price × rate/100
        │
        ├── Agrupar por tax_id → documentTaxes
        │
        └── Calcular totales
                  │
                  ▼
          TaxCalculationResult
```

### Dependencias

```
TaxResolutionService
├── ITaxCategoryRepository      → Categorías fiscales con sus impuestos
├── ICompanyTaxSettingsRepository → Configuración fiscal de la empresa
├── IOperationTaxRepository     → Impuestos de operación (percepciones)
└── IProductRepository          → Productos con su tax_category_id

TaxCalculationService
└── (sin dependencias — puro cálculo matemático)
```

---

## 8. Configuración por Defecto

Cuando una empresa se crea o no tiene configuración fiscal:

| Campo | Valor por defecto |
|-------|-------------------|
| `fiscal_mode` | `SIMPLE` |
| `prices_include_tax` | `true` |
| `show_tax_breakdown` | `false` |
| `country` | `"AR"` |

Esto significa que por defecto las empresas operan en modo simplificado, precios con IVA incluido, sin desglose visible.

---

## 9. Notas de Implementación

1. **Ubicación de la tabla**: `company_tax_settings` está en el esquema `public` (base compartida), NO en cada base tenant. Esto permite resolver la configuración fiscal sin cambiar de base de datos.

2. **Fallback a SIMPLE**: Si la configuración no existe o hay error, el motor usa el preset SIMPLE como fallback seguro (`tax-resolution.service.ts:64-66`).

3. **IVA siempre usa la config de empresa**: El campo `is_included_in_price` para IVA se toma de `settings.pricesIncludeTax`, ignorando lo que diga la categoría fiscal (`tax-resolution.service.ts:108-110`). Esto permite que cada empresa controle si trabaja con precios netos o brutos.

4. **IIBB solo en modo COMPLETE**: Los impuestos de operación (percepciones, retenciones) solo se resuelven cuando `calculateIibb = true` (modo COMPLETE).

5. **Cálculo nivel línea**: Solo se procesan impuestos con `calculation_level = 'line'`. Los impuestos a nivel documento se procesarían en un flujo separado (actualmente no implementado).
