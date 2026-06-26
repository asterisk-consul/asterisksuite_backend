# RBAC multitenant para Asterisk Suite

## Objetivo

Implementar autorizacion por permisos atomicos dentro de cada empresa, manteniendo separada la identidad global de usuarios y la logica de negocio de cada tenant.

La arquitectura futura esperada es:

```txt
public
  users
  companies
  company_users
  refresh_tokens
  audit_logs

tenant / schema / base de empresa
  products
  customers
  sales
  settings
  permissions
  business_roles
  business_role_permissions
  business_user_roles
  user_permission_overrides
```

`public` sabe quien es el usuario y a que empresas pertenece. El tenant sabe que permisos tiene ese usuario dentro del negocio.

## Separacion de responsabilidades

Hay dos niveles de autorizacion:

1. Rol general de empresa

Vive en `public.company_users.role`.

Sirve para permisos administrativos sobre la empresa como tenant:

```txt
OWNER
ADMIN
EDITOR
USER
```

Ejemplos de uso:

```txt
Entrar a la empresa
Invitar usuarios
Cambiar subdominio
Administrar configuracion general
Administrar roles y permisos del negocio
```

2. Permisos finos de negocio

Viven dentro del tenant.

Sirven para acciones del modelo de negocio:

```txt
products.read
products.create
products.update
products.delete

customers.read
customers.create
customers.update
customers.delete

sales.read
sales.create
sales.update
sales.delete

reports.read
settings.read
settings.update
```

## Modelos Prisma sugeridos

### Public schema

```prisma
enum CompanyUserRole {
  OWNER
  ADMIN
  EDITOR
  USER

  @@schema("public")
}

model companies {
  id           String          @id @default(uuid()) @db.Uuid
  name         String          @db.VarChar(255)
  tax_id       String?         @db.VarChar(50)
  phone        String?         @db.VarChar(30)
  subdomain    String?         @unique @db.VarChar(100)
  schema_name  String?         @unique @db.VarChar(100)
  created_at   DateTime        @default(now()) @db.Timestamp(6)
  updated_at   DateTime        @updatedAt @db.Timestamp(6)
  deleted_at   DateTime?
  created_by   String?         @db.Uuid
  updated_by   String?         @db.Uuid
  deleted_by   String?         @db.Uuid
  companyUsers company_users[]

  @@schema("public")
}

model company_users {
  company_id String          @db.Uuid
  user_id    String          @db.Uuid
  role       CompanyUserRole @default(USER)

  company companies @relation(fields: [company_id], references: [id], onDelete: Cascade)
  user    users     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@id([company_id, user_id])
  @@index([user_id])
  @@schema("public")
}
```

### Tenant schema

No hace falta `company_id`, porque el tenant activo ya representa a la empresa.

```prisma
enum PermissionEffect {
  ALLOW
  DENY
}

model permissions {
  id          String  @id @default(uuid()) @db.Uuid
  code        String  @unique @db.VarChar(120)
  description String?
  active      Boolean @default(true)

  role_permissions          business_role_permissions[]
  user_permission_overrides user_permission_overrides[]
}

model business_roles {
  id          String    @id @default(uuid()) @db.Uuid
  code        String    @unique @db.VarChar(80)
  name        String    @db.VarChar(120)
  description String?
  is_system   Boolean   @default(false)
  active      Boolean   @default(true)
  created_at  DateTime  @default(now())
  updated_at  DateTime? @updatedAt
  deleted_at  DateTime?

  permissions business_role_permissions[]
  users       business_user_roles[]
}

model business_role_permissions {
  role_id       String @db.Uuid
  permission_id String @db.Uuid

  role       business_roles @relation(fields: [role_id], references: [id], onDelete: Cascade)
  permission permissions    @relation(fields: [permission_id], references: [id], onDelete: Cascade)

  @@id([role_id, permission_id])
}

model business_user_roles {
  user_id String @db.Uuid
  role_id String @db.Uuid

  role business_roles @relation(fields: [role_id], references: [id], onDelete: Cascade)

  @@id([user_id, role_id])
  @@index([user_id])
}

model user_permission_overrides {
  user_id       String           @db.Uuid
  permission_id String           @db.Uuid
  effect        PermissionEffect

  permission permissions @relation(fields: [permission_id], references: [id], onDelete: Cascade)

  @@id([user_id, permission_id])
  @@index([user_id])
}
```

