# MÓDULO DE TESORERÍA COMPLETO - Plan de Implementación

## Visión General

Sistema completo de gestión de tesorería para Asterisk Suite que cubre:
- **4 métodos de pago**: Efectivo, Cheques, Cuentas Bancarias/Billeteras, Tarjeta de Crédito
- **Cajas Chicas**: Fondos fijos con control de rendición y responsables
- **Cuentas Corrientes**: Libro mayor para clientes, proveedores, empleados y socios
- **Empleados y Socios**: Modelos separados con vínculo opcional a usuarios del sistema
- **Integración con Facturas**: Tracking de saldos pendientes y pagos parciales

---

## Arquitectura General

### Stack Tecnológico
- **Framework**: NestJS v11
- **ORM**: Prisma v7
- **Base de datos**: PostgreSQL (multi-tenant)
- **Auth**: JWT con RBAC

### Principios de Diseño
1. **Multi-tenancy**: Todos los modelos en `@@schema("tenant")`
2. **Soft delete**: `deleted_at`, `deleted_by` en todos los modelos
3. **Auditoría**: `created_by`, `updated_by` en todos los modelos
4. **UUIDs**: Todos los IDs son UUID v4
5. **Decimales**: Montos `Decimal(15, 2)`, tipos de cambio `Decimal(18, 6)`
6. **Multi-Moneda**: Una moneda por entidad financiera, con conversión y visualización flexible

### Multi-Moneda

**Regla principal**: Cada entidad financiera opera en UNA moneda, pero permite
visualización en otra moneda usando el tipo de cambio registrado.

**Flujo**:
1. Se registra el pago en la moneda original (USD, EUR, etc.)
2. Se obtiene el tipo de cambio del día de `currency_rates` (auto-sync) o el usuario ingresa uno manual
3. Se guarda el monto convertido en la moneda del documento/proveedor
4. El libro mayor siempre muestra en la moneda del tercero
5. El frontend puede solicitar `?display_currency=ARS` para mostrar el equivalente

**Tipo de cambio**:
- Automático: sistema trae tasas del día de `currency_rates` (OFFICIAL, BLUE, MEP, CCL, etc.)
- Manual: el usuario ingresa la tasa que le conviene
- Se guarda el valor numérico en `exchange_rate` y el tipo en `rate_type`
- Si `rate_type` es `null` → fue ingreso manual

**Entidades y monedas**:
- `bank_accounts`: una moneda por cuenta bancaria
- `cash_boxes`: bimonetárias con saldos separados por moneda (`cash_box_balances`)
- `current_accounts`: una fila por tercero por moneda (libro mayor en moneda del tercero)
- `payments`: se registra en moneda original + conversión a moneda del documento

---

## Parte 1: Enums Nuevos

```prisma
// prisma/schema/enums.prisma - Agregar:

// Métodos de pago
enum PaymentMethod {
  CASH            // Efectivo
  CHECK           // Cheque
  BANK_TRANSFER   // Transferencia bancaria
  CREDIT_CARD     // Tarjeta de crédito
  DEBIT_CARD      // Tarjeta de débito
  VIRTUAL_WALLET  // Billetera virtual (MercadoPago, Ualá, etc.)
}

// Tipo de movimiento de dinero
enum PaymentType {
  PAYMENT    // Pago (salida - compra)
  COLLECTION // Cobro (entrada - venta)
}

// Estados de cheque
enum CheckStatus {
  PENDING    // Pendiente
  CLEARED    // Cobrado/compensado
  BOUNCED    // Rechazado
  CANCELLED  // Anulado
}

// Tipos de movimiento en cuenta corriente
enum AccountEntryType {
  PAYMENT      // Pago realizado
  COLLECTION   // Cobro recibido
  ADVANCE      // Adelanto
  LOAN         // Préstamo otorgado
  LOAN_PAYMENT // Devolución de préstamo
  ADJUSTMENT   // Ajuste manual
  TRANSFER     // Transferencia entre cuentas
  CHECK_ISSUED   // Cheque emitido
  CHECK_RECEIVED // Cheque recibido
  CHECK_BOUNCED  // Cheque rechazado
}

// Tipos de caja
enum CashBoxType {
  MAIN      // Caja principal
  FIXED     // Caja chica (fondo fijo)
  REGISTER  // Caja registradora
}

// Estados de caja
enum CashBoxStatus {
  OPEN    // Abierta
  CLOSED  // Cerrada
}

// Estados de sesión de caja
enum CashBoxSessionStatus {
  OPEN      // Sesión abierta
  CLOSED    // Cerrada normalmente
  FORCED    // Cerrada por el sistema/forzada
}

// Roles de caja
enum CashBoxUserRole {
  RESPONSIBLE  // Responsable (puede cerrar, rendir)
  OPERATOR     // Operador (puede realizar movimientos)
  VIEWER       // Solo lectura
}

// Tipo de tarjeta de crédito
enum CreditCardType {
  COMPANY    // Tarjeta de la empresa (para pagos)
  CUSTOMER   // Tarjeta del cliente (para cobros)
}

// Marca de tarjeta
enum CreditCardBrand {
  VISA
  MASTERCARD
  AMEX
  NARANJA
  CABAL
  OTHER
}

// Tipo de transacción con tarjeta
enum CreditCardTransactionType {
  PURCHASE    // Compra con tarjeta (salida)
  COLLECTION  // Cobro con tarjeta (entrada)
}

// Estado de acreditación
enum ClearingStatus {
  PENDING     // Esperando acreditación
  CLEARED     // Acreditado
  FAILED      // Falló la acreditación
}

// Estado de cuota
enum InstallmentStatus {
  PENDING     // Cuota pendiente
  PAID        // Cuota pagada
  OVERDUE     // Vencida
}

// Tipo de tercero (business_parties)
enum PartyType {
  CUSTOMER    // Cliente
  SUPPLIER    // Proveedor
  EMPLOYEE    // Empleado
  PARTNER     // Socio
}
```

---

## Parte 2: Modelos Nuevos

### 2.1 `employees` - Empleados

```prisma
// prisma/schema/employees.prisma (NUEVO)

model employees {
  id              String           @id @default(uuid()) @db.Uuid
  party_id        String?          @db.Uuid              // FK business_parties (datos legales)
  user_id         String?          @db.Uuid              // FK users (acceso al sistema, opcional)
  first_name      String           @db.VarChar(100)
  last_name       String           @db.VarChar(100)
  document_type   String?          @db.VarChar(20)       // "DNI", "CUIT", "LC"
  document_number String?          @db.VarChar(20)
  position        String?          @db.VarChar(100)      // Cargo
  department      String?          @db.VarChar(100)      // Departamento
  hire_date       DateTime?        @db.Date
  salary          Decimal?         @db.Decimal(15, 2)
  currency_code   String           @db.VarChar(10)
  is_active       Boolean          @default(true)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  party           business_parties? @relation(fields: [party_id], references: [id])
  user            users?           @relation(fields: [user_id], references: [id])
  cash_boxes      cash_boxes[]     // Cajas donde es responsable
  movements       cash_box_movements[] // Movimientos realizados

  @@index([user_id])
  @@index([party_id])
  @@schema("tenant")
}
```

### 2.2 `partners` - Socios

```prisma
// prisma/schema/partners.prisma (NUEVO)

model partners {
  id                   String           @id @default(uuid()) @db.Uuid
  party_id             String?          @db.Uuid
  user_id              String?          @db.Uuid
  first_name           String           @db.VarChar(100)
  last_name            String           @db.VarChar(100)
  document_type        String?          @db.VarChar(20)
  document_number      String?          @db.VarChar(20)
  share_percentage     Decimal?         @db.Decimal(5, 2)
  capital_contributed  Decimal?         @db.Decimal(15, 2)
  is_active            Boolean          @default(true)
  
  created_at           DateTime         @default(now())
  updated_at           DateTime?        @updatedAt
  deleted_at           DateTime?
  created_by           String?          @db.Uuid
  updated_by           String?          @db.Uuid
  deleted_by           String?          @db.Uuid

  party                business_parties? @relation(fields: [party_id], references: [id])
  user                 users?           @relation(fields: [user_id], references: [id])

  @@index([user_id])
  @@schema("tenant")
}
```

### 2.3 `bank_accounts` - Cuentas Bancarias

```prisma
// prisma/schema/payments.prisma (NUEVO)

model bank_accounts {
  id              String           @id @default(uuid()) @db.Uuid
  name            String           @db.VarChar(100)
  bank_name       String           @db.VarChar(100)
  account_type    String           @db.VarChar(50)       // "checking", "savings", "virtual_wallet"
  cbu             String?          @db.VarChar(30)
  alias           String?          @db.VarChar(50)
  account_number  String?          @db.VarChar(50)
  currency_code   String           @db.VarChar(10)
  balance         Decimal          @default(0) @db.Decimal(15, 2)
  active          Boolean          @default(true)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  payments        payments[]
  movements       bank_account_movements[]

  @@schema("tenant")
}
```

### 2.4 `bank_account_movements` - Movimientos Bancarios

```prisma
model bank_account_movements {
  id              String           @id @default(uuid()) @db.Uuid
  bank_account_id String           @db.Uuid
  type            AccountEntryType
  amount          Decimal          @db.Decimal(15, 2)    // Monto en moneda de la cuenta (positivo=entrada, negativo=salida)
  currency_code   String           @db.VarChar(10)       // Moneda del movimiento
  exchange_rate   Decimal?         @db.Decimal(18, 6)    // Tasa si hubo conversión
  balance_before  Decimal          @db.Decimal(15, 2)    // Saldo antes en esta moneda
  balance_after   Decimal          @db.Decimal(15, 2)    // Saldo después en esta moneda
  description     String?          @db.VarChar(255)
  reference_type  String?          @db.VarChar(50)
  reference_id    String?          @db.Uuid
  payment_id      String?          @db.Uuid
  date            DateTime         @default(now())
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  bank_account    bank_accounts    @relation(fields: [bank_account_id], references: [id])
  payment         payments?        @relation(fields: [payment_id], references: [id])

  @@index([bank_account_id])
  @@index([payment_id])
  @@schema("tenant")
}
```

### 2.5 `cash_boxes` - Cajas

```prisma
model cash_boxes {
  id              String           @id @default(uuid()) @db.Uuid
  name            String           @db.VarChar(100)
  type            CashBoxType      @default(FIXED)
  responsible_id  String?          @db.Uuid              // FK employees
  opening_balance Decimal          @default(0) @db.Decimal(15, 2) // Fondo fijo (monto inicial de referencia)
  max_limit       Decimal?         @db.Decimal(15, 2)
  status          CashBoxStatus    @default(OPEN)
  active          Boolean          @default(true)
  
  // NOTA: current_balance y currency_code ELIMINADOS
  // Los saldos ahora están en cash_box_balances (uno por moneda)
  // Una caja puede ser bimonetaria: tiene filas separadas para USD y ARS
  
  // NUEVOS CAMPOS para control de sesiones
  current_session_id String?       @db.Uuid              // Sesión activa actual
  last_session_closed_at DateTime?                       // Último cierre
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  responsible     employees?       @relation(fields: [responsible_id], references: [id])
  current_session cash_box_sessions? @relation(fields: [current_session_id], references: [id])
  balances        cash_box_balances[] // Saldos por moneda
  movements       cash_box_movements[]
  renditions      cash_box_renditions[]
  user_roles      cash_box_user_roles[]
  sessions        cash_box_sessions[]

  @@schema("tenant")
}
```

### 2.6 `cash_box_sessions` - Sesiones de Caja (NUEVO)

```prisma
model cash_box_sessions {
  id              String           @id @default(uuid()) @db.Uuid
  cash_box_id     String           @db.Uuid
  user_id         String           @db.Uuid              // Quién abrió la sesión
  
  // Apertura
  opened_at       DateTime         @default(now())       // Fecha/hora de apertura
  opening_balance Decimal          @db.Decimal(15, 2)    // Saldo al abrir
  
  // Cierre
  closed_at       DateTime?                             // Fecha/hora de cierre
  closing_balance Decimal?         @db.Decimal(15, 2)    // Saldo al cerrar (teórico)
  actual_balance  Decimal?         @db.Decimal(15, 2)    // Saldo real contado
  difference      Decimal?         @db.Decimal(15, 2)    // Diferencia (actual - teórico)
  
  // Estadísticas del turno
  total_income    Decimal          @default(0) @db.Decimal(15, 2)
  total_expenses  Decimal          @default(0) @db.Decimal(15, 2)
  movement_count  Int              @default(0)
  
  // Estado
  status          CashBoxSessionStatus @default(OPEN)
  
  // Cierre forzado
  force_closed    Boolean          @default(false)
  force_closed_by String?          @db.Uuid              // Quién forzó el cierre
  force_closed_at DateTime?                              // Cuándo se forzó
  force_close_reason String?       @db.VarChar(255)
  
  // Detección de olvido
  overdue_detected Boolean         @default(false)       // Si el scheduler detectó olvido
  overdue_detected_at DateTime?                          // Cuándo se detectó
  overdue_notified Boolean         @default(false)       // Si se notificó al usuario
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  cash_box        cash_boxes       @relation(fields: [cash_box_id], references: [id])
  movements       cash_box_movements[]

  @@index([cash_box_id])
  @@index([user_id])
  @@index([status])
  @@schema("tenant")
}
```

