require('dotenv').config({ quiet: true });
const db = require('../src/config/db');

(async () => {
  const [p, pos, linked, shoes, inv, cats] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS c FROM products WHERE is_active = true'),
    db.query("SELECT COUNT(*)::int AS c FROM pos_products WHERE sku NOT LIKE 'POS-%'"),
    db.query('SELECT COUNT(*)::int AS c FROM products WHERE pos_stock_product_id IS NOT NULL AND is_active = true'),
    db.query("SELECT COUNT(*)::int AS c FROM products p JOIN categories c ON c.id = p.category_id WHERE c.slug ILIKE '%shoe%' AND p.is_active = true"),
    db.query('SELECT COUNT(*)::int AS c FROM pos_products pp LEFT JOIN pos_stock_levels s ON s.product_id = pp.id WHERE pp.sku LIKE \'POS-%\' OR pp.name IS NOT NULL'),
    db.query('SELECT COUNT(*)::int AS c FROM categories'),
  ]);
  console.log(JSON.stringify({
    activeProducts: p.rows[0].c,
    posManagedRows: pos.rows[0].c,
    linkedToPos: linked.rows[0].c,
    shoeProducts: shoes.rows[0].c,
    posRows: inv.rows[0].c,
    categories: cats.rows[0].c,
  }, null, 2));
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
