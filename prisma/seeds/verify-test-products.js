const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Yedroloski12.-@localhost:5432/dev_db',
  options: '-c search_path="tenant",public',
});

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT p.id, p.name, p.sku, tc.code as category
      FROM tenant.products p
      LEFT JOIN tenant.tax_categories tc ON tc.id = p.tax_category_id
      WHERE p.sku LIKE 'TEST-%'
      ORDER BY p.sku
    `);
    console.log('=== TEST PRODUCTS ===');
    console.log(result.rows);
  } finally {
    await client.end();
    await pool.end();
  }
}

main().catch(console.error);
