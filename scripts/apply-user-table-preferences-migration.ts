import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL_PUBLIC;
  if (!connectionString) throw new Error('DATABASE_URL_PUBLIC no está definida');

  const sql = await readFile(
    resolve('prisma/migrations/20261023_user_table_preferences/migration.sql'),
    'utf8',
  );
  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migración de preferencias de tablas aplicada a la base pública.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

void main();
