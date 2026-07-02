# Asterisk Suite Backend - Codebase Guide

## Overview

Multi-tenant ERP/logistics backend: **NestJS 11 + Prisma 7 + PostgreSQL**.
Each company gets its own database (`{subdomain}_db`). Shared `public` database for global identity.

## Tech Stack

- **Runtime**: Node.js 20, **Package Manager**: pnpm, **Language**: TypeScript 5.7
- **ORM**: Prisma 7 (`@prisma/adapter-pg`), **Auth**: Passport-JWT + refresh token rotation
- **Port**: 3000, **Prefix**: `/api`

## Quick Commands

```bash
pnpm run start:dev      # Dev server with watch
pnpm run build          # Production build
pnpm run lint           # ESLint
pnpm run test           # Unit tests
pnpm run test:e2e       # E2E tests
pnpm run seed:rbac      # Seed RBAC permissions/roles
```

## Project Structure

```
src/
├── main.ts                    # Bootstrap, CORS, ValidationPipe, RequestContextInterceptor
├── app.module.ts              # Root: imports all modules, applies TenantMiddleware
├── prisma/                    # Multi-tenant Prisma client manager
│   ├── prisma.service.ts      # CORE: caches per-tenant connections, resolves from AsyncLocalStorage
│   └── audit.extension.ts     # Prisma $extends: auto-writes audit_logs on create/update/delete
├── auth/                      # JWT auth: login, register, refresh, logout, change-password
├── access-control/            # RBAC: roles, permissions, authorization guard
├── common/                    # Middleware (tenant), guards, interceptors, utilities
│   ├── middleware/tenant.middleware.ts    # Extracts subdomain → resolves tenant DB
│   └── guards/tenant-access.guard.ts     # APP_GUARD: validates JWT + tenant membership
├── modules/
│   ├── core/companies/        # Company CRUD (creates DB, runs migrations, seeds RBAC)
│   ├── master-data/           # Products, Locations, BusinessParties, Contacts, DocumentSequences
│   ├── erp/                   # Taxes, Currencies, Accounts, Documents (sales/purchases), Pricing
│   ├── logistica/             # Transport (drivers, vehicles, trips, corridors), Warehouse, Picking
│   ├── inventory/             # Attributes, Categories, Tags, Units
│   └── trash/                 # Generic soft-delete/restore/hard-delete for ~50 models
└── data-import/               # Excel import pipeline: product prices, purchases, sales
```

## Architecture Patterns

### Multi-Tenant (Database-per-Tenant)
- Each company = separate PostgreSQL database with `tenant` and `public` schemas
- `TenantMiddleware` resolves tenant from `X-Tenant` header / subdomain
- `PrismaService.getClientForCurrentContext()` returns correct client per request
- Connection pool: max 5 per tenant, cached in Map

### Request Context (AsyncLocalStorage)
- Stores: `schema`, `companyId`, `userId`, `ip`
- `RequestContextInterceptor` populates userId/ip
- All services access via `this.db.getClientForCurrentContext()`

### Guard Chain (per request)
```
TenantMiddleware → TenantAccessGuard → JwtAuthGuard → PermissionsGuard
```
- OWNER role in `company_users` bypasses PermissionsGuard
- DENY override > ALLOW override > role permission > default deny

### Soft Delete
- All tenant models have `deleted_at`, `deleted_by` fields
- Queries always filter `deleted_at: null`
- TrashService provides generic soft-delete/restore/hard-delete

### Audit Trail
- Prisma `$extends` intercepts all create/update/delete
- Writes to `public.audit_logs` with old/new data, userId, IP

## Key Business Flows

### Company Creation
1. Creates new PostgreSQL database
2. Runs `prisma migrate diff --from-empty` for all tables
3. Seeds RBAC: permissions + 4 default roles (admin, manager, user, viewer)
4. Assigns OWNER to creating user

### Authentication
1. Login → validates bcrypt → JWT (24h) + refresh token (7d, SHA-256 hash)
2. Refresh → rotation with 60s grace window
3. Change password → revokes all sessions

### Authorization (per request)
1. TenantMiddleware resolves tenant DB name
2. TenantAccessGuard validates JWT + company membership
3. PermissionsGuard checks @RequirePermissions() against effective permissions

### Pricing
- `PricingEngineService.resolveProductPrice()` with currency conversion
- `resolveItemWithTaxes()` calculates taxable base + tax breakdown

### Stock/Picking
- Create movement → updates `warehouse_stock` (prevents negative)
- Picking order → reserves stock → execution deducts quantity + reserved
- Pallet transfer → OUT at source, IN at destination

## Database Models (55+ models)

### Public Schema (shared)
`users`, `companies`, `company_users`, `refresh_tokens`, `audit_logs`

### Tenant Schema (business)
- **Identity**: `permissions`, `business_roles`, `business_role_permissions`, `business_user_roles`, `user_permission_overrides`
- **Products**: `products`, `product_variants`, `product_components` (BOM), `product_price`, `product_costs`, `product_cost_breakdowns`, `product_categories`, `product_tags`, `product_attribute_values`, `categories`, `tags`, `attributes`, `units`
- **ERP**: `documents`, `document_items`, `document_item_taxes`, `document_taxes`, `document_types`, `document_sequences`, `taxes`, `currencies`, `currency_rates`, `accounts`
- **Transport**: `drivers`, `vehicles`, `vehicle_combinations`, `trips`, `trip_stops`, `corridors`, `dispatch_orders`, `delivery_notes`
- **Warehouse**: `warehouses`, `warehouse_stock`, `warehouse_stock_movements`, `pallets`, `pallet_items`, `picking_orders`, `picking_items`, `picking_sources`, `picking_results`
- **Other**: `business_parties`, `party_contacts`, `locations`, `files`, `entity_photos`

## Permission Convention

Format: `{module}.{action}` (e.g., `products.read`, `picking.execute`)
Default roles: admin (full), manager, user, viewer
RBAC fully built but mostly commented out in controllers (only JwtAuthGuard active)

## Key Config Files

- `.env` — PORT, JWT_SECRET, DATABASE_URL_BASE, DATABASE_URL_PUBLIC
- `prisma.config.ts` — schema dir, migrations, seed command
- `nest-cli.json` — copies generated Prisma models to dist
- `tsconfig.json` — ES2023, NodeNext, path alias `@/*` → `src/*`

## Code Conventions

- DTOs: `class-validator` for validation, `class-transformer` for transformation
- Services inject `PrismaService` via `this.db.getClientForCurrentContext()`
- Controllers use `@UseGuards(JwtAuthGuard)` and `@RequirePermissions()` (currently commented out)
- All tenant queries include `where: { deleted_at: null }`
- Soft delete via TrashService: `softDelete()`, `restore()`, `hardDelete()`

## Data Import Pipeline

Generic `ImportPipeline<TRaw, TTransformed>` with 4 stages:
1. **DataSource** (Excel reader)
2. **Parser** (row validation, error tracking)
3. **Transformer** (business logic)
4. **Sink** (DB upserts)

Used for: product prices, purchases, sales, credit/debit notes
