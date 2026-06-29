import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { getPremiumImage } from '../../utils/productImages';

const hideBrandLabel = (product) => ['polo-t-shirts', 'polos', 'knitted-polos'].includes((product.category_name || product.parent_category_name || '').toLowerCase());

const ProductCard = ({ product, onAddToCart, addedProductId }) => (
    <article className="group flex-shrink-0 w-full">
      <Link to={`/product/${product.slug}`} className="block">
         <div className="relative aspect-[4/5] bg-utility-gray overflow-hidden border border-utility-gray/50 group-hover:border-accent/30 transition-all duration-500 shadow-sm">
          <img
            src={product.image_url || getPremiumImage(product, { width: 400 })}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-4 bg-utility-gray transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-2 px-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="bg-accent text-white px-4 py-3 text-[10px] font-semibold flex items-center gap-2 hover:bg-accent/80 shadow-xl"
            >
              <ShoppingBag size={12} />
              {addedProductId === product.id ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
      <div className="pt-4 space-y-1.5">
        {!hideBrandLabel(product) && (
          <p className="text-[10px] font-semibold text-accent/70 tracking-wider uppercase">{product.brand_name}</p>
        )}
          <h3 className="text-[11px] font-serif text-secondary group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        <p className="text-accent font-light italic text-sm tracking-wide">
          KSh {parseFloat(product.price).toLocaleString()}
        </p>
      </div>
    </article>
  );

  export default ProductCard;
