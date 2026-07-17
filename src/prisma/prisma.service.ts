import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { withAudit } from './audit.extension';
import { requestContext } from '../common/context/request-context';
import 'dotenv/config';

// ✅ DB fija para public
const DATABASE_URL_PUBLIC = process.env.DATABASE_URL_PUBLIC;
// ✅ Base para construir URLs de tenant dinámicamente
const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE;

if (!DATABASE_URL_PUBLIC) {
  throw new Error('DATABASE_URL_PUBLIC environment variable is not defined');
}

if (!DATABASE_URL_BASE) {
  throw new Error('DATABASE_URL_BASE environment variable is not defined');
}

// ✅ Cliente para tablas PUBLIC (users, companies, refresh_tokens...)
// Audit → escribe en public.audit_logs via audit_logs_public
function createPublicClient() {
  const pool = new Pool({
    connectionString: DATABASE_URL_PUBLIC,
    options: `-c search_path="public"`,
  });

  const adapter = new PrismaPg(pool, { schema: 'public' });
  const raw = new PrismaClient({ adapter });

  // ✅ Public: audit logs → public.audit_logs (via audit_logs_public model)
  const writeAuditLog = (data: any) => raw.audit_logs_public.create({ data });
  return { client: withAudit(writeAuditLog)(raw), pool };
}

// ✅ Cliente para tablas TENANT (products, taxes, transfer_rates...)
// Cada tenant tiene su propia DB con schema "tenant" fijo
// Audit → escribe en tenant.audit_logs via audit_logs
function createTenantClient(tenantDb: string) {
  // ✅ URL dinámica — cambia la base de datos por tenant
  const connectionString = `${DATABASE_URL_BASE}${tenantDb}`;
  // resultado: "postgresql://user:pass@host:5432/empresaa_db"

  const pool = new Pool({
    connectionString,
    options: `-c search_path="tenant",public`,
    max: 5, // límite de conexiones por tenant
  });

  // ✅ "tenant" coincide con @@schema("tenant") en tenant.prisma
  const adapter = new PrismaPg(pool, { schema: 'tenant' });
  const raw = new PrismaClient({ adapter });

  // ✅ Tenant: audit logs → tenant.audit_logs (via audit_logs model)
  const writeAuditLog = (data: any) => raw.audit_logs.create({ data });
  return { client: withAudit(writeAuditLog)(raw), pool };
}

// ✅ Tipos inferidos
type ExtendedClient = ReturnType<typeof createPublicClient>['client'];

export type ExtendedPrismaClient = ExtendedClient;

export type PrismaTransactionClient = Omit<
  ExtendedPrismaClient,
  '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Cache de clientes tenant — key es el nombre de la DB (ej: "empresaa_db")
  private readonly tenantClientCache = new Map<string, ExtendedClient>();
  private readonly tenantPoolCache = new Map<string, Pool>();

  // Cliente fijo para public
  private readonly defaultClient: ExtendedClient;
  private readonly defaultPool: Pool;

  constructor() {
    const { client, pool } = createPublicClient();
    this.defaultClient = client;
    this.defaultPool = pool;
  }

  /**
   * Siempre retorna el cliente de la DB pública.
   * Usar para: users, companies, refresh_tokens, company_users
   */
  public getDefaultClient(): ExtendedClient {
    return this.defaultClient;
  }

  /**
   * Retorna el cliente del tenant basado en el contexto actual.
   * Usar para: products, taxes, product_taxes, transfer_rates
   * Clave del cache: nombre de la DB del tenant (ej: "empresaa_db")
   */
  public getClientForCurrentContext(): ExtendedClient {
    const store = requestContext.getStore();
    const tenantDb = store?.schema; // ej: "empresaa_db"

    // console.log('TENANT DB RESUELTO EN PRISMA SERVICE:', tenantDb);

    if (!tenantDb || tenantDb === 'public') {
      return this.defaultClient;
    }

    return this.getTenantClient(tenantDb);
  }

  /**
   * Retorna el cliente del tenant para un DB name específico.
   * Usar en schedulers que corren fuera de contexto HTTP.
   */
  public getTenantClient(tenantDb: string): ExtendedClient {
    if (!this.tenantClientCache.has(tenantDb)) {
      const { client, pool } = createTenantClient(tenantDb);
      this.tenantClientCache.set(tenantDb, client);
      this.tenantPoolCache.set(tenantDb, pool);
    }

    return this.tenantClientCache.get(tenantDb)!;
  }

  async onModuleInit() {
    await (this.defaultClient as unknown as PrismaClient).$connect();
  }

  async onModuleDestroy() {
    // ✅ Desconectar cliente public
    await (this.defaultClient as unknown as PrismaClient).$disconnect();
    await this.defaultPool.end();

    // ✅ Desconectar todos los clientes tenant
    for (const client of this.tenantClientCache.values()) {
      await (client as unknown as PrismaClient).$disconnect();
    }
    this.tenantClientCache.clear();

    // ✅ Cerrar todos los pools tenant
    for (const pool of this.tenantPoolCache.values()) {
      await pool.end();
    }
    this.tenantPoolCache.clear();
  }
}
