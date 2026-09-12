require('dotenv/config');
const { Client } = require('pg');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

async function main() {
  const publicUrl = process.env.DATABASE_URL_PUBLIC;
  const baseUrl = process.env.DATABASE_URL_BASE;
  for (const value of [publicUrl, baseUrl]) {
    if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(value).hostname)) {
      throw new Error('Este script solo permite bases locales');
    }
  }
  const sql = readFileSync(resolve(__dirname, '../prisma/migrations/20260907_document_assignee/migration.sql'), 'utf8');
  const identity = new Client({ connectionString: publicUrl, connectionTimeoutMillis: 5000 });
  await identity.connect();
  try {
    const { rows } = await identity.query('SELECT subdomain FROM public.companies WHERE deleted_at IS NULL AND subdomain IS NOT NULL');
    for (const { subdomain } of rows) {
      if (!/^[a-z0-9_-]+$/.test(subdomain)) throw new Error('Subdominio inválido');
      const tenant = new Client({ connectionString: `${baseUrl}${subdomain}_db`, connectionTimeoutMillis: 5000 });
      await tenant.connect();
      try {
        await tenant.query('BEGIN');
        await tenant.query("SET LOCAL lock_timeout = '5s'");
        await tenant.query(sql);
        const check = await tenant.query("SELECT data_type FROM information_schema.columns WHERE table_schema = 'tenant' AND table_name = 'documents' AND column_name = 'assigned_to'");
        if (check.rows[0]?.data_type !== 'uuid') throw new Error('La columna no tiene el tipo esperado');
        await tenant.query('COMMIT');
        console.log(`${subdomain}_db: responsable disponible`);
      } catch (error) {
        await tenant.query('ROLLBACK');
        throw error;
      } finally { await tenant.end(); }
    }
  } finally { await identity.end(); }
}

main().catch(error => { console.error(error.code || error.message); process.exitCode = 1; });
