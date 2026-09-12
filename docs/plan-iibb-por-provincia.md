# Plan: IIBB por Provincia

## Estado Actual

| Componente | Estado |
|---|---|
| Impuestos IIBB en catálogo | ✅ `PERC_IIBB` (3.5%), `RET_IIBB` (2.5%) |
| Provincia en ubicaciones | ✅ Campo `province` en `locations` (texto libre) |
| Provincia en business_parties | ❌ No existe campo directo |
| Cálculo automático de IIBB | ❌ No existe |
| Tarifa IIBB por provincia | ❌ No existe tabla de configuración |

---

## Arquitectura Propuesta

### 1. Nueva tabla `iibb_rates`

**Schema:** `prisma/schema/taxes.prisma`

```prisma
model iibb_rates {
  id                String   @id @default(uuid()) @db.Uuid
  province          String   @db.VarChar(100)  // CABA, CORDOBA, BUENOS_AIRES, etc.
  tax_type          String   @db.VarChar(30)   // PERCEPCION, RETENCION
  rate              Decimal  @db.Decimal(6, 3) // 3.500 = 3.5%
  min_amount        Decimal  @default(0) @db.Decimal(12, 2)
  active            Boolean  @default(true)
  created_at        DateTime @default(now()) @db.Timestamp(6)
  updated_at        DateTime? @updatedAt @db.Timestamp(6)
  deleted_at        DateTime?
  created_by        String?  @db.Uuid
  updated_by        String?  @db.Uuid

  @@unique([province, tax_type])
  @@schema("tenant")
}
```

### 2. Seed de datos

**Archivo:** `prisma/seeds/iibb_rates.seed.sql`

```sql
DELETE FROM tenant.iibb_rates;

INSERT INTO tenant.iibb_rates (id, province, tax_type, rate, min_amount, active)
VALUES
  (gen_random_uuid(), 'BUENOS_AIRES', 'PERCEPCION', 3.500, 0, true),
  (gen_random_uuid(), 'BUENOS_AIRES', 'RETENCION',  2.500, 0, true),
  (gen_random_uuid(), 'CABA',         'PERCEPCION', 3.000, 0, true),
  (gen_random_uuid(), 'CABA',         'RETENCION',  2.000, 0, true),
  (gen_random_uuid(), 'CORDOBA',      'PERCEPCION', 4.000, 0, true),
  (gen_random_uuid(), 'CORDOBA',      'RETENCION',  3.000, 0, true),
  (gen_random_uuid(), 'SANTA_FE',     'PERCEPCION', 3.500, 0, true),
  (gen_random_uuid(), 'SANTA_FE',     'RETENCION',  2.500, 0, true),
  (gen_random_uuid(), 'MENDOZA',      'PERCEPCION', 3.000, 0, true),
  (gen_random_uuid(), 'MENDOZA',      'RETENCION',  2.000, 0, true);
```

### 3. Service para resolver IIBB

**Archivo:** `src/modules/erp/iibb/iibb.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class IibbService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /**
   * Obtiene la tasa de IIBB para una provincia y tipo (percepción/retención)
   */
  async getRate(province: string, taxType: 'PERCEPCION' | 'RETENCION') {
    const rate = await this.prisma.iibb_rates.findFirst({
      where: {
        province: province.toUpperCase(),
        tax_type: taxType,
        active: true,
        deleted_at: null,
      },
    });

    return rate;
  }

  /**
   * Calcula el monto de IIBB sobre un subtotal
   */
  async calculate(subtotal: number, province: string, taxType: 'PERCEPCION' | 'RETENCION') {
    const rate = await this.getRate(province, taxType);

    if (!rate) return { rate: 0, amount: 0, taxableBase: 0 };

    const taxableBase = subtotal;
    const amount = Number(((taxableBase * Number(rate.rate)) / 100).toFixed(2));

    return {
      rate: Number(rate.rate),
      amount,
      taxableBase,
      minAmount: Number(rate.min_amount),
      applied: amount >= Number(rate.min_amount),
    };
  }

  /**
   * Obtiene la provincia de un business_party a través de sus ubicaciones
   */
  async getPartyProvince(partyId: string): Promise<string | null> {
    const party = await this.prisma.business_parties.findUnique({
      where: { id: partyId },
      include: {
        party_locations: {
          include: { locations: true },
          take: 1,
        },
      },
    });

    return party?.party_locations?.[0]?.locations?.province ?? null;
  }

  /**
   * Resuelve IIBB completo para un documento: obtiene provincia del proveedor/cliente
   * y calcula la percepción o retención correspondiente
   */
  async resolveForDocument(partyId: string, subtotal: number, taxType: 'PERCEPCION' | 'RETENCION') {
    const province = await this.getPartyProvince(partyId);

    if (!province) {
      return { province: null, rate: 0, amount: 0, applied: false, reason: 'Sin provincia configurada' };
    }

    const result = await this.calculate(subtotal, province, taxType);

    return {
      province,
      ...result,
      applied: result.applied,
    };
  }
}
```

