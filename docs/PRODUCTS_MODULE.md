# Módulo Products - Documentación

## 📋 Descripción General

El módulo **Products** es el componente central de Master Data en Asterisk Suite. Gestiona:

- **Productos base** con propiedades generales (SKU, tipo, estado)
- **Variantes de productos** (diferentes presentaciones/configuraciones)
- **Composición de productos** (relaciones padre-hijo entre productos)
- **Costos** (múltiples estrategias de cálculo)
- **Ingeniería/Estructura** (árbol de componentes técnicos)
- **Categorías, Tags y Atributos** asociados
- **Precios** por moneda/variante
- **Impuestos** aplicables

---

## 🏗️ Estructura del Módulo

```
src/modules/master-data/products/
├── products.module.ts           # Módulo principal
├── products.service.ts          # Lógica de negocio base
├── products.controller.ts       # Endpoints REST
├── dto/
│   ├── create-product.dto.ts
│   └── update-product.dto.ts
├── product-components/          # Relaciones entre productos
│   ├── product-components.module.ts
│   ├── product-components.service.ts
│   └── product-components.controller.ts
├── engineering/                 # Árbol técnico de componentes
│   ├── engineering.module.ts
│   ├── engineering.service.ts
│   ├── engineering.controller.ts
│   ├── engineering-tree.service.ts
│   ├── engineering-calculation.service.ts
│   ├── engineering-validation.service.ts
│   ├── product-structure-version.service.ts
│   └── ...
├── costing/                     # Cálculo de costos
│   ├── costing.module.ts
│   ├── costing.service.ts
│   ├── costing.controller.ts
│   ├── costing-calculator.service.ts
│   ├── costing-tree.service.ts
│   ├── costing-history.service.ts
│   ├── strategies/
│   │   ├── bom-cost.strategy.ts
│   │   ├── engineering-cost.strategy.ts
│   │   ├── manual-cost.strategy.ts
│   │   ├── purchase-cost.strategy.ts
│   │   └── rate-cost.strategy.ts
│   └── ...
├── variant-costs/               # Costos por variante
│   ├── variant-costs.module.ts
│   ├── variant-costs.service.ts
│   └── ...
├── product-variants/            # Variantes del producto
│   ├── product-variants.module.ts
│   ├── product-variants.service.ts
│   └── ...
├── product-categories/          # Categorización
│   ├── product-categories.module.ts
│   ├── product-categories.service.ts
│   └── ...
├── product-tags/                # Tags/Etiquetas
│   ├── product-tags.module.ts
│   ├── product-tags.service.ts
│   └── ...
└── product-attribute-values/    # Atributos personalizados
    ├── product-attribute-values.module.ts
    ├── product-attribute-values.service.ts
    └── ...
```

---

## 📊 Entidades Principales

### Producto (Products)

**Propiedades Clave:**
- `id` - UUID único
- `name` - Nombre del producto
- `sku` - Stock Keeping Unit (único, validado en BD)
- `product_type` - ENUM: MATERIAL, FINISHED_GOOD, SERVICE, KIT, etc.
- `is_composed` - Indica si es un producto compuesto (tiene componentes)
- `has_engineering` - Si tiene estructura técnica definida
- `manages_stock` - Si gestiona inventario
- `auto_calculate_cost` - Calcula costos automáticamente
- `price_enabled` - Si tiene precios definidos
- `requires_refrigeration` - Control especial de temperatura
- `is_rate_type` - Si es una tarifa
- `active` - Estado activo/inactivo
- `deleted_at` - Soft delete timestamp

**Relaciones:**
- `product_price` - Precios por moneda
- `product_costs` - Costos calculados
- `product_variants` - Variantes
- `product_categories` - Categorías asignadas
- `product_tags` - Tags asignados
- `product_attribute_values` - Valores de atributos
- `product_taxes` - Impuestos aplicables
- `parent_components` - Productos que tienen este como hijo
- `child_components` - Productos que tiene como hijos (BOM)
- `income_account`, `expense_account`, `inventory_account` - Cuentas contables

---

## 🔗 Relaciones Clave

### Estructura BOM (Bill of Materials)

Un producto puede estar compuesto por otros productos usando `product_components`:

```
Parent Product
    ├── Child Product 1 (qty: 2, unit: pcs)
    ├── Child Product 2 (qty: 0.5, unit: m)
    └── Child Product 3 (qty: 1, unit: pcs)
```

**Campos de Relación:**
- `parent_product_id` - Producto padre
- `child_product_id` - Producto hijo
- `child_variant_id` - Variante específica del hijo (opcional)
- `quantity` - Cantidad requerida
- `unit_id` - Unidad de medida
- `length_mm`, `width_mm`, `height_mm` - Dimensiones para cálculo
- `waste_percentage` - % de desperdicio
- `order` - Orden de visualización

**Validación:** Se previene creación de referencias circulares.

---

## 📡 Endpoints

### Productos Base

```
POST   /master-data/products              # Crear producto
GET    /master-data/products              # Listar todos (con relaciones incluidas)
GET    /master-data/products/:id          # Obtener uno (detalles completos)
GET    /master-data/products/:id/root-products  # Obtener productos raíz
PATCH  /master-data/products/:id          # Actualizar
DELETE /master-data/products/:id          # Eliminar (soft delete)
```

