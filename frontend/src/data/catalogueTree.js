/**
 * Single source of truth for storefront nav + product category chips + admin seed tree.
 * Parent slugs are used in URLs: /products?category=trousers&sub=Khaki
 */

import CATALOGUE_TREE_RAW from './catalogue-tree.json';

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Canonical catalogue hierarchy */
export const CATALOGUE_TREE = CATALOGUE_TREE_RAW;

export const CATALOGUE_PARENT_SLUGS = CATALOGUE_TREE.map((cat) => cat.slug);

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

/** Sort DB root categories with catalogue parents first (storefront order). */
export const sortParentCategories = (categories = []) => {
  const roots = categories.filter((c) => !c.parent_id);
  const order = new Map(CATALOGUE_TREE.map((cat, i) => [cat.slug, i]));
  return [...roots].sort((a, b) => {
    const ai = order.has(a.slug) ? order.get(a.slug) : 999;
    const bi = order.has(b.slug) ? order.get(b.slug) : 999;
    if (ai !== bi) return ai - bi;
    return String(a.name).localeCompare(String(b.name));
  });
};

/** Human label: Parent › Sub (or just name). */
export const formatCategoryPath = (product, categories = []) => {
  if (product?.parent_category_name && product?.category_name) {
    return `${product.parent_category_name} › ${product.category_name}`;
  }
  if (product?.category_name && categories.length) {
    const leaf = categories.find((c) => c.id === product.category_id);
    if (leaf?.parent_id) {
      const parent = categories.find((c) => c.id === leaf.parent_id);
      if (parent) return `${parent.name} › ${leaf.name}`;
    }
    return product.category_name;
  }
  return product?.category_name || 'Uncategorized';
};
