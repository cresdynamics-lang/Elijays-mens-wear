/**
 * Homepage category cards — MensWorld-style image grid.
 * `image` fields use keyword-based placeholder photos (LoremFlickr) so the
 * cards look filled before real AI / Cloudinary imagery is dropped in.
 * Swap any `image` URL with your own asset (e.g. a Cloudinary URL) later.
 */

export const HOMEPAGE_CATEGORY_CARDS = [
  {
    title: 'Suits',
    subtitle: 'Tailored Presence',
    image: 'https://loremflickr.com/600/800/mens,suit?lock=21',
    link: '/suits',
  },
  {
    title: 'Formal Trousers',
    subtitle: 'Boardroom Sharp',
    image: 'https://loremflickr.com/600/800/mens,trousers,formal?lock=22',
    link: '/trousers?sub=Formal',
  },
  {
    title: 'Khakis',
    subtitle: 'Everyday Structure',
    image: 'https://loremflickr.com/600/800/mens,khaki?lock=23',
    link: '/trousers?sub=Khaki',
  },
  {
    title: 'Jeans',
    subtitle: 'Casual Denim',
    image: 'https://loremflickr.com/600/800/mens,jeans?lock=24',
    link: '/products?category=jeans',
  },
  {
    title: 'Long-sleeve Shirts',
    subtitle: 'Official & Floral',
    image: 'https://loremflickr.com/600/800/mens,shirt?lock=25',
    link: '/shirts',
  },
  {
    title: 'Polo Shirts',
    subtitle: 'Smart Casual',
    image: 'https://loremflickr.com/600/800/mens,polo?lock=26',
    link: '/shirts?sub=Polos',
  },
  {
    title: 'Sweaters',
    subtitle: 'Crew & V-Neck',
    image: 'https://loremflickr.com/600/800/mens,sweater?lock=27',
    link: '/sweaters',
  },
  {
    title: 'Jackets',
    subtitle: 'Layer Up',
    image: 'https://loremflickr.com/600/800/mens,jacket?lock=28',
    link: '/jackets',
  },
  {
    title: 'Belts & Ties',
    subtitle: 'Finishing Touch',
    image: 'https://loremflickr.com/600/800/mens,belt?lock=29',
    link: '/products?category=belts-ties',
  },
  {
    title: 'Blazers',
    subtitle: 'Sharp Shoulders',
    image: 'https://loremflickr.com/600/800/mens,blazer?lock=30',
    link: '/jackets?sub=Blazers',
  },
];
