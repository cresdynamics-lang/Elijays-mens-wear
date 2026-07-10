import { Link } from 'react-router-dom';
import ProductCard from './product/ProductCard';

/** Product grid — 2 cols mobile/tablet, 4 cols desktop. */
const ProductShowcase = ({ title = 'New arrivals', subtitle, products = [], viewAllPath = '/products', limit = 8 }) => {
  if (!products.length) return null;

  return (
    <section className="py-10 md:py-14 bg-elijays-white border-t border-elijays-ink/5">
      <div className="container mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="font-display text-[1.35rem] md:text-2xl text-elijays-ink tracking-[0.02em] font-medium">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-elijays-ink/80 mt-1.5 font-normal tracking-wide">{subtitle}</p>
            )}
          </div>
          <Link
            to={viewAllPath}
            className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase text-elijays-ink underline underline-offset-4 decoration-elijays-gold hover:text-elijays-gold-dim transition-colors shrink-0"
          >
            View all
          </Link>
        </div>

        <div className="product-grid">
          {products.slice(0, limit).map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
