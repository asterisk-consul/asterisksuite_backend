# Fase 2: Implementación Módulo Tesorería — Documentación

**Fecha:** 2026-07-11
**Estado:** Completado (parcial — Checks pendiente)
**Epic:** Módulo de Tesorería (AS-278 / AS-279 / AS-281 / AS-284 / AS-285)
**Subtareas cubiertas:** T-2.1 a T-2.29, T-4.7–T-4.10 (parcial), T-5.4–T-5.7, T-7.8–T-7.11, T-8.8–T-8.9

---

## Objetivo

Implementar los módulos CRUD y lógica de negocio del **Módulo de Tesorería**: Empleados, Socios, Cajas, Movimientos de Caja, Rendiciones, Transferencias entre Cajas, Pagos, Cuentas Bancarias, Cuentas Corrientes, y el módulo paraguas TesoreriaModule.

### Arquitectura Multi-DB

- `public.users` → base de datos compartida (`asterisksuite`)
- `tenant.*` → base de datos de la empresa (`dev_db`)
- **Sin relaciones Prisma cross-DB** — solo coincidencia de UUIDs
- Resolución manual en services: `getDefaultClient()` (public) + `getClientForCurrentContext()` (tenant)

---

## Archivos Creados / Modificados

### Employees — `src/modules/erp/employees/`

| Archivo | Descripción |
|---------|-------------|
| `employees.module.ts` | Módulo NestJS con providers y exports |
| `employees.controller.ts` | Controller con 8 endpoints (CRUD + link/unlink) |
| `employees.service.ts` | Service con CRUD + business_party auto-create + validación tipo + duplicados + cross-DB |
| `dto/create-employee.dto.ts` | DTO de creación con `create_user` opcional |
| `dto/update-employee.dto.ts` | DTO de actualización (PartialType) |
| `dto/create-user.dto.ts` | DTO para crear usuario desde employee |
| `dto/link-user.dto.ts` | DTO para vincular usuario existente |

### Partners — `src/modules/erp/partners/`

| Archivo | Descripción |
|---------|-------------|
| `partners.module.ts` | Módulo NestJS con providers y exports |
| `partners.controller.ts` | Controller con 8 endpoints (CRUD + link/unlink) |
| `partners.service.ts` | Service con CRUD + business_party auto-create + validación tipo + duplicados + cross-DB |
| `dto/create-partner.dto.ts` | DTO de creación con `create_user` opcional |
| `dto/update-partner.dto.ts` | DTO de actualización (PartialType) |

### CashBoxes — `src/modules/logistica/cash-boxes/`

| Archivo | Descripción |
|---------|-------------|
| `cash-boxes.module.ts` | Módulo NestJS con providers y exports |
| `cash-boxes.controller.ts` | Controller con 12 endpoints (CRUD + sessions + balances) |
| `cash-boxes.service.ts` | Service con CRUD + sesiones + balances + cierre forzado |
| `dto/create-cash-box.dto.ts` | DTO: name, type, responsible_id, opening_balance, max_limit, is_main |
| `dto/update-cash-box.dto.ts` | DTO de actualización |
| `dto/open-session.dto.ts` | DTO: opening_balance |
| `dto/close-session.dto.ts` | DTO: actual_balance |
| `dto/force-close-session.dto.ts` | DTO: actual_balance, reason |

### Cash Box Movements — `src/modules/logistica/cash-box-movements/`

| Archivo | Descripción |
|---------|-------------|
| `cash-box-movements.module.ts` | Módulo NestJS |
| `cash-box-movements.controller.ts` | Controller con 5 endpoints (CRUD + filtros) |
| `cash-box-movements.service.ts` | Service con creación + validación saldo + actualización sesión/balance |
| `dto/create-cash-box-movement.dto.ts` | DTO: cash_box_id, type, amount, currency_code, description, etc. |
| `dto/update-cash-box-movement.dto.ts` | DTO de actualización |
| `dto/filter-cash-box-movement.dto.ts` | DTO de filtros: cash_box_id, session_id, type, date_from/to |

### Cash Box Renditions — `src/modules/logistica/cash-box-renditions/`

