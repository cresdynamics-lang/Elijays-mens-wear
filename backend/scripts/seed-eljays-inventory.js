#!/usr/bin/env node
/**
 * Seed ELIJAY'S POS inventory from bundled Excel stock sheet.
 * Usage: node scripts/seed-eljays-inventory.js [--reset]
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { importStockExcelBuffer } = require('../src/services/stockExcelImport');

const EXCEL = path.join(__dirname, '../data/eljays-inventory-stock-june16.xlsx');

const run = async () => {
  if (!fs.existsSync(EXCEL)) {
    console.error('Missing inventory file:', EXCEL);
    process.exit(1);
  }
  const buffer = fs.readFileSync(EXCEL);
  const result = await importStockExcelBuffer(buffer, {
    mode: 'opening_reset',
    recordMovements: false,
  });
  console.log('ELIJAY\'S inventory seeded:', {
    created: result.created,
    updated: result.updated,
    rows: result.products?.length,
    date: result.date,
  });
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
