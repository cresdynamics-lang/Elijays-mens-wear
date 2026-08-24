import { Link } from 'react-router-dom';
import { getPremiumImage } from '../../utils/productImages';
import { openWhatsAppEnquiry } from '../../lib/whatsappEnquiry';

const formatPrice = (price) => `KSh ${parseFloat(price).toLocaleString()}`;

/**
 * Product grid card — elegant menswear typography.
 * MVP CTA opens WhatsApp (cart-ready for Phase 2).
 */
const ProductCard = ({ product, showSale = true }) => {
  const listPrice = parseFloat(product.price);
  const salePrice = product.discount_price != null ? parseFloat(product.discount_price) : null;
  const price = salePrice ?? listPrice;
  const comparePrice = product.compare_at_price
    ? parseFloat(product.compare_at_price)
    : salePrice != null
      ? listPrice
      : null;
  const onSale = showSale && comparePrice != null && comparePrice > price;
  const image = product.image_url || product.thumbnail || getPremiumImage(product, { width: 500 });

  return (
    <article className="group flex flex-col min-w-0 w-full">
      <Link to={`/product/${product.slug}`} className="block min-w-0">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-elijays-ink text-[10px] font-semibold tracking-[0.12em] uppercase px-4 py-2 rounded-lg">
              Quick View
            </span>
          </div>
          {onSale && (
            <span className="absolute top-2 left-2 bg-elijays-ink text-white text-[9px] font-semibold px-2 py-1 tracking-[0.12em] uppercase font-sans rounded-md">
              Sale
            </span>
          )}
        </div>
        <h3 className="product-name text-[14px] sm:text-[15px] text-elijays-ink mb-1.5 line-clamp-2 group-hover:text-elijays-gold-dim transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap mb-2">
          <span className="product-price text-[13px] sm:text-[14px] text-elijays-ink font-medium">
            {formatPrice(price)}
          </span>
          {onSale && (
            <span className="product-price text-[11px] sm:text-[12px] text-elijays-muted line-through font-normal">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>
        <span className="inline-block text-[11px] font-medium tracking-[0.1em] uppercase text-elijays-gold border-b border-elijays-gold pb-0.5 group-hover:text-elijays-ink group-hover:border-elijays-ink transition-colors">
          View Product
        </span>
      </Link>
    </article>
  );
};

export default ProductCard;
