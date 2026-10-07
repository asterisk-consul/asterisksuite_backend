/**
 * Repara y completa secuencias documentales sin reiniciar numeraciones.
 *
 * Uso:
 *   npx tsx prisma/seeds/document-sequences.seed.ts <tenant>
 */
import 'dotenv/config'
import { Pool } from 'pg'
import {
  executeSeedSql,
  SQL_DOCUMENT_SEQUENCES,
  SQL_LINK_SEQUENCES,
  SQL_REPAIR_DOCUMENT_SEQUENCES,
} from './seed-sql'

const tenant = process.argv[2]
const baseUrl = process.env.DATABASE_URL_BASE

if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/document-sequences.seed.ts <tenant>')
  process.exit(1)
}

if (!baseUrl) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const databaseName = `${tenant}_db`
const connectionString = `${baseUrl}${databaseName}`

async function main() {
  console.log(`Reparando secuencias documentales en ${databaseName}...`)

  await executeSeedSql(
    connectionString,
    [
      SQL_REPAIR_DOCUMENT_SEQUENCES,
      SQL_DOCUMENT_SEQUENCES,
      SQL_LINK_SEQUENCES,
    ].join('\n'),
  )

  const pool = new Pool({
    connectionString,
    options: '-c search_path=tenant,public',
    max: 1,
  })

  try {
    const shared = await pool.query(`
      SELECT sequence_id, COUNT(DISTINCT document_type_id)::int AS type_count
      FROM document_type_sequences
      GROUP BY sequence_id
      HAVING COUNT(DISTINCT document_type_id) > 1
    `)

    const invalidCounters = await pool.query(`
      SELECT sequence.id, sequence.name, sequence.current_number, MAX(document.number) AS historical_max
      FROM document_sequences sequence
      JOIN documents document ON document.document_sequence_id = sequence.id
      GROUP BY sequence.id, sequence.name, sequence.current_number
      HAVING sequence.current_number < MAX(document.number)
    `)

    const unlinked = await pool.query(`
      SELECT dt.code
      FROM document_types dt
      WHERE dt.deleted_at IS NULL
        AND dt.category IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM document_type_sequences link
          WHERE link.document_type_id = dt.id
        )
      ORDER BY dt.code
    `)

    if (shared.rowCount || invalidCounters.rowCount) {
      throw new Error(
        `Validación fallida: ${shared.rowCount} series compartidas y ${invalidCounters.rowCount} contadores inconsistentes`,
      )
    }

    console.log('OK: ninguna secuencia está compartida entre tipos documentales.')
    console.log('OK: todos los contadores respetan el máximo histórico, incluidos eliminados.')
    if (unlinked.rowCount) {
      console.log(`Tipos sin secuencia (revisar si es intencional): ${unlinked.rows.map(row => row.code).join(', ')}`)
    }
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error('No se pudieron reparar las secuencias:', error.message)
  process.exit(1)
})