**Campos clave:**
- `user_id`: Quién abrió (solo esa persona puede cerrar/mover)
- `status`: OPEN, CLOSED, FORCED
- `force_closed`: Bandera de cierre forzado
- `force_closed_by`: Quién ejecutó el cierre forzado
- `overdue_detected`: Si el scheduler detectó el olvido

### 2.7 `cash_box_user_roles` - Roles por Caja

```prisma
model cash_box_user_roles {
  id              String           @id @default(uuid()) @db.Uuid
  cash_box_id     String           @db.Uuid
  user_id         String           @db.Uuid
  role            CashBoxUserRole  @default(VIEWER)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  cash_box        cash_boxes       @relation(fields: [cash_box_id], references: [id])

  @@unique([cash_box_id, user_id])
  @@schema("tenant")
}
```

### 2.8 `cash_box_balances` - Saldos por Moneda (NUEVO)

```prisma
// prisma/schema/payments.prisma - NUEVO

model cash_box_balances {
  id              String           @id @default(uuid()) @db.Uuid
  cash_box_id     String           @db.Uuid
  currency_code   String           @db.VarChar(10)
  balance         Decimal          @default(0) @db.Decimal(15, 2)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  cash_box        cash_boxes       @relation(fields: [cash_box_id], references: [id])

  @@unique([cash_box_id, currency_code])
  @@schema("tenant")
}
```

**Nota**: Reemplaza `cash_box.current_balance`. Una caja puede tener saldos en múltiples monedas (USD, ARS, etc.), cada una con su propio registro en esta tabla.

### 2.9 `cash_box_movements` - Movimientos de Caja

```prisma
model cash_box_movements {
  id              String           @id @default(uuid()) @db.Uuid
  cash_box_id     String           @db.Uuid
  session_id      String?          @db.Uuid              // FK a cash_box_sessions
  employee_id     String?          @db.Uuid              // Quién realizó el movimiento
  type            AccountEntryType
  amount          Decimal          @db.Decimal(15, 2)    // Monto en moneda del movimiento
  currency_code   String           @db.VarChar(10)       // Moneda del movimiento
  exchange_rate   Decimal?         @db.Decimal(18, 6)    // Tasa si hubo conversión
  balance_before  Decimal          @db.Decimal(15, 2)    // Saldo antes en esta moneda
  balance_after   Decimal          @db.Decimal(15, 2)    // Saldo después en esta moneda
  description     String?          @db.VarChar(255)
  reference_type  String?          @db.VarChar(50)
  reference_id    String?          @db.Uuid
  payment_id      String?          @db.Uuid
  bank_account_id String?          @db.Uuid              // Si es transferencia
  date            DateTime         @default(now())
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  cash_box        cash_boxes       @relation(fields: [cash_box_id], references: [id])
  session         cash_box_sessions? @relation(fields: [session_id], references: [id])
  employee        employees?       @relation(fields: [employee_id], references: [id])
  payment         payments?        @relation(fields: [payment_id], references: [id])
  bank_account    bank_accounts?   @relation(fields: [bank_account_id], references: [id])

  @@index([cash_box_id])
  @@index([session_id])
  @@index([payment_id])
  @@schema("tenant")
}
```

### 2.9 `cash_box_renditions` - Rendiciones

```prisma
model cash_box_renditions {
  id              String           @id @default(uuid()) @db.Uuid
  cash_box_id     String           @db.Uuid
  rendition_number Int             @db.Int
  start_date      DateTime         @db.Date
  end_date        DateTime         @db.Date
  opening_balance Decimal          @db.Decimal(15, 2)
  total_expenses  Decimal          @default(0) @db.Decimal(15, 2)
  total_income    Decimal          @default(0) @db.Decimal(15, 2)
  closing_balance Decimal          @db.Decimal(15, 2)
  actual_balance  Decimal?         @db.Decimal(15, 2)
  difference      Decimal?         @db.Decimal(15, 2)
  status          String           @default("pending") @db.VarChar(20)
  notes           String?          @db.Text
  approved_by     String?          @db.Uuid
  approved_at     DateTime?
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  cash_box        cash_boxes       @relation(fields: [cash_box_id], references: [id])

  @@index([cash_box_id])
  @@schema("tenant")
}
```

### 2.9 `payments` - Pagos y Cobros

```prisma
model payments {
  id              String           @id @default(uuid()) @db.Uuid
  number          Int
  type            PaymentType
  date            DateTime         @db.Date
  party_id        String?          @db.Uuid              // FK business_parties
  party_type      String?          @db.VarChar(20)       // "client", "supplier"
  payment_method  PaymentMethod
  amount          Decimal          @db.Decimal(15, 2)    // Monto en moneda del pago
  currency_code   String           @db.VarChar(10)       // Moneda en que se realizó el pago
  exchange_rate   Decimal?         @db.Decimal(18, 6)    // Valor numérico de la tasa (null si misma moneda)
  rate_type       CurrencyRateType?                       // Tipo: OFFICIAL, BLUE, etc. (null=manual)
  converted_amount Decimal?        @db.Decimal(15, 2)    // Monto convertido a moneda del documento
  exchange_note   String?          @db.VarChar(255)      // Justificación si la tasa fue manual
  description     String?          @db.VarChar(255)
  reference       String?          @db.VarChar(100)
  bank_account_id String?          @db.Uuid
  cash_box_id     String?          @db.Uuid
  status          Int              @default(1)           // 0=Borrador, 1=Confirmado, 2=Anulado
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  party           business_parties? @relation(fields: [party_id], references: [id])
  bank_account    bank_accounts?   @relation(fields: [bank_account_id], references: [id])
  cash_box        cash_boxes?      @relation(fields: [cash_box_id], references: [id])
  documents       payment_documents[]
  checks          checks[]
  credit_card_transactions credit_card_transactions[]
  account_entries current_account_entries[]

  @@unique([number])
  @@index([party_id])
  @@index([date])
  @@schema("tenant")
}
```

### 2.10 `payment_documents` - Vínculo Pago-Factura

```prisma
model payment_documents {
  id              String           @id @default(uuid()) @db.Uuid
  payment_id      String           @db.Uuid
  document_id     String           @db.Uuid
  amount_applied  Decimal          @db.Decimal(15, 2)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  payment         payments         @relation(fields: [payment_id], references: [id])
  document        documents        @relation(fields: [document_id], references: [id])

  @@unique([payment_id, document_id])
  @@schema("tenant")
}
```

### 2.11 `checks` - Cheques

```prisma
model checks {
  id              String           @id @default(uuid()) @db.Uuid
  payment_id      String?          @db.Uuid
  check_number    String           @db.VarChar(20)
  bank_name       String           @db.VarChar(100)
  bank_branch     String?          @db.VarChar(100)
  account_number  String?          @db.VarChar(50)
  issuer_name     String           @db.VarChar(255)
  issuer_id       String?          @db.VarChar(50)
  amount          Decimal          @db.Decimal(15, 2)
  currency_code   String           @db.VarChar(10)
  issue_date      DateTime         @db.Date
  due_date        DateTime         @db.Date              // Fecha de vencimiento
  status          CheckStatus      @default(PENDING)
  is_own          Boolean          @default(false)       // true=propio, false=de tercero
  notes           String?          @db.VarChar(255)
  
  // NUEVOS CAMPOS PARA CHEQUES PROPIOS
  payment_date      DateTime?        @db.Date              // Fecha de pago (cuando se puede cobrar)
  notification_sent Boolean          @default(false)       // Si ya se envió notificación
  confirmed_by      String?          @db.Uuid              // Quién confirmó
  confirmed_at      DateTime?                              // Cuándo confirmó
  
  // Para cheques de terceros (recibidos)
  deposit_date      DateTime?        @db.Date              // Fecha de depósito
  clearing_date     DateTime?        @db.Date              // Fecha de acreditación
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  payment         payments?        @relation(fields: [payment_id], references: [id])

  @@index([payment_id])
  @@index([status])
  @@index([due_date])
  @@index([payment_date])
  @@schema("tenant")
}
```

**Campos clave para flujo híbrido:**
- `payment_date`: Fecha en que el cheque puede ser cobrado
- `notification_sent`: Flag para saber si ya se notificó
- `confirmed_by`: Usuario que confirmó el cobro
- `confirmed_at`: Fecha/hora de la confirmación

### 2.12 `credit_cards` - Registro de Tarjetas de Crédito

```prisma
// prisma/schema/credit-cards.prisma (NUEVO)

model credit_cards {
  id              String           @id @default(uuid()) @db.Uuid
  name            String           @db.VarChar(100)      // "Visa Empresarial", "Naranja Sucursal"
  type            CreditCardType                         // COMPANY o CUSTOMER
  brand           CreditCardBrand
  last_four       String           @db.VarChar(4)        // Últimos 4 dígitos
  bank_name       String           @db.VarChar(100)      // Banco emisor
  holder_name     String           @db.VarChar(255)      // Titular
  holder_id       String?          @db.VarChar(50)       // CUIT/DNI del titular
  credit_limit    Decimal?         @db.Decimal(15, 2)    // Límite de crédito
  currency_code   String           @db.VarChar(10)
  
  // Configuración de comisiones (para cobros)
  commission_rate Decimal?         @db.Decimal(5, 2)     // Tasa de comisión %
  clearing_days   Int?             @db.Int               // Días hábiles para acreditación
  
  // Configuración de resumen (para pagos)
  closing_day     Int?             @db.Int               // Día de cierre del resumen
  due_day         Int?             @db.Int               // Día de vencimiento
  
  party_id        String?          @db.Uuid              // FK business_parties (si es tarjeta de cliente)
  active          Boolean          @default(true)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  party           business_parties? @relation(fields: [party_id], references: [id])
  transactions    credit_card_transactions[]
  summaries       credit_card_summaries[]

  @@schema("tenant")
}
```

**Campos clave:**
- `currency_code`: Moneda de la tarjeta (USD, ARS, EUR, etc.)
- `commission_rate`: Tasa del banco (ej: 3.5%)
- `clearing_days`: Días hábiles para acreditar (ej: 3)
- `closing_day`: Día de cierre del resumen (ej: día 5)
- `due_day`: Día de vencimiento (ej: día 20)

**Multi-moneda en tarjetas:**
- Cada tarjeta tiene su `currency_code` (una Visa en USD, una Naranja en ARS, etc.)
- Las transacciones se registran en la moneda de la tarjeta
- Si el pago/cobro es en otra moneda, se usa `exchange_rate` para convertir
- Los resúmenes muestran totales en moneda de la tarjeta + opción de visualización convertida

### 2.13 `credit_card_transactions` - Transacciones con Tarjeta

```prisma
model credit_card_transactions {
  id              String           @id @default(uuid()) @db.Uuid
  credit_card_id  String           @db.Uuid
  payment_id      String?          @db.Uuid              // FK payments
  type            CreditCardTransactionType               // PURCHASE o COLLECTION
  date            DateTime         @db.Date
  
  // Monto
  amount          Decimal          @db.Decimal(15, 2)    // Monto total en moneda de la tarjeta
  currency_code   String           @db.VarChar(10)       // Moneda de la transacción
  exchange_rate   Decimal?         @db.Decimal(18, 6)    // Tasa si se convierte a otra moneda
  rate_type       CurrencyRateType?                       // Tipo de tasa (null=manual)
  converted_amount Decimal?        @db.Decimal(15, 2)    // Monto convertido (si aplica)
  
  // Comisión (solo para cobros)
  commission_rate Decimal?         @db.Decimal(5, 2)     // % aplicado
  commission_amount Decimal?       @db.Decimal(15, 2)    // Monto de comisión
  net_amount      Decimal?         @db.Decimal(15, 2)    // Monto neto (amount - commission)
  net_currency_code String?        @db.VarChar(10)       // Moneda del monto neto
  net_exchange_rate Decimal?       @db.Decimal(18, 6)    // Tasa del neto si difiere
  
  // Acreditación (solo para cobros)
  expected_clearing_date DateTime? @db.Date              // Fecha estimada de acreditación
  actual_clearing_date   DateTime? @db.Date              // Fecha real de acreditación
  clearing_status ClearingStatus   @default(PENDING)
  
  // Cuotas (solo para pagos)
  installments_total Int?         @db.Int               // Total de cuotas
  installment_amount Decimal?     @db.Decimal(15, 2)    // Monto por cuota
  
  // Referencia
  description     String?          @db.VarChar(255)
  authorization   String?          @db.VarChar(50)       // Nro de autorización
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  credit_card     credit_cards     @relation(fields: [credit_card_id], references: [id])
  payment         payments?        @relation(fields: [payment_id], references: [id])
  installments    credit_card_installments[]

  @@index([credit_card_id])
  @@index([payment_id])
  @@index([clearing_status])
  @@schema("tenant")
}
```

### 2.14 `credit_card_installments` - Cuotas Individuales

