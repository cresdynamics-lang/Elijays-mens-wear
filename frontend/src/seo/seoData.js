export const SITE_URL = 'https://elijays.co.ke';
export const SITE_NAME = "ELIJAY'S Men's Wear";
export const DEFAULT_IMAGE = `${SITE_URL}/elijays-logo.png`;
export const CONTACT_PHONE = '+254700000000';
export const CONTACT_EMAIL = 'contact@elijays.co.ke';
export const SOCIAL_INSTAGRAM = 'https://www.instagram.com/elijaysmenswear/';
export const SOCIAL_FACEBOOK = 'https://www.facebook.com/elijaysmenswear';

export const routeSeo = {
  home: {
    title: "Luxury Menswear Kenya | ELIJAY'S Men's Wear",
    description: "Shop curated luxury menswear in Kenya at ELIJAY'S. Suits, shirts, trousers, jackets and accessories with Nairobi delivery. Explore now.",
    path: '/',
    keywords: [
      'luxury menswear Kenya',
      'premium clothing Nairobi',
      'designer suits Kenya',
      'mens fashion Nairobi',
      'elijays mens wear',
    ],
  },
  products: {
    title: "Designer Clothing Kenya | ELIJAY'S Men's Wear",
    description: "Browse premium clothing and accessories at ELIJAY'S. Curated luxury fashion for discerning Kenyan wardrobes. Shop the edit.",
    path: '/products',
    keywords: ['designer clothing Kenya', 'premium fashion Kenya', 'luxury clothing Nairobi'],
  },
  'polo-t-shirts': {
    title: "Luxury Polo Shirts Kenya | ELIJAY'S Men's Wear",
    description: 'Shop luxury polo shirts in Kenya, from refined knitted polos to elegant casual pieces curated for modern Nairobi style.',
    path: '/polo-t-shirts',
    introTitle: 'Luxury Polo Shirts Kenya',
    introCopy: "Explore luxury polo shirts in Kenya curated for the man who values ease without losing polish. ELIJAY'S selects premium polos and knitted styles that move comfortably from business lunches to relaxed weekend occasions.",
  },
  shirts: {
    title: "Premium Shirts Kenya | ELIJAY'S Men's Wear",
    description: 'Shop premium shirts in Kenya, from formal shirts to refined casual designs selected for discerning Nairobi style.',
    path: '/shirts',
    introTitle: 'Premium Shirts Kenya',
    introCopy: "Discover premium shirts in Kenya for refined days, important evenings and every occasion that deserves precision. ELIJAY'S brings together formal shirts, casual shirts and statement pieces with a sharp eye for fit, fabric and finish.",
  },
  suits: {
    title: "Luxury Suits Nairobi | ELIJAY'S Men's Wear",
    description: 'Find luxury suits in Nairobi for weddings, business and formal occasions. Shop curated two piece and three piece tailoring today.',
    path: '/suits',
    introTitle: 'Luxury Suits Nairobi',
    introCopy: "ELIJAY'S curates luxury suits in Nairobi for men who understand the power of presence. Explore two piece and three piece tailoring selected for clean lines, elevated fabrics and formal confidence.",
  },
  trousers: {
    title: "Premium Trousers Kenya | ELIJAY'S Men's Wear",
    description: 'Shop premium trousers in Kenya, including chinos, formal trousers and refined casual fits for polished everyday style.',
    path: '/trousers',
    introTitle: 'Premium Trousers Kenya',
    introCopy: "Refine your wardrobe with premium trousers in Kenya chosen for fit, movement and understated style. ELIJAY'S offers chinos, formal trousers, khakis and elevated casual cuts for intentional everyday dressing.",
  },
  linen: {
    title: "Luxury Linen Kenya | ELIJAY'S Men's Wear",
    description: 'Shop luxury linen in Kenya for warm weather elegance, from linen shirts to relaxed sets curated for refined Nairobi style.',
    path: '/linen',
    introTitle: 'Luxury Linen Kenya',
    introCopy: "Luxury linen in Kenya belongs in a wardrobe built for climate, comfort and effortless polish. ELIJAY'S curates linen shirts, sets, trousers and shorts with relaxed sophistication suited to Nairobi weekends and warm weather events.",
  },
  blog: {
    title: "ELIJAY'S Style Journal",
    description: "Read styling notes, wardrobe guides and fashion editorial from ELIJAY'S. Practical style advice for premium menswear in Kenya.",
    path: '/blog',
    keywords: ['fashion blog Kenya', 'menswear style tips', 'wardrobe guide Nairobi', 'elijays blog'],
  },
};

export const categoryFallbackIntro = {
  title: "Men's Luxury Fashion",
  copy: "Browse men's luxury fashion in Kenya curated for elegant, modern dressing. ELIJAY'S brings together premium clothing and polished accessories for customers who value detail, confidence and timeless style.",
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
  mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  articleSection: post.category || 'Style',
});
