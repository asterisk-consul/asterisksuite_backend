# Fase 3: Reportes de Pagos — Documentación

**Fecha:** 2026-07-12
**Estado:** Completado
**Epic:** Módulo de Tesorería (AS-281)
**Subtareas cubiertas:** T-3.30–T-3.33

---

## Objetivo

Implementar reportes de pagos para visualización de actividades por usuario, caja y banco en un período determinado.

---

## Archivos Creados

### PaymentReports — `src/modules/erp/payment-reports/`

| Archivo | Descripción |
|---------|-------------|
| `payment-reports.module.ts` | Módulo NestJS con providers y exports |
| `payment-reports.controller.ts` | Controller con 4 endpoints de reportes |
| `payment-reports.service.ts` | Service con lógica de agregación y agrupación |
| `dto/query-payment-report.dto.ts` | DTO: date_from, date_to, created_by, currency_code, cash_box_id, bank_account_id, date |

---

## Endpoints

### Payment Reports — `/api/erp/payment-reports`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/erp/payment-reports/by-user` | Pagos por usuario/día con totales por método |
| `GET` | `/api/erp/payment-reports/cash-box-daily` | Reporte diario de caja con sesión y movimientos |
| `GET` | `/api/erp/payment-reports/bank-daily` | Reporte diario de banco con saldos |
| `GET` | `/api/erp/payment-reports/daily-summary` | Dashboard consolidado del día |

---

## Lógica de Reportes

### Reporte 1: Pagos por usuario/día (`by-user`)

**Parámetros:**
- `date_from` (requerido) — Fecha inicio
- `date_to` (requerido) — Fecha fin
- `created_by` (opcional) — Filtrar por usuario específico
- `currency_code` (opcional) — Filtrar por moneda

**Respuesta:**
```json
{
  "date_from": "2026-07-12T00:00:00.000Z",
  "date_to": "2026-07-12T23:59:59.999Z",
  "total_users": 2,
  "total_payments": 5,
  "users": [
    {
      "user_id": "uuid",
      "user_name": "Juan Pérez",
      "total_collections": 15000,
      "total_payments": 5000,
      "net": 10000,
      "count": 3,
      "by_method": { "CASH": 10000, "BANK_TRANSFER": 5000 },
      "details": [...]
    }
  ]
}
```

### Reporte 2: Reporte diario de caja (`cash-box-daily`)

**Parámetros:**
- `cash_box_id` (requerido) — ID de la caja
- `date` (opcional, default: hoy) — Fecha del reporte

**Respuesta:**
```json
{
  "cash_box_id": "uuid",
  "date": "2026-07-12T00:00:00.000Z",
  "session": { "id": "uuid", "status": "OPEN", "opening_balance": 50000 },
  "total_income": 15000,
  "total_expenses": 10000,
  "net": 5000,
  "movement_count": 4,
  "by_type": { "COLLECTION": 15000, "PAYMENT": 10000 },
  "by_user": [
    { "user_name": "Juan", "income": 10000, "expenses": 5000, "count": 2 }
  ]
}
```

### Reporte 3: Reporte diario de banco (`bank-daily`)

**Parámetros:**
- `bank_account_id` (requerido) — ID de la cuenta bancaria
- `date` (opcional, default: hoy) — Fecha del reporte

**Respuesta:**
```json
{
  "bank_account_id": "uuid",
  "bank_name": "Banco Nación",
  "date": "2026-07-12T00:00:00.000Z",
  "opening_balance": 100000,
  "total_inflows": 5000,
  "total_outflows": 0,
  "net": 5000,
  "closing_balance": 105000,
  "movement_count": 1,
  "by_type": { "COLLECTION": 5000 },
  "movements": [...]
}
```

### Reporte 4: Dashboard diario completo (`daily-summary`)

**Parámetros:**
- `date` (opcional, default: hoy) — Fecha del reporte
- `currency_code` (opcional) — Filtrar por moneda

**Respuesta:**
```json
{
  "date": "2026-07-12T00:00:00.000Z",
  "total_collections": 50000,
  "total_payments": 30000,
  "net": 20000,
  "total_transactions": 8,
  "by_method": { "CASH": 30000, "BANK_TRANSFER": 20000 },
  "by_user": [
    { "user_name": "Juan", "collections": 25000, "payments": 10000, "count": 4 }
  ],
  "by_cash_box": [{ "cash_box_id": "uuid", "collections": 20000, "payments": 10000 }],
  "by_bank_account": [{ "bank_account_id": "uuid", "collections": 30000, "payments": 20000 }]
}
```

---

## Integración Cross-Module

Los reportes consultan:

| Tabla | Uso |
|-------|-----|
| `payments` | Fuente principal de datos (filtros por fecha, usuario, moneda) |
| `cash_box_movements` | Movimientos de caja para reporte diario de caja |
| `cash_box_sessions` | Sesión del día para el reporte de caja |
| `bank_account_movements` | Movimientos bancarios para reporte diario de banco |
| `bank_accounts` | Datos de la cuenta bancaria (saldo actual) |
| `public.users` | Nombres de usuarios (cross-DB) |

---

## Archivos REST Client (.http)

| Archivo | Requests | Descripción |
|---------|----------|-------------|
| `https/erp/payment-reports.http` | 10 | 4 reportes con múltiples variantes de prueba |

---

## Verificación

- [x] PaymentReports: module, controller (4 endpoints), service
- [x] DTOs de consulta con validación
- [x] Registrado en `erp.modules.ts`
- [x] `.http` file con endpoints de verificación
- [x] `tsc --noEmit` → ✅ Sin errores