### Componentes de Producto (BOM)

```
POST   /master-data/products/:id/components           # Agregar componente
GET    /master-data/products/:id/components           # Listar componentes
PATCH  /master-data/products/components/:id           # Actualizar
DELETE /master-data/products/components/:id           # Eliminar
```

### Ingeniería (Engineering Tree)

```
GET    /master-data/products/:id/engineering          # Obtener árbol técnico
GET    /master-data/products/:id/engineering/tree     # Árbol con cálculos
POST   /master-data/products/:id/engineering          # Crear componente técnico
PATCH  /master-data/products/:id/engineering/:compId  # Actualizar
POST   /master-data/products/:id/engineering/versions # Crear versión
```

### Costos (Costing)

```
GET    /master-data/products/:id/costing              # Obtener costos
GET    /master-data/products/:id/costing/tree         # Árbol de costos
GET    /master-data/products/:id/costing/breakdown    # Desglose de costos
GET    /master-data/products/:id/costing/history      # Historial
POST   /master-data/products/:id/costing/calculate    # Recalcular
POST   /master-data/products/:id/costing/templates    # Crear plantilla
```

### Variantes

```
POST   /master-data/products/:id/variants             # Crear variante
GET    /master-data/products/:id/variants             # Listar variantes
PATCH  /master-data/products/variants/:variantId      # Actualizar
DELETE /master-data/products/variants/:variantId      # Eliminar
```

### Categorías

```
POST   /master-data/products/:id/categories           # Asignar categoría
DELETE /master-data/products/:id/categories/:catId    # Remover categoría
```

### Tags

```
POST   /master-data/products/:id/tags                 # Asignar tag
DELETE /master-data/products/:id/tags/:tagId          # Remover tag
```

---

## 🧮 Estrategias de Cálculo de Costos

El módulo **costing** soporta múltiples estrategias:

### 1. **Manual Cost Strategy** (`ManualCostStrategy`)
- Costos ingresados manualmente por el usuario
- Usado para productos sin componentes o cuando no aplica otro cálculo

### 2. **Purchase Cost Strategy** (`PurchaseCostStrategy`)
- Basado en costos de compra históricos
- Típico para materias primas, productos comprados

### 3. **BOM Cost Strategy** (`BomCostStrategy`)
- Suma de costos de componentes más overhead
- Para productos compuestos (kits, ensambles)
- Fórmula: `Σ(child_cost × qty) × (1 + overhead%)`

### 4. **Engineering Cost Strategy** (`EngineeringCostStrategy`)
- Basado en especificaciones técnicas (dimensiones, materiales)
- Usado para productos con estructura técnica definida
- Calcula consumo de material según propiedades de componentes

### 5. **Rate Cost Strategy** (`RateCostStrategy`)
- Basado en tarifas (servicios, mano de obra)
- Multiplica cantidad × tarifa

### Selection Logic:
```typescript
if (product.cost_source === ProductCostSource.MANUAL) {
  return manualStrategy.calculate()
} else if (product.is_composed) {
  return bomStrategy.calculate()
} else if (product.has_engineering) {
  return engineeringStrategy.calculate()
} else if (product.is_rate_type) {
  return rateStrategy.calculate()
} else {
  return purchaseStrategy.calculate()
}
```

---

## 🌳 Árbol de Ingeniería (Engineering)

Estructura técnica de componentes para productos complejos.

**Características:**
- Árbol jerárquico de componentes
- Cálculo de dimensiones totales
- Validación de especificaciones
- Versionado de estructuras
- Cálculo automático de cantidad/desperdicio

**Servicios:**
- `EngineeringService` - Operaciones CRUD
- `EngineeringTreeService` - Construcción y recorrido del árbol
- `EngineeringCalculationService` - Cálculos dimensional
- `EngineeringValidationService` - Validaciones
- `ProductStructureVersionService` - Control de versiones

---

## 💾 Flujos Principales

### 1. Crear un Producto Simple

```typescript
const product = await productService.create({
  name: "Tornillo M8",
  sku: "SCREW-M8-100",
  product_type: ProductType.MATERIAL,
  manages_stock: true,
  active: true
})
```

**Validaciones:**
- SKU único en BD (excluye soft-deleted)
- Campos requeridos validados por DTO

---

### 2. Crear Producto Compuesto (BOM)

```typescript
// 1. Crear producto padre
const parent = await productService.create({
  name: "Kit Ensamble",
  sku: "KIT-ASSEMBLY-001",
  is_composed: true,
  auto_calculate_cost: true,
  product_type: ProductType.KIT
})

// 2. Agregar componentes
await componentService.create({
  parent_product_id: parent.id,
  child_product_id: "child-id-1",
  quantity: 2,
  unit_id: "unit-pcs",
  waste_percentage: 5,
  order: 1
})
```

**Validaciones Automáticas:**
- ✅ No se permite referencia circular (recursivo)
- ✅ Ambos productos deben existir y no estar deleted
- ✅ Máximo nivel de profundidad (si aplica)

