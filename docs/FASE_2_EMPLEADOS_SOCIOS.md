# Fase 2: CRUD Empleados y Socios — Documentación

**Fecha:** 2026-07-10
**Estado:** Completado
**Epic:** Módulo de Tesorería (AS-278)
**Subtareas cubiertas:** T-2.1 a T-2.10

---

## Objetivo

Implementar los módulos CRUD completos (module, controller, service, DTOs) para Empleados y Socios, registrados en la capa de módulos ERP.

### Arquitectura Multi-DB

- `public.users` → base de datos compartida
- `tenant.employees/partners` → base de datos de la empresa
- **Sin relaciones Prisma cross-DB** — solo coincidencia de UUIDs
- Resolución manual en services: `getDefaultClient()` (public) + `getClientForCurrentContext()` (tenant)

---

## Archivos Creados

### Employees — `src/modules/erp/employees/`

| Archivo | Descripción |
|---------|-------------|
| `employees.module.ts` | Módulo NestJS con providers y exports |
| `employees.controller.ts` | Controller con 8 endpoints (CRUD + link/unlink) |
| `employees.service.ts` | Service con lógica de negocio + user creation + cross-DB |
| `dto/create-employee.dto.ts` | DTO de creación con `create_user` opcional |
| `dto/update-employee.dto.ts` | DTO de actualización (PartialType) |
| `dto/create-user.dto.ts` | DTO para crear usuario desde employee |
| `dto/link-user.dto.ts` | DTO para vincular usuario existente |

### Partners — `src/modules/erp/partners/`

| Archivo | Descripción |
|---------|-------------|
| `partners.module.ts` | Módulo NestJS con providers y exports |
| `partners.controller.ts` | Controller con 8 endpoints (CRUD + link/unlink) |
| `partners.service.ts` | Service con lógica de negocio + user creation + cross-DB |
| `dto/create-partner.dto.ts` | DTO de creación con `create_user` opcional |
| `dto/update-partner.dto.ts` | DTO de actualización (PartialType) |

### Modificado

| Archivo | Cambio |
|---------|--------|
| `src/modules/erp/erp.modules.ts` | Import/export de `EmployeesModule` y `PartnersModule` |
| `src/auth/dto/register.dto.ts` | Agregados `link_employee_id` y `link_partner_id` |
| `src/auth/auth.service.ts` | Register vincula employee/partner si se solicita |

---

## Endpoints

### Employees — `/api/erp/employees`

| Método | Ruta | Descripción | Permiso (futuro) |
|--------|------|-------------|------------------|
| `POST` | `/api/erp/employees` | Crear empleado (opcional: `user_id` o `create_user`) | `employees.create` |
| `GET` | `/api/erp/employees` | Listar todos | `employees.read` |
| `GET` | `/api/erp/employees/:id` | Obtener uno (con user resuelto cross-DB) | `employees.read` |
| `PATCH` | `/api/erp/employees/:id` | Actualizar | `employees.update` |
| `PATCH` | `/api/erp/employees/:id/link-user` | Vincular con user existente | `employees.update` |
| `PATCH` | `/api/erp/employees/:id/unlink-user` | Desvincular user | `employees.update` |
| `DELETE` | `/api/erp/employees/:id` | Soft delete | `employees.delete` |

### Partners — `/api/erp/partners`

| Método | Ruta | Descripción | Permiso (futuro) |
|--------|------|-------------|------------------|
| `POST` | `/api/erp/partners` | Crear socio (opcional: `user_id` o `create_user`) | `partners.create` |
| `GET` | `/api/erp/partners` | Listar todos | `partners.read` |
| `GET` | `/api/erp/partners/:id` | Obtener uno (con user resuelto cross-DB) | `partners.read` |
| `PATCH` | `/api/erp/partners/:id` | Actualizar | `partners.update` |
| `PATCH` | `/api/erp/partners/:id/link-user` | Vincular con user existente | `partners.update` |
| `PATCH` | `/api/erp/partners/:id/unlink-user` | Desvincular user | `partners.update` |
| `DELETE` | `/api/erp/partners/:id` | Soft delete | `partners.delete` |

### Auth — `/api/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Crear user (opcional: `link_employee_id` o `link_partner_id` con x-tenant header) |

---

## DTOs

### CreateEmployeeDto

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `party_id` | UUID | No | `@IsUUID()` |
| `user_id` | UUID | No | `@IsUUID()` — vincula user existente |
| `create_user` | object | No | `@ValidateNested()` — crea user nuevo y vincula |
| `create_user.name` | string | Sí (si create_user) | `@IsString()` |
| `create_user.email` | string | Sí (si create_user) | `@IsEmail()` |
| `create_user.password` | string | Sí (si create_user) | `@MinLength(6)` |
| `create_user.role` | string | No | Default: `'user'` |
| `first_name` | string | **Sí** | `@IsString()`, `@MaxLength(100)` |
| `last_name` | string | **Sí** | `@IsString()`, `@MaxLength(100)` |
| `document_type` | string | No | `@MaxLength(20)` |
| `document_number` | string | No | `@MaxLength(20)` |
| `position` | string | No | `@MaxLength(100)` |
| `department` | string | No | `@MaxLength(100)` |
| `hire_date` | string | No | `@IsDateString()` |
| `salary` | string | No | `@IsString()` |
| `currency_code` | string | No | Default: `'USD'` |
| `is_active` | boolean | No | Default: `true` |

**Nota**: No se puede enviar `user_id` y `create_user` al mismo tiempo.