| Archivo | Descripción |
|---------|-------------|
| `cash-box-renditions.module.ts` | Módulo NestJS |
| `cash-box-renditions.controller.ts` | Controller con 6 endpoints (CRUD + approve + reject) |
| `cash-box-renditions.service.ts` | Service con generación automática + aprobación/rechazo |
| `dto/create-cash-box-rendition.dto.ts` | DTO: cash_box_id, start_date, end_date, opening_balance, etc. |
| `dto/approve-rendition.dto.ts` | DTO: actual_balance, notes |

### Cash Box Transfers — `src/modules/logistica/cash-box-transfers/`

| Archivo | Descripción |
|---------|-------------|
| `cash-box-transfers.module.ts` | Módulo NestJS |
| `cash-box-transfers.controller.ts` | Controller con 6 endpoints (CRUD + confirm + cancel) |
| `cash-box-transfers.service.ts` | Service con transferencia + validación saldo + ejecución |
| `dto/create-cash-box-transfer.dto.ts` | DTO: source/dest (type+id), amount, currency_code, transfer_type |

### Payments — `src/modules/erp/payments/`

| Archivo | Descripción |
|---------|-------------|
| `payments.module.ts` | Módulo NestJS |
| `payments.controller.ts` | Controller con 6 endpoints (CRUD + reverse) |
| `payments.service.ts` | Service con creación + aplicación a documentos + movimientos caja/banco |
| `dto/create-payment.dto.ts` | DTO: type, payment_method, amount, currency_code, documents[], etc. |
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

### Guards — `src/common/guards/`

| Archivo | Descripción |
|---------|-------------|
| `cash-box-access.guard.ts` | Verifica rol de usuario en caja (RESPONSIBLE, OPERATOR, VIEWER) |
| `cash-box-session.guard.ts` | Verifica quién abrió sesión para escritura; force-close requiere RESPONSIBLE |

### TesoreriaModule — `src/modules/erp/tesoreria/`

| Archivo | Descripción |
|---------|-------------|
| `tesoreria.module.ts` | Módulo paraguas que importa/exporta todos los sub-módulos de tesorería |

### Audit — `src/modules/erp/audit/`

| Archivo | Descripción |
|---------|-------------|
| `audit.module.ts` | Módulo NestJS |
| `audit.controller.ts` | Controller con 4 endpoints (list, stats, byUser, byTableRecord) |
| `audit.service.ts` | Service con queries cross-DB a `public.audit_logs` |
| `dto/query-audit.dto.ts` | DTO de filtros: table, userId, action, date range |

### Modificados

| Archivo | Cambio |
|---------|--------|
| `src/modules/erp/erp.modules.ts` | Import/export de Employees, Partners, Audit, Payments, BankAccounts, CurrentAccounts |
| `src/modules/logistica/logistica.module.ts` | Import/export de CashBoxes, CashBoxMovements, CashBoxRenditions, CashBoxTransfers |
| `src/modules/modules.module.ts` | Import/export de TesoreriaModule |
| `src/auth/dto/register.dto.ts` | Agregados `link_employee_id` y `link_partner_id` |
| `src/auth/auth.service.ts` | Register vincula employee/partner si se solicita |
| `src/modules/master-data/business-parties/dto/create-business-party.dto.ts` | `type` cambiado a `@IsEnum(PartyType)` |

---

## Endpoints

### Employees — `/api/erp/employees`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/erp/employees` | Crear empleado (opcional: `user_id` o `create_user`) |
| `GET` | `/api/erp/employees` | Listar todos |
| `GET` | `/api/erp/employees/:id` | Obtener uno (con user resuelto cross-DB) |
| `PATCH` | `/api/erp/employees/:id` | Actualizar |
| `PATCH` | `/api/erp/employees/:id/link-user` | Vincular con user existente |
| `PATCH` | `/api/erp/employees/:id/unlink-user` | Desvincular user |
| `DELETE` | `/api/erp/employees/:id` | Soft delete |

### Partners — `/api/erp/partners`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/erp/partners` | Crear socio (opcional: `user_id` o `create_user`) |
| `GET` | `/api/erp/partners` | Listar todos |
| `GET` | `/api/erp/partners/:id` | Obtener uno (con user resuelto cross-DB) |
| `PATCH` | `/api/erp/partners/:id` | Actualizar |
| `PATCH` | `/api/erp/partners/:id/link-user` | Vincular con user existente |
| `PATCH` | `/api/erp/partners/:id/unlink-user` | Desvincular user |
| `DELETE` | `/api/erp/partners/:id` | Soft delete |