---

### 3. Obtener Producto con Detalles Completos

```typescript
const fullProduct = await productService.findOne(productId)

// Retorna:
{
  id, name, sku, active, ...
  product_price: [...],        // Precios
  product_costs: [...],        // Costos
  product_variants: [...],     // Variantes con atributos
  product_categories: [...],   // Categorías
  product_tags: [...],         // Tags
  product_attribute_values: [...],  // Atributos
  parent_components: [...],    // Como padre
  child_components: [...],     // Como hijo
  root_products: [...]         // Productos raíz (si es componente)
}
```

---

### 4. Obtener Productos Raíz

Si un producto es componente de otros, obtiene el/los "raíces" (top-level parents).

```typescript
const roots = await productService.getRootProducts(productId)

// Algoritmo:
// - Si el producto no tiene padres → es raíz, retorna [self]
// - Si tiene padres → recursivamente busca raíces de cada padre
// - Evita loops con Set de visitados
```

---

### 5. Calcular Costo de Producto

```typescript
const calculatedCost = await costingService.calculateCost(
  productId,
  { 
    includeHistory: true,
    includeBreakdown: true,
    currency: "USD"
  }
)

// Retorna:
{
  productId,
  totalCost: 150.50,
  currency: "USD",
  breakdown: [
    { componentId, componentName, quantity, unitCost, totalCost },
    ...
  ],
  history: [...],  // Cálculos anteriores
  strategyUsed: "BOM_COST"
}
```

---

## 🔍 Particularidades Importantes

### Soft Delete
- Los productos **no se eliminan** sino que se marcan con `deleted_at`
- Las queries excluyen registros con `deleted_at != null`
- Permite auditoría y recuperación

### Validación de SKU Única
```typescript
// SKU solo es único entre productos no eliminados
const existing = await prisma.products.findFirst({
  where: { sku, deleted_at: null }
})
```

### Inclusión de Relaciones
El `findOne()` incluye muchas relaciones por defecto:
- Variantes con sus atributos y precios
- Costos con moneda
- Componentes (padre-hijo) con detalles
- Categorías, tags, impuestos, etc.

**⚠️ Nota:** Esto puede ser lento en BDs grandes. Considerar lazy-loading o queries selectivas.

### Root Products
Método recursivo que encuentra el/los producto(s) "raíz" (sin padres):
- Previene loops infinitos con `Set<string>`
- Útil para reportes, trazabilidad completa

---

## 🗂️ DTOs Principales

### CreateProductDto
```typescript
{
  name: string (required)
  sku?: string
  requires_refrigeration?: boolean
  price_enabled?: boolean
  is_rate_type?: boolean
  rate_id?: UUID
  taxId?: UUID
  active?: boolean
  product_type?: ProductType enum
  is_composed?: boolean
  auto_calculate_cost?: boolean
  has_engineering?: boolean
  manages_stock?: boolean
  income_account_id?: UUID
  expense_account_id?: UUID
  inventory_account_id?: UUID
  calculation_type?: CalculationType enum
  cost_source?: ProductCostSource enum
}
```

### UpdateProductDto
Similar a Create, pero todos los campos son opcionales.

---

## 🔐 Seguridad

- **Autenticación:** JWT Guard en todos los endpoints
- **Autorización:** A definir según roles/permisos (pendiente)

---

## 📈 Consideraciones de Performance

1. **N+1 Queries:** El `findOne()` hace una query compleja. Para listados, considerar paginación.
2. **Soft Deletes:** Las queries siempre filtran `deleted_at: null`. Asegurar índices.
3. **Relaciones Profundas:** Engineering y Costing pueden tener árboles profundos. Considerar limites.
4. **Cálculos Recursivos:** `getRootProducts()` es O(n) en profundidad del árbol.

---

## 🚀 Ejemplos de Uso

### Crear Producto Terminado Compuesto
```typescript
// POST /master-data/products
{
  "name": "Kit Herramientas Completo",
  "sku": "KIT-TOOLS-PRO",
  "product_type": "KIT",
  "is_composed": true,
  "auto_calculate_cost": true,
  "manages_stock": false,  // Kit, no se gestiona stock del padre
  "active": true
}
```

### Agregar Componentes
```typescript
// POST /master-data/products/:id/components
[
  {
    "child_product_id": "destornillador-id",
    "quantity": 1,
    "unit_id": "unit-pcs",
    "order": 1
  },
  {
    "child_product_id": "cinta-aislante-id",
    "quantity": 2,
    "unit_id": "unit-roll",
    "waste_percentage": 10,
    "order": 2
  }
]
```

### Obtener Producto Completo
```typescript
// GET /master-data/products/kit-id
→ Retorna producto con todas las variantes, precios, componentes, costos, etc.
```

---

## 📚 Referencias

- **Prisma Models:** `/prisma/schema.prisma` (buscar `model products`, `model product_components`, etc.)
- **Enums:** `/generated/prisma/enums` (ProductType, CalculationType, ProductCostSource, etc.)
- **Testing:** `/test/products.*.spec.ts` (si existen)

---

**Última Actualización:** 2024
**Versión:** 1.0
