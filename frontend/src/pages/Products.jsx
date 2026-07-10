import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useCartStore } from '../store/useCartStore';
import { getPremiumImage } from '../utils/productImages';
import { buildBreadcrumbSchema, categoryFallbackIntro, routeSeo } from '../seo/seoData';
import ProductCard from '../components/product/ProductCard';
import { SEARCH_PLACEHOLDER } from '../content/nairobiBrand';
import { DUMMY_PRODUCTS } from '../utils/dummyData';

const categoryPages = ['polo-t-shirts', 'shirts', 'suits', 'trousers', 'linen'];
const beltProductSlugs = new Set([
 'black-leather-belt-set',
 'base-brown-leather-belt-set',
]);

const isBeltCategory = (value) => {
 const normalized = String(value || '').toLowerCase();
 return normalized.includes('belt') || normalized.includes('tie');
};

const CATEGORY_DATA = [
 { id: 'All', name: 'All', sub: [] },
 { id: 'clothing-apparel', name: 'Clothing & Apparel', sub: ['Clothing & Apparel'] },
 { id: 'polo-t-shirts', name: 'Polo T-shirts', sub: ['Knitted Polos', 'Polos'] },
 { id: 'trousers', name: 'Trousers', sub: ['Khaki', 'Formal', 'Chino', 'Jeans', 'Gurkha'] },
 { id: 'shirts', name: 'Shirts', sub: ['Formal shirts', 'Casual', 'Presidential'] },
 { id: 'suits', name: 'Suits', sub: ['Two piece', 'Three piece'] },
 { id: 'blazers', name: 'Blazers', sub: ['Modern', 'Casual', 'Classic'] },
 { id: 'track-suits', name: 'Track Suits', sub: [] },
 { id: 'jackets', name: 'Jackets', sub: ['Jackets', 'Half jackets'] },
 { id: 'linen', name: 'Linen', sub: ['Linen Set', 'Linen Trousers', 'Linen shirts', 'Linen shorts'] },
 { id: 'caps-hats', name: 'Caps & Hats', sub: [] },
 { id: 'belts-ties', name: 'Belts & Ties', sub: [] },
 { id: 'sweaters', name: 'Sweaters', sub: [] },
 { id: 't-shirts', name: 'T-shirts', sub: ['Sweat-shirts', 'Round-neck T-shirts', 'V-neck T-shirts'] },
];

const normalizeName = (value) => String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const orderDatabaseCategories = (categories) => {
 const ordered = CATEGORY_DATA.slice(1)
 .map((canonical) => {
 const fromDatabase = categories.find((category) => (
 normalizeName(category.id) === normalizeName(canonical.id) ||
 normalizeName(category.name) === normalizeName(canonical.name)
 ));

 if (!fromDatabase) return null;

 const databaseSubs = fromDatabase.sub || [];
 const orderedSubs = [
 ...canonical.sub.filter((sub) => databaseSubs.some((dbSub) => normalizeName(dbSub) === normalizeName(sub))),
 ...databaseSubs.filter((dbSub) => !canonical.sub.some((sub) => normalizeName(sub) === normalizeName(dbSub))),
 ];

 return {
 id: fromDatabase.id || canonical.id,
 name: fromDatabase.name || canonical.name,
 sub: orderedSubs.length ? orderedSubs : canonical.sub,
 };
 })
 .filter(Boolean);

 return ordered.length ? [{ id: 'All', name: 'All', sub: [] }, ...ordered] : CATEGORY_DATA;
};

const matchesText = (value, target) => (value || '').toLowerCase() === (target || '').toLowerCase();

const filterCatalogueProducts = (allProducts, category, sub) => {
 const beltOnly = isBeltCategory(category);
 return allProducts.filter((product) => {
 if (beltOnly) {
 const slug = String(product.slug || '').toLowerCase();
 const name = String(product.name || '').toLowerCase();
 const categoryText = [
 product.category_slug,
 product.category_name,
 product.parent_category_slug,
 product.parent_category_name,
 product.subcategory,
 ]
 .filter(Boolean)
 .join(' ')
 .toLowerCase();
 const matchesBeltContent =
 beltProductSlugs.has(slug) ||
 /belt|tie/.test(slug) ||
 /belt|tie/.test(name) ||
 /belt|tie/.test(categoryText);

 if (!matchesBeltContent) return false;
 }

 const productCategory = product.category_slug || product.category_name;
 const parentCategory = product.parent_category_slug || product.parent_category_name;

 const matchesCategory = category === 'All' || [
 productCategory,
 parentCategory,
 product.category_name,
 product.parent_category_name,
 ].some((value) => matchesText(value, category));

 const matchesSub = sub === 'All' || [
 productCategory,
 product.category_name,
 product.subcategory,
 ].some((value) => matchesText(value, sub));

 return matchesCategory && matchesSub;
 });
};

