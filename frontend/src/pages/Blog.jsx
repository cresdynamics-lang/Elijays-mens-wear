import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogShowcase from '../components/BlogShowcase';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema, buildBlogPostingSchema, routeSeo } from '../seo/seoData';

const BLOGS_PER_PAGE = 9;

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: BLOGS_PER_PAGE,
          ...(selectedCategory && { category: selectedCategory }),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await fetch(`/api/blog?${params}`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data.posts);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog?limit=1000', {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        const uniqueCategories = [...new Set(data.posts.map((blog) => blog.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const totalPages = Math.ceil(total / BLOGS_PER_PAGE);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-primary text-secondary">
      <SEO
        title={routeSeo.blog.title}
        description={routeSeo.blog.description}
        path={routeSeo.blog.path}
        keywords={routeSeo.blog.keywords}
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
          blogs[0] ? buildBlogPostingSchema(blogs[0]) : null,
        ]}
      />

      <section className="relative border-b border-utility-gray/50 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/WhatsApp Image 2026-05-12 at 8.07.18 PM.jpeg")' }}
        />
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl space-y-4">
            <span className="text-accent/80 text-[9px] tracking-[0.35em] font-semibold uppercase">
              ELIJAY'S Style Journal
            </span>
            <h1 className="text-3xl md:text-4xl font-serif leading-tight text-secondary tracking-tight">
              Style notes, wardrobe ideas, and editorial stories from the brand
            </h1>
            <p className="text-secondary/70 text-sm md:text-base max-w-3xl leading-relaxed font-light">
              A tighter, more useful blog built around the products, categories, and styling language already on the site.
            </p>
            <div className="pt-3">
              <Link
                to="/"
                className="inline-flex items-center text-accent/80 text-[9px] font-semibold tracking-[0.25em] uppercase hover:text-accent transition-colors duration-300"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-14">
        <div className="mb-10 space-y-4">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="input-sleek w-full px-4 py-3 text-sm placeholder:text-secondary/40"
          />

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !selectedCategory
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent/60"></div>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
            {blogs.map((blog) => (
              <BlogShowcase key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-14">
            <p className="text-lg text-secondary/60 mb-5 font-light">No blog posts found.</p>
            {searchQuery || selectedCategory ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
                className="text-accent/80 hover:text-accent font-medium transition-colors duration-300"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="btn-primary px-4 py-2.5 text-xs tracking-wider rounded-xl"
              >
                Previous
              </button>
            )}

            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="btn-primary px-4 py-2.5 text-xs tracking-wider rounded-xl"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
