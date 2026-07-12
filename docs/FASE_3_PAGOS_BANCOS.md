# Fase 3: Pagos, Bancos, Cuentas Corrientes y Transferencias — Documentación

**Fecha:** 2026-07-11
**Estado:** Completado (parcial — reports completados)
**Epic:** Módulo de Tesorería (AS-281 / AS-284 / AS-285)
**Subtareas cubiertas:** T-2.26–T-2.29, T-3.x, T-3.30–T-3.33, T-5.4–T-5.7, T-7.8–T-7.10, T-8.x

---

## Objetivo

Implementar el sistema de pagos y cobros con integración a documentos, cuentas bancarias, cuentas corrientes de terceros, y transferencias entre cajas/bancos.

---

## Archivos Creados

### Payments — `src/modules/erp/payments/`

| Archivo | Descripción |
|---------|-------------|
| `payments.module.ts` | Módulo NestJS |
| `payments.controller.ts` | Controller con 6 endpoints (CRUD + reverse) |
| `payments.service.ts` | Service con creación + validación saldo + pagos parciales + current_accounts + movimientos |
| `dto/create-payment.dto.ts` | DTO: type, payment_method, amount, currency_code, documents[], cash_box_id, bank_account_id |
| `dto/update-payment.dto.ts` | DTO de actualización |

### Bank Accounts — `src/modules/erp/bank-accounts/`

| Archivo | Descripción |
|---------|-------------|
| `bank-accounts.module.ts` | Módulo NestJS |
| `bank-accounts.controller.ts` | Controller con 6 endpoints (CRUD + movements) |
| `bank-accounts.service.ts` | Service con CRUD + consulta de movimientos |
| `dto/create-bank-account.dto.ts` | DTO: name, bank_name, account_type, cbu, alias, currency_code |
| `dto/update-bank-account.dto.ts` | DTO de actualización |

### Current Accounts — `src/modules/erp/current-accounts/`

| Archivo | Descripción |
|---------|-------------|
| `current-accounts.module.ts` | Módulo NestJS |
| `current-accounts.controller.ts` | Controller con 5 endpoints (entry, findByParty, entries, statement, balance) |
| `current-accounts.service.ts` | Service con addEntry + getEntries + getStatement + getBalance |
| `dto/create-current-account-entry.dto.ts` | DTO: party_id, party_type, currency_code, type, amount |

### Cash Box Transfers — `src/modules/logistica/cash-box-transfers/`

| Archivo | Descripción |
|---------|-------------|
| `cash-box-transfers.module.ts` | Módulo NestJS |
| `cash-box-transfers.controller.ts` | Controller con 6 endpoints (CRUD + confirm + cancel) |
| `cash-box-transfers.service.ts` | Service con validación fondos + ejecución transferencia |
| `dto/create-cash-box-transfer.dto.ts` | DTO: source/dest (type+id), amount, currency_code, transfer_type |

---

## Endpoints

### Payments — `/api/erp/payments`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/erp/payments` | Crear pago (aplica documentos, crea movimientos, actualiza current_accounts) |
| `GET` | `/api/erp/payments` | Listar (filtros: party_id, type, payment_method, status) |
| `GET` | `/api/erp/payments/:id` | Obtener uno (con party, documents, bank_account) |
| `PATCH` | `/api/erp/payments/:id` | Actualizar (solo borrador status=1) |
| `DELETE` | `/api/erp/payments/:id` | Soft delete (revert applied amounts) |
| `POST` | `/api/erp/payments/:id/reverse` | Reversar pago (revert documentos + current_accounts) |

### Bank Accounts — `/api/erp/bank-accounts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/erp/bank-accounts` | Crear cuenta bancaria |
| `GET` | `/api/erp/bank-accounts` | Listar todas |
| `GET` | `/api/erp/bank-accounts/:id` | Obtener una (con últimos 20 movimientos) |
| `PATCH` | `/api/erp/bank-accounts/:id` | Actualizar |
| `DELETE` | `/api/erp/bank-accounts/:id` | Soft delete |
| `GET` | `/api/erp/bank-accounts/:id/movements` | Movimientos de la cuenta |

### Current Accounts — `/api/erp/current-accounts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/erp/current-accounts/entries` | Crear entrada (upsert cuenta + balance) |
| `GET` | `/api/erp/current-accounts/party/:partyId` | Cuentas de un tercero |
| `GET` | `/api/erp/current-accounts/party/:partyId/entries` | Entradas de un tercero |
| `GET` | `/api/erp/current-accounts/party/:partyId/statement` | Estado de cuenta |
| `GET` | `/api/erp/current-accounts/party/:partyId/balance` | Saldo actual |

### Cash Box Transfers — `/api/logistica/cash-box-transfers`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/logistica/cash-box-transfers` | Crear transferencia |
| `GET` | `/api/logistica/cash-box-transfers` | Listar (filtros: source/dest, status) |
| `GET` | `/api/logistica/cash-box-transfers/:id` | Obtener una |
| `PATCH` | `/api/logistica/cash-box-transfers/:id/confirm` | Confirmar (ejecuta movimientos) |
| `PATCH` | `/api/logistica/cash-box-transfers/:id/cancel` | Cancelar |
| `DELETE` | `/api/logistica/cash-box-transfers/:id` | Soft delete |

---

## Flujo Completo: Documento → Pago → Cuenta Corriente

