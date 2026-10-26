import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function main() {
  const publicUrl = process.env.DATABASE_URL_PUBLIC;
  if (!publicUrl) throw new Error('DATABASE_URL_PUBLIC no está definida');

  const sql = await readFile(
    resolve('prisma/migrations/20261026_whatsapp_weekly_reports/migration.sql'),
    'utf8',
  );
  const client = new Client({ connectionString: publicUrl });
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migración de reportes semanales por WhatsApp aplicada a la base pública.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

void main();