### CashBoxes — `/api/logistica/cash-boxes`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/logistica/cash-boxes` | Crear caja |
| `GET` | `/api/logistica/cash-boxes` | Listar todas |
| `GET` | `/api/logistica/cash-boxes/main` | Obtener caja principal |
| `GET` | `/api/logistica/cash-boxes/:id` | Obtener una |
| `PATCH` | `/api/logistica/cash-boxes/:id` | Actualizar |
| `DELETE` | `/api/logistica/cash-boxes/:id` | Soft delete |
| `GET` | `/api/logistica/cash-boxes/:id/balances` | Saldos por moneda |
| `POST` | `/api/logistica/cash-boxes/:id/open` | Abrir sesión |
| `POST` | `/api/logistica/cash-boxes/:id/close` | Cerrar sesión |
| `POST` | `/api/logistica/cash-boxes/:id/force-close` | Forzar cierre |
| `GET` | `/api/logistica/cash-boxes/:id/session` | Sesión actual |
| `GET` | `/api/logistica/cash-boxes/:id/sessions` | Historial de sesiones |

### Cash Box Movements — `/api/logistica/cash-box-movements`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/logistica/cash-box-movements` | Crear movimiento (valida saldo, actualiza sesión) |
| `GET` | `/api/logistica/cash-box-movements` | Listar (filtros: cash_box_id, type, date_from/to) |
| `GET` | `/api/logistica/cash-box-movements/:id` | Obtener uno |
| `PATCH` | `/api/logistica/cash-box-movements/:id` | Actualizar |
| `DELETE` | `/api/logistica/cash-box-movements/:id` | Soft delete |

### Cash Box Renditions — `/api/logistica/cash-box-renditions`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/logistica/cash-box-renditions` | Crear rendición (calcula totales automáticamente) |
| `GET` | `/api/logistica/cash-box-renditions` | Listar (filtro: cash_box_id) |
| `GET` | `/api/logistica/cash-box-renditions/:id` | Obtener una |
| `PATCH` | `/api/logistica/cash-box-renditions/:id/approve` | Aprobar |
| `PATCH` | `/api/logistica/cash-box-renditions/:id/reject` | Rechazar |
| `DELETE` | `/api/logistica/cash-box-renditions/:id` | Soft delete |

### Cash Box Transfers — `/api/logistica/cash-box-transfers`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/logistica/cash-box-transfers` | Crear transferencia |
| `GET` | `/api/logistica/cash-box-transfers` | Listar (filtros: source/dest, status) |
| `GET` | `/api/logistica/cash-box-transfers/:id` | Obtener una |
| `PATCH` | `/api/logistica/cash-box-transfers/:id/confirm` | Confirmar (ejecuta movimientos) |
| `PATCH` | `/api/logistica/cash-box-transfers/:id/cancel` | Cancelar |
| `DELETE` | `/api/logistica/cash-box-transfers/:id` | Soft delete |

### Payments — `/api/erp/payments`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/erp/payments` | Crear pago (aplica documentos, crea movimientos) |
| `GET` | `/api/erp/payments` | Listar (filtros: party_id, type, payment_method) |
| `GET` | `/api/erp/payments/:id` | Obtener uno |
| `PATCH` | `/api/erp/payments/:id` | Actualizar (solo borrador) |
| `DELETE` | `/api/erp/payments/:id` | Soft delete (revert applied amounts) |
| `POST` | `/api/erp/payments/:id/reverse` | Reversar pago |

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

### Audit — `/api/erp/audit`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/erp/audit` | Listar logs (filtros: table, userId, action, date range) |
| `GET` | `/api/erp/audit/stats` | Estadísticas de actividad |
| `GET` | `/api/erp/audit/user/:userId` | Logs por usuario |
| `GET` | `/api/erp/audit/:table/:recordId` | Logs de un registro específico |

### Auth — `/api/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Crear user (opcional: `link_employee_id` / `link_partner_id` con x-tenant) |

---

## Integración con Business Parties

### Auto-creación de `business_parties`

Cuando se crea un Employee o Partner **sin `party_id`**, se crea automáticamente un registro en `business_parties`:

| Caso | `type` | `name` | `tax_id` |
|------|--------|--------|----------|
| Employee sin `party_id` | `EMPLOYEE` | `{first_name} {last_name}` | `document_number` |
| Partner sin `party_id` | `PARTNER` | `{first_name} {last_name}` | `document_number` |

