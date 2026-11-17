const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const backend = require('../src/utils/cloudinaryImage');
const frontendSource = fs.readFileSync(path.join(__dirname, '../../frontend/src/utils/cloudinary.js'), 'utf8');
const frontend = import(`data:text/javascript;base64,${Buffer.from(frontendSource).toString('base64')}`);

for (const [name, getHelpers] of [['backend', async () => backend], ['frontend', () => frontend]]) {
  test(`${name}: preserves underscore folders and public IDs`, async () => {
    const { optimizeCloudinaryUrl } = await getHelpers();
    for (const asset of ['mens_wear/shirt_blue.jpg', 'shirt_blue', 'v123/mens_wear/shirt_blue.jpg']) {
      const url = `https://res.cloudinary.com/demo/image/upload/${asset}`;
      const result = optimizeCloudinaryUrl(url);
      assert.equal(result, `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_limit/${asset}`);
      assert.equal(optimizeCloudinaryUrl(result), result);
    }
  });
  test(`${name}: preserves existing custom transformations`, async () => {
    const { optimizeCloudinaryUrl } = await getHelpers();
    const result = optimizeCloudinaryUrl('https://res.cloudinary.com/demo/image/upload/e_grayscale/mens_wear/shirt.jpg');
    assert.ok(result.endsWith('/e_grayscale/mens_wear/shirt.jpg'));
  });
}
test('frontend: resolves uploaded images without rewriting storefront assets', async () => {
  const { getImageSrc, resolveDisplayImageUrl } = await frontend;
  assert.equal(getImageSrc('/uploads/shirt.jpg'), 'http://localhost/uploads/shirt.jpg');
  assert.equal(getImageSrc({ secure_url: '/uploads/shirt.jpg' }), 'http://localhost/uploads/shirt.jpg');
  assert.equal(resolveDisplayImageUrl('/shirt.jpg'), '/shirt.jpg');
  assert.equal(resolveDisplayImageUrl('blob:expired'), '');
});
