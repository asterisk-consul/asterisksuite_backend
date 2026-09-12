# Fase 1: Configuración Base — Documentación

**Fecha:** 2026-07-10
**Estado:** Completado
**Epic:** Módulo de Tesorería (AS-278)
**Subtareas cubiertas:** T-1.1 a T-1.26

---

## Objetivo

Definir la capa de persistencia completa del módulo de tesorería: enums, modelos Prisma, y modificaciones a modelos existentes. Schema validado, cliente generado, y migración SQL ejecutada en `dev_db`.

---

## Resumen de Cambios

| Tipo | Cantidad | Detalle |
|------|----------|---------|
| Enums nuevos | 14 | PaymentMethod, PaymentType, CheckStatus, AccountEntryType, CashBoxType, CashBoxStatus, CashBoxSessionStatus, CashBoxUserRole, CreditCardType, CreditCardBrand, CreditCardTransactionType, ClearingStatus, InstallmentStatus, PartyType |
| Modelos nuevos | 22 | employees, partners, bank_accounts, bank_account_movements, cash_boxes, cash_box_sessions, cash_box_balances, cash_box_movements, cash_box_renditions, cash_box_user_roles, cash_box_transfers, payments, payment_documents, checks, credit_cards, credit_card_transactions, credit_card_installments, credit_card_summaries, credit_card_summary_items, current_accounts, current_account_entries |
| Modelos modificados | 3 | business_parties, documents, users |
| Archivos Prisma nuevos | 2 | employees.prisma, treasury.prisma |
| Archivos Prisma modificados | 4 | enums.prisma, parties.prisma, documents.prisma, public.prisma |

---

## Archivos Modificados/Creados

### 1. `prisma/schema/enums.prisma` — +14 enums

```prisma
enum PaymentMethod { CASH, CHECK, BANK_TRANSFER, CREDIT_CARD, DEBIT_CARD, VIRTUAL_WALLET }
enum PaymentType { PAYMENT, COLLECTION }
enum CheckStatus { PENDING, CLEARED, BOUNCED, CANCELLED }
enum AccountEntryType { PAYMENT, COLLECTION, ADVANCE, LOAN, LOAN_PAYMENT, ADJUSTMENT, TRANSFER, CHECK_ISSUED, CHECK_RECEIVED, CHECK_BOUNCED }
enum CashBoxType { MAIN, FIXED, REGISTER }
enum CashBoxStatus { OPEN, CLOSED }
enum CashBoxSessionStatus { OPEN, CLOSED, FORCED }
enum CashBoxUserRole { RESPONSIBLE, OPERATOR, VIEWER }
enum CreditCardType { COMPANY, CUSTOMER }
enum CreditCardBrand { VISA, MASTERCARD, AMEX, NARANJA, CABAL, OTHER }
enum CreditCardTransactionType { PURCHASE, COLLECTION }
enum ClearingStatus { PENDING, CLEARED, FAILED }
enum InstallmentStatus { PENDING, PAID, OVERDUE }
enum PartyType { CUSTOMER, SUPPLIER, EMPLOYEE, PARTNER }
```

### 2. `prisma/schema/employees.prisma` — 2 modelos nuevos

- **`employees`**: Empleados con FK a `business_parties` (datos legales) y `users` (acceso al sistema). Campos: position, department, hire_date, salary, currency_code.
- **`partners`**: Socios con FK a `business_parties` y `users`. Campos: share_percentage, capital_contributed.

### 3. `prisma/schema/treasury.prisma` — 20 modelos nuevos

| Modelo | Descripción |
|--------|-------------|
| `bank_accounts` | Cuentas bancarias de la empresa (una moneda por cuenta) |
| `bank_account_movements` | Movimientos bancarios (entradas/salidas) |
| `cash_boxes` | Cajas (principal, chica, registradora) con soporte multi-moneda |
| `cash_box_sessions` | Sesiones de caja (apertura/cierre/forzado) |
| `cash_box_balances` | Saldos por moneda en cajas (una fila por moneda) |
| `cash_box_movements` | Movimientos de caja por sesión |
| `cash_box_renditions` | Rendiciones periódicas de cajas chicas |
| `cash_box_user_roles` | Roles de usuario por caja (RESPONSIBLE/OPERATOR/VIEWER) |
| `cash_box_transfers` | Transferencias entre cajas y/o cuentas bancarias |
| `payments` | Pagos (salidas) y cobros (entradas) con multi-moneda |
| `payment_documents` | Vínculo pago-factura (cuánto se aplicó a cada documento) |
| `checks` | Cheques propios y de terceros con flujo híbrido |
| `credit_cards` | Tarjetas de crédito (empresariales y de clientes) |
| `credit_card_transactions` | Transacciones con tarjeta (compras/cobros) |
| `credit_card_installments` | Cuotas individuales de transacciones |
| `credit_card_summaries` | Resúmenes mensuales de tarjeta |
| `credit_card_summary_items` | Detalle del resumen (qué cuotas se pagan este mes) |
| `current_accounts` | Cuentas corrientes para terceros (libro mayor) |
| `current_account_entries` | Asientos del libro mayor |

