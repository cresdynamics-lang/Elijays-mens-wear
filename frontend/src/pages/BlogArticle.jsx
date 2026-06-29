import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema, buildBlogPostingSchema } from '../seo/seoData';
import { resolveDisplayImageUrl } from '../utils/cloudinary';

export default function BlogArticle() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Blog post not found');
        }

        const data = await response.json();
        setBlog(data);

        try {
          await fetch(`/api/blog/${data.id}/views`, {
            method: 'PATCH',
            credentials: 'include',
          });
        } catch {
          console.warn('Could not update views');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent/60"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-primary text-secondary px-6">
        <h1 className="text-2xl font-serif font-bold text-secondary mb-5 text-center tracking-tight">
          {error || 'Blog post not found'}
        </h1>
        <Link to="/blog" className="text-accent hover:text-accent/80 font-semibold transition-colors duration-300">
          Back to blog
        </Link>
      </div>
    );
  }

  const fallbackImage = '/WhatsApp Image 2026-05-12 at 8.07.18 PM.jpeg';
  const imageUrl = resolveDisplayImageUrl(blog.featured_image_url, { width: 1600 }) || fallbackImage;

  return (
    <div className="min-h-screen bg-primary">
      <SEO
        title={blog.title}
        description={blog.excerpt || blog.title}
        path={`/blog/${blog.slug}`}
        image={imageUrl}
        keywords={[blog.title, blog.category, "ELIJAY'S Men's Wear blog", 'menswear Kenya'].filter(Boolean)}
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: blog.title, path: `/blog/${blog.slug}` },
          ]),
          buildBlogPostingSchema(blog),
        ]}
      />

      {imageUrl && (
        <div className="relative w-full h-96 bg-utility-gray overflow-hidden">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-8">
          <Link to="/blog" className="text-accent hover:text-accent/80 text-sm font-semibold transition-colors duration-300">
            Back to blog
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-5 tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary/70">
            <time dateTime={blog.published_date}>
              {new Date(blog.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-accent/60">|</span>
            <span className="inline-block bg-accent/10 px-3.5 py-1 rounded-full border border-accent/15 text-accent text-xs font-bold tracking-wide">
              {blog.category}
            </span>
            <span className="text-accent/60">|</span>
            <span className="text-secondary/60 font-medium">{blog.views || 0} views</span>
          </div>
        </header>

        {blog.excerpt && (
          <div className="mb-10 text-lg text-secondary/80 italic border-l-2 border-accent/50 pl-5 leading-relaxed font-medium">
            {blog.excerpt}
          </div>
        )}

        <article className="max-w-none mb-14">
          <div className="text-secondary leading-[1.8] whitespace-pre-wrap text-[15px] font-medium">
            {blog.content}
          </div>
        </article>

        <div className="bg-utility-gray/40 border border-utility-gray/60 p-7 mb-10 rounded-2xl">
          <h3 className="text-base md:text-lg font-serif font-bold text-secondary mb-3 tracking-tight">
            Style note
          </h3>
          <p className="text-secondary/70 font-medium leading-relaxed">
            This article is built around the category and product imagery already on the site so the visual story matches the written one.
          </p>
        </div>

        <div className="text-center py-10 border-t border-utility-gray/60">
          <Link
            to={`/blog?category=${encodeURIComponent(blog.category)}`}
            className="btn-primary inline-block px-7 py-3 text-[10px] tracking-wider"
          >
            Explore more {blog.category} articles
          </Link>
        </div>
      </div>
    </div>
  );
}
