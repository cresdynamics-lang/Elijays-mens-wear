import { resolveDisplayImageUrl } from '../utils/cloudinary';
import { Link } from 'react-router-dom';

export default function BlogShowcase({ blog }) {
  const fallbackImage = '/hero/hero-shirts.jpg';
  const imageUrl = resolveDisplayImageUrl(blog.featured_image_url, { width: 1200 }) || fallbackImage;
  const dateLabel = blog.published_date
    ? new Date(blog.published_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <Link to={`/journal/${blog.slug}`} className="group block min-w-0">
      <div className="aspect-[3/4] sm:aspect-[4/3] overflow-hidden bg-elijays-charcoal mb-2 sm:mb-3">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />
      </div>
      {dateLabel && (
        <p className="text-[9px] sm:text-[11px] text-elijays-gold mb-0.5 sm:mb-1">{dateLabel}</p>
      )}
      <h3 className="font-display text-[12px] sm:text-base md:text-lg text-elijays-ink group-hover:text-elijays-gold-dim transition-colors leading-snug line-clamp-2">
        {blog.title}
      </h3>
      {blog.excerpt && (
        <p className="mt-1 hidden sm:block text-sm text-elijays-ink/80 font-normal line-clamp-2 leading-relaxed">
          {blog.excerpt}
        </p>
      )}
    </Link>
  );
}
