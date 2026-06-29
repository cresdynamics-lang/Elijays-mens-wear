import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { getPremiumImage } from '../utils/productImages';
import ProductCard from './product/ProductCard';

const needsSizeSelection = (product) =>
  ['shirts', 'trousers', 'suits', 'tracksuits', 'jackets', 'linen', 't-shirts', 'polo-t-shirts']
    .includes((product.category_name || product.parent_category_name || '').toLowerCase());


const ProductShowcase = ({ categoryRows = [] }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const [addedProductId, setAddedProductId] = useState(null);

  const handleAddToCart = async (product) => {
    if (needsSizeSelection(product)) {
      navigate(`/product/${product.slug}`);
      return;
    }
    await addToCart({
      productId: product.id,
      variantId: null,
      quantity: 1,
      sizeLabel: '',
      name: product.name,
      price: parseFloat(product.price),
      image: getPremiumImage(product),
      slug: product.slug,
      brandName: product.brand_name,
    });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1400);
  };

  if (!categoryRows.length) return null;

  return (
    <section className="py-20 md:py-24 bg-primary">
      <div className="container mx-auto px-6 space-y-14">
        {categoryRows.map((row) => (
          <div key={row.slug}>
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-secondary tracking-tight">
                {row.title}
              </h2>
              <Link
                to={row.path || '/products'}
                className="text-accent text-xs font-semibold tracking-widest flex items-center gap-3 hover:gap-4 transition-all shrink-0 group"
              >
                VIEW ALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 -mx-2 px-2 custom-scrollbar snap-x snap-mandatory scroll-smooth">
              {row.products.map((product) => (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    addedProductId={addedProductId}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6 flex justify-center">
          <Link
            to="/products"
            className="btn-primary inline-flex items-center space-x-4 group"
          >
            <span>View All Products</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

