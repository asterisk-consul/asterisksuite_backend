const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://Asterisk-admin:Asterisk-admin@72.61.59.61:5434/dev_db',
  options: '-c search_path="tenant",public',
});

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT p.id, p.name, p.tax_category_id, tc.code as category_code
      FROM tenant.products p
      LEFT JOIN tenant.tax_categories tc ON tc.id = p.tax_category_id
    `);
    console.log('=== PRODUCTS ===');
    console.log(result.rows);

    const tct = await client.query(`
      SELECT tc.code as category, t.code as tax, t.rate
      FROM tenant.tax_category_taxes tct
      JOIN tenant.tax_categories tc ON tc.id = tct.tax_category_id
      JOIN tenant.taxes t ON t.id = tct.tax_id
    `);
    console.log('\n=== TAX_CATEGORY_TAXES ===');
    console.log(tct.rows);
  } finally {
    await client.end();
    await pool.end();
  }
}

main().catch(console.error);
