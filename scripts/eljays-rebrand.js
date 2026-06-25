#!/usr/bin/env node
/**
 * One-time rebrand: ELIJAY'S Men's Wear -> ELIJAY'S Men's Wear
 * Run from repo root: node scripts/eljays-rebrand.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.cursor', 'formal-shoes-images', 'casual-shoes-images', 'loafers-images']);
const SKIP_FILES = new Set(['elijays-rebrand.js', 'package-lock.json']);
const TEXT_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.html', '.css', '.sql', '.yml', '.yaml', '.env.example', '.sh']);

const REPLACEMENTS = [
  ['eljays-cart-v2', 'eljays-cart-v2'],
  ['eljays-auth', 'eljays-auth'],
  ['eljays-auth', 'eljays-auth'],
  ['eljays_db', 'eljays_db'],
  ['elijays.co.ke', 'elijays.co.ke'],
  ['ELIJAY'S POS', "ELIJAY'S POS"],
  ['ELIJAY'S Style Journal', "ELIJAY'S Style Journal"],
  ['ELIJAY'S Kenya', "ELIJAY'S Kenya"],
  ['ELIJAY'S Men's Wear', "ELIJAY'S Men's Wear"],
  ['contact@elijays.co.ke', 'contact@elijays.co.ke'],
  ['elijaysmenswear', 'elijaysmenswear'],
  ['elijaysmenswear', 'elijaysmenswear'],
  ['elijaysmenswear', 'elijaysmenswear'],
  ['ELIJAYS', 'ELIJAYS'],
  ['elijays-mens-wear', 'elijays-mens-wear'],
  ['ELIJAY'S Men's Wear', "ELIJAY'S Men's Wear"],
  ['Elijays-Mens-Wear', 'Elijays-Mens-Wear'],
  ['ELJY#', 'ELJY#'],
];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const base = path.basename(file);
  if (SKIP_FILES.has(base)) continue;
  const ext = path.extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext) && base !== '.env.example') continue;
  if (file.includes(`${path.sep}data${path.sep}`) && ext === '.json' && file.includes('-specs')) continue;

  let text = fs.readFileSync(file, 'utf8');
  const orig = text;
  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }
  if (text !== orig) {
    fs.writeFileSync(file, text, 'utf8');
    changed += 1;
    console.log('updated', path.relative(ROOT, file));
  }
}
console.log(`Done. ${changed} files updated.`);
