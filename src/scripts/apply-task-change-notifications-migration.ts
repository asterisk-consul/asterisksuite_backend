import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function main() {
  const publicUrl = process.env.DATABASE_URL_PUBLIC;
  if (!publicUrl) throw new Error('DATABASE_URL_PUBLIC no está definida');

  const migration = await readFile(resolve('prisma/migrations/20261117_task_change_notifications/migration.sql'), 'utf8');
  const client = new Client({ connectionString: publicUrl });
  await client.connect();
  try {
    await client.query(migration);
    console.log('Preferencia de avisos de cambios de tareas aplicada en la base pública.');
  } finally {
    await client.end();
  }
}

void main();
