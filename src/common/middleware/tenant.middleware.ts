import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestContext } from '../context/request-context';
import { PrismaService } from '@/prisma/prisma.service';

// Non-tenant subdomains that should always use the public schema
const PUBLIC_SUBDOMAINS = new Set(['public', 'dev', 'api', 'www', 'admin']);

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  // Simple in-memory cache mapping subdomain -> schema_name
  // TTL-based invalidation: cache entry expires after 5 minutes
  private tenantCache = new Map<
    string,
    { schemaName: string; expiresAt: number }
  >();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const subdomain = this.extractSubdomain(req);

    // No subdomain or known public subdomain → use public schema
    if (!subdomain || PUBLIC_SUBDOMAINS.has(subdomain)) {
      return requestContext.run({ schema: 'public' }, () => next());
    }

    try {
      const schemaName = await this.resolveSchema(subdomain);

      if (!schemaName) {
        return res.status(404).json({
          message: `Tenant not found for subdomain: ${subdomain}`,
        });
      }
      console.log('TENANT:', subdomain);
      console.log('SCHEMA RESUELTO:', schemaName);

      // Run subsequent request code with the resolved tenant schema
      return requestContext.run({ schema: schemaName }, () => next());
    } catch (error: any) {
      this.logger.error(
        `Error resolving tenant schema for subdomain "${subdomain}": ${error.message}`,
      );
      return res.status(500).json({
        message: 'Error resolving tenant schema',
        error: error.message,
      });
    }
  }

  /**
   * Resolves the schema name for a given subdomain.
   * Uses an in-memory cache with TTL to avoid hitting the DB on every request.
   */
  private async resolveSchema(subdomain: string): Promise<string | null> {
    const now = Date.now();
    const cached = this.tenantCache.get(subdomain);

    // Return cached value if still valid
    if (cached && cached.expiresAt > now) {
      return cached.schemaName;
    }

    // Always query the public schema client for company lookup
    const company = await (
      this.prisma.getDefaultClient() as any
    ).companies.findFirst({
      where: {
        subdomain,
        deleted_at: null, // exclude soft-deleted companies
      },
      select: {
        schema_name: true,
      },
    });

    if (!company?.schema_name) {
      return null;
    }

    // Store in cache with expiry
    this.tenantCache.set(subdomain, {
      schemaName: company.schema_name,
      expiresAt: now + this.CACHE_TTL_MS,
    });

    return company.schema_name;
  }

  /**
   * Extracts the tenant subdomain from the request.
   * Priority: custom header > query param > hostname
   */
  private extractSubdomain(req: Request): string | null {
    // 1. Custom headers (useful for local dev / API clients)
    const tenantHeader = req.headers['x-tenant'] ?? req.headers['x-subdomain'];
    if (tenantHeader && typeof tenantHeader === 'string') {
      return tenantHeader.toLowerCase().trim();
    }

    // 2. Query parameter
    const tenantQuery = req.query?.['tenant'];
    if (tenantQuery && typeof tenantQuery === 'string') {
      return tenantQuery.toLowerCase().trim();
    }

    // 3. Parse from hostname
    // Strip port if present (e.g. localhost:3000 -> localhost)
    const rawHost = (req.hostname || req.headers.host || '').split(':')[0];
    const parts = rawHost.split('.');

    // Need at least: subdomain.domain.tld (3 parts)
    if (parts.length < 3) {
      return null;
    }

    const first = parts[0].toLowerCase();

    // api.donandres.asterisksuite.cloud -> donandres
    if ((first === 'api' || first === 'www') && parts.length > 3) {
      return parts[1].toLowerCase();
    }

    // dev.donandres.asterisksuite.cloud -> donandres
    if (first === 'dev' && parts.length > 3) {
      return parts[1].toLowerCase();
    }

    // donandres.asterisksuite.cloud -> donandres
    return first;
  }
}
