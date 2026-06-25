#!/usr/bin/env node
/**
 * Import ELIJAY'S website catalog from Prince-style JSON + images (NO footwear).
 * Requires Cloudinary or STORAGE_ALLOW_LOCAL=true in backend/.env
 *
 * Usage:
 *   node scripts/eljays-import-catalog.js           # dry-run list
 *   node scripts/eljays-import-catalog.js --run     # execute imports
 */
const { spawnSync } = require('child_process');
const path = require('path');

const IMPORTS = [
  'import:belts-catalog',
  'import:presidential-shirts',
  'import:shirts-catalog',
  'import:suits-catalog',
  'import:three-piece-catalog',
  'import:khaki-catalog',
  'import:jeans-catalog',
  'import:jackets-catalog',
  'import:knitted-polos-catalog',
  'import:linen-catalog',
  'import:tracksuits-catalog',
  'import:sweatshirts-catalog',
  'import:round-neck-catalog',
  'import:caps-hats-catalog',
  // Footwear intentionally excluded for ELIJAY'S
];

const run = process.argv.includes('--run');
const root = path.join(__dirname, '..');

console.log("ELIJAY'S catalog import plan (no shoes):\n");
IMPORTS.forEach((s, i) => console.log(`  ${i + 1}. npm run ${s}`));

if (!run) {
  console.log('\nDry run only. Re-run with --run to execute each import sequentially.');
  process.exit(0);
}

for (const script of IMPORTS) {
  console.log(`\n>>> npm run ${script}`);
  const r = spawnSync('npm', ['run', script], { cwd: root, stdio: 'inherit', shell: true });
  if (r.status !== 0) {
    console.error(`Failed: ${script}`);
    process.exit(r.status || 1);
  }
}
console.log('\nCatalog import complete. Run: npm run seed:eljays-inventory && npm run link:products');