const Products = ({ categoryOverride = null }) => {
 const [searchParams, setSearchParams] = useSearchParams();
 const navigate = useNavigate();
 const addToCart = useCartStore((state) => state.addToCart);

 const [dynamicCategories, setDynamicCategories] = useState([]);
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [stockFilter, setStockFilter] = useState('all');
 const [addedProductId, setAddedProductId] = useState(null);
 const [fetchError, setFetchError] = useState('');

 const isDedicatedCategoryPage = Boolean(categoryOverride);
 const currentCategory = categoryOverride || searchParams.get('category') || 'All';
 const currentSub = searchParams.get('sub') || 'All';

  useEffect(() => {
 const fetchData = async () => {
 setLoading(true);
 setFetchError('');
 const params = {};
 if (currentCategory !== 'All') params.category = currentCategory;
 if (currentSub !== 'All') params.sub = currentSub;

 // Use dummy data directly instead of API calls
 let fetchedProducts = DUMMY_PRODUCTS;
 
 // Filter by category
 if (currentCategory !== 'All') {
   fetchedProducts = fetchedProducts.filter(p => 
     p.category_name === currentCategory || 
     p.category_name.toLowerCase() === currentCategory.toLowerCase()
   );
 }
 
 // Filter by subcategory
 if (currentSub !== 'All') {
   fetchedProducts = fetchedProducts.filter(p => 
     p.subcategory === currentSub || 
     p.subcategory.toLowerCase() === currentSub.toLowerCase()
   );
 }
 
 setProducts(fetchedProducts);
 setLoading(false);
 window.scrollTo(0, 0);
 };
 fetchData();
 }, [currentCategory, currentSub]);

 const allCategoryData = dynamicCategories.length ? orderDatabaseCategories(dynamicCategories) : CATEGORY_DATA;

 const selectedCategory = allCategoryData.find(c => c.id === currentCategory || c.name.toLowerCase() === currentCategory.toLowerCase());
 const seo = routeSeo[currentCategory] || routeSeo.products;
 const intro = seo.introCopy
 ? { title: seo.introTitle, copy: seo.introCopy }
 : categoryFallbackIntro;
 const subCategoryList = currentCategory === 'All'
 ? [...new Set(allCategoryData.flatMap((category) => category.sub || []))]
 : selectedCategory?.sub || [];

 const setFilter = (cat, sub = 'All') => {
 const params = {};

 if (cat === 'All') {
 if (sub !== 'All') params.sub = sub;
 navigate(`/products${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`);
 return;
 }

 if (sub !== 'All') params.sub = sub;

 if (categoryPages.includes(cat)) {
 navigate(`/${cat}${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`);
 return;
 }

 params.category = cat;
 if (sub !== 'All') params.sub = sub;
 setSearchParams(params);
 };

 const handleQuickAdd = async (product) => {
 const needsSize = ['shoes', 'shirts', 'trousers', 'suits', 'tracksuits', 'jackets', 'linen', 't-shirts', 'polo-t-shirts'].includes((product.category_name || '').toLowerCase());

 if (needsSize) {
 navigate(`/product/${product.slug}`);
 } else {
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
 }
 };

 const filteredProducts = products.filter((product) => {
 const matchesSearch =
 product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 (product.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase());

 if (!matchesSearch) return false;
 if (stockFilter === 'in_stock' && product.out_of_stock) return false;
 if (stockFilter === 'out_of_stock' && !product.out_of_stock) return false;
 return true;
 });

 const categoryHeading =
 currentCategory === 'All'
 ? 'Shop'
 : selectedCategory?.name || currentCategory;

 const chipClass = (active) =>
 `shrink-0 px-4 py-2 text-[11px] tracking-[0.06em] border transition-colors ${
 active
 ? 'bg-elijays-gold border-elijays-gold text-elijays-ink'
 : 'bg-transparent border-elijays-ink/20 text-elijays-ink/70 hover:border-elijays-gold hover:text-elijays-gold'
 }`;

 return (
 <div className="bg-elijays-white min-h-screen">
 <SEO
 {...seo}
 schema={[
 buildBreadcrumbSchema([
 { name: 'Home', path: '/' },
 { name: currentCategory === 'All' ? 'Shop' : selectedCategory?.name || 'Shop', path: seo.path },
 ]),
 ]}
 />
 <Navbar />

 <main className="pb-20">
 <div className="bg-elijays-black border-b border-elijays-gold">
 <div className="container mx-auto px-5 md:px-8 py-10 md:py-12">
 <button
 type="button"
 onClick={() => navigate(-1)}
 className="inline-flex items-center gap-1 text-elijays-gold/80 hover:text-elijays-gold text-[12px] mb-4"
 >
 <ChevronLeft size={16} /> Back
 </button>
 <h1 className="font-display text-3xl md:text-4xl text-elijays-white tracking-tight">
 {categoryHeading}
 </h1>
 {intro.copy && (
 <p className="mt-3 max-w-2xl text-sm text-elijays-white/65 font-light leading-relaxed">
 {intro.copy}
 </p>
 )}
 </div>
 </div>

 <div className="container mx-auto px-5 md:px-8 py-8 md:py-10">
 <div className="flex flex-col gap-6 mb-10">
 {!isDedicatedCategoryPage && (
 <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
 {allCategoryData.map((cat) => (
 <button
 key={cat.id}
 type="button"
 onClick={() => setFilter(cat.id, 'All')}
 className={chipClass(
 currentCategory === cat.id ||
 currentCategory.toLowerCase() === cat.name.toLowerCase()
 )}
 >
 {cat.name}
 </button>
 ))}
 </div>
 )}

 {subCategoryList.length > 0 && (
 <div className="flex gap-2 flex-wrap items-center">
 <button
 type="button"
 onClick={() => setFilter(currentCategory, 'All')}
 className={chipClass(currentSub === 'All')}
 >
 All
 </button>
 {subCategoryList.map((sub) => (
 <button
 key={sub}
 type="button"
 onClick={() => setFilter(currentCategory, sub)}
 className={chipClass(currentSub === sub)}
 >
 {sub}
 </button>
 ))}
 </div>
 )}

 <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t border-elijays-ink/10 pt-5">
 <div className="relative w-full sm:max-w-xs">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-elijays-ink/40" size={15} />
 <input
 type="text"
 placeholder={SEARCH_PLACEHOLDER}
 className="w-full pl-10 pr-3 py-2.5 text-sm bg-elijays-white border border-elijays-ink/15 text-elijays-ink outline-none focus:border-elijays-gold placeholder:text-elijays-ink/40"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 <select
 value={stockFilter}
 onChange={(e) => setStockFilter(e.target.value)}
 className="bg-elijays-white border border-elijays-ink/15 text-[12px] text-elijays-ink/70 px-3 py-2.5 outline-none focus:border-elijays-gold"
 >
 <option value="all">All availability</option>
 <option value="in_stock">In stock only</option>
 <option value="out_of_stock">Out of stock</option>
 </select>
 </div>
 </div>

 {fetchError && (
 <p className="text-center text-red-700 text-sm py-8">{fetchError}</p>
 )}

 {loading ? (
 <p className="text-center text-elijays-ink/40 text-[11px] py-20 tracking-wider uppercase">
 Loading collection…
 </p>
 ) : (
 <div className="product-grid">
 <AnimatePresence mode="popLayout">
 {filteredProducts.map((product) => (
 <motion.div
 key={product.id}
 layout
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.96 }}
 transition={{ duration: 0.35, ease: 'easeOut' }}
 >
 <ProductCard product={product} onAddToCart={handleQuickAdd} addedProductId={addedProductId} />
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}

 {!loading && filteredProducts.length === 0 && (
 <div className="text-center py-20 space-y-4">
 <p className="text-elijays-ink/50 text-sm">No pieces in this filter.</p>
 <button
 type="button"
 onClick={() => setFilter('All')}
 className="text-[12px] text-elijays-gold underline underline-offset-4"
 >
 Clear filters
 </button>
 </div>
 )}
 </div>
 </main>

 <Footer />
 </div>
 );
};

export default Products;
