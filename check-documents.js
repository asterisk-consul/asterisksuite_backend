const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Yedroloski12.-@localhost:5432/dev_db'
});

async function main() {
  try {
    // Verificar duplicados
    const docsResult = await pool.query(
      `SELECT document_type_id, number, COUNT(*) as cnt 
       FROM tenant.documents 
       WHERE document_type_id = $1 AND deleted_at IS NULL 
       GROUP BY document_type_id, number 
       HAVING COUNT(*) > 1`,
      ['3fa80518-d453-4f02-a150-deb313907b33']
    );
    console.log('Duplicates:', JSON.stringify(docsResult.rows));

    // Ver último número
    const maxResult = await pool.query(
      `SELECT COALESCE(MAX(number), 0) as max_num 
       FROM tenant.documents 
       WHERE document_type_id = $1 AND deleted_at IS NULL`,
      ['3fa80518-d453-4f02-a150-deb313907b33']
    );
    console.log('Max number:', JSON.stringify(maxResult.rows));

    // Ver secuencia (en schema tenant)
    const seqResult = await pool.query(
      `SELECT id, name, current_number 
       FROM tenant.document_sequences 
       WHERE id = $1`,
      ['9e103e60-e51a-492a-9c46-2d5eb7c39088']
    );
    console.log('Sequence:', JSON.stringify(seqResult.rows));

    await pool.end();
  } catch (e) {
    console.error(e);
    await pool.end();
  }
}

main();
