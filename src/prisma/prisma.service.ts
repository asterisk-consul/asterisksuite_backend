import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { withAudit } from './audit.extension';
import { requestContext } from '../common/context/request-context';
import 'dotenv/config';

// prisma.service.ts — already exported, make sure it's there

const BASE_URL = process.env.DATABASE_URL;

if (!BASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// ✅ Single shared raw public client — used for audit log writes
const publicRawClient = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: BASE_URL,
      options: `-c search_path="public"`,
    }),
    { schema: 'public' },
  ),
});

// ✅ No explicit return type — let TypeScript infer it
function createClient(schemaName: string) {
  const pool = new Pool({
    connectionString: BASE_URL,
    options: `-c search_path="${schemaName}",public`,
  });

  const adapter = new PrismaPg(pool, { schema: schemaName });
  const raw = new PrismaClient({
    adapter,
    log: ['query'],
  });

  return { client: withAudit(publicRawClient)(raw), pool };
}

// ✅ Now this works — no circular reference
type ExtendedClient = ReturnType<typeof createClient>['client'];

// ✅ Export for use in services, sinks, transformers, etc.
export type ExtendedPrismaClient = ExtendedClient;

// ✅ Use this instead of Prisma.TransactionClient across your codebase
export type PrismaTransactionClient = Omit<
  ExtendedPrismaClient,
  '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly clientCache = new Map<string, ExtendedClient>();
  private readonly poolCache = new Map<string, Pool>();
  private readonly defaultClient: ExtendedClient;
  private readonly defaultPool: Pool;

  constructor() {
    const { client, pool } = createClient('public');
    this.defaultClient = client;
    this.defaultPool = pool;
  }

  /**
   * Always returns the default public-schema client.
   * Use this when you need to query public tables (e.g. companies)
   * regardless of the current request context.
   */
  public getDefaultClient(): ExtendedClient {
    return this.defaultClient;
  }

  /**
   * Returns a tenant-specific client based on the current request context.
   * Falls back to the public client if no schema is set.
   */
  public getClientForCurrentContext(): ExtendedClient {
    const store = requestContext.getStore();
    const schemaName = store?.schema;

    console.log('SCHEMA RESUELTO EN PRISMA SERVICE:', schemaName); // ✅ debug

    if (!schemaName || schemaName === 'public') {
      return this.defaultClient;
    }

    if (!this.clientCache.has(schemaName)) {
      const { client, pool } = createClient(schemaName);
      this.clientCache.set(schemaName, client);
      this.poolCache.set(schemaName, pool);
    }

    return this.clientCache.get(schemaName)!;
  }

  async onModuleInit() {
    // $connect is optional with driver adapters, but safe to call
    await (this.defaultClient as unknown as PrismaClient).$connect();
  }

  async onModuleDestroy() {
    // ✅ Disconnect all Prisma clients
    await (this.defaultClient as unknown as PrismaClient).$disconnect();
    for (const client of this.clientCache.values()) {
      await (client as unknown as PrismaClient).$disconnect();
    }
    this.clientCache.clear();

    // ✅ End all pg pools to avoid connection leaks
    await this.defaultPool.end();
    for (const pool of this.poolCache.values()) {
      await pool.end();
    }
    this.poolCache.clear();

    // ✅ Disconnect the shared public audit client
    await publicRawClient.$disconnect();
  }
}