### Validación de tipo al proveer `party_id`

Si se provee `party_id` explicitamente, se valida que el `type` del `business_party` coincida:

| Endpoint | `party_id` esperado | Error si tipo no coincide |
|----------|---------------------|---------------------------|
| `POST /erp/employees` | `type: 'EMPLOYEE'` | `tipo "SUPPLIER", se esperaba "EMPLOYEE"` |
| `POST /erp/partners` | `type: 'PARTNER'` | `tipo "CUSTOMER", se esperaba "PARTNER"` |

### Validación de duplicados

Se valida `document_type + document_number` en **create** y **update** (excluyendo registros eliminados):

| Operación | Consulta | Error |
|-----------|----------|-------|
| `create` | `findFirst({ document_type, document_number, deleted_at: null })` | `Ya existe un empleado con DNI 12345678` |
| `update` | `findFirst({ document_type, document_number, deleted_at: null, NOT: { id } })` | `Ya existe un socio con CUIT 20-12345678-9` |

### Flujo desde el frontend

```
Flujo A: Crear desde Business Parties (front crea party primero)
  1. POST /master-data/business-parties { type: "EMPLOYEE", name: "Juan Pérez" }
     → Retorna party.id
  2. POST /erp/employees { party_id: "party.id", first_name: "Juan", ... }
     → Valida que party.type === "EMPLOYEE" ✅
     → Crea employee vinculado al party existente

Flujo B: Crear directo (front crea employee/socio directamente)
  1. POST /erp/employees { first_name: "Juan", last_name: "Pérez", ... }
     → Auto-crea business_parties con type: "EMPLOYEE"
     → Crea employee vinculado al party creado
```

### Errores posibles

| Scenario | Error |
|----------|-------|
| `party_id` no existe | `NotFoundException: business_party no encontrado` |
| `party_id` tiene tipo incorrecto | `BadRequestException: tipo "SUPPLIER", se esperaba "EMPLOYEE"` |
| `document_type + document_number` ya existe | `BadRequestException: Ya existe un empleado con DNI 12345678` |
| `user_id` y `create_user` ambos enviados | `BadRequestException: No se puede enviar user_id y create_user al mismo tiempo` |

---

## Vinculación Employee/Partner ↔ User

### Flujo bidireccional

```
Opción A: Crear Employee/Partner → crear user nuevo
  POST /erp/employees { "create_user": { "email": "...", "password": "..." } }
  → Crea user en public.users
  → Crea employee en tenant.employees
  → Actualiza bidireccionalmente: employee.user_id ↔ users.employee_id

Opción B: Crear Employee/Partner → vincular user existente
  POST /erp/employees { "user_id": "uuid" }
  → Crea employee en tenant.employees
  → Actualiza bidireccionalmente: employee.user_id ↔ users.employee_id

Opción C: Cambiar vínculo después
  PATCH /erp/employees/:id/link-user { "user_id": "uuid" }
  → Desvincula user anterior (si existe)
  → Vincula nuevo user bidireccionalmente

Opción D: Desvincular
  PATCH /erp/employees/:id/unlink-user
  → Limpia employee.user_id y users.employee_id

Opción E: Crear user y vincular desde register
  POST /auth/register { "email": "...", "link_employee_id": "uuid" }
  → Requiere header x-tenant para resolver tenant context
```

### Validaciones

- No se puede enviar `user_id` y `create_user` al mismo tiempo
- `create_user.email` debe ser único en public.users
- `user_id` debe existir en public.users
- Al vincular, se desvincula el user anterior automáticamente
- Al desvincular, se limpian ambos lados (employee y user)

---

## Guards

### CashBoxAccessGuard

- Verifica rol del usuario en la caja (`cash_box_user_roles`)
- OWNER siempre pasa
- Sin rol asignado → `ForbiddenException`
- Adjunta `cashBoxRole` al request

### CashBoxSessionGuard

- GET siempre permitido
- Escritura: solo quien abrió la sesión puede escribir
- Force-close: solo usuarios con rol `RESPONSIBLE`
- OWNER siempre pasa

---

## Archivos REST Client (.http)

