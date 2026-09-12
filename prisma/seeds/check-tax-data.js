const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://Asterisk-admin:Asterisk-admin@72.61.59.61:5434/dev_db',
  options: '-c search_path="tenant",public',
});

async function main() {
  const client = await pool.connect();
  try {
    const cats = await client.query('SELECT id, code, name FROM tenant.tax_categories');
    console.log('=== TAX CATEGORIES ===');
    console.log(cats.rows);

    const taxes = await client.query('SELECT id, code, name, rate, calculation_level FROM tenant.taxes');
    console.log('\n=== TAXES ===');
    console.log(taxes.rows);

    const tct = await client.query('SELECT * FROM tenant.tax_category_taxes');
    console.log('\n=== TAX_CATEGORY_TAXES ===');
    console.log(tct.rows);
  } finally {
    await client.end();
    await pool.end();
  }
}

main().catch(console.error);
