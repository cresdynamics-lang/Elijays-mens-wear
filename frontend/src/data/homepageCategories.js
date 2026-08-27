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
    image: '/suits.png',
    link: '/suits',
  },
  {
    title: 'Formal Trousers',
    subtitle: 'Boardroom Sharp',
    image: '/formal-trousers.png',
    link: '/trousers?sub=Formal',
  },
  {
    title: 'Khakis',
    subtitle: 'Everyday Structure',
    image: '/khakitrouser.png',
    link: '/trousers?sub=Khaki',
  },
  {
    title: 'Jeans',
    subtitle: 'Casual Denim',
    image: '/jeans.png',
    link: '/products?category=jeans',
  },
  {
    title: 'Long-sleeve Shirts',
    subtitle: 'Official & Floral',
    image: '/formalshits.png',
    link: '/shirts',
  },
  {
    title: 'Polo Shirts',
    subtitle: 'Smart Casual',
    image: '/sweatshirtpolo.jpeg',
    link: '/shirts?sub=Polos',
  },
  {
    title: 'Sweaters',
    subtitle: 'Crew & V-Neck',
    image: '/sweaters.png',
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
    image: '/belt-001.jpeg',
    link: '/products?category=belts-ties',
  },
  {
    title: 'Blazers',
    subtitle: 'Sharp Shoulders',
    image: '/blazers.png',
    link: '/jackets?sub=Blazers',
  },
];
