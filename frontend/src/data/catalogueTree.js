/**
 * Single source of truth for storefront nav + product category chips + admin seed tree.
 * Parent slugs are used in URLs: /products?category=trousers&sub=Khaki
 */

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Canonical catalogue hierarchy */
export const CATALOGUE_TREE = [
  {
    name: 'Trousers',
    slug: 'trousers',
    route: '/trousers',
    sub: ['Khaki', 'Formal', 'Official', 'Chino'],
    match: ['trousers', 'khaki', 'chino', 'official', 'formal trouser', 'pants'],
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    route: '/shirts',
    sub: ['Polos', 'Cuban', 'Boss', 'Tommy Hilfiger', 'Lacoste'],
    match: ['shirts', 'polo', 'cuban', 'boss', 'tommy', 'hilfiger', 'lacoste'],
  },
  {
    name: 'Suits',
    slug: 'suits',
    route: '/suits',
    sub: ['Two Piece', 'Three Piece'],
    match: ['suits', 'suiting', 'two piece', 'three piece', 'blazer'],
  },
  {
    name: 'Jackets',
    slug: 'jackets',
    route: '/jackets',
    sub: ['Jackets', 'Half Jackets', 'Blazers'],
    match: ['jackets', 'jacket', 'blazers', 'half jacket', 'outerwear'],
  },
  {
    name: 'Sweaters',
    slug: 'sweaters',
    route: '/sweaters',
    sub: ['Crew Neck', 'V-Neck', 'Cardigan'],
    match: ['sweaters', 'sweater', 'knit', 'cardigan'],
  },
  {
    name: 'Formal Wear',
    slug: 'formal-wear',
    route: '/products?category=formal-wear',
    sub: ['Official Shirts', 'Formal Trousers', 'Ties'],
    match: ['formal-wear', 'formal wear', 'official', 'formal', 'presidential'],
  },
  {
    name: 'Casual Wear',
    slug: 'casual-wear',
    route: '/products?category=casual-wear',
    sub: ['T-Shirts', 'Sweatshirts', 'Linen'],
    match: ['casual-wear', 'casual wear', 't-shirts', 'sweat', 'round-neck', 'v-neck', 'linen'],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    route: '/products?category=accessories',
    sub: ['Belts & Ties', 'Caps & Hats'],
    match: ['accessories', 'belts', 'ties', 'belts-ties', 'caps', 'hats'],
  },
];

/** Navbar mega-menu derived from catalogue */
export const buildNavParents = () =>
  CATALOGUE_TREE.map((cat) => ({
    name: cat.name,
    href: cat.route || `/products?category=${cat.slug}`,
    children: cat.sub.map((sub) => {
      const base = cat.route && !String(cat.route).includes('?')
        ? cat.route
        : `/products?category=${cat.slug}`;
      const sep = base.includes('?') ? '&' : '?';
      return {
        name: sub,
        href: `${base}${sep}sub=${encodeURIComponent(sub)}`,
      };
    }),
  }));

/** Products page chip data */
export const buildCategoryData = () => [
  { id: 'All', name: 'All', sub: [] },
  ...CATALOGUE_TREE.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    sub: [...cat.sub],
  })),
];

/** Homepage product rows */
export const buildHomeCategorySections = () =>
  CATALOGUE_TREE.map((cat) => ({
    title: cat.name,
    viewAllPath: cat.route || `/products?category=${cat.slug}`,
    match: cat.match || [cat.slug, cat.name],
  }));

/** Dedicated path segments that use Products categoryOverride */
export const DEDICATED_CATEGORY_PAGES = CATALOGUE_TREE
  .filter((cat) => cat.route && !String(cat.route).includes('?'))
  .map((cat) => cat.slug);

export const productMatchesCategory = (product, matchTerms = []) => {
  const haystack = [
    product.category_name,
    product.category_slug,
    product.parent_category_name,
    product.parent_category_slug,
    product.subcategory,
    product.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return matchTerms.some((term) => haystack.includes(String(term).toLowerCase()));
};

/** Find catalogue entry by slug or name */
export const findCatalogueCategory = (value) => {
  const key = slugify(value);
  return CATALOGUE_TREE.find(
    (cat) => cat.slug === key || slugify(cat.name) === key
  ) || null;
};