`business_user_roles.user_id` y `user_permission_overrides.user_id` apuntan logicamente a `public.users.id`, pero no necesitan relacion Prisma directa si los datos de negocio viven en otra base o schema.

## Modulos NestJS sugeridos

### AuthModule

Responsabilidad actual:

```txt
Login
Refresh token
Logout
JWT strategy
Usuario autenticado
```

Debe seguir siendo global. No deberia resolver permisos finos del negocio.

El JWT deberia contener identidad, no todo el mapa de permisos:

```ts
{
  sub: user.id,
  name: user.name,
  email: user.email,
  role: user.role
}
```

`user.role` puede quedar para permisos de plataforma o soporte interno, no para `products.create`.

### TenantModule

Modulo transversal para resolver la empresa activa y preparar el contexto tenant.

Responsabilidades:

```txt
Resolver tenant por subdominio, header o parametro
Buscar la empresa en public.companies
Validar membresia en public.company_users
Guardar company, schema_name y companyUserRole en request context
Configurar Prisma o conexion hacia el schema/base del tenant
```

Piezas sugeridas:

```txt
src/tenant/tenant.module.ts
src/tenant/tenant.service.ts
src/tenant/tenant.guard.ts
src/tenant/tenant-context.ts
src/tenant/decorators/current-tenant.decorator.ts
```

El guard principal seria:

```ts
@UseGuards(JwtAuthGuard, TenantGuard)
```

### AuthorizationModule

Modulo transversal para permisos.

Responsabilidades:

```txt
Exponer decorador @RequirePermissions()
Resolver permisos efectivos del usuario dentro del tenant
Aplicar overrides ALLOW/DENY
Exponer PermissionsGuard
Opcionalmente cachear permisos por user + tenant
```

Piezas sugeridas:

```txt
src/authorization/authorization.module.ts
src/authorization/authorization.service.ts
src/authorization/guards/permissions.guard.ts
src/authorization/decorators/permissions.decorator.ts
src/authorization/types/permission-effect.enum.ts
```

Uso esperado en controladores:

```ts
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@RequirePermissions('products.create')
@Post()
create() {}
```

### AccessControlModule

Modulo funcional para administrar roles, permisos y asignaciones del negocio.

Vive conceptualmente dentro del tenant, porque administra tablas del tenant.

Responsabilidades:

```txt
CRUD de business_roles
Asignar permisos a roles
Asignar roles a usuarios
Agregar o quitar overrides por usuario
Listar permisos efectivos de un usuario
Sembrar roles base al crear una empresa
```

Piezas sugeridas:

```txt
src/modules/core/access-control/access-control.module.ts
src/modules/core/access-control/roles.controller.ts
src/modules/core/access-control/permissions.controller.ts
src/modules/core/access-control/user-permissions.controller.ts
src/modules/core/access-control/access-control.service.ts
```

Endpoints tentativos:

```txt
GET    /access-control/permissions
GET    /access-control/roles
POST   /access-control/roles
PATCH  /access-control/roles/:id
DELETE /access-control/roles/:id

PUT    /access-control/roles/:id/permissions
GET    /access-control/users/:userId/roles
PUT    /access-control/users/:userId/roles
GET    /access-control/users/:userId/permissions/effective
PUT    /access-control/users/:userId/permissions/overrides
```

Estos endpoints deberian requerir un permiso como:

```txt
settings.roles.manage
```

o permitirlos automaticamente a `OWNER` en `public.company_users.role`.

## Flujo de una request protegida

```txt
1. Llega request con Authorization: Bearer token.
2. JwtAuthGuard valida token y carga req.user.
3. TenantGuard resuelve tenant:
   - subdominio, header o parametro
   - public.companies
   - public.company_users
4. TenantGuard guarda contexto:
   - userId
   - companyId
   - schemaName
   - companyUserRole
5. PermissionsGuard lee @RequirePermissions().
6. Si companyUserRole es OWNER, permite.
7. Consulta permisos efectivos en el tenant.
8. Si hay DENY explicito, rechaza.
9. Si hay ALLOW explicito o permiso heredado por rol, permite.
10. Si no hay permiso, rechaza.
```