### 4. Module

**Archivo:** `src/modules/erp/iibb/iibb.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { IibbService } from './iibb.service';
import { IibbController } from './iibb.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IibbController],
  providers: [IibbService],
  exports: [IibbService],
})
export class IibbModule {}
```

### 5. Controller (CRUD para admin de tarifas)

**Archivo:** `src/modules/erp/iibb/iibb.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { IibbService } from './iibb.service';

@Controller('erp/iibb-rates')
export class IibbController {
  constructor(private readonly service: IibbService) {}

  @Get()
  findAll(@Query('province') province?: string) {
    return this.service.findAll(province);
  }

  @Get('calculate')
  calculate(
    @Query('province') province: string,
    @Query('subtotal') subtotal: string,
    @Query('type') taxType: string,
  ) {
    return this.service.calculate(Number(subtotal), province, taxType as any);
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

### 6. Integración con confirmación de documentos

**En `documents_sales.services.ts`**, después de confirmar un documento:

```typescript
// Después de confirmar el documento
if (doc.party_id) {
  const province = await this.iibbService.getPartyProvince(doc.party_id);

  if (province) {
    const iibbPercepcion = await this.iibbService.calculate(
      doc.subtotal.toNumber(),
      province,
      'PERCEPCION'
    );

    if (iibbPercepcion.applied) {
      // Crear entry en document_taxes para IIBB
      await this.prisma.document_taxes.create({
        data: {
          document_id: doc.id,
          tax_id: iibbTaxId, // ID del impuesto IIBB en tabla taxes
          tax_rate: iibbPercepcion.rate,
          taxable_base: iibbPercepcion.taxableBase,
          tax_amount: iibbPercepcion.amount,
        },
      });
    }
  }
}
```

### 7. Integración con pagos (retenciones IIBB)

**En `retentionLogic.ts`**, reemplazar tasa hardcodeada:

```typescript
// ANTES (hardcoded)
const RET_IIBB = { rate: 2.5, minAmount: 10000 };

// DESPUÉS (dinámico desde iibb_rates)
const iibbRate = await iibbService.getRate(province, 'RETENCION');
const RET_IIBB = {
  rate: Number(iibbRate?.rate ?? 2.5),
  minAmount: Number(iibbRate?.min_amount ?? 10000),
};
```

### 8. Frontend: Settings IIBB Rates

**Página:** `pages/erp/settings/iibb-rates.vue`

CRUD para administrar las tarifas IIBB por provincia.

---

## Archivos a crear/modificar

| Archivo | Acción | Prioridad |
|---|---|---|
| `prisma/schema/taxes.prisma` | Agregar modelo `iibb_rates` | Alta |
| `prisma/seeds/iibb_rates.seed.sql` | Crear seed con tarifas | Alta |
| `src/modules/erp/iibb/iibb.service.ts` | Crear service | Alta |
| `src/modules/erp/iibb/iibb.module.ts` | Crear module | Alta |
| `src/modules/erp/iibb/iibb.controller.ts` | Crear controller CRUD | Alta |
| `src/modules/erp/documents-sales/documents_sales.module.ts` | Importar IibbModule | Media |
| `src/modules/erp/documents-sales/documents_sales.services.ts` | Integrar cálculo IIBB en confirm | Media |
| `app/pages/erp/settings/iibb-rates.vue` | Crear página admin IIBB | Media |
| `app/modulos/erp/payments/utils/retentionLogic.ts` | Usar tasa dinámica | Baja |

---

## Orden de ejecución

1. Crear schema `iibb_rates`
2. Ejecutar migración: `npx prisma migrate dev`
3. Ejecutar seed: `npx prisma db execute --file prisma/seeds/iibb_rates.seed.sql`
4. Crear IibbService con lógica de resolución
5. Crear IibbModule + IibbController
6. Integrar con DocumentsSalesService (cálculo al confirmar)
7. Crear página admin de tarifas IIBB
8. Integrar con retenciones en pagos

---

## Notas

- Las tarifas IIBB son ejemplo. Verificar con contador los valores reales por provincia.
- La resolución de provincia se hace desde `party_locations → locations.province`.
- Si un proveedor no tiene ubicación, IIBB no se calcula (se omite).
- El campo `province` en `locations` es texto libre. Para normalización futura, se podría crear un catálogo de provincias.
