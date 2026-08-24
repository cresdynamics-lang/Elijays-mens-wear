/**
 * Syncs canonical catalogue categories into Postgres for admin product forms.
 * Source: frontend/src/data/catalogue-tree.json (shared with storefront).
 * Usage: node scripts/sync-catalogue-categories.js
 */
require('dotenv').config();
const path = require('path');
const db = require('../src/config/db');

const CATALOGUE_TREE = require(path.join(
  __dirname,
  '../../frontend/src/data/catalogue-tree.json'
));

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function ensureCategory(name, parentId = null, preferredSlug = null) {
  let slug = preferredSlug || slugify(name);
  // Avoid parent/child slug collisions (e.g. Jackets / Jackets)
  if (parentId && !preferredSlug) {
    const parent = await db.query('SELECT slug FROM categories WHERE id = $1', [parentId]);
    if (parent.rows[0]?.slug === slug) {
      slug = `${slug}-style`;
    }
  }

  const found = await db.query(
    `SELECT id, parent_id, name, slug FROM categories
     WHERE (slug = $1 OR lower(name) = lower($2))
       AND (($3::uuid IS NULL AND parent_id IS NULL) OR parent_id = $3)
     LIMIT 1`,
    [slug, name, parentId]
  );

  if (found.rows.length) {
    const row = found.rows[0];
    await db.query(
      `UPDATE categories
       SET name = $1, slug = $2, parent_id = $3
       WHERE id = $4`,
      [name, slug, parentId, row.id]
    );
    return row.id;
  }

  const slugTaken = await db.query('SELECT id FROM categories WHERE slug = $1', [slug]);
  if (slugTaken.rows.length) {
    slug = `${slug}-${parentId ? String(parentId).slice(0, 8) : 'root'}`;
  }

  const inserted = await db.query(
    `INSERT INTO categories (name, slug, description, parent_id, is_featured)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id`,
    [name, slug, `${name} — ELIJAYS Men's Wear`, parentId]
  );
  return inserted.rows[0].id;
}

async function main() {
  console.log('Syncing catalogue categories from catalogue-tree.json…');
  for (const category of CATALOGUE_TREE) {
    const parentId = await ensureCategory(category.name, null, category.slug);
    console.log('Parent', category.name, parentId);
    for (const sub of category.sub) {
      const subId = await ensureCategory(sub, parentId);
      console.log('  Sub', sub, subId);
    }
  }
  const count = await db.query('SELECT COUNT(*)::int AS c FROM categories');
  console.log('Done. categories rows:', count.rows[0].c);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
