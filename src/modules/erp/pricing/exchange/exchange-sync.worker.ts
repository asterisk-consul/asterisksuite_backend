import { PrismaService } from '@/prisma/prisma.service';
import { ExchangeService } from './exchange.service.js';

async function runExchangeSync() {
  const prisma = new PrismaService();
  const exchange = new ExchangeService(prisma);
  let failedTenants = 0;

  try {
    const snapshot = await exchange.fetchRateSnapshot();
    const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    const companies = await prisma.getDefaultClient().companies.findMany({
      where: {
        deleted_at: null,
        schema_name: allowedTenants.length ? { in: allowedTenants } : { not: null },
      },
      select: { schema_name: true, name: true },
    });

    console.info(JSON.stringify({
      event: 'exchange_worker_started',
      pid: process.pid,
      tenantCount: companies.length,
      memory: memorySnapshot(),
    }));

    for (const company of companies) {
      if (!company.schema_name) continue;

      const startedAt = Date.now();
      const memoryBefore = memorySnapshot();
      try {
        const result = await prisma.withTemporaryTenantClient(
          company.schema_name,
          (client) => exchange.syncAllRatesForClient(client, snapshot),
        );
        console.info(JSON.stringify({
          event: 'exchange_tenant_sync_completed',
          company: company.name,
          durationMs: Date.now() - startedAt,
          created: result.total_created,
          memoryBefore,
          memoryAfter: memorySnapshot(),
        }));
      } catch (error) {
        failedTenants += 1;
        console.error(JSON.stringify({
          event: 'exchange_tenant_sync_failed',
          company: company.name,
          durationMs: Date.now() - startedAt,
          memoryBefore,
          memoryAfter: memorySnapshot(),
          error: error instanceof Error ? error.message : String(error),
        }));
      }
    }

    console.info(JSON.stringify({
      event: 'exchange_worker_finished',
      pid: process.pid,
      tenantCount: companies.length,
      failedTenants,
      memory: memorySnapshot(),
    }));
  } finally {
    await prisma.onModuleDestroy();
  }

  if (failedTenants > 0) {
    throw new Error(`Falló la sincronización de ${failedTenants} empresa(s)`);
  }
}

function memorySnapshot() {
  const memory = process.memoryUsage();
  const mb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10;
  return {
    rssMb: mb(memory.rss),
    heapUsedMb: mb(memory.heapUsed),
    heapTotalMb: mb(memory.heapTotal),
    externalMb: mb(memory.external),
  };
}

runExchangeSync().catch((error) => {
  console.error('[ExchangeSyncWorker] No se pudo completar la sincronización', error);
  process.exitCode = 1;
});
