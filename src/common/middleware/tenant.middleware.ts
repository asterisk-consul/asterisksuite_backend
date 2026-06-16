import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestContext } from '../context/request-context';
import { PrismaService } from '@/prisma/prisma.service';

const PUBLIC_SUBDOMAINS = new Set(['public', 'dev', 'api', 'www', 'admin']);

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  // Cache: subdomain → { tenantDb, expiresAt }
  private tenantCache = new Map<
    string,
    { tenantDb: string; expiresAt: number }
  >();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const subdomain = this.extractSubdomain(req);

    // Sin subdomain o subdomain público → usa cliente public
    if (!subdomain || PUBLIC_SUBDOMAINS.has(subdomain)) {
      return requestContext.run({ schema: 'public' }, () => next());
    }

    try {
      const tenantDb = await this.resolveTenantDb(subdomain);

      if (!tenantDb) {
        return res.status(404).json({
          message: `Tenant not found for subdomain: ${subdomain}`,
        });
      }

      this.logger.log(`TENANT: ${subdomain} → DB: ${tenantDb}`);

      // ✅ schema ahora guarda el nombre de la DB del tenant
      // ej: "empresaa_db" — usado en PrismaService.getClientForCurrentContext()
      return requestContext.run({ schema: tenantDb }, () => next());
    } catch (error: any) {
      this.logger.error(
        `Error resolving tenant DB for subdomain "${subdomain}": ${error.message}`,
      );
      return res.status(500).json({
        message: 'Error resolving tenant DB',
        error: error.message,
      });
    }
  }

  /**
   * Resuelve el nombre de la DB del tenant para un subdomain dado.
   * Usa cache en memoria con TTL para evitar queries en cada request.
   */
  private async resolveTenantDb(subdomain: string): Promise<string | null> {
    const now = Date.now();
    const cached = this.tenantCache.get(subdomain);

    // ✅ Retorna del cache si aún es válido
    if (cached && cached.expiresAt > now) {
      return cached.tenantDb;
    }

    // ✅ Siempre usa el cliente public para buscar la empresa
    const company = await this.prisma.getDefaultClient().companies.findFirst({
      where: {
        subdomain,
        deleted_at: null,
      },
      select: {
        schema_name: true, // ← contiene "empresaa_db"
      },
    });

    if (!company?.schema_name) {
      return null;
    }

    // ✅ Guarda en cache con expiración
    this.tenantCache.set(subdomain, {
      tenantDb: company.schema_name, // ej: "empresaa_db"
      expiresAt: now + this.CACHE_TTL_MS,
    });

    return company.schema_name;
  }

  /**
   * Extrae el subdomain del request.
   * Prioridad: header > query param > hostname
   */
  private extractSubdomain(req: Request): string | null {
    // 1. Headers personalizados
    const tenantHeader = req.headers['x-tenant'] ?? req.headers['x-subdomain'];
    if (tenantHeader && typeof tenantHeader === 'string') {
      return tenantHeader.toLowerCase().trim();
    }

    // 2. Query parameter
    const tenantQuery = req.query?.['tenant'];
    if (tenantQuery && typeof tenantQuery === 'string') {
      return tenantQuery.toLowerCase().trim();
    }

    // 3. Hostname
    const rawHost = (req.hostname || req.headers.host || '').split(':')[0];
    const parts = rawHost.split('.');

    if (parts.length < 3) {
      return null;
    }

    const first = parts[0].toLowerCase();

    if ((first === 'api' || first === 'www') && parts.length > 3) {
      return parts[1].toLowerCase();
    }

    if (first === 'dev' && parts.length > 3) {
      return parts[1].toLowerCase();
    }

    return first;
  }
}