```prisma
model credit_card_installments {
  id              String           @id @default(uuid()) @db.Uuid
  transaction_id  String           @db.Uuid              // FK credit_card_transactions
  installment_number Int           @db.Int               // Número de cuota (1, 2, 3...)
  total_installments Int           @db.Int               // Total de cuotas
  amount          Decimal          @db.Decimal(15, 2)    // Monto de esta cuota en moneda de la tarjeta
  currency_code   String           @db.VarChar(10)       // Moneda de la cuota (hereda de transaction)
  exchange_rate   Decimal?         @db.Decimal(18, 6)    // Tasa si se paga en otra moneda
  due_date        DateTime         @db.Date              // Fecha de vencimiento
  status          InstallmentStatus @default(PENDING)
  paid_date       DateTime?        @db.Date              // Fecha de pago
  paid_amount     Decimal?         @db.Decimal(15, 2)    // Monto pagado (puede diferir)
  paid_currency_code String?       @db.VarChar(10)       // Moneda en que se pagó
  paid_exchange_rate Decimal?      @db.Decimal(18, 6)    // Tasa al momento de pago
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  transaction     credit_card_transactions @relation(fields: [transaction_id], references: [id])

  @@index([transaction_id])
  @@index([due_date])
  @@index([status])
  @@schema("tenant")
}
```

### 2.15 `credit_card_summaries` - Resumen Mensual

```prisma
model credit_card_summaries {
  id              String           @id @default(uuid()) @db.Uuid
  credit_card_id  String           @db.Uuid
  month           Int              @db.Int               // Mes (1-12)
  year            Int              @db.Int               // Año
  closing_date    DateTime         @db.Date              // Fecha de cierre
  due_date        DateTime         @db.Date              // Fecha de vencimiento
  currency_code   String           @db.VarChar(10)       // Moneda de la tarjeta
  
  // Totales (en moneda de la tarjeta)
  total_purchases Decimal          @default(0) @db.Decimal(15, 2)  // Total compras nuevas
  total_installments Decimal       @default(0) @db.Decimal(15, 2)  // Total cuotas a pagar
  total_payments  Decimal          @default(0) @db.Decimal(15, 2)  // Pagos realizados
  balance         Decimal          @default(0) @db.Decimal(15, 2)  // Saldo pendiente
  
  // Totales convertidos (opcional, para visualización en otra moneda)
  display_currency_code String?    @db.VarChar(10)       // Moneda de visualización
  display_exchange_rate Decimal?   @db.Decimal(18, 6)    // Tasa al momento de generar
  display_total_purchases Decimal? @db.Decimal(15, 2)
  display_total_installments Decimal? @db.Decimal(15, 2)
  display_total_payments Decimal?  @db.Decimal(15, 2)
  display_balance   Decimal?       @db.Decimal(15, 2)
  
  status          String           @default("pending") @db.VarChar(20) // pending, paid, partial
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  credit_card     credit_cards     @relation(fields: [credit_card_id], references: [id])
  items           credit_card_summary_items[]

  @@unique([credit_card_id, month, year])
  @@schema("tenant")
}
```

### 2.16 `credit_card_summary_items` - Detalle del Resumen

```prisma
model credit_card_summary_items {
  id              String           @id @default(uuid()) @db.Uuid
  summary_id      String           @db.Uuid
  transaction_id  String           @db.Uuid
  installment_number Int           @db.Int               // Cuota que se paga este mes
  amount          Decimal          @db.Decimal(15, 2)    // Monto de la cuota en moneda de la tarjeta
  currency_code   String           @db.VarChar(10)       // Moneda de la cuota
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  // Relaciones
  summary         credit_card_summaries @relation(fields: [summary_id], references: [id])
  transaction     credit_card_transactions @relation(fields: [transaction_id], references: [id])

  @@unique([summary_id, transaction_id])
  @@schema("tenant")
}
```

### 2.17 `current_accounts` - Cuentas Corrientes

```prisma
model current_accounts {
  id              String           @id @default(uuid()) @db.Uuid
  party_id        String           @db.Uuid
  party_type      String           @db.VarChar(20)
  currency_code   String           @db.VarChar(10)
  balance         Decimal          @default(0) @db.Decimal(15, 2)
  active          Boolean          @default(true)
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  party           business_parties @relation(fields: [party_id], references: [id])
  entries         current_account_entries[]

  @@unique([party_id, currency_code])
  @@index([party_id])
  @@schema("tenant")
}
```

### 2.18 `current_account_entries` - Libro Mayor

```prisma
model current_account_entries {
  id              String           @id @default(uuid()) @db.Uuid
  current_account_id String        @db.Uuid
  type            AccountEntryType
  amount          Decimal          @db.Decimal(15, 2)    // Monto en moneda de la cuenta corriente
  currency_code   String           @db.VarChar(10)       // Moneda del registro (misma que current_accounts)
  exchange_rate   Decimal?         @db.Decimal(18, 6)    // Tasa aplicada si hubo conversión
  balance_before  Decimal          @db.Decimal(15, 2)    // Saldo anterior en esta moneda
  balance_after   Decimal          @db.Decimal(15, 2)    // Saldo nuevo en esta moneda
  description     String?          @db.VarChar(255)
  reference_type  String?          @db.VarChar(50)
  reference_id    String?          @db.Uuid
  date            DateTime         @default(now())
  
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid

  current_account current_accounts @relation(fields: [current_account_id], references: [id])

  @@index([current_account_id])
  @@index([date])
  @@schema("tenant")
}
```

---

## Parte 3: Modificaciones a Modelos Existentes

### 3.1 `documents` - Agregar campo paid_amount

```prisma
// prisma/schema/documents.prisma - Agregar al model documents:

model documents {
  // ... campos existentes ...
  paid_amount     Decimal          @default(0) @db.Decimal(15, 2)
  // Saldo pendiente se calcula: total - paid_amount
}
```

### 3.2 `public.users` - Agregar referencias

```prisma
// prisma/schema/public.prisma - Agregar al model users:

model users {
  // ... campos existentes ...
  employee_id     String?          @db.Uuid  // Referencia a employee en tenant
  partner_id      String?          @db.Uuid  // Referencia a partner en tenant
}
```

---

## Parte 4: Permisos Nuevos (RBAC)

### 4.1 Lista de Permisos

```typescript
// En prisma/seeds/rbac.seed.ts - Agregar:

// Pagos y Cobros
'payments.create'
'payments.read'
'payments.update'
'payments.delete'

// Cheques
'checks.create'
'checks.read'
'checks.manage'

// Cuentas Bancarias
'bank-accounts.create'
'bank-accounts.read'
'bank-accounts.update'

// Cajas
'cash-boxes.create'
'cash-boxes.read'
'cash-boxes.open'    // Abrir sesión
'cash-boxes.close'   // Cerrar sesión (normal o forzado)
'cash-boxes.rendition'
'cash-boxes.manage'

// Cuentas Corrientes
'current-accounts.read'
'current-accounts.entry'

// Empleados
'employees.create'
'employees.read'
'employees.update'
'employees.delete'
'employees.assign'

// Socios
'partners.create'
'partners.read'
'partners.update'
'partners.delete'

// Tarjetas de Crédito
'credit-cards.create'
'credit-cards.read'
'credit-cards.update'
'credit-cards.manage'

// Transacciones con Tarjeta
'credit-card-transactions.create'
'credit-card-transactions.read'
'credit-card-transactions.clear'

// Resúmenes de Tarjeta
'credit-card-summaries.read'
'credit-card-summaries.generate'
'credit-card-summaries.pay'
```

### 4.2 Asignación por Rol

```typescript
// Rol "admin" - Todos los permisos
// Rol "manager" - Todos excepto employees.assign, partners.delete
// Rol "cajero" - Solo cajas y pagos:
//   cash-boxes.read, cash-boxes.close, payments.create, payments.read
// Rol "viewer" - Solo lectura:
//   *.read para todos los módulos
```

---

## Parte 5: Endpoints API

### 5.1 Empleados (`/employees`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/employees` | Crear empleado | `employees.create` |
| GET | `/employees` | Listar empleados | `employees.read` |
| GET | `/employees/:id` | Detalle de empleado | `employees.read` |
| PATCH | `/employees/:id` | Editar empleado | `employees.update` |
| DELETE | `/employees/:id` | Eliminar empleado | `employees.delete` |
| PATCH | `/employees/:id/assign-user` | Asignar usuario | `employees.assign` |
| POST | `/employees/:id/create-user` | Crear usuario para empleado | `employees.assign` |

### 5.2 Socios (`/partners`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/partners` | Crear socio | `partners.create` |
| GET | `/partners` | Listar socios | `partners.read` |
| GET | `/partners/:id` | Detalle de socio | `partners.read` |
| PATCH | `/partners/:id` | Editar socio | `partners.update` |
| DELETE | `/partners/:id` | Eliminar socio | `partners.delete` |

### 5.3 Cuentas Bancarias (`/bank-accounts`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/bank-accounts` | Crear cuenta | `bank-accounts.create` |
| GET | `/bank-accounts` | Listar cuentas | `bank-accounts.read` |
| GET | `/bank-accounts/:id` | Detalle con saldo | `bank-accounts.read` |
| GET | `/bank-accounts/:id/movements` | Movimientos | `bank-accounts.read` |
| PATCH | `/bank-accounts/:id` | Editar cuenta | `bank-accounts.update` |

### 5.4 Cajas (`/cash-boxes`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/cash-boxes` | Crear caja | `cash-boxes.create` |
| GET | `/cash-boxes` | Listar cajas | `cash-boxes.read` |
| GET | `/cash-boxes/:id` | Detalle con saldo | `cash-boxes.read` |
| POST | `/cash-boxes/:id/open` | Abrir sesión | `cash-boxes.open` |
| POST | `/cash-boxes/:id/close` | Cerrar sesión (normal) | `cash-boxes.close` |
| POST | `/cash-boxes/:id/force-close` | Cierre forzado | `cash-boxes.close` |
| GET | `/cash-boxes/:id/session` | Sesión actual | `cash-boxes.read` |
| GET | `/cash-boxes/:id/sessions` | Historial de sesiones | `cash-boxes.read` |
| GET | `/cash-boxes/:id/movements` | Movimientos de sesión | `cash-boxes.read` |
| GET | `/cash-boxes/:id/overdue` | Sesiones vencidas | `cash-boxes.read` |
| POST | `/cash-boxes/:id/rendition` | Generar rendición | `cash-boxes.rendition` |
| PATCH | `/cash-boxes/:id` | Editar caja | `cash-boxes.manage` |
| POST | `/cash-boxes/:id/users` | Asignar usuario | `cash-boxes.manage` |

### 5.5 Pagos (`/payments`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/payments` | Crear pago/cobro | `payments.create` |
| GET | `/payments` | Listar pagos | `payments.read` |
| GET | `/payments/:id` | Detalle de pago | `payments.read` |
| PATCH | `/payments/:id` | Editar pago (borrador) | `payments.update` |
| DELETE | `/payments/:id` | Anular pago | `payments.delete` |
| POST | `/payments/:id/reverse` | Reverso contable | `payments.delete` |

### 5.6 Cheques (`/checks`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/checks` | Registrar cheque | `checks.create` |
| GET | `/checks` | Listar cheques | `checks.read` |
| GET | `/checks/:id` | Detalle de cheque | `checks.read` |
| PATCH | `/checks/:id` | Actualizar estado | `checks.manage` |
| POST | `/checks/:id/clear` | Marcar cobrado (terceros) | `checks.manage` |
| POST | `/checks/:id/bounce` | Marcar rechazado | `checks.manage` |
| POST | `/checks/:id/confirm` | Confirmar cobro (propios) | `checks.manage` |
| POST | `/checks/:id/reject` | Rechazar cobro (propios) | `checks.manage` |
| GET | `/checks/upcoming` | Cheques próximos a vencer | `checks.read` |
| GET | `/checks/pending-notification` | Pendientes de notificación | `checks.read` |
| DELETE | `/checks/:id` | Anular cheque | `checks.manage` |

### 5.7 Cuentas Corrientes (`/current-accounts`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/current-accounts/entries` | Registrar movimiento | `current-accounts.entry` |
| GET | `/current-accounts/:partyId` | Saldo y resumen | `current-accounts.read` |
| GET | `/current-accounts/:partyId/entries` | Movimientos | `current-accounts.read` |
| GET | `/current-accounts/:partyId/statement` | Estado de cuenta | `current-accounts.read` |

### 5.8 Tarjetas de Crédito (`/credit-cards`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/credit-cards` | Crear tarjeta | `credit-cards.create` |
| GET | `/credit-cards` | Listar tarjetas | `credit-cards.read` |
| GET | `/credit-cards/:id` | Detalle de tarjeta | `credit-cards.read` |
| PATCH | `/credit-cards/:id` | Editar tarjeta | `credit-cards.update` |
| GET | `/credit-cards/:id/transactions` | Transacciones de la tarjeta | `credit-cards.read` |
| GET | `/credit-cards/:id/summary?month=X&year=Y` | Resumen mensual | `credit-cards.read` |
| GET | `/credit-cards/:id/pending-installments` | Cuotas pendientes | `credit-cards.read` |

### 5.9 Transacciones con Tarjeta (`/credit-card-transactions`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/credit-card-transactions` | Crear transacción | `credit-card-transactions.create` |
| GET | `/credit-card-transactions` | Listar transacciones | `credit-card-transactions.read` |
| GET | `/credit-card-transactions/:id` | Detalle de transacción | `credit-card-transactions.read` |
| POST | `/credit-card-transactions/:id/clear` | Marcar como acreditado | `credit-card-transactions.clear` |
| POST | `/credit-card-transactions/:id/pay-installment` | Pagar una cuota | `credit-card-transactions.create` |
| GET | `/credit-card-transactions/:id/installments` | Ver cuotas | `credit-card-transactions.read` |