### CreatePartnerDto

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `party_id` | UUID | No | `@IsUUID()` |
| `user_id` | UUID | No | `@IsUUID()` — vincula user existente |
| `create_user` | object | No | `@ValidateNested()` — crea user nuevo y vincula |
| `create_user.name` | string | Sí (si create_user) | `@IsString()` |
| `create_user.email` | string | Sí (si create_user) | `@IsEmail()` |
| `create_user.password` | string | Sí (si create_user) | `@MinLength(6)` |
| `create_user.role` | string | No | Default: `'user'` |
| `first_name` | string | **Sí** | `@IsString()`, `@MaxLength(100)` |
| `last_name` | string | **Sí** | `@IsString()`, `@MaxLength(100)` |
| `document_type` | string | No | `@MaxLength(20)` |
| `document_number` | string | No | `@MaxLength(20)` |
| `share_percentage` | string | No | `@IsString()` |
| `capital_contributed` | string | No | `@IsString()` |
| `is_active` | boolean | No | Default: `true` |

**Update DTOs**: Extienden `PartialType(CreateDto)` → todos los campos opcionales.

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

## Patrones Utilizados

### Service Pattern

```typescript
@Injectable()
export class EmployeesService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }
  // ... methods using this.prisma.employees.*
}
```

### Controller Pattern

```typescript
@UseGuards(JwtAuthGuard)
@Controller('erp/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // @RequirePermissions('employees.create')  // Comentado, activar por módulo
  @Post()
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: AuthUser) {
    return this.employeesService.create(dto, user.id);
  }
  // ... etc
}
```

### Soft Delete

```typescript
async remove(id: string, userId: string) {
  await this.findOne(id);  // Valida existencia
  return this.prisma.employees.update({
    where: { id },
    data: { deleted_at: new Date(), deleted_by: userId, is_active: false },
  });
}
```

### Include Relations + Cross-DB Lookup

```typescript
// findAll: incluye party (solo id y name) — dentro del tenant
async findAll() {
  return this.prisma.employees.findMany({
    where: { deleted_at: null },
    orderBy: { last_name: 'asc' },
    include: { party: { select: { id: true, name: true } } },
  });
}

// findOne: incluye party (tenant) + user (public) — resolución cross-DB manual
async findOne(id: string) {
  const employee = await this.prisma.employees.findFirst({
    where: { id, deleted_at: null },
    include: { party: true },
  });
  if (!employee) throw new NotFoundException('Empleado no encontrado');

  // Cross-DB: public.users vía getDefaultClient()
  let user = null;
  if (employee.user_id) {
    user = await this.db.getDefaultClient().users.findUnique({
      where: { id: employee.user_id },
      select: { id: true, name: true, email: true },
    });
  }

  return { ...employee, user };
}
```
```

---

## Archivos REST Client (.http)

### `https/erp/employees.http`

| Request | Método | Ruta | Descripción |
|---------|--------|------|-------------|
| Login | `POST` | `/auth/login` | Obtiene JWT token |
| Create employee | `POST` | `/erp/employees` | Crea empleado con todos los campos |
| Create mínimo | `POST` | `/erp/employees` | Solo first_name + last_name |
| List all | `GET` | `/erp/employees` | Lista todos los empleados |
| Get one | `GET` | `/erp/employees/:id` | Obtiene uno con party y user |
| Update | `PATCH` | `/erp/employees/:id` | Actualiza position, department, salary |
| Soft delete | `DELETE` | `/erp/employees/:id` | Marca deleted_at |

### `https/erp/partners.http`

| Request | Método | Ruta | Descripción |
|---------|--------|------|-------------|
| Login | `POST` | `/auth/login` | Obtiene JWT token |
| Create partner | `POST` | `/erp/partners` | Crea socio con todos los campos |
| Create mínimo | `POST` | `/erp/partners` | Solo first_name + last_name |
| List all | `GET` | `/erp/partners` | Lista todos los socios |
| Get one | `GET` | `/erp/partners/:id` | Obtiene uno con party y user |
| Update | `PATCH` | `/erp/partners/:id` | Actualiza share_percentage, capital |
| Soft delete | `DELETE` | `/erp/partners/:id` | Marca deleted_at |

**Uso**: Reemplazar `REEMPLAZAR_EMPLOYEE_ID` / `REEMPLAZAR_PARTNER_ID` con un ID real obtenido del `GET all`.

---

## Verificación

- [x] `employees.module.ts` creado
- [x] `employees.controller.ts` con 8 endpoints (CRUD + link/unlink)
- [x] `employees.service.ts` con CRUD + user creation + link/unlink
- [x] `dto/create-employee.dto.ts` con `create_user` opcional
- [x] `dto/update-employee.dto.ts` con PartialType
- [x] `dto/create-user.dto.ts` para crear usuario
- [x] `dto/link-user.dto.ts` para vincular usuario
- [x] `partners.module.ts` creado
- [x] `partners.controller.ts` con 8 endpoints (CRUD + link/unlink)
- [x] `partners.service.ts` con CRUD + user creation + link/unlink
- [x] `dto/create-partner.dto.ts` con `create_user` opcional
- [x] `dto/update-partner.dto.ts` con PartialType
- [x] Registrados en `erp.modules.ts`
- [x] `auth/dto/register.dto.ts` actualizado con `link_employee_id`/`link_partner_id`
- [x] `auth/auth.service.ts` actualizado con linking post-register
- [x] `https/erp/employees.http` actualizado (11 requests)
- [x] `https/erp/partners.http` actualizado (11 requests)
- [x] Sin relaciones Prisma cross-DB (resolución manual con `getDefaultClient()`)
- [x] `tsc --noEmit` → ✅ Sin errores

---

## Próximos Pasos

1. **Fase 3**: Bank Accounts + Account Movements
2. **Activar RBAC**: Uncomment `@RequirePermissions` en employees/partners controllers
3. **Sembrar permisos**: `employees.create`, `employees.read`, `employees.update`, `employees.delete` + mismos para `partners`
