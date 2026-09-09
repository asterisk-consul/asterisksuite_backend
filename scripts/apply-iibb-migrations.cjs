require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { Client } = require('pg')

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    for (const name of ['20260907_iibb_party_rates', '20260907_iibb_document_context', '20260907_iibb_jurisdiction_defaults', '20260907_iibb_perception_rules_seed']) {
      const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'migrations', name, 'migration.sql'), 'utf8')
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('COMMIT')
      console.log(`Applied ${name}`)
    }
    const verification = await client.query(`
      SELECT
        (SELECT count(*) FROM tenant.tax_jurisdictions WHERE deleted_at IS NULL) AS jurisdictions,
        EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'tenant' AND table_name = 'documents' AND column_name = 'fiscal_jurisdiction_id'
        ) AS document_context_ready,
        EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'tenant' AND table_name = 'document_taxes' AND column_name = 'is_manual'
        ) AS manual_override_ready
        ,(SELECT count(*) FROM tenant.tax_rules WHERE tax_type = 'IIBB' AND application_type = 'PERCEPTION' AND deleted_at IS NULL) AS perception_rules
    `)
    console.log('Verified', verification.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