### 5.10 Resúmenes de Tarjeta (`/credit-card-summaries`)

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/credit-card-summaries` | Listar resúmenes | `credit-card-summaries.read` |
| POST | `/credit-card-summaries/generate` | Generar resumen del mes | `credit-card-summaries.generate` |
| GET | `/credit-card-summaries/:id` | Detalle del resumen | `credit-card-summaries.read` |
| PATCH | `/credit-card-summaries/:id/pay` | Marcar resumen como pagado | `credit-card-summaries.pay` |

### 5.11 Integración con Facturas

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/documents/:id/payment-status` | Saldo pendiente | `documents.read` |
| POST | `/documents/:id/pay` | Pago rápido | `payments.create` |
| GET | `/documents/unpaid?partyId=X` | Facturas impagas | `documents.read` |

---

## Parte 6: Estructura del Módulo NestJS

```
src/modules/tesoreria/
├── tesoreria.module.ts
├── dto/
│   ├── create-employee.dto.ts
│   ├── assign-user.dto.ts
│   ├── create-partner.dto.ts
│   ├── create-bank-account.dto.ts
│   ├── create-cash-box.dto.ts
│   ├── open-cash-box.dto.ts         // { opening_balance }
│   ├── close-cash-box.dto.ts        // { actual_balance }
│   ├── force-close-cash-box.dto.ts  // { actual_balance, reason }
│   ├── assign-cash-box-user.dto.ts
│   ├── create-rendition.dto.ts
│   ├── create-payment.dto.ts
│   ├── create-check.dto.ts
│   ├── create-credit-card.dto.ts
│   ├── create-credit-card-transaction.dto.ts
│   ├── generate-credit-card-summary.dto.ts
│   └── create-current-account-entry.dto.ts
├── controllers/
│   ├── employees.controller.ts
│   ├── partners.controller.ts
│   ├── bank-accounts.controller.ts
│   ├── cash-boxes.controller.ts
│   ├── payments.controller.ts
│   ├── checks.controller.ts
│   ├── credit-cards.controller.ts
│   ├── credit-card-transactions.controller.ts
│   ├── credit-card-summaries.controller.ts
│   └── current-accounts.controller.ts
├── services/
│   ├── employees.service.ts
│   ├── partners.service.ts
│   ├── bank-accounts.service.ts
│   ├── bank-account-movements.service.ts
│   ├── cash-boxes.service.ts
│   ├── cash-box-sessions.service.ts    // NUEVO
│   ├── cash-box-movements.service.ts
│   ├── cash-box-renditions.service.ts
│   ├── payments.service.ts
│   ├── payment-documents.service.ts
│   ├── checks.service.ts
│   ├── credit-cards.service.ts
│   ├── credit-card-transactions.service.ts
│   ├── credit-card-installments.service.ts
│   ├── credit-card-summaries.service.ts
│   ├── current-accounts.service.ts
│   └── current-account-entries.service.ts
├── guards/
│   ├── cash-box-access.guard.ts
│   └── cash-box-session.guard.ts     // NUEVO: control de acceso por sesión
├── schedulers/
│   ├── check-notification.scheduler.ts
│   ├── check-processing.scheduler.ts
│   ├── cash-box-force-close.scheduler.ts  // NUEVO: detecta olvidos
│   └── credit-card-clearing.scheduler.ts
└── helpers/
    ├── payment.helper.ts
    ├── balance.helper.ts
    ├── cash-box.helper.ts            // NUEVO
    └── credit-card.helper.ts
```

---

## Parte 6b: Validaciones de Moneda

### Validación en CreatePaymentDto

```typescript
// src/modules/tesoreria/dto/create-payment.dto.ts

export class CreatePaymentDto {
  // ... otros campos ...

  @IsNotEmpty()
  currency_code: string;

  // exchange_rate obligatorio cuando hay conversión de moneda
  @ValidateIf(o => {
    // Si hay bank_account o cash_box, obtener su moneda
    // y comparar con document_currency
    return o.requires_conversion === true;
  })
  @IsNotEmpty({ message: 'exchange_rate es obligatorio cuando hay conversión de moneda' })
  @Min(0.000001, { message: 'exchange_rate debe ser mayor a 0' })
  exchange_rate?: number;

  // Tipo de cambio seleccionado
  @IsOptional()
  @IsIn(['OFFICIAL', 'BLUE', 'MEP', 'CCL', 'WHOLESALE', 'CRYPTO', 'CARD'])
  rate_type?: CurrencyRateType;

  // Nota justificativa si fue manual
  @ValidateIf(o => o.rate_type === undefined || o.rate_type === null)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  exchange_note?: string;
}
```

### Validación de rango en PaymentsService

```typescript
// src/modules/tesoreria/services/payments.service.ts

async createPayment(dto: CreatePaymentDto) {
  const bankAccount = dto.bank_account_id 
    ? await this.bankAccountsService.findOne(dto.bank_account_id)
    : null;
  const cashBox = dto.cash_box_id
    ? await this.cashBoxesService.findOne(dto.cash_box_id)
    : null;

  const paymentCurrency = bankAccount?.currency_code 
    || cashBox?.currency_code 
    || dto.currency_code;

  // Obtener documento para saber su moneda
  const document = dto.documents?.length
    ? await this.documentsService.findOne(dto.documents[0].document_id)
    : null;
  const documentCurrency = document?.currency_code;

  let needsConversion = false;
  let convertedAmount = dto.amount;
  let exchangeRate = dto.exchange_rate;
  let rateType = dto.rate_type;

  if (documentCurrency && paymentCurrency !== documentCurrency) {
    needsConversion = true;

    // Si no se proporcionó tasa, traer la del día
    if (!exchangeRate) {
      const rates = await this.currencyRatesService.getRatesForPair(
        paymentCurrency, 
        documentCurrency
      );
      if (rates.length > 0) {
        // Usar OFFICIAL por defecto
        const officialRate = rates.find(r => r.rate_type === 'OFFICIAL');
        exchangeRate = officialRate?.rate || rates[0].rate;
        rateType = officialRate?.rate_type || rates[0].rate_type;
      } else {
        throw new BadRequestException(
          `No hay tipo de cambio disponible para ${paymentCurrency} → ${documentCurrency}`
        );
      }
    }

    // Validar rango (warning, no bloquea)
    const latestRate = await this.exchangeService.getLatestRate(
      paymentCurrency, 
      documentCurrency
    );
    if (latestRate) {
      const diff = Math.abs(exchangeRate - latestRate.rate) / latestRate.rate;
      if (diff > 0.5) {
        // Registrar warning pero continuar
        this.logger.warn(
          `Tasa ${exchangeRate} difiere significativamente de la del mercado ${latestRate.rate}`
        );
      }
    }

    // Calcular monto convertido
    convertedAmount = dto.amount * exchangeRate;
  }

  // Registrar pago con todos los campos de moneda
  const payment = await this.prisma.payments.create({
    data: {
      amount: dto.amount,
      currency_code: paymentCurrency,
      exchange_rate: exchangeRate || null,
      rate_type: rateType || null,
      converted_amount: needsConversion ? convertedAmount : null,
      exchange_note: dto.exchange_note || null,
      // ... resto de campos ...
    }
  });

  return payment;
}
```

### Endpoint para tasas del día

```typescript
// src/modules/tesoreria/controllers/currency-rates.controller.ts

@Controller('currency-rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  @Get('current')
  async getCurrentRates(
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    const rates = await this.currencyRatesService.getRatesForPair(from, to);
    return rates.map(r => ({
      rate_type: r.rate_type,
      rate: r.rate,
      effective_date: r.effective_date,
      source: r.source
    }));
  }
}
```

---

## Parte 7: Guard Personalizado para Cajas

```typescript
// src/modules/tesoreria/guards/cash-box-access.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CashBoxAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const cashBoxId = request.params.id;

    if (!cashBoxId) return true; // No aplica si no hay cashBoxId

    const db = this.prisma.getClientForCurrentContext();
    
    // Buscar el rol del usuario en esta caja
    const userRole = await db.cash_box_user_roles.findFirst({
      where: {
        cash_box_id: cashBoxId,
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!userRole) {
      throw new ForbiddenException('No tienes acceso a esta caja');
    }

    // Verificar si es el momento de cerrar/rendir
    const action = request.method + request.path;
    if (action.includes('/close') || action.includes('/rendition')) {
      if (userRole.role !== 'RESPONSIBLE') {
        throw new ForbiddenException('Solo el responsable puede cerrar o rendir esta caja');
      }
    }

    // Agregar el rol al request para uso posterior
    request.cashBoxRole = userRole.role;
    
    return true;
  }
}
```

### Guard: `CashBoxSessionGuard`

```typescript
// src/modules/tesoreria/guards/cash-box-session.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CashBoxSessionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const cashBoxId = request.params.id;
    const action = request.method + request.path;

    // Si es GET (lectura), permitir a todos los roles
    if (request.method === 'GET') {
      return true;
    }

    const db = this.prisma.getClientForCurrentContext();

    // Buscar sesión abierta para esta caja
    const session = await db.cash_box_sessions.findFirst({
      where: {
        cash_box_id: cashBoxId,
        status: 'OPEN',
      },
    });

    // Para escritura (POST/PATCH), verificar que sea el dueño de la sesión
    if (session && session.user_id !== userId) {
      throw new ForbiddenException(
        'Solo quien abrió la sesión puede realizar esta acción'
      );
    }

    // Para cierre normal, verificar que sea el dueño
    if (action.includes('/close') && !action.includes('/force-close')) {
      if (!session || session.user_id !== userId) {
        throw new ForbiddenException(
          'Solo quien abrió la sesión puede cerrarla'
        );
      }
    }

    // Para cierre forzado, verificar que sea admin o responsable
    if (action.includes('/force-close')) {
      const userRole = await db.cash_box_user_roles.findFirst({
        where: {
          cash_box_id: cashBoxId,
          user_id: userId,
          role: 'RESPONSIBLE',
          deleted_at: null,
        },
      });

      if (!userRole) {
        throw new ForbiddenException(
          'Solo un responsable puede forzar el cierre de una sesión'
        );
      }
    }

    // Adjuntar sesión al request para uso posterior
    request.cashBoxSession = session;
    
    return true;
  }
}
```

---

## Parte 8: Flujo de Integración

### Flujo 1: Crear Empleado con Acceso

```
1. POST /employees { first_name, last_name, document_number, position }
   → Se crea employee

2. POST /employees/:id/create-user { email: "juan@empresa.com", password: "..." }
   → Se crea user en public.users con employee_id
   → Se asigna CompanyRole=USER

3. POST /access-control/users/:userId/roles { role_id: "cajero-role" }
   → Se asigna rol de negocio

4. POST /cash-boxes/:boxId/users { user_id, role: "OPERATOR" }
   → Se asigna a caja específica
```

### Flujo 2: Empleado Realiza Pago desde Caja

```
1. Empleado se loguea (POST /auth/login)

2. POST /payments {
     type: "PAYMENT",
     payment_method: "CASH",
     cash_box_id: "caja-123",        // caja bimonetaria: USD=500, ARS=80,000
     party_id: "proveedor-456",      // cuenta corriente del proveedor en ARS
     amount: 100,                     // 100 USD (lo que paga el empleado)
     documents: [{ document_id: "fact-789" }]
     // factura-789 tiene currency_code: "ARS", total: 95,000
   }

3. Sistema verifica:
   a. Permiso payments.create ✓
   b. Usuario tiene rol en caja-123 ✓
   c. Rol es RESPONSIBLE u OPERATOR ✓

4. Sistema detecta conversión de moneda:
   - cash_box.currency_code = "USD" (del cash_box_balances)
   - document.currency_code = "ARS"
   - Son distintas → se necesita conversión

5. Sistema busca tasas del día:
   → GET /currency-rates/current?from=USD&to=ARS
   → Resultado: [
       { rate_type: "OFFICIAL", rate: 950 },
       { rate_type: "BLUE", rate: 1100 },
       { rate_type: "MEP", rate: 980 }
     ]
   → Frontend muestra selector al usuario

6. Usuario selecciona OFFICIAL (950)

7. Sistema ejecuta:
   a. Crea payment:
      - amount: 100, currency_code: "USD"
      - exchange_rate: 950, rate_type: "OFFICIAL"
      - converted_amount: 95,000 (100 × 950)

   b. Descuenta de caja (USD):
      - cash_box_balances (cash_box=caja-123, currency=USD):
        balance: 500 → 400
      - cash_box_movements:
        amount: -100, currency_code: "USD"

   c. Crea payment_documents:
      - amount_applied: 95,000 (ARS, moneda del documento)

   d. Actualiza documents.paid_amount += 95,000

   e. Actualiza current_accounts del proveedor (ARS):
      - balance: 200,000 → 105,000

   f. Crea current_account_entries:
      - amount: -95,000
      - currency_code: "ARS"
      - exchange_rate: 950
      - balance_before: 200,000
      - balance_after: 105,000

   g. Actualiza session.total_expenses += 100 (USD)
```

