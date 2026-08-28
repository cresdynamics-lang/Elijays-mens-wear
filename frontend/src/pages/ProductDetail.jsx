import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, Plus, Minus, ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ProductDescription from '../components/product/ProductDescription';
import { useCartStore } from '../store/useCartStore';
import { productAPI } from '../services/api';
import { getPremiumImage } from '../utils/productImages';
import { getImageSrc, parseProductImages } from '../utils/cloudinary';
import { parseAngleImages, getDefaultAngleImage } from '../utils/angleImages';
import { buildVariantMeta, buildRichDescription, sortSizes } from '../utils/productDescription';
import { buildBreadcrumbSchema, buildProductSchema } from '../seo/seoData';
import { toCartVariantId } from '../utils/ids';
import { openWhatsAppEnquiry } from '../lib/whatsappEnquiry';
import { trackMetaViewContent } from '../lib/metaPixel';

const variantStockQty = (variant) => {
  if (!variant) return null;
  const stock = variant.stock_quantity ?? variant.stock;
  return stock == null ? null : Number(stock);
};

const isVariantAvailable = (variant) => {
  const stock = variantStockQty(variant);
  return stock == null || stock > 0;
};

function sizesForCategoryName(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('shoe')) return ['38', '39', '40', '41', '42', '43', '44', '45'];
  if (n.includes('trouser') || n.includes('pant')) return ['30', '32', '34', '36', '38'];
  if (n.includes('shirt')) return ['M', 'L', 'XL', 'XXL', '3XL'];
  if (n.includes('suit')) return ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  if (n.includes('track')) return ['M', 'L', 'XL', 'XXL'];
  if (n.includes('outer')) return ['M', 'L', 'XL', 'XXL'];
  return ['M', 'L', 'XL', 'XXL'];
}

const getVariantImage = (variant) => (
  variant?.image_url_optimized ||
  getImageSrc(variant?.image_url) ||
  variant?.image_url ||
  getImageSrc(variant?.image)
);

const getProductBaseImage = (product) => (
  product?.thumbnail_optimized ||
  getImageSrc(product?.thumbnail) ||
  getImageSrc(product?.image_url) ||
  product?.thumbnail ||
  product?.image_url
);

