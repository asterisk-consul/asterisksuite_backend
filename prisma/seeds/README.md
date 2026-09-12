# Seed Unificado — `seed-all.ts`

Script unificado que ejecuta todos los seeds necesarios para un tenant existente en Asterisk Suite.

## Qué hace

Semilla la base de datos de un tenant con todos los datos impositivos, documentales, contables y de seguridad necesarios para operar el ERP. Ejecuta 11 pasos en orden:

1. **Impuestos** — IVA, percepciones, retenciones e impuestos internos
2. **Categorías fiscales** — GRAV_21, GRAV_105, GRAV_27, EXENTO, NO_GRAV
3. **Asociaciones categoría ↔ impuesto** — vincula cada categoría con su IVA correspondiente
4. **Productos sin categoría** — asigna GRAV_21 por defecto a productos que no tengan categoría fiscal
5. **Tipos de documento** — facturas, notas de crédito/débito, órdenes, presupuestos, recibos, remitos
6. **Document types ↔ impuestos** — asocia IVA a tipos de documento (venta y compra)
7. **Secuencias de documentos** — secuencias por letra (Ventas A/B/C, Compras A/B/C)
8. **Vincular document_types ↔ secuencias** — asocia tipos con su secuencia por letra
9. **Conceptos bancarios** — comisiones, impuestos, gastos, intereses y ajustes bancarios
10. **Plan de cuentas** — ejecuta `accounts.seed.ts` para generar el plan contable argentino completo
11. **RBAC** — ejecuta `rbac.seed.ts` para crear permisos y 4 roles por defecto (admin, manager, user, viewer)

## Prerrequisitos

- **Node.js 20+** instalado
- **DATABASE_URL_BASE** definida en `.env` del backend (formato: `postgresql://user:pass@host:port/`)
- La **base de datos del tenant** debe existir previamente (`{tenant}_db`). El script NO crea bases de datos.
- **Prisma client generado**: ejecutar `pnpm prisma generate` desde `asterisksuite_backend/`

## Uso

```bash
# Desde el directorio asterisksuite_backend
npx tsx prisma/seeds/seed-all.ts <tenant>

# Ejemplos
npx tsx prisma/seeds/seed-all.ts dev
npx tsx prisma/seeds/seed-all.ts avanzia
```

El nombre del tenant se usa para construir el nombre de la base de datos: `{tenant}_db`. Por ejemplo, `npx tsx prisma/seeds/seed-all.ts dev` se conecta a `dev_db`.

## Datos que crea

### Impuestos (20 registros)

| Código | Nombre | Tipo | Tasa |
|--------|--------|------|------|
| IVA_21 | IVA 21% | IVA | 21% |
| IVA_105 | IVA 10.5% | IVA | 10.5% |
| IVA_27 | IVA 27% | IVA | 27% |
| IVA_0 | IVA 0% | IVA | 0% |
| IMP_IVA1 | IVA 21% (Importación) | IVA | 21% |
| IMP_IVA2 | IVA 10.5% (Importación) | IVA | 10.5% |
| IMP_IVA3 | IVA 27% (Importación) | IVA | 27% |
| PERC_IIBB | Percepción IIBB | PERCEPCION | 3.5% |
| PERC_IVA | Percepción IVA | PERCEPCION | 3% |
| PERC_GANANCIAS | Percepción Ganancias | PERCEPCION | 1% |
| PERC_SUSS | Percepción SUSS | PERCEPCION | 1% |
| COM_PERC_IIBB | Percepción IIBB (Compra) | PERCEPCION | 3.5% |
| COM_PERC_MUN | Percepción Municipal (Compra) | PERCEPCION | 2.5% |
| COM_PERC_IVA | Percepción IVA (Compra) | PERCEPCION | 3% |
| RET_IVA | Retención IVA | RETENCION | 3% |
| RET_IIBB | Retención IIBB | RETENCION | 2.5% |
| RET_GANANCIAS | Retención Ganancias | RETENCION | 1% |
| RET_SUSS | Retención SUSS | RETENCION | 1% |
| IIII | Impuestos Internos | IMPUESTO_INTERNO | 10% |

### Categorías fiscales (5 registros)

| Código | Nombre | Descripción |
|--------|--------|-------------|
| GRAV_21 | Gravado 21% | IVA al 21% |
| GRAV_105 | Gravado 10.5% | IVA al 10.5% |
| GRAV_27 | Gravado 27% | IVA al 27% |
| EXENTO | Exento | Sin IVA |
| NO_GRAV | No Gravado | No gravado, no genera crédito fiscal |

### Asociaciones categoría ↔ impuesto

- GRAV_21 → IVA_21
- GRAV_105 → IVA_105
- GRAV_27 → IVA_27

### Tipos de documento (17 registros)

| Código | Dirección | Categoría | Letra | Requiere CAE |
|--------|-----------|-----------|-------|--------------|
| FA-A | Venta | INVOICE | A | Sí |
| FB-A | Venta | INVOICE | B | Sí |
| FC-A | Venta | INVOICE | C | Sí |
| FX-A | Venta | INVOICE | X | No |
| NCA | Venta | CREDIT_NOTE | A | Sí |
| NCB | Venta | CREDIT_NOTE | B | Sí |
| NDA | Venta | DEBIT_NOTE | A | Sí |
| NDB | Venta | DEBIT_NOTE | B | Sí |
| FA-C | Compra | INVOICE | A | No |
| FB-C | Compra | INVOICE | B | No |
| FC-C | Compra | INVOICE | C | No |
| NCA-C | Compra | CREDIT_NOTE | A | No |
| NDA-C | Compra | DEBIT_NOTE | A | No |
| OV | Venta | ORDER | — | No |
| OC | Compra | ORDER | — | No |
| PRES | Venta | QUOTE | — | No |
| REC | Venta | RECEIPT | — | No |
| REM-V | Venta | REMITO | — | No |
| REM-C | Compra | REMITO | — | No |
| REM-T | Venta | REMITO | — | No |

