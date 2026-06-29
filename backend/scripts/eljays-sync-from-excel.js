#!/usr/bin/env node
/**
 * Sync ELIJAY'S inventory + website catalog to the June 16 stock Excel (source of truth).
 *
 * Usage:
 *   node scripts/eljays-sync-from-excel.js [--excel "path/to/file.xlsx"]
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');
const { parseStockExcelBuffer } = require('../src/utils/stockExcelParser');
const { importStockRows } = require('../src/services/stockExcelImport');
const { syncPosPricesFromEcommerce } = require('../src/services/productPosLink');
const { normalize, resolvePosForProduct } = require('../src/services/eljaysProductPosMap');

const DEFAULT_EXCEL = path.join(__dirname, '../data/eljays-inventory-stock-june16.xlsx');

const mergeDuplicateRows = (rows) => {
  const map = new Map();
  for (const row of rows) {
    const key = normalize(row.name);
    if (!map.has(key)) {
      map.set(key, { ...row });
      continue;
    }
    const existing = map.get(key);
    existing.opening += row.opening;
    existing.sales += row.sales;
    existing.stockOut += row.stockOut;
    existing.stockIn += row.stockIn;
    existing.closing = existing.opening - existing.sales - existing.stockOut + existing.stockIn;
  }
  return [...map.values()];
};

const unlinkPosProduct = async (client, posId) => {
  await client.query(
    `UPDATE products SET pos_stock_product_id = NULL WHERE pos_stock_product_id = $1`,
    [posId]
  );
  await client.query(`UPDATE pos_products SET ecommerce_product_id = NULL WHERE id = $1`, [posId]);
};

const purgePosOutsideExcel = async (client, rowNames) => {
  const allowed = rowNames.map((n) => n.trim().toLowerCase());
  await client.query(
    `UPDATE products SET pos_stock_product_id = NULL
     WHERE pos_stock_product_id IN (
       SELECT id FROM pos_products pp
       WHERE NOT (lower(trim(pp.name)) = ANY($1::text[]))
     )`,
    [allowed]
  );
  await client.query(
    `UPDATE pos_products SET ecommerce_product_id = NULL
     WHERE NOT (lower(trim(name)) = ANY($1::text[]))`,
    [allowed]
  );
  await client.query(
    `DELETE FROM pos_sale_items
     WHERE product_id IN (
       SELECT id FROM pos_products
       WHERE NOT (lower(trim(name)) = ANY($1::text[]))
     )`,
    [allowed]
  );
  await client.query(
    `DELETE FROM pos_stock_movements
     WHERE product_id IN (
       SELECT id FROM pos_products
       WHERE NOT (lower(trim(name)) = ANY($1::text[]))
     )`,
    [allowed]
  );
  await client.query(
    `DELETE FROM pos_daily_stock_snapshots
     WHERE product_id IN (
       SELECT id FROM pos_products
       WHERE NOT (lower(trim(name)) = ANY($1::text[]))
     )`,
    [allowed]
  );
  await client.query(
    `DELETE FROM pos_stock_levels
     WHERE product_id IN (
       SELECT id FROM pos_products
       WHERE NOT (lower(trim(name)) = ANY($1::text[]))
     )`,
    [allowed]
  );
  await client.query(
    `DELETE FROM pos_product_variants
     WHERE product_id IN (
       SELECT id FROM pos_products
       WHERE NOT (lower(trim(name)) = ANY($1::text[]))
     )`,
    [allowed]
  );
  const removed = await client.query(
    `DELETE FROM pos_products
     WHERE NOT (lower(trim(name)) = ANY($1::text[]))
     RETURNING id`,
    [allowed]
  );
  return removed.rowCount;
};

const writePosStockCatalogSeed = (rows) => {
  const target = path.join(__dirname, '../src/db/seeds/posStockCatalog.js');
  const lines = rows.map(
    (r) =>
      `  { name: '${r.name.replace(/'/g, "\\'")}', opening: ${r.opening}, sales: 0, stockOut: 0, stockIn: 0, closing: ${Math.max(0, r.opening)} },`
  );
  const body = `// ELIJAY'S inventory lines from Excel (June 16) — auto-synced\nmodule.exports = [\n${lines.join('\n')}\n];\n`;
  fs.writeFileSync(target, body, 'utf8');
};

const run = async () => {
  const excelArg = process.argv.find((a) => a.startsWith('--excel='));
  const excelPath = excelArg ? excelArg.slice('--excel='.length) : DEFAULT_EXCEL;

  if (!fs.existsSync(excelPath)) {
    console.error('Excel file not found:', excelPath);
    process.exit(1);
  }

  const buffer = fs.readFileSync(excelPath);
  const parsed = await parseStockExcelBuffer(buffer);
  const rows = mergeDuplicateRows(parsed);

  console.log(`Excel source: ${excelPath}`);
  console.log(`Inventory lines (merged): ${rows.length}`);
  rows.forEach((r) => console.log(`  • ${r.name}: ${r.opening}`));

  fs.copyFileSync(excelPath, DEFAULT_EXCEL);
  writePosStockCatalogSeed(rows);

  const importResult = await importStockRows(rows, {
    mode: 'opening_reset',
    recordMovements: false,
  });
  console.log('\nPOS stock import:', importResult);

  const allowedNames = new Set(rows.map((r) => normalize(r.name)));
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const allowedPos = await client.query(`SELECT id, name FROM pos_products ORDER BY name`);
    const allowedPosIds = new Set(allowedPos.rows.map((p) => p.id));
    const allowedPosNames = new Set(allowedPos.rows.map((p) => normalize(p.name)));

    const products = await client.query(`
      SELECT p.id, p.name, p.is_active, c.slug AS category_slug, p.pos_stock_product_id
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
    `);

    let linked = 0;
    let deactivated = 0;
    let kept = 0;

    for (const product of products.rows) {
      const pos = resolvePosForProduct(product, allowedPos.rows, allowedPosNames);

      if (!pos) {
        if (product.pos_stock_product_id) {
          await client.query(`UPDATE products SET pos_stock_product_id = NULL WHERE id = $1`, [product.id]);
        }
        if (product.is_active) {
          await client.query(`UPDATE products SET is_active = false WHERE id = $1`, [product.id]);
          deactivated += 1;
        }
        continue;
      }

      if (product.pos_stock_product_id !== pos.id) {
        await client.query(`UPDATE products SET pos_stock_product_id = $1 WHERE id = $2`, [pos.id, product.id]);
        await client.query(`UPDATE pos_products SET ecommerce_product_id = $1 WHERE id = $2`, [product.id, pos.id]);
        linked += 1;
      }

      if (!product.is_active) {
        await client.query(`UPDATE products SET is_active = true WHERE id = $1`, [product.id]);
      }
      kept += 1;
    }

    // Deactivate anything still linked to a removed POS bucket
    const orphanLink = await client.query(`
      UPDATE products SET is_active = false, pos_stock_product_id = NULL
      WHERE pos_stock_product_id IS NOT NULL
        AND NOT (pos_stock_product_id = ANY($1::uuid[]))
      RETURNING id, name
    `, [[...allowedPosIds]]);
    deactivated += orphanLink.rowCount;

    const allowedNameList = rows.map((r) => r.name);
    const removedPos = await purgePosOutsideExcel(client, allowedNameList);
    console.log(`Bulk-removed POS lines not in Excel: ${removedPos}`);

    // Re-link active products after purge (POS ids stable for Excel names)
    const excelPos = await client.query(`SELECT id, name FROM pos_products ORDER BY name`);
    const excelPosNames = new Set(excelPos.rows.map((p) => normalize(p.name)));
    const activeProducts = await client.query(`
      SELECT p.id, p.name, p.is_active, c.slug AS category_slug, p.pos_stock_product_id
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = true
    `);
    for (const product of activeProducts.rows) {
      const pos = resolvePosForProduct(product, excelPos.rows, excelPosNames);
      if (pos && product.pos_stock_product_id !== pos.id) {
        await client.query(`UPDATE products SET pos_stock_product_id = $1 WHERE id = $2`, [pos.id, product.id]);
      }
    }

    await client.query('COMMIT');

    await syncPosPricesFromEcommerce();

    // Final purge outside transaction (guards against POS row recreation during import hooks)
    const finalClient = await db.pool.connect();
    try {
      const finalRemoved = await purgePosOutsideExcel(finalClient, rows.map((r) => r.name));
      console.log(`Final POS purge (post-sync): ${finalRemoved} removed`);
    } finally {
      finalClient.release();
    }

    const summary = await db.query(`
      SELECT
        (SELECT COUNT(*)::int FROM pos_products) AS pos_lines,
        (SELECT COUNT(*)::int FROM products WHERE is_active = true) AS active_products,
        (SELECT COUNT(*)::int FROM products WHERE is_active = true AND pos_stock_product_id IS NOT NULL) AS linked_products
    `);

    console.log('\nSync complete:');
    console.log(`  POS lines removed (not in Excel): ${removedPos}`);
    console.log(`  Ecommerce re-linked: ${linked}`);
    console.log(`  Ecommerce deactivated: ${deactivated}`);
    console.log(`  Ecommerce active (Excel-aligned): ${kept}`);
    console.log('  Totals:', summary.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
