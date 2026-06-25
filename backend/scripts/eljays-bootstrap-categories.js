require('dotenv').config({ quiet: true });
const db = require('../src/config/db');

(async () => {
  await db.query(`
    INSERT INTO categories (name, slug, description)
    VALUES ('Belts & Ties', 'belts-ties', 'Belts and ties')
    ON CONFLICT (slug) DO NOTHING
  `);
  await db.query(`
    INSERT INTO brands (name, slug, description)
    VALUES ('ELIJAY''S Men''s Wear', 'elijays-mens-wear', 'ELIJAY''S Men''s Wear')
    ON CONFLICT (slug) DO NOTHING
  `);
  console.log('Category and brand ready');
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