### Secuencias de documentos

| Nombre | POS | Prefijo | Automática |
|--------|-----|---------|------------|
| Ventas A | 0001 | A | Sí |
| Ventas B | 0001 | B | Sí |
| Ventas C | 0001 | C | Sí |
| Compras A | 0002 | A | Sí |
| Compras B | 0002 | B | Sí |
| Compras C | 0002 | C | Sí |

### Conceptos bancarios (13 registros)

| Código | Nombre | Tipo | Cuenta |
|--------|--------|------|--------|
| COMISION | Comisión bancaria | COMMISSION | 6201 |
| COMISION_DEP | Comisión por depósito | COMMISSION | 6201 |
| COMISION_TRANSF | Comisión por transferencia | COMMISSION | 6201 |
| COMISION_MANT | Comisión por mantenimiento | COMMISSION | 6201 |
| IMP_DEBITOS | Imp. Débitos y Créditos | TAX | 6202 |
| IMP_SELLOS | Imp. Sellos | TAX | 6202 |
| IMP_CHEQUE | Imp. al Cheque | TAX | 6202 |
| GASTO_ADMIN | Gasto administrativo | EXPENSE | 6203 |
| GASTO_COBRANZA | Gasto de cobranza | EXPENSE | 6203 |
| INTERES_DESC | Interés por descubierto | INTEREST | 6204 |
| INTERES_PUNT | Interés punitorio | INTEREST | 6204 |
| INTERES_CAP | Interés capitalizable | INTEREST | 6204 |
| AJUSTE_BCRA | Ajuste BCRA | ADJUSTMENT | 6205 |
| DIF_CAMBIO | Diferencia de cambio | ADJUSTMENT | 6205 |

### RBAC

Se ejecuta `rbac.seed.ts` que crea:

- **~130 permisos** organizados por módulo (access-control, products, documents, currencies, taxes, accounts, units, categories, warehouses, trips, companies, cash_boxes, bank_accounts, payments, drivers, vehicles, picking, stock, etc.)
- **4 roles** con permisos crecientes:
  - `admin` — acceso total
  - `manager` — acceso a módulos de negocio sin administración de roles/usuarios
  - `user` — lectura y escritura básica
  - `viewer` — solo lectura (permisos `*.read`)

### Plan de cuentas

Se ejecuta `accounts.seed.ts` que genera el plan contable argentino completo. En caso de error (por ejemplo, si ya existe), el script lo reporta como advertencia y continúa.

## Idempotencia

El script es **idempotente**: puede ejecutarse múltiples veces sin perder datos.

- Usa `ON CONFLICT (code) DO UPDATE SET ...` para impuestos, categorías, tipos de documento y conceptos bancarios. Si el registro ya existe, actualiza los campos especificados.
- Usa `ON CONFLICT DO NOTHING` para relaciones (categoría↔impuesto, documento↔impuesto). Si la relación ya existe, simplemente la ignora.
- Los productos sin categoría se actualizan solo si `tax_category_id IS NULL`, por lo que no sobreescribe categorías ya asignadas.

Esto significa que puedes ejecutar el script después de actualizaciones del código sin riesgo de duplicar datos o perder configuraciones existentes.

## Troubleshooting

### "DATABASE_URL_BASE no está definida en .env"

Verificar que el archivo `.env` en la raíz del backend contenga:

```
DATABASE_URL_BASE=postgresql://usuario:password@localhost:5432/
```

Nota: la URL debe terminar con `/` ya que el script concatena el nombre de la base de datos.

### "Uso: npx tsx prisma/seeds/seed-all.ts <tenant>"

Se olvidó pasar el nombre del tenant como argumento. Ejemplo correcto:

```bash
npx tsx prisma/seeds/seed-all.ts dev
```

### Errores de conexión a la base de datos

Verificar que:
1. PostgreSQL esté corriendo
2. La base de datos `{tenant}_db` exista
3. Las credenciales en `DATABASE_URL_BASE` sean correctas
4. El usuario tenga permisos sobre la base de datos

### "Error durante el seed"

Revisar el mensaje de error específico. Las causas más comunes:
- Tabla inexistente: ejecutar `pnpm prisma migrate dev` para aplicar migraciones pendientes
- Prisma client desactualizado: ejecutar `pnpm prisma generate`
- Permisos insuficientes: el usuario de BD necesita permisos INSERT/UPDATE en el schema `tenant`

### Plan de cuentas falla

Si el plan de cuentas reporta un error (se muestra como advertencia, no fatal):
```bash
# Ejecutar directamente para ver el error completo
npx tsx prisma/seeds/accounts.seed.ts <tenant>
```

### RBAC falla

Si el RBAC reporta un error (se muestra como advertencia, no fatal):
```bash
# Ejecutar directamente para ver el error completo
npx tsx prisma/seeds/rbac.seed.ts <tenant>
```
