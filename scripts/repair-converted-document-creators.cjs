// Preview by default. --apply restores only creators proven by creation audit records.
require('dotenv/config');
const { Client } = require('pg');
const { randomUUID } = require('node:crypto');

const direction = process.argv.includes('--purchases') ? -1 : 1;
const candidatesSql = `
  SELECT d.id, dt.category, d.number, min(a.changed_by::text)::uuid AS creator,
         to_jsonb(d) AS old_data
  FROM tenant.documents d
  JOIN tenant.document_types dt ON dt.id = d.document_type_id
  JOIN tenant.audit_logs a ON a.table_name = 'documents'
    AND a.record_id = d.id::text AND a.action = 'CREATE' AND a.changed_by IS NOT NULL
  WHERE d.created_by IS NULL AND d.deleted_at IS NULL
    AND d.parent_document_id IS NOT NULL AND dt.direction = ${direction}
    AND dt.category IN ('ORDER', 'REMITO', 'INVOICE')
  GROUP BY d.id, dt.category
  HAVING count(DISTINCT a.changed_by) = 1
`;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const target = new URL(connectionString);
  // This repair is scoped to the development database identified for this incident.
  if (target.hostname !== '72.61.59.61' || target.port !== '5434' || target.pathname !== '/dev_db') {
    throw new Error('La conexión no corresponde a la base de desarrollo indicada');
  }
  const client = new Client({ connectionString, connectionTimeoutMillis: 10000, statement_timeout: 15000 });
  await client.connect();
  try {
    const { rows: affected } = await client.query(`
      SELECT dt.category, count(*)::int AS missing_creator
      FROM tenant.documents d JOIN tenant.document_types dt ON dt.id = d.document_type_id
      WHERE d.created_by IS NULL AND d.deleted_at IS NULL AND d.parent_document_id IS NOT NULL
        AND dt.direction = ${direction} AND dt.category IN ('ORDER', 'REMITO', 'INVOICE')
      GROUP BY dt.category`);
    console.log(JSON.stringify({ affected }));
    const { rows: candidates } = await client.query(candidatesSql);
    console.log(JSON.stringify({ recoverable: candidates.map(({ id, category, number, creator }) => ({ id, category, number, creator })) }));
    if (!process.argv.includes('--apply')) return;
    await client.query('BEGIN');
    try {
      await client.query("SET LOCAL lock_timeout = '5s'");
      const { rows: freshCandidates } = await client.query(candidatesSql);
      let repaired = 0;
      for (const candidate of freshCandidates) {
        const { rows: before } = await client.query(`SELECT to_jsonb(d) AS old_data FROM tenant.documents d
          WHERE id = $1 AND created_by IS NULL AND deleted_at IS NULL FOR UPDATE`, [candidate.id]);
        if (!before.length) continue;
        const { rows } = await client.query(`UPDATE tenant.documents SET created_by = $2
          WHERE id = $1 AND created_by IS NULL AND deleted_at IS NULL RETURNING to_jsonb(documents) AS new_data`, [candidate.id, candidate.creator]);
        if (!rows.length) continue;
        await client.query(`INSERT INTO tenant.audit_logs
          (id, table_name, record_id, old_data, new_data, action, request_id)
          VALUES ($4, 'documents', $1, $2::jsonb, $3::jsonb, 'UPDATE', 'repair-converted-document-creators')`,
        [candidate.id, JSON.stringify(before[0].old_data), JSON.stringify(rows[0].new_data), randomUUID()]);
        repaired++;
      }
      await client.query('COMMIT');
      console.log(JSON.stringify({ repaired }));
    } catch (error) { await client.query('ROLLBACK'); throw error; }
  } finally { await client.end(); }
}
main().catch(error => { console.error(error.code || error.message); process.exitCode = 1; });
