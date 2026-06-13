import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { withAudit } from './audit.extension';
import { requestContext } from '../common/context/request-context';

function createClient(schemaName: string) {
  const baseUrl = process.env.DATABASE_URL;

  if (!baseUrl) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  const pool = new Pool({
    connectionString: baseUrl,
    options: `-c search_path="${schemaName}",public`,
  });

  const adapter = new PrismaPg(pool, {
    schema: schemaName,
  });

  const raw = new PrismaClient({ adapter });

  return raw.$extends(withAudit);
}

type ExtendedClient = ReturnType<typeof createClient>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly clientCache = new Map<string, ExtendedClient>();
  private readonly defaultClient: ExtendedClient;

  constructor() {
    this.defaultClient = createClient('public');
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

    if (!schemaName || schemaName === 'public') {
      return this.defaultClient;
    }

    if (!this.clientCache.has(schemaName)) {
      this.clientCache.set(schemaName, createClient(schemaName));
    }

    return this.clientCache.get(schemaName)!;
  }

  async onModuleInit() {
    // $connect is optional with driver adapters, but safe to call
    await (this.defaultClient as any).$connect();
  }

  async onModuleDestroy() {
    await (this.defaultClient as any).$disconnect();
    for (const client of this.clientCache.values()) {
      await (client as any).$disconnect();
    }
    this.clientCache.clear();
  }
}
