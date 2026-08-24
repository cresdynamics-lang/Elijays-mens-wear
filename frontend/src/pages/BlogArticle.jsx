import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
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
          throw new Error('Article not found');
        }

        const data = await response.json();
        setBlog(data);

        try {
          await fetch(`/api/blog/${data.id}/views`, {
            method: 'PATCH',
            credentials: 'include',
          });
        } catch {
          /* views optional */
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-elijays-ink/40 text-[11px] py-24 tracking-wider uppercase">Loading…</p>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="container mx-auto px-5 py-20 text-center">
          <h1 className="font-display text-2xl text-elijays-ink mb-4">{error || 'Article not found'}</h1>
          <Link to="/journal" className="text-elijays-gold underline underline-offset-4 text-sm">
            Back to Journal
          </Link>
        </div>
      </Layout>
    );
  }

  const fallbackImage = '/hero/hero-shirts.jpg';
  const imageUrl = resolveDisplayImageUrl(blog.featured_image_url, { width: 1600 }) || fallbackImage;

  return (
    <Layout>
      <SEO
        title={blog.title}
        description={blog.excerpt || blog.title}
        path={`/journal/${blog.slug}`}
        image={imageUrl}
        keywords={[blog.title, blog.category, "ELIJAY'S Men's Wear", 'menswear Nairobi'].filter(Boolean)}
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/journal' },
            { name: blog.title, path: `/journal/${blog.slug}` },
          ]),
          buildBlogPostingSchema(blog),
        ]}
      />

      {imageUrl && (
        <div className="relative w-full h-[42vh] md:h-[52vh] bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = fallbackImage; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      <article className="container mx-auto px-5 md:px-8 max-w-3xl py-10 md:py-14">
        <Link to="/journal" className="text-[12px] text-elijays-gold hover:text-elijays-gold-dim">
          ← Journal
        </Link>

        <header className="mt-6 mb-8">
          <p className="text-[11px] text-elijays-gold mb-2">
            {new Date(blog.published_date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {blog.category ? ` · ${blog.category}` : ''}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-elijays-ink leading-tight">
            {blog.title}
          </h1>
        </header>

        {blog.excerpt && (
          <p className="text-lg text-[#5c5c5c] font-light leading-relaxed mb-8 border-l-2 border-elijays-gold pl-4">
            {blog.excerpt}
          </p>
        )}

        <div className="text-elijays-ink/85 leading-[1.8] whitespace-pre-wrap text-[15px] font-light">
          {blog.content}
        </div>

        <div className="mt-12 pt-8 border-t border-elijays-ink/10 text-center">
          <Link to="/journal" className="btn-gold-outline">
            More from the Journal
          </Link>
        </div>
      </article>
    </Layout>
  );
}