### Flujo 2b: Apertura de Sesión de Caja

```
1. Usuario accede a caja
   → GET /cash-boxes/:id/session

2. Si NO hay sesión abierta:
   POST /cash-boxes/:id/open {
     opening_balance: 50000
   }
   
   Sistema crea:
   ┌─────────────────────────────────────────┐
   │ cash_box_sessions                      │
   │   user_id: "user-123"                  │
   │   opening_balance: 50000               │
   │   status: "OPEN"                       │
   └─────────────────────────────────────────┘
   
   Actualiza cash_boxes:
   ┌─────────────────────────────────────────┐
   │   current_session_id: "session-456"    │
   │   status: OPEN                         │
   └─────────────────────────────────────────┘

   NOTA: Los saldos se leen de cash_box_balances:
   ┌─────────────────────────────────────────┐
   │ cash_box_balances                      │
   │   currency: "USD", balance: 400        │
   │   currency: "ARS", balance: 80,000     │
   └─────────────────────────────────────────┘

3. Si HAY sesión abierta de HOY:
   → Muestra alerta: "Ya tienes una sesión abierta desde las HH:MM"
   → No permite abrir nueva sesión

4. Si HAY sesión abierta de AYER u otro día:
   → Muestra modal de cierre forzado
   → Al confirmar → se ejecuta force-close
   → Luego permite abrir nueva sesión
```

### Flujo 2c: Cierre Forzado de Sesión

```
1. Scheduler detecta olvido (8:00 AM diario):
   → Busca sesiones abiertas de días anteriores
   → Envía notificaciones al usuario y admins
   → Marca overdue_detected = true

2. Desde frontend, admin ve alerta:
   ┌─────────────────────────────────────────────┐
   │ ⚠️ ATENCIÓN                                │
   │                                             │
   │ El usuario Juan Olvidó cerrar caja          │
   │ "Caja Chica Admin" el 01/07/2026           │
   │                                             │
   │ [CERRAR SESIÓN]                             │
   └─────────────────────────────────────────────┘

3. Admin hace clic en "CERRAR SESIÓN":
   → Se abre modal para ingresar saldo real
   → Se ingresa motivo del cierre forzado

4. POST /cash-boxes/:id/force-close {
     session_id: "session-456",
     actual_balance: 48000,
     reason: "Olvido de cierre del día 01/07"
   }

5. Sistema registra:
   ┌─────────────────────────────────────────┐
   │ cash_box_sessions                      │
   │   status: "FORCED"                     │
   │   closed_at: now()                     │
   │   closing_balance: 48500 (teórico)     │
   │   actual_balance: 48000 (contado)      │
   │   difference: -500                     │
   │   force_closed: true                   │
   │   force_closed_by: "user-admin-789"    │
   │   force_close_reason: "Olvido..."      │
   └─────────────────────────────────────────┘

6. Registra en audit_logs:
   {
     action: "FORCE_CLOSE",
     user_who_forgot: "user-123",
     user_who_closed: "user-admin-789",
     cash_box: "Caja Chica Admin",
     session_date: "2026-07-01",
     difference: -500
   }
```

### Flujo 2d: Control de Acceso por Sesión

```
REGLAS DE ACCESO:

1. Solo quien abrió la sesión puede:
   - Agregar movimientos
   - Cerrar la sesión (normal)

2. Solo administradores pueden:
   - Forzar cierre de sesiones ajenas
   - Ver historial de sesiones de todos

3. Todos los roles pueden:
   - Ver la caja
   - Ver movimientos
   - Ver saldo

VERIFICACIÓN EN GUARD:

CashBoxSessionGuard verifica:
  if (session.user_id !== request.user.id) {
    throw ForbiddenException(
      'Solo quien abrió la sesión puede realizar esta acción'
    );
  }
```

### Flujo 3: Rendición de Caja Chica

```
1. Responsable accede a /cash-boxes/:id/rendition
   → Verifica que es RESPONSIBLE

2. POST /cash-boxes/:id/rendition {
     start_date: "2026-07-01",
     end_date: "2026-07-15",
     actual_balance: 14800
   }

3. Sistema calcula:
   - Saldo apertura: 50000
   - Total gastos: 35000 (sumatoria de movimientos negativos)
   - Total ingresos: 0
   - Saldo teórico: 15000
   - Diferencia: -200

4. Se crea rendition con status "pending"
5. Admin aprueba → status "approved"
```

### Flujo 4: Cliente Paga con Tarjeta (Cobro)

```
1. Cliente paga factura de $100,000 con Visa del Banco Nación
2. Banco Nación cobra 3.5% de comisión → $3,500
3. Empresa recibe $96,500 en 3 días hábiles

Sistema crea:
┌─────────────────────────────────────────────────────┐
│ credit_cards (si no existe, se crea)               │
│   type: CUSTOMER                                    │
│   brand: VISA                                       │
│   bank_name: "Banco Nación"                         │
│   commission_rate: 3.5                              │
│   clearing_days: 3                                  │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ credit_card_transactions                           │
│   type: COLLECTION                                  │
│   amount: 100,000                                   │
│   commission_rate: 3.5                              │
│   commission_amount: 3,500                          │
│   net_amount: 96,500                                │
│   expected_clearing_date: 2026-07-05 (3 días)      │
│   clearing_status: PENDING                          │
└─────────────────────────────────────────────────────┘
         │
         ▼ (Scheduler o manual)
┌─────────────────────────────────────────────────────┐
│ Cuando se acredita:                                 │
│   clearing_status: CLEARED                          │
│   actual_clearing_date: 2026-07-05                  │
│   → Se crea movimiento en bank_accounts (+96,500)   │
└─────────────────────────────────────────────────────┘
```

### Flujo 5: Empresa Compra con Tarjeta (Pago)

```
1. Empresa compra $300,000 en 6 cuotas con Visa Empresarial
2. Cuota mensual: $55,000 (con interés)
3. Cierre: día 5, Vencimiento: día 20

Sistema crea:
┌─────────────────────────────────────────────────────┐
│ credit_cards                                       │
│   type: COMPANY                                    │
│   brand: VISA                                      │
│   bank_name: "BBVA"                                │
│   closing_day: 5                                   │
│   due_day: 20                                      │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ credit_card_transactions                           │
│   type: PURCHASE                                   │
│   amount: 300,000                                  │
│   installments_total: 6                            │
│   installment_amount: 55,000                       │
└─────────────────────────────────────────────────────┘
         │
         ▼ (6 cuotas generadas automáticamente)
┌─────────────────────────────────────────────────────┐
│ credit_card_installments (cuota 1)                 │
│   installment_number: 1                            │
│   amount: 55,000                                   │
│   due_date: 2026-08-20                             │
│   status: PENDING                                  │
├─────────────────────────────────────────────────────┤
│ credit_card_installments (cuota 2)                 │
│   installment_number: 2                            │
│   amount: 55,000                                   │
│   due_date: 2026-09-20                             │
│   status: PENDING                                  │
├─────────────────────────────────────────────────────┤
│ ... (cuotas 3 a 6)                                 │
└─────────────────────────────────────────────────────┘
```

### Flujo 6: Resumen Mensual

```
Empresa tiene 3 tarjetas y varias compras en el mes:

Resumen Visa BBVA - Agosto 2026:
┌─────────────────────────────────────────────────────┐
│ Compra 1: $300,000 en 6 cuotas → cuota 1: $55,000 │
│ Compra 2: $150,000 en 3 cuotas → cuota 1: $52,000 │
│ Compra 3: $80,000 en 1 cuota → cuota 1: $80,000   │
├─────────────────────────────────────────────────────┤
│ TOTAL A PAGAR ESTE MES: $187,000                   │
│ Fecha de vencimiento: 20/08/2026                   │
└─────────────────────────────────────────────────────┘
```

### Flujo 7: Scheduler de Acreditación Automática

```
Se ejecuta todos los días a las 8:00 AM:

1. Busca transacciones con type=COLLECTION y clearing_status=PENDING
2. Si expected_clearing_date <= hoy:
   - Opción automática: marca como CLEARED
   - Opción manual: envía notificación para que el usuario confirme
3. Al marcar como CLEARED:
   - Crea movimiento en bank_accounts (monto neto)
   - Actualiza saldo de la cuenta bancaria
```

### Flujo 8: Cheques Propios - Flujo Híbrido

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CREAR CHEQUE PROPIO                                      │
│                                                             │
│ POST /checks {                                             │
│   check_number: "12345",                                   │
│   bank_name: "Banco Nación",                               │
│   amount: 100000,                                          │
│   due_date: "2026-07-15",     ← Fecha de vencimiento      │
│   payment_date: "2026-07-15", ← Fecha de pago (cobro)     │
│   is_own: true                                            │
│ }                                                          │
│                                                             │
│ → Se crea cheque con status: PENDING                       │
│ → Se agenda notificación para 2026-07-13 (2 días antes)    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. NOTIFICACIÓN (2 días antes - 2026-07-13)                │
│                                                             │
│ Scheduler ejecuta: check-notification.scheduler.ts         │
│                                                             │
│ Busca cheques donde:                                        │
│   - payment_date = hoy + 2 días                            │
│   - notification_sent = false                              │
│   - is_own = true                                          │
│   - status = PENDING                                       │
│                                                             │
│ → Envía notificación al usuario responsable:               │
│   "Cheque #12345 vence el 15/07. Fondos: $XXX"            │
│ → Marca notification_sent = true                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. RESPUESTA DEL USUARIO                                   │
│                                                             │
│ Opción A: CONFIRMAR                                        │
│   PATCH /checks/:id/confirm                                │
│   → confirmed_by = user_id                                 │
│   → confirmed_at = now()                                   │
│   → status = CONFIRMED                                     │
│                                                             │
│ Opción B: RECHAZAR                                         │
│   PATCH /checks/:id/reject                                 │
│   → status = CANCELLED                                     │
│   → reason = "Fondos insuficientes"                        │
│                                                             │
│ Opción C: NO HACER NADA (timeout 48h)                      │
│   → El sistema procesa automáticamente                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. EN LA FECHA DE PAGO (2026-07-15)                        │
│                                                             │
│ Scheduler ejecuta: check-processing.scheduler.ts           │
│                                                             │
│ Busca cheques donde:                                        │
│   - payment_date = hoy                                     │
│   - status IN (PENDING, CONFIRMED)                         │
│   - is_own = true                                          │
│                                                             │
│ Para cada cheque:                                          │
│   1. Verifica fondos suficientes en bank_account           │
│   2. Si hay fondos:                                        │
│      - status = CLEARED                                    │
│      - Crea bank_account_movement (amount negativo)        │
│      - Actualiza bank_account.balance                      │
│   3. Si NO hay fondos:                                     │
│      - status = BOUNCHED                                   │
│      - Envía alerta: "Cheque #12345 rechazado por fondos" │
│      - Crea movimiento de deuda en current_accounts        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo 8b: Código de Schedulers de Cheques

```typescript
// ============================================
// SCHEDULER 1: Notificación de Cheques
// ============================================
// src/modules/tesoreria/schedulers/check-notification.scheduler.ts

@Cron('0 9 * * *') // Todos los días a las 9:00 AM
async sendCheckNotifications() {
  const today = new Date();
  const twoDaysFromNow = addDays(today, 2);

  const checksNeedingNotification = await db.checks.findMany({
    where: {
      is_own: true,
      status: 'PENDING',
      payment_date: twoDaysFromNow,
      notification_sent: false,
    },
  });

  for (const check of checksNeedingNotification) {
    // Verificar fondos disponibles
    const bankAccount = await db.bank_accounts.findFirst({
      where: { bank_name: check.bank_name, active: true },
    });

    const availableFunds = bankAccount?.balance || 0;
    const hasEnoughFunds = availableFunds >= check.amount;

    // Enviar notificación
    await this.notificationService.send({
      userId: check.created_by,
      title: 'Cheque próximo a vencer',
      message: `Cheque #${check.check_number} vence el ${check.payment_date}. ` +
               `Monto: $${check.amount}. ` +
               `Fondos disponibles: $${availableFunds}. ` +
               (hasEnoughFunds ? '✅ Fondos suficientes' : '⚠️ Fondos insuficientes'),
      actionUrl: `/checks/${check.id}`,
    });

    // Marcar como enviada
    await db.checks.update({
      where: { id: check.id },
      data: { notification_sent: true },
    });
  }
}

// ============================================
// SCHEDULER 2: Procesamiento de Cheques
// ============================================
// src/modules/tesoreria/schedulers/check-processing.scheduler.ts

