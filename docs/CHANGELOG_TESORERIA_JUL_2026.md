# Changelog - Tesorería: Bugs + Fase 4 (Cheques)

**Fecha**: 13 de Julio, 2026

---

## Resumen

Corrección de 4 bugs críticos en el módulo de tesorería y creación completa del módulo de Cheques (Fase 4).

---

## Parte 1: Bug Fixes

### Bug 1: `reverse()` en PaymentsService incompleto

**Archivo**: `src/modules/erp/payments/payments.service.ts`

**Problema**: El método `reverse()` solo revertía:
- `documents.paid_amount` (aplicación de documentos)
- `current_account_entries` (libro mayor)

Pero **NO** revertía:
- `cash_box_movements` (movimientos de caja)
- `cash_box_balances` (saldos de caja)
- `bank_account_movements` (movimientos bancarios)
- `bank_accounts.balance` (saldos bancarios)

**Solución**: Agregada lógica completa de reversión para caja y banco, usando los campos `payment.cash_box_id` y `payment.bank_account_id` que ya existen en el registro.

### Bug 2: `remove()` en PaymentsService incompleto

**Archivo**: `src/modules/erp/payments/payments.service.ts`

**Problema**: El soft delete solo revertía `documents.paid_amount`, pero no los movimientos de caja/banco.

**Solución**: Agregada la misma lógica de reversión que `reverse()` antes del soft delete, con descripciones indicando que es una reversión por eliminación.

### Bug 3: Guards no aplicados a controllers

**Archivos modificados**:
- `src/modules/logistica/cash-boxes/cash-boxes.controller.ts`
- `src/modules/logistica/cash-box-movements/cash-box-movements.controller.ts`
- `src/modules/logistica/cash-box-renditions/cash-box-renditions.controller.ts`
- `src/modules/logistica/cash-box-transfers/cash-box-transfers.controller.ts`

**Problema**: Los guards `CashBoxAccessGuard` y `CashBoxSessionGuard` existían pero no estaban aplicados a ningún controller.

**Solución**: Agregados `@UseGuards(CashBoxAccessGuard)` y `@UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)` a los endpoints de escritura:

| Controller | Endpoints protegidos |
|------------|---------------------|
| CashBoxesController | `create`, `update`, `remove`, `openSession`, `closeSession`, `forceCloseSession` |
| CashBoxMovementsController | `create`, `update`, `remove` |
| CashBoxRenditionsController | `create`, `approve`, `reject`, `remove` |
| CashBoxTransfersController | `create`, `confirm`, `cancel`, `remove` |

### Bug 4: Módulos duplicados

**Archivo**: `src/modules/erp/tesoreria/tesoreria.module.ts`

**Problema**: Los módulos `CashBoxesModule`, `CashBoxMovementsModule`, `CashBoxRenditionsModule` y `CashBoxTransfersModule` estaban importados en BOTH `ErpModulesModule` Y `TesoreriaModule`.

**Solución**: Eliminados los imports de CashBox* de `TesoreriaModule` ya que están en `LogisticaModule`.

---

## Parte 2: Fase 4 - Módulo de Cheques

### Flujo de Negocio (estilo ERP profesional)

**Cheque propio (pago a proveedor):**
1. **Registrar cheque** → Crea pago `PAYMENT` + debita cuenta corriente del proveedor
2. **Confirmar cheque** → Descuenta dinero del banco (movimiento `CHECK_ISSUED` negativo)
3. **Scheduler 10:00 AM** → Procesa cheques con `payment_date` = hoy

**Cheque de tercero (cobro de cliente):**
1. **Registrar cheque** → Crea pago `COLLECTION` + acredita cuenta corriente del cliente
2. **Cobrar cheque** → Acredita dinero en el banco (movimiento `COLLECTION` positivo)

**Rechazo (fondos insuficientes):**
- Scheduler detecta → Marca `BOUNCED` + reversa cuenta corriente

