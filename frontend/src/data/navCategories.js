/** Nav parents + subcategory filters — Elijay's build brief */

export const NAV_PARENTS = [
  {
    name: 'Shirts & Polos',
    href: '/products?category=shirts',
    children: [
      { name: 'Formal', href: '/products?category=shirts&sub=Formal' },
      { name: 'Casual', href: '/products?category=shirts&sub=Casual' },
      { name: 'Presidential', href: '/products?category=shirts&sub=Presidential' },
      { name: 'Knitted Polos', href: '/polo-t-shirts' },
      { name: 'Polos', href: '/polo-t-shirts' },
    ],
  },
  {
    name: 'Suiting',
    href: '/suits',
    children: [
      { name: 'Two Piece', href: '/suits?sub=Two%20piece' },
      { name: 'Three Piece', href: '/suits?sub=Three%20piece' },
      { name: 'Blazers', href: '/products?category=blazers' },
    ],
  },
  {
    name: 'Trousers & Linen',
    href: '/trousers',
    children: [
      { name: 'Khaki', href: '/trousers?sub=Khaki' },
      { name: 'Formal', href: '/trousers?sub=Formal' },
      { name: 'Chino', href: '/trousers?sub=Chino' },
      { name: 'Jeans', href: '/trousers?sub=Jeans' },
      { name: 'Gurkha', href: '/trousers?sub=Gurkha' },
      { name: 'Linen Set', href: '/linen' },
      { name: 'Linen Trousers', href: '/linen' },
      { name: 'Linen Shirts', href: '/linen' },
      { name: 'Linen Shorts', href: '/linen' },
    ],
  },
  {
    name: 'Outerwear',
    href: '/products?category=jackets',
    children: [
      { name: 'Jackets', href: '/products?category=jackets' },
      { name: 'Half Jackets', href: '/products?category=jackets' },
      { name: 'Track Suits', href: '/products?category=track-suits' },
      { name: 'Sweaters', href: '/products?category=sweaters' },
    ],
  },
  {
    name: 'Casualwear',
    href: '/products?category=t-shirts',
    children: [
      { name: 'Sweat-shirts', href: '/products?category=t-shirts&sub=Sweat-shirts' },
      { name: 'Round-neck', href: '/products?category=t-shirts&sub=Round-neck%20T-shirts' },
      { name: 'V-neck', href: '/products?category=t-shirts&sub=V-neck%20T-shirts' },
    ],
  },
  {
    name: 'Accessories',
    href: '/products?category=belts-ties',
    children: [
      { name: 'Caps & Hats', href: '/products?category=caps-hats' },
      { name: 'Belts & Ties', href: '/products?category=belts-ties' },
    ],
  },
];

export const STORE = {
  street: 'Muindi Mbingu Street × Biashara Street',
  city: 'Nairobi CBD',
  tag: 'Muindi Mbingu × Biashara St, Nairobi',
  phoneDisplay: '0721 844 475',
  email: 'contact@elijays-mens-wear.co.ke',
  hours: [
    { day: 'Mon – Sat', time: '9:00 AM – 6:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
};

export const HOME_INTRO_CARDS = [
  {
    eyebrow: 'Category',
    title: 'Suiting',
    description: 'Two-piece and three-piece suits for the boardroom and the big day.',
    image: '/hero/hero-suits.jpg',
    link: '/suits',
  },
  {
    eyebrow: 'Category',
    title: 'Made to measure',
    description: 'Walk in on Muindi Mbingu — get sized properly before you buy.',
    image: '/hero/hero-shirts.jpg',
    link: '/contact',
  },
  {
    eyebrow: 'Category',
    title: 'Everyday casual',
    description: 'Polos, khakis, and shirts for CBD days that run long.',
    image: '/WhatsApp Image 2026-06-29 at 20.58.05 (1).jpeg',
    link: '/polo-t-shirts',
  },
];

/** Homepage product rows — one section per shop category */
export const HOME_CATEGORY_SECTIONS = [
  {
    title: 'Shirts & Polos',
    viewAllPath: '/products?category=shirts',
    match: ['shirts', 'polo', 'polo-t-shirts', 'clothing-apparel', 'formal', 'presidential'],
  },
  {
    title: 'Suiting',
    viewAllPath: '/suits',
    match: ['suits', 'suiting', 'blazers', 'two piece', 'three piece'],
  },
  {
    title: 'Trousers & Linen',
    viewAllPath: '/trousers',
    match: ['trousers', 'linen', 'khaki', 'chino', 'jeans', 'gurkha'],
  },
  {
    title: 'Outerwear',
    viewAllPath: '/products?category=jackets',
    match: ['jackets', 'outerwear', 'sweaters', 'track'],
  },
  {
    title: 'Casualwear',
    viewAllPath: '/products?category=t-shirts',
    match: ['t-shirts', 'casualwear', 'sweat', 'round-neck', 'v-neck'],
  },
  {
    title: 'Accessories',
    viewAllPath: '/products?category=belts-ties',
    match: ['belts', 'ties', 'belts-ties', 'caps', 'hats', 'accessories'],
  },
];

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
