#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'dist']);
const EXT = new Set(['.js', '.jsx']);

const fixes = [
  [""ELIJAY'S Men's Wear"", '"ELIJAY\'S Men\'s Wear"'],
  [""ELIJAY'S Men's Wear Team"", '"ELIJAY\'S Men\'s Wear Team"'],
  [""ELIJAY'S Men's Wear Editorial"", '"ELIJAY\'S Men\'s Wear Editorial"'],
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, 'utf8');
  const orig = text;
  for (const [from, to] of fixes) text = text.split(from).join(to);
  // Generic fix for remaining broken single-quoted ELIJAY'S strings
  text = text.replace(/'ELIJAY'S Men\\?'s Wear([^']*)'/g, (_, rest) => `"ELIJAY'S Men's Wear${rest.replace(/\\'/g, "'")}"`);
  if (text !== orig) {
    fs.writeFileSync(file, text);
    n += 1;
    console.log(path.relative(ROOT, file));
  }
}
console.log(`Fixed ${n} files`);