### Archivos creados

```
src/modules/erp/checks/
├── checks.module.ts
├── checks.controller.ts
├── checks.service.ts
├── dto/
│   ├── create-check.dto.ts
│   └── update-check.dto.ts
└── schedulers/
    ├── check-notification.scheduler.ts
    └── check-processing.scheduler.ts
```

### Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/erp/checks` | Registrar cheque (crea pago + impacta cuenta corriente) |
| GET | `/api/erp/checks` | Listar cheques (filtros: status, is_own, bank_name, due_before) |
| GET | `/api/erp/checks/upcoming` | Cheques próximos a vencer (?days=7) |
| GET | `/api/erp/checks/pending-notification` | Pendientes de notificación |
| GET | `/api/erp/checks/:id` | Detalle de cheque |
| PATCH | `/api/erp/checks/:id` | Actualizar cheque |
| PATCH | `/api/erp/checks/:id/confirm` | Confirmar cobro propio (impacta banco) |
| PATCH | `/api/erp/checks/:id/clear` | Cobrar tercero (impacta banco) |
| PATCH | `/api/erp/checks/:id/bounce` | Marcar rechazado |
| PATCH | `/api/erp/checks/:id/reject` | Rechazar cobro propio |
| DELETE | `/api/erp/checks/:id` | Eliminar cheque (soft delete) |

### Schedulers

#### Check Notification Scheduler
- **Cron**: `0 9 * * *` (todos los días a las 9:00 AM)
- **Función**: Busca cheques propios con `payment_date` dentro de 2 días
- **Acción**: Marca `notification_sent = true`

#### Check Processing Scheduler
- **Cron**: `0 10 * * *` (todos los días a las 10:00 AM)
- **Función**: Procesa cheques propios con `payment_date` = hoy
- **Acciones**:
  - Si hay fondos: marca `CLEARED`, crea movimiento bancario negativo, actualiza saldo
  - Si NO hay fondos: marca `BOUNCED`, crea entrada en cuenta corriente como deuda

### Módulo registrado

El `ChecksModule` fue agregado a `src/modules/erp/erp.modules.ts`.

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/modules/erp/payments/payments.service.ts` | Agregada reversión de caja/banco en `reverse()` y `remove()` |
| `src/modules/logistica/cash-boxes/cash-boxes.controller.ts` | Agregados guards de acceso |
| `src/modules/logistica/cash-box-movements/cash-box-movements.controller.ts` | Agregados guards de acceso |
| `src/modules/logistica/cash-box-renditions/cash-box-renditions.controller.ts` | Agregados guards de acceso |
| `src/modules/logistica/cash-box-transfers/cash-box-transfers.controller.ts` | Agregados guards de acceso |
| `src/modules/erp/tesoreria/tesoreria.module.ts` | Eliminados imports duplicados de CashBox* |
| `src/modules/erp/erp.modules.ts` | Agregado ChecksModule |

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/modules/erp/checks/checks.module.ts` | Módulo NestJS |
| `src/modules/erp/checks/checks.controller.ts` | Controller con 11 endpoints |
| `src/modules/erp/checks/checks.service.ts` | Service con lógica de negocio |
| `src/modules/erp/checks/dto/create-check.dto.ts` | DTO de creación |
| `src/modules/erp/checks/dto/update-check.dto.ts` | DTO de actualización |
| `src/modules/erp/checks/schedulers/check-notification.scheduler.ts` | Scheduler de notificaciones |
| `src/modules/erp/checks/schedulers/check-processing.scheduler.ts` | Scheduler de procesamiento |

---

## Próximos pasos

- [ ] Fase 5: Schedulers de cheques (completado arriba)
- [ ] Fase 6: Módulo de Tarjetas de Crédito
- [ ] Fase 7: Transacciones con Tarjeta + Resúmenes
- [ ] Fase 8: RBAC seed para permisos de tesorería
- [ ] Fase 9: Unit tests