@Cron('0 10 * * *') // Todos los días a las 10:00 AM
async processChecks() {
  const today = new Date();

  const checksToProcess = await db.checks.findMany({
    where: {
      is_own: true,
      payment_date: today,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  for (const check of checksToProcess) {
    const bankAccount = await db.bank_accounts.findFirst({
      where: { bank_name: check.bank_name, active: true },
    });

    if (bankAccount && bankAccount.balance >= check.amount) {
      // Fondos suficientes - procesar
      await db.$transaction(async (tx) => {
        // Actualizar estado del cheque
        await tx.checks.update({
          where: { id: check.id },
          data: { status: 'CLEARED' },
        });

        // Crear movimiento bancario
        await tx.bank_account_movements.create({
          data: {
            bank_account_id: bankAccount.id,
            type: 'CHECK_ISSUED',
            amount: -check.amount, // Negativo porque es salida
            balance_before: bankAccount.balance,
            balance_after: bankAccount.balance - check.amount,
            description: `Cheque #${check.check_number} cobrado`,
            reference_type: 'check',
            reference_id: check.id,
            payment_id: check.payment_id,
          },
        });

        // Actualizar saldo
        await tx.bank_accounts.update({
          where: { id: bankAccount.id },
          data: { balance: { decrement: check.amount } },
        });
      });
    } else {
      // Fondos insuficientes - rechazar
      await db.checks.update({
        where: { id: check.id },
        data: { status: 'BOUNCED' },
      });

      // Crear deuda en cuenta corriente
      if (check.payment_id) {
        const payment = await db.payments.findUnique({
          where: { id: check.payment_id },
        });

        if (payment?.party_id) {
          // Usar la moneda del pago original para la deuda
          await this.currentAccountsService.addEntry({
            party_id: payment.party_id,
            currency_code: payment.currency_code,
            exchange_rate: payment.exchange_rate,
            type: 'CHECK_BOUNCED',
            amount: -check.amount,
            description: `Cheque #${check.check_number} rechazado por fondos insuficientes`,
            reference_type: 'check',
            reference_id: check.id,
          });
        }
      }

      // Enviar alerta
      await this.notificationService.send({
        userId: check.created_by,
        title: '⚠️ Cheque rechazado',
        message: `Cheque #${check.check_number} rechazado por fondos insuficientes. ` +
                 `Monto: $${check.amount}`,
        actionUrl: `/checks/${check.id}`,
      });
    }
  }
}
```

### Flujo 8c: Diagrama del Flujo de Cheques Propios

```
DÍA 0: Se crea cheque propio
         │
         ▼
DÍA -2: Notificación automática
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 CONFIRMAR  NO HACER NADA
    │         │
    ▼         ▼
DÍA 0: Procesamiento automático
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 FONDOS    SIN FONDOS
    │         │
    ▼         ▼
 COBRADO   RECHAZADO
    │         │
    ▼         ▼
 Actualiza  Crea deuda
 saldo      + Alerta
```

---

## Parte 9: Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────┐
│                      PUBLIC SCHEMA                          │
│  ┌──────────────┐        ┌──────────────────┐               │
│  │    users     │◄───────│   company_users  │               │
│  │ (identidad)  │        │   (membresía)    │               │
│  └──────┬───────┘        └──────────────────┘               │
│         │                                                   │
│    employee_id                                             │
│    partner_id                                              │
└─────────┼───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      TENANT SCHEMA                          │
│                                                             │
│  ┌──────────────┐        ┌──────────────────┐               │
│  │   employees  │◄───────│ business_parties │               │
│  │   partners   │        │  (datos legales) │               │
│  └──────┬───────┘        └──────────────────┘               │
│         │                                                   │
│         │ responsible_id                                    │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    cash_boxes                        │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                               │
│         ┌───────────────────┼───────────────────┐          │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  cash_box    │  │    payments    │  │  cash_box      │  │
│  │  _movements  │  │                │  │  _renditions   │  │
│  └──────────────┘  └───────┬────────┘  └────────────────┘  │
│                             │                               │
│              ┌──────────────┼──────────────┐               │
│              │              │              │               │
│              ▼              ▼              ▼               │
│     ┌────────────────┐ ┌─────────┐ ┌──────────────────┐   │
│     │payment_documents│ │  checks │ │credit_card       │   │
│     └───────┬────────┘ └───────── │  _transactions   │   │
│             │                      └────────┬─────────┘   │
│             │                               │              │
│             │                    ┌──────────┼──────────┐  │
│             │                    │          │          │  │
│             │                    ▼          ▼          ▼  │
│             │           ┌──────────────┐ ┌────────────┐  │
│             │           │credit_card   │ │credit_card │  │
│             │           │_installments │ │_summaries  │  │
│             │           └──────────────┘ └────────────┘  │
│             ▼                                            │
│     ┌────────────────┐     ┌──────────────────────┐      │
│     │   documents    │     │   current_accounts   │      │
│     │   (facturas)   │     │   (libro mayor)      │      │
│     └────────────────┘     └──────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Parte 10: Orden de Implementación

| Fase | Tarea | Dependencias |

```typescript
// src/modules/tesoreria/helpers/credit-card.helper.ts

export class CreditCardHelper {
  /**
   * Calcula la comisión de un cobro con tarjeta
   */
  static calculateCommission(amount: number, commissionRate: number): number {
    return amount * (commissionRate / 100);
  }

  /**
   * Calcula el monto neto después de la comisión
   */
  static calculateNetAmount(amount: number, commissionAmount: number): number {
    return amount - commissionAmount;
  }

  /**
   * Calcula la fecha estimada de acreditación
   */
  static calculateExpectedClearingDate(
    transactionDate: Date,
    clearingDays: number
  ): Date {
    const expectedDate = new Date(transactionDate);
    let remainingDays = clearingDays;

    while (remainingDays > 0) {
      expectedDate.setDate(expectedDate.getDate() + 1);
      // Saltar fines de semana
      if (expectedDate.getDay() !== 0 && expectedDate.getDay() !== 6) {
        remainingDays--;
      }
    }

    return expectedDate;
  }

  /**
   * Genera las cuotas de una compra
   */
  static generateInstallments(
    totalAmount: number,
    numberOfInstallments: number,
    firstDueDate: Date
  ): Array<{ number: number; amount: number; dueDate: Date }> {
    const installmentAmount = totalAmount / numberOfInstallments;
    const installments = [];

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        number: i + 1,
        amount: Math.round(installmentAmount * 100) / 100,
        dueDate,
      });
    }

    return installments;
  }

  /**
   * Calcula el total de cuotas pendientes para una tarjeta en un mes
   */
  static calculateMonthlyTotal(
    installments: Array<{ amount: number; status: string }>,
    month: number,
    year: number
  ): number {
    return installments
      .filter((inst) => {
        const dueDate = new Date(inst.dueDate);
        return (
          dueDate.getMonth() + 1 === month &&
          dueDate.getFullYear() === year &&
          inst.status === 'PENDING'
        );
      })
      .reduce((total, inst) => total + inst.amount, 0);
  }

  /**
   * Calcula el saldo de una tarjeta (total de cuotas pendientes)
   */
  static calculateCardBalance(
    installments: Array<{ amount: number; status: string }>
  ): number {
    return installments
      .filter((inst) => inst.status === 'PENDING')
      .reduce((total, inst) => total + inst.amount, 0);
  }
}
```

---

## Parte 13: Notas de Implementación Crédito

### Acreditación Automática vs Manual

El sistema soporta ambos modos:

1. **Automático**: El scheduler `credit-card-clearing.scheduler.ts` se ejecuta diariamente y marca como acreditadas las transacciones cuya `expected_clearing_date` ya pasó.

2. **Manual**: El usuario puede ir a la transacción y hacer clic en "Marcar como acreditado" cuando confirma que el dinero llegó.

3. **Híbrido (recomendado)**: El scheduler envía una notificación cuando una transacción está lista para acreditar, y el usuario confirma.

### Resúmenes Mensuales

Los resúmenes se generan manualmente o automáticamente:

1. **Manual**: El usuario va a "Generar resumen" y selecciona tarjeta + mes/año.
2. **Automático**: Un scheduler mensual genera resúmenes para todas las tarjetas al día de cierre.

### Cálculo de Cuotas

Cuando se crea una compra en cuotas:
- Se calcula `installment_amount = total / numberOfInstallments`
- Se crean registros en `credit_card_installments` con fechas de vencimiento escalonadas
- Cada mes, las cuotas pendientes se agrupan en el resumen

---

## Parte 14: Transferencias y Caja Principal

### 14.1 Cambios a Modelos Existentes

#### 14.1.1 `cash_boxes` — Agregar campo `is_main`

```prisma
// prisma/schema/payments.prisma - Modificar model cash_boxes:

model cash_boxes {
  // ... campos existentes ...
  is_main         Boolean          @default(false)  // Marca como caja principal
  // ... resto igual ...
}
```

#### 14.1.2 `cash_box_sessions` — Campos para cierre con transferencia

```prisma
// prisma/schema/payments.prisma - Modificar model cash_box_sessions:

model cash_box_sessions {
  // ... campos existentes ...
  auto_transfer_enabled Boolean    @default(false)
  transfer_dest_id      String?    @db.Uuid
  transfer_dest_type    String?    @db.VarChar(20)       // "cash_box" o "bank_account"
  transferred_amount    Decimal?   @db.Decimal(15, 2)
  transferred_at        DateTime?
  // ... resto igual ...
}
```

#### 14.1.3 `AccountEntryType` — Agregar tipos de transferencia

```prisma
// prisma/schema/enums.prisma - Modificar enum AccountEntryType:

enum AccountEntryType {
  // ... valores existentes ...
  TRANSFER_OUT
  TRANSFER_IN
}
```

### 14.2 Nuevo Modelo: `cash_box_transfers`

```prisma
// prisma/schema/payments.prisma - Agregar:

model cash_box_transfers {
  id              String           @id @default(uuid()) @db.Uuid
  session_id      String?          @db.Uuid
  source_type     String           @db.VarChar(20)       // "cash_box" o "bank_account"
  source_id       String           @db.Uuid
  dest_type       String           @db.VarChar(20)       // "cash_box" o "bank_account"
  dest_id         String           @db.Uuid
  amount          Decimal          @db.Decimal(15, 2)
  currency_code   String           @db.VarChar(10)
  exchange_rate   Decimal?         @db.Decimal(18, 6)
  rate_type       CurrencyRateType?
  converted_amount Decimal?        @db.Decimal(15, 2)
  description     String?          @db.VarChar(255)
  reference       String?          @db.VarChar(100)
  transfer_type   String           @db.VarChar(30)       // "manual", "auto_close", "compensation"
  status          String           @default("completed") @db.VarChar(20)
  created_at      DateTime         @default(now())
  updated_at      DateTime?        @updatedAt
  deleted_at      DateTime?
  created_by      String?          @db.Uuid
  updated_by      String?          @db.Uuid
  deleted_by      String?          @db.Uuid
  session         cash_box_sessions? @relation(fields: [session_id], references: [id])

  @@index([source_type, source_id])
  @@index([dest_type, dest_id])
  @@index([session_id])
  @@schema("tenant")
}
```

### 14.3 DTOs

#### 14.3.1 `create-cash-box-transfer.dto.ts`

```typescript
// src/modules/tesoreria/dto/create-cash-box-transfer.dto.ts

import { IsIn, IsUUID, IsString, IsOptional, Min, IsNumber } from 'class-validator';
import { CurrencyRateType } from '@/generated/prisma/enums';

export class CreateCashBoxTransferDto {
  @IsIn(['cash_box', 'bank_account'])
  source_type!: string;

  @IsUUID()
  source_id!: string;

  @IsIn(['cash_box', 'bank_account'])
  dest_type!: string;

  @IsUUID()
  dest_id!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  currency_code!: string;

  @IsOptional()
  @IsNumber()
  exchange_rate?: number;

  @IsOptional()
  @IsIn(['OFFICIAL', 'BLUE', 'MEP', 'CCL', 'WHOLESALE', 'CRYPTO', 'CARD'])
  rate_type?: CurrencyRateType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
```

#### 14.3.2 `close-cash-box.dto.ts` (actualizado)

```typescript
// src/modules/tesoreria/dto/close-cash-box.dto.ts

import { IsNumber, IsOptional, IsBoolean, IsUUID, IsIn, ValidateIf, Min } from 'class-validator';

export class CloseCashBoxDto {
  @IsNumber()
  @Min(0)
  actual_balance!: number;

  @IsOptional()
  @IsBoolean()
  auto_transfer?: boolean;

  @ValidateIf(o => o.auto_transfer === true)
  @IsOptional()
  @IsUUID()
  transfer_dest_id?: string;

