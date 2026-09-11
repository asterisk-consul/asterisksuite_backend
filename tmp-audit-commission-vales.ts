import { Pool } from 'pg'
async function main() {
  const pool = new Pool({ connectionString: 'postgresql://postgres:Yedroloski12.-@localhost:5432/dev_db', options: '-c search_path="tenant",public' })
  try {
    const result = await pool.query(`
      SELECT v.id, v.number, v.date, v.status, v.amount, d.document_id,
             d.subtotal, d.commission_rate, d.commission_amount, d.commission_base
      FROM tenant.hr_vales v
      JOIN tenant.hr_vale_commission_details d ON d.hr_vale_id = v.id
      WHERE v.deleted_at IS NULL
      ORDER BY v.date, v.number
    `)
    console.log(JSON.stringify(result.rows, null, 2))
  } finally { await pool.end() }
}
main().catch(e => { console.error(e); process.exit(1) })
