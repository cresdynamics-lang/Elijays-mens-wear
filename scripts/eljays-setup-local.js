#!/usr/bin/env node
/**
 * One-command local setup for ELIJAY'S Men's Wear.
 * Usage: node scripts/eljays-setup-local.js
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BACKEND = path.join(ROOT, 'backend');

const run = (cmd, args, cwd = BACKEND) => {
  console.log(`\n>>> ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: true });
  if (r.status !== 0) process.exit(r.status || 1);
};

if (!fs.existsSync(path.join(BACKEND, '.env'))) {
  fs.copyFileSync(path.join(BACKEND, '.env.example'), path.join(BACKEND, '.env'));
  console.log('Created backend/.env — review DB credentials before production.');
}

run('npm', ['ci'], BACKEND);
run('node', ['create_db.js'], BACKEND);

// Fresh DB needs base schema before numbered migrations
run('node', ['-e', `
  require('dotenv').config();
  const fs=require('fs');
  const db=require('./src/config/db');
  db.query(fs.readFileSync('src/db/migrations/schema.sql','utf8')).then(()=>process.exit(0));
`], BACKEND);

run('npm', ['run', 'db:migrate'], BACKEND);
run('node', ['scripts/eljays-bootstrap-categories.js'], BACKEND);
run('node', ['seed-admin.js', '--name=ELIJAY Admin', '--email=admin@elijays.co.ke', '--password=elijays2026'], BACKEND);
run('npm', ['run', 'seed:eljays-inventory'], BACKEND);
run('node', ['seed-store.js'], BACKEND);
run('node', ['scripts/eljays-import-catalog.js', '--run'], BACKEND);
run('npm', ['run', 'link:products'], BACKEND);

run('npm', ['ci'], path.join(ROOT, 'frontend'));
run('npm', ['run', 'build'], path.join(ROOT, 'frontend'));

console.log('\n=== ELIJAY\'S local setup complete ===');
console.log('Admin: admin@elijays.co.ke / eljays2026');
console.log('Start: cd backend && npm run dev');
console.log('       cd frontend && npm run dev');
