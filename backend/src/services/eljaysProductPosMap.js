/**
 * Map ELIJAY'S ecommerce products to POS lines from the June 16 stock Excel.
 * Products outside these buckets should not appear on the website or in POS.
 */
const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Category slugs with no matching Excel inventory line — hide all products. */
const EXCLUDED_CATEGORY_SLUGS = new Set([
  'track-suits',
  'tracksuits',
  'linen',
  'linen-set',
  'linen-trousers',
  'linen-shorts',
  't-shirts',
  'sweat-shirts',
  'round-neck-t-shirts',
  'v-neck-t-shirts',
  'shoes',
  'formal-shoes',
  'casual-shoes',
  'loafers',
  'chino',
  'gurkha',
  'presidential',
]);

/** Category slug → Excel POS names (first match wins when linking). */
const CATEGORY_TO_POS = {
  'belts-ties': ['Belt official', 'Belt c', 'Ties'],
  suits: ['Suits'],
  'two-piece': ['Suits'],
  'three-piece': ['Suits'],
  formal: ['Official trousers'],
  khaki: ['Khaki slim', 'Khaki exp'],
  jeans: ['Jeans trousers'],
  'polo-t-shirts': ['Polo T-shirts', 'Polo Big'],
  polos: ['Polo T-shirts', 'Polo Big'],
  'knitted-polos': ['Polo T-shirts', 'Polo Big'],
  jackets: ['Jacket Turkey', 'Jacket khaki', 'Jacket exp', 'Jacket light'],
  'half-jackets': ['Jacket light', 'Jacket exp'],
  sweaters: ['Sweater round', 'Sweater zip', 'Official Sweater (T)'],
  shirts: ['Official Shirts', 'Official Floral', 'Jeans Shirts', 'Jeans Shirts big', 'Khaki Shirts', 'Linnen Shirts'],
  'formal-shirts': ['Official Shirts', 'Official Floral'],
  'linen-shirts': ['Linnen Shirts'],
  blazers: ['Vest'],
  'caps-hats': ['Caps'],
};

const NAME_RULES = [
  { pos: 'Belt c', keywords: ['belt c', 'casual belt'] },
  { pos: 'Belt official', keywords: ['official belt', 'formal belt', 'dress belt', 'leather belt'] },
  { pos: 'Ties', keywords: [' tie', 'necktie', 'bow tie', 'cravat'] },
  { pos: 'Official Floral', keywords: ['floral'] },
  { pos: 'Jeans Shirts big', keywords: ['big size', 'big fit', 'plus size', 'oversized shirt'] },
  { pos: 'Jeans Shirts', keywords: ['jean shirt', 'denim shirt', 'jeans shirt'] },
  { pos: 'Khaki Shirts', keywords: ['khaki shirt'] },
  { pos: 'Linnen Shirts', keywords: ['linen shirt', 'linnen', 'linen'] },
  { pos: 'Official Shirts', keywords: ['official shirt', 'dress shirt', 'formal shirt', 'executive shirt'] },
  { pos: 'Khaki slim', keywords: ['slim khaki', 'smart flex', 'slim fit khaki', 'tapered khaki'] },
  { pos: 'Khaki exp', keywords: ['expanded khaki', 'relaxed khaki', 'exp khaki'] },
  { pos: 'Official trousers', keywords: ['official trouser', 'formal trouser', 'dress pant', 'formal pant'] },
  { pos: 'Jeans trousers', keywords: ['jean', 'denim trouser', 'denim pant'] },
  { pos: 'Polo Big', keywords: ['big polo', 'polo big'] },
  { pos: 'Polo T-shirts', keywords: ['polo', 'knit polo', 'knitted polo'] },
  { pos: 'Jacket Turkey', keywords: ['turkey jacket', 'premium jacket'] },
  { pos: 'Jacket khaki', keywords: ['khaki jacket'] },
  { pos: 'Jacket light', keywords: ['light jacket', 'lightweight jacket', 'half jacket'] },
  { pos: 'Jacket exp', keywords: ['exp jacket', 'expanded jacket'] },
  { pos: 'Sweater round', keywords: ['round neck sweater', 'round-neck sweater', 'crew neck sweater'] },
  { pos: 'Sweater zip', keywords: ['zip sweater', 'zip-up sweater', 'zip up'] },
  { pos: 'Official Sweater (T)', keywords: ['official sweater', 'formal sweater'] },
  { pos: 'Vest', keywords: ['vest', 'waistcoat', 'gilet'] },
  { pos: 'Caps', keywords: ['cap', 'hat', 'baseball'] },
  { pos: 'Suits', keywords: ['suit', 'two piece', 'three piece', 'tuxedo'] },
];

const inferPosName = (productName, categorySlug) => {
  const n = normalize(productName);
  for (const rule of NAME_RULES) {
    if (rule.keywords.some((kw) => n.includes(normalize(kw)))) return rule.pos;
  }
  const hints = CATEGORY_TO_POS[categorySlug];
  return hints?.[0] || null;
};

const findPosByName = (posProducts, posName) => {
  if (!posName) return null;
  const target = normalize(posName);
  return posProducts.find((p) => normalize(p.name) === target) || null;
};

const isCategoryExcluded = (categorySlug) => EXCLUDED_CATEGORY_SLUGS.has(categorySlug);

const resolvePosForProduct = (product, posProducts, allowedPosNames) => {
  const slug = product.category_slug;
  if (isCategoryExcluded(slug)) return null;

  const inferred = inferPosName(product.name, slug);
  if (inferred && allowedPosNames.has(normalize(inferred))) {
    return findPosByName(posProducts, inferred);
  }

  const hints = CATEGORY_TO_POS[slug] || [];
  for (const hint of hints) {
    if (allowedPosNames.has(normalize(hint))) {
      const pos = findPosByName(posProducts, hint);
      if (pos) return pos;
    }
  }

  return null;
};

module.exports = {
  normalize,
  EXCLUDED_CATEGORY_SLUGS,
  CATEGORY_TO_POS,
  inferPosName,
  findPosByName,
  isCategoryExcluded,
  resolvePosForProduct,
};
