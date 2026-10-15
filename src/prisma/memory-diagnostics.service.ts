import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { getHeapStatistics } from 'node:v8';
import { PrismaService } from './prisma.service';

type MemorySample = {
  at: string;
  uptimeMinutes: number;
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
  externalMb: number;
  arrayBuffersMb: number;
  heapLimitMb: number;
  activeResources: Record<string, number>;
  prisma: ReturnType<PrismaService['getPoolDiagnostics']>;
};

const mb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10;

@Injectable()
export class MemoryDiagnosticsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MemoryDiagnosticsService.name);
  private timer?: NodeJS.Timeout;
  private samples: MemorySample[] = [];

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    const intervalMs = Number(process.env.MEMORY_DIAGNOSTICS_INTERVAL_MS ?? 0);
    if (!Number.isFinite(intervalMs) || intervalMs < 10_000) return;

    this.logger.warn(`Diagnóstico de memoria activo cada ${Math.round(intervalMs / 1000)}s`);
    this.capture();
    this.timer = setInterval(() => this.capture(), intervalMs);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private capture() {
    const forceGc = process.env.MEMORY_DIAGNOSTICS_FORCE_GC === 'true';
    const gc = (globalThis as typeof globalThis & { gc?: () => void }).gc;
    if (forceGc && gc) gc();

    const memory = process.memoryUsage();
    const heap = getHeapStatistics();
    const resources = process.getActiveResourcesInfo().reduce<Record<string, number>>(
      (counts, resource) => {
        counts[resource] = (counts[resource] ?? 0) + 1;
        return counts;
      },
      {},
    );

    const sample: MemorySample = {
      at: new Date().toISOString(),
      uptimeMinutes: Math.round((process.uptime() / 60) * 10) / 10,
      rssMb: mb(memory.rss),
      heapUsedMb: mb(memory.heapUsed),
      heapTotalMb: mb(memory.heapTotal),
      externalMb: mb(memory.external),
      arrayBuffersMb: mb(memory.arrayBuffers),
      heapLimitMb: mb(heap.heap_size_limit),
      activeResources: resources,
      prisma: this.prisma.getPoolDiagnostics(),
    };

    this.samples.push(sample);
    if (this.samples.length > 10) this.samples.shift();

    this.logger.log(JSON.stringify(sample));
    this.warnOnSustainedGrowth();
  }

  private warnOnSustainedGrowth() {
    if (this.samples.length < 6) return;

    const recent = this.samples.slice(-6);
    const alwaysGrowing = recent.every(
      (sample, index) => index === 0 || sample.heapUsedMb > recent[index - 1].heapUsedMb,
    );
    const growthMb = recent.at(-1)!.heapUsedMb - recent[0].heapUsedMb;

    if (alwaysGrowing && growthMb >= 25) {
      this.logger.warn(
        `Heap en crecimiento sostenido: +${Math.round(growthMb * 10) / 10} MB en ${recent.length} muestras`,
      );
    }
  }
}
