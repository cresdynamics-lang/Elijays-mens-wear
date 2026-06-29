import { resolveDisplayImageUrl } from '../utils/cloudinary';
import { Link } from 'react-router-dom';

export default function BlogShowcase({ blog }) {
  const fallbackImage = '/WhatsApp Image 2026-05-12 at 8.07.18 PM.jpeg';
  const imageUrl = resolveDisplayImageUrl(blog.featured_image_url, { width: 1200 }) || fallbackImage;

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block rounded-xl overflow-hidden bg-utility-gray/40 border border-utility-gray/60 hover:border-accent/40 transition-all duration-500"
    >
      <div className="relative w-full h-52 bg-utility-gray overflow-hidden">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />
        <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-all duration-500" />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between text-[9px] tracking-[0.22em] font-semibold text-accent/80 uppercase">
          <span>{blog.category}</span>
          <span>{new Date(blog.published_date).toLocaleDateString()}</span>
        </div>
        <h3 className="text-lg md:text-xl font-serif font-semibold text-secondary line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-300">
          {blog.title}
        </h3>
        <p className="text-sm text-secondary/70 line-clamp-2 leading-relaxed font-light">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-end text-[10px] tracking-[0.18em] uppercase text-accent/70 group-hover:text-accent transition-colors duration-300">
          <span>Read story</span>
        </div>
      </div>
    </Link>
  );
}
