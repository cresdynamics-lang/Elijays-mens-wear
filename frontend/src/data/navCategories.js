/** Nav parents + subcategory filters — driven by catalogueTree */

import {
  buildNavParents,
  buildHomeCategorySections,
  productMatchesCategory,
} from './catalogueTree';

export { productMatchesCategory };

export const NAV_PARENTS = buildNavParents();

export const STORE = {
  street: 'Muindi Mbingu Street × Biashara Street',
  city: 'Nairobi CBD',
  tag: 'Muindi Mbingu × Biashara St, Nairobi',
  phoneDisplay: '0708 269 209',
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
    link: '/shirts?sub=Polos',
  },
];

export const HOME_CATEGORY_SECTIONS = buildHomeCategorySections();
