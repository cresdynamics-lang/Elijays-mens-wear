import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BlogShowcase from '../components/BlogShowcase';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema, buildBlogPostingSchema, routeSeo } from '../seo/seoData';

const DUMMY_BLOGS = [
  {
    id: 1,
    title: 'The Art of Bespoke Tailoring: A Guide to Custom Suits',
    slug: 'the-art-of-bespoke-tailoring',
    excerpt: 'Discover the craftsmanship behind bespoke suits and why custom tailoring is the ultimate expression of personal style.',
    content: 'Bespoke tailoring represents the pinnacle of menswear craftsmanship...',
    category: 'Style Guide',
    featured_image_url: '/WhatsApp Image 2026-06-29 at 20.57.55.jpeg',
    author_name: 'ELIJAY\'S',
    published_date: '2026-06-15',
    created_at: '2026-06-15',
    updated_at: '2026-06-15'
  },
  {
    id: 2,
    title: 'Summer 2026: Essential Pieces for the Modern Gentleman',
    slug: 'summer-2026-essential-pieces',
    excerpt: 'From lightweight linens to breathable polos, explore the must-have items for your summer wardrobe.',
    content: 'Summer fashion is all about comfort without compromising style...',
    category: 'Seasonal',
    featured_image_url: '/WhatsApp Image 2026-06-29 at 20.57.56.jpeg',
    author_name: 'ELIJAY\'S',
    published_date: '2026-06-20',
    created_at: '2026-06-20',
    updated_at: '2026-06-20'
  },
  {
    id: 3,
    title: 'Building a Timeless Wardrobe: Investment Pieces Worth Every Shilling',
    slug: 'building-a-timeless-wardrobe',
    excerpt: 'Learn which clothing items are worth the investment and how to build a wardrobe that lasts for years.',
    content: 'Quality over quantity is the golden rule of menswear...',
    category: 'Style Guide',
    featured_image_url: '/WhatsApp Image 2026-06-29 at 20.57.57.jpeg',
    author_name: 'ELIJAY\'S',
    published_date: '2026-06-25',
    created_at: '2026-06-25',
    updated_at: '2026-06-25'
  }
];

const BLOGS_PER_PAGE = 9;

export default function Blog() {
  const [blogs, setBlogs] = useState(DUMMY_BLOGS);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(DUMMY_BLOGS.length);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState(['Style Guide', 'Seasonal']);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = DUMMY_BLOGS;
    
    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setBlogs(filtered);
    setTotal(filtered.length);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(total / BLOGS_PER_PAGE);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const chipClass = (active) =>
    `px-4 py-2 text-[11px] tracking-[0.06em] border transition-colors ${
      active
        ? 'bg-elijays-gold border-elijays-gold text-elijays-ink'
        : 'bg-transparent border-elijays-ink/20 text-elijays-ink/70 hover:border-elijays-gold'
    }`;

  return (
    <Layout>
      <SEO
        title={routeSeo.blog?.title || 'Journal | ELIJAY\'S Men\'s Wear'}
        description={routeSeo.blog?.description || 'Styling notes and lookbook from Elijay\'s Men\'s Wear, Nairobi.'}
        path="/journal"
        keywords={routeSeo.blog?.keywords}
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/journal' },
          ]),
          blogs[0] ? buildBlogPostingSchema(blogs[0]) : null,
        ]}
      />

      <section className="bg-elijays-black border-b border-elijays-gold">
        <div className="container mx-auto px-5 md:px-8 py-12 md:py-16 max-w-3xl">
          <p className="text-elijays-gold text-[12px] mb-3">Journal</p>
          <h1 className="font-display text-3xl md:text-4xl text-elijays-white mb-3 leading-tight">
            From the floor
          </h1>
          <p className="text-elijays-white/65 text-sm font-light leading-relaxed">
            Styling notes for Nairobi — linen in the heat, suiting for the occasion, and finishing the fit.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search journal…"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 text-sm border border-elijays-ink/15 bg-elijays-white outline-none focus:border-elijays-gold placeholder:text-elijays-ink/40"
          />

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleCategoryFilter('')} className={chipClass(!selectedCategory)}>
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryFilter(category)}
                  className={chipClass(selectedCategory === category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <p className="text-center text-elijays-ink/40 text-[11px] py-16 tracking-wider uppercase">
            Loading…
          </p>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-12">
            {blogs.map((blog) => (
              <BlogShowcase key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-elijays-ink/50 text-sm mb-4">No journal pieces yet.</p>
            {(searchQuery || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
                className="text-elijays-gold text-[12px] underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {currentPage > 1 && (
              <button type="button" onClick={() => setCurrentPage(currentPage - 1)} className="btn-gold-outline !py-2 !px-4">
                Previous
              </button>
            )}
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={chipClass(currentPage === page)}
                >
                  {page}
                </button>
              ))}
            </div>
            {currentPage < totalPages && (
              <button type="button" onClick={() => setCurrentPage(currentPage + 1)} className="btn-gold-outline !py-2 !px-4">
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
