import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function main() {
  const publicUrl = process.env.DATABASE_URL_PUBLIC;
  const tenantUrlBase = process.env.DATABASE_URL_BASE;
  if (!publicUrl) throw new Error('DATABASE_URL_PUBLIC no está definida');
  if (!tenantUrlBase) throw new Error('DATABASE_URL_BASE no está definida');

  const migration = await readFile(
    resolve('prisma/migrations/20261112_sales_order_delivery_phones/migration.sql'),
    'utf8',
  );
  const publicClient = new Client({ connectionString: publicUrl });
  await publicClient.connect();

  let migrated = 0;
  let skipped = 0;
  try {
    let afterId: string | undefined;

    while (true) {
      const page = afterId
        ? await publicClient.query<{
            id: string;
            schema_name: string | null;
            subdomain: string | null;
          }>(
            'SELECT id, schema_name, subdomain FROM public.companies WHERE deleted_at IS NULL AND id > $1 ORDER BY id LIMIT 100',
            [afterId],
          )
        : await publicClient.query<{
            id: string;
            schema_name: string | null;
            subdomain: string | null;
          }>(
            'SELECT id, schema_name, subdomain FROM public.companies WHERE deleted_at IS NULL ORDER BY id LIMIT 100',
          );
      if (!page.rows.length) break;

      for (const company of page.rows) {
        const tenantDb = company.schema_name || (company.subdomain ? `${company.subdomain}_db` : null);
        if (!tenantDb || !/^[a-zA-Z0-9_]+$/.test(tenantDb)) {
          console.warn(`Empresa ${company.id} omitida: nombre de base inválido o ausente`);
          skipped++;
          continue;
        }

        const tenantClient = new Client({ connectionString: `${tenantUrlBase}${tenantDb}` });
        let connected = false;
        try {
          await tenantClient.connect();
          connected = true;
          await tenantClient.query('BEGIN');
          await tenantClient.query(migration);
          await tenantClient.query('COMMIT');
          migrated++;
          console.log(`Migración de teléfonos de OV aplicada: ${tenantDb}`);
        } catch (error: any) {
          if (connected) await tenantClient.query('ROLLBACK');
          if (error?.code === '3D000') {
            console.warn(`Base omitida porque no existe: ${tenantDb}`);
            skipped++;
            continue;
          }
          throw new Error(`Falló la migración de ${tenantDb}: ${String(error)}`);
        } finally {
          if (connected) await tenantClient.end();
        }
      }

      afterId = page.rows[page.rows.length - 1].id;
    }

    console.log(`Migración finalizada. Bases actualizadas: ${migrated}. Omitidas: ${skipped}.`);
  } finally {
    await publicClient.end();
  }
}

void main();
