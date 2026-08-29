/* Compress product/hero images in frontend/public in place.
 * Re-encodes JPEG at quality ~80 (mozjpeg, chroma subsampling 4:2:0).
 * Strips EXIF, keeps dimensions & filenames. Backs up originals before writing.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public');
const JPEG_Q = 72;
const extensionRe = /\.(jpe?g)$/i;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });

const targets = walk(ROOT).filter((f) => extensionRe.test(f));
const backupDir = fs.mkdtempSync('/tmp/elijays-img-');
const results = { ok: 0, skipped: 0, failed: 0, savedBytes: 0, origBytes: 0 };
const failList = [];

console.log(`Compressing ${targets.length} JPEGs from ${ROOT} (backup: ${backupDir})\n`);

const compressOne = (file) => sharp(file, { animated: false })
  .rotate()
  .resize({ width: 1600, withoutEnlargement: true })
  .jpeg({ quality: JPEG_Q, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toBuffer();

await Promise.all(targets.map(async (file) => {
  const before = fs.statSync(file).size;
  const rel = path.relative(ROOT, file);

  try {
    const buf = await compressOne(file);
    if (buf && buf.length < before - 4096) {
      const backup = path.join(backupDir, rel);
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.copyFileSync(file, backup);
      fs.writeFileSync(file, buf);
      results.ok += 1;
      results.savedBytes += before - buf.length;
      results.origBytes += before;
      const pct = Math.round((1 - buf.length / before) * 100);
      console.log(`  ok ${rel}: ${(before / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB (${pct}% smaller)`);
    } else {
      results.skipped += 1;
      console.log(`  -  ${rel}: already small (${(before / 1024).toFixed(0)}KB), kept`);
    }
  } catch (err) {
    results.failed += 1;
    failList.push({ rel, err: String(err?.message || err) });
    console.log(`  x  ${rel}: ${err?.message || err}`);
  }
}));

console.log(`\nDone. Compressed: ${results.ok}, skipped: ${results.skipped}, failed: ${results.failed}`);
console.log(`Bytes saved: ${(results.savedBytes / 1024 / 1024).toFixed(1)} MB`);
if (failList.length) {
  console.log('\nFailed files:');
  failList.forEach(({ rel, err }) => console.log(`  ${rel}: ${err}`));
}
console.log(`\nOriginals backed up to: ${backupDir}`);