| Archivo | Módulo | Requests |
|---------|--------|----------|
| `https/erp/employees.http` | Employees | 11 (CRUD + link/unlink) |
| `https/erp/partners.http` | Partners | 11 (CRUD + link/unlink) |
| `https/erp/audit.http` | Audit | 8 (list, stats, byUser, byTable) |
| `https/logistica/cash-boxes.http` | CashBoxes | 14 (CRUD + sessions + balances) |
| `https/logistica/cash-box-movements.http` | Movements | 11 (CRUD + filtros) |
| `https/logistica/cash-box-renditions.http` | Renditions | 8 (CRUD + approve/reject) |
| `https/logistica/cash-box-transfers.http` | Transfers | 9 (CRUD + confirm/cancel) |
| `https/erp/payments.http` | Payments | 10 (CRUD + reverse) |
| `https/erp/bank-accounts.http` | BankAccounts | 7 (CRUD + movements) |
| `https/erp/current-accounts.http` | CurrentAccounts | 7 (entries, statement, balance) |

**Uso**: Todos incluyen `@name login` para obtener JWT y `x-tenant: dev`. Reemplazar IDs placeholder con datos reales.

---

## Modelos Prisma Relacionados

### Tenant (en `prisma/schema/treasury.prisma`)

- `bank_accounts` — Cuentas bancarias
- `bank_account_movements` — Movimientos bancarios
- `cash_boxes` — Cajas
- `cash_box_sessions` — Sesiones de caja
- `cash_box_balances` — Saldos por moneda
- `cash_box_movements` — Movimientos de caja
- `cash_box_renditions` — Rendiciones
- `cash_box_user_roles` — Asignación usuario↔caja
- `cash_box_transfers` — Transferencias entre cajas
- `payments` — Pagos y cobros
- `payment_documents` — Aplicación de pagos a documentos
- `current_accounts` — Cuentas corrientes de terceros
- `current_account_entries` — Asientos de cuenta corriente
- `credit_cards` — Tarjetas de crédito
- `credit_card_transactions` — Transacciones de tarjeta
- `credit_card_installments` — Cuotas de tarjeta
- `credit_card_summaries` — Resúmenes mensuales

### Tenant (en `prisma/schema/employees.prisma`)

- `employees` — Empleados
- `partners` — Socios

---

## Verificación

- [x] Employees: module, controller (8 endpoints), service, DTOs
- [x] Partners: module, controller (8 endpoints), service, DTOs
- [x] Employees: auto-creación de `business_parties` con `type: 'EMPLOYEE'` si no se provee `party_id`
- [x] Partners: auto-creación de `business_parties` con `type: 'PARTNER'` si no se provee `party_id`
- [x] Employees: validación de `party.type === 'EMPLOYEE'` al proveer `party_id`
- [x] Partners: validación de `party.type === 'PARTNER'` al proveer `party_id`
- [x] Employees: validación de duplicados `document_type + document_number` en create/update
- [x] Partners: validación de duplicados `document_type + document_number` en create/update
- [x] CashBoxes: module, controller (12 endpoints), service (CRUD + sessions + balances + force-close)
- [x] CashBoxMovements: module, controller (5 endpoints), service (creación + validación + balance)
- [x] CashBoxRenditions: module, controller (6 endpoints), service (generación + approve/reject)
- [x] CashBoxTransfers: module, controller (6 endpoints), service (validación + ejecución)
- [x] Payments: module, controller (6 endpoints), service (creación + documentos + movimientos)
- [x] BankAccounts: module, controller (6 endpoints), service
- [x] CurrentAccounts: module, controller (5 endpoints), service
- [x] CashBoxAccessGuard + CashBoxSessionGuard
- [x] TesoreriaModule (módulo paraguas)
- [x] AuditModule (list, stats, byUser, byRecord)
- [x] Registrados en `erp.modules.ts`, `logistica.module.ts`, `modules.module.ts`
- [x] Auth register con `link_employee_id`/`link_partner_id`
- [x] Todos los `.http` files con `x-tenant` header
- [x] `tsc --noEmit` → ✅ Sin errores

---

## Próximos Pasos

1. **T-4.7–T-4.10**: Módulo Checks (cheques propios y de terceros)
2. **T-5.1–T-5.3**: Schedulers de cheques (notificación + procesamiento)
3. **T-6.x**: Módulo CreditCards (tarjetas de crédito)
4. **T-7.x**: CreditCardTransactions + Summaries
5. **T-8.6–T-8.7**: RBAC seed (permisos + roles)
6. **Activar RBAC**: Uncomment `@RequirePermissions` en controllers
