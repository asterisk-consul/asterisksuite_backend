import { URL } from 'url';

/**
 * Appends PostgreSQL schema and options (search_path) parameters to a base connection string.
 * This instructs Prisma and PostgreSQL to look in the tenant's schema first, falling back to public.
 *
 * @param baseUrl The base database connection string (e.g. postgresql://user:pass@host:5432/db)
 * @param schemaName The tenant-specific schema name
 */
export function getTenantConnectionUrl(
  baseUrl: string,
  schemaName: string,
): string {
  const url = new URL(baseUrl);
  url.searchParams.set('schema', schemaName);
  // Postgres search_path option sets the schema resolution order:
  // 1. tenant schema (for tenant-specific tables)
  // 2. public schema (for shared tables like companies, users, refresh_tokens)
  url.searchParams.set('options', `-c search_path=${schemaName},public`);
  return url.toString();
}

/**
 * Builds a connection URL that always points to the public schema.
 * Use this for the default Prisma client that queries shared tables (e.g. companies).
 *
 * @param baseUrl The base database connection string
 */
export function getPublicConnectionUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('schema', 'public');
  url.searchParams.set('options', `-c search_path=public`);
  return url.toString();
}
