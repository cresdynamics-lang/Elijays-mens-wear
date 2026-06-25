#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../frontend/src');
const re = /'([^'\n]*ELIJAY'S[^'\n]*)'/g;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(ent.name)) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, 'utf8');
  const next = text.replace(re, (_, inner) => `"${inner}"`);
  if (next !== text) {
    fs.writeFileSync(file, next);
    n += 1;
    console.log(path.relative(ROOT, file));
  }
}
console.log(`Fixed ${n} frontend files`);
