export const SITE_URL = 'https://elijays-mens-wear.co.ke';
export const SITE_NAME = "ELIJAY'S Men's Wear";
export const DEFAULT_IMAGE = `${SITE_URL}/elijays-logo.png`;
export const CONTACT_PHONE = '+254721844475';
export const CONTACT_EMAIL = 'contact@elijays-mens-wear.co.ke';
export const SOCIAL_INSTAGRAM = 'https://www.instagram.com/elijaysmenswear/';
export const SOCIAL_FACEBOOK = 'https://www.facebook.com/elijaysmenswear';

export const routeSeo = {
  home: {
    title: "ELIJAY'S Men's Wear | Muindi Mbingu × Biashara St, Nairobi",
    description:
      "Luxury menswear on Muindi Mbingu Street, Nairobi CBD. Suits, shirts, trousers, polos and accessories — walk in for a fitting or enquire on WhatsApp.",
    path: '/',
    keywords: [
      'mens suits Nairobi',
      'menswear Muindi Mbingu',
      'Biashara Street menswear',
      'wedding suits Kenya',
      'official shirts Nairobi',
      'elijays mens wear',
      'elijays-mens-wear.co.ke',
      'tailored suits Nairobi CBD',
    ],
  },
  products: {
    title: "Shop | ELIJAY'S Men's Wear Nairobi",
    description:
      "Browse suits, shirts, trousers, polos, jackets and belts from our Muindi Mbingu shop floor. Enquire on WhatsApp for size and stock.",
    path: '/products',
    keywords: ['menswear Nairobi', 'suits Nairobi CBD', 'men fashion Nairobi', 'khaki trousers Kenya'],
  },
  'polo-t-shirts': {
    title: "Luxury Polo Shirts Kenya | ELIJAY'S Men's Wear",
    description: 'Shop luxury polo shirts in Kenya, from refined knitted polos to elegant casual pieces curated for modern Nairobi style.',
    path: '/polo-t-shirts',
    introTitle: 'Luxury Polo Shirts Kenya',
    introCopy: "Polos that work from Westlands lunch to a Saturday in Karen. ELIJAY'S stocks knitted and classic polos Nairobi men actually wear — clean fit, proper fabric, no nonsense.",
  },
  shirts: {
    title: "Premium Shirts Kenya | ELIJAY'S Men's Wear",
    description: 'Shop premium shirts in Kenya, from formal shirts to refined casual designs selected for discerning Nairobi style.',
    path: '/shirts',
    introTitle: 'Premium Shirts Kenya',
    introCopy: "Official shirts for the office, floral for the weekend, crisp cotton for Sunday church. ELIJAY'S shirts are chosen for fit and presence — the way Nairobi men like to look sharp.",
  },
  suits: {
    title: "Luxury Suits Nairobi | ELIJAY'S Men's Wear",
    description: 'Find luxury suits in Nairobi for weddings, business and formal occasions. Shop curated two piece and three piece tailoring today.',
    path: '/suits',
    introTitle: 'Luxury Suits Nairobi',
    introCopy: "Two-piece and three-piece suits for weddings, ruracio, boardrooms and big days. ELIJAY'S suits are cut for the Nairobi man who wants to look proper without trying too hard.",
  },
  trousers: {
    title: "Premium Trousers Kenya | ELIJAY'S Men's Wear",
    description: 'Shop premium trousers in Kenya, including chinos, formal trousers and refined casual fits for polished everyday style.',
    path: '/trousers',
    introTitle: 'Premium Trousers Kenya',
    introCopy: "Khakis, official trousers and smart casual cuts for daily Nairobi life. Fitted where it matters, comfortable for the commute — from CBD to dinner.",
  },
  linen: {
    title: "Luxury Linen Kenya | ELIJAY'S Men's Wear",
    description: 'Shop luxury linen in Kenya for warm weather elegance, from linen shirts to relaxed sets curated for refined Nairobi style.',
    path: '/linen',
    introTitle: 'Luxury Linen Kenya',
    introCopy: "Luxury linen in Kenya belongs in a wardrobe built for climate, comfort and effortless polish. ELIJAY'S curates linen shirts, sets, trousers and shorts with relaxed sophistication suited to Nairobi weekends and warm weather events.",
  },
  blog: {
    title: "Journal | ELIJAY'S Men's Wear Nairobi",
    description:
      "Styling notes and lookbook from ELIJAY'S Men's Wear — linen in Nairobi heat, suiting for the occasion, and finishing the fit.",
    path: '/journal',
    keywords: [
      'elijays mens wear journal',
      'menswear style tips Nairobi',
      'wardrobe guide Kenya',
      'elijays-mens-wear.co.ke',
    ],
  },
};

export const categoryFallbackIntro = {
  title: "Nairobi Men's Fashion",
  copy: "Suits, shirts, trousers, polos, jackets, belts and ties — stocked for how Nairobi men actually dress. Office, church, wedding, or Friday night. Search by category or walk into the shop.",
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  sameAs: [SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: SITE_NAME,
  image: DEFAULT_IMAGE,
  url: SITE_URL,
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  priceRange: 'KSh',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "ELIJAY'S Men's Wear",
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2921,
    longitude: 36.8219,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/products?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const buildProductSchema = (product, image, price) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: image ? [image.startsWith('http') ? image : `${SITE_URL}${image}`] : [DEFAULT_IMAGE],
  description: product.description || `Luxury ${product.name} from ELIJAY'S Kenya.`,
  sku: String(product.sku || product.slug || product.name),
  brand: {
    '@type': 'Brand',
    name: product.brand_name || product.brand || SITE_NAME,
  },
  offers: {
    '@type': 'Offer',
    url: `${SITE_URL}/product/${product.slug}`,
    priceCurrency: 'KES',
    price: String(price || product.price || ''),
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '24',
  },
});

export const buildBlogPostingSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt || post.title,
  image: post.featured_image_url ? [post.featured_image_url] : [DEFAULT_IMAGE],
  datePublished: post.published_date || post.created_at,
  dateModified: post.updated_at || post.published_date || post.created_at,
  author: {
    '@type': 'Person',
    name: post.author_name || SITE_NAME,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_IMAGE,
    },
  },
  mainEntityOfPage: `${SITE_URL}/journal/${post.slug}`,
  articleSection: post.category || 'Style',
});
