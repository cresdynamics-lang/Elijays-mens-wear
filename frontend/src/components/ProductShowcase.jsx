import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './product/ProductCard';

/** Horizontal scroll row of product cards for the home page. */
const ProductShowcase = ({
  title = 'New arrivals',
  subtitle,
  products = [],
  viewAllPath = '/products',
  limit = 12,
  bannerImage,
}) => {
  const scrollerRef = useRef(null);

  if (!products.length) return null;

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('.product-scroll-card');
    const step = card ? card.getBoundingClientRect().width + 16 : 280;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container mx-auto px-5 md:px-8">
        {bannerImage && (
          <div className="relative w-full h-[200px] md:h-[280px] rounded-xl overflow-hidden mb-8">
            <img
              src={bannerImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-[11px] tracking-[0.2em] uppercase font-medium mb-2">Exclusive Collection</p>
                <h2 className="font-display text-white text-2xl md:text-3xl font-medium tracking-[0.02em]">
                  {title.toUpperCase()}
                </h2>
              </div>
            </div>
          </div>
        )}
        {!bannerImage && (
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="font-display text-[1.35rem] md:text-2xl text-elijays-ink tracking-[0.02em] font-medium">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-elijays-muted mt-1.5 font-normal tracking-wide">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Scroll ${title} left`}
                  onClick={() => scrollByCard(-1)}
                  className="h-9 w-9 rounded-lg border border-elijays-ink/10 text-elijays-ink hover:border-elijays-gold hover:text-elijays-gold transition-colors inline-flex items-center justify-center"
                >
                  <i className="fa-solid fa-chevron-left text-[11px]" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Scroll ${title} right`}
                  onClick={() => scrollByCard(1)}
                  className="h-9 w-9 rounded-lg border border-elijays-ink/10 text-elijays-ink hover:border-elijays-gold hover:text-elijays-gold transition-colors inline-flex items-center justify-center"
                >
                  <i className="fa-solid fa-chevron-right text-[11px]" aria-hidden />
                </button>
              </div>
              <Link
                to={viewAllPath}
                className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase text-elijays-ink underline underline-offset-4 decoration-elijays-gold hover:text-elijays-gold transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className="product-scroll-row flex gap-3 sm:gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-3 px-5 md:px-8 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
      >
        {products.slice(0, limit).map((product) => (
          <div
            key={product.id || product.slug}
            className="product-scroll-card snap-start shrink-0 w-[42vw] min-w-[9.5rem] max-w-[11.5rem] sm:w-[11.5rem] sm:max-w-none md:w-[13.5rem]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
