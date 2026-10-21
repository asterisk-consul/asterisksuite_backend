import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function applyToTenant(database: string, sql: string) {
  if (!process.env.DATABASE_URL_BASE) throw new Error('DATABASE_URL_BASE no está definida');
  const client = new Client({ connectionString: `${process.env.DATABASE_URL_BASE}${database}` });
  let connected = false;
  try {
    await client.connect();
    connected = true;
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(`Migración aplicada: ${database}`);
  } catch (error) {
    if (connected) await client.query('ROLLBACK');
    throw error;
  } finally {
    if (connected) await client.end();
  }
}

async function main() {
  if (!process.env.DATABASE_URL_PUBLIC) throw new Error('DATABASE_URL_PUBLIC no está definida');
  const sql = await readFile(
    resolve('prisma/migrations/20261021_intercompany_cash_transfers/migration.sql'),
    'utf8',
  );
  const publicClient = new Client({ connectionString: process.env.DATABASE_URL_PUBLIC });
  await publicClient.connect();
  let companies: Array<{ schema_name: string | null; subdomain: string | null }>;
  try {
    const result = await publicClient.query<{ schema_name: string | null; subdomain: string | null }>(
      'SELECT schema_name, subdomain FROM public.companies WHERE deleted_at IS NULL ORDER BY created_at',
    );
    companies = result.rows;
  } finally {
    await publicClient.end();
  }

  for (const company of companies) {
    const database = company.schema_name || (company.subdomain ? `${company.subdomain}_db` : null);
    if (!database || !/^[a-zA-Z0-9_]+$/.test(database)) {
      console.warn('Empresa omitida: nombre de base inválido o ausente');
      continue;
    }
    try {
      await applyToTenant(database, sql);
    } catch (error: any) {
      if (error?.code === '3D000') {
        console.warn(`Base omitida porque no existe: ${database}`);
        continue;
      }
      throw error;
    }
  }
}

void main();
