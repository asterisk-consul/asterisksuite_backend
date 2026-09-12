const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://Asterisk-admin:Asterisk-admin@72.61.59.61:5434/dev_db',
  options: '-c search_path="tenant",public',
});

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT p.id, p.name, p.tax_category_id, p.sku
      FROM tenant.products p
      WHERE p.id = 'f4a9ec9c-cdde-4563-a8e5-85c66def6a6c'
    `);
    console.log('=== PRODUCT f4a9ec9c ===');
    console.log(result.rows);

    const allProducts = await client.query('SELECT id, name, sku FROM tenant.products ORDER BY name');
    console.log('\n=== ALL PRODUCTS ===');
    console.log(allProducts.rows);
  } finally {
    await client.end();
    await pool.end();
  }
}

main().catch(console.error);