  @ValidateIf(o => o.auto_transfer === true)
  @IsOptional()
  @IsIn(['cash_box', 'bank_account'])
  transfer_dest_type?: string;
}
```

### 14.4 Services

#### 14.4.1 `cash-box-transfers.service.ts`

```typescript
// src/modules/tesoreria/services/cash-box-transfers.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxTransferDto } from '../dto/create-cash-box-transfer.dto';
import { ExchangeService } from '@/modules/erp/pricing/exchange/exchange.service';
import { AccountEntryType, CurrencyRateType } from '@/generated/prisma/enums';

@Injectable()
export class CashBoxTransfersService {
  constructor(
    private db: PrismaService,
    private exchangeService: ExchangeService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateCashBoxTransferDto, userId: string) {
    // 1. Validar que origen y destino sean diferentes
    if (dto.source_type === dto.dest_type && dto.source_id === dto.dest_id) {
      throw new BadRequestException('Origen y destino deben ser diferentes');
    }

    // 2. Verificar fondos suficientes en origen
    const sourceBalance = await this.getBalance(dto.source_type, dto.source_id, dto.currency_code);
    if (sourceBalance < dto.amount) {
      throw new BadRequestException(
        `Fondos insuficientes en origen. Disponible: ${sourceBalance}, Solicitado: ${dto.amount}`
      );
    }

    // 3. Calcular conversión si moneda distinta
    let exchangeRate = dto.exchange_rate;
    let rateType = dto.rate_type;
    let convertedAmount = dto.amount;

    const destCurrency = await this.getDestCurrencyCode(dto.dest_type, dto.dest_id);
    if (destCurrency && destCurrency !== dto.currency_code) {
      if (!exchangeRate) {
        const rateResult = await this.exchangeService.convertAmount(
          dto.amount,
          dto.currency_code,
          destCurrency,
          rateType,
        );
        exchangeRate = rateResult.rate;
        convertedAmount = rateResult.converted_amount;
      } else {
        convertedAmount = dto.amount * exchangeRate;
      }
    }

    // 4. Ejecutar en transacción
    return this.prisma.$transaction(async (tx) => {
      // Descontar de origen
      await this.adjustBalance(tx, dto.source_type, dto.source_id, dto.currency_code, -dto.amount);

      // Sumar a destino
      await this.adjustBalance(tx, dto.dest_type, dto.dest_id, destCurrency ?? dto.currency_code, convertedAmount);

      // Crear movimiento en origen
      const sourceBalanceBefore = sourceBalance;
      const sourceBalanceAfter = sourceBalance - dto.amount;
      await this.createMovement(tx, {
        source_type: dto.source_type,
        source_id: dto.source_id,
        type: AccountEntryType.TRANSFER_OUT,
        amount: -dto.amount,
        currency_code: dto.currency_code,
        balance_before: sourceBalanceBefore,
        balance_after: sourceBalanceAfter,
        description: dto.description ?? `Transferencia a ${dto.dest_type}`,
        reference_type: 'cash_box_transfer',
        reference_id: null, // Se setea después
      });

      // Crear movimiento en destino
      const destBalanceBefore = await this.getBalance(tx, dto.dest_type, dto.dest_id, destCurrency ?? dto.currency_code);
      const destBalanceAfter = destBalanceBefore + convertedAmount;
      await this.createMovement(tx, {
        source_type: dto.dest_type,
        source_id: dto.dest_id,
        type: AccountEntryType.TRANSFER_IN,
        amount: convertedAmount,
        currency_code: destCurrency ?? dto.currency_code,
        exchange_rate: exchangeRate,
        rate_type: rateType,
        balance_before: destBalanceBefore,
        balance_after: destBalanceAfter,
        description: dto.description ?? `Transferencia desde ${dto.source_type}`,
        reference_type: 'cash_box_transfer',
        reference_id: null,
      });

      // Crear registro de transferencia
      const transfer = await tx.cash_box_transfers.create({
        data: {
          source_type: dto.source_type,
          source_id: dto.source_id,
          dest_type: dto.dest_type,
          dest_id: dto.dest_id,
          amount: dto.amount,
          currency_code: dto.currency_code,
          exchange_rate: exchangeRate,
          rate_type: rateType,
          converted_amount: convertedAmount !== dto.amount ? convertedAmount : null,
          description: dto.description,
          reference: dto.reference,
          transfer_type: 'manual',
          status: 'completed',
          created_by: userId,
        },
      });

      return transfer;
    });
  }

  async findAll() {
    return this.prisma.cash_box_transfers.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const transfer = await this.prisma.cash_box_transfers.findFirst({
      where: { id, deleted_at: null },
    });
    if (!transfer) {
      throw new NotFoundException('Transferencia no encontrada');
    }
    return transfer;
  }