### 4. `prisma/schema/parties.prisma` — business_parties modificado

```diff
- type  String  @db.VarChar(20)
+ type  PartyType
```

### 5. `prisma/schema/documents.prisma` — documents modificado

```diff
+ paid_amount  Decimal  @default(0) @db.Decimal(15, 2)
+ payment_documents payment_documents[]
```

### 6. `prisma/schema/public.prisma` — users modificado

```diff
+ employee_id  String?  @db.Uuid
+ partner_id   String?  @db.Uuid
```

**Arquitectura Multi-DB**: `public.users` y `tenant.employees/partners` están en **bases de datos separadas**. No hay relaciones Prisma entre ellas — solo coincidencia de UUIDs. La resolución cross-DB se hace en la capa de servicio usando `getDefaultClient()` (public) y `getClientForCurrentContext()` (tenant).

---

## Relaciones Principales

### Dentro del schema tenant (relaciones Prisma válidas)

```
business_parties (tenant)
  ├── employees[] ← employees.party_id
  ├── partners[]  ← partners.party_id
  ├── payments[]  ← payments.party_id
  ├── credit_cards[] ← credit_cards.party_id
  └── current_accounts[] ← current_accounts.party_id

cash_boxes
  ├── current_session → cash_box_sessions
  ├── sessions[] → cash_box_sessions
  ├── balances[] → cash_box_balances
  ├── movements[] → cash_box_movements
  ├── renditions[] → cash_box_renditions
  ├── user_roles[] → cash_box_user_roles
  └── payments[] → payments

payments
  ├── party → business_parties
  ├── bank_account → bank_accounts
  ├── cash_box → cash_boxes
  ├── documents[] → payment_documents
  ├── checks[] → checks
  ├── credit_card_transactions[] → credit_card_transactions
  ├── account_entries[] → current_account_entries
  ├── bank_account_movements[] → bank_account_movements
  └── cash_box_movements[] → cash_box_movements
```

### Cross-DB: public ↔ tenant (resolución manual)

```
users (public DB)
  ├── employee_id → employees.id (tenant DB)  ← UUID lógico, sin FK
  └── partner_id  → partners.id (tenant DB)   ← UUID lógico, sin FK

employees (tenant DB)
  └── user_id → users.id (public DB)  ← UUID lógico, sin FK

partners (tenant DB)
  └── user_id → users.id (public DB)  ← UUID lógico, sin FK
```

**Resolución en código**: `getDefaultClient()` → public, `getClientForCurrentContext()` → tenant.

---

## Migración SQL Aplicada

Se generó y ejecutó `audit.sql` usando `prisma migrate diff --from-config-datasource` contra `dev_db`.

### Datos migrados en `business_parties.type`:

```sql
-- Conversión de valores existentes (String → PartyType enum)
UPDATE "tenant"."business_parties" SET "type" = 'CUSTOMER' WHERE LOWER("type") = 'client' OR "type" IS NULL;
UPDATE "tenant"."business_parties" SET "type" = 'SUPPLIER' WHERE LOWER("type") = 'supplier';
UPDATE "tenant"."business_parties" SET "type" = 'CUSTOMER' WHERE "type" NOT IN ('CUSTOMER', 'SUPPLIER', 'EMPLOYEE', 'PARTNER');
```

### Resultado: 19 filas → CUSTOMER, 59 filas → SUPPLIER (78 total en dev_db)

---

## Verificación

- [x] 14 enums creados con `@@schema("tenant")`
- [x] 22 modelos creados con campos estándar (UUID, soft delete, audit)
- [x] `business_parties.type` cambiado a `PartyType` enum
- [x] `documents.paid_amount` agregado
- [x] `users.employee_id` y `users.partner_id` agregados (UUIDs lógicos, sin FK cross-DB)
- [x] Sin relaciones Prisma cross-DB (resolución manual en services)
- [x] Todas las relaciones tenant definidas (sin ambigüedades)
- [x] `prisma validate` → ✅
- [x] `prisma generate` → ✅ Generated Prisma Client
- [x] Migración SQL ejecutada en `dev_db`
- [x] Datos existentes migrados (client→CUSTOMER, supplier→SUPPLIER)

---

## Notas

- Se usó `prisma migrate diff --from-config-datasource` en lugar de `prisma migrate dev` (removido en Prisma 7.x)
- Se creó `prisma/config-datasource-pg.ts` para apuntar al tenant específico durante la generación del SQL
- El `.env` temporalmente apuntó a `dev_db`; luego se restauró a `asterisksuite`
