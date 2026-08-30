import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPremiumImage } from '../../utils/productImages';
import { openWhatsAppEnquiry } from '../../lib/whatsappEnquiry';
import { useCartStore } from '../../store/useCartStore';
import { displayName } from '../../utils/productDescription';

const formatPrice = (price) => `KSh ${parseFloat(price).toLocaleString()}`;

/**
 * Product grid card — image, name, price, and two CTAs:
 * Add to Cart (cart store) and WhatsApp Order (enquiry).
 * Hovering the image cycles through the product's other color variants.
 */
const ProductCard = ({ product, showSale = true }) => {
  const [hoverIndex, setHoverIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const listPrice = parseFloat(product.price);
  const salePrice = product.discount_price != null ? parseFloat(product.discount_price) : null;
  const price = salePrice ?? listPrice;
  const comparePrice = product.compare_at_price
    ? parseFloat(product.compare_at_price)
    : salePrice != null
      ? listPrice
      : null;
  const onSale = showSale && comparePrice != null && comparePrice > price;
  const baseImage = product.image_url || product.thumbnail || getPremiumImage(product, { width: 500 });
  const colorImages = Array.isArray(product.color_images)
    ? product.color_images.filter((img) => img && img !== baseImage)
    : [];
  const displayImage = hovering && colorImages.length > 0
    ? colorImages[hoverIndex % colorImages.length]
    : baseImage;
  const addToCart = useCartStore((s) => s.addToCart);

  const handleHoverEnter = () => {
    if (colorImages.length === 0) return;
    setHovering(true);
    setHoverIndex(0);
  };

  const handleHoverLeave = () => {
    setHovering(false);
    setHoverIndex(0);
  };

  useEffect(() => {
    if (!hovering || colorImages.length <= 1) return;
    const t = setInterval(() => setHoverIndex((i) => (i + 1) % colorImages.length), 900);
    return () => clearInterval(t);
  }, [hovering, colorImages.length]);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: baseImage,
        slug: product.slug,
        quantity: 1,
      });
    } catch (err) {
      // Not purchasable (e.g. demo item) — send to the product page.
      window.location.href = `/product/${product.slug}`;
    }
  };

  return (
    <article className="group flex flex-col min-w-0 w-full">
      <Link to={`/product/${product.slug}`} className="block min-w-0"
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        onFocus={handleHoverEnter}
        onBlur={handleHoverLeave}
      >
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {onSale && (
            <span className="absolute top-2 left-2 bg-elijays-ink text-white text-[9px] font-semibold px-2 py-1 tracking-[0.12em] uppercase font-sans rounded-md">
              Sale
            </span>
          )}
        </div>
        <h3 className="product-name text-[14px] sm:text-[15px] text-elijays-ink mb-1.5 line-clamp-2 group-hover:text-elijays-gold-dim transition-colors">
          {displayName(product.name)}
        </h3>
      </Link>

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

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-gold !px-2 !py-2.5 text-[10px] tracking-[0.08em]"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => openWhatsAppEnquiry(product)}
          className="btn-gold-outline !px-2 !py-2.5 text-[10px] tracking-[0.08em]"
        >
          WhatsApp
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