```
1. Crear business_party (CUSTOMER/SUPPLIER)
   POST /master-data/business-parties { type: "CUSTOMER", name: "..." }

2. Crear documento de venta
   POST /documents/sales { party_id, items: [...], currency_code }

3. Confirmar documento → crea ENTRADA DEBIT en current_accounts
   PATCH /documents/sales/:id/confirm → status=2
   → documents.total = 10000, paid_amount = 0
   → current_account_entries type=DEBIT, amount=10000, balance=-10000 (deuda)
   → current_accounts.balance -= 10000

4. Pago parcial → crea ENTRADA COLLECTION en current_accounts
   POST /erp/payments {
     type: "COLLECTION",
     amount: 5000,
     documents: [{ document_id, amount_applied: 5000 }]
   }
   → documents.paid_amount = 5000
   → current_account_entries type=COLLECTION, amount=5000, balance=-5000 (debe 5000)
   → current_accounts.balance += 5000

5. Pago final → crea ENTRADA COLLECTION en current_accounts
   POST /erp/payments {
     type: "COLLECTION",
     amount: 5000,
     documents: [{ document_id, amount_applied: 5000 }]
   }
   → documents.paid_amount = 10000 (saldado)
   → current_account_entries type=COLLECTION, amount=5000, balance=0 (saldado)
   → current_accounts.balance += 5000

6. Verificar cuenta corriente
   GET /erp/current-accounts/party/:partyId/statement?currency_code=USD
   → 3 asientos: DEBIT 10000, COLLECTION 5000, COLLECTION 5000
   → balance = 0
```

### Nota sobre ventas vs compras

| Tipo | DEBIT al confirmar | COLLECTION al pagar |
|------|-------------------|---------------------|
| **Venta** | balance -= total (cliente nos debe) | balance += monto (reduce deuda) |
| **Compra** | balance += total (le debemos al proveedor) | balance -= monto (reduce lo que debemos) |

---

## Validaciones de Pagos

| Escenario | Error |
|-----------|-------|
| `suma(amount_applied) ≠ amount` | `La suma de los montos aplicados (3000) no coincide con el monto del pago (5000)` |
| `amount_applied > saldo pendiente` | `El monto aplicado (8000) excede el saldo pendiente (5000) del documento #001` |
| `documento ya saldado` | `El documento #001 ya está saldado (total: 10000, pagado: 10000)` |
| `party_id requerido con documentos` | `party_id es requerido cuando se aplican documentos` |

---

## Integración Cross-Module

Al **confirmar documento**:
- Se crea entrada DEBIT en `current_account_entries` del tercero
- Se actualiza `current_accounts.balance`

Al **crear un pago**, se actualizan automáticamente:

| Tabla | Acción |
|-------|--------|
| `payment_documents` | Vincula pago ↔ documento con `amount_applied` |
| `documents.paid_amount` | Incrementa/decrementa |
| `cash_box_movements` | Crea movimiento con `payment_id` + `reference_type/reference_id` |
| `cash_box_balances` | Actualiza saldo de la caja |
| `bank_account_movements` | Crea movimiento bancario (si `bank_account_id`) |
| `bank_accounts.balance` | Actualiza saldo del banco |
| `current_account_entries` | Crea asiento en cuenta corriente del tercero |
| `current_accounts.balance` | Actualiza saldo de la cuenta corriente |

---

## Archivos REST Client (.http)

| Archivo | Requests | Descripción |
|---------|----------|-------------|
| `https/erp/payments.http` | 10 | CRUD + reverse + pago parcial/total + múltiples documentos |
| `https/erp/bank-accounts.http` | 7 | CRUD + movements |
| `https/erp/current-accounts.http` | 7 | entries + statement + balance |
| `https/logistica/cash-box-transfers.http` | 9 | CRUD + confirm/cancel |
| `https/erp/documents/documents-payments-flow.http` | 15 | Flujo completo party→documento→pago→cuenta corriente |

---

## Verificación

- [x] Payments: module, controller (6 endpoints), service con validaciones
- [x] BankAccounts: module, controller (6 endpoints), service
- [x] CurrentAccounts: module, controller (5 endpoints), service
- [x] CashBoxTransfers: module, controller (6 endpoints), service con validación fondos
- [x] **Document confirm → DEBIT en current_accounts** (ventas y compras)
- [x] **Document cancel → reversa DEBIT en current_accounts**
- [x] Validación de saldo pendiente en documentos
- [x] Validación de pago parcial (suma applied = amount)
- [x] Integración automática con current_accounts
- [x] Integración automática con cash_box_movements (reference_type/reference_id)
- [x] Reversión de current_accounts al reversar pago
- [x] `tsc --noEmit` → ✅ Sin errores

---

## Próximos Pasos

1. **T-4.1–T-4.3**: Detección de conversión de moneda (ExchangeService)
2. **T-4.4–T-4.6**: Endpoints de documentos (payment-status, pay, unpaid)
3. **T-4.7–T-4.10**: Módulo Checks (cheques propios y de terceros)
4. **T-5.1–T-5.3**: Schedulers de cheques (notificación + procesamiento)
5. **T-6.x / T-7.x**: Módulo CreditCards (tarjetas de crédito)
6. **T-8.6–T-8.7**: RBAC seed (permisos + roles)
7. **T-9.x**: Tests unitarios

## Completado Reciente

- **T-3.30–T-3.33**: Reportes de pagos (payment-reports module) — Ver `FASE_3_REPORTES_PAGOS.md`