## Regla de precedencia

```txt
OWNER publico
  permite todo dentro de la empresa

DENY explicito
  gana sobre roles y allow

ALLOW explicito
  permite aunque el rol no lo tenga

Permiso por rol
  permite si cualquier rol del usuario lo incluye

Sin coincidencia
  denegado
```

## Roles base recomendados por tenant

Al crear una empresa conviene sembrar permisos y roles base.

```txt
Admin
  *

Supervisor
  products.read
  products.create
  products.update
  customers.read
  customers.create
  sales.read
  reports.read

Vendedor
  products.read
  customers.read
  customers.create
  sales.read
  sales.create

Operador
  products.read
  warehouse.read
  warehouse.update

Solo lectura
  products.read
  customers.read
  sales.read
  reports.read
```

Para no guardar `*` como permiso magico en todos lados, hay dos caminos:

1. `OWNER` publico saltea la evaluacion fina.
2. `Admin` tenant recibe todos los permisos atomicos existentes.

La opcion 2 suele ser mas clara para auditoria.

## Historia tecnica sugerida

### Historia 1: Normalizar rol general de empresa

```txt
Como sistema
quiero que company_users.role use un enum publico
para evitar strings inconsistentes y separar roles generales de permisos finos.
```

Criterios:

```txt
Crear enum CompanyUserRole
Migrar valores actuales
Default USER
OWNER puede administrar empresa
ADMIN puede administrar configuracion operativa
```

### Historia 2: Crear contexto tenant

```txt
Como backend
quiero resolver la empresa activa por request
para conectar la request con el schema/base correcta.
```

Criterios:

```txt
TenantGuard valida JWT + membresia
RequestContext guarda userId, companyId, schemaName y companyUserRole
Si no hay membresia, retorna 403
```

### Historia 3: Crear catalogo de permisos tenant

```txt
Como empresa
quiero tener permisos atomicos del negocio
para controlar acciones concretas del sistema.
```

Criterios:

```txt
Crear tabla permissions
Seed inicial de permisos
Codigo unico por permiso
Permisos activos/inactivos
```

### Historia 4: Crear roles finos tenant

```txt
Como administrador de empresa
quiero agrupar permisos en roles
para asignar responsabilidades a usuarios.
```

Criterios:

```txt
Crear business_roles
Crear business_role_permissions
CRUD de roles
Asignacion de permisos a roles
No permitir borrar roles del sistema si is_system = true
```

### Historia 5: Asignar roles a usuarios

```txt
Como administrador de empresa
quiero asignar roles del negocio a usuarios
para controlar su acceso operativo.
```

Criterios:

```txt
Crear business_user_roles
Un usuario puede tener varios roles
Validar que el user_id pertenezca a la empresa desde public.company_users
Listar roles por usuario
```

### Historia 6: Overrides por usuario

```txt
Como administrador de empresa
quiero permitir o denegar permisos puntuales a un usuario
para cubrir excepciones sin crear roles nuevos.
```

Criterios:

```txt
Crear user_permission_overrides
Soportar ALLOW y DENY
DENY tiene prioridad sobre roles
Endpoint para ver permisos efectivos
```

### Historia 7: Guard de permisos

```txt
Como desarrollador
quiero proteger endpoints con @RequirePermissions()
para aplicar permisos finos de negocio de forma uniforme.
```

Criterios:

```txt
Crear decorador @RequirePermissions()
Crear PermissionsGuard
OWNER publico permite todo
DENY explicito rechaza
Permiso por rol o ALLOW explicito permite
Sin permiso retorna 403
```

## Integracion progresiva

No hace falta migrar todos los controladores de una vez.

Orden recomendado:

```txt
1. Auth y TenantGuard
2. AccessControlModule
3. PermissionsGuard
4. Productos
5. Clientes
6. Ventas
7. Reportes
8. Configuracion
```

Mientras un controlador no tenga `@RequirePermissions()`, solo queda protegido por JWT y membresia tenant.