const buildColorImages = (variantMeta, product) => {
  const colorImages = {};
  variantMeta.colors.forEach(({ color, variants: colorVariants }) => {
    const images = [];
    colorVariants.forEach(v => {
      const img = getVariantImage(v) || getDefaultAngleImage(v, product) || getProductBaseImage(product);
      if (img && !images.includes(img)) images.push(img);
    });
    if (images.length) {
      colorImages[color] = images;
    }
  });
  return colorImages;
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [infoTab, setInfoTab] = useState('description');
  const [imageIndex, setImageIndex] = useState(0);
  const [showVariantMatrix, setShowVariantMatrix] = useState(false);

  const touchStartX = useRef(null);

  // Hooks at top level - must be unconditional
  const variantMeta = useMemo(() => {
    if (!product) return { colors: [], variants: [], isShoe: false };
    return buildVariantMeta(product.variants, product.category_name);
  }, [product]);

  const colorImages = useMemo(() => buildColorImages(variantMeta, product), [variantMeta, product]);
  const currentColorImages = useMemo(() => colorImages[selectedColor] || [], [colorImages, selectedColor]);

  const sizesForColorRef = useRef((color) => []);
  
  const sizesForColor = useCallback((color) => {
    if (!product) return [];
    const category = `${product?.category_name || ''} ${product?.parent_category_name || ''}`.toLowerCase();
    if (category.includes('belt')) return [];
    const sizes = variantMeta.variants
      .filter((v) => v.color === color)
      .map((v) => v.size);
    return sortSizes(sizes, variantMeta.isShoe);
  }, [variantMeta, product]);

  useEffect(() => {
    sizesForColorRef.current = sizesForColor;
  }, [sizesForColor]);

  const findVariant = useCallback((color, size) => (
    variantMeta.variants.find((v) => v.color === color && v.size === size)
  ), [variantMeta]);

  useEffect(() => {
    let cancelled = false;
    let mounted = true;
    const fetchProduct = async () => {
      setProduct(null);
      setSelectedColor('');
      setSelectedSize('');
      setSelectedImage('');
      setImageIndex(0);
      setLoadError('');
      setIsLoading(true);

      try {
        const res = await productAPI.getBySlug(slug);
        if (cancelled || !mounted) return;
        const p = res?.data;
        if (!p) {
          setLoadError('Product not found.');
          setIsLoading(false);
          return;
        }
        const relRes = await productAPI.related(p.id).catch(() => ({ data: [] }));
        if (cancelled || !mounted) return;
        const rel = (relRes?.data || []).filter((x) => x.id !== p.id).slice(0, 4);
        const productHero = getProductBaseImage(p) || getPremiumImage(p);

        const firstColor = p?.variants?.[0]?.color || '';
        setSelectedColor(firstColor);
        const sizes = sizesForColorRef.current(firstColor);
        setSelectedSize(sizes[0] || '');

        setSelectedImage(productHero);
        setProduct(p);
        setRelated(rel);
        trackMetaViewContent(p);
      } catch (err) {
        if (cancelled || !mounted) return;
        setLoadError('Product not found.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProduct();
    return () => { cancelled = true; mounted = false; };
  }, [slug]);

  // Early returns - AFTER hooks
  if (isLoading) {
    return (
      <Layout>
        <main className="min-h-screen bg-primary">
          <div className="container mx-auto px-5 md:px-8 max-w-7xl pt-6 md:pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-6">
                <div className="aspect-square bg-primary/30 animate-pulse border border-utility-gray/50" />
                {Array.from({length: 5}).map((_, i) => (
                  <div key={i} className="h-16 bg-primary/30 animate-pulse rounded border border-utility-gray/30" />
                ))}
              </div>
              <div className="space-y-8">
                <div className="h-8 bg-primary/30 animate-pulse rounded w-1/2" />
                <div className="h-10 bg-primary/30 animate-pulse rounded w-1/3" />
                <div className="h-6 bg-primary/30 animate-pulse rounded w-1/4" />
                <div className="space-y-4">
                  <div className="h-8 bg-primary/30 animate-pulse rounded w-1/4" />
                  <div className="h-8 bg-primary/30 animate-pulse rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (loadError) {
    return (
      <Layout>
        <main className="min-h-screen pt-32 text-center text-secondary bg-primary">
          <p className="text-secondary font-medium text-sm">{loadError}</p>
          <Link to="/products" className="inline-block mt-4 text-elijays-gold/80 text-[10px] font-semibold tracking-wider hover:text-elijays-gold transition-colors">
            Back to products
          </Link>
        </main>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <main className="min-h-screen pt-32 text-center text-elijays-gold/80 bg-primary text-[10px] tracking-wider font-bold uppercase">
          Product unavailable
        </main>
      </Layout>
    );
  }

  // Product exists - safe to compute
  const isBelt = `${product.category_name || ''} ${product.parent_category_name || ''}`.toLowerCase().includes('belt');
  const currentVariant = (!isBelt && selectedSize && findVariant(selectedColor, selectedSize)) || (selectedColor ? variantMeta.variants.find((v) => v.color === selectedColor) : null) || variantMeta.variants[0];

  const availableSizes = isBelt ? [] : sizesForColor(selectedColor);
  const showColorPicker = variantMeta.colors.length > 1
    || (variantMeta.colors.length === 1 && variantMeta.colors[0]?.color
    && !['original', 'standard', 'default'].includes(variantMeta.colors[0].color.toLowerCase()));
  const shopOutOfStock = product.is_active === false;

  const basePrice = parseFloat(product.price);
  const saleBase = product.discount_price ? parseFloat(product.discount_price) : null;
  const modifier = currentVariant ? parseFloat(currentVariant.price_modifier) : 0;
  const displayPrice = (saleBase ?? basePrice) + modifier;
  const compareAtPrice = saleBase != null ? basePrice + modifier : null;

  const variantSummary = [selectedColor, isBelt ? '' : selectedSize].filter(Boolean).join(' / ');

  const parsedColorList = variantMeta.colors.map((c) => c.color);
  const allSizes = sortSizes(
    variantMeta.variants.map((v) => v.size),
    variantMeta.isShoe
  );
  const sizeLine = variantMeta.isShoe
    ? `EU ${allSizes[0]} – ${allSizes[allSizes.length - 1]}`
    : allSizes.join(' · ');
  const parsedSizes = isBelt ? [] : [sizeLine];

  const buildPayload = () => ({
    productId: product.id,
    variantId: toCartVariantId(currentVariant?.id),
    quantity,
    sizeLabel: selectedSize,
    colorLabel: selectedColor,
    name: product.name,
    price: displayPrice,
    image: currentDisplayImage,
    slug: product.slug,
    brandName: product.brand_name,
    variantValue: variantSummary,
  );

  const currentDisplayImage = currentColorImages[imageIndex] || selectedImage || getProductBaseImage(product) || getPremiumImage(product);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setImageIndex(0);
    const sizes = sizesForColor(color);
    const inStockSizes = sizes.filter((s) => isVariantAvailable(findVariant(color, s)));
    const keepSize = inStockSizes.includes(selectedSize) ? selectedSize : null;
    const nextSize = isBelt ? '' : (keepSize || inStockSizes[0] || sizes[0] || '');
    setSelectedSize(nextSize);
    setImageIndex(0);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handlePrevImage = () => setImageIndex(i => (i - 1 + currentColorImages.length) % currentColorImages.length);
  const handleNextImage = () => setImageIndex(i => (i + 1) % currentColorImages.length);

  const handleAddToCart = async () => {
    if (!product || shopOutOfStock) return;
    await addToCart(buildPayload());
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = async () => {
    if (!product || shopOutOfStock) return;
    await addToCart(buildPayload());
    navigate('/checkout');
  };

  return (
    <Layout>
      <SEO
        title={`${product.name} Kenya`}
        description={`Shop ${product.name} at ELIJAY'S Kenya. Discover premium styling, curated detail and Nairobi delivery for luxury wardrobes. Order today.`}
        path={`/product/${product.slug}`}
        type="product"
        image={currentDisplayImage}
        keywords={[product.name, product.brand_name, product.category_name, 'luxury fashion Kenya'].filter(Boolean)}
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: product.category_name || 'Products', path: '/products' },
            { name: product.name, path: `/product/${product.slug}` },
          ]),
          buildProductSchema(product, currentDisplayImage, displayPrice),
        ]}
      />
      <main className="pb-24 bg-primary">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl pt-6 md:pt-10">
          <div className="flex items-center space-x-2 mb-8">
            <button type="button" onClick={() => navigate(-1)} className="text-elijays-gold hover:text-elijays-gold-dim transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[12px] text-elijays-ink/50">Back</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-6">
              <div className="relative aspect-square bg-primary overflow-hidden border border-utility-gray/50 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentDisplayImage}
                    src={currentDisplayImage}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-contain p-6 md:p-10"
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0]?.clientX ?? null;
                    }}
                    onTouchEnd={(e) => {
                      if (currentColorImages.length <= 1 || touchStartX.current == null) return;
                      const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
                      if (Math.abs(delta) < 40) return;
                      if (delta < 0) handleNextImage();
                      else handlePrevImage();
                      touchStartX.current = null;
                    }}
                  />
                </AnimatePresence>

                {currentColorImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-primary/70 text-secondary/70 border border-utility-gray opacity-0 group-hover:opacity-100 md:opacity-100 transition-all duration-300 hover:bg-primary/90 hover:text-secondary hover:border-white/15"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-primary/70 text-secondary/70 border border-utility-gray opacity-0 group-hover:opacity-100 md:opacity-100 transition-all duration-300 hover:bg-primary/90 hover:text-secondary hover:border-white/15"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-6">
                      {currentColorImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setImageIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            index === imageIndex ? 'w-6 bg-elijays-gold' : 'w-1.5 bg-utility-gray/20 hover:bg-elijays-gold/40'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-primary/80 text-[10px] font-semibold text-elijays-gold/80 border border-utility-gray">
                      {selectedColor}
                    </span>
                  </>
                )}
              </div>

              {currentColorImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-1 snap-x snap-mandatory">
                  {currentColorImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      className={`relative shrink-0 snap-start rounded-md overflow-hidden bg-primary border transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20 ${
                        index === imageIndex
                          ? 'border-elijays-gold/50 shadow-lg shadow-elijays-gold/10'
                          : 'border-utility-gray/50 hover:border-elijays-gold/25'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-1"
                      />
                      {index === imageIndex && (
                        <span className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-elijays-gold text-white">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8 lg:pt-2">
              <div className="space-y-4">
                {product.brand_name && (
                  <p className="text-[10px] font-bold tracking-[0.28em] text-elijays-gold uppercase">{product.brand_name}</p>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] text-elijays-ink leading-[1.15] font-display">{product.name}</h1>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="text-2xl md:text-3xl text-elijays-gold tracking-tight font-semibold">
                    KSh {displayPrice.toLocaleString()}
                  </p>
                  {compareAtPrice != null && compareAtPrice > displayPrice && (
                    <p className="text-xl md:text-2xl text-secondary/60 line-through font-normal">
                      KSh {compareAtPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                {variantSummary && (
                  <p className="text-sm text-secondary/80 font-medium tracking-wide">
                    {variantSummary}
                  </p>
                )}
              </div>

              {showColorPicker && (
                <div className="space-y-3">
                  <h3 className="text-[11px] tracking-[0.14em] font-medium text-elijays-ink uppercase">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {variantMeta.colors.map(({ color, variants: colorVariants }) => {
                      const isSelected = selectedColor === color;
                      const colorAvailable = colorVariants.some(isVariantAvailable);
                      return (
                        <button
                          key={color}
                          type="button"
                          disabled={!colorAvailable}
                          onClick={() => handleColorSelect(color)}
                          className={`px-4 py-2 rounded-full border text-[11px] font-medium tracking-wide transition-all duration-300 ${
                            !colorAvailable
                              ? 'opacity-35 cursor-not-allowed border-utility-gray text-elijays-ink/40'
                              : isSelected
                                ? 'border-elijays-gold bg-elijays-gold text-elijays-ink'
                                : 'border-elijays-ink/20 text-elijays-ink hover:border-elijays-gold'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] tracking-[0.14em] font-medium text-elijays-ink uppercase">
                      Size
                    </h3>
                    <button type="button" className="text-[11px] text-elijays-gold hover:text-elijays-gold-dim transition-colors">
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const variantForSize = findVariant(selectedColor, size);
                      const stock = variantStockQty(variantForSize);
                      const isOutOfStock = stock != null && stock <= 0;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleSizeSelect(size)}
                          title={isOutOfStock ? 'Unavailable' : undefined}
                          className={`min-w-[2.75rem] h-10 px-3 flex items-center justify-center text-[12px] border transition-colors ${
                            isOutOfStock
                              ? 'opacity-30 cursor-not-allowed line-through border-elijays-ink/15 text-elijays-ink/40'
                              : selectedSize === size
                                ? 'bg-elijays-gold border-elijays-gold text-elijays-ink'
                                : 'bg-transparent text-elijays-ink border-elijays-ink/20 hover:border-elijays-gold'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-utility-gray px-3 py-2.5 bg-primary rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-secondary/50 hover:text-elijays-gold transition-colors duration-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-5 text-[11px] font-semibold text-secondary w-10 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-secondary/50 hover:text-elijays-gold transition-colors duration-200"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => openWhatsAppEnquiry(product)}
                    disabled={shopOutOfStock}
                    className="flex-1 py-4 px-5 text-[10px] font-semibold tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2.5 border border-elijays-gold text-elijays-ink bg-primary hover:bg-elijays-gold disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    <MessageCircle size={13} />
                    <span>Enquire on WhatsApp</span>
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={shopOutOfStock}
                  className={`w-full py-4 px-6 text-[10px] tracking-[0.18em] disabled:opacity-35 disabled:cursor-not-allowed border transition-all flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-elijays-gold border-elijays-gold text-elijays-ink'
                      : 'border-elijays-ink/20 text-elijays-ink hover:border-elijays-gold'
                  }`}
                >
                  <ShoppingBag size={13} />
                  <span>{addedToCart ? 'Saved to bag' : 'Add to bag'}</span>
                </motion.button>

                <p className="text-[11px] text-[#5c5c5c] text-center font-light">
                  Prefer to feel the fabric? Book a fitting on Muindi Mbingu — or enquire on WhatsApp for size and stock.
                </p>

                <AnimatePresence>
                  {addedToCart && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] text-elijays-gold font-semibold text-center tracking-wide"
                    >
                      Added to your bag. Checkout can follow — or enquire on WhatsApp.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-8 border-t border-utility-gray/30">
                <div className="flex gap-6 border-b border-utility-gray/30 mb-6">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'details', label: 'Details' },
                    { id: 'shipping', label: 'Shipping & Returns' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInfoTab(tab.id)}
                      className={`pb-3 text-[11px] tracking-[0.14em] uppercase font-medium transition-colors ${
                        infoTab === tab.id
                          ? 'text-elijays-gold border-b-2 border-elijays-gold'
                          : 'text-elijays-ink/50 hover:text-elijays-ink'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {infoTab === 'description' && (
                  <ProductDescription
                    productName={product.name}
                    brandName={product.brand_name}
                    description={product.description}
                    parsedColors={parsedColorList}
                    parsedSizes={parsedSizes}
                    isShoe={variantMeta.isShoe}
                    keyFeatures={product.key_features}
                  />
                )}

                {infoTab === 'details' && (
                  <div className="text-sm text-elijays-ink/70 space-y-3 leading-relaxed">
                    <p>
                      <span className="font-semibold text-elijays-ink">Category:</span>{' '}
                      {[product.parent_category_name, product.category_name].filter(Boolean).join(' › ') || '—'}
                    </p>
                    {product.brand_name && (
                      <p>
                        <span className="font-semibold text-elijays-ink">Brand:</span> {product.brand_name}
                      </p>
                    )}
                    {parsedColorList.length > 0 && (
                      <p>
                        <span className="font-semibold text-elijays-ink">Available colours:</span>{' '}
                        {parsedColorList.join(', ')}
                      </p>
                    )}
                    {parsedSizes.length > 0 && (
                      <p>
                        <span className="font-semibold text-elijays-ink">Available sizes:</span>{' '}
                        {parsedSizes.join(', ')}
                      </p>
                    )}
                    {product.key_features?.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1">
                        {product.key_features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {infoTab === 'shipping' && (
                  <div className="text-sm text-elijays-ink/70 space-y-3 leading-relaxed">
                    <p>
                      <span className="font-semibold text-elijays-ink">Delivery:</span> Cash on delivery
                      and M-Pesa available nationwide. Nairobi CBD orders can be collected in-store on
                      Muindi Mbingu Street × Biashara Street.
                    </p>
                    <p>
                      <span className="font-semibold text-elijays-ink">Returns:</span> Unworn items with
                      tags may be exchanged within 7 days. Made-to-measure pieces are final sale.
                    </p>
                    <p>
                      <span className="font-semibold text-elijays-ink">Need a fitting?</span> Book a
                      consultation on WhatsApp before you buy — we&apos;ll size you properly.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {variantMeta.colors.length > 1 && (
              <div className="mt-16 pt-12 border-t border-utility-gray/30">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-xl md:text-2xl text-elijays-ink">All variants</h2>
                  <button
                    type="button"
                    onClick={() => setShowVariantMatrix(!showVariantMatrix)}
                    className="text-[11px] text-elijays-gold hover:text-elijays-gold-dim transition-colors flex items-center gap-1"
                  >
                    {showVariantMatrix ? 'Hide' : 'Show'} all variants
                    {showVariantMatrix ? <X size={12} /> : <Plus size={12} />}
                  </button>
                </div>

                {showVariantMatrix && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-elijays-ink/80">
                      <thead>
                        <tr className="border-b border-utility-gray/30 text-left text-[10px] uppercase tracking-wider text-elijays-ink/50">
                          <th className="pb-3 pr-4">Color</th>
                          <th className="pb-3 pr-4">Size</th>
                          <th className="pb-3 pr-4">Price</th>
                          <th className="pb-3 pr-4">Stock</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantMeta.colors.flatMap(({ color, variants: colorVariants }) =>
                          colorVariants.map((v) => {
                            const stock = variantStockQty(v);
                            const inStock = stock == null || stock > 0;
                            const variantPrice = displayPrice;
                            return (
                              <tr key={v.id} className="border-b border-utility-gray/20 hover:bg-primary/30 transition-colors">
                                <td className="py-3 pr-4 font-medium">{color}</td>
                                <td className="py-3 pr-4">{v.size || '—'}</td>
                                <td className="py-3 pr-4">KSh {variantPrice.toLocaleString()}</td>
                                <td className="py-3 pr-4">{stock != null ? stock : '—'}</td>
                                <td className="py-3">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                                    inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {inStock ? 'In stock' : 'Out of stock'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {related.length > 0 && (
              <div className="mt-20 pt-12 border-t border-elijays-ink/10">
                <h2 className="font-display text-xl md:text-2xl text-elijays-ink mb-8">You may also like</h2>
                <div className="product-grid grid grid-cols-2 md:grid-cols-4 gap-6">
                  {related.slice(0, 4).map((p) => (
                    <Link to={`/product/${p.slug}`} key={p.id} className="group block">
                      <div className="aspect-square bg-elijays-white overflow-hidden mb-3 border border-elijays-ink/8">
                        <img
                          src={getPremiumImage(p)}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-elijays-ink line-clamp-2 group-hover:text-elijays-gold-dim transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-sm text-elijays-gold mt-1">
                        KSh {parseFloat(p.discount_price || p.price).toLocaleString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProductDetail;