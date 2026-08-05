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
        <div className="relative aspect-square bg-elijays-white overflow-hidden mb-3 border border-elijays-ink/5">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-2.5 sm:p-4 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {onSale && (
            <span className="absolute top-2 left-2 border border-elijays-gold bg-elijays-white text-elijays-ink text-[9px] font-medium px-1.5 py-0.5 tracking-[0.14em] uppercase font-sans rounded-md">
              Sale
            </span>
          )}
        </div>
        <h3 className="product-name text-[15px] sm:text-[17px] text-elijays-ink mb-1.5 line-clamp-2 group-hover:text-elijays-gold-dim transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <span className="product-price text-[13px] sm:text-[14px] text-elijays-gold">
            {formatPrice(price)}
          </span>
          {onSale && (
            <span className="product-price text-[11px] sm:text-[12px] text-[#999] line-through font-normal">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => openWhatsAppEnquiry(product)}
        className="mt-auto w-full border border-elijays-gold text-elijays-ink bg-transparent py-2.5 text-[10px] font-medium tracking-[0.16em] uppercase font-sans transition-colors duration-300 hover:bg-elijays-gold rounded-xl"
      >
        Add to bag
      </button>
    </article>
  );
};

export default ProductCard;