  async findByCashBox(cashBoxId: string) {
    return this.prisma.cash_box_transfers.findMany({
      where: {
        deleted_at: null,
        OR: [
          { source_type: 'cash_box', source_id: cashBoxId },
          { dest_type: 'cash_box', dest_id: cashBoxId },
        ],
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getMainCashBox() {
    const mainBox = await this.prisma.cash_boxes.findFirst({
      where: { is_main: true, deleted_at: null },
    });
    if (!mainBox) {
      throw new NotFoundException('No existe caja principal');
    }
    return mainBox;
  }

  // Métodos privados de ayuda
  private async getBalance(
    type: string,
    id: string,
    currencyCode: string,
    tx?: any,
  ): Promise<number> {
    const prisma = tx ?? this.prisma;
    if (type === 'cash_box') {
      const balance = await prisma.cash_box_balances.findFirst({
        where: { cash_box_id: id, currency_code: currencyCode, deleted_at: null },
      });
      return Number(balance?.balance ?? 0);
    } else if (type === 'bank_account') {
      const account = await prisma.bank_accounts.findFirst({
        where: { id, deleted_at: null },
      });
      return Number(account?.balance ?? 0);
    }
    return 0;
  }

  private async getDestCurrencyCode(type: string, id: string): Promise<string | null> {
    if (type === 'cash_box') {
      const balance = await this.prisma.cash_box_balances.findFirst({
        where: { cash_box_id: id, deleted_at: null },
      });
      return balance?.currency_code ?? null;
    } else if (type === 'bank_account') {
      const account = await this.prisma.bank_accounts.findFirst({
        where: { id, deleted_at: null },
      });
      return account?.currency_code ?? null;
    }
    return null;
  }

  private async adjustBalance(
    tx: any,
    type: string,
    id: string,
    currencyCode: string,
    amount: number,
  ) {
    if (type === 'cash_box') {
      await tx.cash_box_balances.updateMany({
        where: { cash_box_id: id, currency_code: currencyCode },
        data: { balance: { increment: amount } },
      });
    } else if (type === 'bank_account') {
      await tx.bank_accounts.update({
        where: { id },
        data: { balance: { increment: amount } },
      });
    }
  }

  private async createMovement(tx: any, data: {
    source_type: string;
    source_id: string;
    type: AccountEntryType;
    amount: number;
    currency_code: string;
    exchange_rate?: number;
    rate_type?: CurrencyRateType;
    balance_before: number;
    balance_after: number;
    description: string;
    reference_type: string;
    reference_id: string | null;
  }) {
    if (data.source_type === 'cash_box') {
      return tx.cash_box_movements.create({
        data: {
          cash_box_id: data.source_id,
          type: data.type,
          amount: data.amount,
          currency_code: data.currency_code,
          exchange_rate: data.exchange_rate,
          balance_before: data.balance_before,
          balance_after: data.balance_after,
          description: data.description,
          reference_type: data.reference_type,
          reference_id: data.reference_id,
        },
      });
    } else if (data.source_type === 'bank_account') {
      return tx.bank_account_movements.create({
        data: {
          bank_account_id: data.source_id,
          type: data.type,
          amount: data.amount,
          currency_code: data.currency_code,
          exchange_rate: data.exchange_rate,
          balance_before: data.balance_before,
          balance_after: data.balance_after,
          description: data.description,
          reference_type: data.reference_type,
          reference_id: data.reference_id,
        },
      });
    }
  }
}
```

#### 14.4.2 `cash-box-closure.service.ts`

```typescript
// src/modules/tesoreria/services/cash-box-closure.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CloseCashBoxDto } from '../dto/close-cash-box.dto';
import { CashBoxTransfersService } from './cash-box-transfers.service';
import { AccountEntryType, CashBoxSessionStatus } from '@/generated/prisma/enums';

@Injectable()
export class CashBoxClosureService {
  constructor(
    private db: PrismaService,
    private transfersService: CashBoxTransfersService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async closeSession(cashBoxId: string, dto: CloseCashBoxDto, userId: string) {
    // 1. Buscar sesión abierta
    const session = await this.prisma.cash_box_sessions.findFirst({
      where: {
        cash_box_id: cashBoxId,
        status: 'OPEN',
        deleted_at: null,
      },
    });

    if (!session) {
      throw new BadRequestException('No hay sesión abierta para esta caja');
    }

    // 2. Calcular saldo teórico
    const movements = await this.prisma.cash_box_movements.findMany({
      where: {
        cash_box_id: cashBoxId,
        session_id: session.id,
        deleted_at: null,
      },
    });

    const closingBalance = movements.reduce(
      (sum, m) => sum + Number(m.amount),
      Number(session.opening_balance),
    );

    const difference = dto.actual_balance - closingBalance;

    // 3. Cerrar sesión
    const closedSession = await this.prisma.cash_box_sessions.update({
      where: { id: session.id },
      data: {
        status: CashBoxSessionStatus.CLOSED,
        closed_at: new Date(),
        closing_balance: closingBalance,
        actual_balance: dto.actual_balance,
        difference: difference,
      },
    });

    // 4. Ejecutar transferencia automática si está habilitada
    if (dto.auto_transfer && dto.transfer_dest_id && dto.transfer_dest_type) {
      // Obtener moneda de la caja origen
      const sourceBalance = await this.prisma.cash_box_balances.findFirst({
        where: { cash_box_id: cashBoxId, deleted_at: null },
      });

      if (sourceBalance && dto.actual_balance > 0) {
        await this.transfersService.create(
          {
            source_type: 'cash_box',
            source_id: cashBoxId,
            dest_type: dto.transfer_dest_type,
            dest_id: dto.transfer_dest_id,
            amount: dto.actual_balance,
            currency_code: sourceBalance.currency_code,
            description: `Transferencia automática al cerrar sesión ${session.id}`,
          },
          userId,
        );

        // Actualizar sesión con datos de transferencia
        await this.prisma.cash_box_sessions.update({
          where: { id: session.id },
          data: {
            auto_transfer_enabled: true,
            transfer_dest_id: dto.transfer_dest_id,
            transfer_dest_type: dto.transfer_dest_type,
            transferred_amount: dto.actual_balance,
            transferred_at: new Date(),
          },
        });
      }
    }

    // 5. Actualizar caja
    await this.prisma.cash_boxes.update({
      where: { id: cashBoxId },
      data: {
        current_session_id: null,
        last_session_closed_at: new Date(),
      },
    });

    return closedSession;
  }
}
```

### 14.5 Controller

```typescript
// src/modules/tesoreria/controllers/cash-box-transfers.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CashBoxTransfersService } from '../services/cash-box-transfers.service';
import { CreateCashBoxTransferDto } from '../dto/create-cash-box-transfer.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('cash-box-transfers')
export class CashBoxTransfersController {
  constructor(private readonly transfersService: CashBoxTransfersService) {}

  @Post()
  // @RequirePermissions('cash-boxes.create')
  create(
    @Body() dto: CreateCashBoxTransferDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transfersService.create(dto, user.id);
  }

  @Get()
  // @RequirePermissions('cash-boxes.read')
  findAll() {
    return this.transfersService.findAll();
  }

  @Get('main')
  // @RequirePermissions('cash-boxes.read')
  getMainCashBox() {
    return this.transfersService.getMainCashBox();
  }

  @Get(':id')
  // @RequirePermissions('cash-boxes.read')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }
}
```

#### 14.5.1 Endpoint adicional en CashBoxesController

```typescript
// Agregar al controller de cash_boxes existente:

@Get(':id/transfers')
// @RequirePermissions('cash-boxes.read')
getTransfers(@Param('id') id: string) {
  return this.transfersService.findByCashBox(id);
}
```

### 14.6 Helper

```typescript
// src/modules/tesoreria/helpers/transfer.helper.ts

export class TransferHelper {
  /**
   * Valida que el tipo de transferencia sea válido
   */
  static isValidTransferType(type: string): boolean {
    return ['manual', 'auto_close', 'compensation'].includes(type);
  }

  /**
   * Valida que source y dest sean del mismo tipo (ambos cash_box o ambos bank_account)
   * o de tipos diferentes (cash_box <-> bank_account)
   */
  static isValidTransferPair(
    sourceType: string,
    destType: string,
  ): boolean {
    const validTypes = ['cash_box', 'bank_account'];
    return (
      validTypes.includes(sourceType) &&
      validTypes.includes(destType) &&
      sourceType !== destType
    );
  }

  /**
   * Calcula el monto convertido usando la tasa de cambio
   */
  static convertAmount(
    amount: number,
    exchangeRate: number,
  ): number {
    return Math.round(amount * exchangeRate * 100) / 100;
  }

  /**
   * Genera descripción por defecto para la transferencia
   */
  static generateDescription(
    sourceType: string,
    destType: string,
    amount: number,
    currencyCode: string,
  ): string {
    const sourceLabel = sourceType === 'cash_box' ? 'Caja' : 'Banco';
    const destLabel = destType === 'cash_box' ? 'Caja' : 'Banco';
    return `Transferencia ${amount} ${currencyCode} de ${sourceLabel} a ${destLabel}`;
  }
}
```

### 14.7 Estructura de Archivos (agregar)

```
src/modules/tesoreria/
├── dto/
│   ├── create-cash-box-transfer.dto.ts    // NUEVO
│   └── close-cash-box.dto.ts              // ACTUALIZADO
├── controllers/
│   └── cash-box-transfers.controller.ts   // NUEVO
├── services/
│   ├── cash-box-transfers.service.ts      // NUEVO
│   └── cash-box-closure.service.ts        // NUEVO
└── helpers/
    └── transfer.helper.ts                 // NUEVO
```

### 14.8 Flujos de Implementación

#### Flujo A: Cierre con Transferencia Automática

```
POST /cash-boxes/:id/close {
  actual_balance: 14800,
  auto_transfer: true,
  transfer_dest_id: "caja-principal-uuid",
  transfer_dest_type: "cash_box"
}

→ 1. Cierra sesión (status: CLOSED, actual_balance: 14800)
→ 2. Descuenta de caja origen: 14800
→ 3. Suma a caja destino: 14800
→ 4. Registra cash_box_transfers (transfer_type: "auto_close")
→ 5. Registra movimientos en ambas cajas (TRANSFER_OUT + TRANSFER_IN)
→ 6. Actualiza sesión con datos de transferencia
```

#### Flujo B: Transferencia Manual Caja → Caja

```
POST /cash-box-transfers {
  source_type: "cash_box",
  source_id: "caja-norte-uuid",
  dest_type: "cash_box",
  dest_id: "caja-sur-uuid",
  amount: 50000,
  currency_code: "ARS"
}

→ 1. Verifica fondos en origen (≥ 50000 ARS)
→ 2. Descuenta origen: -50000
→ 3. Suma destino: +50000
→ 4. Crea movimientos (TRANSFER_OUT + TRANSFER_IN)
→ 5. Registra transferencia
```

#### Flujo C: Caja ↔ Banco

```
POST /cash-box-transfers {
  source_type: "cash_box",
  source_id: "caja-principal-uuid",
  dest_type: "bank_account",
  dest_id: "cuenta-nacion-uuid",
  amount: 100000,
  currency_code: "ARS"
}

→ 1. Verifica fondos en caja (≥ 100000 ARS)
→ 2. Descuenta caja: -100000
→ 3. Suma banco: +100000
→ 4. Crea movimientos en ambas entidades
→ 5. Registra transferencia
```

### 14.9 Endpoints Nuevos

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/cash-box-transfers` | Transferir entre cajas/bancos | `cash-boxes.create` |
| GET | `/cash-box-transfers` | Listar transferencias | `cash-boxes.read` |
| GET | `/cash-box-transfers/:id` | Detalle de transferencia | `cash-boxes.read` |
| GET | `/cash-boxes/:id/transfers` | Transferencias de una caja | `cash-boxes.read` |
| GET | `/cash-boxes/main` | Obtener caja principal | `cash-boxes.read` |

### 14.10 Checklist de Implementación

- [ ] Modelo `cash_box_transfers` creado en Prisma schema
- [ ] Campo `is_main` agregado a `cash_boxes`
- [ ] Campos de transferencia agregados a `cash_box_sessions`
- [ ] `TRANSFER_OUT` y `TRANSFER_IN` agregados a `AccountEntryType`
- [ ] `CreateCashBoxTransferDto` implementado
- [ ] `CloseCashBoxDto` actualizado con campos de transferencia
- [ ] `CashBoxTransfersService` implementado
- [ ] `CashBoxClosureService` implementado
- [ ] `POST /cash-box-transfers` funcionando
- [ ] `GET /cash-box-transfers` funcionando
- [ ] `GET /cash-box-transfers/:id` funcionando
- [ ] `GET /cash-boxes/:id/transfers` funcionando
- [ ] `GET /cash-boxes/main` funcionando
- [ ] Flujo caja → caja funcionando
- [ ] Flujo caja ↔ banco funcionando
- [ ] Flujo cierre con transferencia auto/manual funcionando
- [ ] Validación: solo una principal por empresa
- [ ] Validación: fondos suficientes antes de transferir
- [ ] Validación: conversión con ExchangeService si moneda distinta
- [ ] Migración de base de datos ejecutada
- [ ] Pruebas unitarias escritas

---

## Parte 15: Identificación de Terceros - Enum PartyType

### 15.1 Cambio en `business_parties`

```prisma
// prisma/schema/parties.prisma - Modificar:

model business_parties {
  // ... campos existentes ...
  type            PartyType        // ← Cambiar de String a PartyType enum
  // ... resto igual ...
}
```

### 15.2 Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────────┐
│  PUBLIC SCHEMA                                          │
│  users (identidad, login)                               │
│    ├── employee_id → employees (opcional)               │
│    └── partner_id  → partners (opcional)                │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  TENANT SCHEMA                                          │
│                                                         │
│  business_parties (type=EMPLOYEE)                       │
│    ├── id ──────────────► employees.party_id            │
│    ├── contacts, locations (datos legales/tributarios)  │
│    └── CUIT, nombre legal, dirección                    │
│                                                         │
│  employees (datos específicos de RRHH)                  │
│    ├── position, department, salary                     │
│    ├── user_id → users (acceso al sistema)              │
│    └── responsible de cash_boxes                        │
│                                                         │
│  partners (datos de ownership)                          │
│    ├── share_percentage, capital_contributed            │
│    └── user_id → users (acceso al sistema)              │
└─────────────────────────────────────────────────────────┘
```

### 15.3 Creación de Empleado (Flujo)

```
Paso 1: Crear business_party con type=EMPLOYEE
  → POST /master-data/business-parties {
      type: "EMPLOYEE",
      name: "Juan Pérez",
      tax_id: "20-12345678-9"
    }
  → Retorna: { id: "uuid-1", type: "EMPLOYEE", ... }

Paso 2: Crear employee vinculado
  → POST /employees {
      party_id: "uuid-1",        ← FK al business_party
      first_name: "Juan",
      last_name: "Pérez",
      position: "Cajero",
      user_id: "user-uuid"       ← opcional, para acceso al sistema
    }
  → Employee vinculado al business_party
```

### 15.4 Creación de Socio (Flujo)

```
Paso 1: Crear business_party con type=PARTNER
  → POST /master-data/business-parties {
      type: "PARTNER",
      name: "María López",
      tax_id: "23-98765432-1"
    }
  → Retorna: { id: "uuid-2", type: "PARTNER", ... }

Paso 2: Crear partner vinculado
  → POST /partners {
      party_id: "uuid-2",
      first_name: "María",
      last_name: "López",
      share_percentage: 30.5,
      capital_contributed: 500000,
      user_id: "user-uuid-2"     ← opcional
    }
```

### 15.5 Consultas por Tipo

```typescript
// Todos los empleados con datos legales
const employees = await prisma.business_parties.findMany({
  where: { type: 'EMPLOYEE', deleted_at: null },
  include: { employee: true }
});

// Todos los socios con datos de ownership
const partners = await prisma.business_parties.findMany({
  where: { type: 'PARTNER', deleted_at: null },
  include: { partner: true }
});

// Proveedores (como ahora)
const suppliers = await prisma.business_parties.findMany({
  where: { type: 'SUPPLIER', deleted_at: null }
});

// Clientes (como ahora)
const customers = await prisma.business_parties.findMany({
  where: { type: 'CUSTOMER', deleted_at: null }
});
```

### 15.6 Migración de Datos Existentes

```typescript
// Valores actuales en la DB (texto libre) → mapear a enum:
// "client" / "customer" → CUSTOMER
// "supplier" / "proveedor" → SUPPLIER
// (employees y partners no existen aún, se crean con el enum correcto)
```

### 15.7 Relación con Tesorería

```
employees
  ├── party_id → business_parties (datos legales del empleado)
  ├── user_id → users (login al sistema)
  ├── [reverse] ← cash_boxes.responsible_id (quién es responsable)
  └── [reverse] ← cash_box_movements.employee_id (quién hizo el movimiento)

partners
  ├── party_id → business_parties (datos legales del socio)
  ├── user_id → users (login al sistema)
  └── (sin relación directa con tesorería)
```

### 15.8 Checklist

- [ ] Enum `PartyType` creado en `prisma/schema/enums.prisma`
- [ ] `business_parties.type` cambiado de `String` a `PartyType`
- [ ] Migración de datos existentes (texto libre → enum)
- [ ] DTO de `business_parties` actualizado para usar el enum
- [ ] Servicio de `business_parties` validado con el enum
- [ ] EmployeeService crea business_party + employee en flujo de 2 pasos
- [ ] PartnerService crea business_party + partner en flujo de 2 pasos

---

## Parte 11: Verificaciones Finales

- [ ] Todos los modelos tienen `@@schema("tenant")`
- [ ] Todos los modelos tienen soft delete (`deleted_at`, `deleted_by`)
- [ ] Todos los modelos tienen auditoría (`created_by`, `updated_by`)
- [ ] Todos los IDs son UUID v4
- [ ] Montos usan `Decimal(15, 2)`
- [ ] Permisos definidos en seed
- [ ] Guards aplicados en controllers
- [ ] Integración con documents (paid_amount)
- [ ] Integración con business_parties
- [ ] Integración con users (employee_id, partner_id)
- [ ] Modelo credit_cards con configuración de comisiones y clearing
- [ ] Modelo credit_card_transactions con estados de acreditación
- [ ] Modelo credit_card_installments para cuotas individuales
- [ ] Modelo credit_card_summaries para resúmenes mensuales
- [ ] Scheduler de acreditación configurado
- [ ] Scheduler de notificación de cheques configurado
- [ ] Scheduler de procesamiento de cheques configurado
- [ ] Scheduler de cierre forzado de cajas configurado
- [ ] Guard CashBoxSessionGuard implementado
- [ ] Flujos de apertura/cierre de sesiones implementados
- [ ] Flujos de cierre forzado implementados
- [ ] Control de acceso por sesión funcionando
- [ ] Flujos de cobro (cliente paga con tarjeta) implementados
- [ ] Flujos de pago (empresa compra con tarjeta) implementados
- [ ] Flujo de cheques propios (híbrido) implementado

### Multi-Moneda
- [ ] Modelo cash_box_balances creado con @@unique([cash_box_id, currency_code])
- [ ] cash_boxes: current_balance y currency_code eliminados (usar cash_box_balances)
- [ ] payments: exchange_rate, rate_type, converted_amount, exchange_note agregados
- [ ] current_account_entries: currency_code, exchange_rate agregados
- [ ] cash_box_movements: currency_code, exchange_rate agregados
- [ ] bank_account_movements: currency_code, exchange_rate agregados
- [ ] credit_card_transactions: rate_type, converted_amount, net_currency_code, net_exchange_rate agregados
- [ ] credit_card_installments: currency_code, exchange_rate, paid_currency_code, paid_exchange_rate agregados
- [ ] credit_card_summaries: currency_code, display_currency_code, display_exchange_rate, display_* agregados
- [ ] credit_card_summary_items: currency_code agregado
- [ ] Validación: exchange_rate obligatorio cuando hay conversión de moneda
- [ ] Validación de rango de tasa manual (warning, no bloqueo)
- [ ] Endpoint GET /currency-rates/current implementado
- [ ] PaymentsService inyecta ExchangeService
- [ ] Selector de tipo de cambio en frontend funciona
- [ ] Conversión de moneda en pagos/cobros implementada
- [ ] Libro mayor siempre muestra en moneda del tercero
- [ ] Cheques rechazados usan moneda del pago original
- [ ] Tarjetas de crédito soportan multi-moneda correctamente

### Transferencias y Caja Principal
- [ ] Modelo `cash_box_transfers` creado con `@@schema("tenant")`
- [ ] Campo `is_main` agregado a `cash_boxes` (default false)
- [ ] Campos de transferencia en `cash_box_sessions`: `auto_transfer_enabled`, `transfer_dest_id`, `transfer_dest_type`, `transferred_amount`, `transferred_at`
- [ ] `TRANSFER_OUT` y `TRANSFER_IN` agregados a `AccountEntryType`
- [ ] `CreateCashBoxTransferDto` con validaciones de source/dest types
- [ ] `CloseCashBoxDto` actualizado con `auto_transfer`, `transfer_dest_id`, `transfer_dest_type`
- [ ] `CashBoxTransfersService` con create, findAll, findOne, findByCashBox, getMainCashBox
- [ ] `CashBoxClosureService` con closeSession (incluye transferencia automática)
- [ ] Endpoint `POST /cash-box-transfers` funcionando
- [ ] Endpoint `GET /cash-box-transfers` funcionando
- [ ] Endpoint `GET /cash-box-transfers/:id` funcionando
- [ ] Endpoint `GET /cash-boxes/:id/transfers` funcionando
- [ ] Endpoint `GET /cash-boxes/main` funcionando
- [ ] Flujo caja → caja con verificación de fondos
- [ ] Flujo caja ↔ banco con verificación de fondos
- [ ] Flujo cierre con transferencia automática (auto_close)
- [ ] Flujo cierre con transferencia manual
- [ ] Conversión de moneda con ExchangeService en transferencias
- [ ] Movimientos registrados en ambas entidades (TRANSFER_OUT + TRANSFER_IN)
- [ ] Validación: solo una caja principal por empresa
- [ ] Validación: fondos suficientes antes de transferir
- [ ] Migración de base de datos ejecutada
- [ ] TransferHelper con métodos de validación y cálculo

### Identificación de Terceros (PartyType)
- [ ] Enum `PartyType` creado (CUSTOMER, SUPPLIER, EMPLOYEE, PARTNER)
- [ ] `business_parties.type` cambiado de `String` a `PartyType`
- [ ] Migración de datos existentes (texto libre → enum)
- [ ] EmployeeService crea business_party + employee en flujo de 2 pasos
- [ ] PartnerService crea business_party + partner en flujo de 2 pasos
- [ ] Consultas por tipo funcionan (employees, partners, suppliers, customers)
- [ ] Employee vinculado a cash_boxes como responsible
- [ ] Employee vinculado a cash_box_movements como actor
